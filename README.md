# Spacely AI - AI Interior Design Platform

Transform any room in seconds with the power of AI. Upload a photo and watch as our advanced AI redesigns your space in multiple styles.

## 🚀 Features

- **Instant AI Redesign**: Upload a room photo and get professional redesigns in 1-2 seconds
- **Multiple Styles**: Choose from Modern Minimalist, Scandinavian, Industrial, and more
- **Before/After Comparison**: Interactive slider to compare original vs transformed
- **Credit System**: Free credits for new users, PRO subscription for unlimited generations
- **Multi-language**: Support for English, Spanish, Chinese, Hindi, and Arabic
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth (cookie-based SSR)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **AI Model**: Replicate (prunaai/p-image-edit)
- **Payments**: Lemon Squeezy
- **Animations**: Framer Motion
- **UI Components**: Radix UI + Custom Components

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Replicate API account
- Lemon Squeezy account (for payments)

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Replicate AI
REPLICATE_API_TOKEN=your_replicate_api_token

# Lemon Squeezy (Payments)
LEMON_SQUEEZY_API_KEY=your_lemon_squeezy_api_key
LEMON_SQUEEZY_STORE_ID=your_store_id
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
LEMON_SQUEEZY_PRODUCT_ID=your_product_id
```

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/spacely-ai.git
cd spacely-ai

# Install dependencies
npm install

# Run database migrations
# Execute supabase_fix.sql in your Supabase SQL editor

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 🗄️ Database Setup

1. Go to your Supabase project SQL Editor
2. Run the contents of `supabase_fix.sql`
3. This will create:
   - `profiles` table (user credits and subscriptions)
   - `generations` table (generation history)
   - `examples` table (gallery examples)
   - Storage buckets for images
   - Row Level Security policies
   - Necessary functions and triggers

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── generate/      # AI generation endpoint
│   │   ├── generations/   # User history endpoint
│   │   ├── checkout/      # Payment checkout
│   │   └── webhook/       # Payment webhooks
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication page
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── dashboard/        # Dashboard-specific components
│   └── ui/              # Reusable UI components
├── contexts/             # React contexts
│   ├── LanguageContext.tsx
│   └── PaywallContext.tsx
└── lib/                  # Utilities
    ├── supabase.ts       # Supabase client
    └── utils.ts          # Helper functions
```

## 🔑 Key Features Explained

### Authentication Flow
- Uses Supabase Auth with cookie-based SSR
- `createBrowserClient` for client-side
- `createServerClient` for API routes and server components
- Automatic profile creation on signup via database trigger

### Generation Flow
1. User uploads image in `DesignTool` component
2. Image converted to base64
3. Sent to `/api/generate` with prompt and style
4. Server checks auth, credits, and daily limits
5. Calls Replicate API with `prunaai/p-image-edit` model
6. Processes ReadableStream output
7. Uploads result to Supabase Storage
8. Saves generation record to database
9. Deducts credit (if not PRO)
10. Returns public URL to client

### Credit System
- Free users: 10 credits on signup
- Each generation costs 1 credit
- Daily limit: 50 generations per day (free users)
- PRO users: Unlimited generations, no daily limit

### Payment Integration
- Lemon Squeezy for subscription management
- Webhook handles subscription events
- Automatic credit reset and status updates

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

### Environment Variables in Vercel
Make sure to add all variables from `.env.local` to your Vercel project settings.

## 🐛 Common Issues

### "Unauthorized" Error
- Ensure cookies are enabled in browser
- Clear browser cache and cookies
- Log out and log back in
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel

### Generation Fails
- Verify `REPLICATE_API_TOKEN` is valid
- Check Replicate account has sufficient credits
- Review server logs in Vercel for specific error

### Images Not Loading
- Verify Supabase Storage buckets are public
- Check RLS policies allow public read access
- Ensure image URLs are using HTTPS

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- AI Model: [Pruna AI p-image-edit](https://replicate.com/prunaai/p-image-edit)
- UI Inspiration: Modern SaaS design patterns
- Icons: Lucide React

---

Built with ❤️ using Next.js and AI
