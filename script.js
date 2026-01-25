// تعریف رنگ‌های اصلی سیستم (پالت حرفه‌ای و مدرن - نسخه تاریک)
const themeColors = {
    primary: '#007BBD',           // آبی اصلی - تاریک‌تر (آبی دریایی)
    primaryLight: '#0A3D62',      // آبی تیره برای پس‌زمینه
    primaryDark: '#005A8C',       // آبی تیره‌تر
    secondary: '#FF5722',         // نارنجی تیره‌تر (سیر)
    accent: '#E91E63',            // قرمز/صورتی تیره
    success: '#00A97F',           // سبز تیره‌تر
    warning: '#FFC107',           // زرد تیره‌تر (طلایی)
    danger: '#D32F2F',            // قرمز تیره
    info: '#1976D2',              // آبی اطلاع‌رسانی تیره
    text: '#E0E0E0',              // متن روشن روی پس‌زمینه تاریک
    gray: '#9E9E9E',              // خاکستری متوسط
    lightGray: '#424242',         // خاکستری تیره برای پس‌زمینه
    bgLight: '#121212',           // پس‌زمینه تاریک اصلی
    border: '#333333',            // مرزهای تیره
    white: '#FFFFFF',             // سفید
    black: '#000000',             // سیاه کامل
    gradientStart: '#007BBD',     // شروع گرادینت
    gradientEnd: '#005A8C',       // پایان گرادینت
    shadow: 'rgba(0, 0, 0, 0.3)', // سایه تیره
    overlay: 'rgba(0, 0, 0, 0.8)', // overlay تیره برای مدال‌ها
    cardBg: '#1E1E1E',           // پس‌زمینه کارت‌ها
    inputBg: '#2D2D2D',          // پس‌زمینه inputها
    tableHeader: '#263238',      // هدر جدول‌ها
    tableRowEven: '#1A1A1A',     // ردیف زوج جدول
    tableRowOdd: '#212121',      // ردیف فرد جدول
    hoverBg: '#2A2A2A',          // پس‌زمینه hover
    disabled: '#555555',         // رنگ المان‌های غیرفعال
    notificationBg: '#1A237E',   // پس‌زمینه نوتیفیکیشن
};

// داده‌های اصلی سیستم
const kabulData = {
    locations: [
        // مناطق مرکزی
        { name: "میدان هوایی بین المللی کابل", coordinates: [34.5658, 69.2120] },
        { name: "کارته سخی", coordinates: [34.5160, 69.1725] },
        { name: "کارته چهار", coordinates: [34.5265, 69.1768] },
        { name: "شهر نو", coordinates: [34.5320, 69.1680] },
        { name: "دشت برچی", coordinates: [34.4700, 69.1400] },
        { name: "قلعه نور", coordinates: [34.5500, 69.1900] },
        { name: "پغمان", coordinates: [34.5800, 69.1200] },
        { name: "خیرخانه", coordinates: [34.5300, 69.2100] },
        { name: "قلعه فتح الله", coordinates: [34.5000, 69.1800] },
        { name: "مکروریان", coordinates: [34.4900, 69.2000] },
        
        // سفارتخانه‌ها
        { name: "سفارت امریکا", coordinates: [34.5350, 69.1833] },
        { name: "سفارت ایران", coordinates: [34.5250, 69.1850] },
        { name: "سفارت پاکستان", coordinates: [34.5200, 69.1870] },
        { name: "سفارت ترکیه", coordinates: [34.5300, 69.1900] },
        
        // وزارتخانه‌ها
        { name: "ارگ ریاست جمهوری", coordinates: [34.5250, 69.1800] },
        { name: "وزارت امور خارجه", coordinates: [34.5270, 69.1820] },
        { name: "وزارت داخله", coordinates: [34.5290, 69.1840] },
        { name: "وزارت دفاع", coordinates: [34.5310, 69.1860] },
        
        // مراکز خرید
        { name: "بازار کابل", coordinates: [34.5150, 69.1700] },
        { name: "بازار کارته سخی", coordinates: [34.5160, 69.1725] },
        { name: "بازار شورا", coordinates: [34.5200, 69.1650] },
        
        // دانشگاه‌ها
        { name: "پوهنتون کابل", coordinates: [34.5400, 69.1600] },
        { name: "پوهنتون پولی تخنیک کابل", coordinates: [34.5350, 69.1550] },
        { name: "پوهنتون ابن سینا", coordinates: [34.5450, 69.1500] },
        
        // شفاخانه‌ها
        { name: "شفاخانه علی آباد", coordinates: [34.5150, 69.1750] },
        { name: "شفاخانه جمهوریت", coordinates: [34.5200, 69.1800] },
        { name: "شفاخانه ایندیانا", coordinates: [34.5250, 69.1850] }
    ],
    
    districts: [
        "کارته سخی", "کارته چهار", "شهر نو", "دشت برچی", "قلعه نور",
        "قلعه فتح الله", "پغمان", "مکروریان", "خیرخانه", "قلعه ذوالفقار",
        "چندول", "ده سبز", "افشار", "قره باغ", "بگرامی", "نادر پشته",
        "کارته پروان", "کارته منصور", "کارته خوشحال", "کارته سید"
    ]
};

// متغیرهای سیستم
let currentUser = null;
let isAdmin = false;
let selectedRideType = 'economy';
let selectedPaymentMethod = 'cash';
let currentDistance = 0;
let currentPrice = 0;
let currentTripId = null;
let currentDriver = null;
let map = null;
let markers = [];
let currentRoute = null;
let carMarker = null;
let carAnimationInterval = null;
let pickupMarker = null;
let destinationMarker = null;
let selectedPickupCoords = null;
let selectedDestinationCoords = null;

// ذخیره‌سازی داده‌ها
const storage = {
    get: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error(`Error reading from localStorage key ${key}:`, e);
            return [];
        }
    },
    set: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error(`Error writing to localStorage key ${key}:`, e);
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error(`Error removing localStorage key ${key}:`, e);
        }
    },
    clear: () => {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    }
};

// کلاس User برای مدیریت کاربران
class User {
    constructor(data) {
        this.id = data.id || Date.now();
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.password = data.password;
        this.role = data.role || 'passenger';
        this.status = data.status || 'pending';
        this.created_at = data.created_at || new Date().toISOString();
        this.wallet_balance = data.wallet_balance || 0;
        this.rating = data.rating || 0;
        this.reward_points = data.reward_points || 0;
        
        // برای رانندگان
        if (data.role === 'driver') {
            this.vehicle_type = data.vehicle_type || 'car';
            this.car_model = data.car_model || '';
            this.car_color = data.car_color || '';
            this.plate_number = data.plate_number || '';
            this.driver_license = data.driver_license || '';
            this.driver_status = data.driver_status || 'inactive';
            this.rating = data.rating || 4.5;
            this.total_trips = data.total_trips || 0;
            this.current_location = data.current_location || [34.5250, 69.1800];
        }
    }

    save() {
        let users = storage.get('snapp_users');
        const index = users.findIndex(u => u.id === this.id);
        if (index !== -1) {
            users[index] = this;
        } else {
            users.push(this);
        }
        storage.set('snapp_users', users);
    }

    static findById(id) {
        const users = storage.get('snapp_users');
        const userData = users.find(u => u.id === id);
        return userData ? new User(userData) : null;
    }

    static findByCredentials(email, password) {
        const users = storage.get('snapp_users');
        const userData = users.find(u => 
            (u.email === email || u.phone === email) && 
            u.password === password
        );
        return userData ? new User(userData) : null;
    }

    static getAll() {
        return storage.get('snapp_users').map(data => new User(data));
    }

    static delete(id) {
        let users = storage.get('snapp_users');
        users = users.filter(u => u.id !== id);
        storage.set('snapp_users', users);
    }

    static getCount() {
        return storage.get('snapp_users').length;
    }
}

// کلاس Trip برای مدیریت سفرها
class Trip {
    constructor(data) {
        this.id = data.id || Date.now();
        this.pickup = data.pickup;
        this.destination = data.destination;
        this.pickup_coords = data.pickup_coords || [34.5250, 69.1800];
        this.destination_coords = data.destination_coords || [34.5300, 69.1900];
        this.ride_type = data.ride_type || 'economy';
        this.distance = data.distance || 0;
        this.price = data.price || 0;
        this.status = data.status || 'requested';
        this.user_id = data.user_id;
        this.user_name = data.user_name;
        this.driver_id = data.driver_id;
        this.driver_name = data.driver_name;
        this.payment_method = data.payment_method || 'cash';
        this.rated = data.rated || false;
        this.rating = data.rating || 0;
        this.rating_comment = data.rating_comment || '';
        this.created_at = data.created_at || new Date().toISOString();
        this.started_at = data.started_at;
        this.completed_at = data.completed_at;
        this.route = data.route;
        this.reward_points = data.reward_points || 0;
    }

    save() {
        let trips = storage.get('snapp_trips');
        const index = trips.findIndex(t => t.id === this.id);
        if (index !== -1) {
            trips[index] = this;
        } else {
            trips.push(this);
        }
        storage.set('snapp_trips', trips);
    }

    static findById(id) {
        const trips = storage.get('snapp_trips');
        const tripData = trips.find(t => t.id === id);
        return tripData ? new Trip(tripData) : null;
    }

