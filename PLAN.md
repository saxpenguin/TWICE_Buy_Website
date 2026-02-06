<file>
00001| # Development Plan
00002| 
00003| Based on the project status analysis (Feb 2026), this plan outlines the immediate roadmap to complete the core user loops and establish administrative control.
00004| 
00005| ## Completed Foundation
00006| - [X] **[setup]** Project Setup (Next.js 16, Tailwind, Firebase)
00007| - [X] **[db]** Database Schema Design (Firestore)
00008| - [X] **[auth-1]** Set up Authentication Context and Hooks (useAuth) to manage user sessions
00009| - [X] **[auth-2]** Implement Login and Sign Up pages (using Firebase Auth)
00010| - [X] **[prod-1]** Create Product Listing Page (/products) fetching data from Firestore
00011| - [X] **[prod-2]** Create Product Details Page (/products/[id]) with "Pre-order" button
00012| - [X] **[cart-1]** Implement Shopping Cart Context (add/remove items, calculate total)
00013| - [X] **[cart-2]** Create Cart Page (/cart) to review items before checkout
00014| - [X] **[checkout-1]** Create Checkout Page to collect Shipping Address and Receiver Info
00015| - [X] **[order-1]** Implement "Create Order" functionality (Stage 1: Product Cost)
00016| 
00017| ## Phase 1: Close the User Loop (Immediate Priority)
00018| **Goal:** Ensure the user journey is complete and navigable from browsing to order history.
00019| - [X] **Task 1.1:** Create "My Orders" Page (`app/orders/page.tsx`)
00020|     - Query Firestore for `orders` where `userId == currentUser.uid`.
00021|     - Sort by `createdAt` desc.
00022|     - Display summary list linking to `/orders/[id]`.
00023| - [X] **Task 1.2:** Verify User Roles
00024|     - Verify `UserContext` correctly exposes `isAdmin` or role field.
00025| 
00026| ## Phase 2: Admin Foundation & Product Management
00027| **Goal:** Allow admins to manage the product catalog and view the dashboard.
00028| - [X] **Task 2.1:** Admin Layout & Security (`app/admin/layout.tsx`)
00029|     - Implement a layout that checks `user.role === 'ADMIN'`.
00030|     - Redirect unauthorized users to `/`.
00031| - [X] **Task 2.2:** Product List Dashboard (`app/admin/products/page.tsx`)
00032|     - Table view of all products (including CLOSED).
00033|     - Actions: Delete, Toggle Status.
00034| - [X] **Task 2.3:** Add Product Form (`app/admin/products/add/page.tsx`)
00035|     - Form for Name, Description, Price (Stage 1), Image URL, Stock.
00036| - [X] **Task 2.4:** Admin Order Management
00037|     - Create Admin Order View to update status (e.g., mark as Arrived at Warehouse).
00038|     - Implement Shipping Fee Calculator input for Admin.
00039| 
00040| ## Phase 3: Payment Integration (Stage 1)
00041| **Goal:** Replace manual ordering with real payment processing.
00042| - [ ] **Task 3.1:** Payment Request Function (Cloud Functions)
00043|     - Integration with Payment Gateway (ECPay/NewebPay placeholder or SDK).
00044|     - `onCall` function to generate payment form data.
00045| - [ ] **Task 3.2:** Payment Callback/Webhook
00046|     - HTTPS trigger to handle server-to-server notifications.
00047|     - Update order status to `PAID_PAYMENT_1`.
00048| 
00049| ## Phase 4: Logistics & Stage 2 Payment
00050| **Goal:** Handle the "Arrival at Warehouse" and shipping fee collection.
00051| - [ ] **Task 4.1:** Admin Order Management
00052|     - UI to view orders and input "Weight" or "Shipping Fee".
00053|     - Trigger status update to `PENDING_PAYMENT_2`.
00054| - [ ] **Task 4.2:** User Stage 2 Payment
00055|     - Notification to user (Email/UI).
00056|     - Checkout flow for the shipping fee.
00057| 
00058| ## Enhancements (Medium Priority)
00059| - [ ] **[notify-1]** Set up Email trigger (SendGrid or Firebase Email Extension) for "Order Confirmed"
00060| - [ ] **[notify-2]** Set up Email notification for "Stage 2 Payment Required" (Arrival notification)
00061| - [ ] **[static-1]** Create "Terms of Service" & "FAQ" pages (Must cover: refund policy, shipping risks)
00062| - [ ] **[backend-1]** Enhance Cloud Functions for secure payment processing (integration placeholder)
00063| 

(End of file - total 63 lines)
</file>