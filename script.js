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

// تعریف رنگ‌های اصلی سیستم (پالت یکپارچه)
const themeColors = {
    primary: '#00B894',       // سبز اصلی
    primaryLight: '#E8F8F5',  // سبز روشن
    primaryDark: '#00A884',   // سبز تیره
    secondary: '#0984E3',     // آبی
    accent: '#FF6B6B',        // قرمز/صورتی
    success: '#00B894',       // سبز (همان primary)
    warning: '#FDCB6E',       // زرد
    danger: '#FF6B6B',        // قرمز (همان accent)
    info: '#74B9FF',          // آبی روشن
    text: '#2D3436',          // متن تیره
    gray: '#636E72',          // خاکستری
    lightGray: '#DFE6E9',     // خاکستری روشن
    bgLight: '#F8F9FA',       // پس‌زمینه روشن
    border: '#E9ECEF',        // مرزها
    white: '#FFFFFF',         // سفید
    black: '#000000'          // سیاه
};

// ذخیره‌سازی داده‌ها
const storage = {
    get: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },
    set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    remove: (key) => localStorage.removeItem(key),
    clear: () => localStorage.clear()
};

// کلاس User برای مدیریت کاربران
class User {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.password = data.password;
        this.role = data.role;
        this.status = data.status || 'pending';
        this.created_at = data.created_at || new Date().toISOString();
        this.wallet_balance = data.wallet_balance || 0;
        this.rating = data.rating || 0;
        
        // برای رانندگان
        if (data.role === 'driver') {
            this.vehicle_type = data.vehicle_type || 'car';
            this.car_model = data.car_model;
            this.car_color = data.car_color;
            this.plate_number = data.plate_number;
            this.driver_license = data.driver_license;
            this.driver_status = data.driver_status || 'active';
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
}

// کلاس Trip برای مدیریت سفرها
class Trip {
    constructor(data) {
        this.id = data.id || Date.now();
        this.pickup = data.pickup;
        this.destination = data.destination;
        this.pickup_coords = data.pickup_coords;
        this.destination_coords = data.destination_coords;
        this.ride_type = data.ride_type;
        this.distance = data.distance;
        this.price = data.price;
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

// کلاس Discount برای مدیریت تخفیف‌ها
class Discount {
    constructor(data) {
        this.id = data.id || Date.now();
        this.code = data.code;
        this.percent = data.percent;
        this.expiry_date = data.expiry_date;
        this.max_uses = data.max_uses;
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

// کلاس Settings برای مدیریت تنظیمات سیستم
class Settings {
    constructor() {
        this.settings = storage.get('snapp_settings') || {
            app_name: 'اسنپ افغانستان',
            currency: 'افغانی',
            base_fare_economy: 50,
            base_fare_comfort: 80,
            base_fare_bike: 30,
            distance_rate: 10, // افغانی به ازای هر کیلومتر
            driver_commission: 0.8, // 80% برای راننده
            min_wallet_balance: 100,
            max_wallet_balance: 100000,
            support_phone: '0788888888',
            support_email: 'support@snapp.af'
        };
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
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
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
        
        // اضافه کردن نقشه OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
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
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 400px;">
            <div class="modal-header">
                <h3>انتخاب مکان</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 20px;">انتخاب کنید این مکان مبدا باشد یا مقصد:</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="selectAsPickup" class="btn-primary" style="flex: 1;">مبدا</button>
                    <button id="selectAsDestination" class="btn-primary" style="flex: 1;">مقصد</button>
                </div>
                <div style="margin-top: 20px;">
                    <input type="text" id="customLocationName" placeholder="نام دلخواه برای این مکان" class="form-input" style="width: 100%;">
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
            html: `<div style="background: ${themeColors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><i class="fas fa-circle"></i></div>`,
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
            html: `<div style="background: ${themeColors.accent}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><i class="fas fa-flag-checkered"></i></div>`,
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
            html: `<div style="background: ${themeColors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>`,
            className: 'location-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const marker = L.marker(location.coordinates, { icon })
            .addTo(map)
            .bindPopup(`<b>${location.name}</b><br><button class="select-location-btn" data-name="${location.name}">انتخاب این مکان</button>`)
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
    selectionModal.style.display = 'flex';
    
    selectionModal.innerHTML = `
        <div class="modal-content" style="width: 350px;">
            <div class="modal-header">
                <h3>${locationName}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>این مکان را به عنوان چه چیزی انتخاب می‌کنید؟</p>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button id="setAsPickup" class="btn-primary" style="flex: 1;">مبدا</button>
                    <button id="setAsDestination" class="btn-primary" style="flex: 1;">مقصد</button>
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
        districtItem.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <span>${district}</span>
        `;
        
        districtItem.addEventListener('click', () => {
            handleDistrictClick(district);
        });
        
        districtsGrid.appendChild(districtItem);
    });
}

function handleDistrictClick(districtName) {
    const selectionModal = document.createElement('div');
    selectionModal.className = 'modal';
    selectionModal.style.display = 'flex';
    
    selectionModal.innerHTML = `
        <div class="modal-content" style="width: 350px;">
            <div class="modal-header">
                <h3>${districtName}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>این منطقه را به عنوان چه چیزی انتخاب می‌کنید؟</p>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button id="setDistrictAsPickup" class="btn-primary" style="flex: 1;">مبدا</button>
                    <button id="setDistrictAsDestination" class="btn-primary" style="flex: 1;">مقصد</button>
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
        tripCalculator.classList.remove('active');
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
    
    tripCalculator.classList.add('active');
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
                    html: `<div style="background: ${themeColors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                            <i class="fas fa-circle"></i>
                          </div>`,
                    className: 'start-marker',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                // نشانگر مقصد
                const endIcon = L.divIcon({
                    html: `<div style="background: ${themeColors.accent}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                            <i class="fas fa-flag-checkered"></i>
                          </div>`,
                    className: 'end-marker',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                L.marker(startCoords, { icon: startIcon }).addTo(map)
                    .bindPopup('<b>مبدا</b>');

                L.marker(endCoords, { icon: endIcon }).addTo(map)
                    .bindPopup('<b>مقصد</b>');

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
        html: `<div style="background: ${themeColors.primary}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                <i class="fas fa-circle"></i>
              </div>`,
        className: 'start-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // نشانگر مقصد
    const endIcon = L.divIcon({
        html: `<div style="background: ${themeColors.accent}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                <i class="fas fa-flag-checkered"></i>
              </div>`,
        className: 'end-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    L.marker(startCoords, { icon: startIcon }).addTo(map)
        .bindPopup('<b>مبدا</b>');

    L.marker(endCoords, { icon: endIcon }).addTo(map)
        .bindPopup('<b>مقصد</b>');

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
        html: `<div class="driver-marker" style="font-size: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
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
    }
    
    updateProfilePage();
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
                created_at: new Date().toISOString()
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
                created_at: new Date(Date.now() - 172800000).toISOString(),
                started_at: new Date(Date.now() - 172800000 + 240000).toISOString(),
                completed_at: new Date(Date.now() - 172800000 + 600000).toISOString()
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
}

// بارگذاری صفحات
function loadMyTrips() {
    const myTripsTable = document.getElementById('myTripsTable');
    if (!myTripsTable || !currentUser) return;
    
    myTripsTable.innerHTML = '';
    const trips = Trip.findByUserId(currentUser.id);
    
    if (trips.length === 0) {
        myTripsTable.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px;">
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
        
        row.innerHTML = `
            <td>${date}<br><small>${time}</small></td>
            <td>${trip.pickup}</td>
            <td>${trip.destination}</td>
            <td>${rideTypeText}</td>
            <td>${trip.distance} کیلومتر</td>
            <td>${trip.price} افغانی</td>
            <td>${trip.driver_name || '---'}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="action-buttons">
                ${trip.status === 'requested' || trip.status === 'confirmed' ? 
                  `<button class="action-btn btn-reject cancel-trip-btn" data-id="${trip.id}">لغو سفر</button>` : ''}
                ${trip.status === 'completed' && !trip.rated ? 
                  `<button class="action-btn btn-approve rate-trip-btn" data-id="${trip.id}">امتیازدهی</button>` : ''}
                ${trip.status === 'completed' ? 
                  `<button class="action-btn btn-info view-trip-btn" data-id="${trip.id}">جزئیات</button>` : ''}
            </td>
        `;
        
        myTripsTable.appendChild(row);
    });
    
    // اضافه کردن event listeners برای دکمه‌ها
    setTimeout(() => {
        document.querySelectorAll('.cancel-trip-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tripId = this.getAttribute('data-id');
                cancelTrip(tripId);
            });
        });
        
