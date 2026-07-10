# Resend Domain Setup Instructions

## ✅ Domain: Hikariii.org

Your application is now configured to send emails from: `noreply@Hikariii.org`

---

## 📋 Next Steps to Verify Your Domain in Resend

### 1. **Go to Resend Dashboard**

- Visit: [https://resend.com/domains](https://resend.com/domains)
- Click **"Add Domain"**

### 2. **Add Hikariii.org**

- Enter your domain: `Hikariii.org`
- Click **"Add"**

### 3. **Configure DNS Records**

Resend will provide you with DNS records to add. You'll need to add these to your domain registrar (where you bought Hikariii.org):

**Typical records you'll need to add:**

#### SPF Record (TXT)

```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all
```

#### DKIM Records (CNAME)

```
Type: CNAME
Name: resend._domainkey
Value: [provided by Resend]
```

#### MX Record (for receiving bounces)

```
Type: MX
Name: @
Priority: 10
Value: [provided by Resend]
```

### 4. **Wait for Verification**

- DNS propagation usually takes 5-15 minutes
- Resend will automatically verify once DNS is updated
- You'll see a green checkmark when verified ✅

### 5. **Update Environment Variables (Optional)**

If you want to easily switch domains (e.g., for staging), add to your `.env`:

```env
EMAIL_DOMAIN=Hikariii.org
```

---

## 🧪 Testing After Verification

Once your domain is verified:

1. **Test email sending** - try signup/password reset
2. **Emails should now send to ANY email address**, not just yours
3. **Check spam folder** initially (until domain reputation builds)

---

## ⚠️ Common Issues

### "Domain not verified"

- Wait longer (DNS can take up to 48h in rare cases)
- Check DNS records with [DNS Checker](https://dnschecker.org/)
- Ensure no typos in TXT/CNAME records

### "Still using resend.dev"

- Make sure you've rebuilt the server: `npm run build`
- Restart the server
- Check that `.env` is loaded correctly

### Emails going to spam

- This is normal for new domains
- Send more emails to build reputation
- Ask recipients to mark as "Not Spam"
- Consider adding DMARC record later

---

## 🎯 Current Configuration

**Server File:** `server/src/services/email.service.ts`

The code now uses:

```typescript
const emailDomain = process.env.EMAIL_DOMAIN || "Hikariii.org";
const fromEmail = `Hikarii <noreply@${emailDomain}>`;
```

This means:

- ✅ Default: `noreply@Hikariii.org`
- ✅ Override via `.env` if needed
- ✅ No more hardcoded `resend.dev`

---

## 📚 Additional Resources

- [Resend Domain Verification Guide](https://resend.com/docs/dashboard/domains/introduction)
- [DNS Setup for Email](https://resend.com/docs/dashboard/domains/dns-setup)
- [Email Best Practices](https://resend.com/docs/send-with-resend/best-practices)

---

**You're all set!** Once you verify the domain in Resend, your app will be able to send emails to anyone. 🚀
