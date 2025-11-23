# Portfolio Setup Guide

## Email Configuration

### Email Service: Resend
Your portfolio is configured to send contact form emails via **Resend**.

**Current Configuration:**
- **Admin Email:** `shadowcyber2004@gmail.com`
- **API Key:** Configured in edge function `send-contact-email`
- **From Email:** `onboarding@resend.dev` (Resend test email)

**To change these settings:**
1. Update the email function in Supabase:
   - Go to Supabase Dashboard → Edge Functions → `send-contact-email`
   - Update the `adminEmail` and `resendApiKey` variables

### How Email Works
1. User submits the contact form on your portfolio
2. The `send-contact-email` edge function is triggered
3. Email is sent to `shadowcyber2004@gmail.com` via Resend
4. Email includes: sender's name, email, and full message

---

## File Storage Configuration

### Storage Location: Edge Function Temporary Storage
Messages are stored in **`/tmp/messages.json`** on Supabase Edge Functions server.

**Storage Structure:**
```json
[
  {
    "id": "timestamp",
    "name": "Sender Name",
    "email": "sender@example.com",
    "message": "Message content",
    "created_at": "2024-11-23T10:30:00Z",
    "read": false
  }
]
```

### File Storage API Endpoints

#### 1. GET - Retrieve All Messages
```
GET /functions/v1/save-contact-message
Headers:
  Authorization: Bearer {SUPABASE_ANON_KEY}
  Content-Type: application/json

Response:
{
  "success": true,
  "data": [...]
}
```

#### 2. POST - Save New Message
```
POST /functions/v1/save-contact-message
Headers:
  Authorization: Bearer {SUPABASE_ANON_KEY}
  Content-Type: application/json

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}

Response:
{
  "success": true,
  "message": "Message saved successfully",
  "data": {...}
}
```

#### 3. PUT - Mark Message as Read
```
PUT /functions/v1/save-contact-message
Headers:
  Authorization: Bearer {SUPABASE_ANON_KEY}
  Content-Type: application/json

Body:
{
  "id": "message_id",
  "read": true
}

Response:
{
  "success": true,
  "message": "Message updated successfully",
  "data": {...}
}
```

#### 4. DELETE - Delete Message
```
DELETE /functions/v1/save-contact-message
Headers:
  Authorization: Bearer {SUPABASE_ANON_KEY}
  Content-Type: application/json

Body:
{
  "id": "message_id"
}

Response:
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

## Admin Dashboard Access

### How to Access
1. Navigate to: `https://yourportfolio.com/admin`
2. Enter password: `admin123`
3. View, manage, and respond to messages

### Admin Features
- **View Inbox:** See all contact messages
- **Read Status:** Automatically marks messages as read
- **Delete:** Remove unwanted messages
- **Quick Reply:**
  - Reply via Email
  - Reply via WhatsApp

### Change Admin Password
Edit `/src/pages/Admin.tsx` line 15:
```typescript
const ADMIN_PASSWORD = 'your-new-password';
```

---

## Edge Functions Deployed

### 1. `send-contact-email`
**Purpose:** Sends emails via Resend when contact form is submitted

**Status:** Active ✓
**Requires JWT:** No

**Configuration:**
- Admin Email: `shadowcyber2004@gmail.com`
- API Key: Configured
- From: `onboarding@resend.dev`

### 2. `save-contact-message`
**Purpose:** Manages message file storage (GET, POST, PUT, DELETE)

**Status:** Active ✓
**Requires JWT:** No

**Capabilities:**
- Read messages from file
- Save new messages
- Update message status
- Delete messages

---

## Project Structure

```
project/
├── src/
│   ├── App.tsx                 # Main portfolio page
│   ├── pages/
│   │   └── Admin.tsx          # Admin dashboard login
│   ├── components/
│   │   └── AdminDashboard.tsx # Admin message management
│   ├── lib/
│   │   └── supabase.ts        # Supabase client setup
│   └── index.css
├── supabase/
│   └── functions/
│       ├── send-contact-email/  # Email edge function
│       └── save-contact-message/  # File storage edge function
├── data/
│   └── messages.json          # Local messages reference
├── .env                        # Supabase configuration
└── SETUP_GUIDE.md            # This file
```

---

## Environment Variables

These are automatically configured in `.env`:

```
VITE_SUPABASE_URL=https://nfnuhgdlxnwdwnctwtvn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Testing the Setup

### Test Contact Form
1. Go to Portfolio → Contact Section
2. Fill in: Name, Email, Message
3. Click "Send Message"
4. Check your email: `shadowcyber2004@gmail.com`
5. Go to `/admin` to view stored message

### Test Admin Dashboard
1. Navigate to `/admin`
2. Enter password: `admin123`
3. View all messages in inbox
4. Click a message to view details
5. Test delete and reply functions

---

## Troubleshooting

### Messages Not Appearing in Admin
1. Check browser console for errors
2. Verify Supabase URL and API key in `.env`
3. Check edge function status in Supabase dashboard

### Email Not Sending
1. Verify `shadowcyber2004@gmail.com` is correct
2. Check Resend API key in edge function
3. Ensure contact form is being submitted
4. Check browser network tab for failed requests

### Admin Password Not Working
1. Clear browser cache
2. Verify password in `/src/pages/Admin.tsx`
3. Check sessionStorage in browser DevTools

---

## Security Notes

⚠️ **Important:**
- Default admin password `admin123` should be changed in production
- Resend API key is embedded in edge function
- Messages stored in temporary file storage (resets on server restart)
- For production: consider adding database backup

---

## Future Enhancements

Possible improvements:
- Add database backup for messages
- Implement email notifications when new messages arrive
- Add message attachments support
- Create email templates for auto-responses
- Add message search and filtering
- Implement message export (CSV, PDF)

---

## Support

For issues or questions:
1. Check Supabase Dashboard logs
2. Review edge function status
3. Verify all environment variables are set
4. Check browser developer console for errors

---

**Setup Date:** November 23, 2024
**Configuration Version:** 1.0
