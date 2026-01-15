import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
});
const docClient = DynamoDBDocumentClient.from(client);

const CUSTOMERS_TABLE = process.env.DYNAMODB_CUSTOMERS_TABLE || "table-tennis-customers";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone number if provided (Indian format: 10 digits)
    if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, ""))) {
      return NextResponse.json(
        { error: "Invalid phone number. Please enter a valid 10-digit Indian mobile number" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists by email
    const { Items } = await docClient.send(
      new ScanCommand({
        TableName: CUSTOMERS_TABLE,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
    );

    if (Items && Items.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Generate customer ID
    const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create single customer record with password (omit phone if empty to avoid GSI issues)
    const customerData: any = {
      customerId,
      email,
      name,
      password: hashedPassword,
      provider: "credentials",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Only add phone if it has a value
    if (phone) {
      customerData.phone = phone;
    }

    await docClient.send(
      new PutCommand({
        TableName: CUSTOMERS_TABLE,
        Item: customerData,
      })
    );

    return NextResponse.json(
      { 
        message: "User created successfully",
        customerId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
