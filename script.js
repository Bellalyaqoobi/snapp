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
        this.total_ratings = data.total_ratings || 0;
        
        // اطلاعات احراز هویت
        this.tazkira_number = data.tazkira_number || '';
        this.tazkira_image = data.tazkira_image || '';
        this.profile_image = data.profile_image || '';
        this.whatsapp_number = data.whatsapp_number || '';
        this.verified_whatsapp = data.verified_whatsapp || false;
        this.verified_email = data.verified_email || false;
        
        // برای رانندگان
        if (data.role === 'driver') {
            this.vehicle_type = data.vehicle_type || 'car';
            this.car_model = data.car_model || '';
            this.car_color = data.car_color || '';
            this.plate_number = data.plate_number || '';
            this.driver_license = data.driver_license || '';
            this.license_image = data.license_image || '';
            this.driver_status = data.driver_status || 'active';
            this.rating = data.rating || 4.5;
            this.total_trips = data.total_trips || 0;
            this.current_location = data.current_location || [34.5250, 69.1800];
            this.online_status = data.online_status || 'offline';
            this.earning = data.earning || 0;
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

    updateRating(newRating) {
        const totalScore = (this.rating * this.total_ratings) + newRating;
        this.total_ratings += 1;
        this.rating = (totalScore / this.total_ratings).toFixed(1);
        this.save();
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
        this.user_review = data.user_review || '';
        this.driver_review = data.driver_review || '';
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

    static findByDriverId(driverId) {
        const trips = storage.get('snapp_trips');
        return trips
            .filter(t => t.driver_id === driverId)
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
        this.min_order = data.min_order || 0;
        this.description = data.description || '';
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
            .filter(d => new Date(d.expiry_date) > now && d.used_count < d.max_uses)
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
        this.priority = data.priority || 'medium';
        this.category = data.category || 'general';
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

// کلاس Notification برای مدیریت اعلان‌ها
class Notification {
    constructor(data) {
        this.id = data.id || Date.now();
        this.user_id = data.user_id;
        this.title = data.title;
        this.message = data.message;
        this.type = data.type || 'info';
        this.read = data.read || false;
        this.created_at = data.created_at || new Date().toISOString();
        this.link = data.link || '';
    }

    save() {
        let notifications = storage.get('snapp_notifications');
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
        return notifications
            .filter(n => n.user_id === userId)
            .map(data => new Notification(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    static markAllAsRead(userId) {
        let notifications = storage.get('snapp_notifications');
        notifications = notifications.map(n => {
            if (n.user_id === userId) {
                n.read = true;
            }
            return n;
        });
        storage.set('snapp_notifications', notifications);
    }
}

// کلاس WalletTransaction برای مدیریت تراکنش‌های کیف پول
class WalletTransaction {
    constructor(data) {
        this.id = data.id || Date.now();
        this.user_id = data.user_id;
        this.amount = data.amount;
        this.type = data.type; // deposit, withdrawal, payment, refund, bonus
        this.description = data.description;
        this.status = data.status || 'completed';
        this.created_at = data.created_at || new Date().toISOString();
        this.reference_id = data.reference_id || '';
    }

    save() {
        let transactions = storage.get('snapp_wallet_transactions');
        const index = transactions.findIndex(t => t.id === this.id);
        if (index !== -1) {
            transactions[index] = this;
        } else {
            transactions.push(this);
        }
        storage.set('snapp_wallet_transactions', transactions);
    }

    static findByUserId(userId) {
        const transactions = storage.get('snapp_wallet_transactions');
        return transactions
            .filter(t => t.user_id === userId)
            .map(data => new WalletTransaction(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
}

// توابع کمکی
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
    
    // ذخیره اعلان برای کاربر
    if (currentUser) {
        const notificationObj = new Notification({
            user_id: currentUser.id,
            title: type === 'success' ? 'عملیات موفق' : 
                   type === 'error' ? 'خطا' : 
                   type === 'warning' ? 'هشدار' : 'اطلاعیه',
            message: message,
            type: type
        });
        notificationObj.save();
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('.form-input').forEach(el => {
        el.style.borderColor = '';
    });
}

function showError(inputId, message) {
    const errorElement = document.getElementById(inputId + 'Error');
    const inputElement = document.getElementById(inputId);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.style.borderColor = 'var(--accent)';
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fa-AF').format(amount) + ' افغانی';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR');
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

// مدیریت نقشه
function initMap() {
    try {
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

function addSearchControl() {
    const searchControl = L.control({ position: 'topright' });
    
    searchControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'search-control');
        div.innerHTML = `
            <div class="search-input-container">
                <input type="text" id="mapSearch" placeholder="جستجوی مکان..." class="search-input">
                <button id="searchBtn" class="search-btn">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        `;
        return div;
    };
    
    searchControl.addTo(map);
    
    // اضافه کردن event listener برای جستجو
    document.getElementById('searchBtn')?.addEventListener('click', () => {
        const searchInput = document.getElementById('mapSearch');
        if (searchInput) {
            searchLocation(searchInput.value);
        }
    });
    
    document.getElementById('mapSearch')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchLocation(e.target.value);
        }
    });
}

function searchLocation(query) {
    if (!query.trim()) return;
    
    // جستجو در میان مکان‌های شناخته شده
    const foundLocation = kabulData.locations.find(loc => 
        loc.name.includes(query) || query.includes(loc.name)
    );
    
    if (foundLocation) {
        map.setView(foundLocation.coordinates, 15);
        L.marker(foundLocation.coordinates)
            .addTo(map)
            .bindPopup(`<b>${foundLocation.name}</b><br><button class="select-location-btn" data-name="${foundLocation.name}">انتخاب این مکان</button>`)
            .openPopup();
        
        // اضافه کردن event listener برای دکمه انتخاب
        setTimeout(() => {
            document.querySelector('.select-location-btn')?.addEventListener('click', function() {
                const locationName = this.getAttribute('data-name');
                handleLocationSelection(locationName);
            });
        }, 100);
    } else {
        showNotification('مکان مورد نظر یافت نشد', 'warning');
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
                <span class="close-modal">&times;</span>
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
            html: '<div style="background: var(--primary); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><i class="fas fa-circle"></i></div>',
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
            html: '<div style="background: var(--accent); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><i class="fas fa-flag-checkered"></i></div>',
            className: 'destination-marker',
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
            html: `<div style="background: var(--primary); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
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
                <span class="close-modal">&times;</span>
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
    
    selectionModal.querySelector('.close-modal').addEventListener('click', () => {
        selectionModal.remove();
    });
    
    document.getElementById('setAsPickup').addEventListener('click', () => {
        setPickupLocation(locationName, coordinates);
        selectionModal.remove();
        showNotification(`مبدا به "${locationName}" تنظیم شد`, 'success');
    });
    
    document.getElementById('setAsDestination').addEventListener('click', () => {
        setDestinationLocation(locationName, coordinates);
        selectionModal.remove();
        showNotification(`مقصد به "${locationName}" تنظیم شد`, 'success');
    });
    
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
                <span class="close-modal">&times;</span>
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
    
    selectionModal.querySelector('.close-modal').addEventListener('click', () => {
        selectionModal.remove();
    });
    
    document.getElementById('setDistrictAsPickup').addEventListener('click', () => {
        const pickupInput = document.getElementById('pickup');
        if (pickupInput) {
            pickupInput.value = districtName;
            showNotification(`مبدا به "${districtName}" تنظیم شد`, 'success');
        }
        selectionModal.remove();
        calculateDistanceAndPrice();
    });
    
    document.getElementById('setDistrictAsDestination').addEventListener('click', () => {
        const destinationInput = document.getElementById('destination');
        if (destinationInput) {
            destinationInput.value = districtName;
            showNotification(`مقصد به "${districtName}" تنظیم شد`, 'success');
        }
        selectionModal.remove();
        calculateDistanceAndPrice();
    });
    
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

    if (!pickupCoords) {
        const pickupLocation = kabulData.locations.find(loc => loc.name === pickup);
        pickupCoords = pickupLocation?.coordinates;
    }
    
    if (!destinationCoords) {
        const destinationLocation = kabulData.locations.find(loc => loc.name === destination);
        destinationCoords = destinationLocation?.coordinates;
    }

    if (!pickupCoords || !destinationCoords) {
        const randomDistance = (Math.random() * 15 + 2).toFixed(1);
        currentDistance = parseFloat(randomDistance);
    } else {
        currentDistance = calculateDistance(pickupCoords, destinationCoords);
    }

    const distanceValue = document.getElementById('distanceValue');
    if (distanceValue) distanceValue.textContent = `${currentDistance} کیلومتر`;
    
    tripCalculator.classList.add('active');
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
    if (currentDistance === 0) return;

    const selectedRide = document.querySelector('.ride-type.selected');
    if (!selectedRide) return;
    
    const baseFare = parseInt(selectedRide.dataset.baseFare);
    const distanceFare = Math.round(currentDistance * 10);
    const totalFare = baseFare + distanceFare;

    currentPrice = totalFare;

    const baseFareValue = document.getElementById('baseFareValue');
    const distanceFareValue = document.getElementById('distanceFareValue');
    const totalFareValue = document.getElementById('totalFareValue');
    
    if (baseFareValue) baseFareValue.textContent = formatCurrency(baseFare);
    if (distanceFareValue) distanceFareValue.textContent = formatCurrency(distanceFare);
    if (totalFareValue) totalFareValue.textContent = formatCurrency(totalFare);

    const economyPrice = document.getElementById('economyPrice');
    const comfortPrice = document.getElementById('comfortPrice');
    const bikePrice = document.getElementById('bikePrice');
    
    if (economyPrice) economyPrice.textContent = formatCurrency(calculateRidePrice('economy'));
    if (comfortPrice) comfortPrice.textContent = formatCurrency(calculateRidePrice('comfort'));
    if (bikePrice) bikePrice.textContent = formatCurrency(calculateRidePrice('bike'));
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
            user.online_status === 'online' &&
            (rideType === 'bike' ? user.vehicle_type === 'bike' : user.vehicle_type === 'car')
        );

    if (drivers.length === 0) {
        return null;
    }

    let nearestDriver = null;
    let minDistance = Infinity;
    
    drivers.forEach(driver => {
        const distance = Math.random() * 10;
        if (distance < minDistance) {
            minDistance = distance;
            nearestDriver = driver;
        }
    });

    const eta = Math.floor(minDistance * 2 + 3);

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

    const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.routes && data.routes[0]) {
                const route = data.routes[0];
                const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                
                currentRoute = L.polyline(routeCoordinates, {
                    color: '#00D474',
                    weight: 4,
                    opacity: 0.8,
                    dashArray: '10, 10'
                }).addTo(map);
                
                currentDistance = parseFloat((route.distance / 1000).toFixed(1));
                updatePrice();
                
                const startIcon = L.divIcon({
                    html: `<div style="background: var(--primary); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                            <i class="fas fa-circle"></i>
                          </div>`,
                    className: 'start-marker',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                const endIcon = L.divIcon({
                    html: `<div style="background: var(--accent); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
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

                map.fitBounds(currentRoute.getBounds(), { padding: [50, 50] });
            } else {
                drawDirectRoute(startCoords, endCoords);
            }
        })
        .catch(error => {
            console.error('Error drawing route:', error);
            drawDirectRoute(startCoords, endCoords);
        });
}

function drawDirectRoute(startCoords, endCoords) {
    const route = L.polyline([startCoords, endCoords], {
        color: '#00D474',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10'
    }).addTo(map);

    const startIcon = L.divIcon({
        html: `<div style="background: var(--primary); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
                <i class="fas fa-circle"></i>
              </div>`,
        className: 'start-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const endIcon = L.divIcon({
        html: `<div style="background: var(--accent); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
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
    
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker && 
            (layer.options.icon?.options?.className === 'start-marker' || 
             layer.options.icon?.options?.className === 'end-marker')) {
            map.removeLayer(layer);
        }
    });
    
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
    
    const carIcon = L.divIcon({
        html: `<div class="driver-marker" style="font-size: 30px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
                ${isBike ? '🏍️' : '🚗'}
              </div>`,
        className: 'car-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    carMarker = L.marker(startCoords, { icon: carIcon }).addTo(map);

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
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
    if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
    if (userProfile) userProfile.style.display = 'flex';
    
    if (userAvatar && currentUser) {
        userAvatar.textContent = currentUser.name.charAt(0);
        if (currentUser.profile_image) {
            userAvatar.innerHTML = `<img src="${currentUser.profile_image}" alt="${currentUser.name}" style="width: 100%; height: 100%; border-radius: 50%;">`;
        }
    }
    if (userName && currentUser) {
        userName.textContent = currentUser.name;
    }
    
    if (isAdmin) {
        const adminLink = document.getElementById('adminLink');
        const mobileAdminLink = document.getElementById('mobileAdminLink');
        if (adminLink) adminLink.style.display = 'block';
        if (mobileAdminLink) mobileAdminLink.style.display = 'block';
    }
    
    // نمایش وضعیت آنلاین برای رانندگان
    if (currentUser && currentUser.role === 'driver') {
        const onlineStatusBtn = document.getElementById('onlineStatusBtn');
        if (onlineStatusBtn) {
            onlineStatusBtn.style.display = 'block';
            onlineStatusBtn.className = `btn-status ${currentUser.online_status === 'online' ? 'btn-online' : 'btn-offline'}`;
            onlineStatusBtn.innerHTML = currentUser.online_status === 'online' ? 
                '<i class="fas fa-circle"></i> آنلاین' : 
                '<i class="fas fa-circle"></i> آفلاین';
        }
    }
    
    updateProfilePage();
}

function updateUIAfterLogout() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    const userProfile = document.getElementById('userProfile');
    
    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (mobileLoginBtn) mobileLoginBtn.style.display = 'block';
    if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
    if (userProfile) userProfile.style.display = 'none';
    
    const adminLink = document.getElementById('adminLink');
    const mobileAdminLink = document.getElementById('mobileAdminLink');
    if (adminLink) adminLink.style.display = 'none';
    if (mobileAdminLink) mobileAdminLink.style.display = 'none';
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const homePage = document.getElementById('home-page');
    if (homePage) homePage.classList.add('active');
}

function logout() {
    if (currentUser && currentUser.role === 'driver') {
        currentUser.online_status = 'offline';
        currentUser.save();
    }
    
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
                tazkira_number: '123456789',
                verified_email: true,
                verified_whatsapp: true
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
                created_at: new Date().toISOString(),
                tazkira_number: '987654321',
                whatsapp_number: '0700111222',
                verified_email: true,
                verified_whatsapp: true,
                rating: 4.8,
                total_ratings: 15
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
                online_status: 'online',
                earning: 12500,
                created_at: new Date().toISOString(),
                tazkira_number: '456123789',
                verified_email: true,
                verified_whatsapp: true
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
                online_status: 'online',
                earning: 8500,
                created_at: new Date().toISOString(),
                tazkira_number: '789456123',
                verified_email: true,
                verified_whatsapp: true
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
                used_count: 15,
                min_order: 100,
                description: 'تخفیف ویژه اسنپ'
            },
            {
                id: 2,
                code: 'WELCOME10',
                percent: 10,
                expiry_date: futureDate.toISOString(),
                max_uses: 50,
                used_count: 5,
                min_order: 50,
                description: 'تخفیف خوش آمدگویی'
            },
            {
                id: 3,
                code: 'FIRSTRIDE',
                percent: 100,
                expiry_date: futureDate.toISOString(),
                max_uses: 1,
                used_count: 0,
                min_order: 0,
                description: 'سفر اول رایگان'
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
                priority: 'high',
                category: 'payment',
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
    
    let walletTransactions = storage.get('snapp_wallet_transactions');
    
    if (walletTransactions.length === 0) {
        const sampleTransactions = [
            {
                id: 1,
                user_id: 2,
                amount: 5000,
                type: 'deposit',
                description: 'شارژ اولیه کیف پول',
                status: 'completed',
                created_at: new Date(Date.now() - 86400000).toISOString()
            }
        ];
        
        sampleTransactions.forEach(transaction => {
            const transactionObj = new WalletTransaction(transaction);
            transactionObj.save();
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
                    <i class="fas fa-road" style="font-size: 48px; color: var(--gray); margin-bottom: 15px; display: block;"></i>
                    <p style="color: var(--gray);">هیچ سفری یافت نشد</p>
                </td>
            </tr>
        `;
        return;
    }
    
    trips.forEach(trip => {
        const row = document.createElement('tr');
        const date = formatDateTime(trip.created_at);
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
            <td>${date}</td>
            <td>${trip.pickup}</td>
            <td>${trip.destination}</td>
            <td>${rideTypeText}</td>
            <td>${trip.distance} کیلومتر</td>
            <td>${formatCurrency(trip.price)}</td>
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
}

function cancelTrip(tripId) {
    if (confirm('آیا از لغو این سفر مطمئن هستید؟')) {
        const trip = Trip.findById(tripId);
        if (trip) {
            trip.status = 'cancelled';
            trip.save();
            
            // بازگشت پول به کیف پول اگر پرداخت شده بود
            if (trip.payment_method === 'wallet') {
                const user = User.findById(trip.user_id);
                if (user) {
                    user.wallet_balance += trip.price;
                    user.save();
                    
                    const transaction = new WalletTransaction({
                        user_id: user.id,
                        amount: trip.price,
                        type: 'refund',
                        description: `بازگشت هزینه سفر لغو شده #${trip.id}`,
                        status: 'completed'
                    });
                    transaction.save();
                }
            }
            
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
    
    const date = formatDateTime(trip.created_at);
    const rideTypeText = {
        'economy': 'اقتصادی',
        'comfort': 'کلاسیک',
        'bike': 'موتور'
    }[trip.ride_type] || trip.ride_type;
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h3>جزئیات سفر #${trip.id}</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div class="detail-item">
                        <label>تاریخ:</label>
                        <span>${date}</span>
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
                        <span>${formatCurrency(trip.price)}</span>
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
                <div style="background: var(--bg-light); padding: 15px; border-radius: 8px; margin-top: 10px;">
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
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
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
                <i class="fas fa-tag" style="font-size: 48px; color: var(--gray); margin-bottom: 15px; display: block;"></i>
                <p style="color: var(--gray);">هیچ تخفیف فعالی موجود نیست</p>
            </div>
        `;
        return;
    }
    
    discounts.forEach(discount => {
        const discountElement = document.createElement('div');
        discountElement.className = 'discount-card';
        
        const expiryDate = formatDate(discount.expiry_date);
        const progress = (discount.used_count / discount.max_uses) * 100;
        
        discountElement.innerHTML = `
            <div class="discount-header">
                <div class="discount-code">${discount.code}</div>
                <div class="discount-percent">${discount.percent}% تخفیف</div>
            </div>
            <div class="discount-description">
                <p>${discount.description}</p>
            </div>
            <div class="discount-details">
                <div><i class="fas fa-calendar-alt"></i> منقضی: ${expiryDate}</div>
                <div><i class="fas fa-users"></i> استفاده شده: ${discount.used_count} از ${discount.max_uses}</div>
                ${discount.min_order > 0 ? `
                <div><i class="fas fa-money-bill"></i> حداقل سفارش: ${formatCurrency(discount.min_order)}</div>
                ` : ''}
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
    
    document.querySelectorAll('.btn-copy-code').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            navigator.clipboard.writeText(code).then(() => {
                showNotification(`کد ${code} با موفقیت کپی شد`, 'success');
            });
        });
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
    
    if (profileAvatar) {
        if (currentUser.profile_image) {
            profileAvatar.innerHTML = `<img src="${currentUser.profile_image}" alt="${currentUser.name}">`;
        } else {
            profileAvatar.textContent = currentUser.name.charAt(0);
        }
    }
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profilePhone) profilePhone.textContent = currentUser.phone;
    if (profileRole) profileRole.textContent = currentUser.role === 'passenger' ? 'مسافر' : 'راننده';
    
    if (editName) editName.value = currentUser.name;
    if (editEmail) editEmail.value = currentUser.email;
    if (editPhone) editPhone.value = currentUser.phone;
    if (walletBalance) walletBalance.textContent = formatCurrency(currentUser.wallet_balance);
    
    // محاسبه آمار
    const trips = Trip.findByUserId(currentUser.id);
    const totalTrips = trips.length;
    const totalSpent = trips.reduce((sum, trip) => sum + (trip.price || 0), 0);
    const userRating = currentUser.rating || 4.7;
    
    const totalTripsCount = document.getElementById('totalTripsCount');
    const totalSpentElement = document.getElementById('totalSpent');
    const userRatingElement = document.getElementById('userRating');
    
    if (totalTripsCount) totalTripsCount.textContent = totalTrips;
    if (totalSpentElement) totalSpentElement.textContent = formatCurrency(totalSpent);
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
                <div class="detail-item">
                    <label>درآمد کل:</label>
                    <span>${formatCurrency(currentUser.earning || 0)}</span>
                </div>
                <div class="detail-item">
                    <label>وضعیت آنلاین:</label>
                    <span class="status-badge ${currentUser.online_status === 'online' ? 'status-online' : 'status-offline'}">
                        ${currentUser.online_status === 'online' ? 'آنلاین' : 'آفلاین'}
                    </span>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <button class="btn-toggle-online" onclick="toggleOnlineStatus()" style="width: 100%;">
                    ${currentUser.online_status === 'online' ? 
                      '<i class="fas fa-toggle-on"></i> تغییر به آفلاین' : 
                      '<i class="fas fa-toggle-off"></i> تغییر به آنلاین'}
                </button>
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
    
    // بارگذاری تراکنش‌های کیف پول
    loadWalletTransactions();
}

function uploadProfileImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                currentUser.profile_image = imageData;
                currentUser.save();
                localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
                updateProfilePage();
                showNotification('عکس پروفایل با موفقیت آپلود شد', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

function toggleOnlineStatus() {
    if (!currentUser || currentUser.role !== 'driver') return;
    
    currentUser.online_status = currentUser.online_status === 'online' ? 'offline' : 'online';
    currentUser.save();
    localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
    
    const statusText = currentUser.online_status === 'online' ? 'آنلاین' : 'آفلاین';
    showNotification(`وضعیت شما به ${statusText} تغییر یافت`, 'success');
    updateProfilePage();
}

function loadWalletTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) return;
    
    transactionsList.innerHTML = '';
    const transactions = WalletTransaction.findByUserId(currentUser.id);
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-exchange-alt" style="font-size: 48px; color: var(--gray); margin-bottom: 15px; display: block;"></i>
                <p style="color: var(--gray);">هیچ تراکنشی یافت نشد</p>
            </div>
        `;
        return;
    }
    
    transactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        
        const date = formatDateTime(transaction.created_at);
        const amountClass = transaction.amount >= 0 ? 'positive' : 'negative';
        const typeText = {
            'deposit': 'شارژ کیف پول',
            'withdrawal': 'برداشت',
            'payment': 'پرداخت سفر',
            'refund': 'بازگشت وجه',
            'bonus': 'جایزه'
        }[transaction.type] || transaction.type;
        
        transactionElement.innerHTML = `
            <div class="transaction-header">
                <div class="transaction-type">
                    <i class="fas ${transaction.type === 'deposit' ? 'fa-plus-circle' : 
                                     transaction.type === 'withdrawal' ? 'fa-minus-circle' : 
                                     transaction.type === 'payment' ? 'fa-car' : 
                                     transaction.type === 'refund' ? 'fa-undo' : 'fa-gift'}"></i>
                    <span>${typeText}</span>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${transaction.amount >= 0 ? '+' : ''}${formatCurrency(transaction.amount)}
                </div>
            </div>
            <div class="transaction-details">
                <div><i class="far fa-clock"></i> ${date}</div>
                <div><i class="far fa-file-alt"></i> ${transaction.description}</div>
            </div>
            <div class="transaction-status">
                <span class="status-badge status-${transaction.status}">
                    ${transaction.status === 'completed' ? 'تکمیل شده' : 
                      transaction.status === 'pending' ? 'در انتظار' : 'ناموفق'}
                </span>
            </div>
        `;
        
        transactionsList.appendChild(transactionElement);
    });
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
    
    const totalTripsElement = document.getElementById('totalTrips');
    const activeUsersElement = document.getElementById('activeUsers');
    const totalDriversElement = document.getElementById('totalDrivers');
    const totalRevenueElement = document.getElementById('totalRevenue');
    
    if (totalTripsElement) totalTripsElement.textContent = trips.length;
    if (activeUsersElement) activeUsersElement.textContent = users.filter(u => u.status === 'approved').length;
    if (totalDriversElement) totalDriversElement.textContent = users.filter(u => u.role === 'driver' && u.status === 'approved').length;
    
    const totalRevenue = trips.reduce((sum, trip) => sum + (trip.price || 0), 0);
    if (totalRevenueElement) totalRevenueElement.textContent = formatCurrency(totalRevenue);
}

// بارگذاری صفحه اصلی
window.onload = function() {
    initMap();
    checkUserLoginStatus();
    
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
        
        const tempCoords = selectedPickupCoords;
        selectedPickupCoords = selectedDestinationCoords;
        selectedDestinationCoords = tempCoords;
        
        if (pickupMarker && destinationMarker) {
            const tempMarker = pickupMarker;
            pickupMarker = destinationMarker;
            destinationMarker = tempMarker;
            
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
        
        document.getElementById('driverAvatar').textContent = nearestDriver.name.charAt(0);
        document.getElementById('driverName').textContent = nearestDriver.name;
        document.getElementById('driverRating').textContent = nearestDriver.rating;
        document.getElementById('driverTrips').textContent = `(${nearestDriver.total_trips} سفر)`;
        document.getElementById('carModel').textContent = nearestDriver.car_model || '---';
        document.getElementById('carColor').textContent = nearestDriver.car_color || '---';
        document.getElementById('plateNumber').textContent = nearestDriver.plate_number || '---';
        document.getElementById('eta').textContent = nearestDriver.eta;
        document.getElementById('distance').textContent = nearestDriver.distance;
        document.getElementById('price').textContent = formatCurrency(currentPrice);
        
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
        
        const trip = Trip.findById(currentTripId);
        if (trip) {
            trip.status = 'confirmed';
            trip.driver_id = currentDriver.id;
            trip.driver_name = currentDriver.name;
            trip.started_at = new Date().toISOString();
            trip.save();
        }
        
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
        
        drawRoute(pickupCoords, destinationCoords);
        startTripTracking(currentDriver, pickupCoords, destinationCoords);
        showNotification('سفر شما با موفقیت ثبت شد. راننده به زودی با شما تماس خواهد گرفت.', 'success');
        
        document.getElementById('rideForm').reset();
        document.getElementById('tripCalculator').classList.remove('active');
        
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

    // محاسبه مسافت
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
    document.getElementById('mobileLoginBtn')?.addEventListener('click', openAuthModal);

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

    // تغییر بین تب‌های ورود و ثبت‌نام
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            document.querySelectorAll('.form-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            document.querySelectorAll('.form-tab-content').forEach(c => {
                c.classList.remove('active');
            });
            
            this.classList.add('active');
            
            document.getElementById(`${tabId}-tab`).classList.add('active');
            clearErrors();
        });
    });

    // مدیریت ثبت‌نام
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const phone = document.getElementById('registerPhone').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const userType = document.getElementById('userType').value;
        const tazkiraNumber = document.getElementById('tazkiraNumber').value.trim();
        const whatsappNumber = document.getElementById('whatsappNumber').value.trim();
        const profileImageInput = document.getElementById('profileImage');
        const tazkiraImageInput = document.getElementById('tazkiraImage');
        const licenseImageInput = document.getElementById('licenseImage');
        
        // اعتبارسنجی
        let isValid = true;
        
        if (name.length < 2) {
            showError('registerName', 'نام باید حداقل ۲ حرف داشته باشد');
            isValid = false;
        }
        
        if (!email.includes('@')) {
            showError('registerEmail', 'لطفاً یک ایمیل معتبر وارد کنید');
            isValid = false;
        }
        
        if (phone.length < 10) {
            showError('registerPhone', 'لطفاً یک شماره تماس معتبر وارد کنید');
            isValid = false;
        }
        
        if (password.length < 6) {
            showError('registerPassword', 'رمز عبور باید حداقل ۶ حرف داشته باشد');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            showError('registerConfirmPassword', 'رمز عبور و تکرار آن مطابقت ندارند');
            isValid = false;
        }
        
        if (!userType) {
            showError('userType', 'لطفاً نوع کاربر را انتخاب کنید');
            isValid = false;
        }
        
        if (!tazkiraNumber) {
            showError('tazkiraNumber', 'شماره تذکره الزامی است');
            isValid = false;
        }
        
        if (!profileImageInput.files[0]) {
            showError('profileImage', 'عکس پروفایل الزامی است');
            isValid = false;
        }
        
        if (!tazkiraImageInput.files[0]) {
            showError('tazkiraImage', 'عکس تذکره الزامی است');
            isValid = false;
        }
        
        if (userType === 'driver' && !licenseImageInput?.files[0]) {
            showError('licenseImage', 'عکس گواهینامه الزامی است');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // بررسی تکراری نبودن ایمیل
        const existingUser = User.getAll().find(u => u.email === email);
        if (existingUser) {
            showError('registerEmail', 'این ایمیل قبلاً ثبت شده است');
            return;
        }
        
        // خواندن فایل‌ها به صورت Data URL
        const readFileAsDataURL = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(file);
            });
        };
        
        try {
            const [profileImage, tazkiraImage, licenseImage] = await Promise.all([
                readFileAsDataURL(profileImageInput.files[0]),
                readFileAsDataURL(tazkiraImageInput.files[0]),
                userType === 'driver' ? readFileAsDataURL(licenseImageInput.files[0]) : Promise.resolve('')
            ]);
            
            // اطلاعات راننده
            let driverInfo = {};
            if (userType === 'driver') {
                const vehicleType = document.getElementById('vehicleType').value;
                const carModel = document.getElementById('carModel').value.trim();
                const carColor = document.getElementById('carColor').value.trim();
                const plateNumber = document.getElementById('plateNumber').value.trim();
                const driverLicense = document.getElementById('driverLicense').value.trim();
                
                driverInfo = {
                    vehicle_type: vehicleType || 'car',
                    car_model: carModel || '',
                    car_color: carColor || '',
                    plate_number: plateNumber || '',
                    driver_license: driverLicense || '',
                    license_image: licenseImage || '',
                    driver_status: 'pending',
                    online_status: 'offline',
                    earning: 0
                };
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
                wallet_balance: userType === 'passenger' ? 5000 : 0,
                tazkira_number: tazkiraNumber,
                tazkira_image: tazkiraImage,
                profile_image: profileImage,
                whatsapp_number: whatsappNumber,
                verified_email: false,
                verified_whatsapp: false,
                ...driverInfo
            });
            
            user.save();
            
            showNotification('ثبت‌نام شما با موفقیت انجام شد. پس از تایید مدیر می‌توانید وارد شوید.', 'success');
            document.getElementById('registerForm').reset();
            
            // تغییر به تب ورود
            document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.form-tab-content').forEach(c => c.classList.remove('active'));
            document.querySelector('.form-tab[data-tab="login"]').classList.add('active');
            document.getElementById('login-tab').classList.add('active');
            
        } catch (error) {
            console.error('Error processing registration:', error);
            showNotification('خطا در پردازش اطلاعات ثبت‌نام', 'error');
        }
    });

    // نمایش/پنهان کردن فیلدهای راننده
    document.getElementById('userType')?.addEventListener('change', function() {
        const userType = this.value;
        const driverFields = document.getElementById('driverFields');
        
        if (driverFields) {
            driverFields.style.display = userType === 'driver' ? 'block' : 'none';
        }
    });

    // نمایش/پنهان کردن رمز عبور
    document.querySelectorAll('.password-toggle').forEach(toggle => {
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

    // مدیریت خروج
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    document.getElementById('mobileLogoutBtn')?.addEventListener('click', logout);

    // مدیریت منوی موبایل
    document.getElementById('hamburger')?.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.add('active');
        document.getElementById('overlay').classList.add('active');
        document.getElementById('hamburger').classList.add('active');
    });

    document.getElementById('closeMenu')?.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        document.getElementById('hamburger').classList.remove('active');
    });

    document.getElementById('overlay')?.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        document.getElementById('hamburger').classList.remove('active');
    });

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
            document.getElementById('mobileMenu')?.classList.remove('active');
            document.getElementById('overlay')?.classList.remove('active');
            document.getElementById('hamburger')?.classList.remove('active');
            
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
                message: message,
                category: 'general'
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
            
            document.querySelectorAll('.admin-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            document.querySelectorAll('.admin-tab-content').forEach(c => {
                c.classList.remove('active');
            });
            
            tab.classList.add('active');
            
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });

    // شارژ کیف پول
    document.getElementById('chargeWalletBtn')?.addEventListener('click', () => {
        const amount = prompt('مبلغ مورد نظر برای شارژ کیف پول (افغانی):');
        if (amount && !isNaN(amount) && parseInt(amount) > 0) {
            const chargeAmount = parseInt(amount);
            currentUser.wallet_balance += chargeAmount;
            currentUser.save();
            localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
            
            // ثبت تراکنش
            const transaction = new WalletTransaction({
                user_id: currentUser.id,
                amount: chargeAmount,
                type: 'deposit',
                description: 'شارژ کیف پول',
                status: 'completed'
            });
            transaction.save();
            
            updateProfilePage();
            showNotification(`کیف پول شما به مبلغ ${formatCurrency(chargeAmount)} شارژ شد`, 'success');
        } else if (amount !== null) {
            showNotification('لطفاً مبلغ معتبر وارد کنید', 'error');
        }
    });

    // ثبت امتیاز
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
                driver.updateRating(rating);
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

    // مدیریت مدال پرداخت
    document.getElementById('payWithCashBtn')?.addEventListener('click', () => {
        const trip = Trip.findById(currentTripId);
        if (!trip) return;
        
        trip.status = 'completed';
        trip.completed_at = new Date().toISOString();
        trip.save();
        
        document.getElementById('paymentModal').style.display = 'none';
        showNotification('پرداخت نقدی ثبت شد. سفر تکمیل شد.', 'success');
        openRatingModal(currentTripId);
    });

    document.getElementById('payWithWalletBtn')?.addEventListener('click', () => {
        const trip = Trip.findById(currentTripId);
        if (!trip) return;
        
        if (!currentUser || currentUser.wallet_balance < currentPrice) {
            showNotification('موجودی کیف پول شما کافی نیست', 'error');
            return;
        }
        
        // کسر از کیف پول
        currentUser.wallet_balance -= currentPrice;
        currentUser.save();
        localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
        
        // ثبت تراکنش
        const transaction = new WalletTransaction({
            user_id: currentUser.id,
            amount: -currentPrice,
            type: 'payment',
            description: `پرداخت هزینه سفر #${trip.id}`,
            status: 'completed'
        });
        transaction.save();
        
        // اضافه کردن درآمد به راننده
        const driver = User.findById(trip.driver_id);
        if (driver) {
            driver.earning += currentPrice;
            driver.save();
        }
        
        trip.status = 'completed';
        trip.completed_at = new Date().toISOString();
        trip.save();
        
        document.getElementById('paymentModal').style.display = 'none';
        showNotification('پرداخت با موفقیت انجام شد. سفر تکمیل شد.', 'success');
        openRatingModal(currentTripId);
    });

    // نمایش/پنهان کردن بخش پرداخت کیف پول
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            const methodType = this.getAttribute('data-method');
            const walletPayment = document.getElementById('walletPayment');
            const cashPayment = document.getElementById('cashPayment');
            
            if (methodType === 'wallet') {
                walletPayment.style.display = 'block';
                cashPayment.style.display = 'none';
                
                // به‌روزرسانی موجودی کیف پول
                if (currentUser) {
                    document.getElementById('walletBalanceModal').textContent = formatCurrency(currentUser.wallet_balance);
                }
            } else {
                walletPayment.style.display = 'none';
                cashPayment.style.display = 'block';
            }
        });
    });
};

