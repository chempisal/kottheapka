/**
 * កត់ខ្នាតធៀបការ - Wedding Invitation Measurement & Order Management App
 * Modeled after Glide App (pisal.glide.page/dl/7e4bba)
 * Mobile-First, Vanilla JavaScript, Khmer Localization
 * 
 * Measurements:
 * - ក្របមុខ: កម្ពស់ (coverHeight), ទទឹង (coverWidth)
 * - ស្រោមលុយ: កម្ពស់ (envelopeHeight), ទទឹង (envelopeWidth)
 * - សាច់ក្នុង: កម្ពស់ (innerCardHeight), ទទឹង (innerCardWidth)
 */

// Keys for LocalStorage
const STORAGE_KEY = 'kot_khnat_thiep_orders_v2';
const SETTINGS_KEY = 'kot_khnat_thiep_settings_v1';
const THEME_KEY = 'kot_khnat_thiep_theme_v1';

// Initial realistic Cambodian wedding demo data
const DEMO_ORDERS = [
  {
    id: 'THIEP-101',
    createdAt: '2026-10-10T08:30:00Z',
    groomName: 'ជា ពិសាល',
    brideName: 'សុខ បុប្ផា',
    customerPhone: '012 345 678',
    weddingDate: '2026-11-28',
    venue: 'មជ្ឈមណ្ឌលសន្និបាតកោះពេជ្រ អគារ G',
    coverHeight: 18,
    coverWidth: 13,
    envelopeHeight: 18.8,
    envelopeWidth: 13.8,
    innerCardHeight: 17.5,
    innerCardWidth: 12.5,
    cardStyle: 'បត់២ (Bi-fold)',
    envelopeColor: 'ក្រហមមាស (Royal Red & Gold)',
    paperType: 'ក្រដាសពពាលមាស 300g',
    finishing: 'ស្ពាន់ទឹកមាស (Hot Foil Gold)',
    quantity: 500,
    unitPrice: 0.50,
    totalPrice: 250.00,
    deposit: 150.00,
    balanceDue: 100.00,
    status: 'producing',
    deliveryDate: '2026-11-15',
    notes: 'សូមកាត់គែមរាងមូល ក្តៅស្ពាន់មាសលើឈ្មោះកូនកំលោះក្រមុំ',
    imageData: ''
  },
  {
    id: 'THIEP-102',
    createdAt: '2026-10-11T10:15:00Z',
    groomName: 'ហេង វុទ្ធី',
    brideName: 'ចាន់ សេរីរ័ត្ន',
    customerPhone: '098 765 432',
    weddingDate: '2026-12-05',
    venue: 'សណ្ឋាគារ ហ្គាឌិនស៊ីធី ភ្នំពេញ',
    coverHeight: 20,
    coverWidth: 15,
    envelopeHeight: 20.8,
    envelopeWidth: 15.8,
    innerCardHeight: 19.5,
    innerCardWidth: 14.5,
    cardStyle: 'សន្លឹកទោល (Single Card)',
    envelopeColor: 'ផ្កាឈូកស្រាល (Blush Pink)',
    paperType: 'ក្រដាសកាតុងរឹង ក្រអូប 350g',
    finishing: 'អក្សរផុស (Embossing)',
    quantity: 350,
    unitPrice: 0.75,
    totalPrice: 262.50,
    deposit: 262.50,
    balanceDue: 0.00,
    status: 'ready',
    deliveryDate: '2026-11-10',
    notes: 'បន្ថែមស្រោមអាំងប៉ាវចំនួន 20 សន្លឹក ឥតគិតថ្លៃ',
    imageData: ''
  },
  {
    id: 'THIEP-103',
    createdAt: '2026-10-12T14:00:00Z',
    groomName: 'គង់ រដ្ឋា',
    brideName: 'លី ស្រីម៉ៅ',
    customerPhone: '077 889 900',
    weddingDate: '2026-12-18',
    venue: 'ភោជនីយដ្ឋាន ទន្លេបាសាក់ ២',
    coverHeight: 17,
    coverWidth: 12,
    envelopeHeight: 17.8,
    envelopeWidth: 12.8,
    innerCardHeight: 16.5,
    innerCardWidth: 11.5,
    cardStyle: 'បត់៣ (Tri-fold)',
    envelopeColor: 'មាសស្រាល (Champagne Gold)',
    paperType: 'ក្រដាសគុជខ្យង Pearl 250g',
    finishing: 'ចងបូសូត្រ (Silk Ribbon)',
    quantity: 400,
    unitPrice: 0.45,
    totalPrice: 180.00,
    deposit: 80.00,
    balanceDue: 100.00,
    status: 'pending',
    deliveryDate: '2026-11-20',
    notes: 'រង់ចាំអតិថិជនពិនិត្យ និងយល់ព្រមលើ Proof អក្សរខ្មែរ',
    imageData: ''
  },
  {
    id: 'THIEP-104',
    createdAt: '2026-10-08T09:40:00Z',
    groomName: 'អ៊ុំ សុវណ្ណ',
    brideName: 'ទេព កល្យាណ',
    customerPhone: '010 223 344',
    weddingDate: '2026-11-02',
    venue: 'ភោជនីយដ្ឋាន ពិភពថ្មី សែនសុខ',
    coverHeight: 20,
    coverWidth: 10,
    envelopeHeight: 20.8,
    envelopeWidth: 10.8,
    innerCardHeight: 19.5,
    innerCardWidth: 9.5,
    cardStyle: 'បត់២ (Bi-fold)',
    envelopeColor: 'បៃតងត្បូង (Emerald Green)',
    paperType: 'ក្រដាស Textured 280g',
    finishing: 'បិទត្រាក្រមួន (Wax Seal)',
    quantity: 600,
    unitPrice: 0.60,
    totalPrice: 360.00,
    deposit: 360.00,
    balanceDue: 0.00,
    status: 'delivered',
    deliveryDate: '2026-10-25',
    notes: 'បានប្រគល់ជូនអតិថិជន និងទូទាត់ប្រាក់គ្រប់ចំនួន',
    imageData: ''
  }
];

