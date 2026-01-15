import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
});
const docClient = DynamoDBDocumentClient.from(client);

const CUSTOMERS_TABLE = process.env.DYNAMODB_CUSTOMERS_TABLE || "table-tennis-customers";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      httpOptions: {
        timeout: 10000,
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          // Scan to find user by email (in production, use GSI on email)
          const { Items } = await docClient.send(
            new ScanCommand({
              TableName: CUSTOMERS_TABLE,
              FilterExpression: "email = :email AND attribute_exists(password)",
              ExpressionAttributeValues: {
                ":email": credentials.email,
              },
            })
          );

          const user = Items?.[0];

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.customerId,
            email: user.email,
            name: user.name,
            phone: user.phone,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists by email
          const { Items } = await docClient.send(
            new ScanCommand({
              TableName: CUSTOMERS_TABLE,
              FilterExpression: "email = :email",
              ExpressionAttributeValues: {
                ":email": user.email,
              },
            })
          );

          if (!Items || Items.length === 0) {
            // Create new customer with cust_ ID
            const customerId = `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const timestamp = new Date().toISOString();

            console.log(`Creating new Google user: ${user.email}, customerId: ${customerId}`);

            // Create single customer record (omit phone if not provided to avoid GSI issues)
            const customerData: any = {
              customerId,
              email: user.email,
              name: user.name,
              provider: "google",
              createdAt: timestamp,
              updatedAt: timestamp,
            };

            // Only add phone if it has a value (to avoid GSI issues with empty/null)
            if (user.phone) {
              customerData.phone = user.phone;
            }

            const putResult = await docClient.send(
              new PutCommand({
                TableName: CUSTOMERS_TABLE,
                Item: customerData,
              })
            );
            console.log(`Successfully created Google user in DynamoDB:`, putResult);
          } else {
            console.log(`Existing Google user found: ${Items[0].customerId}`);
          }
        } catch (error) {
          console.error("Error in Google sign-in callback:", error);
          // Return true anyway to allow sign-in even if DB write fails
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Fetch customer ID from DynamoDB
        try {
          const { Items } = await docClient.send(
            new ScanCommand({
              TableName: CUSTOMERS_TABLE,
              FilterExpression: "email = :email",
              ExpressionAttributeValues: {
                ":email": user.email,
              },
            })
          );

          if (Items && Items.length > 0) {
            token.customerId = Items[0].customerId;
            token.phone = Items[0].phone;
          }
        } catch (error) {
          console.error("Error fetching customer ID:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.customerId = token.customerId as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
