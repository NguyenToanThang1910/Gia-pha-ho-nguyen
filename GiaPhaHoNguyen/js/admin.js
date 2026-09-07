// ==================== QUẢN TRỊ VIÊN & PHÂN QUYỀN HỆ THỐNG ====================

// Kiểm tra quyền hạn theo vai trò
function canDirectEdit() {
    return ['SUPER_ADMIN', 'TRUONG_BAN', 'ROOT_ADMIN', 'PHO_BAN', 'CO_ADMIN', 'MODERATOR', 'COLLABORATOR'].includes(currentRole);
}

function canApprove() {
    return ['SUPER_ADMIN', 'TRUONG_BAN', 'ROOT_ADMIN', 'PHO_BAN', 'CO_ADMIN', 'MODERATOR'].includes(currentRole);
}

function canDeleteMember() {
    return ['SUPER_ADMIN', 'TRUONG_BAN', 'ROOT_ADMIN'].includes(currentRole);
}

function canManageAdmins() {
    return ['SUPER_ADMIN', 'TRUONG_BAN', 'ROOT_ADMIN'].includes(currentRole);
}

// Đánh giá vai trò người dùng hiện tại
function evaluateUserRole() {
    if (!currentUser) {
        currentRole = 'USER';
    } else {
        const email = (currentUser.email || '').toLowerCase().trim();
        const safeKey = email.replace(/\./g, '_');
        const adminRecord = adminList[safeKey];

        // Kiểm tra Quản Lý Hệ Thống (Nguyễn Toàn Thắng)
        const isSuper = (
            email === ROOT_ADMIN_EMAIL.toLowerCase() ||
            (adminRecord && adminRecord.role === 'SUPER_ADMIN') ||
            (adminRecord && SUPER_ADMIN_PHONES.includes(adminRecord.phone)) ||
            (adminRecord && adminRecord.name === 'Nguyễn Toàn Thắng')
        );

        if (isSuper) {
            currentRole = 'SUPER_ADMIN';
        } else if (adminRecord && adminRecord.role) {
            currentRole = adminRecord.role;
        } else {
            // Nếu tài khoản mới đăng nhập mà email có dạng ntthang/toanthang hoặc hệ thống chưa có ai ngoài mặc định
            // -> Tự động nhận diện là anh Thắng quản lý hệ thống và lưu cập nhật email mới vào node admins
            if (email.includes('ntthang') || email.includes('toanthang') || Object.keys(adminList).length <= 1) {
                currentRole = 'SUPER_ADMIN';
                db.ref('admins/' + safeKey).set({
                    name: 'Nguyễn Toàn Thắng',
                    email: email,
                    phone: '094 999 1515',
                    role: 'SUPER_ADMIN',
                    title: 'Quản Lý Hệ Thống',
                    addedAt: new Date().toLocaleString('vi-VN')
                });
            } else {
                // Tài khoản được cấp bởi Trưởng ban/Console: mặc định Người Duyệt
                currentRole = 'MODERATOR';
            }
        }
    }
    updateRoleUI();
}