// تابع برای باز کردن مدال احراز هویت
function openAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'flex';
        clearErrors();
    }
}

// تابع برای باز کردن مدال امتیازدهی
function openRatingModal(tripId = null) {
    const ratingModal = document.getElementById('ratingModal');
    if (ratingModal) {
        ratingModal.style.display = 'flex';
        if (tripId) {
            ratingModal.setAttribute('data-trip-id', tripId);
        }
    }
}

// تابع برای باز کردن مدال پرداخت
function openPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'flex';
        
        // به‌روزرسانی اطلاعات پرداخت
        const paymentDistance = document.getElementById('paymentDistance');
        const paymentPrice = document.getElementById('paymentPrice');
        
        if (paymentDistance) paymentDistance.textContent = `${currentDistance} کیلومتر`;
        if (paymentPrice) paymentPrice.textContent = formatCurrency(currentPrice);
        
        // تنظیم مجدد انتخاب روش پرداخت
        document.querySelectorAll('.payment-method').forEach(method => {
            method.classList.remove('selected');
            if (method.getAttribute('data-method') === selectedPaymentMethod) {
                method.classList.add('selected');
            }
        });
        
        // نمایش بخش مربوط به روش پرداخت انتخاب شده
        const walletPayment = document.getElementById('walletPayment');
        const cashPayment = document.getElementById('cashPayment');
        
        if (selectedPaymentMethod === 'wallet') {
            if (walletPayment) walletPayment.style.display = 'block';
            if (cashPayment) cashPayment.style.display = 'none';
            
            // به‌روزرسانی موجودی کیف پول
            if (currentUser) {
                const walletBalanceModal = document.getElementById('walletBalanceModal');
                if (walletBalanceModal) {
                    walletBalanceModal.textContent = formatCurrency(currentUser.wallet_balance);
                }
            }
        } else {
            if (walletPayment) walletPayment.style.display = 'none';
            if (cashPayment) cashPayment.style.display = 'block';
        }
    }
}

