# Ghost Blog Quickstart: Blog Phật Giáo Tối Giản

**Dành cho**: Nhà tu hành muốn chia sẻ cảm nhận về cuộc sống
**Thời gian setup**: ~30 phút
**Chi phí**: Free (local) → $5-10/tháng (deploy)

---

## Phần 1: Cài đặt Ghost (Local)

### Cách 1: Docker (Khuyên dùng - nhanh nhất)

**Ưu điểm**: Dễ cài, dễ xóa, không cắm vào hệ thống

```bash
# 1. Cài Docker (nếu chưa có)
# macOS:
brew install --cask docker

# Ubuntu/Debian:
sudo apt update && sudo apt install docker.io docker-compose

# 2. Tạo thư mục blog
mkdir blog-phat-giao
cd blog-phat-giao

# 3. Tạo docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.1'

services:
  ghost:
    image: ghost:5
    restart: always
    ports:
      - 2368:2368
    environment:
      # Sử dụng SQLite cho đơn giản (đủ cho blog cá nhân)
      database__client: sqlite3
      url: http://localhost:2368
      # Có thể thêm sau khi deploy:
      # url: https://blog-domain.com
    volumes:
      # Lưu content để không mất khi restart container
      - ghost_content:/var/lib/ghost/content

volumes:
  ghost_content:
EOF

# 4. Chạy Ghost
docker-compose up -d

# 5. Chờ ~30 giây, sau đó truy cập
open http://localhost:2368/ghost
```

### Cách 2: Ghost CLI (Cài trực tiếp)

**Ưu điểm**: Control nhiều hơn, phù hợp nếu familiar với Node.js

```bash
# 1. Cài Ghost CLI
npm install ghost-cli@latest -g

# 2. Tạo thư mục và cài Ghost
mkdir blog-phat-giao
cd blog-phat-giao
ghost install local

# 3. Setup admin tại lần truy cập đầu
open http://localhost:2368/ghost
```

---

## Phần 2: Setup Admin Lần Đầu

### Tài khoản Admin

Truy cập `http://localhost:2368/ghost`:

1. **Create your account**:
   - Site title: Ví dụ "Tịnh Thiền" hoặc tên bạn muốn
   - Full name: Tên của bạn
   - Email: Email admin
   - Password: Mật khẩu mạnh

2. **Invite your team**: Bỏ qua (chỉ 1 admin)

3. **Explore Ghost** → Click "I'll do this later"

---

## Phần 3: Cấu Hình Cho Vibe Phật Giáo / Zen

### 3.1 Chọn Theme

Ghost có nhiều themes minimal đẹp. Khuyên dùng:

| Theme | Style | Phù hợp |
|-------|-------|---------|
| **Casper** (default) | Clean, minimal | ✅ Zen, dễ đọc |
| **Ease** | Typography-focused | ✅ Tập trung nội dung |
| **Attila** | Bold typography | ✅ Có cá tính hơn |
| **Massively** | Modern, bold | ❌ Quá mạnh |

**Cài theme**:

1. Download theme từ https://ghost.org/themes/
2. Admin > Settings > Theme > Upload theme
3. Activate theme

### 3.2 Custom CSS Để Match Vibe Tịnh Thiền

Admin > Settings > Code Injection > Site Header:

```html
<style>
  /* Font chữ hỗ trợ tiếng Việt */
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Noto+Sans:wght@400;500;600&display=swap');

  :root {
    /* Màu sắc nhẹ nhàng, bình an */
    --color-bg: #FAF9F6;        /* Off-white */
    --color-text: #4A4A4A;      /* Soft charcoal - dễ đọc */
    --color-accent: #8B9A6D;    /* Muted sage green */
    --color-border: #E8E8E8;    /* Subtle border */

    /* Font chữ */
    --font-body: 'Noto Sans', sans-serif;
    --font-heading: 'Noto Serif', serif;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: 1.8; /* Thêm không trắng để dễ đọc */
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 700;
    color: #3A3A3A;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  /* Khoảng trắng nhiều hơn */
  .post-content {
    max-width: 680px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  .post-content p {
    margin-bottom: 1.5rem;
  }

  /* Link nhẹ nhàng */
  a {
    color: var(--color-accent);
    transition: color 0.2s ease;
  }

  a:hover {
    color: #6B7A5D;
  }

  /* Button/button-style elements */
  .gh-btn,
  button {
    background-color: var(--color-accent);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .gh-btn:hover,
  button:hover {
    background-color: #6B7A5D;
  }
</style>
```

