# Next.js Migration - Pune Table Tennis

This folder contains the Next.js version of the Table Tennis website with Server-Side Rendering (SSR).

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd web-nextjs
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
web-nextjs/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   ├── coaching/           # Coaching page
│   │   ├── equipment/          # Equipment page
│   │   ├── contact/            # Contact page
│   │   └── checkout/           # Checkout page
│   ├── components/             # Reusable components
│   │   ├── Navigation.tsx      # Main navigation
│   │   ├── Footer.tsx          # Footer
│   │   ├── CartDrawer.tsx      # Shopping cart
│   │   └── CustomizeRacket.tsx # Racket customizer
│   ├── contexts/               # React contexts
│   │   └── CartContext.tsx     # Shopping cart state
│   └── lib/                    # Utility functions
├── public/                     # Static assets
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS config
└── tsconfig.json               # TypeScript config
```

## 🔄 Migration Status

### ✅ Completed

- [x] Next.js project setup with App Router
- [x] Root layout with navigation and footer
- [x] Cart context (client-side)
- [x] Navigation component with mobile menu
- [x] Footer component
- [x] CartDrawer component
- [x] Home page
- [x] Tailwind CSS configuration
- [x] TypeScript configuration

### 📋 To Do

1. **Migrate Pages** - Convert all pages from `/web/src/pages/`:
   - Coaching page
   - Equipment page (with CustomizeRacket component)
   - Contact page
   - Product Detail page (dynamic route)
   - Checkout page
   - Order Success page

2. **Copy Assets** - Move all images from `/web/src/assets/` to `/web-nextjs/public/`

3. **Migrate Components** - Copy remaining components:
   - CustomizeRacket.tsx
   - UI components (button, card, input)
   - ImagePlaceholder.tsx

4. **Migrate Utilities** - Copy utility functions:
   - lib/utils.ts
   - lib/equipmentHelpers.ts

5. **Update Image Imports** - Change from `import` to Next.js `<Image>` component or public folder references

6. **Test All Features**:
   - Navigation and routing
   - Shopping cart functionality
   - Equipment customizer
   - Contact form
   - Checkout process

## 🎯 Key Differences from CRA

### Routing
- **Before (CRA)**: React Router with `<BrowserRouter>`, `<Route>`, `<Link from react-router-dom>`
- **After (Next.js)**: File-based routing, `<Link from next/link>`, `usePathname()` hook

### Components
- **Before**: All components are client-side by default
- **After**: Server Components by default, use `'use client'` directive for client components

### Images
- **Before**: Direct imports `import img from './image.jpg'`
- **After**: Use `next/image` component or place in `/public` folder

### Data Fetching
- **Before**: `useEffect` + fetch on client
- **After**: Server-side fetching in Server Components, or client-side with `'use client'`

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### AWS Amplify
Update amplify.yml to point to `web-nextjs` folder:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd web-nextjs
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: web-nextjs/.next
    files:
      - '**/*'
  cache:
    paths:
      - web-nextjs/node_modules/**/*
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

## 🤝 Need Help?

The migration is partially complete. To finish:

1. Run the existing CRA app to reference components
2. Copy each page one by one
3. Test thoroughly before deploying
4. Update CDK stacks to deploy Next.js app