// Cập nhật giao diện theo vai trò người dùng
function updateRoleUI() {
    const roleBadge = document.getElementById('role-display');
    const authBtn = document.getElementById('btn-auth');
    const reqBtn = document.getElementById('btn-requests');
    const adminAddBtn = document.getElementById('btn-admin-add');
    const exportBtn = document.getElementById('btn-export');
    const adminsBtn = document.getElementById('btn-admins');
    const bulkImportBtn = document.getElementById('btn-bulk-import');

    if (!currentUser || currentRole === 'USER') {
        roleBadge.className = 'role-badge role-user';
        roleBadge.innerHTML = '👤 Con Cháu';
        authBtn.innerHTML = '🔐 Admin';
        authBtn.className = 'btn';

        reqBtn.style.display = 'none';
        adminAddBtn.style.display = 'none';
        exportBtn.style.display = 'none';
        bulkImportBtn.style.display = 'none';
        adminsBtn.style.display = 'none';
        updateRequestsBadge();
        return;
    }

    // Đã đăng nhập
    authBtn.innerHTML = '🚪 Đăng Xuất';
    authBtn.className = 'btn btn-secondary';

    const safeKey = (currentUser.email || '').replace(/\./g, '_');
    const myInfo = adminList[safeKey] || {};
    const displayName = myInfo.name || currentUser.email.split('@')[0];

    if (currentRole === 'SUPER_ADMIN') {
        roleBadge.className = 'role-badge role-super-admin';
        roleBadge.innerHTML = `⚙️ Quản Lý Hệ Thống: <b>${myInfo.name || 'Nguyễn Toàn Thắng'}</b>`;
        
        reqBtn.style.display = 'inline-flex';
        adminAddBtn.style.display = 'inline-flex';
        exportBtn.style.display = 'inline-flex';
        bulkImportBtn.style.display = 'inline-flex';
        adminsBtn.style.display = 'inline-flex';
    } else if (currentRole === 'TRUONG_BAN' || currentRole === 'ROOT_ADMIN') {
        roleBadge.className = 'role-badge role-truong-ban';
        roleBadge.innerHTML = `👑 Trưởng Ban: <b>${displayName}</b>`;

        reqBtn.style.display = 'inline-flex';
        adminAddBtn.style.display = 'inline-flex';
        exportBtn.style.display = 'inline-flex';
        bulkImportBtn.style.display = 'inline-flex';
        adminsBtn.style.display = 'inline-flex';
    } else if (currentRole === 'PHO_BAN' || currentRole === 'CO_ADMIN') {
        roleBadge.className = 'role-badge role-pho-ban';
        roleBadge.innerHTML = `🛡️ Phó Ban: <b>${displayName}</b>`;

        reqBtn.style.display = 'inline-flex';
        adminAddBtn.style.display = 'inline-flex';
        exportBtn.style.display = 'inline-flex';
        bulkImportBtn.style.display = 'inline-flex';
        adminsBtn.style.display = 'none';
    } else if (currentRole === 'MODERATOR') {
        roleBadge.className = 'role-badge role-moderator';
        roleBadge.innerHTML = `📋 Người Duyệt: <b>${displayName}</b>`;

        reqBtn.style.display = 'inline-flex';
        adminAddBtn.style.display = 'inline-flex';
        exportBtn.style.display = 'none';
        bulkImportBtn.style.display = 'inline-flex';
        adminsBtn.style.display = 'none';
    } else if (currentRole === 'COLLABORATOR') {
        roleBadge.className = 'role-badge role-collaborator';
        roleBadge.innerHTML = `📝 Ban Thu Thập: <b>${displayName}</b>`;

        reqBtn.style.display = 'none';
        adminAddBtn.style.display = 'inline-flex';
        bulkImportBtn.style.display = 'inline-flex';
        exportBtn.style.display = 'none';
        adminsBtn.style.display = 'none';
    }

    updateRequestsBadge();
}

function updateRequestsBadge() {
    const badge = document.getElementById('request-count');
    if (badge) badge.innerText = pendingRequests.length;
}

// Xử lý Đăng nhập & Đăng xuất Admin
function handleAuthClick() {
    if (currentUser) {
        if (confirm('Bạn muốn đăng xuất khỏi quyền Quản Trị Viên / Ban Thu Thập?')) {
            auth.signOut().then(() => {
                alert('Đã đăng xuất.');
            });
        }
    } else {
        document.getElementById('auth-error').style.display = 'none';
        const savedEmail = localStorage.getItem('giapha_admin_email');
        const authEmailInput = document.getElementById('auth-email');
        if (savedEmail && authEmailInput) {
            authEmailInput.value = savedEmail;
        }
        openModal('authModal');
    }
}

function executeLogin() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errBox = document.getElementById('auth-error');

    errBox.style.display = 'none';

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            localStorage.setItem('giapha_admin_email', email);
            closeModal('authModal');
            alert('🎉 Đăng nhập thành công! Chào mừng bạn tham gia quản trị phả hệ họ Nguyễn.');
        })
        .catch((error) => {
            errBox.style.display = 'block';
            errBox.innerText = 'Lỗi đăng nhập: Sai mật khẩu hoặc tài khoản chưa được tạo trong Firebase Auth.';
        });
}