// App State
let orders = [];
let currentFilterStatus = 'all';
let searchQuery = '';
let currentEditingOrderId = null;
let currentViewingOrder = null;
let currentUploadedImageBase64 = '';
let isDBConnected = false;

// Default Shop Settings
let shopSettings = {
  shopName: 'រោងពុម្ព ពិសាល ខ្នាតធៀបការ',
  shopPhone: '012 888 999 / 097 555 666',
  telegram: '@pisal_wedding_cards'
};

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadSettings();
  loadOrders();
  initNavigation();
  initFormCalculations();
  initFormSubmit();
  initSearchAndFilter();
  initSizePresets();
  initImageUpload();
  initModalActions();
  initSettingsActions();
  updateCurrentDateDisplay();
  renderOrdersList();
  renderAnalytics();
  
  // Connect and sync with SQLite Database
  syncWithDB();
});

// SQLite Database Sync Function
async function syncWithDB(showToastFeedback = false) {
  const badge = document.getElementById('dbStatusBadge');
  try {
    const statusResp = await fetch('/api/status', { cache: 'no-store' });
    if (statusResp.ok) {
      const statusData = await statusResp.json();
      isDBConnected = true;

      if (badge) {
        badge.className = 'db-status-badge online';
        badge.textContent = `🟢 SQLite Online (${statusData.totalOrders || 0} ធៀប)`;
      }

      // Fetch live orders from SQLite Database
      const ordersResp = await fetch('/api/orders', { cache: 'no-store' });
      if (ordersResp.ok) {
        const dbOrders = await ordersResp.json();
        if (Array.isArray(dbOrders)) {
          orders = dbOrders;
          saveOrdersToStorage();
          renderOrdersList();
          renderAnalytics();
        }
      }

      // Fetch shop settings from SQLite Database
      const settingsResp = await fetch('/api/settings', { cache: 'no-store' });
      if (settingsResp.ok) {
        const dbSettings = await settingsResp.json();
        if (dbSettings && dbSettings.shopName) {
          shopSettings = dbSettings;
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(shopSettings));
          loadSettings();
        }
      }

      if (showToastFeedback) {
        showToast('បានធ្វើសមកាលកម្មជាមួយ SQLite Database ជោគជ័យ! 🟢', 'success');
      }
      return;
    }
  } catch (err) {
    // Server API offline (e.g. opened offline)
  }

  // Fallback to LocalStorage mode
  isDBConnected = false;
  if (badge) {
    badge.className = 'db-status-badge offline';
    badge.textContent = '🟡 LocalStorage Offline';
  }
  if (showToastFeedback) {
    showToast('កំពុងដំណើរការលើ LocalStorage ក្នុងទូរស័ព្ទ (Offline)', 'error');
  }
}

// Update Header Current Date Display in Khmer
function updateCurrentDateDisplay() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  try {
    const formatted = now.toLocaleDateString('km-KH', options);
    document.getElementById('currentDateDisplay').textContent = formatted;
    document.getElementById('analyticsDateSubtitle').textContent = `គិតត្រឹម ${formatted}`;
  } catch (e) {
    document.getElementById('currentDateDisplay').textContent = now.toDateString();
  }
}

// Load and Save Settings
function loadSettings() {
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    try {
      shopSettings = JSON.parse(saved);
      document.getElementById('shopHeaderTitle').textContent = shopSettings.shopName || 'កត់ខ្នាតធៀបការ';
      document.getElementById('settingShopName').value = shopSettings.shopName || '';
      document.getElementById('settingShopPhone').value = shopSettings.shopPhone || '';
      document.getElementById('settingShopTelegram').value = shopSettings.telegram || '';
    } catch (e) {
      console.error(e);
    }
  }
}

async function saveSettings() {
  shopSettings.shopName = document.getElementById('settingShopName').value.trim() || 'កត់ខ្នាតធៀបការ';
  shopSettings.shopPhone = document.getElementById('settingShopPhone').value.trim();
  shopSettings.telegram = document.getElementById('settingShopTelegram').value.trim();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(shopSettings));
  document.getElementById('shopHeaderTitle').textContent = shopSettings.shopName;

  // Sync to SQLite Database
  if (isDBConnected) {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopSettings)
      });
    } catch (e) {}
  }

  showToast('បានរក្សាទុកព័ត៌មានហាងក្នុង Database ជោគជ័យ!', 'success');
}

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const btnToggle = document.getElementById('btnThemeToggle');
  btnToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  });
}

// Orders Database Load & Save
function loadOrders() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      orders = JSON.parse(saved);
    } catch (e) {
      orders = [...DEMO_ORDERS];
    }
  } else {
    orders = [...DEMO_ORDERS];
    saveOrdersToStorage();
  }
}

function saveOrdersToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

