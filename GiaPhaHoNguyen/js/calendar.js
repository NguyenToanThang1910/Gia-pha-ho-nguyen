// ==================== ÂM - DƯƠNG LỊCH & LỊCH GIỖ HỌ 12 THÁNG ====================

let currentMemorialMode = 'grid12'; // 'grid12' (12 tháng lưới), 'single' (từng tháng), 'list' (toàn bộ)
let selectedMemorialMonth = 1;
let memorialSearchQuery = '';
let todaySolar = new Date();
let todayLunar = null;

// ==================== THUẬT TOÁN ÂM - DƯƠNG LỊCH VIỆT NAM (HỒ NGỌC ĐỨC) ====================
function jdFromDate(dd, mm, yy) {
    let a = Math.floor((14 - mm) / 12);
    let y = yy + 4800 - a;
    let m = mm + 12 * a - 3;
    let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    if (jd < 2299161) {
        jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    }
    return jd;
}

function getNewMoonDay(k, timeZone = 7.0) {
    let T = k / 1236.85;
    let T2 = T * T;
    let T3 = T2 * T;
    let dr = Math.PI / 180;
    let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
    let M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
    let Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
    let F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.0000239 * T3;
    let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
    C1 = C1 - 0.0004 * Math.sin(3 * dr * Mpr);
    C1 = C1 + 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
    C1 = C1 - 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
    C1 = C1 - 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
    C1 = C1 + 0.0010 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((M + 2 * Mpr) * dr);
    let JdNew = Jd1 + C1;
    return Math.floor(JdNew + 0.5 + timeZone / 24);
}

function getSunLongitude(jdn, timeZone = 7.0) {
    let T = (jdn - 2451545.0 + 0.5 - timeZone / 24) / 36525;
    let T2 = T * T;
    let dr = Math.PI / 180;
    let L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
    let M = 357.52910 + 35999.05029 * T - 0.0001537 * T2;
    let C = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr);
    C = C + (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) + 0.000290 * Math.sin(3 * M * dr);
    let theta = L0 + C;
    theta = theta * dr;
    theta = theta - Math.PI * 2 * Math.floor(theta / (Math.PI * 2));
    return Math.floor(theta / Math.PI * 6);
}

function getLunarMonth11(yy, timeZone = 7.0) {
    let off = jdFromDate(31, 12, yy) - 2415021;
    let k = Math.floor(off / 29.530588853);
    let nm = getNewMoonDay(k, timeZone);
    let sunLong = getSunLongitude(nm, timeZone);
    if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
}

function convertSolar2Lunar(dd, mm, yyyy, timeZone = 7.0) {
    let dayNumber = jdFromDate(dd, mm, yyyy);
    let k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
    let monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
    }
    let a11 = getLunarMonth11(yyyy, timeZone);
    let b11 = a11;
    let year = yyyy;
    if (a11 >= monthStart) {
        year = yyyy - 1;
        a11 = getLunarMonth11(year, timeZone);
    } else {
        b11 = getLunarMonth11(yyyy + 1, timeZone);
    }
    let lunarDay = dayNumber - monthStart + 1;
    let diff = Math.floor((monthStart - a11) / 29);
    let lunarMonth = diff + 11;
    if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
        year -= 1;
    }
    return { day: lunarDay, month: lunarMonth, year: year };
}

// ==================== PHÂN TÍCH NGÀY MẤT (DOD PARSER) ====================
function parseDeathDate(dodStr) {
    if (!dodStr || typeof dodStr !== 'string') return null;
    const s = dodStr.trim();
    if (s.toLowerCase().includes('còn sống') || s.toLowerCase().includes('chưa rõ') || s === '') return null;

    // Tìm ngày và tháng dạng DD/MM hoặc D/M
    const match = s.match(/(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/);
    if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = match[3] ? parseInt(match[3], 10) : null;
        const isLunar = s.toUpperCase().includes('AL') || s.toLowerCase().includes('âm');
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            return { day, month, year, isLunar, raw: dodStr };
        }
    }

    // Chỉ có năm e.g. "1985"
    const yearMatch = s.match(/^(\d{4})$/);
    if (yearMatch) {
        return { day: null, month: 0, year: parseInt(yearMatch[1], 10), isLunar: false, raw: dodStr };
    }

    return { day: null, month: 0, year: null, isLunar: false, raw: dodStr };
}

