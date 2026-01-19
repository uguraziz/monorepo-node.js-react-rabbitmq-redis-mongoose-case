# Case Study - TaskBoard

## 📋 Proje Özeti

**TaskBoard**, proje ve görev yönetimi için geliştirilmiş fullstack bir web uygulamasıdır. Kullanıcılar projeler oluşturur, görevler atar, yorum yazar ve durum günceller. Sistem, RabbitMQ ile asenkron event işleme ve Socket.io ile gerçek zamanlı bildirimler sunar.

## 🎯 Amaç

Bu proje, modern fullstack geliştirme pratiklerini sergilemek için geliştirilmiştir:
- **Monorepo** yapısında modüler mimari
- **OTP tabanlı** kimlik doğrulama
- **Rol tabanlı** yetkilendirme (Admin/Member)
- **Event-driven** mimari (RabbitMQ)
- **Gerçek zamanlı** iletişim (Socket.io)
- **Modern UI/UX** (Shadcn UI + Tailwind CSS)

## 🛠️ Kullanılan Teknolojiler

### Backend (`apps/api`)
- **Express.js** - REST API
- **Socket.io** - Gerçek zamanlı iletişim
- **MongoDB** (Mongoose) - Veritabanı
- **RabbitMQ** (amqplib) - Mesaj kuyruğu
- **Redis** (ioredis) - Cache ve rate limiting
- **JWT** (jsonwebtoken) - Token tabanlı kimlik doğrulama
- **Ajv** - JSON Schema validasyon
- **Pino** - Logging
- **bcrypt** - Şifre hashleme

### Worker (`apps/worker`)
- **RabbitMQ Consumers** - Event işleme
- **MongoDB** - Event ve metrik kayıtları
- **Redis** - Pub/Sub bildirimler
- **node-cron** - Zamanlanmış görevler

### Frontend (`apps/web`)
- **React 19** - UI framework
- **Vite** - Build tool
- **Shadcn UI** - Component library
- **TanStack Query** - Server state yönetimi
- **TanStack Table** - Tablo component'i
- **Zustand** - Client state yönetimi
- **React Router** - Routing
- **Formik + Yup** - Form yönetimi ve validasyon
- **Socket.io Client** - Gerçek zamanlı bağlantı

### Altyapı
- **Docker Compose** - Servis orchestration
- **pnpm** - Package manager (monorepo)
- **MongoDB** - Veritabanı
- **Redis** - Cache
- **RabbitMQ** - Message broker

## ✨ Yapılan Özellikler

### Kimlik Doğrulama
- OTP tabanlı giriş (e-posta stub)
- JWT access + refresh token
- Token refresh mekanizması
- Oturum yönetimi

### Proje Yönetimi
- Proje oluşturma, güncelleme, silme
- Üye ekleme/çıkarma
- Proje listesi ve detay görüntüleme

### Görev Yönetimi
- Görev oluşturma, güncelleme, silme
- Durum yönetimi (todo, in-progress, done)
- Atama işlemleri
- Etiket (tag) yönetimi
- Filtreleme (status, assignee, tag)
- Sıralama ve pagination
- Inline düzenleme (başlık, durum, atanan)
- Kolon görünürlük kontrolü

### Yorum Sistemi
- Görevlere yorum ekleme
- Yorum listesi
- Gerçek zamanlı yorum bildirimleri

### Gerçek Zamanlı Özellikler
- Socket.io ile anlık güncellemeler
- `/realtime` namespace kullanımı
- Proje odalarına katılma (`project:{id}`)
- Event'ler: `task.updated`, `task.created`, `task.deleted`, `comment.added`
- Otomatik tablo güncellemeleri

### Asenkron İşleme
- RabbitMQ ile event publishing
- Mailer consumer (OTP gönderimi)
- Notifier consumer (bildirimler)
- Analytics consumer (metrik toplama)

### UI/UX
- Dashboard görünümü
- Responsive tasarım
- Dark/Light tema (Shadcn ThemeProvider)
- Loading states ve skeleton'lar
- Empty states
- Error handling
- Form validasyonu (Formik + Yup)
- Toast bildirimleri

---

Fullstack Developer Role Case Study projesi. OTP'li kimlik doğrulama, rol tabanlı yetkilendirme, RabbitMQ ile asenkron işleme, Socket.io ile gerçek zamanlı bildirim içeren bir TaskBoard uygulaması.

