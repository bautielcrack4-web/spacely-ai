# Spacely AI - Architecture Documentation

## System Overview

Spacely AI is a Next.js 16 application using the App Router with Server-Side Rendering (SSR) for authentication and API routes.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Landing Page │  │  Login Page  │  │  Dashboard   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Middleware    │ (Cookie-based Auth)
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  API Routes    │  │  Supabase Auth  │  │ Replicate AI   │
│  /api/generate │  │  (SSR Cookies)  │  │ p-image-edit   │
│  /api/checkout │  │                 │  │                │
│  /api/webhook  │  │                 │  │                │
└───────┬────────┘  └────────┬────────┘  └───────┬────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │    Supabase     │
                    │  - PostgreSQL   │
                    │  - Storage      │
                    │  - Auth         │
                    └─────────────────┘
```

## Core Flows

### 1. Authentication Flow

```
User → Login Page → Supabase Auth UI → Auth Callback → Dashboard
                                              │
                                              ▼
                                    Create Profile (trigger)
                                    Set 10 free credits
```

**Key Files:**
- `src/app/login/page.tsx` - Login UI
- `src/app/auth/callback/route.ts` - OAuth callback handler
- `src/lib/supabase.ts` - Client initialization
- `middleware.ts` - Route protection

**Cookie-Based SSR:**
- Client: `createBrowserClient()` - stores session in cookies
- Server: `createServerClient()` - reads cookies for auth
- Middleware: Validates cookies on every request

### 2. Image Generation Flow

```
1. User uploads image in DesignTool
2. Image → base64 conversion
3. POST /api/generate
   ├─ Validate auth (getUser)
   ├─ Check credits
   ├─ Check daily limit (50/day for free)
   └─ Call Replicate API
4. Replicate processes image
5. ReadableStream → Buffer → Supabase Storage
6. Save generation record to DB
7. Deduct credit (if not PRO)
8. Return public URL
```

**Key Files:**
- `src/components/DesignTool.tsx` - UI component
- `src/app/dashboard/page.tsx` - Generation logic
- `src/app/api/generate/route.ts` - API endpoint

**Important Details:**
- Uses `prunaai/p-image-edit` model on Replicate
- Output is a ReadableStream that must be buffered
- Images stored in `generations` bucket
- Public URLs generated for client access

### 3. Credit & Subscription System

```
New User → 10 Free Credits
           ├─ Each generation: -1 credit
           ├─ Daily limit: 50 generations
           └─ 0 credits → Paywall Modal

PRO User → Unlimited Credits
          └─ No daily limit
```

**Database Schema:**
```sql
profiles:
  - id (uuid, FK to auth.users)
  - credits (int, default 10)
  - subscription_status (text, 'active' or null)
  - lemon_squeezy_customer_id (text)

generations:
  - id (uuid)
  - user_id (uuid, FK to profiles)
  - image_url (text)
  - prompt (text)
  - created_at (timestamp)
```

**Key Files:**
- `src/contexts/PaywallContext.tsx` - Paywall state
- `src/components/PaywallModal.tsx` - Upgrade UI
- `src/app/api/checkout/route.ts` - Create checkout
- `src/app/api/webhook/route.ts` - Handle subscription events

### 4. Payment Flow (Lemon Squeezy)

```
User clicks "Upgrade to PRO"
  ↓
POST /api/checkout
  ↓
Lemon Squeezy Checkout URL
  ↓
User completes payment
  ↓
Webhook → /api/webhook
  ↓
Update profile:
  - subscription_status = 'active'
  - lemon_squeezy_customer_id = customer_id
```

**Webhook Events Handled:**
- `order_created` - Initial purchase
- `subscription_created` - Subscription start
- `subscription_updated` - Plan changes
- `subscription_cancelled` - Cancellation

## Security

### Row Level Security (RLS)

**Profiles Table:**
```sql
-- Users can only read their own profile
SELECT: user_id = auth.uid()

-- Users can only update their own profile
UPDATE: user_id = auth.uid()
```

**Generations Table:**
```sql
-- Users can only read their own generations
SELECT: user_id = auth.uid()

-- Users can only insert their own generations
INSERT: user_id = auth.uid()
```

### Storage Policies

**Generations Bucket:**
- Public read access (anyone can view via URL)
- Authenticated upload only
- User can only upload to their own folder: `{user_id}/*`

## State Management

### Client State
- **LanguageContext**: Multi-language support (5 languages)
- **PaywallContext**: Paywall modal visibility
- **Local Component State**: Form inputs, loading states

### Server State
- **Supabase Auth**: User session (cookies)
- **Database**: Credits, generations, subscriptions

### Persistent State
- **localStorage**: `pendingDesign` for "try before login" flow

## API Routes

| Route | Method | Purpose | Auth Required |
|-------|--------|---------|---------------|
| `/api/generate` | POST | Generate AI design | ✅ |
| `/api/generations` | GET | Fetch user history | ✅ |
| `/api/checkout` | POST | Create payment checkout | ✅ |
| `/api/webhook` | POST | Handle payment events | ❌ (webhook secret) |

## Environment Configuration

### Development
```bash
npm run dev  # Runs on localhost:3000
```

### Production (Vercel)
- Automatic deployments on push to `main`
- Environment variables set in Vercel dashboard
- Edge runtime for API routes (fast global response)

## Performance Optimizations

1. **Image Optimization**: Next.js Image component with lazy loading
2. **Code Splitting**: Automatic with App Router
3. **SSR**: Pre-rendered pages for SEO
4. **Caching**: Supabase queries cached where appropriate
5. **Compression**: Gzip/Brotli enabled by Vercel

## Error Handling

### Client Errors
- Toast notifications via `sonner`
- User-friendly error messages
- Automatic retry for network errors

### Server Errors
- `console.error` for debugging
- Detailed error responses in development
- Generic errors in production for security

## Monitoring & Debugging

### Logs
- **Vercel Logs**: Real-time server logs
- **Browser Console**: Client-side errors
- **Supabase Logs**: Database queries and auth events

### Common Debug Points
1. Check Vercel environment variables
2. Review Supabase RLS policies
3. Verify Replicate API credits
4. Inspect cookie storage in browser

## Scalability Considerations

### Current Limits
- Replicate API: Rate limited by account tier
- Supabase: 500MB storage on free tier
- Vercel: 100GB bandwidth on hobby tier

### Future Improvements
- **Caching**: Redis for generation results
- **Queue System**: Bull/BullMQ for async processing
- **CDN**: Cloudflare for image delivery
- **Database**: Read replicas for scaling reads

## Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Supabase database migrations run
- [ ] Storage buckets created and public
- [ ] RLS policies enabled
- [ ] Lemon Squeezy webhook configured
- [ ] Domain configured (if custom)
- [ ] SSL certificate active

## Maintenance

### Regular Tasks
- Monitor Replicate API usage
- Review Supabase storage usage
- Check error logs weekly
- Update dependencies monthly

### Backup Strategy
- Supabase: Automatic daily backups
- Code: Git repository on GitHub
- Environment variables: Documented in team wiki

---

Last Updated: 2026-01-12