    static findByUserId(userId) {
        const trips = storage.get('snapp_trips');
        return trips
            .filter(t => t.user_id === userId)
            .map(data => new Trip(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    static getAll() {
        return storage.get('snapp_trips').map(data => new Trip(data));
    }

    static delete(id) {
        let trips = storage.get('snapp_trips');
        trips = trips.filter(t => t.id !== id);
        storage.set('snapp_trips', trips);
    }

    static getCount() {
        return storage.get('snapp_trips').length;
    }
}

// کلاس Discount برای مدیریت تخفیف‌ها
class Discount {
    constructor(data) {
        this.id = data.id || Date.now();
        this.code = data.code;
        this.percent = data.percent;
        this.expiry_date = data.expiry_date;
        this.max_uses = data.max_uses || 100;
        this.used_count = data.used_count || 0;
        this.created_at = data.created_at || new Date().toISOString();
    }

    save() {
        let discounts = storage.get('snapp_discounts');
        const index = discounts.findIndex(d => d.id === this.id);
        if (index !== -1) {
            discounts[index] = this;
        } else {
            discounts.push(this);
        }
        storage.set('snapp_discounts', discounts);
    }

    static findValid() {
        const discounts = storage.get('snapp_discounts');
        const now = new Date();
        return discounts
            .filter(d => new Date(d.expiry_date) > now)
            .map(data => new Discount(data));
    }

    static getAll() {
        return storage.get('snapp_discounts').map(data => new Discount(data));
    }

    static delete(id) {
        let discounts = storage.get('snapp_discounts');
        discounts = discounts.filter(d => d.id !== id);
        storage.set('snapp_discounts', discounts);
    }
}

// کلاس SupportTicket برای مدیریت درخواست‌های پشتیبانی
class SupportTicket {
    constructor(data) {
        this.id = data.id || Date.now();
        this.user_id = data.user_id;
        this.user_name = data.user_name;
        this.subject = data.subject;
        this.message = data.message;
        this.status = data.status || 'pending';
        this.reply = data.reply || '';
        this.created_at = data.created_at || new Date().toISOString();
        this.replied_at = data.replied_at;
    }

    save() {
        let tickets = storage.get('snapp_support');
        if (!Array.isArray(tickets)) tickets = [];
        const index = tickets.findIndex(t => t.id === this.id);
        if (index !== -1) {
            tickets[index] = this;
        } else {
            tickets.push(this);
        }
        storage.set('snapp_support', tickets);
    }

    static getAll() {
        return storage.get('snapp_support').map(data => new SupportTicket(data));
    }

    static findByUserId(userId) {
        const tickets = storage.get('snapp_support');
        return tickets
            .filter(t => t.user_id === userId)
            .map(data => new SupportTicket(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
}

// کلاس Notification برای مدیریت اعلان‌ها
class Notification {
    constructor(data) {
        this.id = data.id || Date.now();
        this.user_id = data.user_id;
        this.title = data.title;
        this.message = data.message;
        this.read = data.read || false;
        this.type = data.type || 'info';
        this.created_at = data.created_at || new Date().toISOString();
    }

    save() {
        let notifications = storage.get('snapp_notifications');
        if (!Array.isArray(notifications)) {
            notifications = [];
        }
        const index = notifications.findIndex(n => n.id === this.id);
        if (index !== -1) {
            notifications[index] = this;
        } else {
            notifications.push(this);
        }
        storage.set('snapp_notifications', notifications);
    }

    static findByUserId(userId) {
        const notifications = storage.get('snapp_notifications');
        if (!Array.isArray(notifications)) {
            return [];
        }
        return notifications
            .filter(n => n.user_id === userId)
            .map(data => new Notification(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    static markAsRead(id) {
        const notifications = storage.get('snapp_notifications');
        if (!Array.isArray(notifications)) return;
        
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications[index].read = true;
            storage.set('snapp_notifications', notifications);
        }
    }

    static delete(id) {
        let notifications = storage.get('snapp_notifications');
        if (!Array.isArray(notifications)) return;
        
        notifications = notifications.filter(n => n.id !== id);
        storage.set('snapp_notifications', notifications);
    }
}

// کلاس Settings برای مدیریت تنظیمات سیستم
class Settings {
    constructor() {
        const defaultSettings = {
            app_name: 'اسنپ افغانستان',
            currency: 'افغانی',
            base_fare_economy: 50,
            base_fare_comfort: 80,
            base_fare_bike: 30,
            distance_rate: 10,
            driver_commission: 0.8,
            min_wallet_balance: 100,
            max_wallet_balance: 100000,
            support_phone: '0788888888',
            support_email: 'support@snapp.af',
            reward_points_rate: 10,
            max_daily_trips: 20,
            cancellation_fee: 20,
            tax_rate: 0.05,
            theme: 'dark'
        };
        
        const savedSettings = storage.get('snapp_settings');
        this.settings = savedSettings || defaultSettings;
    }

    save() {
        storage.set('snapp_settings', this.settings);
    }

    get(key) {
        return this.settings[key];
    }

    set(key, value) {
        this.settings[key] = value;
        this.save();
    }

    getAll() {
        return this.settings;
    }

    isDarkTheme() {
        return this.get('theme') === 'dark';
    }
}

// تابع‌های کمکی
function showNotification(message, type = 'success') {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${themeColors.cardBg};
            color: ${themeColors.text};
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
            min-width: 300px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
            border-right: 4px solid ${themeColors.primary};
            font-family: inherit;
        `;
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // تنظیم رنگ‌ها بر اساس نوع نوتیفیکیشن
    let borderColor = themeColors.primary;
    let bgColor = themeColors.cardBg;
    
    switch(type) {
        case 'success':
            borderColor = themeColors.success;
            bgColor = themeColors.notificationBg;
            break;
        case 'error':
            borderColor = themeColors.accent;
            bgColor = '#4A1C29';
            break;
        case 'warning':
            borderColor = themeColors.warning;
            bgColor = '#4A3C1C';
            break;
        case 'info':
            borderColor = themeColors.info;
            bgColor = '#0D3A5C';
            break;
    }
    
    notification.style.borderRightColor = borderColor;
    notification.style.background = bgColor;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.form-input').forEach(el => {
        el.style.borderColor = themeColors.border;
    });
}

function showError(inputId, message) {
    let errorElement = document.getElementById(inputId + 'Error');
    if (!errorElement) {
        const inputElement = document.getElementById(inputId);
        if (!inputElement) return;
        
        errorElement = document.createElement('div');
        errorElement.id = inputId + 'Error';
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            color: ${themeColors.accent};
            font-size: 12px;
            margin-top: 5px;
            display: none;
        `;
        inputElement.parentNode.appendChild(errorElement);
    }
    
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.style.borderColor = themeColors.accent;
    }
}

// مدیریت نقشه
function initMap() {
    try {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }
        
        // ایجاد نقشه با مرکز کابل
        map = L.map('map').setView([34.5250, 69.1800], 12);
        
        // اضافه کردن نقشه OpenStreetMap با تم تاریک
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors, © CARTO',
            maxZoom: 19
        }).addTo(map);
        
        // اضافه کردن کنترل‌ها
        L.control.scale().addTo(map);
        
        // اضافه کردن نشانگرهای نقاط مهم
        addLocationMarkers();
        
        // اضافه کردن مناطق
        createDistrictsList();
        
        // فعال‌سازی کلیک بر روی نقشه
        enableMapClickSelection();
        
    } catch (error) {
        console.error('Error initializing map:', error);
        showNotification('خطا در بارگذاری نقشه. لطفاً اینترنت خود را بررسی کنید.', 'error');
    }
}

function enableMapClickSelection() {
    if (!map) return;
    
    map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        openLocationSelectionModal(lat, lng);
    });
}

function openLocationSelectionModal(lat, lng) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'locationSelectionModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${themeColors.overlay};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 400px; background: ${themeColors.cardBg}; border-radius: 12px; max-width: 90%; max-height: 90%; overflow: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="margin: 0; color: ${themeColors.text};">انتخاب مکان</h3>
                <button class="close-modal" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <p style="margin-bottom: 20px; color: ${themeColors.text};">انتخاب کنید این مکان مبدا باشد یا مقصد:</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="selectAsPickup" class="btn-primary" style="flex: 1; background: ${themeColors.primary}; color: ${themeColors.white}; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-size: 14px;">مبدا</button>
                    <button id="selectAsDestination" class="btn-primary" style="flex: 1; background: ${themeColors.primary}; color: ${themeColors.white}; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-size: 14px;">مقصد</button>
                </div>
                <div style="margin-top: 20px;">
                    <input type="text" id="customLocationName" placeholder="نام دلخواه برای این مکان" class="form-input" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid ${themeColors.border}; background: ${themeColors.inputBg}; color: ${themeColors.text};">
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // بستن مدال
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // انتخاب به عنوان مبدا
    document.getElementById('selectAsPickup').addEventListener('click', () => {
        const customName = document.getElementById('customLocationName').value.trim();
        const locationName = customName || `مکان انتخاب شده (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        
        setPickupLocation(locationName, [lat, lng]);
        modal.remove();
        showNotification(`مبدا به "${locationName}" تنظیم شد`, 'success');
    });
    
    // انتخاب به عنوان مقصد
    document.getElementById('selectAsDestination').addEventListener('click', () => {
        const customName = document.getElementById('customLocationName').value.trim();
        const locationName = customName || `مکان انتخاب شده (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        
        setDestinationLocation(locationName, [lat, lng]);
        modal.remove();
        showNotification(`مقصد به "${locationName}" تنظیم شد`, 'success');
    });
    
    // بستن با کلیک خارج
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function setPickupLocation(name, coords) {
    const pickupInput = document.getElementById('pickup');
    if (pickupInput) {
        pickupInput.value = name;
    }
    selectedPickupCoords = coords;
    
    // اضافه کردن نشانگر روی نقشه
    if (pickupMarker) {
        pickupMarker.remove();
    }
    
    pickupMarker = L.marker(coords, {
        icon: L.divIcon({
            html: `<div style="background: ${themeColors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.5);"><i class="fas fa-circle"></i></div>`,
            className: 'pickup-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map).bindPopup(`<b>مبدا:</b> ${name}`);
    
    calculateDistanceAndPrice();
}

function setDestinationLocation(name, coords) {
    const destinationInput = document.getElementById('destination');
    if (destinationInput) {
        destinationInput.value = name;
    }
    selectedDestinationCoords = coords;
    
    // اضافه کردن نشانگر روی نقشه
    if (destinationMarker) {
        destinationMarker.remove();
    }
    
    destinationMarker = L.marker(coords, {
        icon: L.divIcon({
            html: `<div style="background: ${themeColors.accent}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.5);"><i class="fas fa-flag-checkered"></i></div>`,
            className: 'destination-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map).bindPopup(`<b>مقصد:</b> ${name}`);
    
    calculateDistanceAndPrice();
}

function addLocationMarkers() {
    if (!map) return;

    // حذف نشانگرهای قبلی
    markers.forEach(marker => marker.remove());
    markers = [];

    kabulData.locations.forEach(location => {
        const icon = L.divIcon({
            html: `<div style="background: ${themeColors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>`,
            className: 'location-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const marker = L.marker(location.coordinates, { icon })
            .addTo(map)
            .bindPopup(`<b style="color: ${themeColors.text}">${location.name}</b><br><button class="select-location-btn" data-name="${location.name}" style="background: ${themeColors.primary}; color: ${themeColors.white}; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 5px;">انتخاب این مکان</button>`)
            .on('click', () => {
                handleLocationClick(location.name, location.coordinates);
            });

        markers.push(marker);
    });
    
    // اضافه کردن event listener برای دکمه‌های انتخاب
    setTimeout(() => {
        document.querySelectorAll('.select-location-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const locationName = this.getAttribute('data-name');
                handleLocationSelection(locationName);
            });
        });
    }, 100);
}

function handleLocationSelection(locationName) {
    const location = kabulData.locations.find(loc => loc.name === locationName);
    if (!location) return;
    
    openLocationSelectionModal(location.coordinates[0], location.coordinates[1]);
}

function handleLocationClick(locationName, coordinates) {
    const selectionModal = document.createElement('div');
    selectionModal.className = 'modal';
    selectionModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${themeColors.overlay};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    selectionModal.innerHTML = `
        <div class="modal-content" style="width: 350px; background: ${themeColors.cardBg}; border-radius: 12px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="margin: 0; color: ${themeColors.text};">${locationName}</h3>
                <button class="close-modal" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <p style="color: ${themeColors.text};">این مکان را به عنوان چه چیزی انتخاب می‌کنید؟</p>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button id="setAsPickup" class="btn-primary" style="flex: 1; background: ${themeColors.primary}; color: ${themeColors.white}; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">مبدا</button>
                    <button id="setAsDestination" class="btn-primary" style="flex: 1; background: ${themeColors.primary}; color: ${themeColors.white}; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">مقصد</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(selectionModal);
    
    // بستن مدال
    selectionModal.querySelector('.close-modal').addEventListener('click', () => {
        selectionModal.remove();
    });
    
    // انتخاب به عنوان مبدا
    document.getElementById('setAsPickup').addEventListener('click', () => {
        setPickupLocation(locationName, coordinates);
        selectionModal.remove();
        showNotification(`مبدا به "${locationName}" تنظیم شد`, 'success');
    });
    
    // انتخاب به عنوان مقصد
    document.getElementById('setAsDestination').addEventListener('click', () => {
        setDestinationLocation(locationName, coordinates);
        selectionModal.remove();
        showNotification(`مقصد به "${locationName}" تنظیم شد`, 'success');
    });
    
    // بستن با کلیک خارج
    selectionModal.addEventListener('click', (e) => {
        if (e.target === selectionModal) {
            selectionModal.remove();
        }
    });
}

function createDistrictsList() {
    const districtsGrid = document.getElementById('districtsGrid');
    if (!districtsGrid) return;
    
    districtsGrid.innerHTML = '';
    
    kabulData.districts.forEach(district => {
        const districtItem = document.createElement('div');
        districtItem.className = 'district-item';
        districtItem.style.cssText = `
            padding: 12px 15px;
            background: ${themeColors.cardBg};
            border: 1px solid ${themeColors.border};
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
            color: ${themeColors.text};
        `;
        districtItem.innerHTML = `
            <i class="fas fa-map-marker-alt" style="color: ${themeColors.primary};"></i>
            <span>${district}</span>
        `;
        
        districtItem.addEventListener('mouseenter', () => {
            districtItem.style.background = themeColors.hoverBg;
            districtItem.style.borderColor = themeColors.primary;
            districtItem.style.transform = 'translateY(-2px)';
        });
        
        districtItem.addEventListener('mouseleave', () => {
            districtItem.style.background = themeColors.cardBg;
            districtItem.style.borderColor = themeColors.border;
            districtItem.style.transform = 'translateY(0)';
        });
        
        districtItem.addEventListener('click', () => {
            handleDistrictClick(district);
        });
        
        districtsGrid.appendChild(districtItem);
    });
}

function handleDistrictClick(districtName) {
    const selectionModal = document.createElement('div');
    selectionModal.className = 'modal';
    selectionModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${themeColors.overlay};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    selectionModal.innerHTML = `
        <div class="modal-content" style="width: 350px; background: ${themeColors.cardBg}; border-radius: 12px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="margin: 0; color: ${themeColors.text};">${districtName}</h3>
                <button class="close-modal" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <p style="color: ${themeColors.text};">این منطقه را به عنوان چه چیزی انتخاب می‌کنید؟</p>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button id="setDistrictAsPickup" class="btn-primary" style="flex: 1; background: ${themeColors.primary}; color: ${themeColors.white}; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">مبدا</button>
                    <button id="setDistrictAsDestination" class="btn-primary" style="flex: 1; background: ${themeColors.primary}; color: ${themeColors.white}; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">مقصد</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(selectionModal);
    
    // بستن مدال
    selectionModal.querySelector('.close-modal').addEventListener('click', () => {
        selectionModal.remove();
    });
    
    // انتخاب به عنوان مبدا
    document.getElementById('setDistrictAsPickup').addEventListener('click', () => {
        const pickupInput = document.getElementById('pickup');
        if (pickupInput) {
            pickupInput.value = districtName;
            showNotification(`مبدا به "${districtName}" تنظیم شد`, 'success');
        }
        selectionModal.remove();
        calculateDistanceAndPrice();
    });
    
    // انتخاب به عنوان مقصد
    document.getElementById('setDistrictAsDestination').addEventListener('click', () => {
        const destinationInput = document.getElementById('destination');
        if (destinationInput) {
            destinationInput.value = districtName;
            showNotification(`مقصد به "${districtName}" تنظیم شد`, 'success');
        }
        selectionModal.remove();
        calculateDistanceAndPrice();
    });
    
    // بستن با کلیک خارج
    selectionModal.addEventListener('click', (e) => {
        if (e.target === selectionModal) {
            selectionModal.remove();
        }
    });
}

// محاسبه مسافت و قیمت
function calculateDistanceAndPrice() {
    const pickupInput = document.getElementById('pickup');
    const destinationInput = document.getElementById('destination');
    const tripCalculator = document.getElementById('tripCalculator');
    
    if (!pickupInput || !destinationInput || !tripCalculator) return;
    
    const pickup = pickupInput.value.trim();
    const destination = destinationInput.value.trim();

    if (!pickup || !destination) {
        tripCalculator.style.display = 'none';
        return;
    }

    let pickupCoords = selectedPickupCoords;
    let destinationCoords = selectedDestinationCoords;

    // اگر مختصات مستقیم انتخاب نشده، از مکان‌های شناخته شده استفاده کن
    if (!pickupCoords) {
        const pickupLocation = kabulData.locations.find(loc => loc.name === pickup);
        pickupCoords = pickupLocation?.coordinates;
    }
    
    if (!destinationCoords) {
        const destinationLocation = kabulData.locations.find(loc => loc.name === destination);
        destinationCoords = destinationLocation?.coordinates;
    }

    if (!pickupCoords || !destinationCoords) {
        // اگر محل دقیق پیدا نشد، از فاصله تصادفی استفاده کن
        const randomDistance = (Math.random() * 15 + 2).toFixed(1);
        currentDistance = parseFloat(randomDistance);
    } else {
        // محاسبه فاصله با استفاده از فرمول هاوورساین
        currentDistance = calculateDistance(pickupCoords, destinationCoords);
    }

    // نمایش معلومات مسافت
    const distanceValue = document.getElementById('distanceValue');
    if (distanceValue) distanceValue.textContent = `${currentDistance} کیلومتر`;
    
    tripCalculator.style.display = 'block';
    updatePrice();
}

function calculateDistance(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    
    const R = 6371; // شعاع زمین در کیلومتر
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1));
}

function updatePrice() {
    if (currentDistance === 0) return;

    const selectedRide = document.querySelector('.ride-type.selected');
    if (!selectedRide) return;
    
    const baseFare = parseInt(selectedRide.dataset.baseFare);
    const distanceFare = Math.round(currentDistance * 10); // 10 افغانی برای هر کیلومتر
    const totalFare = baseFare + distanceFare;

    currentPrice = totalFare;

    // نمایش جزئیات قیمت
    const baseFareValue = document.getElementById('baseFareValue');
    const distanceFareValue = document.getElementById('distanceFareValue');
    const totalFareValue = document.getElementById('totalFareValue');
    
    if (baseFareValue) baseFareValue.textContent = `${baseFare} افغانی`;
    if (distanceFareValue) distanceFareValue.textContent = `${distanceFare} افغانی`;
    if (totalFareValue) totalFareValue.textContent = `${totalFare} افغانی`;

    // به‌روزرسانی قیمت در کارت‌ها
    const economyPrice = document.getElementById('economyPrice');
    const comfortPrice = document.getElementById('comfortPrice');
    const bikePrice = document.getElementById('bikePrice');
    
    if (economyPrice) economyPrice.textContent = `${calculateRidePrice('economy')} افغانی`;
    if (comfortPrice) comfortPrice.textContent = `${calculateRidePrice('comfort')} افغانی`;
    if (bikePrice) bikePrice.textContent = `${calculateRidePrice('bike')} افغانی`;
}

function calculateRidePrice(type) {
    const baseFares = {
        economy: 50,
        comfort: 80,
        bike: 30
    };
    return baseFares[type] + Math.round(currentDistance * 10);
}

// مدیریت رانندگان
function findNearestDriver(pickupLocation, rideType) {
    const drivers = User.getAll()
        .filter(user => 
            user.role === 'driver' && 
            user.status === 'approved' && 
            user.driver_status === 'active' &&
            (rideType === 'bike' ? user.vehicle_type === 'bike' : user.vehicle_type === 'car')
        );

    if (drivers.length === 0) {
        return null;
    }

    // انتخاب راننده نزدیک‌تر (بر اساس موقعیت شبیه‌سازی شده)
    let nearestDriver = null;
    let minDistance = Infinity;
    
    drivers.forEach(driver => {
        // شبیه‌سازی فاصله راننده از مبدا
        const distance = Math.random() * 10; // 0-10 کیلومتر
        if (distance < minDistance) {
            minDistance = distance;
            nearestDriver = driver;
        }
    });

    // محاسبه ETA
    const eta = Math.floor(minDistance * 2 + 3); // 3-23 دقیقه

    return {
        ...nearestDriver,
        eta: `${eta} دقیقه`,
        distance: `${minDistance.toFixed(1)} کیلومتر`,
        position: nearestDriver.current_location
    };
}

// رسم مسیر روی نقشه
function drawRoute(startCoords, endCoords) {
    clearRoute();
    
    if (!map || !startCoords || !endCoords) return;

    // استفاده از OSRM برای مسیریابی واقعی
    const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.routes && data.routes[0]) {
                const route = data.routes[0];
                const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                
                currentRoute = L.polyline(routeCoordinates, {
                    color: themeColors.primary,
                    weight: 4,
                    opacity: 0.8,
                    dashArray: '10, 10'
                }).addTo(map);
                
                // به‌روزرسانی مسافت واقعی
                currentDistance = parseFloat((route.distance / 1000).toFixed(1));
                updatePrice();
                
                // نشانگر مبدا
                const startIcon = L.divIcon({
                    html: `<div style="background: ${themeColors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                            <i class="fas fa-circle"></i>
                          </div>`,
                    className: 'start-marker',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                // نشانگر مقصد
                const endIcon = L.divIcon({
                    html: `<div style="background: ${themeColors.accent}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                            <i class="fas fa-flag-checkered"></i>
                          </div>`,
                    className: 'end-marker',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                L.marker(startCoords, { icon: startIcon }).addTo(map)
                    .bindPopup('<b style="color: #333;">مبدا</b>');

                L.marker(endCoords, { icon: endIcon }).addTo(map)
                    .bindPopup('<b style="color: #333;">مقصد</b>');

                // تنظیم زوم بر روی کل مسیر
                map.fitBounds(currentRoute.getBounds(), { padding: [50, 50] });
            } else {
                // اگر مسیریابی OSRM کار نکرد، از مسیر مستقیم استفاده کن
                drawDirectRoute(startCoords, endCoords);
            }
        })
        .catch(error => {
            console.error('Error drawing route:', error);
            // در صورت خطا، مسیر مستقیم رسم کن
            drawDirectRoute(startCoords, endCoords);
        });
}

function drawDirectRoute(startCoords, endCoords) {
    // مسیر مستقیم
    const route = L.polyline([startCoords, endCoords], {
        color: themeColors.primary,
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10'
    }).addTo(map);

    // نشانگر مبدا
    const startIcon = L.divIcon({
        html: `<div style="background: ${themeColors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                <i class="fas fa-circle"></i>
              </div>`,
        className: 'start-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // نشانگر مقصد
    const endIcon = L.divIcon({
        html: `<div style="background: ${themeColors.accent}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                <i class="fas fa-flag-checkered"></i>
              </div>`,
        className: 'end-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    L.marker(startCoords, { icon: startIcon }).addTo(map)
        .bindPopup('<b style="color: #333;">مبدا</b>');

    L.marker(endCoords, { icon: endIcon }).addTo(map)
        .bindPopup('<b style="color: #333;">مقصد</b>');

    currentRoute = route;
    map.fitBounds([startCoords, endCoords], { padding: [50, 50] });
}

function clearRoute() {
    if (!map) return;
    
    if (currentRoute) {
        map.removeLayer(currentRoute);
        currentRoute = null;
    }
    
    // حذف نشانگرهای مسیر
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker && 
            (layer.options.icon?.options?.className === 'start-marker' || 
             layer.options.icon?.options?.className === 'end-marker')) {
            map.removeLayer(layer);
        }
    });
    
    // حذف نشانگرهای انتخاب مبدا/مقصد
    if (pickupMarker) {
        map.removeLayer(pickupMarker);
        pickupMarker = null;
    }
    
    if (destinationMarker) {
        map.removeLayer(destinationMarker);
        destinationMarker = null;
    }
}

// شبیه‌سازی حرکت خودرو
function simulateCarMovement(startCoords, endCoords, isBike = false) {
    if (!map || !startCoords || !endCoords) return;
    
    if (carMarker) {
        map.removeLayer(carMarker);
    }
    
    // ایجاد آیکون خودرو
    const carIcon = L.divIcon({
        html: `<div class="driver-marker" style="font-size: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                ${isBike ? '🏍️' : '🚗'}
              </div>`,
        className: 'car-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    carMarker = L.marker(startCoords, { icon: carIcon }).addTo(map);

    // شبیه‌سازی حرکت
    const steps = 50;
    const latStep = (endCoords[0] - startCoords[0]) / steps;
    const lngStep = (endCoords[1] - startCoords[1]) / steps;
    
    let currentStep = 0;
    
    if (carAnimationInterval) {
        clearInterval(carAnimationInterval);
    }
    
    carAnimationInterval = setInterval(() => {
        if (currentStep >= steps) {
            clearInterval(carAnimationInterval);
            showNotification('شما به مقصد رسیدید!', 'success');
            const liveTracking = document.getElementById('liveTracking');
            if (liveTracking) liveTracking.style.display = 'none';
            openPaymentModal();
            return;
        }
        
        const newLat = startCoords[0] + (latStep * currentStep);
        const newLng = startCoords[1] + (lngStep * currentStep);
        
        carMarker.setLatLng([newLat, newLng]);
        currentStep++;
        updateTrackingInfo(currentStep, steps);
    }, 200);
}

function updateTrackingInfo(currentStep, totalSteps) {
    const progress = (currentStep / totalSteps) * 100;
    const remainingTime = Math.round((totalSteps - currentStep) * 0.2);
    const remainingDistance = (currentDistance * (1 - progress/100)).toFixed(1);
    
    const trackingETA = document.getElementById('trackingETA');
    const trackingDistance = document.getElementById('trackingDistance');
    const trackingProgress = document.getElementById('trackingProgress');
    
    if (trackingETA) trackingETA.textContent = `${remainingTime} دقیقه`;
    if (trackingDistance) trackingDistance.textContent = `${remainingDistance} کیلومتر`;
    if (trackingProgress) trackingProgress.style.width = `${progress}%`;
}

// مدیریت کاربران
function checkUserLoginStatus() {
    const savedUser = localStorage.getItem('snapp_current_user');
    if (savedUser) {
        try {
            const userData = JSON.parse(savedUser);
            if (userData && userData.id && userData.name) {
                currentUser = new User(userData);
                isAdmin = currentUser.role === 'admin';
                updateUIAfterLogin();
            }
        } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('snapp_current_user');
        }
    }
    initializeSampleData();
}

function updateUIAfterLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (userProfile) userProfile.style.display = 'flex';
    
    if (userAvatar && currentUser) {
        userAvatar.textContent = currentUser.name.charAt(0);
        userAvatar.style.backgroundColor = themeColors.primary;
    }
    if (userName && currentUser) {
        userName.textContent = currentUser.name;
    }
    
    if (isAdmin) {
        const adminLink = document.getElementById('adminLink');
        if (adminLink) adminLink.style.display = 'block';
        
        const mobileAdminLink = document.getElementById('mobileAdminLink');
        if (mobileAdminLink) mobileAdminLink.style.display = 'block';
    }
    
    updateProfilePage();
    
    // به‌روزرسانی دکمه‌های منوی موبایل
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
    if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
}

function updateUIAfterLogout() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfile = document.getElementById('userProfile');
    
    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (userProfile) userProfile.style.display = 'none';
    
    const adminLink = document.getElementById('adminLink');
    if (adminLink) adminLink.style.display = 'none';
    
    const mobileAdminLink = document.getElementById('mobileAdminLink');
    if (mobileAdminLink) mobileAdminLink.style.display = 'none';
    
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    if (mobileLoginBtn) mobileLoginBtn.style.display = 'block';
    if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const homePage = document.getElementById('home-page');
    if (homePage) homePage.classList.add('active');
}

function logout() {
    currentUser = null;
    isAdmin = false;
    localStorage.removeItem('snapp_current_user');
    showNotification('با موفقیت خارج شدید', 'success');
    updateUIAfterLogout();
}

// بارگذاری داده‌های نمونه
function initializeSampleData() {
    let users = storage.get('snapp_users');
    
    if (users.length === 0) {
        const sampleUsers = [
            {
                id: 1,
                name: 'مدیر سیستم',
                email: 'admin@snapp.af',
                phone: '0700123456',
                password: 'admin123',
                role: 'admin',
                status: 'approved',
                created_at: new Date().toISOString(),
                wallet_balance: 100000,
                reward_points: 1000
            },
            {
                id: 2,
                name: 'احمد محمدی',
                email: 'ahmad@example.com',
                phone: '0700111222',
                password: '123456',
                role: 'passenger',
                status: 'approved',
                wallet_balance: 5000,
                reward_points: 150,
                created_at: new Date().toISOString()
            },
            {
                id: 3,
                name: 'رحمان علی',
                email: 'rahman@example.com',
                phone: '0700555666',
                password: '123456',
                role: 'driver',
                status: 'approved',
                vehicle_type: 'car',
                car_model: 'تویوتا کورولا',
                car_color: 'سفید',
                plate_number: 'کابل ۱۲۳۴',
                driver_license: 'DL123456',
                driver_status: 'active',
                rating: 4.7,
                total_trips: 125,
                current_location: [34.5250, 69.1800],
                created_at: new Date().toISOString()
            },
            {
                id: 4,
                name: 'کریم احمدی',
                email: 'karim@example.com',
                phone: '0700777888',
                password: '123456',
                role: 'driver',
                status: 'approved',
                vehicle_type: 'bike',
                car_model: 'هوندا 125',
                car_color: 'قرمز',
                plate_number: 'کابل ۵۶۷۸',
                driver_license: 'DL654321',
                driver_status: 'active',
                rating: 4.5,
                total_trips: 80,
                current_location: [34.5300, 69.1900],
                created_at: new Date().toISOString()
            }
        ];
        
        sampleUsers.forEach(user => {
            const userObj = new User(user);
            userObj.save();
        });
    }
    
    let trips = storage.get('snapp_trips');
    
    if (trips.length === 0) {
        const sampleTrips = [
            {
                id: 1,
                pickup: 'کارته سخی',
                destination: 'میدان هوایی بین المللی کابل',
                pickup_coords: [34.5160, 69.1725],
                destination_coords: [34.5658, 69.2120],
                ride_type: 'economy',
                distance: 12.5,
                price: 175,
                status: 'completed',
                user_id: 2,
                user_name: 'احمد محمدی',
                driver_id: 3,
                driver_name: 'رحمان علی',
                payment_method: 'cash',
                rated: true,
                rating: 5,
                rating_comment: 'راننده بسیار مودب بود',
                reward_points: 17,
                created_at: new Date(Date.now() - 86400000).toISOString(),
                started_at: new Date(Date.now() - 86400000 + 300000).toISOString(),
                completed_at: new Date(Date.now() - 86400000 + 1200000).toISOString()
            },
            {
                id: 2,
                pickup: 'شهر نو',
                destination: 'سفارت امریکا',
                pickup_coords: [34.5320, 69.1680],
                destination_coords: [34.5350, 69.1833],
                ride_type: 'comfort',
                distance: 3.2,
                price: 112,
                status: 'completed',
                user_id: 2,
                user_name: 'احمد محمدی',
                driver_id: 3,
                driver_name: 'رحمان علی',
                payment_method: 'wallet',
                rated: true,
                rating: 4,
                rating_comment: 'سفر خوبی بود',
                reward_points: 11,
                created_at: new Date(Date.now() - 172800000).toISOString(),
                started_at: new Date(Date.now() - 172800000 + 240000).toISOString(),
                completed_at: new Date(Date.now() - 172800000 + 600000).toISOString()
            },
            {
                id: 3,
                pickup: 'قلعه فتح الله',
                destination: 'کارته چهار',
                pickup_coords: [34.5000, 69.1800],
                destination_coords: [34.5265, 69.1768],
                ride_type: 'bike',
                distance: 4.5,
                price: 75,
                status: 'completed',
                user_id: 2,
                user_name: 'احمد محمدی',
                driver_id: 4,
                driver_name: 'کریم احمدی',
                payment_method: 'cash',
                rated: false,
                rating: 0,
                reward_points: 7,
                created_at: new Date(Date.now() - 259200000).toISOString(),
                started_at: new Date(Date.now() - 259200000 + 180000).toISOString(),
                completed_at: new Date(Date.now() - 259200000 + 900000).toISOString()
            }
        ];
        
        sampleTrips.forEach(trip => {
            const tripObj = new Trip(trip);
            tripObj.save();
        });
    }
    
    let discounts = storage.get('snapp_discounts');
    
    if (discounts.length === 0) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        
        const sampleDiscounts = [
            {
                id: 1,
                code: 'SNAPP20',
                percent: 20,
                expiry_date: futureDate.toISOString(),
                max_uses: 100,
                used_count: 15
            },
            {
                id: 2,
                code: 'WELCOME10',
                percent: 10,
                expiry_date: futureDate.toISOString(),
                max_uses: 50,
                used_count: 5
            },
            {
                id: 3,
                code: 'FIRSTRIDE',
                percent: 100,
                expiry_date: futureDate.toISOString(),
                max_uses: 1,
                used_count: 0
            }
        ];
        
        sampleDiscounts.forEach(discount => {
            const discountObj = new Discount(discount);
            discountObj.save();
        });
    }
    
    let supportTickets = storage.get('snapp_support');
    
    if (supportTickets.length === 0) {
        const sampleTickets = [
            {
                id: 1,
                user_id: 2,
                user_name: 'احمد محمدی',
                subject: 'مشکل در پرداخت',
                message: 'سلام، در پرداخت با کیف پول مشکل دارم.',
                status: 'answered',
                reply: 'سلام، مشکل شما بررسی شد و برطرف گردید. لطفاً دوباره تلاش کنید.',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                replied_at: new Date(Date.now() - 86000000).toISOString()
            }
        ];
        
        sampleTickets.forEach(ticket => {
            const ticketObj = new SupportTicket(ticket);
            ticketObj.save();
        });
    }
    
    // تنظیمات اولیه
    const settings = new Settings();
    if (!settings.get('app_name')) {
        settings.settings = {
            app_name: 'اسنپ افغانستان',
            currency: 'افغانی',
            base_fare_economy: 50,
            base_fare_comfort: 80,
            base_fare_bike: 30,
            distance_rate: 10,
            driver_commission: 0.8,
            min_wallet_balance: 100,
            max_wallet_balance: 100000,
            support_phone: '0788888888',
            support_email: 'support@snapp.af',
            reward_points_rate: 10,
            max_daily_trips: 20,
            cancellation_fee: 20,
            tax_rate: 0.05,
            theme: 'dark'
        };
        settings.save();
    }
}

// بارگذاری صفحات
function loadMyTrips() {
    const myTripsTable = document.getElementById('myTripsTable');
    if (!myTripsTable) return;
    
    myTripsTable.innerHTML = '';
    const trips = Trip.findByUserId(currentUser.id);
    
    if (trips.length === 0) {
        myTripsTable.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: ${themeColors.text};">
                    <i class="fas fa-road" style="font-size: 48px; color: ${themeColors.gray}; margin-bottom: 15px; display: block;"></i>
                    <p style="color: ${themeColors.gray};">هیچ سفری یافت نشد</p>
                </td>
            </tr>
        `;
        return;
    }
    
    trips.forEach(trip => {
        const row = document.createElement('tr');
        const date = new Date(trip.created_at).toLocaleDateString('fa-IR');
        const time = new Date(trip.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        const statusClass = `status-${trip.status}`;
        const statusText = {
            'requested': 'درخواست شده',
            'confirmed': 'تأیید شده',
            'in_progress': 'در حال انجام',
            'completed': 'تکمیل شده',
            'cancelled': 'لغو شده'
        }[trip.status] || trip.status;
        
        const rideTypeText = {
            'economy': 'اقتصادی',
            'comfort': 'کلاسیک',
            'bike': 'موتور'
        }[trip.ride_type] || trip.ride_type;
        
        row.style.backgroundColor = trip.status === 'completed' ? themeColors.tableRowEven : themeColors.tableRowOdd;
        row.innerHTML = `
            <td style="color: ${themeColors.text};">${date}<br><small style="color: ${themeColors.gray};">${time}</small></td>
            <td style="color: ${themeColors.text};">${trip.pickup}</td>
            <td style="color: ${themeColors.text};">${trip.destination}</td>
            <td style="color: ${themeColors.text};">${rideTypeText}</td>
            <td style="color: ${themeColors.text};">${trip.distance} کیلومتر</td>
            <td style="color: ${themeColors.text};">${trip.price} افغانی</td>
            <td style="color: ${themeColors.text};">${trip.driver_name || '---'}</td>
            <td><span class="status-badge" style="background: ${getStatusColor(trip.status)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${statusText}</span></td>
            <td class="action-buttons">
                ${trip.status === 'requested' || trip.status === 'confirmed' ? 
                  `<button class="action-btn btn-reject cancel-trip-btn" data-id="${trip.id}" style="background: ${themeColors.accent}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">لغو سفر</button>` : ''}
                ${trip.status === 'completed' && !trip.rated ? 
                  `<button class="action-btn btn-approve rate-trip-btn" data-id="${trip.id}" style="background: ${themeColors.success}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">امتیازدهی</button>` : ''}
                ${trip.status === 'completed' ? 
                  `<button class="action-btn btn-info view-trip-btn" data-id="${trip.id}" style="background: ${themeColors.info}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">جزئیات</button>` : ''}
            </td>
        `;
        
        myTripsTable.appendChild(row);
    });
    
    // اضافه کردن event listeners برای دکمه‌ها
    setTimeout(() => {
        document.querySelectorAll('.cancel-trip-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tripId = parseInt(this.getAttribute('data-id'));
                cancelTrip(tripId);
            });
        });
        
        document.querySelectorAll('.rate-trip-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tripId = parseInt(this.getAttribute('data-id'));
                openRatingModal(tripId);
            });
        });
        
        document.querySelectorAll('.view-trip-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tripId = parseInt(this.getAttribute('data-id'));
                viewTripDetails(tripId);
            });
        });
    }, 100);
}

function getStatusColor(status) {
    const colors = {
        'requested': '#ff9800',
        'confirmed': '#2196f3',
        'in_progress': '#4caf50',
        'completed': '#388e3c',
        'cancelled': '#f44336',
        'pending': '#ff9800',
        'approved': '#4caf50',
        'rejected': '#f44336',
        'active': '#4caf50',
        'inactive': '#9e9e9e'
    };
    return colors[status] || themeColors.primary;
}

function cancelTrip(tripId) {
    if (confirm('آیا از لغو این سفر مطمئن هستید؟')) {
        const trip = Trip.findById(tripId);
        if (trip) {
            trip.status = 'cancelled';
            trip.save();
            showNotification('سفر با موفقیت لغو شد', 'success');
            loadMyTrips();
        }
    }
}

function viewTripDetails(tripId) {
    const trip = Trip.findById(tripId);
    if (!trip) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'tripDetailsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${themeColors.overlay};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const date = new Date(trip.created_at).toLocaleDateString('fa-IR');
    const time = new Date(trip.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const rideTypeText = {
        'economy': 'اقتصادی',
        'comfort': 'کلاسیک',
        'bike': 'موتور'
    }[trip.ride_type] || trip.ride_type;
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px; max-width: 90%; background: ${themeColors.cardBg}; border-radius: 12px; max-height: 90%; overflow: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="margin: 0; color: ${themeColors.text};">جزئیات سفر #${trip.id}</h3>
                <button class="close-modal" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">تاریخ:</label>
                        <span style="color: ${themeColors.text};">${date} - ${time}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">نوع سفر:</label>
                        <span style="color: ${themeColors.text};">${rideTypeText}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">مبدا:</label>
                        <span style="color: ${themeColors.text};">${trip.pickup}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">مقصد:</label>
                        <span style="color: ${themeColors.text};">${trip.destination}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">مسافت:</label>
                        <span style="color: ${themeColors.text};">${trip.distance} کیلومتر</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">هزینه:</label>
                        <span style="color: ${themeColors.text};">${trip.price} افغانی</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">راننده:</label>
                        <span style="color: ${themeColors.text};">${trip.driver_name || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">روش پرداخت:</label>
                        <span style="color: ${themeColors.text};">${trip.payment_method === 'cash' ? 'نقدی' : 'کیف پول'}</span>
                    </div>
                    ${trip.reward_points > 0 ? `
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">امتیاز پاداش:</label>
                        <span style="color: ${themeColors.text};"><i class="fas fa-star" style="color: ${themeColors.warning};"></i> ${trip.reward_points}</span>
                    </div>
                    ` : ''}
                </div>
                ${trip.rating ? `
                <div style="background: ${themeColors.primaryLight}; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <h4 style="margin-bottom: 10px; color: ${themeColors.text};">امتیاز شما</h4>
                    <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                        ${Array.from({length: 5}, (_, i) => `
                            <i class="fas fa-star ${i < trip.rating ? 'active' : ''}" style="color: ${i < trip.rating ? themeColors.warning : themeColors.gray};"></i>
                        `).join('')}
                    </div>
                    ${trip.rating_comment ? `<p style="margin: 0; color: ${themeColors.text};">${trip.rating_comment}</p>` : ''}
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // بستن مدال
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // بستن با کلیک خارج
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function loadDiscounts() {
    const discountsList = document.getElementById('discountsList');
    if (!discountsList) return;
    
    discountsList.innerHTML = '';
    const discounts = Discount.findValid();
    
    if (discounts.length === 0) {
        discountsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: ${themeColors.text};">
                <i class="fas fa-tag" style="font-size: 48px; color: ${themeColors.gray}; margin-bottom: 15px; display: block;"></i>
                <p style="color: ${themeColors.gray};">هیچ تخفیف فعالی موجود نیست</p>
            </div>
        `;
        return;
    }
    
    discounts.forEach(discount => {
        const discountElement = document.createElement('div');
        discountElement.className = 'discount-card';
        discountElement.style.cssText = `
            background: ${themeColors.cardBg};
            border: 1px solid ${themeColors.border};
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
        `;
        
        const expiryDate = new Date(discount.expiry_date).toLocaleDateString('fa-IR');
        const progress = (discount.used_count / discount.max_uses) * 100;
        
        discountElement.innerHTML = `
            <div class="discount-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div class="discount-code" style="font-size: 18px; font-weight: bold; color: ${themeColors.primary};">${discount.code}</div>
                <div class="discount-percent" style="font-size: 16px; color: ${themeColors.success};">${discount.percent}% تخفیف</div>
            </div>
            <div class="discount-details" style="margin-bottom: 15px;">
                <div style="color: ${themeColors.text}; margin-bottom: 5px;"><i class="fas fa-calendar-alt" style="color: ${themeColors.primary}; margin-left: 5px;"></i> منقضی: ${expiryDate}</div>
                <div style="color: ${themeColors.text};"><i class="fas fa-users" style="color: ${themeColors.primary}; margin-left: 5px;"></i> استفاده شده: ${discount.used_count} از ${discount.max_uses}</div>
            </div>
            <div class="discount-progress" style="margin-bottom: 15px;">
                <div class="progress-text" style="display: flex; justify-content: space-between; font-size: 12px; color: ${themeColors.gray}; margin-bottom: 5px;">
                    <span>۰</span>
                    <span>${discount.max_uses}</span>
                </div>
                <div class="progress-bar" style="height: 6px; background: ${themeColors.border}; border-radius: 3px; overflow: hidden;">
                    <div class="progress-fill" style="height: 100%; background: ${themeColors.primary}; width: ${progress}%"></div>
                </div>
            </div>
            <div class="discount-actions">
                <button class="btn-copy-code" data-code="${discount.code}" style="background: ${themeColors.primaryLight}; color: ${themeColors.primary}; border: 1px solid ${themeColors.primary}; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 14px; width: 100%;">
                    <i class="fas fa-copy"></i> کپی کد
                </button>
            </div>
        `;
        
        discountsList.appendChild(discountElement);
    });
    
    // اضافه کردن event listeners برای کپی کد
    setTimeout(() => {
        document.querySelectorAll('.btn-copy-code').forEach(btn => {
            btn.addEventListener('click', function() {
                const code = this.getAttribute('data-code');
                navigator.clipboard.writeText(code).then(() => {
                    showNotification(`کد ${code} با موفقیت کپی شد`, 'success');
                }).catch(err => {
                    console.error('Error copying code:', err);
                    showNotification('خطا در کپی کردن کد', 'error');
                });
            });
        });
    }, 100);
}

function updateProfilePage() {
    if (!currentUser) return;
    
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const profileRole = document.getElementById('profileRole');
    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');
    const walletBalance = document.getElementById('walletBalance');
    const rewardPoints = document.getElementById('rewardPoints');
    
    if (profileAvatar) {
        profileAvatar.textContent = currentUser.name.charAt(0);
        profileAvatar.style.backgroundColor = themeColors.primary;
        profileAvatar.style.color = themeColors.white;
    }
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profilePhone) profilePhone.textContent = currentUser.phone;
    if (profileRole) profileRole.textContent = currentUser.role === 'passenger' ? 'مسافر' : 'راننده';
    
    if (editName) editName.value = currentUser.name;
    if (editEmail) editEmail.value = currentUser.email;
    if (editPhone) editPhone.value = currentUser.phone;
    if (walletBalance) walletBalance.textContent = `${currentUser.wallet_balance.toLocaleString()} افغانی`;
    if (rewardPoints) rewardPoints.textContent = `${currentUser.reward_points || 0} امتیاز`;
    
    // محاسبه آمار
    const trips = Trip.findByUserId(currentUser.id);
    const totalTrips = trips.length;
    const totalSpent = trips.reduce((sum, trip) => sum + (trip.price || 0), 0);
    const userRating = currentUser.rating || 4.7;
    const totalPoints = trips.reduce((sum, trip) => sum + (trip.reward_points || 0), 0);
    
    const totalTripsCount = document.getElementById('totalTripsCount');
    const totalSpentElement = document.getElementById('totalSpent');
    const userRatingElement = document.getElementById('userRating');
    const totalPointsElement = document.getElementById('totalPoints');
    
    if (totalTripsCount) totalTripsCount.textContent = totalTrips;
    if (totalSpentElement) totalSpentElement.textContent = `${totalSpent.toLocaleString()} افغانی`;
    if (userRatingElement) userRatingElement.textContent = userRating;
    if (totalPointsElement) totalPointsElement.textContent = totalPoints;
    
    // برای رانندگان، نمایش اطلاعات اضافی
    if (currentUser.role === 'driver') {
        let driverInfoSection = document.querySelector('.driver-info-section');
        if (!driverInfoSection) {
            driverInfoSection = document.createElement('div');
            driverInfoSection.className = 'driver-info-section';
            driverInfoSection.style.cssText = `
                background: ${themeColors.cardBg};
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
            `;
            driverInfoSection.innerHTML = `
                <h3 style="margin-bottom: 15px; color: ${themeColors.text};">اطلاعات راننده</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">نوع وسیله:</label>
                        <span style="color: ${themeColors.text};">${currentUser.vehicle_type === 'car' ? 'خودرو' : 'موتور'}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">مدل:</label>
                        <span style="color: ${themeColors.text};">${currentUser.car_model || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">رنگ:</label>
                        <span style="color: ${themeColors.text};">${currentUser.car_color || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">پلاک:</label>
                        <span style="color: ${themeColors.text};">${currentUser.plate_number || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">وضعیت:</label>
                        <span class="status-badge" style="background: ${currentUser.driver_status === 'active' ? themeColors.success : themeColors.gray}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                            ${currentUser.driver_status === 'active' ? 'فعال' : 'غیرفعال'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">مجموع سفرها:</label>
                        <span style="color: ${themeColors.text};">${currentUser.total_trips || 0}</span>
                    </div>
                </div>
            `;
            
            const profileContent = document.getElementById('profileContent');
            if (profileContent) {
                profileContent.appendChild(driverInfoSection);
            }
        }
    }
    
    // بارگذاری اعلان‌ها
    loadNotifications();
}

function loadNotifications() {
    if (!currentUser) return;
    
    const notificationsList = document.getElementById('notificationsList');
    if (!notificationsList) return;
    
    notificationsList.innerHTML = '';
    const notifications = Notification.findByUserId(currentUser.id);
    
    if (notifications.length === 0) {
        notificationsList.innerHTML = `
            <div style="text-align: center; padding: 20px; color: ${themeColors.gray};">
                <i class="fas fa-bell-slash" style="font-size: 36px; margin-bottom: 10px; display: block;"></i>
                <p>هیچ اعلانی وجود ندارد</p>
            </div>
        `;
        return;
    }
    
    notifications.forEach(notification => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        notificationElement.style.cssText = `
            display: flex;
            align-items: center;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            background: ${notification.read ? themeColors.cardBg : themeColors.primaryLight};
            border: 1px solid ${notification.read ? themeColors.border : themeColors.primary};
            transition: all 0.3s;
            color: ${themeColors.text};
        `;
        
        const iconColor = notification.read ? themeColors.gray : themeColors.primary;
        
        notificationElement.innerHTML = `
            <div class="notification-icon" style="margin-left: 15px; color: ${iconColor}; font-size: 20px;">
                <i class="fas fa-bell${notification.read ? '' : '-slash'}"></i>
            </div>
            <div class="notification-content" style="flex: 1;">
                <div class="notification-title" style="font-weight: 600; color: ${themeColors.text}; margin-bottom: 5px;">${notification.title}</div>
                <div class="notification-message" style="color: ${themeColors.gray}; font-size: 14px; margin-bottom: 5px;">${notification.message}</div>
                <div class="notification-time" style="color: ${themeColors.gray}; font-size: 12px;">${new Date(notification.created_at).toLocaleString('fa-IR')}</div>
            </div>
            <div class="notification-actions" style="display: flex; gap: 5px;">
                ${!notification.read ? `
                <button class="btn-mark-read" data-id="${notification.id}" style="background: none; border: none; color: ${themeColors.gray}; cursor: pointer; padding: 5px; border-radius: 4px;">
                    <i class="fas fa-check"></i>
                </button>
                ` : ''}
                <button class="btn-delete-notification" data-id="${notification.id}" style="background: none; border: none; color: ${themeColors.gray}; cursor: pointer; padding: 5px; border-radius: 4px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        notificationElement.addEventListener('mouseenter', () => {
            notificationElement.style.backgroundColor = themeColors.hoverBg;
        });
        
        notificationElement.addEventListener('mouseleave', () => {
            notificationElement.style.backgroundColor = notification.read ? themeColors.cardBg : themeColors.primaryLight;
        });
        
        notificationsList.appendChild(notificationElement);
    });
    
    // اضافه کردن event listeners
    setTimeout(() => {
        document.querySelectorAll('.btn-mark-read').forEach(btn => {
            btn.addEventListener('click', function() {
                const notificationId = parseInt(this.getAttribute('data-id'));
                Notification.markAsRead(notificationId);
                loadNotifications();
            });
        });
        
        document.querySelectorAll('.btn-delete-notification').forEach(btn => {
            btn.addEventListener('click', function() {
                const notificationId = parseInt(this.getAttribute('data-id'));
                Notification.delete(notificationId);
                loadNotifications();
            });
        });
    }, 100);
}

// مدیریت پنل ادمین
function loadAdminPanel() {
    if (!isAdmin) {
        showNotification('شما دسترسی به پنل مدیریت ندارید', 'error');
        document.getElementById('home-page').classList.add('active');
        document.getElementById('admin-page').classList.remove('active');
        return;
    }
    
    loadAdminStats();
    loadPendingUsers();
    loadAllUsers();
    loadDrivers();
    loadAdminTrips();
    loadAdminDiscounts();
    loadAdminSupport();
    loadSettings();
}

function loadAdminStats() {
    const users = User.getAll();
    const trips = Trip.getAll();
    const recentTrips = trips.slice(0, 5);
    
    const totalTripsElement = document.getElementById('totalTrips');
    const activeUsersElement = document.getElementById('activeUsers');
    const totalDriversElement = document.getElementById('totalDrivers');
    const totalRevenueElement = document.getElementById('totalRevenue');
    
    if (totalTripsElement) totalTripsElement.textContent = trips.length.toLocaleString();
    if (activeUsersElement) activeUsersElement.textContent = users.filter(u => u.status === 'approved').length.toLocaleString();
    if (totalDriversElement) totalDriversElement.textContent = users.filter(u => u.role === 'driver' && u.status === 'approved').length.toLocaleString();
    
    const totalRevenue = trips.reduce((sum, trip) => sum + (trip.price || 0), 0);
    if (totalRevenueElement) totalRevenueElement.textContent = `${totalRevenue.toLocaleString()} افغانی`;
    
    // نمایش سفرهای اخیر
    const recentTripsTable = document.getElementById('recentTripsTable');
    if (recentTripsTable) {
        recentTripsTable.innerHTML = '';
        
        if (recentTrips.length === 0) {
            recentTripsTable.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px; color: ${themeColors.gray};">
                        هیچ سفری ثبت نشده است
                    </td>
                </tr>
            `;
            return;
        }
        
        recentTrips.forEach((trip, index) => {
            const row = document.createElement('tr');
            const date = new Date(trip.created_at).toLocaleDateString('fa-IR');
            const statusClass = trip.status;
            const statusText = {
                'requested': 'درخواست شده',
                'confirmed': 'تأیید شده',
                'completed': 'تکمیل شده',
                'cancelled': 'لغو شده'
            }[trip.status] || trip.status;
            
            row.style.backgroundColor = index % 2 === 0 ? themeColors.tableRowEven : themeColors.tableRowOdd;
            row.innerHTML = `
                <td style="color: ${themeColors.text};">${date}</td>
                <td style="color: ${themeColors.text};">${trip.user_name || '---'}</td>
                <td style="color: ${themeColors.text};">${trip.pickup} → ${trip.destination}</td>
                <td style="color: ${themeColors.text};">${trip.price} افغانی</td>
                <td><span class="status-badge" style="background: ${getStatusColor(statusClass)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${statusText}</span></td>
            `;
            
            recentTripsTable.appendChild(row);
        });
    }
}

function loadPendingUsers() {
    const pendingUsersTable = document.getElementById('pendingUsersTable');
    if (!pendingUsersTable) return;
    
    pendingUsersTable.innerHTML = '';
    const users = User.getAll().filter(user => user.status === 'pending');
    
    if (users.length === 0) {
        pendingUsersTable.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: ${themeColors.gray};">
                    هیچ کاربری در انتظار تایید نیست
                </td>
            </tr>
        `;
        return;
    }
    
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        const date = new Date(user.created_at).toLocaleDateString('fa-IR');
        const roleText = user.role === 'passenger' ? 'مسافر' : 'راننده';
        
        row.style.backgroundColor = index % 2 === 0 ? themeColors.tableRowEven : themeColors.tableRowOdd;
        row.innerHTML = `
            <td style="color: ${themeColors.text};">${user.name}</td>
            <td style="color: ${themeColors.text};">${user.email}</td>
            <td style="color: ${themeColors.text};">${user.phone}</td>
            <td style="color: ${themeColors.text};">${roleText}</td>
            <td style="color: ${themeColors.text};">${date}</td>
            <td style="color: ${themeColors.text};">${(user.wallet_balance || 0).toLocaleString()} افغانی</td>
            <td class="action-buttons">
                <button class="action-btn btn-approve approve-user-btn" data-id="${user.id}" style="background: ${themeColors.success}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">تایید</button>
                <button class="action-btn btn-reject reject-user-btn" data-id="${user.id}" style="background: ${themeColors.accent}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">رد</button>
            </td>
        `;
        
        pendingUsersTable.appendChild(row);
    });
    
    // اضافه کردن event listeners
    setTimeout(() => {
        document.querySelectorAll('.approve-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                updateUserStatus(userId, 'approved');
            });
        });
        
        document.querySelectorAll('.reject-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                updateUserStatus(userId, 'rejected');
            });
        });
    }, 100);
}

function updateUserStatus(userId, status) {
    const user = User.findById(userId);
    if (user) {
        user.status = status;
        user.save();
        
        // برای رانندگان، فعال کردن وضعیت
        if (status === 'approved' && user.role === 'driver') {
            user.driver_status = 'active';
            user.save();
        }
        
        showNotification(`کاربر ${user.name} ${status === 'approved' ? 'تایید' : 'رد'} شد`, 'success');
        
        // ارسال اعلان به کاربر
        const notification = new Notification({
            user_id: userId,
            title: status === 'approved' ? 'حساب کاربری شما تأیید شد' : 'حساب کاربری شما رد شد',
            message: status === 'approved' 
                ? 'حساب کاربری شما با موفقیت تأیید شد. اکنون می‌توانید از تمامی امکانات اسنپ استفاده کنید.'
                : 'متأسفانه حساب کاربری شما تأیید نشد. لطفاً با پشتیبانی تماس بگیرید.',
            type: status === 'approved' ? 'success' : 'error'
        });
        notification.save();
        
        loadPendingUsers();
        loadAllUsers();
        loadDrivers();
    }
}

function loadAllUsers() {
    const allUsersTable = document.getElementById('allUsersTable');
    if (!allUsersTable) return;
    
    allUsersTable.innerHTML = '';
    const users = User.getAll();
    
    if (users.length === 0) {
        allUsersTable.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: ${themeColors.gray};">
                    هیچ کاربری ثبت نشده است
                </td>
            </tr>
        `;
        return;
    }
    
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        const date = new Date(user.created_at).toLocaleDateString('fa-IR');
        const roleText = user.role === 'passenger' ? 'مسافر' : 'راننده';
        const statusClass = user.status;
        const statusText = {
            'pending': 'در انتظار تایید',
            'approved': 'تایید شده',
            'rejected': 'رد شده'
        }[user.status] || user.status;
        
        row.style.backgroundColor = index % 2 === 0 ? themeColors.tableRowEven : themeColors.tableRowOdd;
        row.innerHTML = `
            <td style="color: ${themeColors.text};">${user.name}</td>
            <td style="color: ${themeColors.text};">${user.email}</td>
            <td style="color: ${themeColors.text};">${user.phone}</td>
            <td style="color: ${themeColors.text};">${roleText}</td>
            <td style="color: ${themeColors.text};">${(user.wallet_balance || 0).toLocaleString()} افغانی</td>
            <td><span class="status-badge" style="background: ${getStatusColor(statusClass)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${statusText}</span></td>
            <td style="color: ${themeColors.text};">${date}</td>
            <td class="action-buttons">
                ${user.status === 'approved' ? 
                  `<button class="action-btn btn-reject deactivate-user-btn" data-id="${user.id}" style="background: ${themeColors.accent}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">غیرفعال</button>` : 
                  user.status === 'rejected' ? 
                  `<button class="action-btn btn-approve activate-user-btn" data-id="${user.id}" style="background: ${themeColors.success}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">فعال</button>` : ''}
                <button class="action-btn btn-reject delete-user-btn" data-id="${user.id}" style="background: ${themeColors.danger}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">حذف</button>
            </td>
        `;
        
        allUsersTable.appendChild(row);
    });
    
    // اضافه کردن event listeners
    setTimeout(() => {
        document.querySelectorAll('.activate-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                updateUserStatus(userId, 'approved');
            });
        });
        
        document.querySelectorAll('.deactivate-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                updateUserStatus(userId, 'rejected');
            });
        });
        
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                if (confirm('آیا از حذف این کاربر مطمئن هستید؟')) {
                    User.delete(userId);
                    showNotification('کاربر با موفقیت حذف شد', 'success');
                    loadAllUsers();
                    loadPendingUsers();
                }
            });
        });
    }, 100);
}

function loadDrivers() {
    const driversTable = document.getElementById('driversTable');
    if (!driversTable) return;
    
    driversTable.innerHTML = '';
    const drivers = User.getAll().filter(user => user.role === 'driver' && user.status === 'approved');
    
    if (drivers.length === 0) {
        driversTable.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 20px; color: ${themeColors.gray};">
                    هیچ راننده‌ای ثبت نشده است
                </td>
            </tr>
        `;
        return;
    }
    
    drivers.forEach((driver, index) => {
        const row = document.createElement('tr');
        const vehicleType = driver.vehicle_type || 'car';
        const vehicleTypeText = vehicleType === 'car' ? 'خودرو' : 'موتور';
        const statusClass = driver.driver_status;
        const statusText = driver.driver_status === 'active' ? 'فعال' : 'غیرفعال';
        
        row.style.backgroundColor = index % 2 === 0 ? themeColors.tableRowEven : themeColors.tableRowOdd;
        row.innerHTML = `
            <td style="color: ${themeColors.text};">${driver.name}</td>
            <td style="color: ${themeColors.text};">${driver.phone}</td>
            <td style="color: ${themeColors.text};">${vehicleTypeText}</td>
            <td style="color: ${themeColors.text};">${driver.car_model || '---'}</td>
            <td style="color: ${themeColors.text};">${driver.car_color || '---'}</td>
            <td style="color: ${themeColors.text};">${driver.plate_number || '---'}</td>
            <td style="color: ${themeColors.text};">${driver.total_trips || 0}</td>
            <td><span class="status-badge" style="background: ${getStatusColor(statusClass)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${statusText}</span></td>
            <td class="action-buttons">
                <button class="action-btn toggle-driver-btn" data-id="${driver.id}" data-status="${driver.driver_status}" style="background: ${driver.driver_status === 'active' ? themeColors.accent : themeColors.success}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    ${driver.driver_status === 'active' ? 'غیرفعال' : 'فعال'}
                </button>
                <button class="action-btn btn-reject delete-driver-btn" data-id="${driver.id}" style="background: ${themeColors.danger}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">حذف</button>
            </td>
        `;
        
        driversTable.appendChild(row);
    });
    
    // اضافه کردن event listeners
    setTimeout(() => {
        document.querySelectorAll('.toggle-driver-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const driverId = parseInt(this.getAttribute('data-id'));
                const currentStatus = this.getAttribute('data-status');
                const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
                
                const driver = User.findById(driverId);
                if (driver) {
                    driver.driver_status = newStatus;
                    driver.save();
                    showNotification(`راننده ${driver.name} ${newStatus === 'active' ? 'فعال' : 'غیرفعال'} شد`, 'success');
                    loadDrivers();
                }
            });
        });
        
        document.querySelectorAll('.delete-driver-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const driverId = parseInt(this.getAttribute('data-id'));
                if (confirm('آیا از حذف این راننده مطمئن هستید؟')) {
                    User.delete(driverId);
                    showNotification('راننده با موفقیت حذف شد', 'success');
                    loadDrivers();
                }
            });
        });
    }, 100);
}