## 🏗️ Proje Yapısı

Monorepo yapısında 3 ana uygulama ve 2 paket:

- **apps/api** - Express.js REST API + Socket.io
- **apps/worker** - RabbitMQ consumer'lar ve cron job'lar
- **apps/web** - React + Vite + Shadcn UI frontend
- **packages/ui** - Ortak UI bileşenleri (DataTable, utilities)
- **packages/common** - Ortak utility'ler ve şemalar

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+
- pnpm
- Docker & Docker Compose

### 1. Servisleri Başlat

```bash
docker-compose up -d
```

Bu komut şunları başlatır:
- MongoDB (port 27017)
- Redis (port 6379)
- RabbitMQ (port 5672, Management UI: http://localhost:15672)

### 2. Bağımlılıkları Kur

```bash
pnpm install
```

### 3. Environment Dosyalarını Oluştur

Root dizinde `.env.example` dosyasından kopyalayın:

```bash
# API için
cp .env.example apps/api/.env

# Worker için
cp .env.example apps/worker/.env

# Web için (opsiyonel)
cp .env.example apps/web/.env
```

**Önemli**: `.env` dosyalarında JWT secret'larını ve diğer güvenlik ayarlarını production için değiştirin!

### 4. Uygulamaları Başlat

```bash
# Tüm uygulamaları ayrı terminal'lerde başlatın:

# Backend API
pnpm run dev:api

# Worker
pnpm run dev:worker

# Frontend
pnpm run dev:web
```

## 📦 Scripts

### Root Level

- `pnpm run dev:api` - API'yi development modunda başlat
- `pnpm run dev:worker` - Worker'ı development modunda başlat
- `pnpm run dev:web` - Frontend'i development modunda başlat
- `pnpm run build:web` - Frontend'i build et
- `pnpm run lint:web` - Frontend lint kontrolü
- `pnpm run format` - Tüm dosyaları Prettier ile formatla
- `pnpm run format:check` - Format kontrolü yap
- `pnpm run docker:up` - Docker servislerini başlat
- `pnpm run docker:down` - Docker servislerini durdur
- `pnpm run docker:logs` - Docker loglarını göster

### API

- `pnpm --filter @nodelabs/api dev` - API development
- `pnpm --filter @nodelabs/api start` - API production
- `pnpm --filter @nodelabs/api test` - API testleri

### Worker

- `pnpm --filter @nodelabs/worker dev` - Worker development
- `pnpm --filter @nodelabs/worker start` - Worker production

### Web

- `pnpm --filter @nodelabs/web dev` - Frontend development
- `pnpm --filter @nodelabs/web build` - Frontend build
- `pnpm --filter @nodelabs/web preview` - Frontend preview
- `pnpm --filter @nodelabs/web test` - Frontend testleri (Vitest)
- `pnpm --filter @nodelabs/web test:ui` - Test UI ile çalıştır

## 🔧 Teknolojiler

### Backend
- Express.js
- Socket.io
- MongoDB (Mongoose)
- RabbitMQ
- Redis
- JWT
- Ajv (JSON Schema validation)
- Pino (logging)

### Worker
- RabbitMQ consumers
- MongoDB
- Redis
- Node-cron

### Frontend
- React 19
- Vite
- Shadcn UI
- TanStack Query
- TanStack Table
- Zustand
- React Router
- Socket.io Client
- Formik + Yup

## 📝 API Endpoints

### Auth
- `POST /api/auth/otp/request` - OTP iste
- `POST /api/auth/otp/verify` - OTP doğrula
- `POST /api/auth/refresh` - Token yenile
- `POST /api/auth/logout` - Çıkış yap
- `POST /api/auth/logout-all` - Tüm oturumları kapat

### Projects
- `GET /api/projects` - Projeleri listele
- `GET /api/projects/:id` - Proje detayı
- `POST /api/projects` - Proje oluştur
- `PUT /api/projects/:id` - Proje güncelle
- `DELETE /api/projects/:id` - Proje sil

### Tasks
- `GET /api/tasks` - Görevleri listele
- `GET /api/tasks/:id` - Görev detayı
- `POST /api/tasks` - Görev oluştur
- `PUT /api/tasks/:id` - Görev güncelle
- `DELETE /api/tasks/:id` - Görev sil

### Comments
- `GET /api/comments` - Yorumları listele (query: taskId)
- `POST /api/comments` - Yorum oluştur
- `PUT /api/comments/:id` - Yorum güncelle
- `DELETE /api/comments/:id` - Yorum sil

### Users
- `GET /api/users` - Tüm kullanıcıları listele (authenticated)
- `GET /api/users/profile` - Kullanıcı profilini getir
- `PUT /api/users/profile` - Kullanıcı profilini güncelle

## 🔐 Kimlik Doğrulama

### JWT Token Kullanımı

API'ye istek gönderirken header'da token göndermeniz gerekir:

```
Authorization: Bearer <access_token>
```

### Token Yenileme

Access token süresi dolduğunda refresh token ile yeni token alınabilir:

```bash
POST /api/auth/refresh
Body: { "refreshToken": "..." }
```

### Refresh Token Rotation

Her refresh işleminde yeni refresh token üretilir ve eski token geçersiz hale gelir. Bu güvenlik özelliği token çalınma durumlarında zararı sınırlandırır.

### Oturum Yönetimi

- Her kullanıcı için birden fazla oturum (device) desteklenir
- Session tablosunda device bilgisi ve IP adresi saklanır
- `logout-all` endpoint'i ile tüm oturumlar kapatılabilir

## 🐳 Docker

Tüm servisler Docker Compose ile çalıştırılabilir:

```bash
# Servisleri başlat
docker-compose up -d

# Servisleri durdur
docker-compose down

# Servisleri durdur ve volume'ları sil
docker-compose down -v

# Logları görüntüle
docker-compose logs -f
```

### Servis Portları

- **MongoDB**: `localhost:27017`
- **Redis**: `localhost:6379`
- **RabbitMQ**: `localhost:5672` (AMQP), `localhost:15672` (Management UI)
  - Management UI: http://localhost:15672
  - Kullanıcı: `admin` / Şifre: `admin`

## 🔒 Güvenlik Özellikleri

### Rate Limiting

- **IP bazlı**: Her IP adresi için dakikada 100 istek limiti
- **User bazlı**: Authenticated kullanıcılar için ayrı limit
- Redis üzerinden yönetilir
- Response header'larında limit bilgisi döner:
  - `X-RateLimit-Limit`: Maksimum istek sayısı
  - `X-RateLimit-Remaining`: Kalan istek sayısı

### CORS

- Yapılandırılabilir origin listesi
- Environment variable ile kontrol: `CORS_ORIGINS`

### Helmet

- HTTP güvenlik header'ları otomatik eklenir
- XSS, clickjacking ve diğer saldırılara karşı koruma

### Parola Güvenliği

- bcrypt ile hash'leme (salt rounds: 10)
- OTP kodları hash'lenerek saklanır
- Refresh token'lar hash'lenerek session tablosunda tutulur

## 🔌 Socket.io Events

### Namespace: `/realtime`

### Client → Server

- `task:subscribe` - Proje odasına katıl (`projectId` parametresi)
- `task:unsubscribe` - Proje odasından ayrıl

### Server → Client

- `task.created` - Yeni görev oluşturulduğunda
- `task.updated` - Görev güncellendiğinde
- `task.deleted` - Görev silindiğinde
- `comment.added` - Yorum eklendiğinde

### Authentication

Socket bağlantısı için `auth.token` parametresi ile JWT access token gönderilmelidir:

```javascript
const socket = io('http://localhost:3000/realtime', {
  auth: {
    token: 'your-access-token'
  }
});
```

## 🧪 Test

### Backend (Jest)

```bash
# API testleri
pnpm --filter @nodelabs/api test

# Worker testleri
pnpm --filter @nodelabs/worker test
```

### Frontend (Vitest)

```bash
# Test çalıştır
pnpm --filter @nodelabs/web test

# Test UI ile çalıştır
pnpm --filter @nodelabs/web test:ui
```

## 🛠️ Geliştirme Araçları

### Prettier

Kod formatlaması için:

```bash
# Tüm dosyaları formatla
pnpm run format

# Format kontrolü
pnpm run format:check
```

### ESLint

Kod kalitesi kontrolü:

```bash
# Frontend lint
pnpm run lint:web
```

## 📚 Daha Fazla Bilgi

- [Case Study Dokümantasyonu](./Fullstack%20Developer%20Role%20Case%20Study%20-%20Nodelabs.pdf)

