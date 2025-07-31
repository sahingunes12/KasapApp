# Supabase Backend Setup - KasapApp

Bu dosya KasapApp için Supabase backend altyapısının kurulumunu açıklar.

## 📋 Gereksinimler

- Supabase hesabı
- Supabase CLI (opsiyonel, yerel geliştirme için)
- Node.js 18+

## 🚀 Kurulum Adımları

### 1. Supabase Projesi Oluşturma

1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. "New Project" butonuna tıklayın
3. Proje adını "KasapApp" olarak belirleyin
4. Veritabanı şifresini güvenli bir şekilde kaydedin
5. Bölge seçin (Türkiye için en yakın bölge)

### 2. Environment Variables Ayarlama

Proje kök dizininde `.env` dosyası oluşturun:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Bu değerleri Supabase Dashboard > Settings > API bölümünden alabilirsiniz.

### 3. Veritabanı Şemasını Deploy Etme

#### Seçenek A: Supabase Dashboard ile (Önerilen)

1. Supabase Dashboard > SQL Editor'a gidin
2. `001_initial_schema.sql` dosyasının içeriğini kopyalayın ve çalıştırın
3. `002_rls_policies.sql` dosyasının içeriğini kopyalayın ve çalıştırın
4. `003_storage_setup.sql` dosyasının içeriğini kopyalayın ve çalıştırın

#### Seçenek B: Supabase CLI ile

```bash
# Supabase CLI kurulumu
npm install -g supabase

# Proje başlatma
supabase init

# Yerel geliştirme ortamı başlatma
supabase start

# Migration'ları çalıştırma
supabase db push
```

### 4. Storage Bucket'larını Oluşturma

Supabase Dashboard > Storage bölümünde aşağıdaki bucket'ları oluşturun:

#### media-files Bucket
- **Name**: media-files
- **Public**: false
- **File size limit**: 50MB
- **Allowed MIME types**: image/jpeg, image/png, image/gif, video/mp4, video/mov, video/avi

#### avatars Bucket
- **Name**: avatars
- **Public**: true
- **File size limit**: 5MB
- **Allowed MIME types**: image/jpeg, image/png

#### charity-logos Bucket
- **Name**: charity-logos
- **Public**: true
- **File size limit**: 5MB
- **Allowed MIME types**: image/jpeg, image/png

### 5. Authentication Ayarları

Supabase Dashboard > Authentication > Settings'de:

1. **Site URL**: `http://localhost:3000` (geliştirme için)
2. **Redirect URLs**: 
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/confirm`
3. **Email templates**: Türkçe dil desteği için özelleştirin

### 6. Row Level Security (RLS) Kontrolü

Tüm tablolarda RLS'nin aktif olduğunu kontrol edin:

```sql
-- Kontrol sorgusu
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'user_profiles', 'orders', 'appointments', 'time_slots', 'media_files', 'reviews', 'charity_organizations');
```

## 📊 Veritabanı Şeması

### Ana Tablolar

1. **users**: Kullanıcı kimlik doğrulama bilgileri
2. **user_profiles**: Kullanıcı profil bilgileri
3. **orders**: Sipariş bilgileri
4. **appointments**: Randevu bilgileri
5. **time_slots**: Müsait zaman dilimleri
6. **media_files**: Medya dosyaları
7. **reviews**: Kullanıcı değerlendirmeleri
8. **charity_organizations**: Yardım kuruluşları

### İlişkiler

- `orders.user_id` → `users.id`
- `user_profiles.user_id` → `users.id`
- `appointments.order_id` → `orders.id`
- `appointments.time_slot_id` → `time_slots.id`
- `media_files.order_id` → `orders.id`
- `reviews.order_id` → `orders.id`
- `reviews.user_id` → `users.id`

## 🔐 Güvenlik

### Row Level Security (RLS) Politikaları

- **Kullanıcılar**: Sadece kendi verilerini görüntüleyebilir/düzenleyebilir
- **Kasap**: Tüm siparişleri görüntüleyebilir, durumlarını güncelleyebilir
- **Admin**: Tüm verilere tam erişim
- **Medya dosyaları**: Sadece ilgili siparişin sahibi görüntüleyebilir
- **Değerlendirmeler**: Onaylanmış değerlendirmeler herkese açık

### Storage Güvenliği

- **media-files**: Sadece kasap rolündeki kullanıcılar yükleyebilir
- **avatars**: Kullanıcılar sadece kendi avatar'larını yönetebilir
- **charity-logos**: Sadece admin rolündeki kullanıcılar yönetebilir

## 🧪 Test Verileri

Varsayılan olarak aşağıdaki yardım kuruluşları eklenir:

1. Türk Kızılayı
2. İHH İnsani Yardım Vakfı
3. Deniz Feneri Derneği
4. Afrika Yardım Vakfı

## 🔧 Sorun Giderme

### Yaygın Sorunlar

1. **RLS Politikası Hatası**: Tablolarda RLS'nin aktif olduğundan emin olun
2. **Storage Bucket Hatası**: Bucket'ların doğru oluşturulduğunu kontrol edin
3. **Authentication Hatası**: Environment variables'ların doğru ayarlandığını kontrol edin

### Debug Komutları

```sql
-- RLS durumunu kontrol et
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Storage bucket'larını kontrol et
SELECT * FROM storage.buckets;

-- Kullanıcı rollerini kontrol et
SELECT id, email, role FROM public.users;
```

## 📝 Notlar

- Tüm migration'lar sırayla çalıştırılmalıdır
- Production ortamında environment variables'ları güvenli bir şekilde saklayın
- Düzenli olarak veritabanı yedekleri alın
- Storage bucket'larının boyut limitlerini izleyin

## 🔄 Güncellemeler

Yeni migration'lar eklemek için:

1. Yeni SQL dosyası oluşturun: `004_new_migration.sql`
2. Supabase Dashboard'da çalıştırın
3. Bu README'yi güncelleyin

## 📞 Destek

Sorunlar için:
1. Supabase Dashboard > Logs bölümünü kontrol edin
2. Console'da hata mesajlarını inceleyin
3. Supabase dokümantasyonunu referans alın 