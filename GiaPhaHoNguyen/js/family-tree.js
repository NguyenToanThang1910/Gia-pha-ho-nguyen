// ==================== CÂY PHẢ HỆ (FAMILYTREEJS) ====================

let familyTreeInstance = null;

function initFamilyTree() {
    if (!document.getElementById("tree")) return;

    const chartData = familyMembers.map(m => ({
        id: String(m.id),
        mid: m.mid ? String(m.mid) : undefined,
        fid: m.fid ? String(m.fid) : undefined,
        name: m.name,
        gender: m.gender || 'male',
        title: `Thế hệ ${m.gen}`,
        img: m.img || DEFAULT_AVATAR
    }));

    document.getElementById("tree").innerHTML = '';

    familyTreeInstance = new FamilyTree(document.getElementById("tree"), {
        nodes: chartData,
        nodeBinding: {
            field_0: "name",
            field_1: "title",
            img_0: "img"
        },
        enableSearch: false,
        template: "john",
        mode: "light",
        scaleInitial: FamilyTree.match.boundary,
        nodeMenu: false,
        siblingSeparation: 120,
        levelSeparation: 100,
        subtreeSeparation: 140,
        nodeTreeMenu: false
    });

    familyTreeInstance.on('click', function(sender, args) {
        openViewModal(args.node.id);
        return false;
    });
}

function searchMember() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    if (familyTreeInstance) {
        familyTreeInstance.search(q);
    }
}

function filterGeneration() {
    const gen = document.getElementById('genFilter').value;
    if (gen === 'ALL') {
        initFamilyTree();
    } else {
        const targetGen = parseInt(gen);
        const filtered = familyMembers.filter(m => m.gen === targetGen);
        const chartData = filtered.map(m => ({
            id: String(m.id),
            name: m.name,
            gender: m.gender || 'male',
            title: `Thế hệ ${m.gen}`,
            img: m.img || DEFAULT_AVATAR
        }));
        familyTreeInstance = new FamilyTree(document.getElementById("tree"), {
            nodes: chartData,
            nodeBinding: { field_0: "name", field_1: "title", img_0: "img" },
            template: "john",
            mode: "light"
        });
        familyTreeInstance.on('click', function(sender, args) {
            openViewModal(args.node.id);
            return false;
        });
    }
}

function resetTreeZoom() {
    if (familyTreeInstance) {
        familyTreeInstance.fit();
    }
}
