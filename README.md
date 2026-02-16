# SessionLog

A modern web application for tracking music practice sessions, analyzing progress, and building consistent practice habits.

## Overview

SessionLog provides musicians with tools to log practice sessions, track repertoire, visualize activity patterns, and monitor progress toward practice goals. The application features comprehensive analytics, streak tracking, and customizable goal setting to help musicians maintain consistent practice routines.

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Server state management
- **Recharts** - Data visualization

### Backend & Infrastructure
- **Supabase** - PostgreSQL database, authentication, and real-time subscriptions
- **Vercel** - Deployment and hosting
- **Resend** - Transactional email delivery

## Features

### Practice Tracking
- Log practice sessions with duration, tempo, and performance metrics
- Track practice by song and specific sections
- Add notes and ratings for each session

### Analytics & Insights
- Activity heatmap showing practice consistency over time
- Daily and weekly practice statistics
- Practice distribution by song and time period
- Average session duration and tempo tracking
- Streak monitoring and achievement tracking

### Song Management
- Organize repertoire with songs and sections
- Set target tempos for progressive learning
- Track practice history per song
- View song-specific statistics and trends

### Goal Setting
- Create daily or weekly practice goals
- Monitor progress toward targets
- Visual progress indicators
- Goal history and completion tracking

### User Profiles
- Public profile pages with shareable practice stats
- Customizable username and bio
- Privacy controls for public/private profiles

## Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Supabase account
- Resend account (for email functionality)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sessionlog.git
cd sessionlog
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:

Execute the SQL migrations in `/supabase/migrations/` in your Supabase SQL editor in order:
- `001_goals.sql`
- `002_profiles.sql`
- `003_songs.sql`
- `004_song_sections.sql`
- `005_practice_sessions.sql`

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run all migrations from `/supabase/migrations/`
3. Enable Row Level Security on all tables
4. Configure authentication providers as needed

### Email Configuration

1. Create a Resend account and obtain an API key
2. Add your domain to Resend and verify DNS records
3. Configure SMTP settings in Supabase:
   - Host: `smtp.resend.com`
   - Port: `587`
   - Username: `resend`
   - Password: Your Resend API key
   - Sender: `noreply@yourdomain.com`

## Development

### Project Structure

```
/src
  /app              # Next.js App Router pages
    /(auth)         # Authentication pages
    /(app)          # Authenticated app pages
    /api            # API routes
  /components       # Shared React components
    /ui             # Base UI components
  /contexts         # React context providers
  /features         # Feature-specific components and hooks
    /analytics      # Analytics visualizations
    /dashboard      # Dashboard components
    /goals          # Goal tracking
    /sessions       # Session management
    /songs          # Song library
    /profile        # User profiles
  /lib              # Utility functions and configurations
    /supabase       # Supabase client setup
/supabase
  /migrations       # Database migrations
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Environment Variables

Ensure the following environment variables are set in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Post-Deployment

1. Update Supabase Authentication URL configuration with your production URL
2. Verify email delivery is working correctly
3. Test authentication flow end-to-end

## Security

- Row Level Security (RLS) enabled on all database tables
- Password requirements: minimum 8 characters with complexity rules
- Rate limiting on authentication attempts (5 attempts, 15-minute lockout)
- Environment variables for sensitive credentials
- Secure session management with Supabase Auth

## License

MIT
