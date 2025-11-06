# Chạy ứng dụng tại máy (đơn giản)

Repo này là frontend React sử dụng chế độ dữ liệu giả lập trong bộ nhớ. Các bước sau giúp bạn nhanh chóng clone, cài đặt và chạy ứng dụng trên máy để mở bằng trình duyệt.

Yêu cầu

- Node.js (khuyến nghị bản 16 hoặc 18)
- npm (đi kèm Node)

Khởi động nhanh

1. Clone repository

```bash
git clone <REPO_URL>
cd mini-market-frontend
```

2. Cài đặt phụ thuộc

```bash
npm install
```

3. Khởi động ứng dụng

Dự án chạy server phát triển React. Mặc định ứng dụng dùng dữ liệu giả lập (không cần backend riêng).

```bash
npm run start
```

4. Mở ứng dụng trên trình duyệt

- Truy cập: http://localhost:3000

Ghi chú & xử lý lỗi

- Chế độ dữ liệu: dự án dùng chế độ giả lập mặc định. Nếu cần đổi chế độ, sửa `src/config/index.js` và đặt `dataMode` thành `mock` (mặc định) hoặc chế độ khác hỗ trợ.

- Cổng: nếu `:3000` đã dùng, server sẽ hỏi chọn cổng khác. Bạn cũng có thể đặt biến môi trường `PORT` trước khi khởi động:

```bash
PORT=3001 npm run start
```

- Nếu server báo lỗi thiếu phụ thuộc, hãy chạy lại `npm install`. Nếu thấy tham chiếu JSON Server, chúng đã bị loại bỏ ở nhánh này — ứng dụng chỉ dùng dữ liệu giả lập.

- Script kiểm tra nhanh: để in ra các header giá và dòng giá từ dataset giả lập, chạy:

```bash
node scripts/verify-prices.js
```

- Lỗi thường gặp: Nếu `npm run start` thoát với mã 130 hoặc tương tự, kiểm tra không có server phát triển hoặc tiến trình khác chiếm cổng. Có thể giải phóng cổng (ví dụ trên macOS):

```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
```

Nếu gặp lỗi, hãy dán output terminal tại đây để được hỗ trợ.

---

Chỉ hướng dẫn tối giản — nếu bạn muốn file `README.md` dài hơn với hướng dẫn phát triển, kiểm thử hoặc đóng góp, hãy báo cho tôi.
