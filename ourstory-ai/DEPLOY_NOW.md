# 🚀 QUICK START: DEPLOY YOUR APP FOR FREE

## Choose Your Setup (Recommended)

### Best Option: Railway + Vercel + PlanetScale

---

## 🎯 5-MINUTE SETUP

### 1️⃣ Create Accounts (5 min)
- [ ] GitHub Account: https://github.com
- [ ] Railway Account: https://railway.app (GitHub login)
- [ ] Vercel Account: https://vercel.com (GitHub login)
- [ ] PlanetScale Account: https://planetscale.com

### 2️⃣ Setup Database (3 min)

**PlanetScale MySQL Setup:**
1. Create account at https://planetscale.com
2. Click "Create database"
3. Name: `ourstory_db`
4. Region: Choose closest to you
5. Get Connection String:
   - Go to "Connections"
   - Save the MySQL connection string
   - Example: `mysql://user:pass@aws.connect.psdb.cloud/ourstory_db?sslMode=VERIFY_IDENTITY`

### 3️⃣ Deploy Backend (5 min)

**Railway Deployment:**

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select `ourstory-ai` repository
5. Configure Settings:
   - Root Directory: `./backend`
   - Click "Add"
6. Go to "Variables" tab and add:

```
SPRING_DATASOURCE_URL=mysql://user:password@aws.connect.psdb.cloud/ourstory_db?sslMode=VERIFY_IDENTITY
SPRING_DATASOURCE_DRIVER=com.mysql.cj.jdbc.Driver
SPRING_DATASOURCE_USERNAME=your_planetscale_user
SPRING_DATASOURCE_PASSWORD=your_planetscale_password
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQL8Dialect
GROQ_API_KEY=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
JWT_SECRET=your-super-secret-key-change-this-to-something-random
SPRING_PROFILE=prod
ALLOWED_ORIGINS=https://yourapp.vercel.app
```

7. Click "Deploy"
8. Wait for build (2-3 minutes)
9. Get your backend URL: `https://xxx-production.up.railway.app`

### 4️⃣ Deploy Frontend (3 min)

**Vercel Deployment:**

1. Go to https://vercel.com
2. Click "New Project"
3. Select `ourstory-ai` repository
4. Configure:
   - Framework: Vite
   - Root Directory: `./`
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
5. Environment Variables:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://xxx-production.up.railway.app/api`
6. Click "Deploy"
7. Your app will be live at: `https://yourproject.vercel.app`

---

## ✅ VERIFY EVERYTHING WORKS

### Test Backend API:
```bash
curl https://xxx-production.up.railway.app/api/chat/health
# Should return: OurStory AI Chat Service is running!
```

### Test Chat Endpoint:
```bash
curl -X POST https://xxx-production.up.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

### Visit Frontend:
Open `https://yourproject.vercel.app` in browser

---

## 🔧 TROUBLESHOOTING

### Backend Won't Deploy
1. Check Railway logs: https://railway.app/project/xxx
2. Ensure all environment variables are set
3. Check that Java 17 is being used (Railway auto-detects from Maven)

### Frontend Shows 503 Error
1. Check VITE_API_BASE_URL is correct
2. Verify backend is running
3. Check CORS settings in backend

### Database Connection Failed
1. Whitelist Railway IP in PlanetScale (if needed)
2. Verify connection string is correct
3. Check username/password

---

## 📊 COSTS

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel Frontend | ✅ Unlimited | $0 |
| Railway Backend | ✅ $5/month credits | $0-5 |
| PlanetScale Database | ✅ 5GB | $0 |
| Groq API | ✅ 90/min | $0 |
| **TOTAL** | | **$0-5/month** |

---

## 🔐 SECURITY CHECKLIST

- [ ] Generated new JWT_SECRET (don't use default)
- [ ] Set strong database password
- [ ] Review CORS origins (only your domain)
- [ ] Enable HTTPS (automatic on Railway/Vercel)
- [ ] Don't commit `.env` file to GitHub
- [ ] Rotate API keys periodically

---

## 📝 AFTER DEPLOYMENT

1. **Monitor logs** in Railway dashboard
2. **Set up backups** for PlanetScale
3. **Monitor usage** to stay within free tier
4. **Update DNS** if using custom domain
5. **Set up SSL certificate** (automatic)

---

## 🆘 NEED HELP?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- PlanetScale Docs: https://app.planetscale.com/docs
- Django/Spring Boot: Check framework docs

