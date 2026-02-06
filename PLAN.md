# Development Plan

Based on the project status analysis (Feb 2026), this plan outlines the immediate roadmap to complete the core user loops and establish administrative control.

## Completed Foundation
- [X] **[setup]** Project Setup (Next.js 16, Tailwind, Firebase)
- [X] **[db]** Database Schema Design (Firestore)
- [X] **[auth-1]** Set up Authentication Context and Hooks (useAuth) to manage user sessions
- [X] **[auth-2]** Implement Login and Sign Up pages (using Firebase Auth)
- [X] **[prod-1]** Create Product Listing Page (/products) fetching data from Firestore
- [X] **[prod-2]** Create Product Details Page (/products/[id]) with "Pre-order" button
- [X] **[cart-1]** Implement Shopping Cart Context (add/remove items, calculate total)
- [X] **[cart-2]** Create Cart Page (/cart) to review items before checkout
- [X] **[checkout-1]** Create Checkout Page to collect Shipping Address and Receiver Info
- [X] **[order-1]** Implement "Create Order" functionality (Stage 1: Product Cost)

## Phase 1: Close the User Loop (Immediate Priority)
**Goal:** Ensure the user journey is complete and navigable from browsing to order history.
- [X] **Task 1.1:** Create "My Orders" Page (`app/orders/page.tsx`)
    - Query Firestore for `orders` where `userId == currentUser.uid`.
    - Sort by `createdAt` desc.
    - Display summary list linking to `/orders/[id]`.
- [X] **Task 1.2:** Verify User Roles
    - Verify `UserContext` correctly exposes `isAdmin` or role field.

## Phase 2: Admin Foundation & Product Management
**Goal:** Allow admins to manage the product catalog and view the dashboard.
- [X] **Task 2.1:** Admin Layout & Security (`app/admin/layout.tsx`)
    - Implement a layout that checks `user.role === 'ADMIN'`.
    - Redirect unauthorized users to `/`.
- [X] **Task 2.2:** Product List Dashboard (`app/admin/products/page.tsx`)
    - Table view of all products (including CLOSED).
    - Actions: Delete, Toggle Status.
- [X] **Task 2.3:** Add Product Form (`app/admin/products/add/page.tsx`)
    - Form for Name, Description, Price (Stage 1), Image URL, Stock.
- [X] **Task 2.4:** Admin Order Management
    - Create Admin Order View to update status (e.g., mark as Arrived at Warehouse).
    - Implement Shipping Fee Calculator input for Admin.

- [X] **Task 2.5:** Admin Users Management (`app/admin/users/page.tsx`)
    - List all registered users.
    - View user details and history.
    - Manage user roles (Admin/User).

- [X] **Task 2.6:** Admin Dashboard Overview (`app/admin/page.tsx`)
    - Display key metrics (Total Orders, Total Revenue, Pending Shipments).
    - Recent Activity feed.
    - Quick links to manage products and orders.

## Phase 3: Payment Integration (Stage 1 - ECPay 綠界金流)
**Goal:** Replace manual ordering with real payment processing via ECPay.

- [ ] **Task 3.0:** ECPay Account & Secrets Setup (Pre-requisite)
    - Apply for ECPay Merchant Account (Obtain Production MerchantID, HashKey, HashIV).
    - Setup Google Cloud Secret Manager for `MerchantID`, `HashKey`, and `HashIV` (Do NOT hardcode).
        - Create secrets: `ECPAY_MERCHANT_ID`, `ECPAY_HASH_KEY`, `ECPAY_HASH_IV`.
        - Use CLI: `firebase functions:secrets:set ECPAY_HASH_KEY`.
        - Ensure Cloud Functions Service Account has "Secret Manager Secret Accessor" role.

- [X] **Task 3.1:** Payment Initialization (Cloud Functions)
    - Implement `getEcpayRequest` `onCall` function.
    - Generate `CheckMacValue` (SHA256) according to ECPay specs — strictly server-side.
    - Create a "Pending" order in Firestore with a unique `MerchantTradeNo`.

- [X] **Task 3.2:** Payment Callback / Webhook
    - Create an `onRequest` (HTTPS) trigger for `ReturnURL` (server-to-server).
    - **Security:** Re-calculate and verify incoming `CheckMacValue` from ECPay.
    - **Idempotency:** Check if order is already `PAID_PAYMENT_1` before processing.
    - **Atomicity:** Use a Firestore Transaction to update order status.
    - Return `1|OK` to ECPay to acknowledge receipt.

- [X] **Task 3.3:** Frontend Payment Redirection
    - Create a hidden form component that accepts the `onCall` response parameters.
    - Auto-submit (`form.submit()`) to redirect user to ECPay's payment gateway.
    - Handle `OrderResultURL` (client-side redirect) to show "Payment Success" page.

- [ ] **Task 3.4:** Environment Variables (Production)
    - Replace test keys in `functions/src/index.ts` with production keys for launch.
    - Use Firebase Config to manage secrets: `firebase functions:config:set ecpay.merchant_id="ID" ecpay.hash_key="Key" ecpay.hash_iv="IV"`
    - Update code to read `functions.config().ecpay` values instead of hardcoded strings.

## Phase 4: Logistics & Stage 2 Payment
**Goal:** Handle the "Arrival at Warehouse" and shipping fee collection.
- [X] **Task 4.1:** Admin Order Management
    - UI to view orders and input "Weight" or "Shipping Fee".
    - Trigger status update to `PENDING_PAYMENT_2`.


## Enhancements (Medium Priority)
- [X] **[notify-1]** Set up Email trigger (Nodemailer) for "Order Confirmed"
- [X] **[notify-2]** Set up Email notification for "Stage 2 Payment Required" & "Shipped" status
- [X] **[static-1]** Create "Terms of Service" & "FAQ" pages (Must cover: refund policy, shipping risks)
- [ ] **[backend-1]** Enhance Cloud Functions for secure payment processing (integration placeholder)
