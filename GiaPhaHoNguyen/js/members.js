// ==================== QUẢN LÝ THÀNH VIÊN GIA PHẢ & NHẬP DỮ LIỆU ====================

// ==================== DANH BẠ GIA TỘC (LIST VIEW) ====================
function renderListView() {
    const container = document.getElementById('list-container');
    const q = (document.getElementById('listSearchInput')?.value || '').toLowerCase().trim();
    const genFilter = document.getElementById('listGenFilter')?.value || 'ALL';

    let filtered = familyMembers;
    if (q) {
        filtered = filtered.filter(m => 
            (m.name && m.name.toLowerCase().includes(q)) ||
            (m.spouse && m.spouse.toLowerCase().includes(q)) ||
            (m.notes && m.notes.toLowerCase().includes(q))
        );
    }
    if (genFilter !== 'ALL') {
        filtered = filtered.filter(m => m.gen === parseInt(genFilter));
    }

    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:#64748b; padding:30px;">Không tìm thấy thành viên nào phù hợp.</p>`;
        return;
    }

    // Nhóm theo thế hệ
    const genGroups = {};
    filtered.forEach(m => {
        const g = m.gen || 1;
        if (!genGroups[g]) genGroups[g] = [];
        genGroups[g].push(m);
    });

    const sortedGens = Object.keys(genGroups).map(Number).sort((a,b) => a - b);

    container.innerHTML = sortedGens.map(g => `
        <div class="gen-section">
            <div class="gen-header">
                <span>🚩 Thế Hệ Thứ ${g}</span>
                <span style="font-size:0.8rem; font-family:sans-serif; opacity:0.9;">${genGroups[g].length} thành viên</span>
            </div>
            <div class="member-cards-grid">
                ${genGroups[g].map(m => `
                    <div class="member-card" onclick="openViewModal('${m.id}')">
                        <img src="${m.img || DEFAULT_AVATAR}" class="card-avatar" alt="Avatar">
                        <div class="card-body">
                            <div class="card-name">
                                <span>${m.gender === 'female' ? '👩' : '👨'} ${m.name}</span>
                            </div>
                            <div class="card-subtext">
                                ${m.spouse ? `<div>💑 Vợ/Chồng: <b>${m.spouse}</b></div>` : ''}
                                ${m.dod ? `<div style="color:#b91c1c;">🕯️ Ngày mất: <b>${m.dod}</b></div>` : (m.dob ? `<div>🎂 Sinh: ${m.dob}</div>` : '')}
                                ${m.burial ? `<div>📍 An táng: ${m.burial}</div>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ==================== MODAL XEM CHI TIẾT THÀNH VIÊN ====================
function openViewModal(memberId) {
    currentSelectedId = String(memberId);
    const m = familyMembers.find(x => String(x.id) === currentSelectedId);
    if (!m) return;

    document.getElementById('view-name').innerText = m.name;
    document.getElementById('view-img').src = m.img || DEFAULT_AVATAR;
    document.getElementById('view-gen').innerText = `Thế hệ thứ ${m.gen}`;
    document.getElementById('view-gender').innerText = m.gender === 'female' ? 'Nữ (Cụ Bà / Cô / Chị)' : 'Nam (Cụ Ông / Bác / Anh)';
    document.getElementById('view-dob').innerText = m.dob || 'Chưa rõ';
    document.getElementById('view-dod').innerText = m.dod || 'Còn sống / Chưa cập nhật';
    document.getElementById('view-spouse').innerText = m.spouse || 'Chưa cập nhật';
    document.getElementById('view-burial').innerText = m.burial || 'Chưa cập nhật';
    document.getElementById('view-notes').innerText = m.notes || 'Không có';

    // Tìm con cái trực hệ
    const children = familyMembers.filter(x => String(x.fid) === currentSelectedId || String(x.mid) === currentSelectedId);
    if (children.length > 0) {
        document.getElementById('view-children').innerHTML = children.map(c => `• <b>${c.name}</b> (Thế hệ ${c.gen})`).join('<br>');
    } else {
        document.getElementById('view-children').innerText = 'Chưa ghi nhận con cái';
    }

    const editBtn = document.getElementById('btn-edit-action');
    editBtn.innerText = canDirectEdit() ? '✏️ Sửa Trực Tiếp' : '📝 Đề xuất sửa';

    const delBtn = document.getElementById('btn-delete-member');
    delBtn.style.display = canDeleteMember() ? 'inline-block' : 'none';

    openModal('viewModal');
}

// ==================== MODAL SỬA THÔNG TIN ====================
function openSuggestEditModal() {
    closeModal('viewModal');
    const m = familyMembers.find(x => String(x.id) === currentSelectedId);
    if (!m) return;

    const isDirect = canDirectEdit();
    document.getElementById('edit-modal-title').innerText = isDirect ? '✏️ Chỉnh Sửa Thành Viên' : '📝 Đề Xuất Sửa Thông Tin';
    document.getElementById('edit-sender-box').style.display = isDirect ? 'none' : 'block';

    document.getElementById('edit-id').value = m.id;
    document.getElementById('edit-name').value = m.name;
    document.getElementById('edit-gen').value = m.gen;
    document.getElementById('edit-gender').value = m.gender || 'male';
    document.getElementById('edit-dob').value = m.dob || '';
    document.getElementById('edit-dod').value = m.dod || '';
    document.getElementById('edit-spouse').value = m.spouse || '';
    document.getElementById('edit-burial').value = m.burial || '';
    document.getElementById('edit-notes').value = m.notes || '';

    // Ảnh chân dung
    document.getElementById('edit-img-data').value = m.img || '';
    if (m.img && m.img !== DEFAULT_AVATAR) {
        document.getElementById('edit-preview').src = m.img;
        document.getElementById('edit-preview-wrap').style.display = 'flex';
    } else {
        clearUploadedImage('edit-preview', 'edit-img-data', 'edit-preview-wrap');
    }

    openModal('editModal');
}

function submitEditForm() {
    const id = document.getElementById('edit-id').value;
    const updatedData = {
        id: id,
        name: document.getElementById('edit-name').value.trim(),
        img: document.getElementById('edit-img-data').value || DEFAULT_AVATAR,
        gen: parseInt(document.getElementById('edit-gen').value) || 1,
        gender: document.getElementById('edit-gender').value,
        dob: document.getElementById('edit-dob').value.trim(),
        dod: document.getElementById('edit-dod').value.trim(),
        spouse: document.getElementById('edit-spouse').value.trim(),
        burial: document.getElementById('edit-burial').value.trim(),
        notes: document.getElementById('edit-notes').value.trim()
    };

    const safeKey = String(id).replace('.', '_');

    if (canDirectEdit()) {
        // Lưu trực tiếp vào Firebase
        db.ref('members/' + safeKey).update(updatedData, (err) => {
            if (!err) {
                alert('✅ Đã cập nhật thành công lên Firebase!');
                closeModal('editModal');
            } else {
                alert('Lỗi: ' + err.message);
            }
        });
    } else {
        // Con cháu gửi đề xuất kèm thông tin người gửi
        const senderName = document.getElementById('edit-sender-name').value.trim();
        const senderPhone = document.getElementById('edit-sender-phone').value.trim();
        const senderRelation = document.getElementById('edit-sender-relation').value.trim();

        if (!senderName || !senderPhone) {
            alert('Vui lòng điền Họ tên và Số điện thoại của bạn để Ban Quản Trị tiện liên hệ xác nhận!');
            return;
        }

        const reqId = 'REQ_EDIT_' + Date.now();
        const reqObj = {
            reqId: reqId,
            type: 'UPDATE_MEMBER',
            targetId: safeKey,
            targetName: updatedData.name,
            senderName: senderName,
            senderPhone: senderPhone,
            senderRelation: senderRelation,
            data: updatedData,
            timestamp: new Date().toLocaleString('vi-VN')
        };

        db.ref('requests/' + reqId).set(reqObj, (err) => {
            if (!err) {
                alert('🎉 Đã gửi đề xuất cập nhật thành công!\nBan Quản Trị dòng họ sẽ xem xét và phê duyệt.');
                closeModal('editModal');
            } else {
                alert('Lỗi khi gửi đề xuất: ' + err.message);
            }
        });
    }
}

// ==================== MODAL THÊM CON CHÁU / BÁO SINH ====================
function openAddMemberModal(isAdminDirect = false) {
    const parentSelect = document.getElementById('add-parent-id');
    parentSelect.innerHTML = '<option value="">-- Chọn Cha / Mẹ (Trực hệ Họ Nguyễn) --</option>' + 
        familyMembers.map(m => `<option value="${m.id}">[Thế hệ ${m.gen}] ${m.name}</option>`).join('');

    document.getElementById('add-sender-box').style.display = isAdminDirect ? 'none' : 'block';
    document.getElementById('add-modal-title').innerText = isAdminDirect ? '➕ Thêm Thành Viên Trực Tiếp' : '👶 Báo Sinh / Thêm Con Cháu Mới';
    document.getElementById('btn-save-new').innerText = isAdminDirect ? '➕ Lưu Vào Gia Phả' : '📨 Gửi Đề Xuất Báo Sinh';

    // Reset form
    document.getElementById('addForm').reset();
    clearUploadedImage('add-preview', 'add-img-data', 'add-preview-wrap');

    openModal('addModal');
}

function autoFillGeneration() {
    const parentId = document.getElementById('add-parent-id').value;
    const parent = familyMembers.find(x => String(x.id) === String(parentId));
    if (parent) {
        document.getElementById('add-gen').value = (parent.gen || 1) + 1;
    }
}

function submitAddForm() {
    const parentId = document.getElementById('add-parent-id').value;
    if (!parentId) {
        alert('Vui lòng chọn Cha/Mẹ trực hệ!');
        return;
    }

    const parent = familyMembers.find(x => String(x.id) === String(parentId));
    const newName = document.getElementById('add-name').value.trim();
    if (!newName) {
        alert('Vui lòng nhập Họ tên con cháu!');
        return;
    }

    const gen = parseInt(document.getElementById('add-gen').value) || (parent ? parent.gen + 1 : 1);
    const newId = "MEM_" + Date.now();

    const newMemberData = {
        id: newId,
        fid: parent ? parent.id : null,
        gen: gen,
        name: newName,
        img: document.getElementById('add-img-data').value || DEFAULT_AVATAR,
        gender: document.getElementById('add-gender').value,
        dob: document.getElementById('add-dob').value.trim(),
        dod: '',
        spouse: document.getElementById('add-spouse').value.trim(),
        burial: '',
        notes: document.getElementById('add-notes').value.trim()
    };

    if (canDirectEdit()) {
        db.ref('members/' + newId).set(newMemberData, (err) => {
            if (!err) {
                alert('✅ Đã thêm thành viên mới vào gia phả!');
                closeModal('addModal');
            } else {
                alert('Lỗi: ' + err.message);
            }
        });
    } else {
        const senderName = document.getElementById('add-sender-name').value.trim();
        const senderPhone = document.getElementById('add-sender-phone').value.trim();
        const senderRelation = document.getElementById('add-sender-relation').value.trim();

        if (!senderName || !senderPhone) {
            alert('Vui lòng điền Họ tên và Số điện thoại của bạn để Ban Quản Trị tiện liên hệ xác nhận!');
            return;
        }

        const reqId = 'REQ_NEW_' + Date.now();
        const reqObj = {
            reqId: reqId,
            type: 'ADD_MEMBER',
            parentName: parent ? parent.name : '',
            targetName: newName,
            senderName: senderName,
            senderPhone: senderPhone,
            senderRelation: senderRelation,
            data: newMemberData,
            timestamp: new Date().toLocaleString('vi-VN')
        };

        db.ref('requests/' + reqId).set(reqObj, (err) => {
            if (!err) {
                alert('🎉 Đã gửi đề xuất thêm thành viên mới thành công!\nBan Quản Trị dòng họ sẽ xem xét và phê duyệt.');
                closeModal('addModal');
            } else {
                alert('Lỗi khi gửi đề xuất: ' + err.message);
            }
        });
    }
}

function deleteCurrentMember() {
    if (!canDeleteMember()) {
        alert('Chỉ Quản Lý Hệ Thống hoặc Trưởng Ban mới có quyền xóa thành viên khỏi phả hệ!');
        return;
    }
    if (!confirm('XÁC NHẬN: Bạn có chắc chắn muốn xóa thành viên này khỏi cây gia phả?')) return;
    const safeKey = String(currentSelectedId).replace('.', '_');
    db.ref('members/' + safeKey).remove((err) => {
        if (!err) {
            closeModal('viewModal');
            alert('Đã xóa thành viên khỏi hệ thống.');
        }
    });
}

// ==================== NHẬP DỮ LIỆU HÀNG LOẠT (BULK IMPORT) ====================
let parsedBulkMembers = [];

function openBulkImportModal() {
    parsedBulkMembers = [];
    const preview = document.getElementById('bulkImportPreview');
    if (preview) preview.innerHTML = '';
    const saveBtn = document.getElementById('btn-save-bulk');
    if (saveBtn) saveBtn.style.display = 'none';
    openModal('importModal');
}

function downloadExcelTemplate() {
    const csvContent = "\uFEFF" + 
        "Họ và Tên,Thế hệ,Tên Cha/Mẹ trực hệ,Giới tính (Nam/Nữ),Ngày sinh,Ngày mất (ghi AL nếu Âm lịch),Vợ/Chồng,Nơi an táng,Ghi chú\n" +
        "Nguyễn Văn An,5,Nguyễn Văn Kế,Nam,15/04/1960,,Trần Thị Mai,Hà Nam,Chi trưởng\n" +
        "Nguyễn Thị Bình,5,Nguyễn Văn Kế,Nữ,10/08/1965,15/8 (AL),Lê Văn C,Ninh Bình,Bà cô tổ\n" +
        "Nguyễn Văn Dũng,6,Nguyễn Văn An,Nam,01/01/1990,,Phạm Thị H,Hà Nội,Cháu đích tôn\n";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Bieu_Mau_Nhap_Gia_Pha_Ho_Nguyen.csv";
    link.click();
}

function fillSampleImportData() {
    const sample = 
`Nguyễn Văn Minh	5	Nguyễn Văn Kế	Nam	15/04/1962		Trần Thị Bích	Hà Nam	Chi 2
Nguyễn Thị Lan	5	Nguyễn Văn Kế	Nữ	20/09/1966	14/5 (AL)	Vũ Văn Hùng	Ninh Bình	Bà cô
Nguyễn Văn Hoàng	6	Nguyễn Văn Minh	Nam	05/11/1992		Đỗ Thị Thu	Hà Nội	Con trai cả
Nguyễn Thị Ngọc	6	Nguyễn Văn Minh	Nữ	12/03/1996			Đà Nẵng	Con gái thứ`;
    document.getElementById('bulkImportInput').value = sample;
    parseBulkInputData();
}

function parseBulkInputData() {
    const text = document.getElementById('bulkImportInput').value.trim();
    const previewContainer = document.getElementById('bulkImportPreview');
    const saveBtn = document.getElementById('btn-save-bulk');

    if (!text) {
        alert('Vui lòng dán dữ liệu từ bảng tính Excel vào khung!');
        return;
    }

    const lines = text.split(/\r?\n/);
    parsedBulkMembers = [];

    lines.forEach((line, idx) => {
        const raw = line.trim();
        if (!raw) return;

        // Bỏ qua dòng tiêu đề nếu có
        if (idx === 0 && (raw.toLowerCase().includes('họ và tên') || raw.toLowerCase().includes('thế hệ'))) return;

        // Phân tách bằng Tab hoặc dấu phẩy hoặc dấu chấm phẩy
        let cols = raw.split('\t');
        if (cols.length < 3) {
            cols = raw.split(',');
        }
        if (cols.length < 3) {
            cols = raw.split(';');
        }

        const name = (cols[0] || '').trim();
        if (!name) return;

        const gen = parseInt((cols[1] || '').trim()) || 1;
        const parentName = (cols[2] || '').trim();
        const genderRaw = (cols[3] || '').toLowerCase().trim();
        const gender = (genderRaw.includes('nữ') || genderRaw.includes('female') || genderRaw.includes('bà') || genderRaw.includes('cô')) ? 'female' : 'male';
        const dob = (cols[4] || '').trim();
        const dod = (cols[5] || '').trim();
        const spouse = (cols[6] || '').trim();
        const burial = (cols[7] || '').trim();
        const notes = (cols[8] || '').trim();

        // Tìm cha/mẹ trong danh sách hiện tại
        let fid = null;
        if (parentName) {
            const foundParent = familyMembers.find(m => m.name.toLowerCase() === parentName.toLowerCase() || m.name.toLowerCase().includes(parentName.toLowerCase()));
            if (foundParent) {
                fid = foundParent.id;
            }
        }

        const newId = 'MEM_' + Date.now() + '_' + Math.floor(Math.random()*1000);

        parsedBulkMembers.push({
            id: newId,
            name: name,
            gen: gen,
            parentName: parentName,
            fid: fid,
            gender: gender,
            dob: dob,
            dod: dod,
            spouse: spouse,
            burial: burial,
            notes: notes,
            img: DEFAULT_AVATAR
        });
    });

    if (parsedBulkMembers.length === 0) {
        previewContainer.innerHTML = `<p style="color:#b91c1c; padding:10px;">Không nhận diện được dòng dữ liệu hợp lệ nào. Hãy kiểm tra lại thứ tự các cột!</p>`;
        saveBtn.style.display = 'none';
        return;
    }

    saveBtn.style.display = 'inline-flex';
    previewContainer.innerHTML = `
        <div style="margin-top:10px;">
            <div style="font-weight:bold; color:#16a34a; margin-bottom:6px;">
                ✅ Đã nhận diện được ${parsedBulkMembers.length} thành viên sẵn sàng nạp:
            </div>
            <div class="preview-table-wrap">
                <table class="preview-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Họ và Tên</th>
                            <th>Thế hệ</th>
                            <th>Cha/Mẹ</th>
                            <th>Giới tính</th>
                            <th>Ngày sinh</th>
                            <th>Ngày mất</th>
                            <th>Vợ/Chồng</th>
                            <th>An táng</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${parsedBulkMembers.map((m, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td><b>${m.name}</b></td>
                                <td>Đời ${m.gen}</td>
                                <td>${m.parentName ? (m.fid ? `🔗 ${m.parentName}` : `⚠️ ${m.parentName} (Chưa khớp ID)`) : '—'}</td>
                                <td>${m.gender === 'female' ? 'Nữ' : 'Nam'}</td>
                                <td>${m.dob || '—'}</td>
                                <td>${m.dod ? `<span style="color:#b91c1c; font-weight:bold;">${m.dod}</span>` : '—'}</td>
                                <td>${m.spouse || '—'}</td>
                                <td>${m.burial || '—'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function executeBulkSave() {
    if (!parsedBulkMembers || parsedBulkMembers.length === 0) return;
    if (!confirm(`XÁC NHẬN: Bạn muốn nạp đồng loạt ${parsedBulkMembers.length} thành viên này vào Cây Gia Phả?`)) return;

    const updates = {};
    parsedBulkMembers.forEach(m => {
        const itemToSave = {
            id: m.id,
            name: m.name,
            gen: m.gen,
            gender: m.gender,
            fid: m.fid || null,
            dob: m.dob || '',
            dod: m.dod || '',
            spouse: m.spouse || '',
            burial: m.burial || '',
            notes: m.notes || '',
            img: m.img || DEFAULT_AVATAR
        };
        updates['members/' + m.id] = itemToSave;
    });

    db.ref().update(updates, (err) => {
        if (!err) {
            alert(`🎉 Thành công! Đã nạp ${parsedBulkMembers.length} thành viên mới vào gia phả!`);
            closeModal('importModal');
        } else {
            alert('Lỗi khi nạp hàng loạt: ' + err.message);
        }
    });
}

// ==================== SAO LƯU DỮ LIỆU ====================
function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(familyMembers, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `Gia_Pha_Ho_Nguyen_Ly_Nhan_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchorElem.click();
}
