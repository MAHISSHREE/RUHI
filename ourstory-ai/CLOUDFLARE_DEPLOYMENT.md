# 🚀 CLOUDFLARE DEPLOYMENT GUIDE (FREE - No Credit Card)

## Why Cloudflare? ✅
- **Completely Free** - No credit card ever required
- **Super Fast** - Global CDN + edge computing
- **All-in-One** - Pages (frontend) + Workers (backend) + D1 (database)
- **Easy Setup** - Sign up with GitHub, deploy in minutes
- **Automatic HTTPS** - SSL/TLS included

---

## STEP 1: Set Up Cloudflare Account (2 minutes)

### 1. Go to https://dash.cloudflare.com/sign-up

**Choose one:**
- Sign up with GitHub (recommended)
- Sign up with email

**This is free - no credit card needed**

### 2. Verify email and complete setup

---

## STEP 2: Deploy Frontend to Cloudflare Pages (5 minutes)

### 1. Open https://dash.cloudflare.com/

### 2. Go to **"Pages"** section (left sidebar)

### 3. Click **"Create a project"**

### 4. Select **"Connect to Git"**
- Click "GitHub"
- Authorize Cloudflare with GitHub
- Select your `ourstory-ai` repository

### 5. Configure build settings:
```
Framework: Vite
Build command: cd frontend && npm run build
Build output directory: frontend/dist
Root directory: (leave empty)
```

### 6. Set Environment variable:
```
Name: VITE_API_BASE_URL
Value: https://ourstory-ai-api.YOUR-ACCOUNT.workers.dev/api
```
(We'll get the Workers URL in next step)

### 7. Click **"Save and Deploy"**

**Wait 2-3 minutes for build to complete**

### 8. Your frontend is now live at:
```
https://ourstory-ai.pages.dev
```

Save this URL! ⭐

---

## STEP 3: Deploy Backend to Cloudflare Workers (10 minutes)

### Prerequisites:
Install Cloudflare CLI (Wrangler):

```bash
npm install -g wrangler
```

### 1. Authenticate Wrangler:

```bash
wrangler login
```

This opens browser → Authorize → Copy JWT token → Paste in terminal

### 2. Check `wrangler.toml` in project root:

File already exists: `wrangler.toml`

**Verify it contains:**
```toml
name = "ourstory-ai-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"
```

### 3. Create D1 Database:

```bash
wrangler d1 create ourstory_db
```

This returns:
```
✅ Successfully created DB
binding = "DB"
database_name = "ourstory_db"
database_id = "your-database-id-here"
```

**Copy the `database_id`**

### 4. Update `wrangler.toml` with database ID:

Open `wrangler.toml` and update:
```toml
[[d1_databases]]
binding = "DB"
database_name = "ourstory_db"
database_id = "your-database-id-here"  # <- Paste here
```

### 5. Add your Groq API Key as secret:

```bash
wrangler secret put GROQ_API_KEY
```

Enter your API key when prompted:
```
⭐ gsk_Your_Actual_Key_Here
```

### 6. Deploy to Workers:

```bash
wrangler deploy
```

**Wait for deployment... You'll see:**
```
✨ Deployed to https://ourstory-ai-api.YOUR-ACCOUNT.workers.dev
```

**Save this URL** ⭐

---

## STEP 4: Initialize Database (2 minutes)

### Run migration to create tables:

```bash
wrangler d1 execute ourstory_db --file ./migrations/0001_init.sql
```

**Expected output:**
```
✅ Executed successfully
```

### Verify tables were created:

```bash
wrangler d1 execute ourstory_db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

**Should show:**
```
chats
memories
users
chat_sessions
chat_messages
```

---

## STEP 5: Update Frontend with Backend URL (3 minutes)

### 1. Go to Cloudflare Pages dashboard

### 2. Select your `ourstory-ai` project

### 3. Go to **"Settings"** → **"Environment variables"**

### 4. Add/Update:
```
Name: VITE_API_BASE_URL
Value: https://ourstory-ai-api.YOUR-ACCOUNT.workers.dev/api
```

Replace `YOUR-ACCOUNT` with your Cloudflare account name (from Workers URL)

### 5. Trigger rebuild:
- Go to "Deployments"
- Click "Retry" on latest deployment

**Wait 2-3 minutes for rebuild**

---

## STEP 6: Test Everything Works (5 minutes)

### Test 1: Backend Health Check

```bash
curl https://ourstory-ai-api.YOUR-ACCOUNT.workers.dev/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "service": "OurStory AI Backend",
  "timestamp": "2024-02-25T10:30:00Z"
}
```

### Test 2: Chat API

```bash
curl -X POST https://ourstory-ai-api.YOUR-ACCOUNT.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, what is 2+2?"}'
```

**Expected response:**
```json
{
  "reply": "2+2 equals 4. Simple addition!",
  "model": "llama-3.1-8b-instant",
  "timestamp": "2024-02-25T10:30:00Z"
}
```

### Test 3: Frontend in Browser

1. Open `https://ourstory-ai.pages.dev` in browser
2. You should see the OurStory AI Chat UI
3. Try typing a message
4. You should get an AI response back

