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
        if (!Array.isArray(users)) users = [];
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

    static getDrivers() {
        return storage.get('snapp_users')
            .filter(u => u.role === 'driver' && u.status === 'approved')
            .map(data => new User(data));
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
        if (!Array.isArray(trips)) trips = [];
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
        if (!Array.isArray(trips)) return [];
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
        if (!Array.isArray(discounts)) discounts = [];
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
        if (!Array.isArray(discounts)) return [];
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
        if (!Array.isArray(tickets)) return [];
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
    
    if (coords && map) {
        pickupMarker = L.marker(coords, {
            icon: L.divIcon({
                html: `<div style="background: ${themeColors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.5);"><i class="fas fa-circle"></i></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(map).bindPopup(`<b>مبدا:</b> ${name}`);
    }
    
    calculateDistanceAndPrice();
}

function setDestinationLocation(name, coords) {
    const destinationInput = document.getElementById('destination');
    if (destinationInput) destinationInput.value = name;
    selectedDestinationCoords = coords;
    
    if (destinationMarker) destinationMarker.remove();
    
    if (coords && map) {
        destinationMarker = L.marker(coords, {
            icon: L.divIcon({
                html: `<div style="background: ${themeColors.accent}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.5);"><i class="fas fa-flag-checkered"></i></div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(map).bindPopup(`<b>مقصد:</b> ${name}`);
    }
    
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
                return true;
            }
        } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('snapp_current_user');
        }
    }
    return false;
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
    } else {
        if (adminLink) adminLink.style.display = 'none';
        if (mobileAdminLink) mobileAdminLink.style.display = 'none';
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
            },
            {
                id: 4,
                name: 'سارا احمدی',
                email: 'sara@example.com',
                phone: '0700333444',
                password: '123456',
                role: 'passenger',
                status: 'approved',
                wallet_balance: 7500,
                reward_points: 85,
                created_at: new Date().toISOString()
            },
            {
                id: 5,
                name: 'علی رحیمی',
                email: 'ali@example.com',
                phone: '0700777888',
                password: '123456',
                role: 'driver',
                status: 'approved',
                vehicle_type: 'bike',
                car_model: 'موتورسیکلت',
                car_color: 'سیاه',
                plate_number: 'کابل ۵۶۷۸',
                driver_license: 'DL789012',
                driver_status: 'active',
                rating: 4.9,
                total_trips: 89,
                current_location: [34.5300, 69.1750],
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
            },
            {
                id: 2,
                pickup: 'شهر نو',
                destination: 'دشت برچی',
                pickup_coords: [34.5320, 69.1680],
                destination_coords: [34.4700, 69.1400],
                ride_type: 'comfort',
                distance: 8.7,
                price: 167,
                status: 'completed',
                user_id: 4,
                user_name: 'سارا احمدی',
                driver_id: 5,
                driver_name: 'علی رحیمی',
                payment_method: 'wallet',
                rated: true,
                rating: 4,
                rating_comment: 'سفر خوبی بود',
                reward_points: 12,
                created_at: new Date(Date.now() - 172800000).toISOString()
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
            },
            {
                id: 2,
                code: 'WELCOME10',
                percent: 10,
                expiry_date: futureDate.toISOString(),
                max_uses: 200,
                used_count: 45
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
    if (!currentUser) {
        showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
        return;
    }
    
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
        
        let statusBadge = '';
        let statusColor = themeColors.warning;
        
        switch(trip.status) {
            case 'completed':
                statusBadge = 'تکمیل شده';
                statusColor = themeColors.success;
                break;
            case 'cancelled':
                statusBadge = 'لغو شده';
                statusColor = themeColors.danger;
                break;
            case 'in_progress':
                statusBadge = 'در حال انجام';
                statusColor = themeColors.info;
                break;
            case 'requested':
                statusBadge = 'درخواست شده';
                statusColor = themeColors.warning;
                break;
            default:
                statusBadge = trip.status;
        }
        
        row.innerHTML = `
            <td style="color: ${themeColors.text};">${date}</td>
            <td style="color: ${themeColors.text};">${trip.pickup}</td>
            <td style="color: ${themeColors.text};">${trip.destination}</td>
            <td style="color: ${themeColors.text};">${rideTypeText}</td>
            <td style="color: ${themeColors.text};">${trip.distance} کیلومتر</td>
            <td style="color: ${themeColors.text};">${trip.price} افغانی</td>
            <td style="color: ${themeColors.text};">${trip.driver_name || '---'}</td>
            <td><span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                ${statusBadge}
            </span></td>
            <td>
                ${trip.status === 'completed' && !trip.rated ? 
                  `<button onclick="openRatingModal(${trip.id})" style="background: ${themeColors.success}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 5px;">امتیازدهی</button>` : ''}
                <button onclick="viewTripDetails(${trip.id})" style="background: ${themeColors.info}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">جزئیات</button>
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
    
    let statusText = '';
    switch(trip.status) {
        case 'completed': statusText = 'تکمیل شده'; break;
        case 'cancelled': statusText = 'لغو شده'; break;
        case 'in_progress': statusText = 'در حال انجام'; break;
        case 'requested': statusText = 'درخواست شده'; break;
        default: statusText = trip.status;
    }
    
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
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">وضعیت:</label>
                        <span style="color: ${themeColors.text};">${statusText}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">نوع سفر:</label>
                        <span style="color: ${themeColors.text};">${rideTypeText}</span>
                    </div>
                    <div class="detail-item">
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">روش پرداخت:</label>
                        <span style="color: ${themeColors.text};">${trip.payment_method === 'cash' ? 'نقدی' : 'کیف پول'}</span>
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
                        <label style="color: ${themeColors.gray}; display: block; margin-bottom: 5px;">امتیاز کسب شده:</label>
                        <span style="color: ${themeColors.text};">${trip.reward_points} امتیاز</span>
                    </div>
                </div>
                ${trip.rating ? `
                <div style="background: ${themeColors.primaryLight}; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <h4 style="margin-bottom: 10px; color: ${themeColors.text};">امتیاز شما</h4>
                    <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                        ${Array.from({length: 5}, (_, i) => `
                            <i class="fas fa-star" style="color: ${i < trip.rating ? themeColors.warning : themeColors.gray};"></i>
                        `).join('')}
                        <span style="color: ${themeColors.text}; margin-right: 10px;">(${trip.rating.toFixed(1)})</span>
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
            transition: all 0.3s;
        `;
        
        discountElement.onmouseenter = () => {
            discountElement.style.transform = 'translateY(-5px)';
            discountElement.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        };
        
        discountElement.onmouseleave = () => {
            discountElement.style.transform = 'translateY(0)';
            discountElement.style.boxShadow = 'none';
        };
        
        const expiryDate = new Date(discount.expiry_date).toLocaleDateString('fa-IR');
        const remainingUses = discount.max_uses - discount.used_count;
        
        discountElement.innerHTML = `
            <div class="discount-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div class="discount-code" style="font-size: 18px; font-weight: bold; color: ${themeColors.primary};">${discount.code}</div>
                <div class="discount-percent" style="font-size: 16px; color: ${themeColors.success};">${discount.percent}% تخفیف</div>
            </div>
            <div class="discount-details" style="margin-bottom: 15px;">
                <div style="color: ${themeColors.text}; margin-bottom: 5px;">
                    <i class="fas fa-calendar-alt" style="color: ${themeColors.primary}; margin-left: 5px;"></i> 
                    منقضی: ${expiryDate}
                </div>
                <div style="color: ${themeColors.text}; margin-bottom: 5px;">
                    <i class="fas fa-users" style="color: ${themeColors.primary}; margin-left: 5px;"></i> 
                    استفاده شده: ${discount.used_count} از ${discount.max_uses}
                </div>
                <div style="color: ${remainingUses < 10 ? themeColors.danger : themeColors.success};">
                    <i class="fas fa-exclamation-circle" style="margin-left: 5px;"></i>
                    ${remainingUses} بار باقی مانده
                </div>
            </div>
            <div class="discount-actions">
                <button onclick="copyDiscountCode('${discount.code}')" style="background: ${themeColors.primaryLight}; color: ${themeColors.primary}; border: 1px solid ${themeColors.primary}; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 14px; width: 100%; transition: all 0.3s;" 
                onmouseenter="this.style.backgroundColor='${themeColors.primary}'; this.style.color='white';"
                onmouseleave="this.style.backgroundColor='${themeColors.primaryLight}'; this.style.color='${themeColors.primary}';">
                    <i class="fas fa-copy"></i> کپی کد تخفیف
                </button>
            </div>
        `;
        
        discountsList.appendChild(discountElement);
    });
}

function copyDiscountCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showNotification(`کد تخفیف ${code} با موفقیت کپی شد`, 'success');
    }).catch(err => {
        showNotification('خطا در کپی کردن کد تخفیف', 'error');
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
            cursor: pointer;
        `;
        
        notificationElement.onclick = () => {
            if (!notification.read) {
                Notification.markAsRead(notification.id);
                loadNotifications();
            }
        };
        
        notificationElement.onmouseenter = () => {
            notificationElement.style.backgroundColor = notification.read ? themeColors.hoverBg : themeColors.primaryDark;
        };
        
        notificationElement.onmouseleave = () => {
            notificationElement.style.backgroundColor = notification.read ? themeColors.cardBg : themeColors.primaryLight;
        };
        
        let icon = 'fa-bell';
        let iconColor = themeColors.primary;
        
        switch(notification.type) {
            case 'success':
                icon = 'fa-check-circle';
                iconColor = themeColors.success;
                break;
            case 'error':
                icon = 'fa-exclamation-circle';
                iconColor = themeColors.danger;
                break;
            case 'warning':
                icon = 'fa-exclamation-triangle';
                iconColor = themeColors.warning;
                break;
            case 'info':
                icon = 'fa-info-circle';
                iconColor = themeColors.info;
                break;
        }
        
        notificationElement.innerHTML = `
            <div style="margin-left: 15px; color: ${iconColor}; font-size: 20px;">
                <i class="fas ${icon}"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: ${themeColors.text}; margin-bottom: 5px;">${notification.title}</div>
                <div style="color: ${themeColors.gray}; font-size: 14px; margin-bottom: 5px;">${notification.message}</div>
                <div style="color: ${themeColors.gray}; font-size: 12px;">${new Date(notification.created_at).toLocaleString('fa-IR')}</div>
            </div>
            <div style="display: flex; gap: 5px;">
                ${!notification.read ? `
                <button onclick="event.stopPropagation(); Notification.markAsRead(${notification.id}); loadNotifications();" style="background: none; border: none; color: ${themeColors.success}; cursor: pointer; padding: 5px; border-radius: 4px;" title="علامت به عنوان خوانده شده">
                    <i class="fas fa-check"></i>
                </button>
                ` : ''}
                <button onclick="event.stopPropagation(); Notification.delete(${notification.id}); loadNotifications();" style="background: none; border: none; color: ${themeColors.danger}; cursor: pointer; padding: 5px; border-radius: 4px;" title="حذف">
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
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
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
        
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
            }
        }
        
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
            direction: rtl;
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
            transition: all 0.3s;
        }
        
        .user-profile:hover {
            background: ${themeColors.primary};
            color: ${themeColors.white};
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
            animation: fadeIn 0.3s ease;
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
            transition: all 0.3s;
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
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .ride-type.selected {
            border-color: ${themeColors.primary};
            background: ${themeColors.primaryLight};
            animation: pulse 0.5s ease;
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
            background: ${themeColors.overlay};
            z-index: 1000;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        .modal.active {
            display: flex;
        }
        
        .modal-content {
            background: ${themeColors.cardBg};
            border-radius: 12px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            animation: modalSlideIn 0.3s ease;
            position: relative;
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
        
        .tab-container {
            display: flex;
            border-bottom: 1px solid ${themeColors.border};
            margin-bottom: 20px;
        }
        
        .tab {
            padding: 10px 20px;
            cursor: pointer;
            color: ${themeColors.text};
            border-bottom: 2px solid transparent;
            transition: all 0.3s;
        }
        
        .tab.active {
            color: ${themeColors.primary};
            border-bottom: 2px solid ${themeColors.primary};
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .rating-stars {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
        }
        
        .rating-star {
            font-size: 30px;
            color: ${themeColors.gray};
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .rating-star:hover,
        .rating-star.active {
            color: ${themeColors.warning};
            transform: scale(1.2);
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, ${themeColors.primaryDark}, ${themeColors.primary});
            color: ${themeColors.white};
            padding: 20px;
            border-radius: 12px;
            text-align: center;
        }
        
        .stat-card h3 {
            font-size: 14px;
            margin-bottom: 10px;
            opacity: 0.9;
        }
        
        .stat-card .value {
            font-size: 32px;
            font-weight: bold;
        }
        
        @media (max-width: 768px) {
            .hamburger {
                display: block;
            }
            
            .desktop-nav {
                display: none;
            }
            
            .ride-types {
                grid-template-columns: 1fr;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .modal-content {
                width: 95% !important;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

// ایجاد عناصر ضروری
function createRequiredElements() {
    // ایجاد عناصر مدال‌ها
    createAuthModal();
    createPaymentModal();
    createRatingModal();
    createDriverModal();
    createSearchingOverlay();
    
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
            <div class="mobile-menu-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid ${themeColors.border};">
                <h3 style="color: ${themeColors.text}; margin: 0;">منو</h3>
                <button onclick="closeMobileMenu()" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
            </div>
            <div class="mobile-nav" style="display: flex; flex-direction: column; gap: 10px;">
                <a href="#" class="nav-link active" data-page="home" style="padding: 12px 15px; border-radius: 8px; text-decoration: none; color: ${themeColors.text}; background: ${themeColors.hoverBg};">
                    <i class="fas fa-home" style="margin-left: 10px;"></i> صفحه اصلی
                </a>
                <a href="#" class="nav-link" data-page="my-trips" style="padding: 12px 15px; border-radius: 8px; text-decoration: none; color: ${themeColors.text}; background: ${themeColors.hoverBg};">
                    <i class="fas fa-road" style="margin-left: 10px;"></i> سفرهای من
                </a>
                <a href="#" class="nav-link" data-page="discounts" style="padding: 12px 15px; border-radius: 8px; text-decoration: none; color: ${themeColors.text}; background: ${themeColors.hoverBg};">
                    <i class="fas fa-tag" style="margin-left: 10px;"></i> تخفیف‌ها
                </a>
                <a href="#" class="nav-link" data-page="profile" style="padding: 12px 15px; border-radius: 8px; text-decoration: none; color: ${themeColors.text}; background: ${themeColors.hoverBg};">
                    <i class="fas fa-user" style="margin-left: 10px;"></i> پروفایل
                </a>
                <a href="#" class="nav-link" id="mobileAdminLink" data-page="admin" style="padding: 12px 15px; border-radius: 8px; text-decoration: none; color: ${themeColors.text}; background: ${themeColors.hoverBg}; display: none;">
                    <i class="fas fa-cog" style="margin-left: 10px;"></i> پنل مدیریت
                </a>
                <a href="#" id="mobileLoginBtn" style="padding: 12px 15px; border-radius: 8px; text-decoration: none; color: ${themeColors.primary}; background: ${themeColors.primaryLight}; display: none;">
                    <i class="fas fa-sign-in-alt" style="margin-left: 10px;"></i> ورود / ثبت‌نام
                </a>
                <a href="#" id="mobileLogoutBtn" style="padding: 12px 15px; border-radius: 8px; text-decoration: none; color: ${themeColors.danger}; background: ${themeColors.hoverBg}; display: none;">
                    <i class="fas fa-sign-out-alt" style="margin-left: 10px;"></i> خروج
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
            color: ${themeColors.text};
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

function createAuthModal() {
    if (!document.getElementById('authModal')) {
        const authModal = document.createElement('div');
        authModal.id = 'authModal';
        authModal.className = 'modal';
        authModal.innerHTML = `
            <div class="modal-content" style="width: 400px; max-width: 90%;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                    <h3 style="margin: 0; color: ${themeColors.text};">ورود / ثبت‌نام</h3>
                    <button class="close-modal" onclick="closeModal('authModal')" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <div class="tab-container">
                        <div class="tab active" data-tab="login" onclick="switchTab('login')" style="flex: 1; text-align: center; padding: 10px; cursor: pointer; border-bottom: 2px solid ${themeColors.primary}; color: ${themeColors.primary};">ورود</div>
                        <div class="tab" data-tab="register" onclick="switchTab('register')" style="flex: 1; text-align: center; padding: 10px; cursor: pointer; border-bottom: 2px solid ${themeColors.border}; color: ${themeColors.text};">ثبت‌نام</div>
                    </div>
                    
                    <div id="login-tab" class="tab-content active">
                        <form id="loginForm">
                            <div class="form-group">
                                <label for="loginEmail">ایمیل یا شماره تماس</label>
                                <input type="text" id="loginEmail" class="form-input" placeholder="ایمیل یا شماره تماس خود را وارد کنید" required>
                                <div class="error-message" id="loginEmailError"></div>
                            </div>
                            <div class="form-group">
                                <label for="loginPassword">رمز عبور</label>
                                <input type="password" id="loginPassword" class="form-input" placeholder="رمز عبور خود را وارد کنید" required>
                                <div class="error-message" id="loginPasswordError"></div>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px; padding: 12px;">
                                <i class="fas fa-sign-in-alt" style="margin-left: 8px;"></i> ورود به حساب
                            </button>
                        </form>
                    </div>
                    
                    <div id="register-tab" class="tab-content">
                        <form id="registerForm">
                            <div class="form-group">
                                <label for="registerName">نام کامل</label>
                                <input type="text" id="registerName" class="form-input" placeholder="نام و نام خانوادگی خود را وارد کنید" required>
                                <div class="error-message" id="registerNameError"></div>
                            </div>
                            <div class="form-group">
                                <label for="registerEmail">ایمیل</label>
                                <input type="email" id="registerEmail" class="form-input" placeholder="ایمیل خود را وارد کنید" required>
                                <div class="error-message" id="registerEmailError"></div>
                            </div>
                            <div class="form-group">
                                <label for="registerPhone">شماره تماس</label>
                                <input type="tel" id="registerPhone" class="form-input" placeholder="شماره تماس خود را وارد کنید" required>
                                <div class="error-message" id="registerPhoneError"></div>
                            </div>
                            <div class="form-group">
                                <label for="userType">نوع حساب</label>
                                <select id="userType" class="form-input" required>
                                    <option value="passenger">مسافر</option>
                                    <option value="driver">راننده</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="registerPassword">رمز عبور</label>
                                <input type="password" id="registerPassword" class="form-input" placeholder="رمز عبور خود را وارد کنید" required>
                                <div class="error-message" id="registerPasswordError"></div>
                            </div>
                            <div class="form-group">
                                <label for="registerConfirmPassword">تکرار رمز عبور</label>
                                <input type="password" id="registerConfirmPassword" class="form-input" placeholder="رمز عبور خود را مجدداً وارد کنید" required>
                                <div class="error-message" id="registerConfirmPasswordError"></div>
                            </div>
                            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px; padding: 12px;">
                                <i class="fas fa-user-plus" style="margin-left: 8px;"></i> ایجاد حساب کاربری
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(authModal);
    }
}

