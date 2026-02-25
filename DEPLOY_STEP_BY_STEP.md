# 🚀 STEP-BY-STEP: FROM CODE TO LIVE APP (FREE)

## STEP 1: Push Code to GitHub (2 minutes)

### If you don't have GitHub:
1. Go to https://github.com/signup
2. Create account (free)
3. Create new repository named `ourstory-ai`
4. Push your code:
```bash
cd c:\Users\Ganesh.Suryawanshi\RHI\ourstory-ai
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ourstory-ai.git
git push -u origin main
```

---

## STEP 2: Create Free Database (5 minutes)

### Go to: https://planetscale.com

1. **Sign Up**:
   - Click "Sign Up"
   - Choose "Sign up with GitHub"
   - Authorize PlanetScale

2. **Create Database**:
   - Click "Create a new database"
   - Name: `ourstory_db`
   - Choose your region
   - Click "Create database"

3. **Get Connection String**:
   - Wait for database to be ready
   - Click "Connections"
   - Select "Python" driver (for MySQL format)
   - Copy the connection string
   - Save it somewhere safe!
   
   **Example format:**
   ```
   mysql://pscale_user:pscale_pass@aws.connect.psdb.cloud/ourstory_db?sslMode=VERIFY_IDENTITY
   ```

4. **Extract credentials** from connection string:
   - `SPRING_DATASOURCE_URL`: Full string above
   - `SPRING_DATASOURCE_USERNAME`: `pscale_user`
   - `SPRING_DATASOURCE_PASSWORD`: `pscale_pass`

---

## STEP 3: Deploy Backend (10 minutes)

### Go to: https://railway.app

1. **Sign Up**:
   - Click "Start Free"
   - Choose "Continue with GitHub"
   - Authorize Railway

2. **Create New Project**:
   - Click "Create New Project"
   - Select "Deploy from GitHub repo"
   - Select `ourstory-ai` repository
   - Select branch: `main`

3. **Configure Build**:
   - Wait for automatic detection
   - Should detect Maven/Java automatically
   - Click "Add Service"

4. **Add Environment Variables**:
   - Go to "Variables" tab
   - Click "Parameter"
   - Add each variable:

   ```
   SPRING_DATASOURCE_URL
   Value: mysql://user:pass@aws.connect.psdb.cloud/ourstory_db?sslMode=VERIFY_IDENTITY
   
   SPRING_DATASOURCE_DRIVER
   Value: com.mysql.cj.jdbc.Driver
   
   SPRING_DATASOURCE_USERNAME
   Value: your_planetscale_user
   
   SPRING_DATASOURCE_PASSWORD
   Value: your_planetscale_password
   
   SPRING_JPA_DATABASE_PLATFORM
   Value: org.hibernate.dialect.MySQL8Dialect
   
   GROQ_API_KEY
   Value: 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
   
   JWT_SECRET
   Value: generate-new-random-256-bit-string-here
   
   SPRING_PROFILE
   Value: prod
   
   ALLOWED_ORIGINS
   Value: https://yourapp.vercel.app
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (2-5 minutes)
   - Status will show "Success"

6. **Get Backend URL**:
   - Go to "Deployments"
   - Copy the URL (looks like: `https://xxx-production.up.railway.app`)
   - **SAVE THIS!** You need it for frontend

---

## STEP 4: Deploy Frontend (8 minutes)

### Go to: https://vercel.com

1. **Sign Up**:
   - Click "Start Free"
   - Choose "Continue with GitHub"
   - Authorize Vercel

2. **Create New Project**:
   - Click "New Project"
   - Select `ourstory-ai` repository
   - Click "Import"

3. **Configure Project**:
   - Framework: Select **Vite** from dropdown
   - Root Directory: Leave as `./`
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install --legacy-peer-deps`

4. **Add Environment Variable**:
   - Click "Environment Variables"
   - Name: `VITE_API_BASE_URL`
   - Value: `https://xxx-production.up.railway.app/api` (Replace with your Railway URL)
   - Click "Save"

