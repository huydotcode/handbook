# 🌐 Handbook - Mạng Xã Hội Thế Hệ Mới

Handbook là một nền tảng mạng xã hội hiện đại được xây dựng bằng **Next.js**, cung cấp trải nghiệm người dùng mượt mà và đầy đủ tính năng như đăng bài, kết bạn, trò chuyện, nhóm, và marketplace buôn bán.

## 🚀 Demo

👉 [Link Demo](https://handbookk.vercel.app/)

---

## 🎯 Tính năng chính

### 📝 Đăng bài, cảm xúc & bình luận

- Người dùng có thể tạo bài viết (văn bản, hình ảnh, video)
- Thả cảm xúc: ❤️ 😆 😮 😢 😡
- Bình luận bài viết & phản hồi bình luận

### 💬 Nhắn tin & Kết bạn

- Gửi lời mời kết bạn, xác nhận hoặc từ chối
- Gửi tin nhắn riêng tư 1:1
- Hệ thống chat thời gian thực (WebSocket/Socket.IO)

### 👤 Trang cá nhân (Profile)

- Hiển thị thông tin cá nhân, ảnh đại diện, ảnh bìa
- Danh sách bạn bè, bài viết, followers/followings
- Chỉnh sửa thông tin cá nhân

### 🛒 Chợ Mạng Xã Hội (Marketplace)

- Mỗi người dùng có thể đăng bài rao bán sản phẩm
- Danh mục sản phẩm, tìm kiếm và lọc theo loại, giá
- Tính năng "Chat để thương lượng"

### 👥 Nhóm (Groups)

- Tạo nhóm riêng tư hoặc công khai
- Đăng bài trong nhóm
- Chat nhóm giữa các thành viên

### 🌙 Dark Mode

- Hỗ trợ chuyển đổi giữa Light / Dark Mode
- Giao diện thân thiện với mắt người dùng

### 🔍 Tìm kiếm

- Tìm kiếm bài viết, người dùng, nhóm
- Tìm kiếm nâng cao với bộ lọc theo loại nội dung, thời gian

### 🔔 Notification

- Thông báo thời gian thực cho:
    - Lượt thích, bình luận, yêu cầu kết bạn, tin nhắn mới
- Hệ thống popup + trung tâm thông báo

### 📱 Responsive

- Hỗ trợ hiển thị trên nhiều thiết bị (mobile, tablet, desktop)
- Thiết kế linh hoạt, dễ dàng tùy chỉnh

### 🔒 Bảo mật

- Xác thực người dùng qua OAuth (Google, Credential)
- Mã hóa dữ liệu nhạy cảm

### 🌐 SEO Tối ưu

- Tối ưu hóa SEO cho các trang bài viết, nhóm, người dùng
- Sử dụng metadata, Open Graph tags
- Tốc độ tải trang nhanh với Next.js
- Tối ưu hóa hình ảnh với Cloudinary

## 🧑‍💻 Công nghệ sử dụng

| Tech                                            | Mô tả                                   |
| ----------------------------------------------- | --------------------------------------- |
| [Next.js](https://nextjs.org)                   | Framework React tối ưu SEO và hiệu suất |
| [Tailwind CSS](https://tailwindcss.com)         | Styling nhanh và responsive             |
| [ShadCN/UI](https://ui.shadcn.dev/)             | Giao diện hiện đại, dễ tuỳ biến         |
| [Socket.IO](https://socket.io/)                 | Giao tiếp thời gian thực (chat, notif)  |
| [React Query](https://tanstack.com/query)       | Quản lý data và cache hiệu quả          |
| [Axios](https://axios-http.com/)                | Gọi API REST dễ dàng và linh hoạt       |
| [React Hook Form](https://react-hook-form.com/) | Xử lý form hiệu quả và nhanh gọn        |
| [Cloudinary]                                    | Lưu trữ hình ảnh và media (tuỳ chọn)    |

---

## 📦 Cài đặt

```bash
# Clone dự án
git clone https://github.com/huydotcode/handbook
cd handbook

# Cài đặt dependencies
npm install

# Tạo file môi trường
cp .env

# Sau đó điền các biến môi trường cần thiết (API_URL, NEXTAUTH_SECRET,...)
GOOGLE_API_KEY=
MONGODB_URI=
SERVER_API=
NEXTAUTH_URL_INTERNAL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
JWT_SECRET=

# Chạy dự án
npm run dev
```
