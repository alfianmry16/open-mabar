# Mabar - Queue Management for Game Streamers

A comprehensive web application for game streamers to manage their "Open Mabar" (play with viewers) queues with real-time updates, role-based access control, and multi-tenant architecture.

## 🚀 Features

- **Real-Time Queue Updates** - Powered by Supabase Realtime for instant synchronization
- **Role-Based Access** - Owner and Moderator roles with fine-grained permissions
- **Custom Game Roles** - Define categories like Mage, Fighter, Jungler for queue organization
- **Repeatable Games** - Allow players to request multiple game sessions
- **Fast Track Queue** - VIP/Priority queue for subscribers or special guests
- **Public Queue View** - Shareable link for viewers to join and monitor the queue
- **Leaderboard** - Track top players by completed matches
- **Email/Password Auth** - Secure authentication with email and password

## 🚀 Tech Stack

- **Framework:** Next.js 16 (App Router, React Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + Shadcn UI
- **Database & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Real-time:** Supabase Realtime subscriptions

## 📋 Prerequisites

- Node.js 20+ and npm
- A Supabase account ([create one here](https://supabase.com))

## ⚙️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd mabar
npm install
```

### 2. Set Up Supabase

1. Create a new project at [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run the SQL migration in the SQL Editor
5. Go to **Settings** > **API** to get your project credentials

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configure Email Authentication (Optional)

By default, Supabase requires email confirmation for new users. You can disable this for development:

1. Go to **Authentication** > **Providers** > **Email** in your Supabase dashboard
2. Toggle **"Confirm email"** to OFF (for development only)
3. For production, keep email confirmation enabled and configure your SMTP settings

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
mabar/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── callback/
│   ├── (dashboard)/         # Protected dashboard routes
│   │   └── projects/
│   ├── p/                   # Public queue views
│   ├── layout.tsx
│   └── page.tsx             # Landing page
├── components/
│   ├── auth/                # Authentication components
│   ├── ui/                  # Shadcn UI components
│   └── queue/               # Queue management components (to be created)
├── lib/
│   ├── supabase/            # Supabase clients & middleware
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── supabase/
│   └── migrations/          # Database migrations
└── middleware.ts            # Next.js middleware for auth
```

## 🗄️ Database Schema

The application uses 6 main tables:

1. **profiles** - User profiles linked to Supabase Auth
2. **projects** - Queue projects (one per stream session)
3. **project_roles** - Custom game roles/categories per project
4. **project_members** - Owner and Moderator relationships
5. **queue_entries** - The actual queue with status tracking
6. **invite_links** - Shareable invite links for moderators

All tables are protected by Row Level Security (RLS) policies ensuring proper data isolation.

## 🔐 Security

- **Row Level Security (RLS)** - All database tables have RLS policies
- **Authentication Required** - Users must log in to join queues
- **Permission Checks** - Owners and Moderators have granular permissions
- **Secure Tokens** - Invite links use cryptographically secure tokens

## 🎯 Usage

### For Streamers (Project Owners)

1. **Create a Project**

   - Navigate to `/projects` and click "New Project"
   - Fill in your game name and queue settings
   - Customize roles (Mage, Fighter, etc.)

2. **Share the Queue**

   - Share `/p/[your-project-slug]` with your viewers
   - Viewers can join the queue from this public page

3. **Manage the Queue**

   - View all registered players in real-time
   - Update player status: Waiting → Playing → Done
   - Track games played vs. requested
   - Remove players if needed

4. **Invite Moderators**
   - Generate invite links for moderators
   - Moderators can help manage the queue

### For Viewers (Players)

1. Visit the public queue URL shared by the streamer
2. Create an account or log in with your email and password
3. Select your role and join the queue
4. Watch your position update in real-time
5. See who's currently playing and the leaderboard

## 🚧 Development Roadmap

- [x] Database schema and migrations
- [x] Authentication flow with Google OAuth
- [x] Project creation and listing
- [ ] Queue management dashboard (in progress)
- [ ] Real-time queue updates
- [ ] Public queue view
- [ ] Moderator invite system
- [ ] Leaderboard and analytics
- [ ] Mobile responsive design improvements

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in this repository.

---

Built with ❤️ for streamers, by streamers.
