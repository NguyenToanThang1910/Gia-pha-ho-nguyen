# 🏛️ Gia Phả Họ Nguyễn - Thôn Hạ Vỹ, Lý Nhân, Hà Nam

Ứng dụng web quản lý cây phả hệ, danh bạ họ tộc, lịch giỗ truyền thống và phân quyền ban quản trị dòng họ Nguyễn (Thôn Hạ Vỹ, Nhân Chính, Lý Nhân, Hà Nam).

---

## 🌟 Tính năng chính

1. **🌳 Cây Phả Hệ Trực Quan:**
   - Sử dụng thư viện chuyên dụng **Balkan FamilyTree JS**.
   - Hỗ trợ xem đa thế hệ, phóng to/thu nhỏ, kéo thả mượt mà trên cả máy tính và điện thoại.
   - Lọc theo từng đời (Đời 1, Đời 2, Đời 3, Đời 4, Đời 5...).

2. **🕯️ Lịch Giỗ Họ Truyền Thống:**
   - Thuật toán chuyển đổi Âm - Dương chuẩn thiên văn Việt Nam (Hồ Ngọc Đức).
   - Chế độ xem theo tháng hoặc **lưới tổng quan 12 tháng** trong năm.
   - Tự động làm nổi bật các ngày giỗ trong tháng hiện tại và thông báo ngày giỗ sắp tới.

3. **📜 Danh Bạ Họ Tộc & Báo Sinh:**
   - Tra cứu thành viên theo họ tên, thế hệ, ngành/nhánh, tình trạng còn sống/đã mất.
   - Báo sinh / Thêm con thuận tiện cho tất cả bà con trong họ.
   - Hồ sơ chi tiết từng thành viên (ngày sinh, ngày mất, nơi an táng, số điện thoại, ghi chú...).

4. **⚡ Nhập Liệu Hàng Loạt Siêu Tốc (Excel / CSV / Copy-Paste):**
   - Hỗ trợ nhập danh sách hàng chục, hàng trăm thành viên cùng một lúc bằng biểu mẫu bảng tính.
   - Kiểm tra, đối chiếu lỗi và xem trước (preview) trước khi lưu vào cơ sở dữ liệu.

5. **🛡️ Hệ Thống Phân Quyền 5 Cấp:**
   - **Quản lý Hệ thống (Super Admin):** Nguyễn Toàn Thắng (SĐT: `094 999 1515`). Toàn quyền quản trị, phân quyền, cấu hình và sao lưu.
   - **Trưởng Ban Khánh Tiết:** Toàn quyền duyệt thông tin, phân công người thu thập.
   - **Phó Ban Khánh Tiết:** Quyền chỉnh sửa, bổ sung thông tin toàn bộ các ngành.
   - **Kiểm Duyệt Viên:** Duyệt thông tin báo sinh, cập nhật dữ liệu.
   - **Cộng Tác Viên:** Hỗ trợ nhập liệu theo ngành/nhánh được phân công.
   - **Bà con Họ tộc:** Tra cứu gia phả, xem lịch giỗ, gửi báo sinh.

---

## 📁 Cấu Trúc Thư Mục Chuẩn Hóa

```text
GiaPhaHoNguyen/
│
├── index.html              # Giao diện chính của ứng dụng
├── README.md               # Giới thiệu & hướng dẫn tổng quan dự án
│
├── css/
│   └── style.css           # Toàn bộ CSS phong cách giao diện cổ kính, trang nhã
│
├── js/
│   ├── firebase.js         # Khởi tạo kết nối Firebase Database & Authentication
│   ├── admin.js            # Hệ thống phân quyền 5 cấp, đăng nhập & quản lý ban quản trị
│   ├── calendar.js         # Thuật toán âm lịch Việt Nam & hiển thị lịch giỗ 12 tháng
│   ├── family-tree.js      # Khởi tạo & tương tác sơ đồ cây phả hệ Balkan
│   ├── members.js          # Quản lý danh bạ, chi tiết thành viên, nhập Excel siêu tốc
│   └── app.js              # Điểm khởi động (entrypoint), điều hướng tab & sự kiện chung
│
├── data/
│   ├── members_backup.json     # Bản sao lưu dữ liệu thành viên gần nhất
│   ├── mau_thu_thap_gia_pha.csv# Biểu mẫu CSV mẫu để nhập liệu Excel
│   ├── firebase_rules.json     # Quy tắc bảo mật dữ liệu Firebase Realtime Database
│   ├── restore_to_firebase.ps1 # Kịch bản phục hồi dữ liệu lên Firebase
│   └── index.html.bak          # Bản sao lưu gốc trước khi tách module
│
└── docs/
    ├── HUONG_DAN_SU_DUNG.md    # Cẩm nang hướng dẫn sử dụng chi tiết
    ├── HUONG_DAN_SU_DUNG.docx  # Tài liệu hướng dẫn định dạng Word để in ấn
    ├── BIEU_MAU_THU_THAP_GIA_PHA.md # Biểu mẫu và bảng câu hỏi thu thập thông tin
    └── HƯỚNG DẪN DÀNH CHO CÁC GIA ĐÌNH ĐIỀN THÔNG TIN.docx # Hướng dẫn gửi đến từng gia đình
```

---

## 🚀 Hướng Dẫn Chạy Thử Trên Máy (Local)

1. Mở trực tiếp file `index.html` bằng trình duyệt web bất kỳ (Chrome, Cốc Cốc, Edge, Firefox).
2. Hoặc sử dụng tiện ích **Live Server** trong VS Code để trải nghiệm tốt nhất.
