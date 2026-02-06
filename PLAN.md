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
- [ ] **Task 2.4:** Admin Order Management
    - Create Admin Order View to update status (e.g., mark as Arrived at Warehouse).
    - Implement Shipping Fee Calculator input for Admin.

## Phase 3: Payment Integration (Stage 1)
**Goal:** Replace manual ordering with real payment processing.
- [ ] **Task 3.1:** Payment Request Function (Cloud Functions)
    - Integration with Payment Gateway (ECPay/NewebPay placeholder or SDK).
    - `onCall` function to generate payment form data.
- [ ] **Task 3.2:** Payment Callback/Webhook
    - HTTPS trigger to handle server-to-server notifications.
    - Update order status to `PAID_PAYMENT_1`.

## Phase 4: Logistics & Stage 2 Payment
**Goal:** Handle the "Arrival at Warehouse" and shipping fee collection.
- [ ] **Task 4.1:** Admin Order Management
    - UI to view orders and input "Weight" or "Shipping Fee".
    - Trigger status update to `PENDING_PAYMENT_2`.
- [ ] **Task 4.2:** User Stage 2 Payment
    - Notification to user (Email/UI).
    - Checkout flow for the shipping fee.

## Enhancements (Medium Priority)
- [ ] **[notify-1]** Set up Email trigger (SendGrid or Firebase Email Extension) for "Order Confirmed"
- [ ] **[notify-2]** Set up Email notification for "Stage 2 Payment Required" (Arrival notification)
- [ ] **[static-1]** Create "Terms of Service" & "FAQ" pages (Must cover: refund policy, shipping risks)
- [ ] **[backend-1]** Enhance Cloud Functions for secure payment processing (integration placeholder)