// ==========================================================================
// Bottom Navigation Tabs
// ==========================================================================
function initNavigation() {
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Top header Quick Add button
  document.getElementById('btnQuickAdd').addEventListener('click', () => {
    resetForm();
    switchTab('tabForm');
  });

  // Empty state Add button
  document.getElementById('btnEmptyAdd').addEventListener('click', () => {
    resetForm();
    switchTab('tabForm');
  });

  // Form back buttons
  document.getElementById('btnCancelForm').addEventListener('click', () => {
    switchTab('tabOrders');
  });
  document.getElementById('btnCancelFormBottom').addEventListener('click', () => {
    switchTab('tabOrders');
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.remove('active');
  });
  const activeView = document.getElementById(tabId);
  if (activeView) activeView.classList.add('active');

  document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  if (tabId === 'tabOrders') {
    renderOrdersList();
  } else if (tabId === 'tabAnalytics') {
    renderAnalytics();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// Card Size (ក្របមុខ, ស្រោមលុយ, សាច់ក្នុង) Presets & Calculations
// ==========================================================================
function initSizePresets() {
  const presetBtns = document.querySelectorAll('.preset-btn');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const ch = btn.getAttribute('data-ch');
      const cw = btn.getAttribute('data-cw');
      const eh = btn.getAttribute('data-eh');
      const ew = btn.getAttribute('data-ew');
      const ih = btn.getAttribute('data-ih');
      const iw = btn.getAttribute('data-iw');

      document.getElementById('coverHeightInput').value = ch;
      document.getElementById('coverWidthInput').value = cw;

      document.getElementById('envelopeHeightInput').value = eh;
      document.getElementById('envelopeWidthInput').value = ew;

      document.getElementById('innerCardHeightInput').value = ih;
      document.getElementById('innerCardWidthInput').value = iw;

      showToast(`បានជ្រើសរើសខ្នាត៖ ក្របមុខ ${ch}×${cw} cm • ស្រោមលុយ ${eh}×${ew} cm • សាច់ក្នុង ${ih}×${iw} cm`, 'success');
    });
  });

  // Auto calculate button from ក្របមុខ (Cover)
  document.getElementById('btnAutoSuggestAll').addEventListener('click', () => {
    const ch = parseFloat(document.getElementById('coverHeightInput').value);
    const cw = parseFloat(document.getElementById('coverWidthInput').value);

    if (isNaN(ch) || isNaN(cw) || ch <= 0 || cw <= 0) {
      showToast('សូមបញ្ចូលកម្ពស់ និងទទឹងរបស់ «ក្របមុខ» ជាមុនសិន!', 'error');
      return;
    }

    // ស្រោមលុយ = ក្របមុខ + 0.8 cm
    const eh = (ch + 0.8).toFixed(1);
    const ew = (cw + 0.8).toFixed(1);

    // សាច់ក្នុង = ក្របមុខ - 0.5 cm
    const ih = (ch - 0.5).toFixed(1);
    const iw = (cw - 0.5).toFixed(1);

    document.getElementById('envelopeHeightInput').value = eh;
    document.getElementById('envelopeWidthInput').value = ew;

    document.getElementById('innerCardHeightInput').value = ih;
    document.getElementById('innerCardWidthInput').value = iw;

    showToast(`គណនាស្វ័យប្រវត្តរួចរាល់៖ ស្រោមលុយ (${eh}×${ew}cm), សាច់ក្នុង (${ih}×${iw}cm)`, 'success');
  });
}