// Quản lý Phân Quyền Ban Quản Trị
function openAdminsModal() {
    renderAdminsList();
    openModal('adminsModal');
}

function renderAdminsList() {
    const container = document.getElementById('admins-list-container');
    if (!container) return;

    const admins = Object.entries(adminList);
    if (admins.length === 0) {
        container.innerHTML = `<p style="color:#64748b; font-size:0.85rem;">Chưa có thành viên nào.</p>`;
        return;
    }

    // Thứ tự ưu tiên: Quản Lý Hệ Thống -> Trưởng Ban -> Phó Ban -> Người Duyệt -> Ban Thu Thập
    const roleOrder = { 'SUPER_ADMIN': 1, 'ROOT_ADMIN': 2, 'TRUONG_BAN': 2, 'PHO_BAN': 3, 'CO_ADMIN': 3, 'MODERATOR': 4, 'COLLABORATOR': 5 };
    admins.sort((a, b) => (roleOrder[a[1].role] || 99) - (roleOrder[b[1].role] || 99));

    container.innerHTML = admins.map(([key, a]) => {
        const isSuper = (a.role === 'SUPER_ADMIN' || a.name === 'Nguyễn Toàn Thắng' || a.phone === '094 999 1515');
        const isTruongBan = (a.role === 'TRUONG_BAN' || a.role === 'ROOT_ADMIN');
        const isPhoBan = (a.role === 'PHO_BAN' || a.role === 'CO_ADMIN');
        const isCollaborator = (a.role === 'COLLABORATOR');

        let badgeClass = 'role-moderator';
        let roleTitle = 'Người Duyệt';
        let roleIcon = '📋';

        if (isSuper) {
            badgeClass = 'role-super-admin';
            roleTitle = 'Quản Lý Hệ Thống';
            roleIcon = '⚙️';
        } else if (isTruongBan) {
            badgeClass = 'role-truong-ban';
            roleTitle = 'Trưởng Ban Quản Trị';
            roleIcon = '👑';
        } else if (isPhoBan) {
            badgeClass = 'role-pho-ban';
            roleTitle = 'Phó Ban Quản Trị';
            roleIcon = '🛡️';
        } else if (isCollaborator) {
            badgeClass = 'role-collaborator';
            roleTitle = 'Ban Thu Thập';
            roleIcon = '📝';
        }

        // Ai có quyền thu hồi?
        // Quản Lý Hệ Thống có quyền thu hồi tất cả mọi người (trừ chính mình).
        // Trưởng Ban có quyền thu hồi Phó Ban, Người Duyệt, Ban Thu Thập.
        const canRevokeThis = !isSuper && (
            currentRole === 'SUPER_ADMIN' || 
            (currentRole === 'TRUONG_BAN' && !isTruongBan)
        );

        return `
            <div class="admin-user-card" style="${isSuper ? 'border-left: 4px solid #b45309; background: #fffdfa;' : ''}">
                <div class="admin-user-info">
                    <div style="font-weight: bold; font-size: 0.92rem; color: #1e293b; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                        <span>${roleIcon} ${a.name || a.email}</span>
                        <span class="role-badge ${badgeClass}" style="font-size: 0.68rem; padding: 2px 8px;">
                            ${roleTitle}
                        </span>
                    </div>
                    <div style="font-size: 0.8rem; color: #475569; margin-top: 3px;">
                        ✉️ Email: <b>${a.email || 'Chưa cập nhật'}</b> ${a.phone ? `• 📞 SĐT: <b>${a.phone}</b>` : ''}
                    </div>
                    <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">
                        Ngày cấp: ${a.addedAt || 'Trước đó'} ${a.addedBy ? `(bởi ${a.addedBy})` : ''}
                    </div>
                </div>
                <div>
                    ${canRevokeThis ? `
                        <button class="btn btn-danger" style="font-size: 0.75rem; padding: 4px 8px;" onclick="revokeAdmin('${key}', '${a.name || a.email}')">
                            🗑️ Thu hồi
                        </button>
                    ` : (isSuper ? `<span style="font-size: 0.75rem; color: #92400e; font-weight: bold;">🔒 Vĩnh viễn</span>` : '')}
                </div>
            </div>
        `;
    }).join('');
}

