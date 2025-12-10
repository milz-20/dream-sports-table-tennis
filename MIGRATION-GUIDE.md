# Next.js Migration Guide - Complete Instructions

## 🎯 Migration Strategy

### Rendering Strategies:
- **Static (ISR)**: Coaching, About → Fast, rarely changes, revalidate every hour
- **SSR**: Equipment, Contact, Checkout → Dynamic content, always fresh
- **SSG with Dynamic Routes**: Product Details → Pre-render popular products

## 📋 Step-by-Step Migration

### Phase 1: Setup & Dependencies (✅ DONE)
```bash
cd c:\git\dream-sports-table-tennis\web-nextjs
npm install
```

### Phase 2: Copy Assets
```bash
# Copy all images
xcopy /E /I c:\git\dream-sports-table-tennis\web\src\assets c:\git\dream-sports-table-tennis\web-nextjs\public\assets
```

### Phase 3: Migrate Components (DO THIS NEXT)

#### 1. Copy utility components:
```bash
# Create directories
mkdir c:\git\dream-sports-table-tennis\web-nextjs\src\components\ui
mkdir c:\git\dream-sports-table-tennis\web-nextjs\src\lib

# Copy files manually or use these commands:
```

**Files to copy:**
- `web/src/components/ui/` → `web-nextjs/src/components/ui/`
- `web/src/lib/utils.ts` → `web-nextjs/src/lib/utils.ts`
- `web/src/lib/equipmentHelpers.ts` → `web-nextjs/src/lib/equipmentHelpers.ts`
- `web/src/components/CustomizeRacket.tsx` → `web-nextjs/src/components/CustomizeRacket.tsx`
- `web/src/components/ImagePlaceholder.tsx` → `web-nextjs/src/components/ImagePlaceholder.tsx`

**After copying each component:**
1. Add `'use client'` at the top if it uses hooks/interactivity
2. Change `import { Link } from 'react-router-dom'` to `import Link from 'next/link'`
3. Change image imports to use public folder: `import img from '@/assets/...'` → `src="/assets/..."`

### Phase 4: Migrate Pages

#### **Page Structure in Next.js:**
```
src/app/
├── page.tsx (Home - already done)
├── coaching/
│   ├── page.tsx (Server Component wrapper)
│   └── CoachingClient.tsx (Client Component)
├── equipment/
│   ├── page.tsx (Server Component with SSR)
│   └── [productId]/
│       └── page.tsx (Dynamic route)
├── contact/
│   └── page.tsx
├── checkout/
│   └── page.tsx
└── order-success/
    └── page.tsx
```

#### **For each page, follow this pattern:**

**Pattern A: Static/ISR Pages (Coaching, About)**
```tsx
// src/app/coaching/page.tsx
import type { Metadata } from 'next';
import CoachingClient from './CoachingClient';

export const metadata: Metadata = {
  title: 'Your Title',
  description: 'Your Description',
};

export const revalidate = 3600; // ISR - revalidate every hour

export default function CoachingPage() {
  return <CoachingClient />;
}
```

```tsx
// src/app/coaching/CoachingClient.tsx
'use client';

// Copy your entire Coaching component here
// Change Link imports to next/link
// Change image imports to use /public
export default function CoachingClient() {
  // ... your existing component code
}
```

**Pattern B: SSR Pages (Equipment, Contact, Checkout)**
```tsx
// src/app/equipment/page.tsx
import type { Metadata } from 'next';
import EquipmentClient from './EquipmentClient';

export const metadata: Metadata = {
  title: 'Your Title',
  description: 'Your Description',
};

// No revalidate = SSR on every request
export default function EquipmentPage() {
  return <EquipmentClient />;
}
```

**Pattern C: Dynamic Routes (Product Detail)**
```tsx
// src/app/equipment/[productId]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  return {
    title: `Product ${params.productId}`,
  };
}

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  return <ProductDetailClient productId={params.productId} />;
}
```

### Phase 5: Migration Checklist

#### ✅ Already Completed:
- [x] Project setup with Next.js 14
- [x] Root layout with navigation
- [x] Cart context
- [x] Navigation component
- [x] Footer component
- [x] CartDrawer component
- [x] Home page
- [x] Coaching page structure

#### 📝 To Complete (in order):

**Step 1: Copy Components**
- [ ] Copy `CustomizeRacket.tsx` (add 'use client', change Link imports)
- [ ] Copy `ImagePlaceholder.tsx`
- [ ] Copy all UI components from `components/ui/`
- [ ] Copy `lib/utils.ts` and `lib/equipmentHelpers.ts`