---

## 🎉 YOU'RE LIVE!

Your complete app is now running for **FREE**:

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | https://ourstory-ai.pages.dev | ✅ Global CDN |
| Backend | https://ourstory-ai-api.YOUR-ACCOUNT.workers.dev | ✅ Edge Computing |
| Database | Cloudflare D1 | ✅ SQLite (Free) |

---

## 📊 Monitoring & Limits (Free Tier)

### Cloudflare Pages
- ✅ Unlimited deployments
- ✅ Unlimited bandwidth
- ✅ 500 builds/month (more than enough)
- ✅ Custom domains included

### Cloudflare Workers
- ✅ 100,000 requests/day (plenty for testing)
- ✅ 30ms CPU time per request
- ✅ Unlimited deployments

### Cloudflare D1
- ✅ Up to 5GB database size (SQLite)
- ✅ Unlimited reads
- ✅ 25,000 writes/day
- ✅ Perfect for small apps

**If you exceed free tier limits, you just get throttled - no surprise bills!**

---

## 🔧 Common Tasks

### Update frontend code:
```bash
# Make changes to code
git add .
git commit -m "Update frontend"
git push origin main
```
Pages auto-deploys from GitHub!

### Update backend code:
```bash
# Make changes to src/index.ts
wrangler deploy
```

### View backend logs:
```bash
wrangler tail
```

### Access database console:
```bash
wrangler d1 execute ourstory_db --interactive
```

---

## 🆘 Troubleshooting

### "Worker returned error status 502"
- Check worker logs: `wrangler tail`
- Verify GROQ_API_KEY is set: `wrangler secret list`
- Check Groq API is working

### "Frontend shows blank page"
- Open browser Dev Tools (F12)
- Check Console tab for errors
- Verify VITE_API_BASE_URL is correct
- Check that backend is responding

### "Database insert failed"
- Verify migration ran: `wrangler d1 execute ourstory_db --command "SELECT COUNT(*) FROM chats;"`
- Check table schema: `wrangler d1 execute ourstory_db --command ".schema"`

### "CORS errors"
- Update ALLOWED_ORIGINS in `wrangler.toml`
- Redeploy: `wrangler deploy`

---

## 🎓 Optional: Add Custom Domain

### 1. Register domain free:
- https://domains.google.com (free for 1 year)
- https://www.namecheap.com (cheap domains)

### 2. Connect to Cloudflare:
1. Go to Pages → Settings → Domain
2. Click "Add domain"
3. Follow DNS configuration
4. Wait 24 hours

---

## 📞 Helpful Links

| Service | Link |
|---------|------|
| Cloudflare Dashboard | https://dash.cloudflare.com |
| Wrangler Docs | https://developers.cloudflare.com/workers/wrangler |
| D1 Database Docs | https://developers.cloudflare.com/d1 |
| Pages Docs | https://developers.cloudflare.com/pages |
| Groq API | https://console.groq.com |

---

## ✅ FINAL CHECKLIST

- [ ] Cloudflare account created
- [ ] Frontend deployed to Pages
- [ ] Worker deployed to Workers
- [ ] D1 database created
- [ ] Database schema initialized
- [ ] GROQ_API_KEY stored as secret
- [ ] Environment variables configured
- [ ] Backend health check working
- [ ] Chat API responding
- [ ] Frontend loads and responds
- [ ] Everything is LIVE! 🚀

---

## 🔐 Security Notes

1. **API Keys**: Stored as Cloudflare Secrets (never exposed)
2. **Database**: Encrypted at rest
3. **HTTPS**: Automatic on all domains
4. **CORS**: Restricted to your domain
5. **No public database access**: All queries go through Worker

---

**Time to complete: ~30 minutes total**

🎉 **Congratulations! Your app is live with zero cost!** 🎉
