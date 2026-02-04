# Project TODO List

## High Priority
- [X] **[auth-1]** Set up Authentication Context and Hooks (useAuth) to manage user sessions
- [ ] **[auth-2]** Implement Login and Sign Up pages (using Firebase Auth)
- [ ] **[prod-1]** Create Product Listing Page (/products) fetching data from Firestore
- [ ] **[prod-2]** Create Product Details Page (/products/[id]) with "Pre-order" button
- [ ] **[cart-1]** Implement Shopping Cart Context (add/remove items, calculate total)
- [ ] **[cart-2]** Create Cart Page (/cart) to review items before checkout
- [ ] **[checkout-1]** Create Checkout Page to collect Shipping Address and Receiver Info
- [ ] **[order-1]** Implement "Create Order" functionality (Stage 1: Product Cost)
- [ ] **[pay-1]** Integrate 3rd-party Payment Gateway (ECPay/NewebPay) API in Cloud Functions
- [ ] **[pay-2]** Handle Payment Callback (Webhook) to auto-update order status to PAID
- [ ] **[order-2]** Create "My Orders" Dashboard (/orders) to view order status and history
- [ ] **[order-3]** Implement Stage 2 Payment Flow (Shipping Cost) in frontend

## Medium Priority
- [ ] **[admin-1]** Create Admin Dashboard for managing products (Add/Edit) and updating order status
- [ ] **[admin-2]** Implement "Bulk Update" for order status (e.g., mark 50 orders as "Arrived at Warehouse")
- [ ] **[admin-3]** Create logic to input "International Shipping Fee" and trigger Stage 2 for specific orders
- [ ] **[notify-1]** Set up Email trigger (SendGrid or Firebase Email Extension) for "Order Confirmed"
- [ ] **[notify-2]** Set up Email notification for "Stage 2 Payment Required" (Arrival notification)
- [ ] **[static-1]** Create "Terms of Service" & "FAQ" pages (Must cover: refund policy, shipping risks)
- [ ] **[backend-1]** Enhance Cloud Functions for secure payment processing (integration placeholder)