### 3.3 Cấu Hình Site Settings

Admin > Settings > General:

| Setting | Khuyên dùng |
|---------|-------------|
| **Site title** | Tịnh Thiền / [Tên bạn] |
| **Site description** | Chia sẻ cảm nhận về cuộc sống |
| **Site timezone** | Asia/Ho_Chi_Minh |
| **Language** | Vietnamese (vi) |
| **Meta title** | Tịnh Thiền - Blog Phật Giáo |
| **Meta description** | Nơi chia sẻ cảm nhận về cuộc sống từ góc nhìn thiền |
| **Twitter handle** | (nếu có) |
| **Facebook share** | (nếu muốn) |

### 3.4 Navigation (Menu)

Admin > Settings > Navigation > Secondary Navigation:

```json
[
  {"label": "Trang chủ", "url": "/"},
  {"label": "Về tôi", "url": "/about"},
  {"label": "Pháp thoại", "url": "/tag/phap-thoai"},
  {"label": "Thiền", "url": "/tag/thien"},
  {"label": "Cuộc sống", "url": "/tag/cuoc-song"}
]
```

---

## Phần 4: Viết Bài Đầu Tiên

### 4.1 Tạo Tags (Chủ đề)

Admin > Tags > New Tag:

1. **Pháp thoại** (phap-thoai) - Mô tả: Các bài pháp thoại
2. **Thiền** (thien) - Mô tả: Chuyện về thiền định
3. **Cuộc sống** (cuoc-song) - Mô tả: Suy nghĩ về cuộc sống
4. **Sự việc** (su-viec) - Mô tả: Các sự việc

### 4.2 Viết Post

Admin > Posts > New Post:

```
Title: Chào mừng đến với Tịnh Thiền

Tag: Pháp thoại

Content:
# Chào mừng

Đây là nơi tôi chia sẻ những cảm nhận về cuộc sống từ góc nhìn của một người tu hành.

## Tôi viết về gì?

- Pháp thoại
- Thiền định
- Cảm nhận về cuộc sống
- Những sự việc bình dị

Mong tìm thấy sự bình an trong từng dòng chữ.

---
```

### 4.3 Publish

1. Click "Publish" (góc trên phải)
2. Chọn:
   - Publish right now: Xuất bản ngay
   - Set it live later: Lên lịch
3. Add excerpt (tóm tắt) - sẽ hiển thị ở trang chủ
4. Click "Publish" × 2

---

## Phần 5: Deploy lên Server

### Option 1: DigitalOcean App Platform (Dễ nhất)

**Chi phí**: ~$5-10/tháng

1. Push code lên GitHub (hoặc connect Git repo)
2. DigitalOcean > Apps > Create App
3. Chọn source: GitHub
4. Chọn repo (nếu chưa có, tạo repo ghost)
5. Config:
   ```yaml
   Name: blog-phat-giao
   Region: Singapore (gần Việt Nam)
   Builder: Dockerfile
   Dockerfile Path: ./Dockerfile
   HTTP Port: 2368
   ```
6. Tạo `Dockerfile`:
   ```dockerfile
   FROM ghost:5-alpine
   # Config environment trong DigitalOcean dashboard
   ```
7. Deploy!

### Option 2: Railway (Dễ nhất, có free tier)

1. Vào https://railway.app/
2. New Project > Deploy from Dockerfile
3. Chọn GitHub repo
4. Railway tự detect Ghost
5. Add environment variables:
   - `url=https://your-domain.railway.app`