function loadAdminTrips() {
    const adminTripsTable = document.getElementById('adminTripsTable');
    if (!adminTripsTable) return;
    
    adminTripsTable.innerHTML = '';
    const trips = Trip.getAll().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    if (trips.length === 0) {
        adminTripsTable.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 20px; color: ${themeColors.gray};">
                    هیچ سفری ثبت نشده است
                </td>
            </tr>
        `;
        return;
    }
    
    trips.forEach((trip, index) => {
        const row = document.createElement('tr');
        const date = new Date(trip.created_at).toLocaleDateString('fa-IR');
        const time = new Date(trip.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        const statusClass = trip.status;
        const statusText = {
            'requested': 'درخواست شده',
            'confirmed': 'تأیید شده',
            'in_progress': 'در حال انجام',
            'completed': 'تکمیل شده',
            'cancelled': 'لغو شده'
        }[trip.status] || trip.status;
        
        row.style.backgroundColor = index % 2 === 0 ? themeColors.tableRowEven : themeColors.tableRowOdd;
        row.innerHTML = `
            <td style="color: ${themeColors.text};">${date}<br><small style="color: ${themeColors.gray};">${time}</small></td>
            <td style="color: ${themeColors.text};">${trip.user_name || '---'}</td>
            <td style="color: ${themeColors.text};">${trip.driver_name || '---'}</td>
            <td style="color: ${themeColors.text};">${trip.pickup}</td>
            <td style="color: ${themeColors.text};">${trip.destination}</td>
            <td style="color: ${themeColors.text};">${trip.distance} کیلومتر</td>
            <td style="color: ${themeColors.text};">${trip.price} افغانی</td>
            <td><span class="status-badge" style="background: ${getStatusColor(statusClass)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${statusText}</span></td>
            <td class="action-buttons">
                ${trip.status === 'requested' || trip.status === 'confirmed' || trip.status === 'in_progress' ? 
                  `<button class="action-btn btn-reject cancel-admin-trip-btn" data-id="${trip.id}" style="background: ${themeColors.accent}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">لغو سفر</button>` : ''}
                <button class="action-btn btn-info view-admin-trip-btn" data-id="${trip.id}" style="background: ${themeColors.info}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">جزئیات</button>
                <button class="action-btn btn-reject delete-admin-trip-btn" data-id="${trip.id}" style="background: ${themeColors.danger}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">حذف</button>
            </td>
        `;
        
        adminTripsTable.appendChild(row);
    });
    
    // اضافه کردن event listeners
    setTimeout(() => {
        document.querySelectorAll('.cancel-admin-trip-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tripId = parseInt(this.getAttribute('data-id'));
                const trip = Trip.findById(tripId);
                if (trip && confirm('آیا از لغو این سفر مطمئن هستید؟')) {
                    trip.status = 'cancelled';
                    trip.save();
                    showNotification('سفر لغو شد', 'success');
                    loadAdminTrips();
                    loadAdminStats();
                }
            });
        });
        
        document.querySelectorAll('.view-admin-trip-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tripId = parseInt(this.getAttribute('data-id'));
                viewAdminTripDetails(tripId);
            });
        });
        
        document.querySelectorAll('.delete-admin-trip-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tripId = parseInt(this.getAttribute('data-id'));
                if (confirm('آیا از حذف این سفر مطمئن هستید؟')) {
                    Trip.delete(tripId);
                    showNotification('سفر با موفقیت حذف شد', 'success');
                    loadAdminTrips();
                    loadAdminStats();
                }
            });
        });
    }, 100);
}

function viewAdminTripDetails(tripId) {
    const trip = Trip.findById(tripId);
    if (!trip) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'adminTripDetailsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${themeColors.overlay};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const date = new Date(trip.created_at).toLocaleDateString('fa-IR');
    const time = new Date(trip.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const rideTypeText = {
        'economy': 'اقتصادی',
        'comfort': 'کلاسیک',
        'bike': 'موتور'
    }[trip.ride_type] || trip.ride_type;
    
    let startedAt = '---';
    let completedAt = '---';
    if (trip.started_at) {
        startedAt = new Date(trip.started_at).toLocaleString('fa-IR');
    }
    if (trip.completed_at) {
        completedAt = new Date(trip.completed_at).toLocaleString('fa-IR');
    }
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 600px; max-width: 90%; background: ${themeColors.cardBg}; border-radius: 12px; max-height: 90%; overflow: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="margin: 0; color: ${themeColors.text};">جزئیات سفر #${trip.id}</h3>
                <button class="close-modal" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">تاریخ ایجاد:</label>
                        <span style="color: ${themeColors.text};">${date} - ${time}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">نوع سفر:</label>
                        <span style="color: ${themeColors.text};">${rideTypeText}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">مسافر:</label>
                        <span style="color: ${themeColors.text};">${trip.user_name || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">راننده:</label>
                        <span style="color: ${themeColors.text};">${trip.driver_name || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">مبدا:</label>
                        <span style="color: ${themeColors.text};">${trip.pickup}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">مقصد:</label>
                        <span style="color: ${themeColors.text};">${trip.destination}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">مسافت:</label>
                        <span style="color: ${themeColors.text};">${trip.distance} کیلومتر</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">هزینه:</label>
                        <span style="color: ${themeColors.text};">${trip.price} افغانی</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">روش پرداخت:</label>
                        <span style="color: ${themeColors.text};">${trip.payment_method === 'cash' ? 'نقدی' : 'کیف پول'}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">وضعیت:</label>
                        <span class="status-badge" style="background: ${getStatusColor(trip.status)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                            ${trip.status === 'requested' ? 'درخواست شده' : 
                              trip.status === 'confirmed' ? 'تأیید شده' : 
                              trip.status === 'in_progress' ? 'در حال انجام' : 
                              trip.status === 'completed' ? 'تکمیل شده' : 'لغو شده'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">زمان شروع:</label>
                        <span style="color: ${themeColors.text};">${startedAt}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">زمان اتمام:</label>
                        <span style="color: ${themeColors.text};">${completedAt}</span>
                    </div>
                    ${trip.reward_points > 0 ? `
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">امتیاز پاداش:</label>
                        <span style="color: ${themeColors.text};">${trip.reward_points}</span>
                    </div>
                    ` : ''}
                </div>
                ${trip.rating ? `
                <div style="background: ${themeColors.primaryLight}; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <h4 style="margin-bottom: 10px; color: ${themeColors.text};">امتیاز</h4>
                    <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                        ${Array.from({length: 5}, (_, i) => `
                            <i class="fas fa-star ${i < trip.rating ? 'active' : ''}" style="color: ${i < trip.rating ? themeColors.warning : themeColors.gray};"></i>
                        `).join('')}
                        <span style="margin-right: 10px; color: ${themeColors.text};">${trip.rating}/5</span>
                    </div>
                    ${trip.rating_comment ? `<p style="margin: 0; color: ${themeColors.text};"><strong>نظر:</strong> ${trip.rating_comment}</p>` : ''}
                </div>
                ` : ''}
            </div>
            <div class="modal-footer" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid ${themeColors.border}; display: flex; justify-content: flex-end; gap: 10px;">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()" style="background: ${themeColors.lightGray}; color: ${themeColors.text}; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">بستن</button>
                ${trip.status !== 'completed' && trip.status !== 'cancelled' ? `
                <button class="btn-reject cancel-trip-now-btn" data-id="${trip.id}" style="background: ${themeColors.accent}; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">لغو سفر</button>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // بستن مدال
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // دکمه لغو سفر
    const cancelBtn = modal.querySelector('.cancel-trip-now-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            const tripId = parseInt(this.getAttribute('data-id'));
            const trip = Trip.findById(tripId);
            if (trip && confirm('آیا از لغو این سفر مطمئن هستید؟')) {
                trip.status = 'cancelled';
                trip.save();
                showNotification('سفر لغو شد', 'success');
                modal.remove();
                loadAdminTrips();
                loadAdminStats();
            }
        });
    }
    
    // بستن با کلیک خارج
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function loadAdminDiscounts() {
    const discountsTable = document.getElementById('discountsTable');
    if (!discountsTable) return;
    
    discountsTable.innerHTML = '';
    const discounts = Discount.getAll().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    if (discounts.length === 0) {
        discountsTable.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: ${themeColors.gray};">
                    هیچ تخفیفی ثبت نشده است
                </td>
            </tr>
        `;
        return;
    }
    
    discounts.forEach((discount, index) => {
        const row = document.createElement('tr');
        const createdDate = new Date(discount.created_at).toLocaleDateString('fa-IR');
        const expiryDate = new Date(discount.expiry_date).toLocaleDateString('fa-IR');
        const isExpired = new Date(discount.expiry_date) < new Date();
        const statusClass = isExpired ? 'inactive' : 'active';
        const statusText = isExpired ? 'منقضی' : 'فعال';
        
        row.style.backgroundColor = index % 2 === 0 ? themeColors.tableRowEven : themeColors.tableRowOdd;
        row.innerHTML = `
            <td style="color: ${themeColors.text};">${discount.code}</td>
            <td style="color: ${themeColors.text};">${discount.percent}%</td>
            <td style="color: ${themeColors.text};">${expiryDate}</td>
            <td style="color: ${themeColors.text};">${discount.max_uses}</td>
            <td style="color: ${themeColors.text};">${discount.used_count || 0}</td>
            <td style="color: ${themeColors.text};">${createdDate}</td>
            <td><span class="status-badge" style="background: ${getStatusColor(statusClass)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${statusText}</span></td>
            <td class="action-buttons">
                <button class="action-btn btn-info edit-discount-btn" data-id="${discount.id}" style="background: ${themeColors.info}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">ویرایش</button>
                <button class="action-btn btn-reject delete-discount-btn" data-id="${discount.id}" style="background: ${themeColors.danger}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">حذف</button>
            </td>
        `;
        
        discountsTable.appendChild(row);
    });
    
    // اضافه کردن event listeners
    setTimeout(() => {
        document.querySelectorAll('.edit-discount-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const discountId = parseInt(this.getAttribute('data-id'));
                editDiscount(discountId);
            });
        });
        
        document.querySelectorAll('.delete-discount-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const discountId = parseInt(this.getAttribute('data-id'));
                if (confirm('آیا از حذف این تخفیف مطمئن هستید؟')) {
                    Discount.delete(discountId);
                    showNotification('تخفیف با موفقیت حذف شد', 'success');
                    loadAdminDiscounts();
                }
            });
        });
    }, 100);
}

function editDiscount(discountId) {
    const discount = Discount.getAll().find(d => d.id === discountId);
    if (!discount) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editDiscountModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${themeColors.overlay};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    // فرمت تاریخ برای input
    const expiryDate = new Date(discount.expiry_date);
    const formattedDate = expiryDate.toISOString().split('T')[0];
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 400px; max-width: 90%; background: ${themeColors.cardBg}; border-radius: 12px; max-height: 90%; overflow: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="margin: 0; color: ${themeColors.text};">ویرایش تخفیف ${discount.code}</h3>
                <button class="close-modal" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <form id="editDiscountForm">
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="editDiscountCode" style="display: block; margin-bottom: 5px; color: ${themeColors.text};">کد تخفیف:</label>
                        <input type="text" id="editDiscountCode" value="${discount.code}" class="form-input" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid ${themeColors.border}; background: ${themeColors.inputBg}; color: ${themeColors.text};" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="editDiscountPercent" style="display: block; margin-bottom: 5px; color: ${themeColors.text};">درصد تخفیف:</label>
                        <input type="number" id="editDiscountPercent" value="${discount.percent}" min="1" max="100" class="form-input" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid ${themeColors.border}; background: ${themeColors.inputBg}; color: ${themeColors.text};" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="editDiscountExpiry" style="display: block; margin-bottom: 5px; color: ${themeColors.text};">تاریخ انقضا:</label>
                        <input type="date" id="editDiscountExpiry" value="${formattedDate}" class="form-input" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid ${themeColors.border}; background: ${themeColors.inputBg}; color: ${themeColors.text};" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="editMaxUses" style="display: block; margin-bottom: 5px; color: ${themeColors.text};">حداکثر استفاده:</label>
                        <input type="number" id="editMaxUses" value="${discount.max_uses}" min="1" class="form-input" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid ${themeColors.border}; background: ${themeColors.inputBg}; color: ${themeColors.text};" required>
                    </div>
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="editUsedCount" style="display: block; margin-bottom: 5px; color: ${themeColors.text};">تعداد استفاده شده:</label>
                        <input type="number" id="editUsedCount" value="${discount.used_count}" min="0" class="form-input" style="width: 100%; padding: 10px; border-radius: 6px; border: 1px solid ${themeColors.border}; background: ${themeColors.inputBg}; color: ${themeColors.text};" required>
                    </div>
                    <input type="hidden" id="editDiscountId" value="${discount.id}">
                </form>
            </div>
            <div class="modal-footer" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid ${themeColors.border}; display: flex; justify-content: flex-end; gap: 10px;">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()" style="background: ${themeColors.lightGray}; color: ${themeColors.text}; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">لغو</button>
                <button class="btn-primary" id="saveEditDiscount" style="background: ${themeColors.primary}; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">ذخیره تغییرات</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // بستن مدال
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // ذخیره تغییرات
    document.getElementById('saveEditDiscount').addEventListener('click', () => {
        const code = document.getElementById('editDiscountCode').value;
        const percent = parseInt(document.getElementById('editDiscountPercent').value);
        const expiryDate = document.getElementById('editDiscountExpiry').value;
        const maxUses = parseInt(document.getElementById('editMaxUses').value);
        const usedCount = parseInt(document.getElementById('editUsedCount').value);
        
        discount.code = code;
        discount.percent = percent;
        discount.expiry_date = expiryDate;
        discount.max_uses = maxUses;
        discount.used_count = usedCount;
        
        discount.save();
        
        modal.remove();
        showNotification('تخفیف با موفقیت ویرایش شد', 'success');
        loadAdminDiscounts();
    });
    
    // بستن با کلیک خارج
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function loadAdminSupport() {
    const adminSupportTable = document.getElementById('adminSupportTable');
    if (!adminSupportTable) return;
    
    adminSupportTable.innerHTML = '';
    const tickets = SupportTicket.getAll().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    if (tickets.length === 0) {
        adminSupportTable.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: ${themeColors.gray};">
                    هیچ درخواست پشتیبانی ثبت نشده است
                </td>
            </tr>
        `;
        return;
    }
    
    tickets.forEach((ticket, index) => {
        const row = document.createElement('tr');
        const date = new Date(ticket.created_at).toLocaleDateString('fa-IR');
        const statusClass = ticket.status;
        const statusText = {
            'pending': 'در انتظار پاسخ',
            'answered': 'پاسخ داده شده',
            'closed': 'بسته شده'
        }[ticket.status] || ticket.status;
        
        row.style.backgroundColor = index % 2 === 0 ? themeColors.tableRowEven : themeColors.tableRowOdd;
        row.innerHTML = `
            <td style="color: ${themeColors.text};">${ticket.user_name || '---'}</td>
            <td style="color: ${themeColors.text};">${ticket.subject}</td>
            <td style="color: ${themeColors.text};">${ticket.message.length > 50 ? ticket.message.substring(0, 50) + '...' : ticket.message}</td>
            <td style="color: ${themeColors.text};">${date}</td>
            <td><span class="status-badge" style="background: ${getStatusColor(statusClass)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${statusText}</span></td>
            <td style="color: ${themeColors.text};">${ticket.reply ? '✓' : '✗'}</td>
            <td class="action-buttons">
                ${ticket.status !== 'closed' ? 
                  `<button class="action-btn btn-approve reply-ticket-btn" data-id="${ticket.id}" style="background: ${themeColors.success}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">پاسخ</button>` : ''}
                <button class="action-btn btn-info view-ticket-btn" data-id="${ticket.id}" style="background: ${themeColors.info}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">مشاهده</button>
                <button class="action-btn btn-reject close-ticket-btn" data-id="${ticket.id}" style="background: ${ticket.status === 'closed' ? themeColors.danger : themeColors.accent}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">${ticket.status === 'closed' ? 'حذف' : 'بستن'}</button>
            </td>
        `;
        
        adminSupportTable.appendChild(row);
    });
    
    // اضافه کردن event listeners
    setTimeout(() => {
        document.querySelectorAll('.reply-ticket-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const ticketId = parseInt(this.getAttribute('data-id'));
                replyToTicket(ticketId);
            });
        });
        
        document.querySelectorAll('.view-ticket-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const ticketId = parseInt(this.getAttribute('data-id'));
                viewTicket(ticketId);
            });
        });
        
        document.querySelectorAll('.close-ticket-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const ticketId = parseInt(this.getAttribute('data-id'));
                const ticket = SupportTicket.getAll().find(t => t.id === ticketId);
                if (ticket) {
                    if (ticket.status === 'closed') {
                        if (confirm('آیا از حذف این تیکت مطمئن هستید؟')) {
                            // حذف تیکت
                            let tickets = storage.get('snapp_support');
                            tickets = tickets.filter(t => t.id !== ticketId);
                            storage.set('snapp_support', tickets);
                            showNotification('تیکت با موفقیت حذف شد', 'success');
                            loadAdminSupport();
                        }
                    } else {
                        if (confirm('آیا می‌خواهید این تیکت را ببندید؟')) {
                            ticket.status = 'closed';
                            ticket.save();
                            showNotification('تیکت بسته شد', 'success');
                            loadAdminSupport();
                        }
                    }
                }
            });
        });
    }, 100);
}