// ==================== RENDER GIAO DIỆN LỊCH GIỖ HỌ ====================
function renderMemorialView() {
    renderMemorialTodayBanner();
    renderMonthPillsBar();

    const viewContent = document.getElementById('memorial-container') || document.getElementById('memorial-view-content');
    if (!viewContent) return;

    if (currentMemorialMode === 'grid12') {
        renderMemorial12MonthsGrid(viewContent);
    } else if (currentMemorialMode === 'single') {
        renderMemorialSingleMonth(viewContent);
    } else {
        renderMemorialFullList(viewContent);
    }
}

function renderMemorialTodayBanner() {
    const banner = document.getElementById('memorial-today-info');
    if (!banner) return;

    if (!todayLunar) {
        todayLunar = convertSolar2Lunar(todaySolar.getDate(), todaySolar.getMonth() + 1, todaySolar.getFullYear());
    }

    // Tìm xem tháng này có bao nhiêu ngày giỗ
    const parsedList = familyMembers
        .filter(m => m.dod && !m.dod.toLowerCase().includes('còn sống'))
        .map(m => ({ ...m, parsedDod: parseDeathDate(m.dod) }));

    const currentMonthMemorials = parsedList.filter(m => m.parsedDod && m.parsedDod.month === todayLunar.month);

    // Kiểm tra có trùng ngày giỗ hôm nay không
    const todayMemorials = parsedList.filter(m => m.parsedDod && m.parsedDod.month === todayLunar.month && m.parsedDod.day === todayLunar.day);

    let alertHtml = '';
    if (todayMemorials.length > 0) {
        alertHtml = `
            <div style="background:#fee2e2; border:1px solid #ef4444; color:#b91c1c; padding:8px 12px; border-radius:6px; font-weight:bold; margin-top:8px; display:flex; align-items:center; gap:8px;">
                <span>🔥</span> HÔM NAY GIỖ CỤ: ${todayMemorials.map(c => `<b>${c.name}</b> (Thế hệ ${c.gen})`).join(', ')}!
            </div>
        `;
    }

    banner.innerHTML = `
        <div class="memorial-today-text">
            <div>🗓️ Hôm nay: <b>Thứ ${todaySolar.getDay() === 0 ? 'Chủ Nhật' : todaySolar.getDay() + 1}, ngày ${todaySolar.getDate()}/${todaySolar.getMonth() + 1}/${todaySolar.getFullYear()} Dương Lịch</b></div>
            <div>🌙 Tức ngày: <b>Mùng ${todayLunar.day} tháng ${todayLunar.month} (Tháng ${todayLunar.month === 1 ? 'Giêng' : todayLunar.month === 12 ? 'Chạp' : todayLunar.month}) năm ${todayLunar.year} Âm Lịch</b></div>
            ${alertHtml}
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
            <div class="memorial-stat-badge">
                🕯️ ${currentMonthMemorials.length} ngày giỗ trong Tháng ${todayLunar.month} (ÂL)
            </div>
        </div>
    `;
}

