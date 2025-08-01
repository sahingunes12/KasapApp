# DEVELOPMENT RULES - KasapApp

## 🚨 CRITICAL DEVELOPMENT RULES

### 1. **PORT SABİTLEME KURALI**
```javascript
// vite.config.js
server: {
  port: 8923,
  strictPort: true,  // ← BU ÇOK ÖNEMLİ!
  hmr: {
    port: 8924,
  },
}
```

**NEDEN ÖNEMLİ:**
- ✅ `strictPort: true` → Eğer port meşgulse hata verir, başka port aramaz
- ✅ Her değişiklikte farklı portlarda açılmaz
- ✅ Development sırasında sürekli URL değişmez
- ✅ Browser'da bookmark yapılabilir

### 2. **TYPESCRIPT SYNTAX KURALLARI**

**WEB BUILD İÇİN:**
```typescript
// ❌ YAPMAYINLAR:
import type { MyType } from './file';
interface MyInterface extends BaseInterface {}
const obj = { key: 'value' } as const;

// ✅ YAPIN:
// Type'ları lokal olarak tanımlayın
interface MyType { ... }
const MyComponent = ({ props }) => { ... }
const obj = { key: 'value' };
```

**NEDEN:**
- esbuild web build'de TypeScript syntax'ları çok sıkı parse ediyor
- React Native'de çalışan kod web'de çalışmayabilir
- Basit syntax kullanmak server restart'ları önler

### 3. **HOT RELOAD KURALLARI**

**YAPMAYINlar:**
```javascript
// ❌ Server restart eden değişiklikler:
- vite.config.js değişikliği
- TypeScript syntax hataları
- Import path hataları
- Missing dependency'ler
```

**YAPIN:**
```javascript
// ✅ Hot reload ile çalışan değişiklikler:
- Component content değişiklikleri
- Style değişiklikleri
- State/logic değişiklikleri
- Props değişiklikleri
```

### 4. **DEVELOPMENT WORKFLOW**

**1. Server Başlatma:**
```bash
npm run web  # Sadece bir kez başlatın
```

**2. Development Sırasında:**
- ✅ Dosya değişikliklerini kaydedin → Hot reload otomatik
- ✅ Console'da hataları kontrol edin
- ❌ Server'ı manuel restart ETMEYİN

**3. Eğer Server Restart Gerekirse:**
```bash
# Ctrl+C ile durdurun
npm run web  # Tekrar başlatın
```

### 5. **PORT YÖNETİMİ**

**SABİT PORTLAR:**
- **Web Dev Server:** `8923`
- **HMR (Hot Module Reload):** `8924`
- **React Native Metro:** `8922`
- **Supabase Local:** `54321-54324`

**Port Çakışması Durumunda:**
```bash
# Çakışan process'i bulun
lsof -ti:8923

# Kill edin
kill -9 <PID>

# Server'ı tekrar başlatın
npm run web
```

### 6. **HATA AYIKLAMA**

**Eğer Hot Reload Çalışmıyorsa:**
1. Browser Console'u kontrol edin
2. Terminal'deki hata mesajlarını okuyun
3. Son değişikliği geri alın
4. Server'ı restart edin

**Eğer Port Değişiyorsa:**
1. `vite.config.js`'de `strictPort: true` olduğunu kontrol edin
2. Başka bir uygulama aynı portu kullanıyor olabilir
3. `lsof -ti:8923` ile kontrol edin

### 7. **PERFORMANCE KURALLARI**

**Build Performance:**
```javascript
// vite.config.js
esbuild: {
  logLevel: 'silent',  // Gereksiz log'ları azaltır
}
```

**Memory Usage:**
- ✅ Gereksiz import'ları temizleyin
- ✅ Unused component'leri silin
- ❌ Çok büyük dosyalar oluşturmayın

---

## 🎯 ÖZETİ

**EGE ELİTAŞ'IN KURALI:**
> "Uygulamayı her özellik eklediğinde yeniden farklı bir host'ta çalıştırma artık!"

**ÇÖZÜM:**
- ✅ `strictPort: true` 
- ✅ TypeScript syntax'ını basitleştir
- ✅ Hot reload'ı koru
- ✅ Port çakışmalarını önle

**SONUÇ:**
🎉 **Artık her değişiklikte port değişmeyecek!**