function createPaymentModal() {
    if (!document.getElementById('paymentModal')) {
        const paymentModal = document.createElement('div');
        paymentModal.id = 'paymentModal';
        paymentModal.className = 'modal';
        paymentModal.innerHTML = `
            <div class="modal-content" style="width: 400px; max-width: 90%;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                    <h3 style="margin: 0; color: ${themeColors.text};">پرداخت</h3>
                    <button class="close-modal" onclick="closeModal('paymentModal')" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <div class="form-group">
                        <p style="color: ${themeColors.text}; margin-bottom: 20px; text-align: center;">مبلغ قابل پرداخت</p>
                        <h2 style="text-align: center; color: ${themeColors.primary}; margin-bottom: 30px;"><span id="paymentPrice">0</span> افغانی</h2>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                            <span style="color: ${themeColors.gray};">مسافت:</span>
                            <span style="color: ${themeColors.text};" id="paymentDistance">0 کیلومتر</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 10px; color: ${themeColors.text};">روش پرداخت</label>
                        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                            <button onclick="selectPaymentMethod('cash')" id="cashPayment" class="payment-method" style="flex: 1; padding: 12px; border: 2px solid ${themeColors.primary}; border-radius: 8px; background: ${themeColors.primaryLight}; color: ${themeColors.primary}; cursor: pointer;">
                                <i class="fas fa-money-bill-wave" style="margin-left: 5px;"></i> نقدی
                            </button>
                            <button onclick="selectPaymentMethod('wallet')" id="walletPayment" class="payment-method" style="flex: 1; padding: 12px; border: 2px solid ${themeColors.border}; border-radius: 8px; background: ${themeColors.cardBg}; color: ${themeColors.text}; cursor: pointer;">
                                <i class="fas fa-wallet" style="margin-left: 5px;"></i> کیف پول
                            </button>
                        </div>
                    </div>
                    <button onclick="confirmPayment()" class="btn btn-primary" style="width: 100%; padding: 12px;">
                        <i class="fas fa-check-circle" style="margin-left: 8px;"></i> تایید و پرداخت
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(paymentModal);
    }
}

function createRatingModal() {
    if (!document.getElementById('ratingModal')) {
        const ratingModal = document.createElement('div');
        ratingModal.id = 'ratingModal';
        ratingModal.className = 'modal';
        ratingModal.innerHTML = `
            <div class="modal-content" style="width: 400px; max-width: 90%;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                    <h3 style="margin: 0; color: ${themeColors.text};">امتیازدهی به سفر</h3>
                    <button class="close-modal" onclick="closeModal('ratingModal')" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px; text-align: center;">
                    <p style="color: ${themeColors.text}; margin-bottom: 20px;">لطفاً به راننده خود امتیاز دهید</p>
                    <div class="rating-stars">
                        <i class="fas fa-star rating-star" data-rating="1"></i>
                        <i class="fas fa-star rating-star" data-rating="2"></i>
                        <i class="fas fa-star rating-star" data-rating="3"></i>
                        <i class="fas fa-star rating-star" data-rating="4"></i>
                        <i class="fas fa-star rating-star" data-rating="5"></i>
                    </div>
                    <div class="form-group" style="margin-top: 20px;">
                        <label for="ratingComment">نظر شما (اختیاری)</label>
                        <textarea id="ratingComment" class="form-input" placeholder="نظر خود را درباره این سفر بنویسید..." rows="3" style="width: 100%;"></textarea>
                    </div>
                    <button id="submitRating" class="btn btn-primary" style="width: 100%; margin-top: 20px; padding: 12px;">
                        <i class="fas fa-star" style="margin-left: 8px;"></i> ثبت امتیاز
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(ratingModal);
    }
}

