# Project TODO List

## High Priority
- [X] **[auth-1]** Set up Authentication Context and Hooks (useAuth) to manage user sessions
- [X] **[auth-2]** Implement Login and Sign Up pages (using Firebase Auth)
- [X] **[prod-1]** Create Product Listing Page (/products) fetching data from Firestore
- [X] **[prod-2]** Create Product Details Page (/products/[id]) with "Pre-order" button
- [X] **[cart-1]** Implement Shopping Cart Context (add/remove items, calculate total)
- [X] **[cart-2]** Create Cart Page (/cart) to review items before checkout
- [X] **[checkout-1]** Create Checkout Page to collect Shipping Address and Receiver Info
- [X] **[order-1]** Implement "Create Order" functionality (Stage 1: Product Cost)
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

## Admin Product Management (Phased Implementation)

### Phase 1: Foundation & Routing
- [ ] Create Admin Route: Set up the directory `app/admin/products/page.tsx` for the main dashboard.
- [ ] Design Management UI: Implement a Table or Grid view to display product details (Name, Price, Status, ID).
- [ ] Navigation: Add a "Create New Product" button that links to `/admin/products/add`.

### Phase 2: Core CRUD Functionality
- [ ] Implement "Delete": Add a delete button to each product row. Use `deleteDoc` from Firestore with a `window.confirm()` guard.
- [ ] Implement "Update/Toggle Status": Create a toggle to switch product status between ACTIVE and CLOSED using `updateDoc`.
- [ ] Create "Add Product" Form: Build a form at `app/admin/products/add/page.tsx`. Include input fields for name (string), price (number), status (select), and imageUrl (string).

### Phase 3: Security & Access Control (Crucial)
- [ ] Authentication (Auth): Integrate Firebase Auth to ensure only logged-in users can see the `/admin` path.
- [ ] Admin Role Verification: Check the user's UID or Email to restrict access to authorized admins only.
- [ ] Firestore Security Rules: Update rules in the Firebase Console to allow write operations only for authenticated admins.
- [ ] Middleware: Set up Next.js Middleware to redirect unauthorized users away from `/admin`.

### Phase 4: UX & Polish
- [ ] Loading States: Add a Spinner or Skeleton screen while fetching or updating data.
- [ ] Toast Notifications: Implement "Success" or "Error" popups after administrative actions.
- [ ] Data Revalidation: Use `router.refresh()` or `revalidatePath` to ensure the UI stays in sync with the database.