// Automatic Financial Calculations (Qty * Price = Total, Total - Deposit = Balance)
function initFormCalculations() {
  const qtyInput = document.getElementById('quantityInput');
  const priceInput = document.getElementById('unitPriceInput');
  const depositInput = document.getElementById('depositInput');
  const totalInput = document.getElementById('totalPriceInput');
  const balanceInput = document.getElementById('balanceDueInput');

  function calculate() {
    const qty = parseInt(qtyInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const deposit = parseFloat(depositInput.value) || 0;

    const total = qty * price;
    const balance = Math.max(0, total - deposit);

    totalInput.value = total.toFixed(2);
    balanceInput.value = balance.toFixed(2);
  }

  qtyInput.addEventListener('input', calculate);
  priceInput.addEventListener('input', calculate);
  depositInput.addEventListener('input', calculate);
}

// Image Attachment Handling (Upload & Base64 preview)
function initImageUpload() {
  const uploadBox = document.getElementById('imageUploadBox');
  const fileInput = document.getElementById('imageFileInput');
  const previewContainer = document.getElementById('imagePreviewContainer');
  const previewImg = document.getElementById('imagePreviewImg');
  const btnRemove = document.getElementById('btnRemoveImage');

  uploadBox.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        currentUploadedImageBase64 = event.target.result;
        previewImg.src = currentUploadedImageBase64;
        uploadBox.classList.add('hidden');
        previewContainer.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  btnRemove.addEventListener('click', () => {
    currentUploadedImageBase64 = '';
    previewImg.src = '';
    fileInput.value = '';
    uploadBox.classList.remove('hidden');
    previewContainer.classList.add('hidden');
  });
}

// Reset Form to Clean State
function resetForm() {
  currentEditingOrderId = null;
  currentUploadedImageBase64 = '';
  document.getElementById('orderForm').reset();
  document.getElementById('orderIdField').value = '';
  document.getElementById('formTitleText').textContent = 'កត់ខ្នាតធៀបថ្មី';

  document.getElementById('totalPriceInput').value = '';
  document.getElementById('balanceDueInput').value = '';

  document.getElementById('imagePreviewImg').src = '';
  document.getElementById('imageUploadBox').classList.remove('hidden');
  document.getElementById('imagePreviewContainer').classList.add('hidden');
}

// Populate Form for Editing
function editOrder(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  currentEditingOrderId = orderId;
  document.getElementById('orderIdField').value = order.id;
  document.getElementById('formTitleText').textContent = `កែសម្រួលខ្នាតធៀប (${order.id})`;

  document.getElementById('groomNameInput').value = order.groomName || '';
  document.getElementById('brideNameInput').value = order.brideName || '';
  document.getElementById('customerPhoneInput').value = order.customerPhone || '';
  document.getElementById('weddingDateInput').value = order.weddingDate || '';
  document.getElementById('venueInput').value = order.venue || '';

  // 1. ក្របមុខ
  document.getElementById('coverHeightInput').value = order.coverHeight || order.cardHeight || '';
  document.getElementById('coverWidthInput').value = order.coverWidth || order.cardWidth || '';

  // 2. ស្រោមលុយ
  document.getElementById('envelopeHeightInput').value = order.envelopeHeight || '';
  document.getElementById('envelopeWidthInput').value = order.envelopeWidth || '';

  // 3. សាច់ក្នុង
  document.getElementById('innerCardHeightInput').value = order.innerCardHeight || (order.coverHeight ? (order.coverHeight - 0.5) : '');
  document.getElementById('innerCardWidthInput').value = order.innerCardWidth || (order.coverWidth ? (order.coverWidth - 0.5) : '');

  document.getElementById('cardStyleSelect').value = order.cardStyle || 'បត់២ (Bi-fold)';
  document.getElementById('envelopeColorSelect').value = order.envelopeColor || 'ក្រហមមាស (Royal Red & Gold)';
  document.getElementById('paperTypeInput').value = order.paperType || '';
  document.getElementById('finishingSelect').value = order.finishing || 'ស្ពាន់ទឹកមាស (Hot Foil Gold)';

  document.getElementById('quantityInput').value = order.quantity || '';
  document.getElementById('unitPriceInput').value = order.unitPrice || '';
  document.getElementById('totalPriceInput').value = (order.totalPrice || 0).toFixed(2);
  document.getElementById('depositInput').value = (order.deposit || 0).toFixed(2);
  document.getElementById('balanceDueInput').value = (order.balanceDue || 0).toFixed(2);

  document.getElementById('orderStatusSelect').value = order.status || 'pending';
  document.getElementById('deliveryDateInput').value = order.deliveryDate || '';
  document.getElementById('notesInput').value = order.notes || '';

  if (order.imageData) {
    currentUploadedImageBase64 = order.imageData;
    document.getElementById('imagePreviewImg').src = order.imageData;
    document.getElementById('imageUploadBox').classList.add('hidden');
    document.getElementById('imagePreviewContainer').classList.remove('hidden');
  } else {
    currentUploadedImageBase64 = '';
    document.getElementById('imagePreviewImg').src = '';
    document.getElementById('imageUploadBox').classList.remove('hidden');
    document.getElementById('imagePreviewContainer').classList.add('hidden');
  }

  switchTab('tabForm');
}

// Form Submission
function initFormSubmit() {
  const form = document.getElementById('orderForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const groomName = document.getElementById('groomNameInput').value.trim();
    const brideName = document.getElementById('brideNameInput').value.trim();
    const customerPhone = document.getElementById('customerPhoneInput').value.trim();
    const weddingDate = document.getElementById('weddingDateInput').value;

    // ក្របមុខ
    const coverHeight = parseFloat(document.getElementById('coverHeightInput').value);
    const coverWidth = parseFloat(document.getElementById('coverWidthInput').value);

    // ស្រោមលុយ
    const envelopeHeight = parseFloat(document.getElementById('envelopeHeightInput').value);
    const envelopeWidth = parseFloat(document.getElementById('envelopeWidthInput').value);

    // សាច់ក្នុង
    const innerCardHeight = parseFloat(document.getElementById('innerCardHeightInput').value);
    const innerCardWidth = parseFloat(document.getElementById('innerCardWidthInput').value);

    const quantity = parseInt(document.getElementById('quantityInput').value);
    const unitPrice = parseFloat(document.getElementById('unitPriceInput').value);

    if (!groomName || !brideName || !customerPhone || !weddingDate) {
      showToast('សូមបំពេញឈ្មោះកូនកំលោះ ក្រមុំ លេខទូរស័ព្ទ និងថ្ងៃការ!', 'error');
      return;
    }

    if (isNaN(coverHeight) || isNaN(coverWidth)) {
      showToast('សូមបញ្ចូលកម្ពស់ និងទទឹងរបស់ «ក្របមុខ»!', 'error');
      return;
    }

    if (isNaN(envelopeHeight) || isNaN(envelopeWidth)) {
      showToast('សូមបញ្ចូលកម្ពស់ និងទទឹងរបស់ «ស្រោមលុយ»!', 'error');
      return;
    }

    if (isNaN(innerCardHeight) || isNaN(innerCardWidth)) {
      showToast('សូមបញ្ចូលកម្ពស់ និងទទឹងរបស់ «សាច់ក្នុង»!', 'error');
      return;
    }

    if (isNaN(quantity) || quantity <= 0 || isNaN(unitPrice) || unitPrice < 0) {
      showToast('សូមបញ្ចូលចំនួនធៀប និងតម្លៃក្នុង១សន្លឹក!', 'error');
      return;
    }

    const totalPrice = parseFloat(document.getElementById('totalPriceInput').value) || (quantity * unitPrice);
    const deposit = parseFloat(document.getElementById('depositInput').value) || 0;
    const balanceDue = Math.max(0, totalPrice - deposit);

    const orderData = {
      groomName,
      brideName,
      customerPhone,
      weddingDate,
      venue: document.getElementById('venueInput').value.trim(),
      // ក្របមុខ
      coverHeight,
      coverWidth,
      // ស្រោមលុយ
      envelopeHeight,
      envelopeWidth,
      // សាច់ក្នុង
      innerCardHeight,
      innerCardWidth,
      // Options
      cardStyle: document.getElementById('cardStyleSelect').value,
      envelopeColor: document.getElementById('envelopeColorSelect').value,
      paperType: document.getElementById('paperTypeInput').value.trim(),
      finishing: document.getElementById('finishingSelect').value,
      quantity,
      unitPrice,
      totalPrice,
      deposit,
      balanceDue,
      status: document.getElementById('orderStatusSelect').value,
      deliveryDate: document.getElementById('deliveryDateInput').value,
      notes: document.getElementById('notesInput').value.trim(),
      imageData: currentUploadedImageBase64
    };

    if (currentEditingOrderId) {
      const index = orders.findIndex(o => o.id === currentEditingOrderId);
      if (index !== -1) {
        orderData.id = currentEditingOrderId;
        orderData.createdAt = orders[index].createdAt;
        orders[index] = orderData;
        showToast(`បានកែសម្រួលខ្នាតធៀប ${orderData.id} ជោគជ័យ!`, 'success');

        // Sync to SQLite Database
        if (isDBConnected) {
          fetch(`/api/orders/${orderData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
          }).catch(console.error);
        }
      }
    } else {
      const nextNum = orders.length + 101;
      orderData.id = `THIEP-${nextNum}`;
      orderData.createdAt = new Date().toISOString();
      orders.unshift(orderData);
      showToast(`បានកត់ត្រាខ្នាតធៀបថ្មី (${orderData.id}) ក្នុង Database ជោគជ័យ!`, 'success');

      // Sync to SQLite Database
      if (isDBConnected) {
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        }).catch(console.error);
      }
    }

    saveOrdersToStorage();
    resetForm();
    switchTab('tabOrders');
  });
}

// Delete Order
function deleteOrder(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  if (confirm(`តើអ្នកពិតជាចង់លុបទិន្នន័យធៀបការរបស់ "${order.groomName} & ${order.brideName}" មែនទេ?`)) {
    orders = orders.filter(o => o.id !== orderId);
    saveOrdersToStorage();
    renderOrdersList();
    renderAnalytics();

    // Sync to SQLite Database
    if (isDBConnected) {
      fetch(`/api/orders/${orderId}`, {
        method: 'DELETE'
      }).catch(console.error);
    }

    showToast('បានលុបទិន្នន័យពី Database រួចរាល់', 'success');
  }
}

// Quick Status Update from Card
function updateOrderStatus(orderId, newStatus) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveOrdersToStorage();
    renderOrdersList();
    renderAnalytics();

    // Sync to SQLite Database
    if (isDBConnected) {
      fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      }).catch(console.error);
    }

    showToast(`បានផ្លាស់ប្តូរស្ថានភាពទៅជា៖ ${getStatusLabel(newStatus)}`, 'success');
  }
}

// ==========================================================================
// Search, Filter & Render Orders List (Tab 1)
// ==========================================================================
function initSearchAndFilter() {
  const searchInput = document.getElementById('searchInput');
  const btnClear = document.getElementById('btnClearSearch');

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    btnClear.classList.toggle('hidden', searchQuery.length === 0);
    renderOrdersList();
  });

  btnClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    btnClear.classList.add('hidden');
    renderOrdersList();
  });

  // Status Filter Chips
  const chips = document.querySelectorAll('#statusFilterBar .chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilterStatus = chip.getAttribute('data-status');
      renderOrdersList();
    });
  });
}

function getStatusLabel(status) {
  switch (status) {
    case 'pending': return '⏳ រង់ចាំពិនិត្យ';
    case 'producing': return '⚙️ កំពុងផលិត';
    case 'ready': return '✅ រួចរាល់';
    case 'delivered': return '🎉 បានប្រគល់';
    default: return status;
  }
}

function renderOrdersList() {
  const container = document.getElementById('ordersListContainer');
  const emptyState = document.getElementById('emptyStateContainer');

  let filtered = orders.filter(order => {
    if (currentFilterStatus !== 'all' && order.status !== currentFilterStatus) {
      return false;
    }
    if (searchQuery) {
      const matchGroom = (order.groomName || '').toLowerCase().includes(searchQuery);
      const matchBride = (order.brideName || '').toLowerCase().includes(searchQuery);
      const matchPhone = (order.customerPhone || '').includes(searchQuery);
      const matchId = (order.id || '').toLowerCase().includes(searchQuery);
      const matchVenue = (order.venue || '').toLowerCase().includes(searchQuery);
      return matchGroom || matchBride || matchPhone || matchId || matchVenue;
    }
    return true;
  });

  // Update Status Chip Counts
  document.getElementById('countAll').textContent = orders.length;
  document.getElementById('countPending').textContent = orders.filter(o => o.status === 'pending').length;
  document.getElementById('countProducing').textContent = orders.filter(o => o.status === 'producing').length;
  document.getElementById('countReady').textContent = orders.filter(o => o.status === 'ready').length;
  document.getElementById('countDelivered').textContent = orders.filter(o => o.status === 'delivered').length;

  // Update Quick Summary Strip
  const totalCards = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
  const totalDue = orders.reduce((sum, o) => sum + (o.balanceDue || 0), 0);
  document.getElementById('stripTotalOrders').textContent = orders.length;
  document.getElementById('stripTotalCards').textContent = `${totalCards.toLocaleString()} សន្លឹក`;
  document.getElementById('stripRemainingDue').textContent = `$${totalDue.toFixed(2)}`;

  container.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    container.classList.add('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  container.classList.remove('hidden');

  filtered.forEach(order => {
    const cardEl = document.createElement('div');
    cardEl.className = 'order-card';

    const isPaid = (order.balanceDue || 0) <= 0;
    const balanceClass = isPaid ? 'paid-clean' : 'balance-due';
    const balanceText = isPaid ? 'បានបង់គ្រប់ ✓' : `$${(order.balanceDue || 0).toFixed(2)}`;

    // Fallbacks for older data if any
    const coverH = order.coverHeight || order.cardHeight || 0;
    const coverW = order.coverWidth || order.cardWidth || 0;
    const envH = order.envelopeHeight || 0;
    const envW = order.envelopeWidth || 0;
    const innerH = order.innerCardHeight || (coverH ? (coverH - 0.5).toFixed(1) : 0);
    const innerW = order.innerCardWidth || (coverW ? (coverW - 0.5).toFixed(1) : 0);

    cardEl.innerHTML = `
      <div class="order-card-header">
        <div class="couple-names">
          <div class="couple-main">
            <span>${order.groomName}</span>
            <span class="heart">♥</span>
            <span>${order.brideName}</span>
          </div>
          <span class="order-code-badge">${order.id} • ថ្ងៃការ: ${formatKhmerDate(order.weddingDate)}</span>
        </div>
        <div class="status-badge ${order.status}">
          ${getStatusLabel(order.status)}
        </div>
      </div>

      <div class="card-details-grid">
        <div class="detail-item">
          <span class="detail-label">🖼️ ក្របមុខ (កម្ពស់ × ទទឹង):</span>
          <span class="detail-value dimension">${coverH} × ${coverW} cm</span>
          <span style="font-size: 11px; color: var(--text-muted);">${order.cardStyle}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">✉️ ស្រោមលុយ (កម្ពស់ × ទទឹង):</span>
          <span class="detail-value dimension" style="color: #B45309;">${envH} × ${envW} cm</span>
          <span style="font-size: 11px; color: var(--text-muted);">${order.envelopeColor}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">📄 សាច់ក្នុង (កម្ពស់ × ទទឹង):</span>
          <span class="detail-value dimension" style="color: #059669;">${innerH} × ${innerW} cm</span>
          <span style="font-size: 11px; color: var(--text-muted);">${order.finishing}</span>
        </div>

        <div class="detail-item">
          <span class="detail-label">📦 បរិមាណសរុប:</span>
          <span class="detail-value" style="color: #2563EB;">${order.quantity} សន្លឹក</span>
          <span style="font-size: 11px; color: var(--text-muted);">${order.paperType || 'ក្រដាសស្តង់ដារ'}</span>
        </div>
      </div>

      <div class="order-financials-strip">
        <div class="fin-group">
          <span class="fin-label">តម្លៃសរុប:</span>
          <span class="fin-value">$${(order.totalPrice || 0).toFixed(2)}</span>
        </div>
        <div class="fin-group">
          <span class="fin-label">ប្រាក់កក់:</span>
          <span class="fin-value">$${(order.deposit || 0).toFixed(2)}</span>
        </div>
        <div class="fin-group">
          <span class="fin-label">នៅសល់:</span>
          <span class="fin-value ${balanceClass}">${balanceText}</span>
        </div>
      </div>

      <div class="order-card-actions">
        <a href="tel:${order.customerPhone}" class="btn-card-action call" title="ខលទូរស័ព្ទ">
          📞 ខល
        </a>
        <button type="button" class="btn-card-action primary" onclick="openCuttingSlipModal('${order.id}')" title="មើលខ្នាតកាត់">
          📐 សន្លឹកកាត់
        </button>
        <button type="button" class="btn-card-action" onclick="editOrder('${order.id}')" title="កែសម្រួល">
          ✏️ កែ
        </button>
        <button type="button" class="btn-card-action" onclick="deleteOrder('${order.id}')" title="លុប">
          🗑️
        </button>
      </div>
    `;

    container.appendChild(cardEl);
  });
}

function formatKhmerDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  } catch (e) {}
  return dateStr;
}

// ==========================================================================
// Workshop Cutting Slip & Invoice Modal
// ==========================================================================
function openCuttingSlipModal(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  currentViewingOrder = order;

  const printArea = document.getElementById('slipPrintArea');
  const isPaid = (order.balanceDue || 0) <= 0;

  const coverH = order.coverHeight || order.cardHeight || 0;
  const coverW = order.coverWidth || order.cardWidth || 0;
  const envH = order.envelopeHeight || 0;
  const envW = order.envelopeWidth || 0;
  const innerH = order.innerCardHeight || (coverH ? (coverH - 0.5).toFixed(1) : 0);
  const innerW = order.innerCardWidth || (coverW ? (coverW - 0.5).toFixed(1) : 0);

  printArea.innerHTML = `
    <div class="slip-box">
      <div class="slip-header">
        <div class="slip-title">សន្លឹកកត់ខ្នាត និងវិក្កយបត្រធៀបការ</div>
        <div class="slip-subtitle">${shopSettings.shopName} • ទូរស័ព្ទ: ${shopSettings.shopPhone}</div>
        <div class="slip-code">លេខកូដ៖ ${order.id} | កាលបរិច្ឆេទ៖ ${new Date().toLocaleDateString('km-KH')}</div>
      </div>

      <div class="slip-couple-box">
        <div class="slip-couple-title">កូនកំលោះ៖ ${order.groomName} ♥ កូនក្រមុំ៖ ${order.brideName}</div>
        <div class="slip-event-date">ថ្ងៃសិរីសួស្តីរៀបការ៖ <strong>${formatKhmerDate(order.weddingDate)}</strong></div>
        ${order.venue ? `<div style="font-size: 11px; margin-top: 2px;">ទីតាំង៖ ${order.venue}</div>` : ''}
        <div style="font-size: 11px; margin-top: 2px;">លេខទូរស័ព្ទអតិថិជន៖ <strong>${order.customerPhone}</strong></div>
      </div>

      <table class="slip-specs-table">
        <thead>
          <tr>
            <th>លម្អិតលក្ខណៈបច្ចេកទេស</th>
            <th>ខ្នាត និងព័ត៌មានកាត់</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🖼️ <strong>ក្របមុខ</strong></td>
            <td class="slip-highlight-cut">កម្ពស់ <strong>${coverH} cm</strong> × ទទឹង <strong>${coverW} cm</strong> (${order.cardStyle})</td>
          </tr>
          <tr>
            <td>✉️ <strong>ស្រោមលុយ</strong></td>
            <td class="slip-highlight-cut">កម្ពស់ <strong>${envH} cm</strong> × ទទឹង <strong>${envW} cm</strong></td>
          </tr>
          <tr>
            <td>📄 <strong>សាច់ក្នុង</strong></td>
            <td class="slip-highlight-cut">កម្ពស់ <strong>${innerH} cm</strong> × ទទឹង <strong>${innerW} cm</strong></td>
          </tr>
          <tr>
            <td>🎨 ពណ៌ស្រោមសំបុត្រ</td>
            <td>${order.envelopeColor}</td>
          </tr>
          <tr>
            <td>📄 ប្រភេទក្រដាស</td>
            <td>${order.paperType || 'ក្រដាសស្តង់ដារ'}</td>
          </tr>
          <tr>
            <td>✨ បច្ចេកទេសព្រីន/តុបតែង</td>
            <td>${order.finishing}</td>
          </tr>
          <tr>
            <td>📦 ចំនួនសរុប</td>
            <td><strong>${order.quantity} សន្លឹក</strong></td>
          </tr>
          <tr>
            <td>📅 ថ្ងៃកំណត់ប្រគល់ទំនិញ</td>
            <td><strong>${formatKhmerDate(order.deliveryDate) || 'តាមការកំណត់'}</strong></td>
          </tr>
        </tbody>
      </table>

      ${order.notes ? `
        <div class="slip-cutter-note">
          <strong>⚠️ កំណត់សម្គាល់ជាងកាត់៖</strong> ${order.notes}
        </div>
      ` : ''}

      <div class="slip-financials">
        <div class="slip-fin-row">
          <span>តម្លៃឯកតា៖</span>
          <span>$${order.unitPrice.toFixed(2)} / សន្លឹក</span>
        </div>
        <div class="slip-fin-row">
          <span>តម្លៃសរុប (${order.quantity} សន្លឹក)៖</span>
          <span>$${order.totalPrice.toFixed(2)}</span>
        </div>
        <div class="slip-fin-row">
          <span>ប្រាក់កក់បានទទួល៖</span>
          <span>$${order.deposit.toFixed(2)}</span>
        </div>
        <div class="slip-fin-row slip-fin-total">
          <span>ប្រាក់នៅសល់៖</span>
          <span style="color: ${isPaid ? '#059669' : '#DC2626'};">
            ${isPaid ? 'បានទូទាត់គ្រប់ចំនួន ✓' : `$${order.balanceDue.toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  `;

  document.getElementById('cuttingSlipModal').classList.remove('hidden');
}

function initModalActions() {
  const modal = document.getElementById('cuttingSlipModal');
  const btnClose = document.getElementById('btnCloseModal');
  const btnPrint = document.getElementById('btnPrintSlip');
  const btnTelegram = document.getElementById('btnShareTelegram');

  btnClose.addEventListener('click', () => modal.classList.add('hidden'));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  btnPrint.addEventListener('click', () => {
    window.print();
  });

  btnTelegram.addEventListener('click', () => {
    if (!currentViewingOrder) return;
    const o = currentViewingOrder;
    const coverH = o.coverHeight || o.cardHeight || 0;
    const coverW = o.coverWidth || o.cardWidth || 0;
    const envH = o.envelopeHeight || 0;
    const envW = o.envelopeWidth || 0;
    const innerH = o.innerCardHeight || (coverH ? (coverH - 0.5).toFixed(1) : 0);
    const innerW = o.innerCardWidth || (coverW ? (coverW - 0.5).toFixed(1) : 0);

    const msg = `💌 *សន្លឹកកត់ខ្នាតធៀបការ [${o.id}]*\n` +
      `🤵 កូនកំលោះ: ${o.groomName}\n` +
      `👰 កូនក្រមុំ: ${o.brideName}\n` +
      `📞 ទូរស័ព្ទ: ${o.customerPhone}\n` +
      `📅 ថ្ងៃការ: ${formatKhmerDate(o.weddingDate)}\n\n` +
      `🖼️ *ក្របមុខ:* កម្ពស់ ${coverH} cm x ទទឹង ${coverW} cm (${o.cardStyle})\n` +
      `✉️ *ស្រោមលុយ:* កម្ពស់ ${envH} cm x ទទឹង ${envW} cm (${o.envelopeColor})\n` +
      `📄 *សាច់ក្នុង:* កម្ពស់ ${innerH} cm x ទទឹង ${innerW} cm\n` +
      `📦 *ចំនួន:* ${o.quantity} សន្លឹក\n` +
      `✨ *បច្ចេកទេស:* ${o.finishing}\n\n` +
      `💵 តម្លៃសរុប: $${o.totalPrice.toFixed(2)}\n` +
      `💰 ប្រាក់កក់: $${o.deposit.toFixed(2)}\n` +
      `⏳ នៅសល់: $${o.balanceDue.toFixed(2)}\n\n` +
      `🏪 ${shopSettings.shopName} (${shopSettings.shopPhone})`;

    const encoded = encodeURIComponent(msg);
    const tgUrl = `https://t.me/share/url?url=&text=${encoded}`;
    window.open(tgUrl, '_blank');
  });
}

// ==========================================================================
// Analytics & Dashboard (Tab 3)
// ==========================================================================
function renderAnalytics() {
  const totalOrders = orders.length;
  const totalCards = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalBalanceDue = orders.reduce((sum, o) => sum + (o.balanceDue || 0), 0);

  document.getElementById('kpiTotalOrders').textContent = totalOrders;
  document.getElementById('kpiTotalCards').textContent = totalCards.toLocaleString();
  document.getElementById('kpiTotalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
  document.getElementById('kpiTotalBalanceDue').textContent = `$${totalBalanceDue.toFixed(2)}`;

  // Production Status breakdown
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const producingCount = orders.filter(o => o.status === 'producing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  document.getElementById('progPendingVal').textContent = `${pendingCount} គូ`;
  document.getElementById('progProducingVal').textContent = `${producingCount} គូ`;
  document.getElementById('progReadyVal').textContent = `${readyCount} គូ`;
  document.getElementById('progDeliveredVal').textContent = `${deliveredCount} គូ`;

  const max = totalOrders || 1;
  document.getElementById('progPendingBar').style.width = `${(pendingCount / max) * 100}%`;
  document.getElementById('progProducingBar').style.width = `${(producingCount / max) * 100}%`;
  document.getElementById('progReadyBar').style.width = `${(readyCount / max) * 100}%`;
  document.getElementById('progDeliveredBar').style.width = `${(deliveredCount / max) * 100}%`;

  // Upcoming Deliveries Schedule
  const upcomingList = document.getElementById('upcomingScheduleList');
  upcomingList.innerHTML = '';

  const activeOrders = orders
    .filter(o => o.status !== 'delivered' && o.deliveryDate)
    .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));

  if (activeOrders.length === 0) {
    upcomingList.innerHTML = '<div style="color: var(--text-secondary); font-size: 13px; text-align: center; padding: 12px;">មិនមានកាលវិភាគប្រគល់ជិតៗនេះទេ</div>';
  } else {
    activeOrders.slice(0, 5).forEach(o => {
      const item = document.createElement('div');
      item.className = 'upcoming-item';
      item.innerHTML = `
        <div class="upcoming-couple">
          ${o.groomName} & ${o.brideName} (${o.quantity} សន្លឹក)
        </div>
        <div class="upcoming-date">
          ប្រគល់: ${formatKhmerDate(o.deliveryDate)}
        </div>
      `;
      upcomingList.appendChild(item);
    });
  }
}

// ==========================================================================
// Settings, Backup, Restore & Demo Reset (Tab 4)
// ==========================================================================
function initSettingsActions() {
  document.getElementById('btnSaveShopSettings').addEventListener('click', saveSettings);

  // Export JSON
  document.getElementById('btnExportJSON').addEventListener('click', () => {
    const dataToExport = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      shopSettings,
      orders
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kot_khnat_thiep_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('បានទាញយកឯកសារបម្រុងទុក (Backup) ជោគជ័យ!', 'success');
  });

  // Import JSON
  const importFileInput = document.getElementById('importFileInput');
  document.getElementById('btnImportJSON').addEventListener('click', () => {
    importFileInput.click();
  });

  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          orders = imported;
        } else if (imported.orders && Array.isArray(imported.orders)) {
          orders = imported.orders;
          if (imported.shopSettings) {
            shopSettings = imported.shopSettings;
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(shopSettings));
            loadSettings();
          }
        } else {
          throw new Error('Invalid JSON format');
        }

        saveOrdersToStorage();
        renderOrdersList();
        renderAnalytics();
        showToast('បានបញ្ចូលទិន្នន័យ (Restore) ជោគជ័យ!', 'success');
      } catch (err) {
        showToast('ឯកសារ JSON មិនត្រឹមត្រូវទេ!', 'error');
      }
    };
    reader.readAsText(file);
  });

  // Sync Database Button
  const btnSync = document.getElementById('btnSyncDB');
  if (btnSync) {
    btnSync.addEventListener('click', () => {
      syncWithDB(true);
    });
  }

  // Reset Demo Data
  document.getElementById('btnResetDemoData').addEventListener('click', async () => {
    if (confirm('តើអ្នកពិតជាចង់ផ្ទុកទិន្នន័យគំរូឡើងវិញមែនទេ? (ទិន្នន័យចាស់ៗទាំងអស់នឹងត្រូវជំនួសដោយទិន្នន័យគំរូ)')) {
      if (isDBConnected) {
        try {
          await fetch('/api/reset-demo', { method: 'POST' });
          await syncWithDB(false);
          showToast('បានផ្ទុកទិន្នន័យគំរូក្នុង SQLite Database រួចរាល់! 🟢', 'success');
          return;
        } catch (e) {}
      }

      orders = [...DEMO_ORDERS];
      saveOrdersToStorage();
      renderOrdersList();
      renderAnalytics();
      showToast('បានផ្ទុកទិន្នន័យគំរូរួចរាល់!', 'success');
    }
  });
}

// ==========================================================================
// Toast Notification System
// ==========================================================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '✓' : '⚠️';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