function createDriverModal() {
    if (!document.getElementById('driverModal')) {
        const driverModal = document.createElement('div');
        driverModal.id = 'driverModal';
        driverModal.className = 'modal';
        driverModal.innerHTML = `
            <div class="modal-content" style="width: 400px; max-width: 90%;">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid ${themeColors.border};">
                    <h3 style="margin: 0; color: ${themeColors.text};">راننده پیدا شد!</h3>
                    <button class="close-modal" onclick="closeModal('driverModal')" style="background: none; border: none; font-size: 24px; color: ${themeColors.text}; cursor: pointer;">&times;</button>
                </div>
                <div class="modal-body" style="padding: 20px; text-align: center;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: ${themeColors.primary}; color: white; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; margin: 0 auto 20px;" id="driverAvatar">R</div>
                    <h3 style="color: ${themeColors.text}; margin-bottom: 10px;" id="driverName">رحمان علی</h3>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 5px; margin-bottom: 20px;">
                        <i class="fas fa-star" style="color: ${themeColors.warning};"></i>
                        <span style="color: ${themeColors.text};" id="driverRating">4.7</span>
                    </div>
                    <div style="background: ${themeColors.cardBg}; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: ${themeColors.gray};">مدل ماشین:</span>
                            <span style="color: ${themeColors.text};" id="carModel">تویوتا کورولا</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: ${themeColors.gray};">رنگ:</span>
                            <span style="color: ${themeColors.text};" id="carColor">سفید</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: ${themeColors.gray};">پلاک:</span>
                            <span style="color: ${themeColors.text};" id="plateNumber">کابل ۱۲۳۴</span>
                        </div>
                    </div>
                    <div style="background: ${themeColors.primaryLight}; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: ${themeColors.text};">مبلغ سفر:</span>
                            <span style="color: ${themeColors.text}; font-weight: bold; font-size: 18px;" id="price">0 افغانی</span>
                        </div>
                    </div>
                    <button onclick="confirmTrip()" class="btn btn-primary" style="width: 100%; padding: 12px; margin-bottom: 10px;">
                        <i class="fas fa-car" style="margin-left: 8px;"></i> تایید سفر
                    </button>
                    <button onclick="cancelTrip()" class="btn" style="width: 100%; padding: 12px; background: ${themeColors.danger}; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-times" style="margin-left: 8px;"></i> لغو درخواست
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(driverModal);
    }
}

function createSearchingOverlay() {
    if (!document.getElementById('searchingOverlay')) {
        const searchingOverlay = document.createElement('div');
        searchingOverlay.id = 'searchingOverlay';
        searchingOverlay.className = 'modal';
        searchingOverlay.innerHTML = `
            <div class="modal-content" style="width: 400px; max-width: 90%; text-align: center;">
                <div class="modal-body" style="padding: 40px;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: ${themeColors.primary}; color: white; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 30px;">
                        <i class="fas fa-car"></i>
                    </div>
                    <h3 style="color: ${themeColors.text}; margin-bottom: 15px;">در حال جستجوی راننده</h3>
                    <p id="searchingText" style="color: ${themeColors.gray}; margin-bottom: 30px;">در حال یافتن نزدیک‌ترین راننده</p>
                    <div style="display: flex; justify-content: center;">
                        <div class="loading-dots">
                            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${themeColors.primary}; margin: 0 5px; animation: bounce 1.4s infinite;"></div>
                            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${themeColors.primary}; margin: 0 5px; animation: bounce 1.4s infinite 0.2s;"></div>
                            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${themeColors.primary}; margin: 0 5px; animation: bounce 1.4s infinite 0.4s;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(searchingOverlay);
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

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
}

function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        tab.style.borderBottom = `2px solid ${themeColors.border}`;
        tab.style.color = themeColors.text;
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(`${tabName}-tab`);
    
    if (activeTab && activeContent) {
        activeTab.classList.add('active');
        activeTab.style.borderBottom = `2px solid ${themeColors.primary}`;
        activeTab.style.color = themeColors.primary;
        activeContent.classList.add('active');
    }
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    
    document.querySelectorAll('.payment-method').forEach(btn => {
        btn.style.border = `2px solid ${themeColors.border}`;
        btn.style.background = themeColors.cardBg;
        btn.style.color = themeColors.text;
    });
    
    const selectedBtn = document.getElementById(`${method}Payment`);
    if (selectedBtn) {
        selectedBtn.style.border = `2px solid ${themeColors.primary}`;
        selectedBtn.style.background = themeColors.primaryLight;
        selectedBtn.style.color = themeColors.primary;
    }
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
            
            if (pickupMarker && destinationMarker) {
                const tempLatLng = pickupMarker.getLatLng();
                pickupMarker.setLatLng(destinationMarker.getLatLng());
                destinationMarker.setLatLng(tempLatLng);
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
            
            if (selectedRideType === 'bike' && currentDistance > 10) {
                showNotification('سفر با موتور برای مسافت‌های بیشتر از ۱۰ کیلومتر مجاز نیست', 'error');
                return;
            }
            
            showNotification('سفر شما ثبت شد. در حال یافتن راننده...', 'info');
            setTimeout(() => {
                startDriverSearch();
            }, 1000);
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
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showError('loginEmail', 'لطفاً ایمیل و رمز عبور را وارد کنید');
                return;
            }
            
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
            closeModal('authModal');
            loginForm.reset();
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
            
            if (!email.includes('@') || !email.includes('.')) {
                showError('registerEmail', 'لطفاً یک ایمیل معتبر وارد کنید');
                return;
            }
            
            if (!phone.match(/^07\d{8}$/)) {
                showError('registerPhone', 'لطفاً یک شماره تماس معتبر وارد کنید (07xxxxxxxx)');
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
            
            const existingPhone = User.getAll().find(u => u.phone === phone);
            if (existingPhone) {
                showError('registerPhone', 'این شماره تماس قبلاً ثبت شده است');
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
            
            // ارسال اعلان به کاربر
            new Notification({
                user_id: user.id,
                title: 'ثبت‌نام موفق',
                message: 'حساب کاربری شما با موفقیت ایجاد شد. پس از تایید مدیر می‌توانید وارد شوید.',
                type: 'success'
            }).save();
            
            // ارسال اعلان به مدیر
            const admin = User.getAll().find(u => u.role === 'admin');
            if (admin) {
                new Notification({
                    user_id: admin.id,
                    title: 'ثبت‌نام جدید',
                    message: `کاربر جدید ${name} با نقش ${userType === 'passenger' ? 'مسافر' : 'راننده'} ثبت‌نام کرده است.`,
                    type: 'info'
                }).save();
            }
            
            showNotification('ثبت‌نام شما با موفقیت انجام شد. پس از تایید مدیر می‌توانید وارد شوید.', 'success');
            registerForm.reset();
            
            // تغییر به تب ورود
            switchTab('login');
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

    // بستن مدال‌ها با کلیک خارج از مدال
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            e.target.classList.remove('active');
            const overlay = document.getElementById('overlay');
            if (overlay) overlay.classList.remove('active');
        }
    });

    // ذخیره پروفایل
    const saveProfileBtn = document.getElementById('saveProfile');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const name = document.getElementById('editName').value.trim();
            const email = document.getElementById('editEmail').value.trim();
            const phone = document.getElementById('editPhone').value.trim();
            
            if (!name || !email || !phone) {
                showNotification('لطفاً تمام فیلدها را پر کنید', 'error');
                return;
            }
            
            if (!email.includes('@')) {
                showNotification('لطفاً یک ایمیل معتبر وارد کنید', 'error');
                return;
            }
            
            if (!phone.match(/^07\d{8}$/)) {
                showNotification('لطفاً یک شماره تماس معتبر وارد کنید (07xxxxxxxx)', 'error');
                return;
            }
            
            const existingUser = User.getAll().find(u => u.email === email && u.id !== currentUser.id);
            if (existingUser) {
                showNotification('این ایمیل قبلاً توسط کاربر دیگری ثبت شده است', 'error');
                return;
            }
            
            const existingPhone = User.getAll().find(u => u.phone === phone && u.id !== currentUser.id);
            if (existingPhone) {
                showNotification('این شماره تماس قبلاً توسط کاربر دیگری ثبت شده است', 'error');
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
                if (chargeAmount > 1000000) {
                    showNotification('حداکثر مبلغ مجاز برای شارژ ۱,۰۰۰,۰۰۰ افغانی است', 'error');
                    return;
                }
                
                currentUser.wallet_balance += chargeAmount;
                currentUser.save();
                localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
                updateProfilePage();
                
                new Notification({
                    user_id: currentUser.id,
                    title: 'شارژ کیف پول',
                    message: `کیف پول شما به مبلغ ${chargeAmount.toLocaleString()} افغانی شارژ شد.`,
                    type: 'success'
                }).save();
                
                showNotification(`کیف پول شما به مبلغ ${chargeAmount.toLocaleString()} افغانی شارژ شد`, 'success');
            } else if (amount !== null) {
                showNotification('لطفاً مبلغ معتبر وارد کنید', 'error');
            }
        });
    }
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
    
    // تنظیم اولین نوع سفر به عنوان پیش‌فرض
    document.querySelectorAll('.ride-type')[0]?.classList.add('selected');
    
    // تنظیم پیش‌فرض پرداخت نقدی
    selectPaymentMethod('cash');
}

