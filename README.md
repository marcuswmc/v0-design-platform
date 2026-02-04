# Brand Hub - Design Management Platform

A modern and comprehensive platform for managing brand guidelines, color palettes, typography, and design assets in one place.

## 🎨 About the Project

Brand Hub is a design management platform that allows you to create and organize brand guidelines in a centralized way. Manage multiple brands, create consistent color palettes, define typographic systems, and keep all your design assets organized.

### Key Features

- 🎨 **Color Palette Management** - Create and manage unlimited palettes with hex, RGB, and HSL values
- 📝 **Typography Systems** - Define complete typographic hierarchies with fonts and sizes
- 🏢 **Multi-Brand** - Manage multiple brands and projects from a single dashboard
- 🤖 **Design Tools** - Color generator, contrast checker, and gradient creator
- 📊 **Intuitive Dashboard** - View and manage all your design assets
- 🔐 **Secure Authentication** - Complete authentication system with Supabase

## 🚀 Technologies

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- [Supabase](https://supabase.com/) account (for authentication and database)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <your-repository>
cd v0-design-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up the database:

Run the SQL script in `scripts/001_create_tables.sql` in your Supabase project to create the necessary tables.

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
v0-design-platform/
├── app/                    # Routes and pages (App Router)
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── brands/        # Brand management
│   │   ├── dashboard/     # Main dashboard
│   │   ├── feed/          # Activity feed
│   │   ├── settings/      # Settings
│   │   └── tools/         # Design tools
│   ├── auth/              # Authentication routes
│   │   ├── login/         # Login page
│   │   ├── sign-up/       # Sign up page
│   │   └── callback/      # OAuth callback
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── brands/           # Brand components
│   ├── dashboard/        # Dashboard components
│   ├── feed/             # Feed components
│   ├── tools/            # Tool components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and configurations
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # Utility functions
├── middleware.ts         # Authentication middleware
├── scripts/              # SQL scripts
└── public/               # Static files
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint linter

## 🔐 Authentication

The project uses Supabase Auth for authentication. Protected routes (`/dashboard`, `/brands`, `/feed`, `/tools`) require authentication and automatically redirect to `/auth/login` if the user is not authenticated.

### Protected Routes

- `/dashboard` - Main dashboard
- `/brands` - Brand management
- `/feed` - Activity feed
- `/tools` - Design tools

### Public Routes

- `/` - Home page
- `/auth/login` - Login page
- `/auth/sign-up` - Sign up page

## 🚀 Deployment

### Deploy to Vercel

1. Connect your repository to Vercel
2. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

Vercel will automatically detect Next.js and configure the build.

### Required Environment Variables

Make sure to configure the following environment variables in your production environment:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## 🛡️ Security

- Authentication middleware protects sensitive routes
- Session validation on all requests
- Robust error handling to prevent silent failures
- Environment variables for sensitive configurations

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For suggestions or issues, please contact the development team.

## 📞 Support

For questions or issues, check:
- Server logs for errors
- Environment variable configuration
- Supabase status
- Vercel deployment logs

---

Built with ❤️ for designers and design teams.