function replyToTicket(ticketId) {
    const reply = prompt('پاسخ خود را وارد کنید:');
    if (reply) {
        const ticket = SupportTicket.getAll().find(t => t.id === ticketId);
        if (ticket) {
            ticket.reply = reply;
            ticket.status = 'answered';
            ticket.replied_at = new Date().toISOString();
            ticket.save();
            showNotification('پاسخ با موفقیت ثبت شد', 'success');
            loadAdminSupport();
        }
    }
}

function viewTicket(ticketId) {
    const ticket = SupportTicket.getAll().find(t => t.id === ticketId);
    if (!ticket) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'ticketDetailsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${themeColors.overlay};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const createdDate = new Date(ticket.created_at).toLocaleString('fa-IR');
    const repliedDate = ticket.replied_at ? new Date(ticket.replied_at).toLocaleString('fa-IR') : '---';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px; max-width: 90%; background: ${themeColors.cardBg}; border-radius: 12px; max-height: 90%; overflow: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="margin: 0; color: ${themeColors.text};">تیکت #${ticket.id} - ${ticket.subject}</h3>
                <button class="close-modal" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <div style="margin-bottom: 20px;">
                    <div class="detail-item" style="margin-bottom: 10px;">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">کاربر:</label>
                        <span style="color: ${themeColors.text};">${ticket.user_name || '---'}</span>
                    </div>
                    <div class="detail-item" style="margin-bottom: 10px;">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">تاریخ ایجاد:</label>
                        <span style="color: ${themeColors.text};">${createdDate}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">وضعیت:</label>
                        <span class="status-badge" style="background: ${getStatusColor(ticket.status)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                            ${ticket.status === 'pending' ? 'در انتظار پاسخ' : 
                              ticket.status === 'answered' ? 'پاسخ داده شده' : 'بسته شده'}
                        </span>
                    </div>
                </div>
                
                <div style="background: ${themeColors.primaryLight}; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin-bottom: 10px; color: ${themeColors.text};">پیام کاربر:</h4>
                    <p style="margin: 0; white-space: pre-wrap; color: ${themeColors.text};">${ticket.message}</p>
                </div>
                
                ${ticket.reply ? `
                <div style="background: ${themeColors.success}20; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin-bottom: 10px; color: ${themeColors.text};">پاسخ پشتیبانی:</h4>
                    <p style="margin: 0; white-space: pre-wrap; color: ${themeColors.text};">${ticket.reply}</p>
                    <div style="margin-top: 10px; font-size: 12px; color: ${themeColors.gray};">
                        <i class="fas fa-clock"></i> ${repliedDate}
                    </div>
                </div>
                ` : ''}
            </div>
            ${!ticket.reply ? `
            <div class="modal-footer" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid ${themeColors.border}; display: flex; justify-content: flex-end;">
                <button class="btn-primary" onclick="replyToTicketNow(${ticket.id})" style="background: ${themeColors.primary}; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">پاسخ دادن</button>
            </div>
            ` : ''}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // بستن مدال
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // بستن با کلیک خارج
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function replyToTicketNow(ticketId) {
    const modal = document.getElementById('ticketDetailsModal');
    if (modal) modal.remove();
    
    setTimeout(() => {
        replyToTicket(ticketId);
    }, 100);
}

