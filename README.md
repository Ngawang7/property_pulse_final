# Property Pulse - Real Estate Platform

A modern real estate platform built with Next.js, featuring property listings, user authentication, and a mortgage calculator.

## Features

- User authentication (Sign up, Sign in)
- Property listings (For Sale and For Rent)
- Property search and filtering
- Mortgage calculator
- Admin dashboard for property management
- User profiles
- Saved properties functionality

## Tech Stack

- Next.js 14
- React
- Prisma
- PostgreSQL (Neon)
- NextAuth.js
- Tailwind CSS

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/property-pulse.git
cd property-pulse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add:
```
DATABASE_URL="your_database_url"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Push the Prisma schema to your database:
```bash
npx prisma db push
```

2. Seed the database with initial data:
```bash
npx prisma db seed
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
