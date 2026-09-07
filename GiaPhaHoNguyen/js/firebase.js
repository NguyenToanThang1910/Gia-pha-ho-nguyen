// ==================== CẤU HÌNH & KHỞI TẠO FIREBASE ====================
const firebaseConfig = {
    apiKey: atob("QUl6YVN5RGVzZ3lwU3NsU2FyazhIdlFlU1JtaUdrSHE0Y1BPS3Nj"),
    authDomain: "giapha-honguyen.firebaseapp.com",
    databaseURL: "https://giapha-honguyen-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "giapha-honguyen",
    storageBucket: "giapha-honguyen.firebasestorage.app",
    messagingSenderId: "80694043619",
    appId: "1:80694043619:web:e5de0ef559b3bf35d9f6d6"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Các hằng số hệ thống
const DEFAULT_AVATAR = "https://cdn.balkan.app/shared/default-user.png";
const ROOT_ADMIN_EMAIL = "ntthang.tc@tdapt.com";
const SUPER_ADMIN_PHONES = ['094 999 1515', '0949991515'];