// اضافه کردن استایل‌های CSS برای قابلیت‌های جدید
function addAdditionalStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* استایل‌های پایه با رنگ‌های تاریک */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: ${themeColors.bgLight};
            color: ${themeColors.text};
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* استایل‌های هدر */
        header {
            background: ${themeColors.cardBg};
            border-bottom: 1px solid ${themeColors.border};
            padding: 15px 0;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            color: ${themeColors.primary};
            font-size: 24px;
            font-weight: bold;
            text-decoration: none;
        }
        
        .logo img {
            height: 40px;
            width: 40px;
        }
        
        .desktop-nav {
            display: flex;
            align-items: center;
            gap: 30px;
        }
        
        .nav-link {
            color: ${themeColors.text};
            text-decoration: none;
            padding: 8px 12px;
            border-radius: 6px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .nav-link:hover {
            background: ${themeColors.hoverBg};
            color: ${themeColors.primary};
        }
        
        .nav-link.active {
            background: ${themeColors.primary};
            color: ${themeColors.white};
        }
        
        .user-profile {
            display: none;
            align-items: center;
            gap: 10px;
            background: ${themeColors.hoverBg};
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
        }
        
        .user-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: ${themeColors.primary};
            color: ${themeColors.white};
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        .btn {
            padding: 10px 20px;
            border-radius: 6px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: ${themeColors.primary};
            color: ${themeColors.white};
        }
        
        .btn-primary:hover {
            background: ${themeColors.primaryDark};
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 123, 189, 0.3);
        }
        
        .btn-secondary {
            background: ${themeColors.lightGray};
            color: ${themeColors.text};
        }
        
        .btn-success {
            background: ${themeColors.success};
            color: ${themeColors.white};
        }
        
        .btn-danger {
            background: ${themeColors.danger};
            color: ${themeColors.white};
        }
        
        .btn-warning {
            background: ${themeColors.warning};
            color: ${themeColors.text};
        }
        
        /* استایل‌های صفحه اصلی */
        .page {
            display: none;
            padding: 30px 0;
        }
        
        .page.active {
            display: block;
        }
        
        .hero-section {
            background: linear-gradient(135deg, ${themeColors.primaryDark}, ${themeColors.primary});
            border-radius: 12px;
            padding: 40px;
            margin-bottom: 30px;
            color: ${themeColors.white};
            text-align: center;
        }
        
        .hero-section h1 {
            font-size: 36px;
            margin-bottom: 20px;
        }
        
        .hero-section p {
            font-size: 18px;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        
        .search-box {
            background: ${themeColors.cardBg};
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: ${themeColors.text};
            font-weight: 500;
        }
        
        .form-input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid ${themeColors.border};
            border-radius: 8px;
            background: ${themeColors.inputBg};
            color: ${themeColors.text};
            font-size: 16px;
        }
        
        .form-input:focus {
            outline: none;
            border-color: ${themeColors.primary};
            box-shadow: 0 0 0 2px rgba(0, 123, 189, 0.2);
        }
        
        .input-with-icon {
            position: relative;
        }
        
        .input-with-icon i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: ${themeColors.gray};
        }
        
        .input-with-icon .form-input {
            padding-left: 45px;
        }
        
        .swap-btn {
            background: ${themeColors.lightGray};
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: ${themeColors.text};
            margin: 10px auto;
        }
        
        .swap-btn:hover {
            background: ${themeColors.hoverBg};
        }
        
        .ride-types {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .ride-type {
            background: ${themeColors.cardBg};
            border: 2px solid ${themeColors.border};
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .ride-type:hover {
            border-color: ${themeColors.primary};
            transform: translateY(-5px);
        }
        
        .ride-type.selected {
            border-color: ${themeColors.primary};
            background: ${themeColors.primaryLight};
        }
        
        .ride-type-icon {
            font-size: 32px;
            margin-bottom: 10px;
            color: ${themeColors.primary};
        }
        
        .ride-type-name {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            color: ${themeColors.text};
        }
        
        .ride-type-price {
            font-size: 24px;
            font-weight: bold;
            color: ${themeColors.primary};
        }
        
        .ride-type-desc {
            font-size: 12px;
            color: ${themeColors.gray};
            margin-top: 5px;
        }
        
        .map-container {
            height: 500px;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        
        #map {
            height: 100%;
            width: 100%;
        }
        
        .districts-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 20px;
        }
        
        /* استایل‌های جداول */
        table {
            width: 100%;
            border-collapse: collapse;
            background: ${themeColors.cardBg};
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        th {
            background: ${themeColors.tableHeader};
            color: ${themeColors.text};
            padding: 15px;
            text-align: right;
            font-weight: 600;
            border-bottom: 2px solid ${themeColors.border};
        }
        
        td {
            padding: 12px 15px;
            border-bottom: 1px solid ${themeColors.border};
            color: ${themeColors.text};
        }
        
        tr:hover {
            background: ${themeColors.hoverBg};
        }
        
        /* استایل‌های کارت‌ها */
        .card {
            background: ${themeColors.cardBg};
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border: 1px solid ${themeColors.border};
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid ${themeColors.border};
        }
        
        .card-title {
            font-size: 20px;
            font-weight: 600;
            color: ${themeColors.text};
        }
        
        /* استایل‌های فوتر */
        footer {
            background: ${themeColors.cardBg};
            border-top: 1px solid ${themeColors.border};
            padding: 40px 0;
            margin-top: 50px;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .footer-section h3 {
            color: ${themeColors.primary};
            margin-bottom: 20px;
            font-size: 18px;
        }
        
        .footer-section p {
            color: ${themeColors.gray};
            line-height: 1.8;
        }
        
        .footer-links {
            list-style: none;
        }
        
        .footer-links li {
            margin-bottom: 10px;
        }
        
        .footer-links a {
            color: ${themeColors.gray};
            text-decoration: none;
            transition: color 0.3s;
        }
        
        .footer-links a:hover {
            color: ${themeColors.primary};
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 30px;
            margin-top: 30px;
            border-top: 1px solid ${themeColors.border};
            color: ${themeColors.gray};
        }
        
        /* استایل‌های مودال */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background: ${themeColors.cardBg};
            border-radius: 12px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            animation: modalSlideIn 0.3s ease;
        }
        
        @keyframes modalSlideIn {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid ${themeColors.border};
        }
        
        .modal-header h3 {
            margin: 0;
            color: ${themeColors.text};
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid ${themeColors.border};
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            color: ${themeColors.text};
            cursor: pointer;
        }
        
        /* استایل‌های سیستم اعلان‌ها */
        .notification-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            background: ${themeColors.cardBg};
            border: 1px solid ${themeColors.border};
            transition: all 0.3s;
        }
        
        .notification-item.unread {
            background: ${themeColors.primaryLight};
            border-color: ${themeColors.primary};
        }
        
        .notification-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .notification-icon {
            margin-left: 15px;
            color: ${themeColors.primary};
            font-size: 20px;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-title {
            font-weight: 600;
            color: ${themeColors.text};
            margin-bottom: 5px;
        }
        
        .notification-message {
            color: ${themeColors.gray};
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .notification-time {
            color: ${themeColors.gray};
            font-size: 12px;
        }
        
        .notification-actions {
            display: flex;
            gap: 5px;
        }
        
        .btn-mark-read, .btn-delete-notification {
            background: none;
            border: none;
            color: ${themeColors.gray};
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
        }
        
        .btn-mark-read:hover {
            color: ${themeColors.success};
            background: rgba(0, 209, 178, 0.1);
        }
        
        .btn-delete-notification:hover {
            color: ${themeColors.danger};
            background: rgba(216, 27, 96, 0.1);
        }
        
        /* استایل‌های تب‌ها */
        .tabs {
            display: flex;
            border-bottom: 1px solid ${themeColors.border};
            margin-bottom: 20px;
        }
        
        .tab {
            padding: 12px 24px;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            color: ${themeColors.text};
            transition: all 0.3s;
        }
        
        .tab:hover {
            color: ${themeColors.primary};
        }
        
        .tab.active {
            color: ${themeColors.primary};
            border-bottom-color: ${themeColors.primary};
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        /* استایل‌های ریسپانسیو */
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                gap: 15px;
            }
            
            .desktop-nav {
                width: 100%;
                justify-content: center;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .nav-link {
                padding: 6px 10px;
                font-size: 14px;
            }
            
            .hero-section {
                padding: 30px 20px;
            }
            
            .hero-section h1 {
                font-size: 28px;
            }
            
            .ride-types {
                grid-template-columns: 1fr;
            }
            
            .footer-content {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            table {
                display: block;
                overflow-x: auto;
            }
        }
        
        /* استایل‌های انیمیشن‌ها */
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease;
        }
        
        /* استایل‌های سیستم امتیازدهی */
        .rating-stars {
            display: flex;
            gap: 5px;
            margin: 15px 0;
        }
        
        .rating-star {
            font-size: 24px;
            color: ${themeColors.gray};
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .rating-star.active {
            color: ${themeColors.warning};
        }
        
        /* استایل‌های پیشرفت */
        .progress-bar {
            height: 8px;
            background: ${themeColors.border};
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: ${themeColors.primary};
            transition: width 0.3s ease;
        }
        
        /* استایل‌های سیستم پرداخت */
        .payment-methods {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .payment-method {
            padding: 15px;
            border: 2px solid ${themeColors.border};
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .payment-method:hover {
            border-color: ${themeColors.primary};
        }
        
        .payment-method.selected {
            border-color: ${themeColors.primary};
            background: ${themeColors.primaryLight};
        }
        
        .payment-icon {
            font-size: 32px;
            margin-bottom: 10px;
            color: ${themeColors.primary};
        }
        
        /* استایل‌های فیلدهای فرم */
        .error-message {
            color: ${themeColors.accent};
            font-size: 12px;
            margin-top: 5px;
            display: none;
        }
        
        /* استایل‌های سیستم ردیابی زنده */
        .live-tracking {
            background: ${themeColors.cardBg};
            border: 1px solid ${themeColors.primary};
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        
        .tracking-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid ${themeColors.border};
        }
        
        .tracking-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .tracking-item {
            background: ${themeColors.inputBg};
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }
        
        .tracking-label {
            font-size: 12px;
            color: ${themeColors.gray};
            margin-bottom: 5px;
        }
        
        .tracking-value {
            font-size: 18px;
            font-weight: bold;
            color: ${themeColors.text};
        }
        
        /* استایل‌های منوی موبایل */
        .mobile-menu {
            position: fixed;
            top: 0;
            right: -300px;
            width: 300px;
            height: 100%;
            background: ${themeColors.cardBg};
            box-shadow: -2px 0 10px rgba(0,0,0,0.3);
            transition: right 0.3s ease;
            z-index: 1000;
            padding: 20px;
            overflow-y: auto;
        }
        
        .mobile-menu.active {
            right: 0;
        }
        
        .mobile-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 1px solid ${themeColors.border};
        }
        
        .mobile-nav {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .mobile-nav a {
            padding: 12px 15px;
            color: ${themeColors.text};
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .mobile-nav a:hover {
            background: ${themeColors.hoverBg};
            color: ${themeColors.primary};
        }
        
        .mobile-nav a.active {
            background: ${themeColors.primary};
            color: ${themeColors.white};
        }
        
        .hamburger {
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            color: ${themeColors.text};
            cursor: pointer;
            padding: 10px;
        }
        
        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${themeColors.overlay};
            z-index: 999;
        }
        
        .overlay.active {
            display: block;
        }
        
        .close-menu {
            background: none;
            border: none;
            font-size: 24px;
            color: ${themeColors.text};
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .hamburger {
                display: block;
            }
            
            .desktop-nav {
                display: none;
            }
            
            .user-profile {
                margin: 0 auto;
            }
        }
        
        /* استایل‌های سیستم اعلان‌های پاپ‌آپ */
        #notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${themeColors.cardBg};
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            min-width: 300px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
            border-right: 4px solid ${themeColors.primary};
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

// ایجاد عناصر ضروری
function createRequiredElements() {
    // ایجاد notification element
    if (!document.getElementById('notification')) {
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${themeColors.cardBg};
            color: ${themeColors.text};
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            z-index: 10000;
            display: none;
            min-width: 300px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
            border-right: 4px solid ${themeColors.primary};
            font-family: inherit;
        `;
        document.body.appendChild(notification);
    }
    
    // ایجاد overlay برای موبایل
    if (!document.getElementById('overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.className = 'overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${themeColors.overlay};
            z-index: 999;
            display: none;
        `;
        document.body.appendChild(overlay);
    }
    
    // ایجاد منوی موبایل
    if (!document.getElementById('mobileMenu')) {
        const mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobileMenu';
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-header">
                <h3 style="color: ${themeColors.text};">منو</h3>
                <button id="closeMenu" class="close-menu">&times;</button>
            </div>
            <div class="mobile-nav">
                <a href="#" class="nav-link active" data-page="home">
                    <i class="fas fa-home"></i> صفحه اصلی
                </a>
                <a href="#" class="nav-link" data-page="my-trips">
                    <i class="fas fa-road"></i> سفرهای من
                </a>
                <a href="#" class="nav-link" data-page="discounts">
                    <i class="fas fa-tag"></i> تخفیف‌ها
                </a>
                <a href="#" class="nav-link" data-page="profile">
                    <i class="fas fa-user"></i> پروفایل
                </a>
                <a href="#" class="nav-link" id="mobileAdminLink" data-page="admin" style="display: none;">
                    <i class="fas fa-cog"></i> پنل مدیریت
                </a>
                <a href="#" id="mobileLoginBtn" style="display: none;">
                    <i class="fas fa-sign-in-alt"></i> ورود / ثبت‌نام
                </a>
                <a href="#" id="mobileLogoutBtn" style="display: none;">
                    <i class="fas fa-sign-out-alt"></i> خروج
                </a>
                <a href="#" id="generateReportBtn" class="nav-link">
                    <i class="fas fa-chart-bar"></i> گزارش سفرها
                </a>
            </div>
        `;
        document.body.appendChild(mobileMenu);
    }
    
    // ایجاد دکمه همبرگر
    if (!document.getElementById('hamburger')) {
        const hamburger = document.createElement('button');
        hamburger.id = 'hamburger';
        hamburger.className = 'hamburger';
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        hamburger.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            color: ${themeColors.text};
            cursor: pointer;
            padding: 10px;
        `;
        
        // اضافه کردن به هدر
        const header = document.querySelector('header');
        if (header) {
            header.insertBefore(hamburger, header.firstChild);
        } else {
            document.body.appendChild(hamburger);
        }
    }
}

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
        });
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileMenu);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }
    
    // اضافه کردن event listeners برای لینک‌های منوی موبایل
    setTimeout(() => {
        document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page') + '-page';
                
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                
                document.querySelectorAll('.nav-link').forEach(l => {
                    l.classList.remove('active');
                });
                this.classList.add('active');
                
                const targetPage = document.getElementById(pageId);
                if (targetPage) targetPage.classList.add('active');
                
                closeMobileMenu();
                
                // بارگذاری داده‌های صفحه
                if (pageId === 'my-trips-page') {
                    loadMyTrips();
                } else if (pageId === 'discounts-page') {
                    loadDiscounts();
                } else if (pageId === 'profile-page') {
                    updateProfilePage();
                } else if (pageId === 'admin-page') {
                    loadAdminPanel();
                }
            });
        });
        
        // دکمه ورود در موبایل
        const mobileLoginBtn = document.getElementById('mobileLoginBtn');
        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openAuthModal();
                closeMobileMenu();
            });
        }
        
        // دکمه خروج در موبایل
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
                closeMobileMenu();
            });
        }
        
        // دکمه گزارش در موبایل
        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const generateReportMainBtn = document.getElementById('generateReport');
                if (generateReportMainBtn) generateReportMainBtn.click();
                closeMobileMenu();
            });
        }
    }, 100);
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// تابع کمکی برای دانلود گزارش
function downloadReport(reportText) {
    const decodedText = decodeURIComponent(reportText);
    const blob = new Blob([decodedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snapp-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('گزارش با موفقیت دانلود شد', 'success');
}

// ارسال اعلان به کاربران
function sendNotificationToUser(userId, title, message, type = 'info') {
    const notification = new Notification({
        user_id: userId,
        title: title,
        message: message,
        type: type
    });
    notification.save();
    
    // اگر کاربر آنلاین باشد، نوتیفیکیشن را نشان بده
    if (currentUser && currentUser.id === userId) {
        showNotification(`${title}: ${message}`, type);
        // به‌روزرسانی لیست اعلان‌ها
        loadNotifications();
    }
}

// سیستم امتیازدهی و پاداش
function calculateRewardPoints(trip) {
    const settings = new Settings();
    const rewardPointsRate = settings.get('reward_points_rate') || 10;
    
    // محاسبه امتیازات بر اساس هزینه سفر
    const points = Math.floor(trip.price / rewardPointsRate);
    
    // ذخیره امتیازات در سفر
    trip.reward_points = points;
    trip.save();
    
    // ذخیره امتیازات کاربر
    const user = User.findById(trip.user_id);
    if (user) {
        user.reward_points = (user.reward_points || 0) + points;
        user.save();
        
        // ارسال نوتیفیکیشن
        sendNotificationToUser(user.id, 'امتیاز پاداش', `${points} امتیاز برای سفر شما اضافه شد!`, 'success');
    }
    
    return points;
}

// تابع اصلی برای بارگذاری صفحه
window.onload = function() {
    // اضافه کردن استایل‌ها
    addAdditionalStyles();
    
    // ایجاد عناصر ضروری اگر وجود ندارند
    createRequiredElements();
    
    // بارگذاری نقشه
    initMap();
    checkUserLoginStatus();
    
    // مدیریت منوی موبایل
    setupMobileMenu();
    
    // تنظیم رویدادها و المنت‌ها
    setupEventListeners();
    
    // راه‌اندازی سیستم
    initializeSystem();
};

function setupEventListeners() {
    // دکمه شروع استفاده
    const startUsingBtn = document.getElementById('start-using-btn');
    if (startUsingBtn) {
        startUsingBtn.addEventListener('click', () => {
            const welcomePage = document.getElementById('welcome-page');
            const mainHeader = document.getElementById('main-header');
            const mainContainer = document.getElementById('main-container');
            const mainFooter = document.getElementById('main-footer');
            
            if (welcomePage) welcomePage.style.display = 'none';
            if (mainHeader) mainHeader.style.display = 'block';
            if (mainContainer) mainContainer.style.display = 'block';
            if (mainFooter) mainFooter.style.display = 'block';
            showNotification('به اسنپ افغانستان خوش آمدید!', 'success');
        });
    }

    // دکمه اطلاعات بیشتر
    const learnMoreBtn = document.getElementById('learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            showNotification('اسنپ افغانستان اولین سرویس تاکسی اینترنتی در کابل است که با بهترین کیفیت و مناسب‌ترین قیمت خدمات ارائه می‌دهد.', 'info');
        });
    }

    // انتخاب نوع سفر
    document.querySelectorAll('.ride-type').forEach(type => {
        type.addEventListener('click', () => {
            document.querySelectorAll('.ride-type').forEach(t => t.classList.remove('selected'));
            type.classList.add('selected');
            selectedRideType = type.dataset.type;
            updatePrice();
        });
    });

    // تعویض مبدا و مقصد
    const swapLocationsBtn = document.getElementById('swapLocations');
    if (swapLocationsBtn) {
        swapLocationsBtn.addEventListener('click', () => {
            const pickupInput = document.getElementById('pickup');
            const destinationInput = document.getElementById('destination');
            
            if (!destinationInput || !destinationInput.value) {
                showNotification('لطفاً ابتدا مقصد را وارد کنید', 'error');
                return;
            }
            
            const pickupValue = pickupInput.value;
            const destinationValue = destinationInput.value;
            
            pickupInput.value = destinationValue;
            destinationInput.value = pickupValue;
            
            // تعویض مختصات
            const tempCoords = selectedPickupCoords;
            selectedPickupCoords = selectedDestinationCoords;
            selectedDestinationCoords = tempCoords;
            
            // تعویض نشانگرها
            if (pickupMarker && destinationMarker) {
                const tempMarker = pickupMarker;
                pickupMarker = destinationMarker;
                destinationMarker = tempMarker;
                
                // به‌روزرسانی موقعیت نشانگرها
                if (selectedPickupCoords) {
                    pickupMarker.setLatLng(selectedPickupCoords);
                    pickupMarker.setPopupContent(`<b>مبدا:</b> ${destinationValue}`);
                }
                if (selectedDestinationCoords) {
                    destinationMarker.setLatLng(selectedDestinationCoords);
                    destinationMarker.setPopupContent(`<b>مقصد:</b> ${pickupValue}`);
                }
            }
            
            calculateDistanceAndPrice();
            showNotification('مبدا و مقصد با موفقیت تعویض شدند', 'info');
        });
    }

    // فرم درخواست سفر
    const rideForm = document.getElementById('rideForm');
    if (rideForm) {
        rideForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!currentUser) {
                showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
                openAuthModal();
                return;
            }
            
            const pickupInput = document.getElementById('pickup');
            const destinationInput = document.getElementById('destination');
            const pickup = pickupInput?.value.trim();
            const destination = destinationInput?.value.trim();

            if (!pickup || !destination) {
                showNotification('لطفاً مبدا و مقصد را وارد کنید', 'error');
                return;
            }

            if (pickup === destination) {
                showNotification('مبدا و مقصد نمی‌توانند یکسان باشند', 'error');
                return;
            }

            if (currentDistance === 0) {
                showNotification('لطفاً منتظر بمانید تا مسافت محاسبه شود', 'error');
                return;
            }

            // پیدا کردن مختصات
            let pickupCoords = selectedPickupCoords;
            let destinationCoords = selectedDestinationCoords;
            
            if (!pickupCoords) {
                const pickupLocation = kabulData.locations.find(loc => loc.name === pickup);
                pickupCoords = pickupLocation?.coordinates || [34.5250, 69.1800];
            }
            
            if (!destinationCoords) {
                const destinationLocation = kabulData.locations.find(loc => loc.name === destination);
                destinationCoords = destinationLocation?.coordinates || [34.5300, 69.1900];
            }

            // ایجاد سفر
            const trip = new Trip({
                pickup,
                destination,
                pickup_coords: pickupCoords,
                destination_coords: destinationCoords,
                ride_type: selectedRideType,
                distance: currentDistance,
                price: currentPrice,
                user_id: currentUser.id,
                user_name: currentUser.name,
                payment_method: selectedPaymentMethod,
                status: 'requested'
            });

            trip.save();
            currentTripId = trip.id;

            showNotification('سفر شما ثبت شد. در حال یافتن راننده...', 'info');
            startDriverSearch();
        });
    }

    // مدیریت ورود/ثبت‌نام
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', openAuthModal);
    }

    // فرم ورود
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            const user = User.findByCredentials(email, password);
            
            if (!user) {
                showError('loginEmail', 'ایمیل/شماره تماس یا رمز عبور اشتباه است');
                return;
            }
            
            if (user.status !== 'approved') {
                showError('loginEmail', 'حساب کاربری شما هنوز تایید نشده است');
                return;
            }
            
            currentUser = user;
            isAdmin = currentUser.role === 'admin';
            localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
            
            showNotification(`خوش آمدید ${currentUser.name}`, 'success');
            const authModal = document.getElementById('authModal');
            if (authModal) authModal.style.display = 'none';
            if (loginForm) loginForm.reset();
            updateUIAfterLogin();
        });
    }

    // فرم ثبت‌نام
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();
            
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const phone = document.getElementById('registerPhone').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            const userType = document.getElementById('userType').value;
            
            // اعتبارسنجی
            if (name.length < 2) {
                showError('registerName', 'نام باید حداقل ۲ حرف داشته باشد');
                return;
            }
            
            if (!email.includes('@')) {
                showError('registerEmail', 'لطفاً یک ایمیل معتبر وارد کنید');
                return;
            }
            
            if (phone.length < 10) {
                showError('registerPhone', 'لطفاً یک شماره تماس معتبر وارد کنید');
                return;
            }
            
            if (password.length < 6) {
                showError('registerPassword', 'رمز عبور باید حداقل ۶ حرف داشته باشد');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('registerConfirmPassword', 'رمز عبور و تکرار آن مطابقت ندارند');
                return;
            }
            
            if (!userType) {
                showError('userType', 'لطفاً نوع کاربر را انتخاب کنید');
                return;
            }
            
            // بررسی تکراری نبودن ایمیل
            const existingUser = User.getAll().find(u => u.email === email);
            if (existingUser) {
                showError('registerEmail', 'این ایمیل قبلاً ثبت شده است');
                return;
            }
            
            // ایجاد کاربر جدید
            const user = new User({
                id: Date.now(),
                name,
                email,
                phone,
                password,
                role: userType,
                status: 'pending',
                wallet_balance: userType === 'passenger' ? 5000 : 0
            });
            
            user.save();
            
            showNotification('ثبت‌نام شما با موفقیت انجام شد. پس از تایید مدیر می‌توانید وارد شوید.', 'success');
            registerForm.reset();
            
            // تغییر به تب ورود
            document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.form-tab-content').forEach(c => c.classList.remove('active'));
            const loginTab = document.querySelector('.form-tab[data-tab="login"]');
            const loginTabContent = document.getElementById('login-tab');
            if (loginTab) loginTab.classList.add('active');
            if (loginTabContent) loginTabContent.classList.add('active');
        });
    }

    // مدیریت خروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // مدیریت صفحات
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page') + '-page';
            
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
            });
            link.classList.add('active');
            
            const targetPage = document.getElementById(pageId);
            if (targetPage) targetPage.classList.add('active');
            
            // بستن منوی موبایل
            closeMobileMenu();
            
            // بارگذاری داده‌های صفحه
            if (pageId === 'my-trips-page') {
                loadMyTrips();
            } else if (pageId === 'discounts-page') {
                loadDiscounts();
            } else if (pageId === 'profile-page') {
                updateProfilePage();
            } else if (pageId === 'admin-page') {
                loadAdminPanel();
            }
        });
    });

    // بستن مدال‌ها
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    // ذخیره پروفایل
    const saveProfileBtn = document.getElementById('saveProfile');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const name = document.getElementById('editName').value;
            const email = document.getElementById('editEmail').value;
            const phone = document.getElementById('editPhone').value;
            
            if (!name || !email || !phone) {
                showNotification('لطفاً تمام فیلدها را پر کنید', 'error');
                return;
            }
            
            // بررسی تکراری نبودن ایمیل
            const existingUser = User.getAll().find(u => u.email === email && u.id !== currentUser.id);
            if (existingUser) {
                showNotification('این ایمیل قبلاً توسط کاربر دیگری ثبت شده است', 'error');
                return;
            }
            
            const user = User.findById(currentUser.id);
            if (user) {
                user.name = name;
                user.email = email;
                user.phone = phone;
                user.save();
            }
            
            currentUser = user;
            localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
            
            updateUIAfterLogin();
            showNotification('پروفایل با موفقیت به‌روزرسانی شد', 'success');
        });
    }

    // دکمه ثبت امتیاز
    const submitRatingBtn = document.getElementById('submitRating');
    if (submitRatingBtn) {
        submitRatingBtn.addEventListener('click', () => {
            const stars = document.querySelectorAll('.rating-star.active');
            const rating = stars.length;
            const comment = document.getElementById('ratingComment')?.value || '';
            const ratingModal = document.getElementById('ratingModal');
            const tripId = ratingModal ? ratingModal.getAttribute('data-trip-id') : null;
            
            if (rating === 0) {
                showNotification('لطفاً به راننده امتیاز دهید', 'error');
                return;
            }
            
            if (tripId) {
                const trip = Trip.findById(parseInt(tripId));
                if (trip) {
                    trip.rated = true;
                    trip.rating = rating;
                    trip.rating_comment = comment;
                    trip.save();
                    
                    // به‌روزرسانی امتیاز راننده
                    const driver = User.findById(trip.driver_id);
                    if (driver) {
                        // محاسبه میانگین جدید
                        const driverTrips = Trip.getAll().filter(t => t.driver_id === driver.id && t.rated);
                        const totalRating = driverTrips.reduce((sum, t) => sum + t.rating, 0);
                        driver.rating = driverTrips.length > 0 ? (totalRating / driverTrips.length).toFixed(1) : 4.5;
                        driver.save();
                    }
                }
            }
            
            const ratingModalElement = document.getElementById('ratingModal');
            if (ratingModalElement) ratingModalElement.style.display = 'none';
            
            const ratingComment = document.getElementById('ratingComment');
            if (ratingComment) ratingComment.value = '';
            
            document.querySelectorAll('.rating-star').forEach(star => {
                star.classList.remove('active');
            });
            
            showNotification('امتیاز شما با موفقیت ثبت شد', 'success');
            loadMyTrips();
        });
    }

    // شارژ کیف پول
    const chargeWalletBtn = document.getElementById('chargeWalletBtn');
    if (chargeWalletBtn) {
        chargeWalletBtn.addEventListener('click', () => {
            const amount = prompt('مبلغ مورد نظر برای شارژ کیف پول (افغانی):');
            if (amount && !isNaN(amount) && parseInt(amount) > 0) {
                const chargeAmount = parseInt(amount);
                currentUser.wallet_balance += chargeAmount;
                currentUser.save();
                localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
                updateProfilePage();
                showNotification(`کیف پول شما به مبلغ ${chargeAmount} افغانی شارژ شد`, 'success');
            } else if (amount !== null) {
                showNotification('لطفاً مبلغ معتبر وارد کنید', 'error');
            }
        });
    }

    // دکمه گزارش گیری از سفرها
    const generateReportBtn = document.getElementById('generateReport');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
}

