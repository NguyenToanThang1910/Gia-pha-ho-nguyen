# HỆ THỐNG GIA PHẢ GIA TỘC HỌ NGUYỄN (PHIÊN BẢN 2.2)
**Thôn Hạ Vỹ, Xã Nhân Chính, Huyện Lý Nhân, Tỉnh Hà Nam**

- Thư mục dự án: `D:\GiaPhaHoNguyen`  
- Trang web chính thức: [https://ntthangtc-design.github.io/Gia-pha-ho-nguyen/](https://ntthangtc-design.github.io/Gia-pha-ho-nguyen/)  
- **Quản Lý Hệ Thống (Super Admin):** **Nguyễn Toàn Thắng** (📞 **094 999 1515**)

---

## 📁 Cấu trúc thư mục dự án

```text
D:\GiaPhaHoNguyen\
├── index.html                     # Toàn bộ mã nguồn trang web (Giao diện V2.2)
├── members_backup.json            # File sao lưu dữ liệu gốc 26 thành viên (Thế hệ 1 - 7)
├── firebase_rules.json            # Quy tắc bảo mật Firebase Realtime Database
├── restore_to_firebase.ps1        # Script PowerShell khôi phục dữ liệu lên Firebase
├── BIEU_MAU_THU_THAP_GIA_PHA.md   # Biểu mẫu in giấy/phát Zalo thu thập thông tin các gia đình
├── mau_thu_thap_gia_pha.csv       # File bảng tính mẫu Excel để điền dữ liệu hàng loạt
└── HUONG_DAN_SU_DUNG.md           # Tài liệu hướng dẫn chi tiết toàn diện này
```

---

## 💡 1. Hướng Dẫn Chuyển Đổi Sang Gmail Cá Nhân Miễn Phí (Google / Firebase)

> ⚠️ **LƯU Ý CỰC KỲ QUAN TRỌNG:**  
> Email `ntthang.tc@tdapt.com` là email Google Workspace trả phí và hiện đã dừng hoạt động.  
> Toàn bộ hệ thống Gia Phả chạy trên **gói miễn phí trọn đời (Spark Plan)** của Firebase.  
> **Anh Thắng cần chuyển sang dùng Gmail cá nhân (dạng `...@gmail.com`) miễn phí theo 3 bước sau:**

### Bước 1: Thêm Gmail cá nhân làm Chủ Sở Hữu (Owner) Dự Án Firebase
*(Thực hiện nếu tài khoản Google Workspace cũ vẫn còn đang mở phiên đăng nhập trên trình duyệt)*
1. Truy cập vào 👉 **[Firebase Console](https://console.firebase.google.com/)**.
2. Nhấp chọn dự án **`giapha-honguyen`**.
3. Bấm vào biểu tượng **Bánh răng cài đặt (⚙️)** ở góc trên thanh menu trái ➔ Chọn **Project settings** (Cài đặt dự án).
4. Chọn tab **Users and permissions** (Người dùng và quyền) ➔ Bấm nút **Add member** (Thêm thành viên).
5. Nhập địa chỉ **Gmail cá nhân miễn phí của anh Thắng** (VD: `nguyentoanthang... @gmail.com`).
6. Ở ô **Role (Vai trò)**: Chọn **Owner** (Chủ sở hữu).
7. Bấm **Done** / **Add member**.  
*(Từ nay về sau, anh Thắng chỉ cần dùng Gmail cá nhân này để đăng nhập quản trị toàn bộ dự án Firebase trọn đời).*

### Bước 2: Tạo tài khoản đăng nhập trên Firebase Authentication
1. Vẫn trong [Firebase Console](https://console.firebase.google.com/), nhìn menu bên trái chọn **Authentication** (Xác thực).
2. Chọn tab **Users** ➔ Bấm nút **Add user** (Thêm người dùng).
3. Nhập **Gmail cá nhân của anh** và đặt **Mật khẩu quản trị** (tối thiểu 6 ký tự) ➔ Bấm **Add user**.

### Bước 3: Đăng nhập trên trang web Gia Phả
1. Mở trang web gia phả ➔ Bấm nút **`🔐 Admin`** ở góc trên bên phải.
2. Gõ Gmail cá nhân và Mật khẩu vừa tạo ở Bước 2 ➔ Bấm **Đăng Nhập Ngay**.
3. Hệ thống sẽ tự động nhận diện anh **Nguyễn Toàn Thắng** với vai trò **`⚙️ Quản Lý Hệ Thống`** và trình duyệt sẽ tự động ghi nhớ tài khoản cho các lần sau!

---

## 👥 2. Cấu Trúc Phân Quyền & Quản Lý Đội Ngũ Họ Tộc (5 Cấp Độ)

Hệ thống được thiết kế theo cấu trúc phân quyền rõ ràng, hỗ trợ đắc lực cho công tác thu thập và cập nhật thông tin họ:

| Cấp bậc | Chức danh | Huy hiệu hiển thị | Quyền hạn trong hệ thống |
| :--- | :--- | :--- | :--- |
| **Cấp 1** | **Quản Lý Hệ Thống** | `⚙️ Quản Lý Hệ Thống: Nguyễn Toàn Thắng` | Vị trí cao nhất, bảo vệ vĩnh viễn không thể bị xóa. Toàn quyền kỹ thuật, phân quyền, chỉ định và thu hồi mọi chức danh, duyệt bài, sửa/xóa trực tiếp, nhập nhanh Excel, tải sao lưu. |
| **Cấp 2** | **Trưởng Ban Quản Trị** | `👑 Trưởng Ban: [Tên]` | Được Quản Lý Hệ Thống chỉ định. Toàn quyền quản trị nội dung: Duyệt đề xuất, thêm/sửa trực tiếp, phân công người duyệt và người đi thu thập, tải sao lưu. |
| **Cấp 3** | **Phó Ban Quản Trị** | `🛡️ Phó Ban: [Tên]` | Hỗ trợ Trưởng ban: Duyệt đề xuất con cháu, thêm/sửa thành viên trực tiếp, tải sao lưu. |
| **Cấp 4** | **Người Duyệt Thông Tin** | `📋 Người Duyệt: [Tên]` | Chuyên trách kiểm duyệt các đề xuất sửa và giấy báo sinh do con cháu gửi lên. |
| **Cấp 5** | **Ban Thu Thập Thông Tin** | `📝 Ban Thu Thập: [Tên]` | **Dành cho các thành viên đi các chi/nhánh thu thập dữ liệu.** Được cấp quyền dùng nút **`➕ Thêm Trực Tiếp`** và **`📥 Nhập Nhanh`** để tự nhập dữ liệu vào phả hệ mà không cần chờ duyệt! |
| **Cấp 0** | **Con Cháu Trong Họ** | `👤 Con Cháu` | Xem cây phả hệ, xem danh bạ, xem lịch giỗ 12 tháng, gửi Báo sinh em bé mới và gửi Đề xuất sửa đổi thông tin. |

### Cách Quản Lý Hệ Thống (Anh Thắng) phân quyền cho thành viên:
1. Đăng nhập web với tài khoản Quản Lý Hệ Thống.
2. Bấm nút **`👥 Phân Quyền`** trên thanh Header.
3. Cuộn xuống khung **➕ Thêm & Phân Quyền Thành Viên Mới**:
   - **Họ và Tên:** Tên người được giao nhiệm vụ (VD: `Bác Nguyễn Văn Nam`).
   - **Số điện thoại:** SĐT liên hệ.
   - **Email đăng nhập:** Email của họ (hoặc anh tự đặt email cho họ).
   - **Mật khẩu:** Đặt mật khẩu cho họ (tối thiểu 6 ký tự).
   - **Chức danh phân công:** Chọn chức danh tương ứng (`👑 Trưởng Ban`, `🛡️ Phó Ban`, `📋 Người Duyệt` hoặc `📝 Ban Thu Thập`).
4. Bấm **`➕ Cấp Quyền & Tạo Tài Khoản Cho Người Này`**.
5. Gửi đường link web, email và mật khẩu cho người đó. Họ bấm **`🔐 Admin`** là có thể bắt đầu làm việc ngay!

---

## 🕯️ 3. Hướng Dẫn Sử Dụng Lịch Giỗ 12 Tháng (Âm - Dương Lịch)

Bấm vào tab **`🕯️ Lịch Giỗ Họ`**, hệ thống cung cấp 3 góc nhìn toàn diện:

1. **Banner Âm - Dương Lịch Hôm Nay:**
   - Tự động tính chuẩn xác ngày/tháng Âm lịch và Dương lịch theo thuật toán thiên văn Việt Nam (Hồ Ngọc Đức).
   - Hiển thị số lượng cụ giỗ trong tháng Âm lịch hiện tại.
   - Báo động đỏ nổi bật: `🔥 HÔM NAY GIỖ CỤ: [Tên Cụ]` nếu ngày hôm nay trùng ngày giỗ cụ nào.
2. **3 Chế độ xem linh hoạt:**
   - 🗓️ **12 Tháng Toàn Cảnh (Grid View):** 12 ô thẻ tháng từ Tháng 1 (Giêng) đến Tháng 12 (Chạp).
     - **Tháng hiện tại (Âm lịch):** Nổi bật viền vàng kim rực rỡ và huy hiệu `⭐ THÁNG HIỆN TẠI (ÂL)`.
     - Cụ nào sắp đến giỗ (trong 7 ngày tới) được gắn cờ cam: `⏳ Sắp đến giỗ (còn X ngày)`.
   - 📆 **Xem Từng Tháng Chi Tiết:** Có 12 nút bấm từ Tháng 1 ➔ Tháng 12. Bấm vào tháng nào sẽ hiển thị danh sách chi tiết các cụ giỗ tháng đó (có ảnh chân dung, thế hệ, mộ phần).
   - 📜 **Danh Sách Đầy Đủ:** Bảng tra cứu toàn thể ngày giỗ các cụ từ đầu năm đến cuối năm.

---

## 📥 4. Quy Trình Thu Thập Dữ Liệu Ban Đầu Cho Toàn Họ

### Phương án 1: Ban Thu Thập đi phát giấy / gửi mẫu Zalo (Khuyên dùng cho các cụ lớn tuổi)
1. In biểu mẫu trong file `BIEU_MAU_THU_THAP_GIA_PHA.md` ra giấy A4 (hoặc copy gửi file vào nhóm Zalo họ).
2. Phát cho các gia đình tự điền thông tin con cháu của họ.
3. Ban Thu Thập chỉ việc **chụp ảnh hoặc scan các tờ giấy điền đó và gửi cho tôi (AI) tổng hợp**. Tôi sẽ tự động phân tích quan hệ cha - con, thế hệ và nạp toàn bộ vào cơ sở dữ liệu cho dòng họ!

### Phương án 2: Nhập Nhanh Trực Tiếp Bằng Excel Trên Web
1. Mở file mẫu `mau_thu_thap_gia_pha.csv` bằng Excel.
2. Điền danh sách các thành viên (Họ tên, Đời, Cha/Mẹ, Giới tính, Sinh, Mất, Vợ/Chồng, Nơi táng, Ghi chú).
3. Đăng nhập tài khoản Quản Lý Hệ Thống hoặc Ban Thu Thập ➔ Bấm nút **`📥 Nhập Nhanh`** trên Header.
4. Copy các dòng từ Excel dán vào khung ➔ Bấm **`👁️ Kiểm Tra & Xem Trước`** ➔ Bấm **`✅ Xác Nhận Lưu Toàn Bộ Vào Phả Hệ`**. Toàn bộ dữ liệu sẽ được nạp vào phả hệ tức thì!

---

## 🚀 5. Đưa Bản Cập Nhật Mới Nhất Lên GitHub Pages

Sau khi mã nguồn được cập nhật:
1. Mở liên kết: 👉 **[https://github.com/ntthangtc-design/Gia-pha-ho-nguyen/blob/main/index.html](https://github.com/ntthangtc-design/Gia-pha-ho-nguyen/blob/main/index.html)**
2. Bấm vào biểu tượng **cây bút chì** (`Edit this file`).
3. Mở file `D:\GiaPhaHoNguyen\index.html`, nhấn `Ctrl + A` rồi `Ctrl + C`.
4. Quay lại GitHub, nhấn `Ctrl + A` rồi `Ctrl + V` dán đè vào.
5. Cuộn xuống bấm nút xanh **Commit changes**.
6. Chờ khoảng 1 - 2 phút, toàn bộ tính năng và phân quyền mới sẽ hoạt động trực tiếp trên trang web của dòng họ!