6. Deploy xong, Railway cấp domain luôn

### Option 3: VPS (Tự quản lý)

```bash
# SSH vào VPS
ssh root@your-server-ip

# Cài Docker
curl -fsSL https://get.docker.com | sh

# Clone repo (hoặc tạo docker-compose.yml như ở local)
git clone your-repo
cd your-repo

# Chạy
docker-compose up -d

# Setup domain (nginx, certbot cho HTTPS)
```

### Tùy chỉnh Production URL

Sau khi deploy:

1. Admin > Settings > General
2. Change `http://localhost:2368` → `https://your-domain.com`
3. Restart Ghost

---

## Phần 6: Domain & Email

### Domain

Mua domain (nếu chưa có):
- Pavietnam: ~100k/năm
- Matbao: ~100k/năm
- Namecheap: ~$10/năm

DNS A Record:
```
Type: A
Name: @
Value: IP của server
```

### Email (Tùy chọn)

Gmail alias cho custom domain:
- Google Workspace: ~$6/user/tháng
- Zoho Mail: Free (1 user)

---

## Phần 7: Backup & Maintenance

### Backup (Ghost Content)

Ghost content nằm trong `/var/lib/ghost/content`:

```bash
# Local Docker
docker cp blog-phat-giao_ghost_1:/var/lib/ghost/content ./backup-$(date +%Y%m%d)

# Tự động backup (crontab)
0 2 * * * docker cp blog-phat-giao_ghost_1:/var/lib/ghost/content ~/backups/blog-$(date +\%Y\%m\%d)
```

### Update Ghost

```bash
# Docker
docker-compose pull
docker-compose up -d

# Ghost CLI
ghost update
```

---

## Phần 8: Workflow Hàng Ngày

### Viết bài

1. Login: `your-domain.com/ghost`
2. Posts > New Post
3. Viết (Markdown)
4. Gán tags
5. Publish

### Tương tác với độc giả

**Ghost không có comments mặc định** (đúng yêu cầu của bạn!)

Nếu muốn thêm sau (optional):
- Disqus: https://disqus.com
- Isso: Self-hosted comments
- Commento: Open source

### Analytics

Ghost có built-in analytics:
- Admin > Analytics

Hoặc add Google Analytics:
- Admin > Settings > Integration > Google Analytics

---

## Phần 9: Troubleshooting

### Port 2368 bị chiếm

```bash
# Kiểm tra
lsof -i :2368

# Kill process
kill -9 <PID>
```

### Ghost không start

```bash
# Check logs
docker-compose logs -f ghost

# Restart
docker-compose restart
```

### Không truy cập được /ghost

```bash
# Đảm bảo Ghost đang chạy
docker-compose ps

# Rebuild
docker-compose up -d --build
```

---

## Phần 10: Resources

### Ghost Themes

- Official: https://ghost.org/themes/
- Free themes: https://marketplace.ghost.org/

### Custom Domain

- Cheap: Pavietnam, Matbao
- International: Namecheap

### Hosting

- DigitalOcean: https://digitalocean.com
- Railway: https://railway.app
- Linode: https://linode.com

---

## Checklist Trước Khi Deploy

- [ ] Setup Ghost local OK
- [ ] Viết 3-5 bài đầu tiên
- [ ] Chọn theme & custom CSS
- [ ] Setup tags (chủ đề)
- [ ] Mua domain (nếu muốn)
- [ ] Chọn hosting provider
- [ ] Deploy
- [ ] Test trên mobile
- [ ] Setup backup schedule
- [ ] (Optional) Add analytics

---

## Notes

- **Content is king**: Đừng lo quá về design, tập trung vào nội dung
- **Simple is better**: Blog cá nhân không cần quá nhiều features
- **Backup thường xuyên**: Content là quý nhất
- **Ghost version**: Hiện tại stable là Ghost 5.x

---

**Chúc bạn có một blog bình an, mang lại giá trị cho người đọc!** 🕊️