function initializeSystem() {
    // محاسبه مسافت هنگام تغییر مقصد
    const destinationInput = document.getElementById('destination');
    if (destinationInput) {
        destinationInput.addEventListener('input', () => {
            setTimeout(calculateDistanceAndPrice, 1000);
        });
    }

    const pickupInput = document.getElementById('pickup');
    if (pickupInput) {
        pickupInput.addEventListener('input', () => {
            setTimeout(calculateDistanceAndPrice, 1000);
        });
    }
}

// مدال‌ها
function openRatingModal(tripId = null) {
    const ratingModal = document.getElementById('ratingModal');
    const ratingStars = document.getElementById('ratingStars');
    
    if (!ratingModal || !ratingStars) return;
    
    const stars = ratingStars.querySelectorAll('.rating-star');
    stars.forEach(star => {
        star.classList.remove('active');
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach(s => {
                if (parseInt(s.getAttribute('data-rating')) <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
    
    ratingModal.style.display = 'flex';
    if (tripId) {
        ratingModal.setAttribute('data-trip-id', tripId);
    }
}

function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (!paymentModal) return;
    
    const paymentDistance = document.getElementById('paymentDistance');
    const paymentPrice = document.getElementById('paymentPrice');
    
    if (paymentDistance) paymentDistance.textContent = `${currentDistance} کیلومتر`;
    if (paymentPrice) paymentPrice.textContent = `${currentPrice} افغانی`;
    
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
        if (method.getAttribute('data-method') === selectedPaymentMethod) {
            method.classList.add('selected');
        }
    });
    
    const walletPayment = document.getElementById('walletPayment');
    if (selectedPaymentMethod === 'wallet') {
        if (walletPayment) walletPayment.style.display = 'block';
        const walletBalance = document.getElementById('walletBalance');
        if (walletBalance && currentUser) walletBalance.textContent = `${currentUser.wallet_balance} افغانی`;
        
        // بررسی موجودی کافی
        if (currentUser && currentUser.wallet_balance < currentPrice) {
            const payWithWalletBtn = document.getElementById('payWithWalletBtn');
            if (payWithWalletBtn) {
                payWithWalletBtn.disabled = true;
                payWithWalletBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> موجودی کافی نیست';
            }
        }
    } else {
        if (walletPayment) walletPayment.style.display = 'none';
    }
    
    paymentModal.style.display = 'flex';
}

function openAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) authModal.style.display = 'flex';
    clearErrors();
}

