# 🏠 KasapApp

**KasapApp** - Dini kurban hizmetleri için kapsamlı mobil uygulama.

## 📱 Proje Hakkında

KasapApp, kullanıcıları kasap hizmetleri ile buluşturan, dini kurban hizmetleri (Kurban, Adak, Şükür) için tasarlanmış kapsamlı bir mobil uygulamadır. Uygulama sipariş yerleştirmeden teslimata, bağış seçeneklerinden randevu planlamaya, görsel kanıtlardan ödeme işlemlerine kadar eksiksiz bir çözüm sunar.

## 🌟 Özellikler

### 🛒 Sipariş Yönetimi
- Kurban, Adak, Şükür hizmet seçenekleri
- Kişisel, Hayır, Restaurant, Afrika teslimat seçenekleri
- Özel notlar (500 karaktere kadar)
- Sipariş durumu takibi

### 📅 Randevu Planlama
- Takvim arayüzü ile uygun zaman dilimi seçimi
- Kapasite yönetimi ile randevu rezervasyonu
- Randevu iptal ve yeniden planlama
- Hatırlatıcılar ve bildirimler

### 💳 Ödeme İşlemleri
- PayPal, IBAN transferi, yerel ödeme seçenekleri
- Güvenli ödeme işlemi
- Ödeme onayı ve makbuz oluşturma
- Ödeme geçmişi takibi

### 📸 Medya ve Kanıt
- Tamamlanan hizmetlerin video ve fotoğraf kanıtları
- Tam ekran görüntüleme ile medya galerisi
- Medya paylaşım işlevselliği
- Hizmet tamamlandıktan sonra otomatik medya yükleme

### 🎁 Bağış Sistemi
- Hayır kurumu seçimi
- Bağış makbuzu oluşturma (PDF)
- E-posta ile makbuz teslimi
- Bağış durumu takibi

## 🚀 Teknolojiler

- **Frontend**: React Native with TypeScript
- **State Management**: Zustand
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: React Navigation v6
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payment**: PayPal SDK, IBAN transfer
- **Notifications**: Expo Push Notifications
- **Media**: Supabase Storage
- **PDF Generation**: react-native-pdf-lib
- **Internationalization**: react-i18next

## 📱 Platform Desteği

- ✅ **iOS**: iPhone ve iPad
- ✅ **Android**: Tüm Android cihazlar
- ✅ **Web**: Tarayıcı desteği

## 🎯 Demo

**Live Demo**: https://sahingunes12.github.io/KasapApp

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- React Native CLI
- Xcode (iOS için)
- Android Studio (Android için)

### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/sahingunes12/KasapApp.git
cd KasapApp
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **iOS için CocoaPods yükleyin**
```bash
cd ios && pod install && cd ..
```

4. **Uygulamayı başlatın**

**Web için:**
```bash
npm run web:dev
```

**iOS için:**
```bash
npm run ios
```

**Android için:**
```bash
npm run android
```

## 🛠️ Geliştirme

### Komutlar

```bash
# Web development
npm run web:dev

# iOS development
npm run ios

# Android development
npm run android

# Build web
npm run build:web

# Deploy to GitHub Pages
npm run deploy

# Test
npm test
```

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Telefon**: +90 555 123 45 67
- **E-posta**: info@kasapapp.com
- **Adres**: İstanbul, Türkiye

## 🙏 Teşekkürler

Bu proje açık kaynak topluluğunun katkılarıyla geliştirilmiştir.

---

**KasapApp** - Dini kurban hizmetleri için güvenilir platform 🏠

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
