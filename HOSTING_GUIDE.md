# FREE HOSTING GUIDE FOR OurStory AI

## 🎯 Recommended Free Hosting Stack

### Option 1: BEST (All Free, No Credit Card Required)
**Frontend**: Vercel/Netlify
**Backend**: Render/Railway  
**Database**: PlanetScale (MySQL) or Supabase (PostgreSQL)

---

## 📱 FRONTEND HOSTING (Choose One)

### ✅ Option A: Vercel (Recommended for React)
**Cost**: FREE
**URL**: yourapp.vercel.app

**Steps**:
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Select your GitHub repo (ourstory-ai)
5. Configure:
   - Framework: Vite
   - Root Directory: ./frontend
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```
7. Deploy!

### ✅ Option B: Netlify
**Cost**: FREE
**URL**: yourapp.netlify.app

**Steps**:
1. Go to https://netlify.com
2. Connect GitHub repo
3. Build settings:
   - Build command: `npm run build` (in frontend folder)
   - Publish directory: `dist`
4. Add environment variables
5. Deploy!

---

## 🖥️ BACKEND HOSTING (Choose One)

### ✅ Option A: Railway (BEST - Free Credits)
**Cost**: FREE ($5/month credits, enough for small apps)
**URL**: yourdomain-production.up.railway.app

**Steps**:
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Select "Deploy from GitHub"
5. Configure for Java/Maven:
   ```
   Procfile (create in root):
   web: java -Xmx300m -Xms75m -jar target/ourstory-ai-backend-1.0.0.jar \
     --server.port=${PORT} \
     --spring.datasource.url=${DATABASE_URL} \
     --spring.datasource.username=${DB_USER} \
     --spring.datasource.password=${DB_PASSWORD} \
     --groq.api-key=${GROQ_API_KEY} \
     --jwt.secret=${JWT_SECRET}
   ```

6. Add environment variables in Railway dashboard
7. Connect to PostgreSQL database (see Database section)
8. Deploy!

### ✅ Option B: Render
**Cost**: FREE (with limitations)
**URL**: yourdomain-production.onrender.com

**Steps**:
1. Go to https://render.com
2. Create Web Service
3. Connect GitHub
4. Configure:
   - Runtime: Java
   - Build Command: `mvn clean package -f backend/pom.xml`
   - Start Command: `java -jar backend/target/ourstory-ai-backend-1.0.0.jar`
5. Add environment variables
6. Deploy!

---

## 💾 DATABASE HOSTING (Choose One)

### ✅ Option A: PlanetScale (MySQL - RECOMMENDED)
**Cost**: FREE (3 databases, 5GB storage)
**URL**: MySQL compatible

**Steps**:
1. Go to https://planetscale.com
2. Sign up
3. Create new MySQL database
4. Get connection strings
5. Use in backend as:
   ```
   SPRING_DATASOURCE_URL=mysql://username:password@aws.connect.psdb.cloud/ourstory_db?sslMode=VERIFY_IDENTITY
   SPRING_DATASOURCE_DRIVER=com.mysql.cj.jdbc.Driver
   ```

### ✅ Option B: Supabase (PostgreSQL)
**Cost**: FREE (5GB storage)
**URL**: PostgreSQL compatible

**Steps**:
1. Go to https://supabase.com
2. Create new project
3. Get PostgreSQL connection string
4. Use in backend:
   ```
   SPRING_DATASOURCE_URL=postgresql://user:password@db.xxxxx.supabase.co:5432/postgres
   SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQL10Dialect
   SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
   ```

### ✅ Option C: MongoDB Atlas (NoSQL)
**Cost**: FREE (512MB storage)
**Alternative**: If you want to switch to MongoDB

---

## 📋 STEP-BY-STEP DEPLOYMENT

### Step 1: Create .env File
Create a `.env` file with your secrets (NEVER commit this):
```env
GROQ_API_KEY=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
JWT_SECRET=generate-a-random-256-bit-key-here
SPRING_DATASOURCE_URL=your-planetscale-mysql-url
SPRING_DATASOURCE_USERNAME=your-db-user
SPRING_DATASOURCE_PASSWORD=your-db-password
```

### Step 2: Update Configuration Files

Update `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    driverClassName: ${SPRING_DATASOURCE_DRIVER:org.hibernate.dialect.MySQL8Dialect}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
```

### Step 3: Build Production JAR
```bash
cd backend
mvn clean package -DskipTests
```

### Step 4: Deploy Frontend
Push to GitHub → Vercel auto-deploys

### Step 5: Deploy Backend
Push to GitHub → Railway/Render auto-deploys

---

## 🔗 CONNECT FRONTEND TO BACKEND

In your frontend environment variables, set:
```
VITE_API_BASE_URL=https://your-backend-url-on-railway.app/api
```

---

## ✅ FREE TIER LIMITS CHECK

| Service | Free Tier | Enough? |
|---------|-----------|---------|
| Vercel Frontend | Unlimited | ✅ Yes |
| Railway Backend | $5/month credits | ⚠️ For small apps |
| PlanetScale DB | 5GB | ✅ Yes |
| Groq API | 90 requests/min | ✅ Yes |

---

## 🚀 RECOMMENDED SETUP

**BEST for your app:**
1. **Frontend**: Vercel
2. **Backend**: Railway
3. **Database**: PlanetScale (MySQL)

**Why?**
- All completely free/cheap
- Easy to set up
- Good free limits
- Auto-scales
- Good documentation

---

## 📊 MONITORING & COSTS

- Frontend: $0/month (Vercel free)
- Backend: $0-5/month (Railway credits)
- Database: $0/month (PlanetScale free tier)
- **Total: $0-5/month MAX**

