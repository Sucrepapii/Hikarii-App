# Connecting Stripe to Hikarii 💳

To make functionality real, you need to connect your **Stripe Account** by adding API keys to your environment files.

## 1. Get Your Stripe Keys

1.  Log in to the [Stripe Dashboard](https://dashboard.stripe.com/login).
2.  Go to **Developers** > **API keys**.
3.  Copy the **Publishable key** (starts with `pk_test_...`).
4.  Copy the **Secret key** (starts with `sk_test_...`).

## 2. Create the Pro Product

1.  Go to **Products** > **Add Product**.
2.  Name: **Hikarii Pro**.
3.  Price: **$8.99** / **Recurring** / **Monthly**.
4.  Save and copy the **API ID** for the price (starts with `price_...`).

## 3. Configure Frontend (`.env`)

Open the `.env` file in the **root** folder (`task-budget-app/.env`) and add:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_API_URL=http://localhost:5000
```

## 4. Configure Backend (`server/.env`)

Open the `.env` file in the **server** folder (`task-budget-app/server/.env`) and add:

```env
# Stripe Secrets
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_... (We will generate this next)
STRIPE_PRO_PRICE_ID=price_your_price_id_here

# App URLs
CLIENT_URL=http://localhost:5173
```

## 5. Local Webhook Testing (Optional but Recommended)

To test that subscriptions actually update the user status locally:

1.  Install the [Stripe CLI](https://stripe.com/docs/stripe-cli).
2.  Login: `stripe login`
3.  Listen: `stripe listen --forward-to localhost:5000/api/stripe/webhook`
4.  Copy the **Webhook Signing Secret** (starts with `whsec_`) from the CLI output.
5.  Paste it into `server/.env` as `STRIPE_WEBHOOK_SECRET`.

---

### ✅ Checklist

- [ ] Added `VITE_STRIPE_PUBLISHABLE_KEY` to frontend `.env`
- [ ] Added `STRIPE_SECRET_KEY` & `STRIPE_PRO_PRICE_ID` to backend `.env`
- [ ] Restarted both servers (`npm run dev`) to load new variables.

Once done, clicking "Upgrade to Pro" should take you to a real Stripe Checkout page!

## 6. Deployment (Railway / Vercel) 🚀

**Critical:** Local `.env` files are **NOT** uploaded to production. You must verify these variables in your deployment dashboard.

### 1. Railway (Backend)

Go to your project settings in Railway and add these variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_PRO_PRICE_ID`
- `STRIPE_PRO_YEARLY_PRICE_ID`
- `RESEND_API_KEY`
- `CLIENT_URL` (Set to your production frontend URL, e.g., `https://Hikarii-app.vercel.app`)

### 2. Vercel (Frontend)

Go to your project settings in Vercel and add:

- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_API_URL` (Set to your production backend URL, e.g., `https://Hikarii-server.up.railway.app`)