function openAuthModal() {
    const authModal = document.getElementById('authModal');
    const overlay = document.getElementById('overlay');
    if (authModal && overlay) {
        authModal.style.display = 'flex';
        authModal.classList.add('active');
        overlay.classList.add('active');
    }
}

function startDriverSearch() {
    const submitBtn = document.getElementById('submitBtn');
    const searchingOverlay = document.getElementById('searchingOverlay');
    const overlay = document.getElementById('overlay');
    
    if (submitBtn) submitBtn.disabled = true;
    if (searchingOverlay && overlay) {
        searchingOverlay.style.display = 'flex';
        searchingOverlay.classList.add('active');
        overlay.classList.add('active');
    }
    
    let searchTime = 0;
    const searchInterval = setInterval(() => {
        searchTime++;
        const searchingText = document.getElementById('searchingText');
        
        if (searchTime >= 9) {
            clearInterval(searchInterval);
            if (searchingOverlay) {
                searchingOverlay.style.display = 'none';
                searchingOverlay.classList.remove('active');
            }
            if (overlay) overlay.classList.remove('active');
            if (submitBtn) submitBtn.disabled = false;
            
            // یافتن راننده شبیه‌سازی شده
            const drivers = User.getDrivers();
            
            if (drivers.length > 0) {
                const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
                currentDriver = randomDriver;
                
                // ایجاد سفر
                const pickup = document.getElementById('pickup')?.value || 'مکان مشخص نشده';
                const destination = document.getElementById('destination')?.value || 'مکان مشخص نشده';
                
                currentTripId = Date.now();
                const trip = new Trip({
                    id: currentTripId,
                    pickup: pickup,
                    destination: destination,
                    pickup_coords: selectedPickupCoords || [34.5250, 69.1800],
                    destination_coords: selectedDestinationCoords || [34.5300, 69.1900],
                    ride_type: selectedRideType,
                    distance: currentDistance,
                    price: currentPrice,
                    status: 'requested',
                    user_id: currentUser.id,
                    user_name: currentUser.name,
                    driver_id: currentDriver.id,
                    driver_name: currentDriver.name,
                    payment_method: selectedPaymentMethod,
                    reward_points: Math.floor(currentPrice / 10)
                });
                
                trip.save();
                
                showNotification(`راننده ${currentDriver.name} پیدا شد!`, 'success');
                openDriverFoundModal(currentDriver);
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
    const overlay = document.getElementById('overlay');
    
    if (driverModal && overlay) {
        document.getElementById('driverAvatar').textContent = driver.name.charAt(0);
        document.getElementById('driverName').textContent = driver.name;
        document.getElementById('driverRating').textContent = driver.rating;
        document.getElementById('carModel').textContent = driver.car_model || '---';
        document.getElementById('carColor').textContent = driver.car_color || '---';
        document.getElementById('plateNumber').textContent = driver.plate_number || '---';
        document.getElementById('price').textContent = `${currentPrice.toLocaleString()} افغانی`;
        
        driverModal.style.display = 'flex';
        driverModal.classList.add('active');
        overlay.classList.add('active');
    }
}

function confirmTrip() {
    if (!currentTripId || !currentDriver) return;
    
    const trip = Trip.findById(currentTripId);
    if (!trip) return;
    
    trip.status = 'in_progress';
    trip.started_at = new Date().toISOString();
    trip.save();
    
    closeModal('driverModal');
    
    // شبیه‌سازی حرکت خودرو
    simulateCarMovement();
    
    showNotification('سفر شما شروع شد! راننده در حال حرکت به سمت شماست.', 'success');
    
    // ارسال اعلان به کاربر
    new Notification({
        user_id: currentUser.id,
        title: 'سفر شروع شد',
        message: `راننده ${currentDriver.name} در حال حرکت به سمت شماست.`,
        type: 'info'
    }).save();
}

function cancelTrip() {
    if (currentTripId) {
        const trip = Trip.findById(currentTripId);
        if (trip) {
            trip.status = 'cancelled';
            trip.save();
        }
    }
    
    closeModal('driverModal');
    showNotification('درخواست سفر لغو شد.', 'warning');
}

function simulateCarMovement() {
    if (!map || !selectedPickupCoords || !selectedDestinationCoords) return;
    
    // حذف نشانگر قبلی خودرو
    if (carMarker) carMarker.remove();
    
    // ایجاد نشانگر جدید خودرو
    carMarker = L.marker(selectedPickupCoords, {
        icon: L.divIcon({
            html: `<div style="background: ${themeColors.success}; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.5);">
                    <i class="fas fa-car"></i>
                  </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        })
    }).addTo(map).bindPopup(`<b>راننده:</b> ${currentDriver?.name || 'در حال حرکت'}`);
    
    // انیمیشن حرکت خودرو
    const startLat = selectedPickupCoords[0];
    const startLng = selectedPickupCoords[1];
    const endLat = selectedDestinationCoords[0];
    const endLng = selectedDestinationCoords[1];
    
    let progress = 0;
    const duration = 30000; // 30 ثانیه
    
    if (carAnimationInterval) clearInterval(carAnimationInterval);
    
    carAnimationInterval = setInterval(() => {
        progress += 100;
        const percent = Math.min(progress / duration, 1);
        
        const currentLat = startLat + (endLat - startLat) * percent;
        const currentLng = startLng + (endLng - startLng) * percent;
        
        carMarker.setLatLng([currentLat, currentLng]);
        
        if (percent >= 1) {
            clearInterval(carAnimationInterval);
            
            // تکمیل سفر
            completeTrip();
        }
    }, 100);
}

function completeTrip() {
    if (!currentTripId) return;
    
    const trip = Trip.findById(currentTripId);
    if (!trip) return;
    
    trip.status = 'completed';
    trip.completed_at = new Date().toISOString();
    trip.save();
    
    // به‌روزرسانی کیف پول کاربر
    if (currentUser) {
        const user = User.findById(currentUser.id);
        if (user) {
            if (trip.payment_method === 'wallet') {
                user.wallet_balance -= trip.price;
            }
            user.reward_points += trip.reward_points;
            user.save();
            currentUser = user;
            localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
        }
    }
    
    // به‌روزرسانی راننده
    if (currentDriver) {
        const driver = User.findById(currentDriver.id);
        if (driver) {
            driver.total_trips = (driver.total_trips || 0) + 1;
            const commission = Math.floor(trip.price * 0.8); // 80% کمیسیون راننده
            driver.wallet_balance = (driver.wallet_balance || 0) + commission;
            driver.save();
        }
    }
    
    if (carMarker) carMarker.remove();
    
    showNotification('سفر شما با موفقیت تکمیل شد! لطفاً به راننده امتیاز دهید.', 'success');
    loadMyTrips();
    updateProfilePage();
    
    // ارسال اعلان
    if (currentUser) {
        new Notification({
            user_id: currentUser.id,
            title: 'سفر تکمیل شد',
            message: `سفر شما از ${trip.pickup} به ${trip.destination} با موفقیت تکمیل شد. ${trip.reward_points} امتیاز دریافت کردید.`,
            type: 'success'
        }).save();
    }
    
    // باز کردن مدال امتیازدهی
    setTimeout(() => {
        openRatingModal(currentTripId);
    }, 2000);
}

function confirmPayment() {
    if (!currentTripId) return;
    
    const trip = Trip.findById(currentTripId);
    if (!trip) return;
    
    // بررسی موجودی کیف پول اگر پرداخت با کیف پول است
    if (selectedPaymentMethod === 'wallet' && currentUser) {
        const user = User.findById(currentUser.id);
        if (user.wallet_balance < currentPrice) {
            showNotification('موجودی کیف پول شما کافی نیست. لطفاً کیف پول خود را شارژ کنید.', 'error');
            return;
        }
    }
    
    trip.payment_method = selectedPaymentMethod;
    trip.save();
    
    closeModal('paymentModal');
    confirmTrip();
}

function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    const overlay = document.getElementById('overlay');
    
    if (paymentModal && overlay) {
        const paymentDistance = document.getElementById('paymentDistance');
        const paymentPrice = document.getElementById('paymentPrice');
        
        if (paymentDistance) paymentDistance.textContent = `${currentDistance} کیلومتر`;
        if (paymentPrice) paymentPrice.textContent = `${currentPrice.toLocaleString()} افغانی`;
        
        // تنظیم مجدد دکمه‌های پرداخت
        selectPaymentMethod('cash');
        
        paymentModal.style.display = 'flex';
        paymentModal.classList.add('active');
        overlay.classList.add('active');
    }
}

function openRatingModal(tripId = null) {
    const ratingModal = document.getElementById('ratingModal');
    const overlay = document.getElementById('overlay');
    
    if (ratingModal && overlay) {
        ratingModal.setAttribute('data-trip-id', tripId);
        
        // تنظیم مجدد ستاره‌ها
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
        
        // پاک کردن نظر قبلی
        const comment = ratingModal.querySelector('#ratingComment');
        if (comment) comment.value = '';
        
        ratingModal.style.display = 'flex';
        ratingModal.classList.add('active');
        overlay.classList.add('active');
    }
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
    
    if (totalTripsElement) totalTripsElement.textContent = trips.length.toLocaleString();
    if (activeUsersElement) activeUsersElement.textContent = users.filter(u => u.status === 'approved').length.toLocaleString();
    if (totalDriversElement) totalDriversElement.textContent = users.filter(u => u.role === 'driver').length.toLocaleString();
    if (totalRevenueElement) totalRevenueElement.textContent = `${trips.reduce((sum, trip) => sum + (trip.price || 0), 0).toLocaleString()} افغانی`;
    
    loadAdminUsers();
    loadAdminTrips();
}

function loadAdminUsers() {
    const adminUsersTable = document.getElementById('adminUsersTable');
    if (!adminUsersTable) return;
    
    adminUsersTable.innerHTML = '';
    const users = User.getAll();
    
    users.forEach(user => {
        const row = document.createElement('tr');
        const date = new Date(user.created_at).toLocaleDateString('fa-IR');
        const roleText = user.role === 'admin' ? 'مدیر' : user.role === 'driver' ? 'راننده' : 'مسافر';
        const statusText = user.status === 'approved' ? 'تایید شده' : 'در انتظار';
        const statusColor = user.status === 'approved' ? themeColors.success : themeColors.warning;
        
        row.innerHTML = `
            <td style="color: ${themeColors.text};">${user.id}</td>
            <td style="color: ${themeColors.text};">${user.name}</td>
            <td style="color: ${themeColors.text};">${user.email}</td>
            <td style="color: ${themeColors.text};">${user.phone}</td>
            <td style="color: ${themeColors.text};">${roleText}</td>
            <td><span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${statusText}</span></td>
            <td style="color: ${themeColors.text};">${date}</td>
            <td>
                ${user.status !== 'approved' ? 
                `<button onclick="approveUser(${user.id})" style="background: ${themeColors.success}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 5px;">تایید</button>` : ''}
                <button onclick="deleteUser(${user.id})" style="background: ${themeColors.danger}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">حذف</button>
            </td>
        `;
        
        adminUsersTable.appendChild(row);
    });
}

function loadAdminTrips() {
    const adminTripsTable = document.getElementById('adminTripsTable');
    if (!adminTripsTable) return;
    
    adminTripsTable.innerHTML = '';
    const trips = Trip.getAll();
    
    trips.forEach(trip => {
        const row = document.createElement('tr');
        const date = new Date(trip.created_at).toLocaleDateString('fa-IR');
        const rideTypeText = {
            'economy': 'اقتصادی',
            'comfort': 'کلاسیک',
            'bike': 'موتور'
        }[trip.ride_type] || trip.ride_type;
        
        let statusBadge = '';
        let statusColor = themeColors.warning;
        
        switch(trip.status) {
            case 'completed': 
                statusBadge = 'تکمیل شده';
                statusColor = themeColors.success;
                break;
            case 'cancelled': 
                statusBadge = 'لغو شده';
                statusColor = themeColors.danger;
                break;
            case 'in_progress': 
                statusBadge = 'در حال انجام';
                statusColor = themeColors.info;
                break;
            case 'requested': 
                statusBadge = 'درخواست شده';
                statusColor = themeColors.warning;
                break;
            default: 
                statusBadge = trip.status;
        }
        
        row.innerHTML = `
            <td style="color: ${themeColors.text};">${trip.id}</td>
            <td style="color: ${themeColors.text};">${trip.user_name}</td>
            <td style="color: ${themeColors.text};">${trip.driver_name || '---'}</td>
            <td style="color: ${themeColors.text};">${trip.pickup}</td>
            <td style="color: ${themeColors.text};">${trip.destination}</td>
            <td style="color: ${themeColors.text};">${rideTypeText}</td>
            <td style="color: ${themeColors.text};">${trip.distance} کیلومتر</td>
            <td style="color: ${themeColors.text};">${trip.price.toLocaleString()} افغانی</td>
            <td><span style="background: ${statusColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${statusBadge}</span></td>
            <td style="color: ${themeColors.text};">${date}</td>
            <td>
                <button onclick="deleteTrip(${trip.id})" style="background: ${themeColors.danger}; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">حذف</button>
            </td>
        `;
        
        adminTripsTable.appendChild(row);
    });
}

function approveUser(userId) {
    const user = User.findById(userId);
    if (user) {
        user.status = 'approved';
        user.save();
        
        // ارسال اعلان به کاربر
        new Notification({
            user_id: user.id,
            title: 'حساب کاربری تایید شد',
            message: 'حساب کاربری شما توسط مدیر سیستم تایید شد. اکنون می‌توانید وارد حساب خود شوید.',
            type: 'success'
        }).save();
        
        showNotification(`کاربر ${user.name} تایید شد`, 'success');
        loadAdminUsers();
    }
}

function deleteUser(userId) {
    if (confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
        User.delete(userId);
        showNotification('کاربر با موفقیت حذف شد', 'success');
        loadAdminUsers();
    }
}

function deleteTrip(tripId) {
    if (confirm('آیا از حذف این سفر اطمینان دارید؟')) {
        Trip.delete(tripId);
        showNotification('سفر با موفقیت حذف شد', 'success');
        loadAdminTrips();
    }
}

// راه‌اندازی اصلی
window.onload = function() {
    addAdditionalStyles();
    createRequiredElements();
    setupMobileMenu();
    setupEventListeners();
    initializeSampleData();
    const isLoggedIn = checkUserLoginStatus();
    
    // مقداردهی اولیه نقشه
    setTimeout(() => {
        initMap();
        initializeSystem();
    }, 100);
};

// اضافه کردن توابع به window object
window.closeMobileMenu = closeMobileMenu;
window.closeModal = closeModal;
window.switchTab = switchTab;
window.selectPaymentMethod = selectPaymentMethod;
window.openAuthModal = openAuthModal;
window.openPaymentModal = openPaymentModal;
window.openRatingModal = openRatingModal;
window.openDriverFoundModal = openDriverFoundModal;
window.confirmPayment = confirmPayment;
window.confirmTrip = confirmTrip;
window.cancelTrip = cancelTrip;
window.setPickupLocation = setPickupLocation;
window.setDestinationLocation = setDestinationLocation;
window.logout = logout;
window.loadAdminPanel = loadAdminPanel;
window.loadMyTrips = loadMyTrips;
window.loadDiscounts = loadDiscounts;
window.updateProfilePage = updateProfilePage;
window.viewTripDetails = viewTripDetails;
window.copyDiscountCode = copyDiscountCode;
window.approveUser = approveUser;
window.deleteUser = deleteUser;
window.deleteTrip = deleteTrip;