**Step 2: Create Client Component Files**
For each page in `web/src/pages/`, create a `[PageName]Client.tsx`:

- [ ] `CoachingClient.tsx` (copy from Coaching.tsx)
- [ ] `EquipmentClient.tsx` (copy from Equipment.tsx)
- [ ] `ContactClient.tsx` (copy from Contact.tsx)
- [ ] `CheckoutClient.tsx` (copy from Checkout.tsx)
- [ ] `ProductDetailClient.tsx` (copy from ProductDetail.tsx)
- [ ] `OrderSuccessClient.tsx` (copy from OrderSuccess.tsx)

**For each Client component:**
1. Add `'use client'` at the very top
2. Change all `react-router-dom` imports:
   ```tsx
   // Old
   import { Link, useNavigate, useParams } from 'react-router-dom';
   
   // New
   import Link from 'next/link';
   import { useRouter, usePathname } from 'next/navigation';
   import { useParams } from 'next/navigation'; // if needed
   ```
3. Update navigation:
   ```tsx
   // Old
   const navigate = useNavigate();
   navigate('/path');
   
   // New
   const router = useRouter();
   router.push('/path');
   ```
4. Update image imports:
   ```tsx
   // Old
   import myImage from '../assets/images/myImage.jpg';
   <img src={myImage} />
   
   // New
   <img src="/assets/images/myImage.jpg" />
   // OR use Next.js Image component
   import Image from 'next/image';
   <Image src="/assets/images/myImage.jpg" width={500} height={300} alt="..." />
   ```
5. Remove `useEffect` for scroll and meta tags (handled by layout)

**Step 3: Create Page Wrappers**
For each Client component, create corresponding page.tsx files following Pattern A, B, or C above.

**Step 4: Copy Assets**
```bash
xcopy /E /I c:\git\dream-sports-table-tennis\web\src\assets c:\git\dream-sports-table-tennis\web-nextjs\public\assets
```

**Step 5: Test Each Page**
```bash
npm run dev
```
Test each route:
- http://localhost:3000/
- http://localhost:3000/coaching
- http://localhost:3000/equipment
- http://localhost:3000/contact
- http://localhost:3000/checkout
- http://localhost:3000/equipment/butterfly-timo-boll-alc

### Phase 6: Deploy

#### Update CDK Stack
```typescript
// In your CDK stack
const amplifyApp = new amplify.CfnApp(this, 'TableTennisApp', {
  name: 'table-tennis-nextjs',
  buildSpec: `
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
  `
});
```

## 🔑 Key Changes Reference

### Import Changes
| Before (CRA) | After (Next.js) |
|--------------|-----------------|
| `import { Link } from 'react-router-dom'` | `import Link from 'next/link'` |
| `import { useNavigate } from 'react-router-dom'` | `import { useRouter } from 'next/navigation'` |
| `import { useParams } from 'react-router-dom'` | `import { useParams } from 'next/navigation'` |
| `import { useLocation } from 'react-router-dom'` | `import { usePathname } from 'next/navigation'` |
| `import img from './img.jpg'` | `src="/public/img.jpg"` or Next `<Image>` |

### Component Changes
| Before (CRA) | After (Next.js) |
|--------------|-----------------|
| All components client by default | Add `'use client'` for interactive components |
| `<Link to="/path">` | `<Link href="/path">` |
| `navigate('/path')` | `router.push('/path')` |
| `useEffect` for meta tags | Use `metadata` export in page.tsx |
| `window.scrollTo` in useEffect | Remove (Next.js handles this) |

## 🚀 Quick Start Commands

```bash
# Navigate to Next.js project
cd c:\git\dream-sports-table-tennis\web-nextjs

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📚 Resources

- [Next.js App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Client vs Server Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
- [Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns)

## ❓ Common Issues

**Issue: "use client" not working**
- Make sure it's the VERY first line in the file
- No comments or imports before it

**Issue: Images not loading**
- Check images are in `public/` folder
- Use `/assets/...` path (leading slash)
- Or use Next.js `<Image>` component

**Issue: Navigation not working**
- Use `<Link href="/path">` not `<Link to="/path">`
- Use `router.push()` not `navigate()`

**Issue: Build errors**
- Run `npm run build` to see detailed errors
- Check all imports are correct
- Ensure all dynamic imports use `'use client'`