5. **Deploy**:
   - Click "Deploy"
   - Wait for build (2-3 minutes)
   - Will show "Congratulations!" when done

6. **Get Frontend URL**:
   - You'll see domain like: `https://yourproject.vercel.app`
   - **THIS IS YOUR LIVE APP!**

---

## STEP 5: Verify Everything Works (5 minutes)

### Test 1: Backend Health Check
```bash
curl https://xxx-production.up.railway.app/api/chat/health
```
Expected response: `OurStory AI Chat Service is running!`

### Test 2: Chat API
```bash
curl -X POST https://xxx-production.up.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello world"}'
```
Expected: JSON response with AI reply

### Test 3: Frontend in Browser
1. Open `https://yourproject.vercel.app` in browser
2. You should see the OurStory AI application
3. Try sending a message
4. You should get an AI response

---

## 🎉 YOU'RE DONE!

Your application is now **LIVE** and **FREE**!

### Share your app:
- Frontend URL: `https://yourproject.vercel.app`
- Backend API: `https://xxx-production.up.railway.app/api`
- Database: Managed by PlanetScale

### What happens next:
- Changes to GitHub = Auto deployment
- No downtime updates
- Automatic scaling (within free tier)

---

## 🔐 IMPORTANT SECURITY NOTES

1. **Don't share your API keys** - Keep them secret!
2. **Don't commit `.env`** - It contains secrets!
3. **Change JWT_SECRET** - Generate a random one (at least 256 chars)
4. **Review CORS origins** - Only allow your domain

---

## 💾 UPDATE PLANETSCALE FIREWALL (If needed)

If Railway can't connect to PlanetScale:

1. Go to PlanetScale dashboard
2. Select your database
3. Go to "Settings" → "Networking"
4. Add Railway IP to whitelist:
   - Click "Add Network"
   - Enter your Railway IP (you'll find it in Railway logs)
   - Click "Add"

---

## 🆘 TROUBLESHOOTING

### Backend not deploying
- Check Railway logs
- Verify Java 17 is available
- Check all environment variables are set

### Frontend shows blank page
- Check browser console for errors
- Verify VITE_API_BASE_URL is correct
- Check that backend is running

### Can't connect to database
- Verify connection string is correct
- Check username/password
- Verify PlanetScale firewall settings

### Chat not working
- Check Groq API key
- Verify backend environment variables
- Check Railway logs for errors

---

## 📊 MONITOR YOUR FREE TIER USAGE

### Railway Dashboard:
- Check monthly usage
- Monitor CPU/memory
- Review deployment logs

### PlanetScale Dashboard:
- Check database size
- Review query statistics
- Monitor bandwidth

### Vercel Dashboard:
- Check function invocations
- Review build times
- Monitor deployments

---

## 🎓 NEXT: Custom Domain (Optional)

Want `yourapp.com` instead of `yourproject.vercel.app`?

1. Register domain (Google Domains, Namecheap, etc.)
2. In Vercel: Go to Settings → Domain
3. Add your domain
4. Follow DNS configuration steps
5. Wait 24 hours for propagation

---

## 📞 QUICK LINKS

- Railway: https://railway.app
- Vercel: https://vercel.com
- PlanetScale: https://planetscale.com
- GitHub: https://github.com  
- Groq: https://console.groq.com

---

## ✅ FINAL CHECKLIST

- [ ] Code pushed to GitHub
- [ ] PlanetScale database created
- [ ] Railway backend deployed
- [ ] Vercel frontend deployed
- [ ] Environment variables set
- [ ] Backend health check passed
- [ ] Chat API test passed
- [ ] Frontend loads in browser
- [ ] Can send messages and get responses
- [ ] Everything is working!

**Time to complete: ~1 hour**

🎉 **CONGRATULATIONS! YOUR APP IS LIVE!** 🎉