function renderMonthPillsBar() {
    const container = document.getElementById('month-pills-bar');
    if (!container) return;

    if (currentMemorialMode !== 'single') {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';
    const monthNames = [
        "Tháng 1 (Giêng)", "Tháng 2", "Tháng 3", "Tháng 4",
        "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
        "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12 (Chạp)"
    ];

    container.innerHTML = monthNames.map((name, i) => {
        const mNum = i + 1;
        const isActive = (mNum === selectedMemorialMonth) ? 'active' : '';
        const isCurrent = (todayLunar && mNum === todayLunar.month) ? 'current-lunar' : '';
        return `
            <button class="month-pill-btn ${isActive} ${isCurrent}" onclick="selectMemorialMonth(${mNum})">
                ${isCurrent ? '⭐ ' : ''}${name}
            </button>
        `;
    }).join('');
}

function switchMemorialMode(mode) {
    currentMemorialMode = mode;
    document.querySelectorAll('.mem-mode-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-mode-${mode}`) || document.getElementById(`mode-${mode}`);
    if (activeBtn) activeBtn.classList.add('active');

    renderMemorialView();
}

function selectMemorialMonth(m) {
    selectedMemorialMonth = m;
    renderMemorialView();
}

function handleMemorialSearch() {
    memorialSearchQuery = (document.getElementById('memorialSearchInput')?.value || '').trim().toLowerCase();
    renderMemorialView();
}

// 1. CHẾ ĐỘ LƯỚI 12 THÁNG TOÀN CẢNH (GRID 12)
function renderMemorial12MonthsGrid(container) {
    const monthNames = [
        "Tháng 1 (Tháng Giêng)", "Tháng 2", "Tháng 3", "Tháng 4",
        "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
        "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12 (Tháng Chạp)"
    ];

    const deceasedList = familyMembers
        .filter(m => m.dod && !m.dod.toLowerCase().includes('còn sống'))
        .map(m => ({ ...m, parsedDod: parseDeathDate(m.dod) }))
        .filter(m => {
            if (!memorialSearchQuery) return true;
            return m.name.toLowerCase().includes(memorialSearchQuery) ||
                (m.burial && m.burial.toLowerCase().includes(memorialSearchQuery)) ||
                (m.dod && m.dod.toLowerCase().includes(memorialSearchQuery));
        });

    let html = '<div class="memorial-12grid">';

    for (let m = 1; m <= 12; m++) {
        const isCurrentMonth = (todayLunar && m === todayLunar.month);
        const memorialsInMonth = deceasedList
            .filter(item => item.parsedDod && item.parsedDod.month === m)
            .sort((a, b) => (a.parsedDod?.day || 99) - (b.parsedDod?.day || 99));

        html += `
            <div class="month-card ${isCurrentMonth ? 'is-current-month' : ''}" onclick="selectMemorialMonth(${m}); switchMemorialMode('single');">
                <div class="month-card-header">
                    <span>🌙 ${monthNames[m - 1]}</span>
                    <span class="badge" style="background:${isCurrentMonth ? '#b45309' : '#64748b'}; color:#fff; font-size:0.75rem;">
                        ${memorialsInMonth.length} ngày giỗ
                    </span>
                </div>
                ${isCurrentMonth ? '<span class="current-month-badge">⭐ THÁNG HIỆN TẠI (ÂL)</span>' : ''}

                <div class="month-card-body">
                    ${memorialsInMonth.length === 0 ? `
                        <div class="month-card-empty">Không có ngày giỗ trong tháng này</div>
                    ` : memorialsInMonth.map(c => {
                        const isToday = isCurrentMonth && (todayLunar && c.parsedDod?.day === todayLunar.day);
                        const isUpcoming = isCurrentMonth && (todayLunar && c.parsedDod?.day > todayLunar.day && c.parsedDod?.day <= todayLunar.day + 7);
                        return `
                            <div class="month-memorial-item" onclick="event.stopPropagation(); openViewModal('${c.id}')" title="Bấm xem chi tiết cụ ${c.name}">
                                <div>
                                    <span class="memorial-day-tag ${isToday ? 'memorial-day-today' : ''}">
                                        ${c.parsedDod?.day ? `Ngày ${c.parsedDod.day}` : 'Giỗ'}
                                    </span>
                                    <span class="memorial-person-name ${isToday ? 'text-danger font-bold' : ''}">
                                        ${c.name}
                                    </span>
                                    <span style="font-size:0.7rem; color:#64748b;">(Đời ${c.gen})</span>
                                </div>
                                ${isToday ? '<span class="memorial-upcoming-tag" style="background:#fee2e2; color:#b91c1c; border-color:#fca5a5;">🔥 Hôm nay!</span>' : ''}
                                ${isUpcoming ? `<span class="memorial-upcoming-tag">⏳ Còn ${c.parsedDod.day - todayLunar.day} ngày</span>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    html += '</div>';
    container.innerHTML = html;
}

// 2. CHẾ ĐỘ XEM TỪNG THÁNG CHI TIẾT (SINGLE MONTH)
function renderMemorialSingleMonth(container) {
    const monthNames = [
        "Tháng 1 (Giêng)", "Tháng 2", "Tháng 3", "Tháng 4",
        "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
        "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12 (Chạp)"
    ];

    const isCurrentMonth = (todayLunar && selectedMemorialMonth === todayLunar.month);

    const deceasedList = familyMembers
        .filter(m => m.dod && !m.dod.toLowerCase().includes('còn sống'))
        .map(m => ({ ...m, parsedDod: parseDeathDate(m.dod) }))
        .filter(m => m.parsedDod && m.parsedDod.month === selectedMemorialMonth)
        .filter(m => {
            if (!memorialSearchQuery) return true;
            return m.name.toLowerCase().includes(memorialSearchQuery) ||
                (m.burial && m.burial.toLowerCase().includes(memorialSearchQuery)) ||
                (m.dod && m.dod.toLowerCase().includes(memorialSearchQuery));
        })
        .sort((a, b) => (a.parsedDod?.day || 99) - (b.parsedDod?.day || 99));

    container.innerHTML = `
        <div style="background:white; border-radius:10px; padding:16px 20px; box-shadow:var(--shadow); border:1px solid #e2e8f0; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <h3 style="color:var(--primary-color); display:flex; align-items:center; gap:8px; font-size:1.15rem;">
                    🕯️ Danh Sách Ngày Giỗ ${monthNames[selectedMemorialMonth - 1]} (Âm Lịch)
                    ${isCurrentMonth ? '<span class="role-badge role-root-admin" style="font-size:0.7rem;">⭐ Tháng Này</span>' : ''}
                </h3>
                <div style="font-size:0.85rem; color:#64748b;">
                    Tổng số: <b>${deceasedList.length}</b> cụ
                </div>
            </div>
        </div>

        ${deceasedList.length === 0 ? `
            <div style="text-align:center; padding:40px; background:white; border-radius:10px; color:#64748b; border:1px solid #e2e8f0;">
                🍃 Tháng này trong gia phả chưa ghi nhận ngày giỗ cụ nào.
            </div>
        ` : `
            <div class="single-month-cards-grid">
                ${deceasedList.map(m => {
                    const isToday = isCurrentMonth && (todayLunar && m.parsedDod?.day === todayLunar.day);
                    const isUpcoming = isCurrentMonth && (todayLunar && m.parsedDod?.day > todayLunar.day && m.parsedDod?.day <= todayLunar.day + 7);
                    return `
                        <div class="memorial-card ${isToday ? 'highlight-today' : ''}" onclick="openViewModal('${m.id}')" style="cursor:pointer; border-left-color:${isToday ? '#dc2626' : '#b45309'};">
                            <div style="display:flex; gap:12px; align-items:flex-start;">
                                <img src="${m.img || DEFAULT_AVATAR}" style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid ${isToday ? '#dc2626' : '#ca8a04'};">
                                <div class="memorial-info">
                                    <div style="font-weight:bold; font-size:1rem; color:var(--primary-color); display:flex; align-items:center; gap:6px;">
                                        <span>${m.gender === 'female' ? '👵' : '👴'} ${m.name}</span>
                                        <span style="font-size:0.72rem; color:#64748b; font-weight:normal;">(Thế hệ ${m.gen})</span>
                                        ${isToday ? '<span style="background:#fee2e2; color:#b91c1c; font-size:0.68rem; padding:1px 6px; border-radius:4px; font-weight:bold;">🔥 Hôm nay</span>' : ''}
                                        ${isUpcoming ? `<span style="background:#fffbeb; color:#b45309; font-size:0.68rem; padding:1px 6px; border-radius:4px; font-weight:bold;">⏳ Còn ${m.parsedDod.day - todayLunar.day} ngày</span>` : ''}
                                    </div>
                                    <div style="font-size:0.82rem; color:#475569; margin-top:2px;">
                                        ${m.spouse ? `💑 Vợ/Chồng: <b>${m.spouse}</b> • ` : ''}
                                        📍 Nơi táng: <b>${m.burial || 'Chưa cập nhật'}</b>
                                    </div>
                                    ${m.notes ? `<div style="font-size:0.75rem; color:#64748b; font-style:italic; margin-top:2px;">${m.notes}</div>` : ''}
                                </div>
                            </div>
                            <div class="memorial-date" style="${isToday ? 'background:#fee2e2; color:#b91c1c; border-color:#fca5a5;' : ''}">
                                🕯️ Ngày ${m.parsedDod?.day ? `mùng ${m.parsedDod.day}` : ''} (${m.dod})
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `}
    `;
}

// 3. CHẾ ĐỘ XEM DANH SÁCH TOÀN BỘ TRONG NĂM (FULL LIST)
function renderMemorialFullList(container) {
    const deceasedList = familyMembers
        .filter(m => m.dod && !m.dod.toLowerCase().includes('còn sống'))
        .map(m => ({ ...m, parsedDod: parseDeathDate(m.dod) }))
        .filter(m => {
            if (!memorialSearchQuery) return true;
            return m.name.toLowerCase().includes(memorialSearchQuery) ||
                (m.burial && m.burial.toLowerCase().includes(memorialSearchQuery)) ||
                (m.dod && m.dod.toLowerCase().includes(memorialSearchQuery));
        })
        .sort((a, b) => {
            const ma = (a.parsedDod && a.parsedDod.month >= 1) ? a.parsedDod.month : 99;
            const mb = (b.parsedDod && b.parsedDod.month >= 1) ? b.parsedDod.month : 99;
            if (ma !== mb) return ma - mb;
            const da = a.parsedDod?.day || 99;
            const db = b.parsedDod?.day || 99;
            return da - db;
        });

    container.innerHTML = `
        <div style="margin-bottom: 12px; font-weight: 600; color: #475569; font-size: 0.9rem;">
            📜 Danh sách toàn bộ ${deceasedList.length} ngày giỗ trong năm (Sắp xếp từ Tháng Giêng đến Tháng Chạp):
        </div>
        ${deceasedList.map(m => `
            <div class="memorial-card" onclick="openViewModal('${m.id}')" style="cursor: pointer;">
                <div class="memorial-info">
                    <div style="font-weight:bold; font-size:1rem; color:var(--primary-color);">
                        ${m.gender === 'female' ? '👵' : '👴'} ${m.name} 
                        <span style="font-size:0.75rem; color:#64748b; font-weight:normal;">(Thế hệ ${m.gen})</span>
                    </div>
                    <div style="font-size:0.85rem; color:#475569;">
                        ${m.spouse ? `💑 Vợ/Chồng: ${m.spouse} • ` : ''}
                        📍 Nơi an táng: <b>${m.burial || 'Chưa cập nhật'}</b>
                    </div>
                    ${m.notes ? `<div style="font-size:0.78rem; color:#64748b; font-style:italic;">${m.notes}</div>` : ''}
                </div>
                <div class="memorial-date">
                    🕯️ Ngày Giỗ: ${m.dod}
                </div>
            </div>
        `).join('')}
    `;
}
