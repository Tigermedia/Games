# מדריך פריסה - טופס הגדרת סוכן AI

## 🌐 אפשרויות פריסה

### 1. Vercel (מומלץ - חינם)

#### התקנה
```bash
npm install -g vercel
```

#### פריסה
```bash
cd "AI Agent Config"
vercel
```

#### תצורה אוטומטית
Vercel יזהה אוטומטית:
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

#### Custom Domain
```bash
vercel --prod
vercel alias [deployment-url] [your-domain.com]
```

**זמן פריסה**: ~2 דקות
**עלות**: חינם
**URL דוגמה**: https://ai-agent-config.vercel.app

---

### 2. Netlify (חינם)

#### דרך ממשק הווב
1. גש ל-https://netlify.com
2. לחץ "Add new site" > "Deploy manually"
3. גרור את תיקיית `dist` (אחרי build)

#### דרך CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

**זמן פריסה**: ~1 דקה
**עלות**: חינם
**URL דוגמה**: https://ai-agent-config.netlify.app

---

### 3. GitHub Pages (חינם)

#### הכנה
1. צור repository ב-GitHub
2. העלה את הקוד

#### תצורה
```bash
# התקן gh-pages
npm install --save-dev gh-pages

# הוסף ל-package.json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# פרוס
npm run deploy
```

#### הגדרות repository
1. Settings > Pages
2. Source: gh-pages branch
3. שמור

**זמן פריסה**: ~3 דקות
**עלות**: חינם
**URL דוגמה**: https://[username].github.io/ai-agent-config

---

### 4. Cloudflare Pages (חינם)

#### דרך ממשק הווב
1. גש ל-https://pages.cloudflare.com
2. חבר את GitHub repository
3. תצורה:
   - Build command: `npm run build`
   - Output directory: `dist`

#### דרך CLI (Wrangler)
```bash
npm install -g wrangler
npm run build
wrangler pages publish dist
```

**זמן פריסה**: ~2 דקות
**עלות**: חינם
**URL דוגמה**: https://ai-agent-config.pages.dev

---

### 5. Firebase Hosting (חינם)

#### התקנה
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

#### תצורה (firebase.json)
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### פריסה
```bash
npm run build
firebase deploy
```

**זמן פריסה**: ~2 דקות
**עלות**: חינם (עד 10GB)
**URL דוגמה**: https://ai-agent-config.web.app

---

### 6. Render (חינם)

#### דרך ממשק הווב
1. גש ל-https://render.com
2. New > Static Site
3. חבר GitHub repository
4. תצורה:
   - Build command: `npm run build`
   - Publish directory: `dist`

**זמן פריסה**: ~3 דקות
**עלות**: חינם
**URL דוגמה**: https://ai-agent-config.onrender.com

---

## 🔧 הכנה לפריסה

### 1. בנייה לוקלית
```bash
npm run build
```

הפקודה תיצור תיקייה `dist/` עם:
- `index.html`
- `assets/` (JS, CSS)
- `vite.svg`

### 2. בדיקת גרסת ייצור
```bash
npm run preview
```

זה יריץ שרת לוקלי עם גרסת הייצור על http://localhost:4173

### 3. אופטימיזציה

#### Vite Configuration
הקובץ `vite.config.ts` כבר מוגדר עם:
- Code splitting
- Minification
- Tree shaking
- CSS optimization

#### Tailwind Configuration
הקובץ `tailwind.config.js` מוגדר עם:
- Purge של CSS לא בשימוש
- Minification
- Autoprefixer

---

## 🌍 Custom Domain

### הוספת דומיין מותאם

#### Vercel
```bash
vercel alias [deployment-url] mydomain.com
```

#### Netlify
1. Site settings > Domain management
2. Add custom domain
3. עקוב אחרי ההוראות DNS

#### Cloudflare Pages
1. Custom domains > Set up a domain
2. בחר domain או subdomain
3. הגדר DNS records

---

## 📊 CI/CD (אוטומציה)

### GitHub Actions עבור Vercel

צור `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🔒 Environment Variables

אם תצטרך משתני סביבה בעתיד:

### Development (.env.local)
```
VITE_API_URL=http://localhost:3000
```

### Production (בפלטפורמת הפריסה)
```
VITE_API_URL=https://api.yoursite.com
```

**שים לב**: משתנים צריכים להתחיל ב-`VITE_` כדי להיחשף ל-Vite.

---

## 📈 Analytics

### Google Analytics

הוסף ל-`index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Vercel Analytics
```bash
npm install @vercel/analytics
```

הוסף ל-`src/main.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
```

---

## 🔍 SEO

### Meta Tags

הקובץ `index.html` כבר כולל meta tags בסיסיים. להוסיף:

```html
<meta name="description" content="טופס הגדרת סוכן AI מתקדם בעברית">
<meta name="keywords" content="AI, chatbot, צ'אטבוט, עברית">
<meta property="og:title" content="טופס הגדרת סוכן AI">
<meta property="og:description" content="טופס מתקדם להגדרת סוכן צ'אטבוט">
<meta property="og:image" content="/preview.jpg">
```

### robots.txt

צור `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

---

## 🐛 Troubleshooting

### בעיות נפוצות

#### 1. 404 על routing
**פתרון**: הוסף redirect rules לפלטפורמת הפריסה.

Netlify (`_redirects`):
```
/*    /index.html   200
```

Vercel (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

#### 2. Assets לא נטענים
**פתרון**: בדוק base path ב-`vite.config.ts`:
```ts
export default defineConfig({
  base: '/ai-agent-config/', // עבור GitHub Pages
  plugins: [react()],
})
```

#### 3. Build fails
**פתרון**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## ✅ Checklist לפני פריסה

- [ ] `npm run build` עובד בלי שגיאות
- [ ] `npm run preview` מציג את האפליקציה נכון
- [ ] כל הקישורים עובדים
- [ ] הטופס שומר נתונים ב-localStorage
- [ ] ייצוא JSON/Email עובד
- [ ] האפליקציה רספונסיבית במובייל
- [ ] אין console errors
- [ ] Meta tags מעודכנים
- [ ] Analytics מוגדר (אם רלוונטי)

---

## 🎉 סיכום

האפליקציה מוכנה לפריסה! בחר אחת מהאפשרויות למעלה והעלה לאוויר תוך דקות.

**מומלץ**: Vercel או Netlify לפשטות ומהירות.

בהצלחה! 🚀
