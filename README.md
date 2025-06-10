# Personel Tayin Talep Sistemi

Bu proje, adliyede görev yapan personelin (yazı işleri müdürü, zabıt katibi, mübaşir vb.) başka bir adliyeye tayin talebinde bulunabileceği bir web uygulamasıdır.

## Özellikler

### Kullanıcı İşlemleri
- Sicil numarası ve şifre ile güvenli giriş
- Personel bilgilerini görüntüleme ve güncelleme
- Profil sayfasında kişisel bilgileri kompakt görüntüleme
- Admin ve normal kullanıcı rolleri

### Tayin Talep İşlemleri
- Yeni tayin talebi oluşturma
- Talep türü seçimi (yeni eklenen özellik)
- 81 il merkezi adliyesi arasından tercih yapabilme
- Talep açıklaması ekleme
- Mevcut talepleri listeleme ve durumlarını takip etme

### Admin Paneli
- Tüm talepleri görüntüleme
- Talepleri değerlendirme
- Talep durumunu güncelleme
- Personel bilgilerini yönetme

## Teknolojiler

### Backend
- ASP.NET Core 7.0
- Entity Framework Core
- SQLite Veritabanı
- JWT Authentication
- RESTful API

### Frontend
- React.js
- Material-UI (MUI)
- Axios
- React Router
- Context API
- JWT Token yönetimi

## Kurulum

### Gereksinimler
- .NET 7.0 SDK
- Node.js ve npm
- Git

### Backend Kurulum
```bash
# Projeyi klonlayın
git clone [repo-url]

# API klasörüne gidin
cd TayinTalepAPI/api

# Bağımlılıkları yükleyin
dotnet restore

# Veritabanını oluşturun
dotnet ef database update

# Uygulamayı başlatın
dotnet run --urls="http://localhost:5032"
```

### Frontend Kurulum
```bash
# Frontend klasörüne gidin
cd PGMTayinTalep

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm start
```

## Son Güncellemeler

### v1.1.0 (10 Haziran 2025)
- TalepTuru alanı eklendi (backend ve frontend)
- Profil sayfası yeniden tasarlandı
  - Kart boyutu küçültüldü (md -> sm)
  - Ad ve soyad yan yana getirildi
  - Yazı boyutları ve boşluklar optimize edildi
  - Daha kompakt ve düzenli görünüm
- Backend'de namespace hataları düzeltildi
  - api.Data -> TayinTalepAPI.Data
  - DataContext -> ApplicationDbContext

### v1.0.0 (İlk Sürüm)
- Temel kullanıcı işlemleri
- Tayin talep yönetimi
- Admin paneli
- Güvenlik önlemleri
- Responsive tasarım

## API Endpoints

### Kullanıcı İşlemleri
- POST /api/auth/login
- GET /api/users/profile
- PUT /api/users/profile

### Tayin Talep İşlemleri
- POST /api/tayintalep
- GET /api/tayintalep
- GET /api/tayintalep/{id}
- PUT /api/tayintalep/{id}

## Veritabanı Şeması

### Users Tablosu
- Id (int)
- SicilNo (string)
- Password (string)
- Ad (string)
- Soyad (string)
- Unvan (string)
- MevcutAdliye (string)
- IseBaslamaTarihi (DateTime)
- IsAdmin (bool)

### TayinTalepleri Tablosu
- Id (int)
- SicilNo (string)
- TalepEdilenAdliye (string)
- TalepTuru (string)
- BasvuruTarihi (DateTime)
- Aciklama (string)
- TalepDurumu (string)
- DegerlendirilmeTarihi (DateTime?)
- DegerlendirmeNotu (string)
- IsOnaylandi (bool)

## Güvenlik Önlemleri
- JWT tabanlı kimlik doğrulama
- Şifre hashleme
- Input validasyonu
- CORS politikaları
- XSS koruması

## Performans İyileştirmeleri
- API response caching
- Lazy loading
- Veritabanı indeksleme
- Frontend bundle optimizasyonu

## Katkıda Bulunma
1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans
Bu proje MIT lisansı altında lisanslanmıştır.