function startDriverSearch() {
    const submitBtn = document.getElementById('submitBtn');
    const searchingOverlay = document.getElementById('searchingOverlay');
    
    if (submitBtn) submitBtn.disabled = true;
    if (searchingOverlay) searchingOverlay.style.display = 'flex';
    
    let searchTime = 0;
    const searchInterval = setInterval(() => {
        searchTime++;
        const searchingText = document.getElementById('searchingText');
        
        if (searchTime === 3 && searchingText) {
            searchingText.textContent = "در حال بررسی رانندگان موجود...";
        } else if (searchTime === 6 && searchingText) {
            searchingText.textContent = "برقراری ارتباط با راننده...";
        } else if (searchTime === 9) {
            clearInterval(searchInterval);
            findDriver();
        }
    }, 500);
    
    window.searchInterval = searchInterval;
}

function findDriver() {
    const searchingOverlay = document.getElementById('searchingOverlay');
    const submitBtn = document.getElementById('submitBtn');
    
    if (searchingOverlay) searchingOverlay.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
    
    const nearestDriver = findNearestDriver(document.getElementById('pickup')?.value, selectedRideType);
    
    if (!nearestDriver) {
        showNotification('هیچ راننده‌ای در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.', 'error');
        return;
    }
    
    currentDriver = nearestDriver;
    
    // پر کردن معلومات راننده
    const driverAvatar = document.getElementById('driverAvatar');
    if (driverAvatar) driverAvatar.textContent = nearestDriver.name.charAt(0);
    
    const driverName = document.getElementById('driverName');
    if (driverName) driverName.textContent = nearestDriver.name;
    
    const driverRating = document.getElementById('driverRating');
    if (driverRating) driverRating.textContent = nearestDriver.rating;
    
    const driverTrips = document.getElementById('driverTrips');
    if (driverTrips) driverTrips.textContent = `(${nearestDriver.total_trips} سفر)`;
    
    const carModel = document.getElementById('carModel');
    if (carModel) carModel.textContent = nearestDriver.car_model || '---';
    
    const carColor = document.getElementById('carColor');
    if (carColor) carColor.textContent = nearestDriver.car_color || '---';
    
    const plateNumber = document.getElementById('plateNumber');
    if (plateNumber) plateNumber.textContent = nearestDriver.plate_number || '---';
    
    const eta = document.getElementById('eta');
    if (eta) eta.textContent = nearestDriver.eta;
    
    const distance = document.getElementById('distance');
    if (distance) distance.textContent = nearestDriver.distance;
    
    const price = document.getElementById('price');
    if (price) price.textContent = `${currentPrice} افغانی`;
    
    const driverModal = document.getElementById('driverModal');
    if (driverModal) driverModal.style.display = 'flex';
    showNotification(`راننده ${nearestDriver.name} پیدا شد!`, 'success');
}

