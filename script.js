// تعریف رنگ‌های اصلی سیستم (پالت حرفه‌ای و مدرن - نسخه تاریک)
const themeColors = {
    primary: '#007BBD',
    primaryLight: '#0A3D62',
    primaryDark: '#005A8C',
    secondary: '#FF5722',
    accent: '#E91E63',
    success: '#00A97F',
    warning: '#FFC107',
    danger: '#D32F2F',
    info: '#1976D2',
    text: '#E0E0E0',
    gray: '#9E9E9E',
    lightGray: '#424242',
    bgLight: '#121212',
    border: '#333333',
    white: '#FFFFFF',
    black: '#000000',
    gradientStart: '#007BBD',
    gradientEnd: '#005A8C',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.8)',
    cardBg: '#1E1E1E',
    inputBg: '#2D2D2D',
    tableHeader: '#263238',
    tableRowEven: '#1A1A1A',
    tableRowOdd: '#212121',
    hoverBg: '#2A2A2A',
    disabled: '#555555',
    notificationBg: '#1A237E',
};

// داده‌های اصلی سیستم
const kabulData = {
    locations: [
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
        { name: "سفارت امریکا", coordinates: [34.5350, 69.1833] },
        { name: "سفارت ایران", coordinates: [34.5250, 69.1850] },
        { name: "سفارت پاکستان", coordinates: [34.5200, 69.1870] },
        { name: "سفارت ترکیه", coordinates: [34.5300, 69.1900] },
        { name: "ارگ ریاست جمهوری", coordinates: [34.5250, 69.1800] },
        { name: "وزارت امور خارجه", coordinates: [34.5270, 69.1820] },
        { name: "وزارت داخله", coordinates: [34.5290, 69.1840] },
        { name: "وزارت دفاع", coordinates: [34.5310, 69.1860] },
        { name: "بازار کابل", coordinates: [34.5150, 69.1700] },
        { name: "بازار کارته سخی", coordinates: [34.5160, 69.1725] },
        { name: "بازار شورا", coordinates: [34.5200, 69.1650] },
        { name: "پوهنتون کابل", coordinates: [34.5400, 69.1600] },
        { name: "پوهنتون پولی تخنیک کابل", coordinates: [34.5350, 69.1550] },
        { name: "پوهنتون ابن سینا", coordinates: [34.5450, 69.1500] },
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

// کلاس‌های اصلی
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
}

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
        if (!Array.isArray(notifications)) notifications = [];
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
        if (!Array.isArray(notifications)) return [];
        return notifications
            .filter(n => n.user_id === userId)
            .map(data => new Notification(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    static markAsRead(id) {
        let notifications = storage.get('snapp_notifications');
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
        this.settings = savedSettings && Object.keys(savedSettings).length > 0 ? savedSettings : defaultSettings;
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
}

// تابع‌های کمکی
function showNotification(message, type = 'success') {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
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
    
    let borderColor = themeColors.primary;
    switch(type) {
        case 'success': borderColor = themeColors.success; break;
        case 'error': borderColor = themeColors.danger; break;
        case 'warning': borderColor = themeColors.warning; break;
        case 'info': borderColor = themeColors.info; break;
    }
    
    notification.style.borderRightColor = borderColor;
    notification.textContent = message;
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
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;
    
    let errorElement = document.getElementById(inputId + 'Error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = inputId + 'Error';
        errorElement.className = 'error-message';
        errorElement.style.cssText = `
            color: ${themeColors.danger};
            font-size: 12px;
            margin-top: 5px;
            display: block;
        `;
        inputElement.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    inputElement.style.borderColor = themeColors.danger;
}

// مدیریت نقشه
function initMap() {
    try {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }
        
        map = L.map('map').setView([34.5250, 69.1800], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        addLocationMarkers();
        createDistrictsList();
        enableMapClickSelection();
        
    } catch (error) {
        console.error('Error initializing map:', error);
        showNotification('خطا در بارگذاری نقشه. لطفاً اینترنت خود را بررسی کنید.', 'error');
    }
}

function enableMapClickSelection() {
    if (!map) return;
    
    map.on('click', function(e) {
        openLocationSelectionModal(e.latlng.lat, e.latlng.lng);
    });
}

function openLocationSelectionModal(lat, lng) {
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
        <div class="modal-content" style="width: 400px; background: ${themeColors.cardBg}; border-radius: 12px; max-width: 90%;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="margin: 0; color: ${themeColors.text};">انتخاب مکان</h3>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <p style="margin-bottom: 20px; color: ${themeColors.text};">انتخاب کنید این مکان مبدا باشد یا مقصد:</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button onclick="setPickupLocation('مکان انتخاب شده', [${lat}, ${lng}]); this.closest('.modal').remove(); showNotification('مبدا تنظیم شد', 'success');" style="flex: 1; background: ${themeColors.primary}; color: ${themeColors.white}; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">مبدا</button>
                    <button onclick="setDestinationLocation('مکان انتخاب شده', [${lat}, ${lng}]); this.closest('.modal').remove(); showNotification('مقصد تنظیم شد', 'success');" style="flex: 1; background: ${themeColors.primary}; color: ${themeColors.white}; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">مقصد</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function setPickupLocation(name, coords) {
    const pickupInput = document.getElementById('pickup');
    if (pickupInput) pickupInput.value = name;
    selectedPickupCoords = coords;
    
    if (pickupMarker) pickupMarker.remove();
    
    pickupMarker = L.marker(coords, {
        icon: L.divIcon({
            html: `<div style="background: ${themeColors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.5);"><i class="fas fa-circle"></i></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map).bindPopup(`<b>مبدا:</b> ${name}`);
    
    calculateDistanceAndPrice();
}

function setDestinationLocation(name, coords) {
    const destinationInput = document.getElementById('destination');
    if (destinationInput) destinationInput.value = name;
    selectedDestinationCoords = coords;
    
    if (destinationMarker) destinationMarker.remove();
    
    destinationMarker = L.marker(coords, {
        icon: L.divIcon({
            html: `<div style="background: ${themeColors.accent}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.5);"><i class="fas fa-flag-checkered"></i></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map).bindPopup(`<b>مقصد:</b> ${name}`);
    
    calculateDistanceAndPrice();
}

function addLocationMarkers() {
    if (!map) return;
    
    markers.forEach(marker => marker.remove());
    markers = [];
    
    kabulData.locations.forEach(location => {
        const icon = L.divIcon({
            html: `<div style="background: ${themeColors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marker = L.marker(location.coordinates, { icon })
            .addTo(map)
            .bindPopup(`<b>${location.name}</b><br>
                <button onclick="setPickupLocation('${location.name}', [${location.coordinates[0]}, ${location.coordinates[1]}])" style="background: ${themeColors.primary}; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin: 2px;">مبدا</button>
                <button onclick="setDestinationLocation('${location.name}', [${location.coordinates[0]}, ${location.coordinates[1]}])" style="background: ${themeColors.accent}; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin: 2px;">مقصد</button>`);
        
        markers.push(marker);
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
        
        districtItem.addEventListener('click', () => {
            openDistrictSelectionModal(district);
        });
        
        districtsGrid.appendChild(districtItem);
    });
}

function openDistrictSelectionModal(districtName) {
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
        <div class="modal-content" style="width: 350px; background: ${themeColors.cardBg}; border-radius: 12px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="margin: 0; color: ${themeColors.text};">${districtName}</h3>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <p style="color: ${themeColors.text};">این منطقه را به عنوان چه چیزی انتخاب می‌کنید؟</p>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button onclick="setPickupLocation('${districtName}', null); this.closest('.modal').remove();" style="flex: 1; background: ${themeColors.primary}; color: ${themeColors.white}; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">مبدا</button>
                    <button onclick="setDestinationLocation('${districtName}', null); this.closest('.modal').remove();" style="flex: 1; background: ${themeColors.primary}; color: ${themeColors.white}; border: none; padding: 12px; border-radius: 6px; cursor: pointer;">مقصد</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// محاسبه مسافت و قیمت
function calculateDistanceAndPrice() {
    const pickup = document.getElementById('pickup')?.value;
    const destination = document.getElementById('destination')?.value;
    const tripCalculator = document.getElementById('tripCalculator');
    
    if (!pickup || !destination || !tripCalculator) {
        if (tripCalculator) tripCalculator.style.display = 'none';
        return;
    }
    
    if (selectedPickupCoords && selectedDestinationCoords) {
        currentDistance = calculateDistance(selectedPickupCoords, selectedDestinationCoords);
    } else {
        currentDistance = (Math.random() * 15 + 2).toFixed(1);
    }
    
    const distanceValue = document.getElementById('distanceValue');
    if (distanceValue) distanceValue.textContent = `${currentDistance} کیلومتر`;
    
    tripCalculator.style.display = 'block';
    updatePrice();
}

function calculateDistance(coord1, coord2) {
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    
    const R = 6371;
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
    const settings = new Settings();
    const baseFares = {
        economy: settings.get('base_fare_economy'),
        comfort: settings.get('base_fare_comfort'),
        bike: settings.get('base_fare_bike')
    };
    
    const baseFare = baseFares[selectedRideType] || 50;
    const distanceFare = Math.round(currentDistance * settings.get('distance_rate'));
    currentPrice = baseFare + distanceFare;
    
    const economyPrice = document.getElementById('economyPrice');
    const comfortPrice = document.getElementById('comfortPrice');
    const bikePrice = document.getElementById('bikePrice');
    
    if (economyPrice) economyPrice.textContent = `${baseFares.economy + distanceFare} افغانی`;
    if (comfortPrice) comfortPrice.textContent = `${baseFares.comfort + distanceFare} افغانی`;
    if (bikePrice) bikePrice.textContent = `${baseFares.bike + distanceFare} افغانی`;
    
    const baseFareValue = document.getElementById('baseFareValue');
    const distanceFareValue = document.getElementById('distanceFareValue');
    const totalFareValue = document.getElementById('totalFareValue');
    
    if (baseFareValue) baseFareValue.textContent = `${baseFare} افغانی`;
    if (distanceFareValue) distanceFareValue.textContent = `${distanceFare} افغانی`;
    if (totalFareValue) totalFareValue.textContent = `${currentPrice} افغانی`;
}

// مدیریت کاربران
function checkUserLoginStatus() {
    const savedUser = localStorage.getItem('snapp_current_user');
    if (savedUser) {
        try {
            const userData = JSON.parse(savedUser);
            if (userData && userData.id) {
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
    const adminLink = document.getElementById('adminLink');
    const mobileAdminLink = document.getElementById('mobileAdminLink');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (userProfile) userProfile.style.display = 'flex';
    if (userAvatar && currentUser) {
        userAvatar.textContent = currentUser.name.charAt(0);
        userAvatar.style.backgroundColor = themeColors.primary;
    }
    if (userName && currentUser) userName.textContent = currentUser.name;
    
    if (isAdmin) {
        if (adminLink) adminLink.style.display = 'block';
        if (mobileAdminLink) mobileAdminLink.style.display = 'block';
    }
    
    if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
    if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
    
    updateProfilePage();
}

function updateUIAfterLogout() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfile = document.getElementById('userProfile');
    const adminLink = document.getElementById('adminLink');
    const mobileAdminLink = document.getElementById('mobileAdminLink');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (userProfile) userProfile.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
    if (mobileAdminLink) mobileAdminLink.style.display = 'none';
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

function initializeSampleData() {
    if (storage.get('snapp_users').length === 0) {
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
            }
        ];
        
        sampleUsers.forEach(user => new User(user).save());
    }
    
    if (storage.get('snapp_trips').length === 0) {
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
                created_at: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        
        sampleTrips.forEach(trip => new Trip(trip).save());
    }
    
    if (storage.get('snapp_discounts').length === 0) {
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
            }
        ];
        
        sampleDiscounts.forEach(discount => new Discount(discount).save());
    }
    
    const settings = new Settings();
    if (!settings.get('app_name')) {
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
        const rideTypeText = {
            'economy': 'اقتصادی',
            'comfort': 'کلاسیک',
            'bike': 'موتور'
        }[trip.ride_type] || trip.ride_type;
        
        row.innerHTML = `
            <td style="color: ${themeColors.text};">${date}</td>
            <td style="color: ${themeColors.text};">${trip.pickup}</td>
            <td style="color: ${themeColors.text};">${trip.destination}</td>
            <td style="color: ${themeColors.text};">${rideTypeText}</td>
            <td style="color: ${themeColors.text};">${trip.distance} کیلومتر</td>
            <td style="color: ${themeColors.text};">${trip.price} افغانی</td>
            <td style="color: ${themeColors.text};">${trip.driver_name || '---'}</td>
            <td><span style="background: ${trip.status === 'completed' ? themeColors.success : themeColors.warning}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                ${trip.status === 'completed' ? 'تکمیل شده' : trip.status === 'cancelled' ? 'لغو شده' : 'در حال انجام'}
            </span></td>
            <td>
                ${trip.status === 'completed' && !trip.rated ? 
                  `<button onclick="openRatingModal(${trip.id})" style="background: ${themeColors.success}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">امتیازدهی</button>` : ''}
                <button onclick="viewTripDetails(${trip.id})" style="background: ${themeColors.info}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 5px;">جزئیات</button>
            </td>
        `;
        
        myTripsTable.appendChild(row);
    });
}

function viewTripDetails(tripId) {
    const trip = Trip.findById(tripId);
    if (!trip) return;
    
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
    
    const date = new Date(trip.created_at).toLocaleDateString('fa-IR');
    const rideTypeText = {
        'economy': 'اقتصادی',
        'comfort': 'کلاسیک',
        'bike': 'موتور'
    }[trip.ride_type] || trip.ride_type;
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px; max-width: 90%; background: ${themeColors.cardBg}; border-radius: 12px; max-height: 90%; overflow: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="margin: 0; color: ${themeColors.text};">جزئیات سفر #${trip.id}</h3>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">تاریخ:</label>
                        <span style="color: ${themeColors.text};">${date}</span>
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
                </div>
                ${trip.rating ? `
                <div style="background: ${themeColors.primaryLight}; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <h4 style="margin-bottom: 10px; color: ${themeColors.text};">امتیاز شما</h4>
                    <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                        ${Array.from({length: 5}, (_, i) => `
                            <i class="fas fa-star" style="color: ${i < trip.rating ? themeColors.warning : themeColors.gray};"></i>
                        `).join('')}
                    </div>
                    ${trip.rating_comment ? `<p style="margin: 0; color: ${themeColors.text};">${trip.rating_comment}</p>` : ''}
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
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
        
        discountElement.innerHTML = `
            <div class="discount-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div class="discount-code" style="font-size: 18px; font-weight: bold; color: ${themeColors.primary};">${discount.code}</div>
                <div class="discount-percent" style="font-size: 16px; color: ${themeColors.success};">${discount.percent}% تخفیف</div>
            </div>
            <div class="discount-details" style="margin-bottom: 15px;">
                <div style="color: ${themeColors.text}; margin-bottom: 5px;"><i class="fas fa-calendar-alt" style="color: ${themeColors.primary}; margin-left: 5px;"></i> منقضی: ${expiryDate}</div>
                <div style="color: ${themeColors.text};"><i class="fas fa-users" style="color: ${themeColors.primary}; margin-left: 5px;"></i> استفاده شده: ${discount.used_count} از ${discount.max_uses}</div>
            </div>
            <div class="discount-actions">
                <button onclick="copyDiscountCode('${discount.code}')" style="background: ${themeColors.primaryLight}; color: ${themeColors.primary}; border: 1px solid ${themeColors.primary}; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 14px; width: 100%;">
                    <i class="fas fa-copy"></i> کپی کد
                </button>
            </div>
        `;
        
        discountsList.appendChild(discountElement);
    });
}

function copyDiscountCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showNotification(`کد ${code} با موفقیت کپی شد`, 'success');
    }).catch(err => {
        showNotification('خطا در کپی کردن کد', 'error');
    });
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
    
    const trips = Trip.findByUserId(currentUser.id);
    const totalTripsCount = document.getElementById('totalTripsCount');
    const totalSpentElement = document.getElementById('totalSpent');
    const userRatingElement = document.getElementById('userRating');
    const totalPointsElement = document.getElementById('totalPoints');
    
    if (totalTripsCount) totalTripsCount.textContent = trips.length;
    if (totalSpentElement) totalSpentElement.textContent = `${trips.reduce((sum, trip) => sum + (trip.price || 0), 0).toLocaleString()} افغانی`;
    if (userRatingElement) userRatingElement.textContent = currentUser.rating || 0;
    if (totalPointsElement) totalPointsElement.textContent = trips.reduce((sum, trip) => sum + (trip.reward_points || 0), 0);
    
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
        
        notificationElement.innerHTML = `
            <div style="margin-left: 15px; color: ${notification.read ? themeColors.gray : themeColors.primary}; font-size: 20px;">
                <i class="fas fa-bell${notification.read ? '' : '-slash'}"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: ${themeColors.text}; margin-bottom: 5px;">${notification.title}</div>
                <div style="color: ${themeColors.gray}; font-size: 14px; margin-bottom: 5px;">${notification.message}</div>
                <div style="color: ${themeColors.gray}; font-size: 12px;">${new Date(notification.created_at).toLocaleString('fa-IR')}</div>
            </div>
            <div style="display: flex; gap: 5px;">
                ${!notification.read ? `
                <button onclick="Notification.markAsRead(${notification.id}); loadNotifications();" style="background: none; border: none; color: ${themeColors.gray}; cursor: pointer; padding: 5px; border-radius: 4px;">
                    <i class="fas fa-check"></i>
                </button>
                ` : ''}
                <button onclick="Notification.delete(${notification.id}); loadNotifications();" style="background: none; border: none; color: ${themeColors.gray}; cursor: pointer; padding: 5px; border-radius: 4px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        notificationsList.appendChild(notificationElement);
    });
}

// ایجاد استایل‌ها
function addAdditionalStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
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
        
        .card {
            background: ${themeColors.cardBg};
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border: 1px solid ${themeColors.border};
        }
        
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
        
        .hamburger {
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            color: ${themeColors.white}; /* رنگ سفید برای منوی همبرگر */
            cursor: pointer;
            padding: 10px;
        }
        
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
        
        @media (max-width: 768px) {
            .hamburger {
                display: block;
            }
            
            .desktop-nav {
                display: none;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

// ایجاد عناصر ضروری
function createRequiredElements() {
    if (!document.getElementById('notification')) {
        const notification = document.createElement('div');
        notification.id = 'notification';
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
    
    if (!document.getElementById('mobileMenu')) {
        const mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobileMenu';
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-header">
                <h3 style="color: ${themeColors.text};">منو</h3>
                <button onclick="closeMobileMenu()" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
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
            </div>
        `;
        document.body.appendChild(mobileMenu);
    }
    
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
            color: ${themeColors.white};
            cursor: pointer;
            padding: 10px;
        `;
        
        const header = document.querySelector('header');
        if (header) {
            const headerContent = header.querySelector('.header-content');
            if (headerContent) {
                headerContent.insertBefore(hamburger, headerContent.firstChild);
            }
        }
    }
}

function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('overlay');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }
    
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.id === 'mobileLoginBtn') {
                openAuthModal();
            } else if (this.id === 'mobileLogoutBtn') {
                logout();
            } else {
                const pageId = this.getAttribute('data-page') + '-page';
                document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                const targetPage = document.getElementById(pageId);
                if (targetPage) targetPage.classList.add('active');
                
                if (pageId === 'my-trips-page') loadMyTrips();
                else if (pageId === 'discounts-page') loadDiscounts();
                else if (pageId === 'profile-page') updateProfilePage();
                else if (pageId === 'admin-page') loadAdminPanel();
            }
            closeMobileMenu();
        });
    });
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// رویدادها
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
            
            if (!pickupInput || !destinationInput) return;
            
            const pickupValue = pickupInput.value;
            const destinationValue = destinationInput.value;
            
            pickupInput.value = destinationValue;
            destinationInput.value = pickupValue;
            
            const tempCoords = selectedPickupCoords;
            selectedPickupCoords = selectedDestinationCoords;
            selectedDestinationCoords = tempCoords;
            
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
            
            const pickup = document.getElementById('pickup')?.value;
            const destination = document.getElementById('destination')?.value;
            
            if (!pickup || !destination) {
                showNotification('لطفاً مبدا و مقصد را وارد کنید', 'error');
                return;
            }
            
            if (pickup === destination) {
                showNotification('مبدا و مقصد نمی‌توانند یکسان باشند', 'error');
                return;
            }
            
            showNotification('سفر شما ثبت شد. در حال یافتن راننده...', 'info');
            startDriverSearch();
        });
    }

    // مدیریت ورود/ثبت‌نام
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) loginBtn.addEventListener('click', openAuthModal);
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    // فرم ورود
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();
            
            const email = document.getElementById('loginEmail').value;
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
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            const userType = document.getElementById('userType').value;
            
            if (name.length < 2) {
                showError('registerName', 'نام باید حداقل ۲ حرف داشته باشد');
                return;
            }
            
            if (!email.includes('@')) {
                showError('registerEmail', 'لطفاً یک ایمیل معتبر وارد کنید');
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
            
            const existingUser = User.getAll().find(u => u.email === email);
            if (existingUser) {
                showError('registerEmail', 'این ایمیل قبلاً ثبت شده است');
                return;
            }
            
            const user = new User({
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
            const loginTab = document.querySelector('.form-tab[data-tab="login"]');
            const loginTabContent = document.getElementById('login-tab');
            if (loginTab) loginTab.click();
        });
    }

    // مدیریت صفحات
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page') + '-page';
            
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const targetPage = document.getElementById(pageId);
            if (targetPage) targetPage.classList.add('active');
            
            if (pageId === 'my-trips-page') loadMyTrips();
            else if (pageId === 'discounts-page') loadDiscounts();
            else if (pageId === 'profile-page') updateProfilePage();
            else if (pageId === 'admin-page') loadAdminPanel();
        });
    });

    // بستن مدال‌ها
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
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

    // تغییر تب‌های فرم
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.form-tab-content').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tabId + '-tab').classList.add('active');
        });
    });
}

function initializeSystem() {
    const destinationInput = document.getElementById('destination');
    const pickupInput = document.getElementById('pickup');
    
    if (destinationInput) {
        destinationInput.addEventListener('input', calculateDistanceAndPrice);
    }
    
    if (pickupInput) {
        pickupInput.addEventListener('input', calculateDistanceAndPrice);
    }
}

// مدال‌ها
function openRatingModal(tripId = null) {
    const ratingModal = document.getElementById('ratingModal');
    if (!ratingModal) return;
    
    ratingModal.style.display = 'flex';
    if (tripId) {
        ratingModal.setAttribute('data-trip-id', tripId);
    }
    
    const stars = ratingModal.querySelectorAll('.rating-star');
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
    
    const submitRatingBtn = ratingModal.querySelector('#submitRating');
    if (submitRatingBtn) {
        submitRatingBtn.onclick = function() {
            const stars = ratingModal.querySelectorAll('.rating-star.active');
            const rating = stars.length;
            const comment = ratingModal.querySelector('#ratingComment')?.value || '';
            const tripId = ratingModal.getAttribute('data-trip-id');
            
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
                }
            }
            
            ratingModal.style.display = 'none';
            ratingModal.querySelector('#ratingComment').value = '';
            ratingModal.querySelectorAll('.rating-star').forEach(s => s.classList.remove('active'));
            showNotification('امتیاز شما با موفقیت ثبت شد', 'success');
            loadMyTrips();
        };
    }
}

function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (!paymentModal) return;
    
    const paymentDistance = document.getElementById('paymentDistance');
    const paymentPrice = document.getElementById('paymentPrice');
    
    if (paymentDistance) paymentDistance.textContent = `${currentDistance} کیلومتر`;
    if (paymentPrice) paymentPrice.textContent = `${currentPrice} افغانی`;
    
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
        
        if (searchTime >= 9) {
            clearInterval(searchInterval);
            if (searchingOverlay) searchingOverlay.style.display = 'none';
            if (submitBtn) submitBtn.disabled = false;
            
            // یافتن راننده شبیه‌سازی شده
            const drivers = User.getAll().filter(user => 
                user.role === 'driver' && 
                user.status === 'approved' && 
                user.driver_status === 'active'
            );
            
            if (drivers.length > 0) {
                const driver = drivers[0];
                showNotification(`راننده ${driver.name} پیدا شد!`, 'success');
                openDriverFoundModal(driver);
            } else {
                showNotification('هیچ راننده‌ای در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.', 'error');
            }
        } else if (searchingText) {
            searchingText.textContent = "در حال یافتن نزدیک‌ترین راننده" + ".".repeat(searchTime % 4);
        }
    }, 500);
}

function openDriverFoundModal(driver) {
    const driverModal = document.getElementById('driverModal');
    if (!driverModal) return;
    
    document.getElementById('driverAvatar').textContent = driver.name.charAt(0);
    document.getElementById('driverName').textContent = driver.name;
    document.getElementById('driverRating').textContent = driver.rating;
    document.getElementById('carModel').textContent = driver.car_model || '---';
    document.getElementById('carColor').textContent = driver.car_color || '---';
    document.getElementById('plateNumber').textContent = driver.plate_number || '---';
    document.getElementById('price').textContent = `${currentPrice} افغانی`;
    
    driverModal.style.display = 'flex';
}

// پنل مدیریت
function loadAdminPanel() {
    if (!isAdmin) {
        showNotification('شما دسترسی به پنل مدیریت ندارید', 'error');
        return;
    }
    
    const users = User.getAll();
    const trips = Trip.getAll();
    
    const totalTripsElement = document.getElementById('totalTrips');
    const activeUsersElement = document.getElementById('activeUsers');
    const totalDriversElement = document.getElementById('totalDrivers');
    const totalRevenueElement = document.getElementById('totalRevenue');
    
    if (totalTripsElement) totalTripsElement.textContent = trips.length;
    if (activeUsersElement) activeUsersElement.textContent = users.filter(u => u.status === 'approved').length;
    if (totalDriversElement) totalDriversElement.textContent = users.filter(u => u.role === 'driver' && u.status === 'approved').length;
    if (totalRevenueElement) totalRevenueElement.textContent = `${trips.reduce((sum, trip) => sum + (trip.price || 0), 0)} افغانی`;
}

// راه‌اندازی اصلی
window.onload = function() {
    addAdditionalStyles();
    createRequiredElements();
    initMap();
    checkUserLoginStatus();
    setupMobileMenu();
    setupEventListeners();
    initializeSystem();
};

// اضافه کردن توابع به window object
window.closeMobileMenu = closeMobileMenu;
window.logout = logout;
window.openAuthModal = openAuthModal;
window.openRatingModal = openRatingModal;
window.openPaymentModal = openPaymentModal;
window.loadAdminPanel = loadAdminPanel;
window.loadMyTrips = loadMyTrips;
window.loadDiscounts = loadDiscounts;
window.updateProfilePage = updateProfilePage;
window.viewTripDetails = viewTripDetails;
window.copyDiscountCode = copyDiscountCode;
window.setPickupLocation = setPickupLocation;
window.setDestinationLocation = setDestinationLocation;