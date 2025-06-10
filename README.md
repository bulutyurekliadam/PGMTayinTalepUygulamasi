# Adalet Bakanlığı Tayin Talep Sistemi

Bu proje, Adalet Bakanlığı personelinin tayin taleplerini yönetmek için geliştirilmiş bir web uygulamasıdır. Sistem, personelin tayin taleplerini oluşturmasına, takip etmesine ve yöneticilerin bu talepleri değerlendirmesine olanak sağlar.

## Teknolojiler

### Backend
- .NET Core 7.0
- Entity Framework Core
- SQLite Veritabanı
- JWT Authentication

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- React Router
- Axios
- Formik & Yup

## Özellikler

### Kullanıcı Özellikleri
- Kullanıcı kaydı ve girişi
- Profil görüntüleme
- Tayin talebi oluşturma
- Mevcut talepleri görüntüleme ve takip etme

### Admin Özellikleri
- Tüm tayin taleplerini görüntüleme
- Talepleri onaylama/reddetme
- Talep durumlarını güncelleme
- Profil yönetimi

## Admin Kullanıcı Bilgileri
- Kullanıcı Adı: ab23000
- Şifre: Ab23000*

## Kurulum

### Backend (.NET Core)
1. Proje dizinine gidin:
```bash
cd TayinTalepAPI
```

2. Bağımlılıkları yükleyin:
```bash
dotnet restore
```

3. Veritabanını güncelleyin:
```bash
dotnet ef database update
```

4. Uygulamayı başlatın:
```bash
dotnet run --urls="http://localhost:5032"
```

### Frontend (React)
1. Proje dizinine gidin:
```bash
cd PGMTayinTalep
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı başlatın:
```bash
npm start
```

Uygulama http://localhost:3001 adresinde çalışacaktır.

## Kullanım

### Normal Kullanıcı
1. Sisteme kayıt olun veya giriş yapın
2. Ana sayfada mevcut tayin taleplerinizi görüntüleyin
3. "Yeni Talep" menüsünden yeni bir tayin talebi oluşturun
4. "Taleplerim" sayfasından mevcut taleplerinizi takip edin

### Admin Kullanıcı
1. Admin hesabıyla giriş yapın (örn: ab23000)
2. Yönetim panelinde tüm talepleri görüntüleyin
3. Talepleri değerlendirin ve durumlarını güncelleyin
4. Profilinizi yönetin

## Güvenlik

- JWT tabanlı kimlik doğrulama
- Rol tabanlı yetkilendirme (Admin/Kullanıcı)
- Güvenli parola yönetimi
- CORS politikaları

## Lisans

Bu proje [MIT lisansı](LICENSE) altında lisanslanmıştır.