function loadSettings() {
    const settings = new Settings();
    
    const appName = document.getElementById('appName');
    const currency = document.getElementById('currency');
    const baseFareEconomy = document.getElementById('baseFareEconomy');
    const baseFareComfort = document.getElementById('baseFareComfort');
    const baseFareBike = document.getElementById('baseFareBike');
    const distanceRate = document.getElementById('distanceRate');
    const driverCommission = document.getElementById('driverCommission');
    const minWalletBalance = document.getElementById('minWalletBalance');
    const maxWalletBalance = document.getElementById('maxWalletBalance');
    const supportPhone = document.getElementById('supportPhone');
    const supportEmail = document.getElementById('supportEmail');
    
    if (appName) appName.value = settings.get('app_name');
    if (currency) currency.value = settings.get('currency');
    if (baseFareEconomy) baseFareEconomy.value = settings.get('base_fare_economy');
    if (baseFareComfort) baseFareComfort.value = settings.get('base_fare_comfort');
    if (baseFareBike) baseFareBike.value = settings.get('base_fare_bike');
    if (distanceRate) distanceRate.value = settings.get('distance_rate');
    if (driverCommission) driverCommission.value = (settings.get('driver_commission') * 100);
    if (minWalletBalance) minWalletBalance.value = settings.get('min_wallet_balance');
    if (maxWalletBalance) maxWalletBalance.value = settings.get('max_wallet_balance');
    if (supportPhone) supportPhone.value = settings.get('support_phone');
    if (supportEmail) supportEmail.value = settings.get('support_email');
}

function generateReport() {
    if (!currentUser) {
        showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
        return;
    }
    
    const trips = Trip.findByUserId(currentUser.id);
    if (trips.length === 0) {
        showNotification('هیچ سفری برای گزارش‌گیری وجود ندارد', 'info');
        return;
    }
    
    const reportData = {
        user: currentUser.name,
        email: currentUser.email,
        total_trips: trips.length,
        total_spent: trips.reduce((sum, trip) => sum + trip.price, 0),
        completed_trips: trips.filter(t => t.status === 'completed').length,
        cancelled_trips: trips.filter(t => t.status === 'cancelled').length,
        average_rating: trips.filter(t => t.rated).length > 0 ? 
            (trips.filter(t => t.rated).reduce((sum, t) => sum + t.rating, 0) / trips.filter(t => t.rated).length).toFixed(1) : 0,
        trips_by_type: {
            economy: trips.filter(t => t.ride_type === 'economy').length,
            comfort: trips.filter(t => t.ride_type === 'comfort').length,
            bike: trips.filter(t => t.ride_type === 'bike').length
        },
        trips_by_payment: {
            cash: trips.filter(t => t.payment_method === 'cash').length,
            wallet: trips.filter(t => t.payment_method === 'wallet').length
        }
    };
    
    const reportText = `
گزارش سفرهای کاربر: ${reportData.user}
ایمیل: ${reportData.email}
تاریخ گزارش: ${new Date().toLocaleDateString('fa-IR')}

=== آمار کلی ===
تعداد کل سفرها: ${reportData.total_trips}
سفرهای تکمیل شده: ${reportData.completed_trips}
سفرهای لغو شده: ${reportData.cancelled_trips}
مجموع هزینه‌ها: ${reportData.total_spent} افغانی
میانگین امتیاز: ${reportData.average_rating}

=== سفرها بر اساس نوع ===
اقتصادی: ${reportData.trips_by_type.economy} سفر
کلاسیک: ${reportData.trips_by_type.comfort} سفر
موتور: ${reportData.trips_by_type.bike} سفر

=== سفرها بر اساس روش پرداخت ===
نقدی: ${reportData.trips_by_payment.cash} سفر
کیف پول: ${reportData.trips_by_payment.wallet} سفر

=== جزئیات سفرها ===
${trips.map((trip, index) => `
سفر ${index + 1}:
  - مبدا: ${trip.pickup}
  - مقصد: ${trip.destination}
  - نوع: ${trip.ride_type === 'economy' ? 'اقتصادی' : trip.ride_type === 'comfort' ? 'کلاسیک' : 'موتور'}
  - مسافت: ${trip.distance} کیلومتر
  - هزینه: ${trip.price} افغانی
  - وضعیت: ${trip.status === 'completed' ? 'تکمیل شده' : trip.status === 'cancelled' ? 'لغو شده' : 'دیگر موارد'}
  - تاریخ: ${new Date(trip.created_at).toLocaleString('fa-IR')}
  ${trip.rated ? `- امتیاز: ${trip.rating}/5` : ''}
`).join('')}
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${themeColors.overlay};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 600px; max-width: 90%; background: ${themeColors.cardBg}; border-radius: 12px; max-height: 80vh; overflow: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="margin: 0; color: ${themeColors.text};">گزارش سفرهای شما</h3>
                <button class="close-modal" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px; overflow-y: auto;">
                <pre style="white-space: pre-wrap; font-family: inherit; background: ${themeColors.inputBg}; padding: 15px; border-radius: 5px; color: ${themeColors.text};">${reportText}</pre>
            </div>
            <div class="modal-footer" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid ${themeColors.border}; display: flex; justify-content: flex-end; gap: 10px;">
                <button class="btn-secondary" onclick="this.closest('.modal').remove()" style="background: ${themeColors.lightGray}; color: ${themeColors.text}; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">بستن</button>
                <button class="btn-primary" onclick="downloadReport('${encodeURIComponent(reportText)}')" style="background: ${themeColors.primary}; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-download"></i> دانلود گزارش
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // بستن مدال
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// اضافه کردن تابع‌های به window object برای دسترسی جهانی
window.replyToTicketNow = replyToTicketNow;
window.downloadReport = downloadReport;
window.closeMobileMenu = closeMobileMenu;
window.logout = logout;
window.openAuthModal = openAuthModal;
window.openRatingModal = openRatingModal;
window.openPaymentModal = openPaymentModal;
window.loadAdminPanel = loadAdminPanel;
window.loadMyTrips = loadMyTrips;
window.loadDiscounts = loadDiscounts;
window.updateProfilePage = updateProfilePage;
window.sendNotificationToUser = sendNotificationToUser;
window.calculateRewardPoints = calculateRewardPoints;