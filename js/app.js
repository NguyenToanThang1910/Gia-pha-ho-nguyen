// ==================== VÒNG ĐỜI & ĐIỀU HƯỚNG ỨNG DỤNG (APP CORE) ====================

// Trạng thái toàn cục dùng chung
let familyMembers = [];
let pendingRequests = [];
let adminList = {
    'nguyentoanthang_master': {
        name: 'Nguyễn Toàn Thắng',
        email: 'ntthang.tc@tdapt.com',
        phone: '094 999 1515',
        role: 'SUPER_ADMIN',
        title: 'Quản Lý Hệ Thống',
        addedAt: 'Khởi tạo hệ thống'
    }
};
let currentRole = 'USER'; // 'USER', 'SUPER_ADMIN', 'TRUONG_BAN', 'PHO_BAN', 'MODERATOR', 'COLLABORATOR'
let currentUser = null;
let currentSelectedId = null;
let activeView = 'tree'; // 'tree', 'list', 'memorial'

// ==================== KHỞI CHẠY ỨNG DỤNG ====================
window.onload = function() {
    // 1. Tính toán ngày âm lịch hôm nay
    todaySolar = new Date();
    todayLunar = convertSolar2Lunar(todaySolar.getDate(), todaySolar.getMonth() + 1, todaySolar.getFullYear());
    selectedMemorialMonth = todayLunar.month;

    // 2. Tự động nạp lại email admin đã lưu từ lần đăng nhập trước
    const savedEmail = localStorage.getItem('giapha_admin_email');
    const authEmailInput = document.getElementById('auth-email');
    if (savedEmail && authEmailInput) {
        authEmailInput.value = savedEmail;
    }

    // 3. Khởi chạy các listener của Firebase
    listenAuth();
    listenFirebaseData();
};

// ==================== LẮNG NGHE FIREBASE ====================
function listenAuth() {
    auth.onAuthStateChanged((user) => {
        currentUser = user;
        evaluateUserRole();
    });
}

function listenFirebaseData() {
    // 1. Dữ liệu thành viên gia phả
    db.ref('members').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            if (Array.isArray(data)) {
                familyMembers = data.filter(Boolean);
            } else {
                familyMembers = Object.values(data);
            }
        } else {
            familyMembers = [];
        }
        refreshCurrentView();
    });

    // 2. Dữ liệu đề xuất duyệt
    db.ref('requests').on('value', (snapshot) => {
        const reqData = snapshot.val();
        pendingRequests = reqData ? Object.values(reqData) : [];
        updateRequestsBadge();
        if (document.getElementById('requestsModal') && document.getElementById('requestsModal').classList.contains('active')) {
            renderRequestsList();
        }
    });

    // 3. Dữ liệu phân quyền Ban Quản Trị
    db.ref('admins').on('value', (snapshot) => {
        adminList = snapshot.val() || {};
        
        // Đảm bảo thông tin Quản Lý Hệ Thống Nguyễn Toàn Thắng luôn có mặt
        const hasSuper = Object.values(adminList).some(a => a.role === 'SUPER_ADMIN' || a.name === 'Nguyễn Toàn Thắng');
        if (!hasSuper) {
            adminList['nguyentoanthang_master'] = {
                name: 'Nguyễn Toàn Thắng',
                email: ROOT_ADMIN_EMAIL,
                phone: '094 999 1515',
                role: 'SUPER_ADMIN',
                title: 'Quản Lý Hệ Thống',
                addedAt: 'Khởi tạo hệ thống'
            };
        }

        evaluateUserRole();
        const adminsModalEl = document.getElementById('adminsModal');
        if (adminsModalEl && adminsModalEl.classList.contains('active')) {
            renderAdminsList();
        }
    }, (error) => {
        console.warn("Lưu ý: Không thể tải danh sách admins từ Firebase:", error.message);
        evaluateUserRole();
    });
}

// ==================== ĐIỀU HƯỚNG CHẾ ĐỘ XEM (VIEW SWITCHER) ====================
function switchView(viewName) {
    activeView = viewName;
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-tab-btn').forEach(el => el.classList.remove('active'));

    const targetView = document.getElementById(`view-${viewName}`);
    const targetTab = document.getElementById(`tab-${viewName}`);
    if (targetView) targetView.classList.add('active');
    if (targetTab) targetTab.classList.add('active');

    if (viewName === 'tree') {
        if (!familyTreeInstance) initFamilyTree();
    } else if (viewName === 'list') {
        renderListView();
    } else if (viewName === 'memorial') {
        renderMemorialView();
    }
}

function refreshCurrentView() {
    if (activeView === 'tree') {
        initFamilyTree();
    } else if (activeView === 'list') {
        renderListView();
    } else if (activeView === 'memorial') {
        renderMemorialView();
    }
}

// ==================== MODAL HELPERS ====================
function openModal(id) {
    const modalEl = document.getElementById(id);
    if (modalEl) {
        modalEl.classList.add('active');
    } else {
        console.error("Không tìm thấy modal với id:", id);
    }
}

function closeModal(id) {
    const modalEl = document.getElementById(id);
    if (modalEl) {
        modalEl.classList.remove('active');
    }
}

// Đóng modal khi bấm chuột ra vùng nền tối bên ngoài
window.addEventListener('click', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ==================== XỬ LÝ TẢI ẢNH CHÂN DUNG ====================
function handleImageUpload(event, previewId, dataInputId, previewWrapId) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG)!');
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB để đảm bảo tốc độ tải.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        document.getElementById(dataInputId).value = base64;
        document.getElementById(previewId).src = base64;
        document.getElementById(previewWrapId).style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

function clearUploadedImage(previewId, dataInputId, previewWrapId) {
    document.getElementById(dataInputId).value = '';
    document.getElementById(previewId).src = '';
    document.getElementById(previewWrapId).style.display = 'none';
}