        document.querySelectorAll('.rate-trip-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tripId = this.getAttribute('data-id');
                openRatingModal(tripId);
            });
        });
        
        document.querySelectorAll('.view-trip-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tripId = this.getAttribute('data-id');
                viewTripDetails(tripId);
            });
        });
    }, 100);
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
    modal.style.display = 'flex';
    
    const date = new Date(trip.created_at).toLocaleDateString('fa-IR');
    const time = new Date(trip.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const rideTypeText = {
        'economy': 'اقتصادی',
        'comfort': 'کلاسیک',
        'bike': 'موتور'
    }[trip.ride_type] || trip.ride_type;
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h3>جزئیات سفر #${trip.id}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div class="detail-item">
                        <label>تاریخ:</label>
                        <span>${date} - ${time}</span>
                    </div>
                    <div class="detail-item">
                        <label>نوع سفر:</label>
                        <span>${rideTypeText}</span>
                    </div>
                    <div class="detail-item">
                        <label>مبدا:</label>
                        <span>${trip.pickup}</span>
                    </div>
                    <div class="detail-item">
                        <label>مقصد:</label>
                        <span>${trip.destination}</span>
                    </div>
                    <div class="detail-item">
                        <label>مسافت:</label>
                        <span>${trip.distance} کیلومتر</span>
                    </div>
                    <div class="detail-item">
                        <label>هزینه:</label>
                        <span>${trip.price} افغانی</span>
                    </div>
                    <div class="detail-item">
                        <label>راننده:</label>
                        <span>${trip.driver_name || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <label>روش پرداخت:</label>
                        <span>${trip.payment_method === 'cash' ? 'نقدی' : 'کیف پول'}</span>
                    </div>
                </div>
                ${trip.rating ? `
                <div style="background: ${themeColors.bgLight}; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <h4 style="margin-bottom: 10px;">امتیاز شما</h4>
                    <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                        ${Array.from({length: 5}, (_, i) => `
                            <i class="fas fa-star ${i < trip.rating ? 'active' : ''}" style="color: ${i < trip.rating ? '#FFD700' : '#ccc'};"></i>
                        `).join('')}
                    </div>
                    ${trip.rating_comment ? `<p style="margin: 0;">${trip.rating_comment}</p>` : ''}
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
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-tag" style="font-size: 48px; color: ${themeColors.gray}; margin-bottom: 15px; display: block;"></i>
                <p style="color: ${themeColors.gray};">هیچ تخفیف فعالی موجود نیست</p>
            </div>
        `;
        return;
    }
    
    discounts.forEach(discount => {
        const discountElement = document.createElement('div');
        discountElement.className = 'discount-card';
        
        const expiryDate = new Date(discount.expiry_date).toLocaleDateString('fa-IR');
        const progress = (discount.used_count / discount.max_uses) * 100;
        
        discountElement.innerHTML = `
            <div class="discount-header">
                <div class="discount-code">${discount.code}</div>
                <div class="discount-percent">${discount.percent}% تخفیف</div>
            </div>
            <div class="discount-details">
                <div><i class="fas fa-calendar-alt"></i> منقضی: ${expiryDate}</div>
                <div><i class="fas fa-users"></i> استفاده شده: ${discount.used_count} از ${discount.max_uses}</div>
            </div>
            <div class="discount-progress">
                <div class="progress-text">
                    <span>۰</span>
                    <span>${discount.max_uses}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="discount-actions">
                <button class="btn-copy-code" data-code="${discount.code}">
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
    
    if (profileAvatar) {
        profileAvatar.textContent = currentUser.name.charAt(0);
        profileAvatar.style.backgroundColor = themeColors.primary;
    }
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profilePhone) profilePhone.textContent = currentUser.phone;
    if (profileRole) profileRole.textContent = currentUser.role === 'passenger' ? 'مسافر' : 'راننده';
    
    if (editName) editName.value = currentUser.name;
    if (editEmail) editEmail.value = currentUser.email;
    if (editPhone) editPhone.value = currentUser.phone;
    if (walletBalance) walletBalance.textContent = `${currentUser.wallet_balance} افغانی`;
    
    // محاسبه آمار
    const trips = Trip.findByUserId(currentUser.id);
    const totalTrips = trips.length;
    const totalSpent = trips.reduce((sum, trip) => sum + (trip.price || 0), 0);
    const userRating = currentUser.rating || 4.7;
    
    const totalTripsCount = document.getElementById('totalTripsCount');
    const totalSpentElement = document.getElementById('totalSpent');
    const userRatingElement = document.getElementById('userRating');
    
    if (totalTripsCount) totalTripsCount.textContent = totalTrips;
    if (totalSpentElement) totalSpentElement.textContent = `${totalSpent} افغانی`;
    if (userRatingElement) userRatingElement.textContent = userRating;
    
    // برای رانندگان، نمایش اطلاعات اضافی
    if (currentUser.role === 'driver') {
        const driverInfoSection = document.createElement('div');
        driverInfoSection.className = 'driver-info-section';
        driverInfoSection.innerHTML = `
            <h3 style="margin-bottom: 15px;">اطلاعات راننده</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="detail-item">
                    <label>نوع وسیله:</label>
                    <span>${currentUser.vehicle_type === 'car' ? 'خودرو' : 'موتور'}</span>
                </div>
                <div class="detail-item">
                    <label>مدل:</label>
                    <span>${currentUser.car_model || '---'}</span>
                </div>
                <div class="detail-item">
                    <label>رنگ:</label>
                    <span>${currentUser.car_color || '---'}</span>
                </div>
                <div class="detail-item">
                    <label>پلاک:</label>
                    <span>${currentUser.plate_number || '---'}</span>
                </div>
                <div class="detail-item">
                    <label>وضعیت:</label>
                    <span class="status-badge ${currentUser.driver_status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${currentUser.driver_status === 'active' ? 'فعال' : 'غیرفعال'}
                    </span>
                </div>
                <div class="detail-item">
                    <label>مجموع سفرها:</label>
                    <span>${currentUser.total_trips || 0}</span>
                </div>
            </div>
        `;
        
        const profileContent = document.getElementById('profileContent');
        if (profileContent) {
            const existingDriverInfo = profileContent.querySelector('.driver-info-section');
            if (existingDriverInfo) {
                existingDriverInfo.remove();
            }
            profileContent.appendChild(driverInfoSection);
        }
    }
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
}

function loadAdminStats() {
    const users = User.getAll();
    const trips = Trip.getAll();
    const recentTrips = trips.slice(0, 5);
    
    const totalTripsElement = document.getElementById('totalTrips');
    const activeUsersElement = document.getElementById('activeUsers');
    const totalDriversElement = document.getElementById('totalDrivers');
    const totalRevenueElement = document.getElementById('totalRevenue');
    
    if (totalTripsElement) totalTripsElement.textContent = trips.length;
    if (activeUsersElement) activeUsersElement.textContent = users.filter(u => u.status === 'approved').length;
    if (totalDriversElement) totalDriversElement.textContent = users.filter(u => u.role === 'driver' && u.status === 'approved').length;
    
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
        
        recentTrips.forEach(trip => {
            const row = document.createElement('tr');
            const date = new Date(trip.created_at).toLocaleDateString('fa-IR');
            const statusClass = `status-${trip.status}`;
            const statusText = {
                'requested': 'درخواست شده',
                'confirmed': 'تأیید شده',
                'completed': 'تکمیل شده',
                'cancelled': 'لغو شده'
            }[trip.status] || trip.status;
            
            row.innerHTML = `
                <td>${date}</td>
                <td>${trip.user_name || '---'}</td>
                <td>${trip.pickup} → ${trip.destination}</td>
                <td>${trip.price} افغانی</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
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
    
    users.forEach(user => {
        const row = document.createElement('tr');
        const date = new Date(user.created_at).toLocaleDateString('fa-IR');
        const roleText = user.role === 'passenger' ? 'مسافر' : 'راننده';
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${roleText}</td>
            <td>${date}</td>
            <td>${user.wallet_balance || 0} افغانی</td>
            <td class="action-buttons">
                <button class="action-btn btn-approve approve-user-btn" data-id="${user.id}">تایید</button>
                <button class="action-btn btn-reject reject-user-btn" data-id="${user.id}">رد</button>
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
        showNotification(`کاربر ${user.name} ${status === 'approved' ? 'تایید' : 'رد'} شد`, 'success');
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
    
    users.forEach(user => {
        const row = document.createElement('tr');
        const date = new Date(user.created_at).toLocaleDateString('fa-IR');
        const roleText = user.role === 'passenger' ? 'مسافر' : 'راننده';
        const statusClass = `status-${user.status}`;
        const statusText = {
            'pending': 'در انتظار تایید',
            'approved': 'تایید شده',
            'rejected': 'رد شده'
        }[user.status] || user.status;
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${roleText}</td>
            <td>${user.wallet_balance || 0} افغانی</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${date}</td>
            <td class="action-buttons">
                ${user.status === 'approved' ? 
                  `<button class="action-btn btn-reject deactivate-user-btn" data-id="${user.id}">غیرفعال</button>` : 
                  user.status === 'rejected' ? 
                  `<button class="action-btn btn-approve activate-user-btn" data-id="${user.id}">فعال</button>` : ''}
                <button class="action-btn btn-reject delete-user-btn" data-id="${user.id}">حذف</button>
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
    
    drivers.forEach(driver => {
        const row = document.createElement('tr');
        const vehicleType = driver.vehicle_type || 'car';
        const vehicleTypeText = vehicleType === 'car' ? 'خودرو' : 'موتور';
        const statusClass = driver.driver_status === 'active' ? 'status-active' : 'status-inactive';
        const statusText = driver.driver_status === 'active' ? 'فعال' : 'غیرفعال';
        
        row.innerHTML = `
            <td>${driver.name}</td>
            <td>${driver.phone}</td>
            <td>${vehicleTypeText}</td>
            <td>${driver.car_model || '---'}</td>
            <td>${driver.car_color || '---'}</td>
            <td>${driver.plate_number || '---'}</td>
            <td>${driver.total_trips || 0}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="action-buttons">
                <button class="action-btn ${driver.driver_status === 'active' ? 'btn-reject' : 'btn-approve'} toggle-driver-btn" data-id="${driver.id}" data-status="${driver.driver_status}">
                    ${driver.driver_status === 'active' ? 'غیرفعال' : 'فعال'}
                </button>
                <button class="action-btn btn-reject delete-driver-btn" data-id="${driver.id}">حذف</button>
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
        
        row.innerHTML = `
            <td>${date}<br><small>${time}</small></td>
            <td>${trip.user_name || '---'}</td>
            <td>${trip.driver_name || '---'}</td>
            <td>${trip.pickup}</td>
            <td>${trip.destination}</td>
            <td>${trip.distance} کیلومتر</td>
            <td>${trip.price} افغانی</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="action-buttons">
                ${trip.status === 'requested' || trip.status === 'confirmed' || trip.status === 'in_progress' ? 
                  `<button class="action-btn btn-reject cancel-admin-trip-btn" data-id="${trip.id}">لغو سفر</button>` : ''}
                <button class="action-btn btn-info view-admin-trip-btn" data-id="${trip.id}">جزئیات</button>
                <button class="action-btn btn-reject delete-admin-trip-btn" data-id="${trip.id}">حذف</button>
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
    modal.style.display = 'flex';
    
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
        <div class="modal-content" style="width: 600px;">
            <div class="modal-header">
                <h3>جزئیات سفر #${trip.id}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div class="detail-item">
                        <label>تاریخ ایجاد:</label>
                        <span>${date} - ${time}</span>
                    </div>
                    <div class="detail-item">
                        <label>نوع سفر:</label>
                        <span>${rideTypeText}</span>
                    </div>
                    <div class="detail-item">
                        <label>مسافر:</label>
                        <span>${trip.user_name || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <label>راننده:</label>
                        <span>${trip.driver_name || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <label>مبدا:</label>
                        <span>${trip.pickup}</span>
                    </div>
                    <div class="detail-item">
                        <label>مقصد:</label>
                        <span>${trip.destination}</span>
                    </div>
                    <div class="detail-item">
                        <label>مسافت:</label>
                        <span>${trip.distance} کیلومتر</span>
                    </div>
                    <div class="detail-item">
                        <label>هزینه:</label>
                        <span>${trip.price} افغانی</span>
                    </div>
                    <div class="detail-item">
                        <label>روش پرداخت:</label>
                        <span>${trip.payment_method === 'cash' ? 'نقدی' : 'کیف پول'}</span>
                    </div>
                    <div class="detail-item">
                        <label>وضعیت:</label>
                        <span class="status-badge status-${trip.status}">
                            ${trip.status === 'requested' ? 'درخواست شده' : 
                              trip.status === 'confirmed' ? 'تأیید شده' : 
                              trip.status === 'in_progress' ? 'در حال انجام' : 
                              trip.status === 'completed' ? 'تکمیل شده' : 'لغو شده'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>زمان شروع:</label>
                        <span>${startedAt}</span>
                    </div>
                    <div class="detail-item">
                        <label>زمان اتمام:</label>
                        <span>${completedAt}</span>
                    </div>
                </div>
                ${trip.rating ? `
                <div style="background: ${themeColors.bgLight}; padding: 15px; border-radius: 8px; margin-top: 10px;">
                    <h4 style="margin-bottom: 10px;">امتیاز</h4>
                    <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                        ${Array.from({length: 5}, (_, i) => `
                            <i class="fas fa-star ${i < trip.rating ? 'active' : ''}" style="color: ${i < trip.rating ? '#FFD700' : '#ccc'};"></i>
                        `).join('')}
                        <span style="margin-right: 10px;">${trip.rating}/5</span>
                    </div>
                    ${trip.rating_comment ? `<p style="margin: 0;"><strong>نظر:</strong> ${trip.rating_comment}</p>` : ''}
                </div>
                ` : ''}
            </div>
            <div class="modal-footer" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid ${themeColors.border};">
                <button class="btn-secondary" style="margin-left: 10px;" onclick="this.closest('.modal').remove()">بستن</button>
                ${trip.status !== 'completed' && trip.status !== 'cancelled' ? `
                <button class="btn-reject cancel-trip-now-btn" data-id="${trip.id}">لغو سفر</button>
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
            const tripId = this.getAttribute('data-id');
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
    
    discounts.forEach(discount => {
        const row = document.createElement('tr');
        const createdDate = new Date(discount.created_at).toLocaleDateString('fa-IR');
        const expiryDate = new Date(discount.expiry_date).toLocaleDateString('fa-IR');
        const isExpired = new Date(discount.expiry_date) < new Date();
        const statusClass = isExpired ? 'status-inactive' : 'status-active';
        const statusText = isExpired ? 'منقضی' : 'فعال';
        
        row.innerHTML = `
            <td>${discount.code}</td>
            <td>${discount.percent}%</td>
            <td>${expiryDate}</td>
            <td>${discount.max_uses}</td>
            <td>${discount.used_count || 0}</td>
            <td>${createdDate}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="action-buttons">
                <button class="action-btn btn-info edit-discount-btn" data-id="${discount.id}">ویرایش</button>
                <button class="action-btn btn-reject delete-discount-btn" data-id="${discount.id}">حذف</button>
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
    modal.style.display = 'flex';
    
    // فرمت تاریخ برای input
    const expiryDate = new Date(discount.expiry_date);
    const formattedDate = expiryDate.toISOString().split('T')[0];
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 400px;">
            <div class="modal-header">
                <h3>ویرایش تخفیف ${discount.code}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editDiscountForm">
                    <div class="form-group">
                        <label for="editDiscountCode">کد تخفیف:</label>
                        <input type="text" id="editDiscountCode" value="${discount.code}" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="editDiscountPercent">درصد تخفیف:</label>
                        <input type="number" id="editDiscountPercent" value="${discount.percent}" min="1" max="100" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="editDiscountExpiry">تاریخ انقضا:</label>
                        <input type="date" id="editDiscountExpiry" value="${formattedDate}" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="editMaxUses">حداکثر استفاده:</label>
                        <input type="number" id="editMaxUses" value="${discount.max_uses}" min="1" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="editUsedCount">تعداد استفاده شده:</label>
                        <input type="number" id="editUsedCount" value="${discount.used_count}" min="0" class="form-input" required>
                    </div>
                    <input type="hidden" id="editDiscountId" value="${discount.id}">
                </form>
            </div>
            <div class="modal-footer" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid ${themeColors.border};">
                <button class="btn-secondary" style="margin-left: 10px;" onclick="this.closest('.modal').remove()">لغو</button>
                <button class="btn-primary" id="saveEditDiscount">ذخیره تغییرات</button>
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
    
    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        const date = new Date(ticket.created_at).toLocaleDateString('fa-IR');
        const statusClass = `status-${ticket.status}`;
        const statusText = {
            'pending': 'در انتظار پاسخ',
            'answered': 'پاسخ داده شده',
            'closed': 'بسته شده'
        }[ticket.status] || ticket.status;
        
        row.innerHTML = `
            <td>${ticket.user_name || '---'}</td>
            <td>${ticket.subject}</td>
            <td>${ticket.message.length > 50 ? ticket.message.substring(0, 50) + '...' : ticket.message}</td>
            <td>${date}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                ${ticket.reply ? '✓' : '✗'}
            </td>
            <td class="action-buttons">
                ${ticket.status !== 'closed' ? 
                  `<button class="action-btn btn-approve reply-ticket-btn" data-id="${ticket.id}">پاسخ</button>` : ''}
                <button class="action-btn btn-info view-ticket-btn" data-id="${ticket.id}">مشاهده</button>
                <button class="action-btn btn-reject close-ticket-btn" data-id="${ticket.id}">${ticket.status === 'closed' ? 'حذف' : 'بستن'}</button>
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
    modal.style.display = 'flex';
    
    const createdDate = new Date(ticket.created_at).toLocaleString('fa-IR');
    const repliedDate = ticket.replied_at ? new Date(ticket.replied_at).toLocaleString('fa-IR') : '---';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h3>تیکت #${ticket.id} - ${ticket.subject}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px;">
                    <div class="detail-item">
                        <label>کاربر:</label>
                        <span>${ticket.user_name || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <label>تاریخ ایجاد:</label>
                        <span>${createdDate}</span>
                    </div>
                    <div class="detail-item">
                        <label>وضعیت:</label>
                        <span class="status-badge status-${ticket.status}">
                            ${ticket.status === 'pending' ? 'در انتظار پاسخ' : 
                              ticket.status === 'answered' ? 'پاسخ داده شده' : 'بسته شده'}
                        </span>
                    </div>
                </div>
                
                <div style="background: ${themeColors.bgLight}; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin-bottom: 10px;">پیام کاربر:</h4>
                    <p style="margin: 0; white-space: pre-wrap;">${ticket.message}</p>
                </div>
                
                ${ticket.reply ? `
                <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <h4 style="margin-bottom: 10px;">پاسخ پشتیبانی:</h4>
                    <p style="margin: 0; white-space: pre-wrap;">${ticket.reply}</p>
                    <div style="margin-top: 10px; font-size: 12px; color: ${themeColors.gray};">
                        <i class="fas fa-clock"></i> ${repliedDate}
                    </div>
                </div>
                ` : ''}
            </div>
            ${!ticket.reply ? `
            <div class="modal-footer" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid ${themeColors.border};">
                <button class="btn-primary" onclick="replyToTicketNow(${ticket.id})">پاسخ دادن</button>
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

// اضافه کردن استایل‌های CSS برای قابلیت‌های جدید
function addAdditionalStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* استایل‌های پایه با رنگ‌های جدید */
        :root {
            --primary: ${themeColors.primary};
            --primary-light: ${themeColors.primaryLight};
            --primary-dark: ${themeColors.primaryDark};
            --secondary: ${themeColors.secondary};
            --accent: ${themeColors.accent};
            --success: ${themeColors.success};
            --warning: ${themeColors.warning};
            --danger: ${themeColors.danger};
            --info: ${themeColors.info};
            --text: ${themeColors.text};
            --gray: ${themeColors.gray};
            --light-gray: ${themeColors.lightGray};
            --bg-light: ${themeColors.bgLight};
            --border: ${themeColors.border};
            --white: ${themeColors.white};
            --black: ${themeColors.black};
        }
        
        /* استایل‌های جدید برای عناصر */
        .mobile-menu {
            position: fixed;
            top: 0;
            right: -300px;
            width: 300px;
            height: 100%;
            background: var(--white);
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
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
            border-bottom: 1px solid var(--border);
        }
        
        .mobile-nav {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .mobile-nav a {
            padding: 12px 15px;
            color: var(--text);
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .mobile-nav a:hover {
            background: var(--bg-light);
            color: var(--primary);
        }
        
        .mobile-nav a.active {
            background: var(--primary-light);
            color: var(--primary);
        }
        
        .hamburger {
            display: none;
            background: none;
            border: none;
            font-size: 24px;
            color: var(--text);
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
            background: rgba(0,0,0,0.5);
            z-index: 999;
        }
        
        .overlay.active {
            display: block;
        }
        
        .close-menu {
            background: none;
            border: none;
            font-size: 24px;
            color: var(--text);
            cursor: pointer;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: var(--white);
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            z-index: 10000;
            display: none;
            min-width: 300px;
            max-width: 400px;
            animation: slideIn 0.3s ease;
            border-right: 4px solid var(--primary);
        }
        
        .notification.success {
            border-color: var(--success);
            background: var(--primary-light);
        }
        
        .notification.error {
            border-color: var(--accent);
            background: #ffebee;
        }
        
        .notification.warning {
            border-color: var(--warning);
            background: #fff3e0;
        }
        
        .notification.info {
            border-color: var(--info);
            background: #e3f2fd;
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
        
        @media (max-width: 768px) {
            .hamburger {
                display: block;
            }
            
            .desktop-nav {
                display: none;
            }
        }
        
        .district-item {
            padding: 10px 15px;
            background: var(--white);
            border: 1px solid var(--border);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .district-item:hover {
            background: var(--primary-light);
            border-color: var(--primary);
            transform: translateY(-2px);
        }
        
        .district-item i {
            color: var(--primary);
        }
        
        .location-marker, .pickup-marker, .destination-marker {
            cursor: pointer;
        }
        
        .select-location-btn {
            background: var(--primary);
            color: var(--white);
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 5px;
        }
        
        .select-location-btn:hover {
            background: var(--primary-dark);
        }
        
        .driver-marker {
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .status-requested {
            background: #fff3cd;
            color: #856404;
        }
        
        .status-confirmed {
            background: #d1ecf1;
            color: #0c5460;
        }
        
        .status-in_progress {
            background: #d4edda;
            color: #155724;
        }
        
        .status-completed {
            background: #c3e6cb;
            color: #155724;
        }
        
        .status-cancelled {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status-approved {
            background: #d4edda;
            color: #155724;
        }
        
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        
        .status-rejected {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status-active {
            background: #d4edda;
            color: #155724;
        }
        
        .status-inactive {
            background: #f8d7da;
            color: #721c24;
        }
        
        .action-buttons {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }
        
        .action-btn {
            padding: 4px 8px;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-approve {
            background: var(--success);
            color: var(--white);
        }
        
        .btn-reject {
            background: var(--accent);
            color: var(--white);
        }
        
        .btn-info {
            background: var(--info);
            color: var(--white);
        }
        
        .action-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        .admin-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            overflow-x: auto;
            padding-bottom: 10px;
        }
        
        .admin-tab {
            padding: 10px 20px;
            background: var(--white);
            border: 1px solid var(--border);
            border-radius: 8px;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.3s;
        }
        
        .admin-tab:hover {
            background: var(--bg-light);
        }
        
        .admin-tab.active {
            background: var(--primary);
            color: var(--white);
            border-color: var(--primary);
        }
        
        .admin-tab-content {
            display: none;
        }
        
        .admin-tab-content.active {
            display: block;
        }
        
        .detail-item {
            margin-bottom: 10px;
        }
        
        .detail-item label {
            font-weight: 600;
            color: var(--gray);
            display: inline-block;
            min-width: 120px;
        }
        
        .detail-item span {
            color: var(--text);
        }
        
        .discount-actions {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid var(--border);
            text-align: center;
        }
        
        .btn-copy-code {
            background: var(--primary-light);
            color: var(--primary);
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .btn-copy-code:hover {
            background: var(--primary);
            color: var(--white);
        }
        
        .tooltip {
            position: fixed;
            background: rgba(0,0,0,0.8);
            color: var(--white);
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
            white-space: nowrap;
        }
        
        .admin-filter {
            padding: 8px 12px;
            border: 1px solid var(--border);
            border-radius: 4px;
            font-size: 14px;
            width: 200px;
        }
        
        .settings-section {
            background: var(--white);
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        
        .settings-section h3 {
            margin-bottom: 15px;
            color: var(--text);
        }
        
        .settings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .report-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        .toggle-password {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--gray);
            cursor: pointer;
        }
        
        .form-group {
            position: relative;
        }
        
        /* استایل‌های دکمه‌ها با رنگ‌های جدید */
        .btn-primary {
            background: var(--primary);
            color: var(--white);
        }
        
        .btn-secondary {
            background: var(--light-gray);
            color: var(--text);
        }
        
        .btn-success {
            background: var(--success);
            color: var(--white);
        }
        
        .btn-danger {
            background: var(--accent);
            color: var(--white);
        }
        
        .btn-warning {
            background: var(--warning);
            color: var(--text);
        }
        
        /* استایل‌های کارت‌ها */
        .card {
            background: var(--white);
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            border: 1px solid var(--border);
        }
        
        /* استایل‌های جداول */
        table {
            background: var(--white);
        }
        
        th {
            background: var(--bg-light);
            color: var(--text);
        }
        
        tr:hover {
            background: var(--bg-light);
        }
        
        /* استایل‌های فرم‌ها */
        .form-input {
            border: 1px solid var(--border);
            background: var(--white);
            color: var(--text);
        }
        
        .form-input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 2px var(--primary-light);
        }
        
        /* استایل‌های مودال */
        .modal {
            background: rgba(0,0,0,0.5);
        }
        
        .modal-content {
            background: var(--white);
        }
        
        .modal-header {
            border-bottom: 1px solid var(--border);
        }
        
        /* استایل‌های هدر و فوتر */
        header {
            background: var(--white);
            border-bottom: 1px solid var(--border);
        }
        
        footer {
            background: var(--bg-light);
            border-top: 1px solid var(--border);
        }
    `;
    document.head.appendChild(styleSheet);
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
    
    // دکمه شروع استفاده
    document.getElementById('start-using-btn')?.addEventListener('click', () => {
        document.getElementById('welcome-page').style.display = 'none';
        document.getElementById('main-header').style.display = 'block';
        document.getElementById('main-container').style.display = 'block';
        document.getElementById('main-footer').style.display = 'block';
        showNotification('به اسنپ افغانستان خوش آمدید!', 'success');
    });

    // دکمه اطلاعات بیشتر
    document.getElementById('learn-more-btn')?.addEventListener('click', () => {
        showNotification('اسنپ افغانستان اولین سرویس تاکسی اینترنتی در کابل است که با بهترین کیفیت و مناسب‌ترین قیمت خدمات ارائه می‌دهد.', 'info');
    });

    // انتخاب نوع سفر
    document.querySelectorAll('.ride-type').forEach(type => {
        type.addEventListener('click', () => {
            document.querySelectorAll('.ride-type').forEach(t => t.classList.remove('selected'));
            type.classList.add('selected');
            selectedRideType = type.dataset.type;
            updatePrice();
        });
    });

    // انتخاب روش پرداخت
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', () => {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
            selectedPaymentMethod = method.getAttribute('data-method');
            openPaymentModal();
        });
    });

    // تعویض مبدا و مقصد
    document.getElementById('swapLocations')?.addEventListener('click', () => {
        const pickupInput = document.getElementById('pickup');
        const destinationInput = document.getElementById('destination');
        
        if (!destinationInput.value) {
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

    // فرم درخواست سفر
    document.getElementById('rideForm')?.addEventListener('submit', (e) => {
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

    // شروع جستجوی راننده
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
        const pickupInput = document.getElementById('pickup');
        const searchingOverlay = document.getElementById('searchingOverlay');
        const submitBtn = document.getElementById('submitBtn');
        
        if (searchingOverlay) searchingOverlay.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
        
        const nearestDriver = findNearestDriver(pickupInput?.value, selectedRideType);
        
        if (!nearestDriver) {
            showNotification('هیچ راننده‌ای در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.', 'error');
            return;
        }
        
        currentDriver = nearestDriver;
        
        // پر کردن معلومات راننده
        document.getElementById('driverAvatar').textContent = nearestDriver.name.charAt(0);
        document.getElementById('driverName').textContent = nearestDriver.name;
        document.getElementById('driverRating').textContent = nearestDriver.rating;
        document.getElementById('driverTrips').textContent = `(${nearestDriver.total_trips} سفر)`;
        document.getElementById('carModel').textContent = nearestDriver.car_model || '---';
        document.getElementById('carColor').textContent = nearestDriver.car_color || '---';
        document.getElementById('plateNumber').textContent = nearestDriver.plate_number || '---';
        document.getElementById('eta').textContent = nearestDriver.eta;
        document.getElementById('distance').textContent = nearestDriver.distance;
        document.getElementById('price').textContent = `${currentPrice} افغانی`;
        
        document.getElementById('driverModal').style.display = 'flex';
        showNotification(`راننده ${nearestDriver.name} پیدا شد!`, 'success');
    }

    // لغو جستجو
    document.getElementById('cancelSearch')?.addEventListener('click', () => {
        clearInterval(window.searchInterval);
        document.getElementById('searchingOverlay').style.display = 'none';
        document.getElementById('submitBtn').disabled = false;
        showNotification('جستجو لغو شد', 'warning');
    });

    // تأیید سفر
    document.getElementById('confirmRide')?.addEventListener('click', () => {
        document.getElementById('driverModal').style.display = 'none';
        
        // به‌روزرسانی وضعیت سفر
        const trip = Trip.findById(currentTripId);
        if (trip) {
            trip.status = 'confirmed';
            trip.driver_id = currentDriver.id;
            trip.driver_name = currentDriver.name;
            trip.started_at = new Date().toISOString();
            trip.save();
        }
        
        // پیدا کردن مختصات
        let pickupCoords = selectedPickupCoords;
        let destinationCoords = selectedDestinationCoords;
        
        if (!pickupCoords) {
            const pickupLocation = kabulData.locations.find(loc => loc.name === trip.pickup);
            pickupCoords = pickupLocation?.coordinates || [34.5250, 69.1800];
        }
        
        if (!destinationCoords) {
            const destinationLocation = kabulData.locations.find(loc => loc.name === trip.destination);
            destinationCoords = destinationLocation?.coordinates || [34.5300, 69.1900];
        }
        
        // نمایش مسیر
        drawRoute(pickupCoords, destinationCoords);
        
        // شروع ردیابی
        startTripTracking(currentDriver, pickupCoords, destinationCoords);
        showNotification('سفر شما با موفقیت ثبت شد. راننده به زودی با شما تماس خواهد گرفت.', 'success');
        
        // بازنشانی فرم
        document.getElementById('rideForm').reset();
        document.getElementById('tripCalculator').classList.remove('active');
        
        // حذف نشانگرها
        if (pickupMarker) {
            map.removeLayer(pickupMarker);
            pickupMarker = null;
        }
        if (destinationMarker) {
            map.removeLayer(destinationMarker);
            destinationMarker = null;
        }
        
        selectedPickupCoords = null;
        selectedDestinationCoords = null;
        currentDistance = 0;
        currentPrice = 0;
        
        const rideTypes = document.querySelectorAll('.ride-type');
        rideTypes.forEach(t => t.classList.remove('selected'));
        if (rideTypes.length > 0) rideTypes[0].classList.add('selected');
        selectedRideType = 'economy';
    });

    function startTripTracking(driver, startCoords, endCoords) {
        const liveTracking = document.getElementById('liveTracking');
        if (liveTracking) liveTracking.style.display = 'block';
        
        document.getElementById('trackingDriverName').textContent = driver.name;
        document.getElementById('trackingETA').textContent = driver.eta;
        document.getElementById('trackingDistance').textContent = driver.distance;
        
        simulateCarMovement(startCoords, endCoords, selectedRideType === 'bike');
    }

    // لغو ردیابی
    document.getElementById('cancelTracking')?.addEventListener('click', () => {
        if (confirm('آیا از لغو این سفر مطمئن هستید؟')) {
            document.getElementById('liveTracking').style.display = 'none';
            clearRoute();
            if (carAnimationInterval) {
                clearInterval(carAnimationInterval);
            }
            if (carMarker) {
                map.removeLayer(carMarker);
                carMarker = null;
            }
            
            const trip = Trip.findById(currentTripId);
            if (trip) {
                trip.status = 'cancelled';
                trip.save();
            }
            showNotification('سفر لغو شد', 'warning');
        }
    });

    // محاسبه مسافت هنگام تغییر مقصد
    document.getElementById('destination')?.addEventListener('input', () => {
        setTimeout(calculateDistanceAndPrice, 1000);
    });

    document.getElementById('pickup')?.addEventListener('input', () => {
        setTimeout(calculateDistanceAndPrice, 1000);
    });

    // پیشنهادات مقصد
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const destination = item.getAttribute('data-destination');
            const destinationInput = document.getElementById('destination');
            if (destinationInput) {
                destinationInput.value = destination;
                showNotification(`مقصد به "${destination}" تنظیم شد`, 'info');
                calculateDistanceAndPrice();
            }
        });
    });

    // مدیریت ورود/ثبت‌نام
    document.getElementById('loginBtn')?.addEventListener('click', openAuthModal);

    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
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
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('loginForm').reset();
        updateUIAfterLogin();
    });

    document.getElementById('registerForm')?.addEventListener('submit', (e) => {
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
        document.getElementById('registerForm').reset();
        
        // تغییر به تب ورود
        document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.form-tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector('.form-tab[data-tab="login"]').classList.add('active');
        document.getElementById('login-tab').classList.add('active');
    });

    // مدیریت خروج
    document.getElementById('logoutBtn')?.addEventListener('click', logout);

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
            btn.closest('.modal').style.display = 'none';
        });
    });

    // مدیریت چت پشتیبانی
    document.getElementById('sendMessage')?.addEventListener('click', () => {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (message && currentUser) {
            const chatMessages = document.getElementById('chatMessages');
            const messageElement = document.createElement('div');
            messageElement.className = 'message sent';
            messageElement.innerHTML = `
                ${message}
                <div class="message-time">${new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</div>
            `;
            chatMessages.appendChild(messageElement);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // ایجاد تیکت پشتیبانی
            const ticket = new SupportTicket({
                user_id: currentUser.id,
                user_name: currentUser.name,
                subject: 'درخواست پشتیبانی از چت',
                message: message
            });
            ticket.save();
            
            // شبیه‌سازی پاسخ
            setTimeout(() => {
                const responses = [
                    'متشکریم از پیام شما. چگونه می‌توانیم کمکتان کنیم؟',
                    'پیام شما دریافت شد. همکاران ما به زودی با شما تماس خواهند گرفت.',
                    'لطفاً شماره تماس خود را برای پیگیری بیشتر ارسال کنید.',
                    'سپاس از تماس شما. مشکل شما در حال بررسی است.'
                ];
                const response = responses[Math.floor(Math.random() * responses.length)];
                const responseElement = document.createElement('div');
                responseElement.className = 'message received';
                responseElement.innerHTML = `
                    ${response}
                    <div class="message-time">${new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</div>
                `;
                chatMessages.appendChild(responseElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        } else if (!currentUser) {
            showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
        }
    });

    // ذخیره پروفایل
    document.getElementById('saveProfile')?.addEventListener('click', () => {
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

    // مدیریت تب‌های ادمین
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // حذف کلاس active از همه تب‌ها
            document.querySelectorAll('.admin-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // حذف کلاس active از همه محتواها
            document.querySelectorAll('.admin-tab-content').forEach(c => {
                c.classList.remove('active');
            });
            
            // اضافه کردن کلاس active به تب انتخاب شده
            tab.classList.add('active');
            
            // نمایش محتوای مربوطه
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });

    // دکمه ثبت امتیاز
    document.getElementById('submitRating')?.addEventListener('click', () => {
        const stars = document.querySelectorAll('.rating-star.active');
        const rating = stars.length;
        const comment = document.getElementById('ratingComment').value;
        const tripId = document.getElementById('ratingModal').getAttribute('data-trip-id');
        
        if (rating === 0) {
            showNotification('لطفاً به راننده امتیاز دهید', 'error');
            return;
        }
        
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
        
        document.getElementById('ratingModal').style.display = 'none';
        document.getElementById('ratingComment').value = '';
        document.querySelectorAll('.rating-star').forEach(star => {
            star.classList.remove('active');
        });
        
        showNotification('امتیاز شما با موفقیت ثبت شد', 'success');
        loadMyTrips();
    });

    // دکمه پرداخت
    document.getElementById('confirmPayment')?.addEventListener('click', () => {
        const trip = Trip.findById(currentTripId);
        if (!trip) {
            showNotification('سفر یافت نشد', 'error');
            return;
        }
        
        // بررسی پرداخت با کیف پول
        if (selectedPaymentMethod === 'wallet') {
            if (!currentUser || currentUser.wallet_balance < currentPrice) {
                showNotification('موجودی کیف پول شما کافی نیست', 'error');
                return;
            }
            
            // کسر از کیف پول
            currentUser.wallet_balance -= currentPrice;
            currentUser.save();
            localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
        }
        
        // به‌روزرسانی وضعیت سفر
        trip.status = 'completed';
        trip.completed_at = new Date().toISOString();
        trip.save();
        
        document.getElementById('paymentModal').style.display = 'none';
        showNotification('پرداخت با موفقیت انجام شد. سفر تکمیل شد.', 'success');
        openRatingModal(currentTripId);
    });

    // دکمه پرداخت با کیف پول
    document.getElementById('payWithWalletBtn')?.addEventListener('click', () => {
        selectedPaymentMethod = 'wallet';
        openPaymentModal();
    });

    // دکمه پرداخت نقدی
    document.getElementById('payWithCashBtn')?.addEventListener('click', () => {
        selectedPaymentMethod = 'cash';
        openPaymentModal();
    });

    // مدیریت بازکردن نقشه در صفحه اصلی
    document.getElementById('openMapBtn')?.addEventListener('click', () => {
        const pickupInput = document.getElementById('pickup');
        const destinationInput = document.getElementById('destination');
        
        if (!pickupInput.value && !destinationInput.value) {
            showNotification('لطفاً روی نقشه کلیک کنید تا مبدا یا مقصد را انتخاب کنید', 'info');
        }
    });

    // راهنما برای انتخاب از نقشه
    document.getElementById('mapHelpBtn')?.addEventListener('click', () => {
        showNotification('برای انتخاب مبدا یا مقصد: 1. روی نقشه کلیک کنید 2. روی هر مکان شناخته شده کلیک کنید 3. از لیست مناطق انتخاب کنید', 'info');
    });

    // شارژ کیف پول
    document.getElementById('chargeWalletBtn')?.addEventListener('click', () => {
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

    // نمایش و پنهان کردن رمز عبور
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                this.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
    });

    // تغییر بین تب‌های ورود و ثبت‌نام
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // حذف کلاس active از همه تب‌ها
            document.querySelectorAll('.form-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // حذف کلاس active از همه محتواها
            document.querySelectorAll('.form-tab-content').forEach(c => {
                c.classList.remove('active');
            });
            
            // اضافه کردن کلاس active به تب انتخاب شده
            this.classList.add('active');
            
            // نمایش محتوای مربوطه
            document.getElementById(`${tabId}-tab`).classList.add('active');
            clearErrors();
        });
    });

    // دکمه لغو سفر در مدال راننده
    document.getElementById('cancelRide')?.addEventListener('click', () => {
        if (confirm('آیا از لغو این سفر مطمئن هستید؟')) {
            document.getElementById('driverModal').style.display = 'none';
            
            const trip = Trip.findById(currentTripId);
            if (trip) {
                trip.status = 'cancelled';
                trip.save();
            }
            
            showNotification('سفر لغو شد', 'warning');
        }
    });
    
    // ویژگی جدید: گزارش گیری از سفرها
    document.getElementById('generateReport')?.addEventListener('click', () => {
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
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content" style="width: 600px; max-height: 80vh;">
                <div class="modal-header">
                    <h3>گزارش سفرهای شما</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body" style="overflow-y: auto;">
                    <pre style="white-space: pre-wrap; font-family: inherit; background: var(--bg-light); padding: 15px; border-radius: 5px;">${reportText}</pre>
                </div>
                <div class="modal-footer" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border);">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">بستن</button>
                    <button class="btn-primary" onclick="downloadReport('${encodeURIComponent(reportText)}')">
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
    });
};

function createRequiredElements() {
    // ایجاد notification element اگر وجود ندارد
    if (!document.getElementById('notification')) {
        const notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        notification.style.display = 'none';
        document.body.appendChild(notification);
    }
    
    // ایجاد overlay برای موبایل
    if (!document.getElementById('overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.className = 'overlay';
        overlay.style.display = 'none';
        document.body.appendChild(overlay);
    }
    
    // ایجاد منوی موبایل
    if (!document.getElementById('mobileMenu')) {
        const mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobileMenu';
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-header">
                <h3>منو</h3>
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
        document.getElementById('mobileLoginBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            openAuthModal();
            closeMobileMenu();
        });
        
        // دکمه خروج در موبایل
        document.getElementById('mobileLogoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            closeMobileMenu();
        });
        
        // دکمه گزارش در موبایل
        document.getElementById('generateReportBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('generateReport')?.click();
            closeMobileMenu();
        });
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

// ویژگی جدید: تنظیمات سیستم
function loadSettings() {
    if (!isAdmin) return;
    
    const settings = new Settings().getAll();
    
    document.getElementById('appName')?.value = settings.app_name;
    document.getElementById('currency')?.value = settings.currency;
    document.getElementById('baseFareEconomy')?.value = settings.base_fare_economy;
    document.getElementById('baseFareComfort')?.value = settings.base_fare_comfort;
    document.getElementById('baseFareBike')?.value = settings.base_fare_bike;
    document.getElementById('distanceRate')?.value = settings.distance_rate;
    document.getElementById('driverCommission')?.value = settings.driver_commission * 100;
    document.getElementById('minWalletBalance')?.value = settings.min_wallet_balance;
    document.getElementById('maxWalletBalance')?.value = settings.max_wallet_balance;
    document.getElementById('supportPhone')?.value = settings.support_phone;
    document.getElementById('supportEmail')?.value = settings.support_email;
}

// ذخیره تنظیمات
document.getElementById('saveSettings')?.addEventListener('click', () => {
    if (!isAdmin) {
        showNotification('شما دسترسی ندارید', 'error');
        return;
    }
    
    const settings = new Settings();
    
    settings.set('app_name', document.getElementById('appName').value);
    settings.set('currency', document.getElementById('currency').value);
    settings.set('base_fare_economy', parseInt(document.getElementById('baseFareEconomy').value));
    settings.set('base_fare_comfort', parseInt(document.getElementById('baseFareComfort').value));
    settings.set('base_fare_bike', parseInt(document.getElementById('baseFareBike').value));
    settings.set('distance_rate', parseInt(document.getElementById('distanceRate').value));
    settings.set('driver_commission', parseInt(document.getElementById('driverCommission').value) / 100);
    settings.set('min_wallet_balance', parseInt(document.getElementById('minWalletBalance').value));
    settings.set('max_wallet_balance', parseInt(document.getElementById('maxWalletBalance').value));
    settings.set('support_phone', document.getElementById('supportPhone').value);
    settings.set('support_email', document.getElementById('supportEmail').value);
    
    showNotification('تنظیمات با موفقیت ذخیره شد', 'success');
});

// ویژگی جدید: ارسال نوتیفیکیشن به کاربران
function sendNotificationToUser(userId, title, message) {
    const notification = {
        id: Date.now(),
        user_id: userId,
        title: title,
        message: message,
        read: false,
        created_at: new Date().toISOString()
    };
    
    let notifications = storage.get('snapp_notifications');
    notifications.push(notification);
    storage.set('snapp_notifications', notifications);
    
    // اگر کاربر آنلاین باشد، نوتیفیکیشن را نشان بده
    if (currentUser && currentUser.id === userId) {
        showNotification(`${title}: ${message}`, 'info');
    }
}

// ویژگی جدید: سیستم امتیازدهی و پاداش
function calculateRewardPoints(trip) {
    // محاسبه امتیازات بر اساس هزینه سفر
    const points = Math.floor(trip.price / 10);
    
    // ذخیره امتیازات کاربر
    const user = User.findById(trip.user_id);
    if (user) {
        user.reward_points = (user.reward_points || 0) + points;
        user.save();
        
        // ارسال نوتیفیکیشن
        sendNotificationToUser(user.id, 'امتیاز پاداش', `${points} امتیاز برای سفر شما اضافه شد!`);
    }
    
    return points;
}