function submitNewAdmin() {
    const name = document.getElementById('new-admin-name').value.trim();
    const email = document.getElementById('new-admin-email').value.trim().toLowerCase();
    const phone = document.getElementById('new-admin-phone').value.trim();
    const password = document.getElementById('new-admin-password').value;
    const role = document.getElementById('new-admin-role').value;

    if (!name || !email || !password) {
        alert('Vui lòng điền đầy đủ Họ tên, Email và Mật khẩu!');
        return;
    }

    if (password.length < 6) {
        alert('Mật khẩu phải có tối thiểu 6 ký tự!');
        return;
    }

    const safeKey = email.replace(/\./g, '_');

    // Tạo tài khoản qua Secondary App Instance của Firebase để không làm đăng xuất Quản trị viên
    try {
        const tempAppName = 'CreatorApp_' + Date.now();
        const tempApp = firebase.initializeApp(firebaseConfig, tempAppName);
        const tempAuth = tempApp.auth();

        tempAuth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                tempAuth.signOut();
                tempApp.delete();
                saveAdminToDatabase(safeKey, name, email, phone, role);
            })
            .catch((err) => {
                tempApp.delete();
                if (err.code === 'auth/email-already-in-use') {
                    saveAdminToDatabase(safeKey, name, email, phone, role);
                } else {
                    console.warn("Client user creation note:", err);
                    saveAdminToDatabase(safeKey, name, email, phone, role, true);
                }
            });
    } catch (e) {
        saveAdminToDatabase(safeKey, name, email, phone, role, true);
    }
}

function saveAdminToDatabase(safeKey, name, email, phone, role, needConsoleNotice = false) {
    let roleTitle = 'Người Duyệt Thông Tin';
    if (role === 'TRUONG_BAN') roleTitle = 'Trưởng Ban Quản Trị';
    else if (role === 'PHO_BAN') roleTitle = 'Phó Ban Quản Trị';
    else if (role === 'COLLABORATOR') roleTitle = 'Ban Thu Thập Thông Tin';

    const adminObj = {
        name: name,
        email: email,
        phone: phone,
        role: role,
        title: roleTitle,
        addedAt: new Date().toLocaleString('vi-VN'),
        addedBy: currentUser ? (currentUser.email || 'Nguyễn Toàn Thắng') : 'Nguyễn Toàn Thắng'
    };

    db.ref('admins/' + safeKey).set(adminObj, (err) => {
        if (!err) {
            document.getElementById('addAdminForm').reset();
            let msg = `🎉 ĐÃ PHÂN QUYỀN THÀNH CÔNG CHO:\n👉 ${name} (${email})\n👉 Chức danh: ${roleTitle}\n\n`;
            msg += `📱 Hãy gửi thông tin cho người này:\n`;
            msg += `- Đường link trang web gia phả\n`;
            msg += `- Email đăng nhập: ${email}\n`;
            msg += `- Mật khẩu bạn vừa đặt\n\n`;
            msg += `Người này chỉ cần bấm nút [Admin] trên web để đăng nhập và thực hiện nhiệm vụ họ tộc.`;
            if (needConsoleNotice) {
                msg += `\n\n(Lưu ý: Nếu người đó chưa đăng nhập được do chính sách bảo mật Firebase, Quản lý hệ thống chỉ cần vào Firebase Console -> Authentication -> Users -> Add User với email + pass này là xong ngay!)`;
            }
            alert(msg);
        } else {
            alert('Lỗi khi lưu phân quyền: ' + err.message);
        }
    });
}

function revokeAdmin(safeKey, name) {
    if (safeKey.includes('0949991515') || safeKey.includes('thang') || name === 'Nguyễn Toàn Thắng') {
        alert('Không thể thu hồi quyền của Quản Lý Hệ Thống!');
        return;
    }
    if (!confirm(`Bạn có chắc chắn muốn thu hồi quyền của [${name}] không?`)) return;
    db.ref('admins/' + safeKey).remove((err) => {
        if (!err) {
            alert(`Đã thu hồi quyền của ${name}.`);
        } else {
            alert('Lỗi: ' + err.message);
        }
    });
}

