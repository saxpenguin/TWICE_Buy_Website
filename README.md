# TWICE_Buy_Website

A Next.js-based proxy buying service for TWICE merchandise with a two-stage payment system.

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout with Navbar
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles with Tailwind
├── components/          # React components
│   └── Navbar.tsx       # Navigation bar
├── functions/           # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts    # Cloud functions
│   ├── package.json
│   └── tsconfig.json
├── lib/                 # Utility libraries
│   └── firebase.ts     # Firebase initialization
├── types/               # Shared TypeScript interfaces
│   └── index.ts        # Product, Order, and Status types
└── public/              # Static assets
```

## Key Features

### Two-Stage Payment System

Orders support a two-stage payment workflow:

1. **Stage 1 (Pre-order)**: Customer pays for the product cost (`price_stage1`)
2. **Stage 2 (Shipping)**: Customer pays for shipping (`price_stage2`) once the item arrives at the warehouse

### Order Statuses

- `Pre-order`: Initial order placed, awaiting stage 1 payment
- `Pending_Stage2`: Stage 1 paid, awaiting stage 2 payment
- `Paid`: Both stages paid
- `Shipped`: Order has been shipped
- `Delivered`: Order delivered
- `Cancelled`: Order cancelled

### Type Definitions

The `/types` directory contains shared TypeScript interfaces:

- **Product**: Merchandise with `price_stage1` and optional `price_stage2`
- **Order**: Order tracking with two-stage payment fields and status
- **OrderStatus**: Enum of possible order states

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Firebase account (for backend services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saxpenguin/TWICE_Buy_Website.git
cd TWICE_Buy_Website
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase configuration:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Functions Setup

1. Navigate to the functions directory:
```bash
cd functions
npm install
```

2. Build the functions:
```bash
npm run build
```

3. Deploy to Firebase (requires Firebase CLI):
```bash
npm run deploy
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **Type Safety**: TypeScript with strict mode

## Monorepo Structure

This project uses a monorepo structure:

- **Root**: Web application (Next.js)
- **/functions**: Firebase Cloud Functions (separate package.json)
- **/types**: Shared TypeScript types used by both web and functions

## License

ISC
