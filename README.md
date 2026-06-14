# Artisan Handicraft Marketplace

Full-stack marketplace connecting rural artisans with buyers.

## Setup

1. Copy environment files:
   - `backend/.env.example` → `backend/.env`
   - `frontend/.env.example` → `frontend/.env`
2. Fill in your MongoDB URI and Razorpay keys.

## Install dependencies

- Backend:
  ```bash
  cd backend
  npm install
  ```
- Frontend:
  ```bash
  cd frontend
  npm install
  ```

## Run locally

- Backend:
  ```bash
  cd backend
  npm run dev
  ```
- Frontend:
  ```bash
  cd frontend
  npm run dev
  ```

## Features

- JWT auth with refresh tokens
- Buyer and vendor roles plus admin management
- Vendor onboarding with KYC status tracking
- Product catalog with search and category filters
- Cart, checkout, Razorpay payment integration
- Vendor story and artisan profile pages
- Admin panel for vendor approvals and order overview