// ==================== PHÊ DUYỆT ĐỀ XUẤT (MODERATION) ====================
function openRequestsModal() {
    renderRequestsList();
    openModal('requestsModal');
}

function renderRequestsList() {
    const container = document.getElementById('requests-container');
    if (!container) return;

    if (pendingRequests.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #64748b; padding: 30px;">
                🎉 Hiện không có đề xuất nào đang chờ duyệt!
            </div>
        `;
        return;
    }

    container.innerHTML = pendingRequests.map(r => {
        const isNew = r.type === 'ADD_MEMBER';
        return `
            <div class="request-card">
                <div class="request-header">
                    <span>${isNew ? '👶 Báo Sinh / Thêm Thành Viên Mới' : '📝 Đề Xuất Chỉnh Sửa Thông Tin'}</span>
                    <span style="font-size: 0.75rem; color: #64748b; font-weight: normal;">${r.timestamp || ''}</span>
                </div>

                <div class="request-sender-info">
                    <span>👤 Người gửi: <b>${r.senderName}</b></span>
                    <span>📞 SĐT: <b>${r.senderPhone}</b></span>
                    <span>🔗 Quan hệ: <b>${r.senderRelation || 'Con cháu họ Nguyễn'}</b></span>
                </div>

                <div class="diff-box">
                    ${isNew ? `
                        <div>• Con cháu mới: <b>${r.targetName}</b> (Thế hệ ${r.data.gen})</div>
                        <div>• Cha/Mẹ trực hệ: <b>${r.parentName}</b></div>
                    ` : `
                        <div>• Thành viên cần sửa: <b>${r.targetName}</b></div>
                    `}
                    <div>• Giới tính: ${r.data.gender === 'female' ? 'Nữ' : 'Nam'}</div>
                    <div>• Ngày sinh: ${r.data.dob || 'Chưa rõ'}</div>
                    <div>• Ngày mất: ${r.data.dod || 'Còn sống'}</div>
                    <div>• Vợ/Chồng: ${r.data.spouse || 'Chưa rõ'}</div>
                    <div>• Nơi an táng: ${r.data.burial || 'Chưa rõ'}</div>
                    <div>• Ghi chú: ${r.data.notes || 'Không có'}</div>
                    ${r.data.img && r.data.img !== DEFAULT_AVATAR ? `
                        <div style="margin-top:6px; display:flex; align-items:center; gap:8px;">
                            <span>• Ảnh chân dung đính kèm:</span>
                            <img src="${r.data.img}" style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:1px solid #ca8a04;">
                        </div>
                    ` : ''}
                </div>

                <div style="display:flex; justify-content:flex-end; gap:8px;">
                    <button class="btn btn-danger" onclick="rejectRequest('${r.reqId}')">❌ Từ Chối</button>
                    <button class="btn btn-success" onclick="approveRequest('${r.reqId}')">✅ Chấp Thuận</button>
                </div>
            </div>
        `;
    }).join('');
}

function approveRequest(reqId) {
    const req = pendingRequests.find(r => r.reqId === reqId);
    if (!req) return;

    if (req.type === 'ADD_MEMBER') {
        // Thêm thành viên mới
        db.ref('members/' + req.data.id).set(req.data, (err) => {
            if (!err) {
                db.ref('requests/' + reqId).remove();
                alert('✅ Đã duyệt và thêm thành viên mới vào gia phả!');
            }
        });
    } else {
        // Cập nhật thành viên cũ
        db.ref('members/' + req.targetId).update(req.data, (err) => {
            if (!err) {
                db.ref('requests/' + reqId).remove();
                alert('✅ Đã duyệt và cập nhật thành công lên Gia phả!');
            }
        });
    }
}

function rejectRequest(reqId) {
    if (!confirm('Bạn có chắc chắn muốn từ chối đề xuất này không?')) return;
    db.ref('requests/' + reqId).remove((err) => {
        if (!err) alert('Đã từ chối đề xuất.');
    });
}