// استایل‌های اضافی
const additionalStyles = `
/* استایل‌های عمومی */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    display: none;
    max-width: 400px;
    animation: slideIn 0.3s ease;
}

.notification.success {
    border-right: 4px solid #00D474;
}

.notification.error {
    border-right: 4px solid #FF4D4D;
}

.notification.warning {
    border-right: 4px solid #FFA500;
}

.notification.info {
    border-right: 4px solid #2196F3;
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

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-title {
    margin: 0;
    font-size: 18px;
    color: var(--text);
}

.close-modal {
    font-size: 24px;
    cursor: pointer;
    color: var(--gray);
}

.close-modal:hover {
    color: var(--text);
}

.error-message {
    color: var(--accent);
    font-size: 12px;
    margin-top: 5px;
    display: none;
}

.status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.status-requested, .status-pending {
    background: #FFF3E0;
    color: #F57C00;
}

.status-confirmed, .status-active, .status-online {
    background: #E8F5E9;
    color: #00D474;
}

.status-in_progress {
    background: #E3F2FD;
    color: #2196F3;
}

.status-completed, .status-approved {
    background: #E8F5E9;
    color: #00D474;
}

.status-cancelled, .status-rejected, .status-inactive, .status-offline {
    background: #FFEBEE;
    color: #FF4D4D;
}

/* استایل‌های ردیابی */
.live-tracking {
    position: absolute;
    top: 20px;
    left: 20px;
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    max-width: 300px;
}

.tracking-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.tracking-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.tracking-label {
    color: var(--gray);
}

.tracking-value {
    font-weight: 600;
}

.progress-container {
    margin-top: 15px;
}

.progress-bar {
    height: 6px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
    margin: 5px 0;
}

.progress-fill {
    height: 100%;
    background: var(--primary);
    width: 0%;
    transition: width 0.3s ease;
}

.progress-text {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--gray);
}

/* استایل‌های فرم */
.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--text);
}

.form-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.form-input:focus {
    outline: none;
    border-color: var(--primary);
}

.input-with-icon {
    position: relative;
}

.input-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray);
}

.password-toggle {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--gray);
    cursor: pointer;
}

.btn {
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-dark);
}

.btn-outline {
    background: transparent;
    border: 2px solid var(--primary);
    color: var(--primary);
}

.btn-outline:hover {
    background: var(--primary);
    color: white;
}

/* استایل‌های نقشه */
#map {
    height: 500px;
    border-radius: 12px;
    overflow: hidden;
}

.map-container {
    position: relative;
    margin-bottom: 20px;
}

.searching-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.95);
    display: none;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 1000;
}

.searching-animation {
    width: 50px;
    height: 50px;
    border: 3px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.searching-text {
    font-size: 16px;
    color: var(--text);
    margin-bottom: 20px;
}

.cancel-search {
    background: var(--accent);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
}

/* استایل‌های صفحات */
.page {
    display: none;
}

.page.active {
    display: block;
}

.table-container {
    overflow-x: auto;
    margin-top: 20px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

.data-table th {
    background: var(--bg-light);
    padding: 15px;
    text-align: right;
    font-weight: 600;
    color: var(--text);
    border-bottom: 1px solid var(--border);
}

.data-table td {
    padding: 12px 15px;
    border-bottom: 1px solid var(--border);
}

.data-table tr:hover {
    background: var(--bg-light);
}

.action-buttons {
    display: flex;
    gap: 5px;
}

.action-btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-approve {
    background: #E8F5E9;
    color: #00D474;
}

.btn-approve:hover {
    background: #00D474;
    color: white;
}

.btn-reject {
    background: #FFEBEE;
    color: #FF4D4D;
}

.btn-reject:hover {
    background: #FF4D4D;
    color: white;
}

.btn-info {
    background: #E3F2FD;
    color: #2196F3;
}

.btn-info:hover {
    background: #2196F3;
    color: white;
}

/* استایل‌های چت */
.chat-container {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    margin-top: 20px;
}

.chat-messages {
    height: 400px;
    overflow-y: auto;
    padding: 20px;
}

.message {
    margin-bottom: 15px;
    padding: 12px 15px;
    border-radius: 12px;
    max-width: 70%;
    position: relative;
}

.message.received {
    background: var(--bg-light);
    margin-right: auto;
}

.message.sent {
    background: var(--primary);
    color: white;
    margin-left: auto;
}

.message-time {
    font-size: 11px;
    margin-top: 5px;
    opacity: 0.7;
}

.chat-input {
    display: flex;
    padding: 15px;
    border-top: 1px solid var(--border);
}

.chat-input input {
    flex: 1;
    padding: 12px 15px;
    border: 1px solid var(--border);
    border-radius: 8px;
    margin-left: 10px;
}

.chat-input button {
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 20px;
    cursor: pointer;
}

/* استایل‌های پروفایل */
.profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
}

.profile-avatar {
    width: 80px;
    height: 80px;
    background: var(--primary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
}

.profile-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 30px;
}

.profile-stat {
    background: white;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: var(--shadow);
}

.profile-stat .value {
    font-size: 24px;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 5px;
}

.profile-stat .label {
    color: var(--gray);
    font-size: 14px;
}

/* استایل‌های تب‌ها */
.form-tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    padding: 0 20px;
}

.form-tab {
    padding: 15px 20px;
    cursor: pointer;
    color: var(--gray);
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
}

.form-tab.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
}

.form-tab-content {
    padding: 20px;
    display: none;
}

.form-tab-content.active {
    display: block;
}

.auth-form {
    padding: 20px;
}
`;

// اضافه کردن استایل‌ها به صفحه
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);