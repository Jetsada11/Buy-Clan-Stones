let selectedStone = null;
let stonePrice = 0;
let clanCoinsPerStone = 0;

// Stone selection
document.getElementById('mystic-stone').addEventListener('click', function() {
    selectStone(this, 'mystic');
});

document.getElementById('darkened-stone').addEventListener('click', function() {
    selectStone(this, 'darkened');
});

function selectStone(element, type) {
    // Remove previous selection
    document.querySelectorAll('.stone-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked stone
    element.classList.add('selected');
    
    // Set stone data
    if (type === 'mystic') {
        stonePrice = 2000;
        clanCoinsPerStone = 160;
        selectedStone = 'mystic';
    } else if (type === 'darkened') {
        stonePrice = 4500;
        clanCoinsPerStone = 375;
        selectedStone = 'darkened';
    }
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Parse formatted number
function parseFormattedNumber(str) {
    return parseInt(str.replace(/,/g, '')) || 0;
}

// DS input formatting
document.getElementById('ds-input').addEventListener('input', function(e) {
    let value = e.target.value.replace(/,/g, '');
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
        value = value.replace(/\D/g, '');
    }
    
    // Format with commas
    if (value) {
        e.target.value = formatNumber(value);
    } else {
        e.target.value = '';
    }
});

// Calculate button
document.getElementById('calculate-btn').addEventListener('click', function() {
    if (!selectedStone) {
        alert('กรุณาเลือกหินก่อนคำนวณ');
        return;
    }
    
    const dsInput = document.getElementById('ds-input').value;
    const totalDS = parseFormattedNumber(dsInput);
    
    if (totalDS <= 0) {
        alert('กรุณากรอกจำนวน DS ที่ต้องการคำนวณ');
        return;
    }
    
    // Check if tax is enabled
    const taxEnabled = document.getElementById('tax-toggle').checked;
    
    let taxAmount = 0;
    let goldCost = 0;
    let remainingDS = totalDS;
    
    if (taxEnabled) {
        // Calculate tax (30%)
        const taxRate = 0.3;
        taxAmount = Math.floor(totalDS * taxRate);
        remainingDS = totalDS - taxAmount;
        // Calculate gold cost (assuming 1 gold per 100,000 DS of tax)
        goldCost = Math.ceil(taxAmount / 100000);
    }
    
    // Calculate how many stones can be purchased
    const stoneCount = Math.floor(remainingDS / stonePrice);
    
    // Calculate total clan coins needed
    const totalClanCoins = stoneCount * clanCoinsPerStone;
    
    // Update result display
    updateResults(stoneCount, taxAmount, goldCost, totalClanCoins, taxEnabled);
    
    // Show result section
    document.getElementById('result-section').style.display = 'block';
});

function updateResults(stoneCount, taxAmount, goldCost, totalClanCoins, taxEnabled) {
    // Update stone icon based on selection
    const stoneIcon = document.getElementById('result-stone-icon');
    if (selectedStone === 'mystic') {
        stoneIcon.src = 'image/Mystic Stone.png';
    } else {
        stoneIcon.src = 'image/Darkened Stone.png';
    }
    
    // Update stone count
    document.getElementById('stone-count').textContent = 
        `${selectedStone === 'mystic' ? 'Mystic Stone' : 'Darkened Stone'} = ${formatNumber(stoneCount)} stones`;
    
    // Update tax deduction
    if (taxEnabled) {
        document.getElementById('tax-deduction').textContent = 
            `หักภาษี 30% = ${formatNumber(taxAmount)} DS`;
        document.getElementById('tax-deduction').style.display = 'flex';
    } else {
        document.getElementById('tax-deduction').textContent = 
            `ไม่มีการหักภาษี`;
        document.getElementById('tax-deduction').style.display = 'flex';
    }
    
    // Update gold cost
    if (taxEnabled && goldCost > 0) {
        document.getElementById('gold-cost').textContent = 
            `ทองที่ต้องจ่ายค่าภาษี = ${formatNumber(goldCost)} Gold`;
        document.getElementById('gold-cost').style.display = 'flex';
    } else {
        document.getElementById('gold-cost').textContent = 
            `ไม่ต้องจ่ายทองคำค่าภาษี`;
        document.getElementById('gold-cost').style.display = 'flex';
    }
    
    // Update clan coins cost
    document.getElementById('clan-coins-cost').textContent = 
        `เหรียญแคลนที่ต้องใช้ซื้อ = ${formatNumber(totalClanCoins)} Coins`;
}

// Initialize with Mystic Stone selected
document.addEventListener('DOMContentLoaded', function() {
    selectStone(document.getElementById('mystic-stone'), 'mystic');
});
