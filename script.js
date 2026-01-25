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
            this.driver_status = data.driver_status || 'pending';
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

    static findByEmailOrPhone(emailOrPhone) {
        const users = storage.get('snapp_users');
        const userData = users.find(u => 
            u.email === emailOrPhone || u.phone === emailOrPhone
        );
        return userData ? new User(userData) : null;
    }

    static getAll() {
        return storage.get('snapp_users').map(data => new User(data));
    }

    static getPassengers() {
        return User.getAll().filter(user => user.role === 'passenger' && user.status === 'approved');
    }

    static getDrivers() {
        return User.getAll().filter(user => user.role === 'driver' && user.status === 'approved');
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

    static getPendingUsers() {
        return User.getAll().filter(user => user.status === 'pending');
    }

    static getActiveUsers() {
        return User.getAll().filter(user => user.status === 'approved');
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

    static getCompletedTrips() {
        return Trip.getAll().filter(trip => trip.status === 'completed');
    }

    static getActiveTrips() {
        return Trip.getAll().filter(trip => 
            trip.status === 'requested' || 
            trip.status === 'confirmed' || 
            trip.status === 'in_progress'
        );
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
        this.active = data.active !== false;
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
            .filter(d => 
                new Date(d.expiry_date) > now && 
                d.used_count < d.max_uses &&
                d.active !== false
            )
            .map(data => new Discount(data));
    }

    static getAll() {
        return storage.get('snapp_discounts').map(data => new Discount(data));
    }

    static findByCode(code) {
        const discounts = storage.get('snapp_discounts');
        const discountData = discounts.find(d => d.code === code);
        return discountData ? new Discount(discountData) : null;
    }

    static delete(id) {
        let discounts = storage.get('snapp_discounts');
        discounts = discounts.filter(d => d.id !== id);
        storage.set('snapp_discounts', discounts);
    }

    isValid() {
        const now = new Date();
        return (
            new Date(this.expiry_date) > now &&
            this.used_count < this.max_uses &&
            this.active !== false
        );
    }

    use() {
        if (this.used_count < this.max_uses) {
            this.used_count++;
            this.save();
            return true;
        }
        return false;
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

    static getPendingTickets() {
        return SupportTicket.getAll().filter(ticket => ticket.status === 'pending');
    }

    static findByUserId(userId) {
        const tickets = storage.get('snapp_support');
        return tickets
            .filter(t => t.user_id === userId)
            .map(data => new SupportTicket(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    static delete(id) {
        let tickets = storage.get('snapp_support');
        tickets = tickets.filter(t => t.id !== id);
        storage.set('snapp_support', tickets);
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

    static getUnreadCount(userId) {
        const notifications = storage.get('snapp_notifications');
        return notifications.filter(n => n.user_id === userId && !n.read).length;
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

    static send(userId, title, message, type = 'info', link = '') {
        const notification = new Notification({
            user_id: userId,
            title,
            message,
            type,
            link
        });
        notification.save();
        return notification;
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

    static getTotalDeposits(userId) {
        const transactions = WalletTransaction.findByUserId(userId);
        return transactions
            .filter(t => t.type === 'deposit' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);
    }

    static getTotalWithdrawals(userId) {
        const transactions = WalletTransaction.findByUserId(userId);
        return transactions
            .filter(t => t.type === 'withdrawal' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);
    }
}

// توابع کمکی
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) {
        // ایجاد عنصر نوتیفیکیشن اگر وجود ندارد
        const notificationEl = document.createElement('div');
        notificationEl.id = 'notification';
        notificationEl.className = 'notification';
        document.body.appendChild(notificationEl);
    }
    
    const notificationEl = document.getElementById('notification');
    notificationEl.textContent = message;
    notificationEl.className = `notification ${type}`;
    notificationEl.style.display = 'block';
    
    setTimeout(() => {
        notificationEl.style.display = 'none';
    }, 5000);
    
    // ذخیره اعلان برای کاربر
    if (currentUser) {
        Notification.send(
            currentUser.id,
            type === 'success' ? 'عملیات موفق' : 
            type === 'error' ? 'خطا' : 
            type === 'warning' ? 'هشدار' : 'اطلاعیه',
            message,
            type
        );
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });
    document.querySelectorAll('.form-input').forEach(el => {
        el.style.borderColor = '';
    });
}

function showError(inputId, message) {
    const errorElement = document.getElementById(inputId + 'Error');
    const inputElement = document.getElementById(inputId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    if (inputElement) {
        inputElement.style.borderColor = 'var(--accent)';
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('fa-AF').format(amount) + ' افغانی';
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR');
    } catch (e) {
        return 'نامشخص';
    }
}

function formatDateTime(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return 'نامشخص';
    }
}

function generateRandomId() {
    return Date.now() + Math.floor(Math.random() * 1000);
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
    const drivers = User.getDrivers()
        .filter(driver => 
            driver.driver_status === 'active' &&
            driver.online_status === 'online' &&
            (rideType === 'bike' ? driver.vehicle_type === 'bike' : driver.vehicle_type === 'car')
        );

    if (drivers.length === 0) {
        return null;
    }

    // انتخاب تصادفی یک راننده
    const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];
    const distance = (Math.random() * 10 + 1).toFixed(1);
    const eta = Math.floor(distance * 2 + 3);

    return {
        ...randomDriver,
        eta: `${eta} دقیقه`,
        distance: `${distance} کیلومتر`,
        position: randomDriver.current_location || [34.5250, 69.1800]
    };
}

// رسم مسیر روی نقشه
function drawRoute(startCoords, endCoords) {
    clearRoute();
    
    if (!map || !startCoords || !endCoords) return;

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

    // رسم خط مستقیم (در حالت واقعی از API مسیریابی استفاده می‌شود)
    currentRoute = L.polyline([startCoords, endCoords], {
        color: '#00D474',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10'
    }).addTo(map);

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
            if (userData && userData.id) {
                const user = User.findById(userData.id);
                if (user) {
                    currentUser = user;
                    isAdmin = currentUser.role === 'admin';
                    updateUIAfterLogin();
                }
            }
        } catch (error) {
            console.error('Error loading user:', error);
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
        if (currentUser.profile_image && currentUser.profile_image.startsWith('data:image')) {
            userAvatar.innerHTML = `<img src="${currentUser.profile_image}" alt="${currentUser.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
            userAvatar.textContent = currentUser.name.charAt(0);
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
                license_image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0iIzAwRDQ3NCIvPjxwYXRoIGQ9Ik0xMDAgMTIwTDEyMCAxNDBMMTQwIDEwMEwxMjAgODBMMTAwIDYwTDgwIDgwTDYwIDEwMEw4MCAxNDBMMTAwIDEyMFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
                profile_image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0iIzAwRDQ3NCIvPjxwYXRoIGQ9Ik0xMDAgMTIwTDEyMCAxNDBMMTQwIDEwMEwxMjAgODBMMTAwIDYwTDgwIDgwTDYwIDEwMEw4MCAxNDBMMTAwIDEyMFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
                tazkira_image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIHJ4PSIyMCIgZmlsbD0iI0ZGRkZGRiIgc3Ryb2tlPSIjMDBENDc0IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxMDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMDBENDc0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5Eb2N1bWVudDwvdGV4dD48L3N2Zz4=',
                driver_status: 'active',
                rating: 4.7,
                total_trips: 125,
                current_location: [34.5250, 69.1800],
                online_status: 'online',
                earning: 12500,
                tazkira_number: '456123789',
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
            }
        ];
        
        sampleDiscounts.forEach(discount => {
            const discountObj = new Discount(discount);
            discountObj.save();
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
    
    // اضافه کردن event listener برای دکمه‌ها
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
            
            // بازگشت پول به کیف پول اگر پرداخت شده بود
            if (trip.payment_method === 'wallet' && trip.status === 'completed') {
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
            }).catch(err => {
                showNotification('خطا در کپی کردن کد', 'error');
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
        if (currentUser.profile_image && currentUser.profile_image.startsWith('data:image')) {
            profileAvatar.innerHTML = `<img src="${currentUser.profile_image}" alt="${currentUser.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
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
    const totalSpent = trips.filter(t => t.status === 'completed').reduce((sum, trip) => sum + (trip.price || 0), 0);
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

function toggleOnlineStatus() {
    if (!currentUser || currentUser.role !== 'driver') return;
    
    currentUser.online_status = currentUser.online_status === 'online' ? 'offline' : 'online';
    currentUser.save();
    localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
    
    const statusText = currentUser.online_status === 'online' ? 'آنلاین' : 'آفلاین';
    showNotification(`وضعیت شما به ${statusText} تغییر یافت`, 'success');
    updateProfilePage();
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
    
    const totalRevenue = trips.filter(t => t.status === 'completed').reduce((sum, trip) => sum + (trip.price || 0), 0);
    if (totalRevenueElement) totalRevenueElement.textContent = formatCurrency(totalRevenue);
}

function loadPendingUsers() {
    const pendingUsersTable = document.getElementById('pendingUsersTable');
    if (!pendingUsersTable) return;
    
    pendingUsersTable.innerHTML = '';
    const users = User.getPendingUsers();
    
    if (users.length === 0) {
        pendingUsersTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: var(--gray);">
                    هیچ کاربری در انتظار تایید نیست
                </td>
            </tr>
        `;
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        const date = formatDate(user.created_at);
        const roleText = user.role === 'passenger' ? 'مسافر' : 'راننده';
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${roleText}</td>
            <td>${date}</td>
            <td class="action-buttons">
                <button class="action-btn btn-approve approve-user-btn" data-id="${user.id}">تایید</button>
                <button class="action-btn btn-reject reject-user-btn" data-id="${user.id}">رد</button>
            </td>
        `;
        
        pendingUsersTable.appendChild(row);
    });
    
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
}

function updateUserStatus(userId, status) {
    const user = User.findById(userId);
    if (user) {
        user.status = status;
        if (status === 'approved' && user.role === 'driver') {
            user.driver_status = 'active';
        }
        user.save();
        
        // ارسال اعلان به کاربر
        Notification.send(
            userId,
            'تغییر وضعیت حساب',
            `حساب کاربری شما ${status === 'approved' ? 'تایید' : 'رد'} شد.`,
            status === 'approved' ? 'success' : 'error'
        );
        
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
                <td colspan="7" style="text-align: center; padding: 20px; color: var(--gray);">
                    هیچ کاربری ثبت نشده است
                </td>
            </tr>
        `;
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        const date = formatDate(user.created_at);
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
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${date}</td>
            <td class="action-buttons">
                ${user.status === 'approved' ? 
                  `<button class="action-btn btn-reject deactivate-user-btn" data-id="${user.id}">غیرفعال</button>` : 
                  user.status === 'rejected' ? 
                  `<button class="action-btn btn-approve activate-user-btn" data-id="${user.id}">فعال</button>` : ''}
                <button class="action-btn btn-info edit-user-btn" data-id="${user.id}">ویرایش</button>
            </td>
        `;
        
        allUsersTable.appendChild(row);
    });
    
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
}

function loadDrivers() {
    const driversTable = document.getElementById('driversTable');
    if (!driversTable) return;
    
    driversTable.innerHTML = '';
    const drivers = User.getDrivers();
    
    if (drivers.length === 0) {
        driversTable.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: var(--gray);">
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
        const onlineClass = driver.online_status === 'online' ? 'status-online' : 'status-offline';
        const onlineText = driver.online_status === 'online' ? 'آنلاین' : 'آفلاین';
        
        row.innerHTML = `
            <td>${driver.name}</td>
            <td>${driver.phone}</td>
            <td>${vehicleTypeText}</td>
            <td>${driver.car_model || '---'}</td>
            <td>${driver.plate_number || '---'}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td><span class="status-badge ${onlineClass}">${onlineText}</span></td>
            <td class="action-buttons">
                <button class="action-btn ${driver.driver_status === 'active' ? 'btn-reject' : 'btn-approve'} toggle-driver-btn" data-id="${driver.id}" data-status="${driver.driver_status}">
                    ${driver.driver_status === 'active' ? 'غیرفعال' : 'فعال'}
                </button>
            </td>
        `;
        
        driversTable.appendChild(row);
    });
    
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
}

function loadAdminTrips() {
    const adminTripsTable = document.getElementById('adminTripsTable');
    if (!adminTripsTable) return;
    
    adminTripsTable.innerHTML = '';
    const trips = Trip.getAll().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    if (trips.length === 0) {
        adminTripsTable.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: var(--gray);">
                    هیچ سفری ثبت نشده است
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
        
        row.innerHTML = `
            <td>${date}</td>
            <td>${trip.user_name || '---'}</td>
            <td>${trip.pickup}</td>
            <td>${trip.destination}</td>
            <td>${formatCurrency(trip.price)}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="action-buttons">
                <button class="action-btn btn-info view-admin-trip-btn" data-id="${trip.id}">جزئیات</button>
            </td>
        `;
        
        adminTripsTable.appendChild(row);
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
                <td colspan="6" style="text-align: center; padding: 20px; color: var(--gray);">
                    هیچ تخفیفی ثبت نشده است
                </td>
            </tr>
        `;
        return;
    }
    
    discounts.forEach(discount => {
        const row = document.createElement('tr');
        const createdDate = formatDate(discount.created_at);
        const expiryDate = formatDate(discount.expiry_date);
        const isExpired = new Date(discount.expiry_date) < new Date();
        const statusClass = isExpired ? 'status-inactive' : 'status-active';
        const statusText = isExpired ? 'منقضی' : 'فعال';
        
        row.innerHTML = `
            <td>${discount.code}</td>
            <td>${discount.percent}%</td>
            <td>${expiryDate}</td>
            <td>${discount.max_uses}</td>
            <td>${discount.used_count || 0}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;
        
        discountsTable.appendChild(row);
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
                <td colspan="6" style="text-align: center; padding: 20px; color: var(--gray);">
                    هیچ درخواست پشتیبانی ثبت نشده است
                </td>
            </tr>
        `;
        return;
    }
    
    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        const date = formatDateTime(ticket.created_at);
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
            <td class="action-buttons">
                ${ticket.status !== 'closed' ? 
                  `<button class="action-btn btn-approve reply-ticket-btn" data-id="${ticket.id}">پاسخ</button>` : ''}
                <button class="action-btn btn-info view-ticket-btn" data-id="${ticket.id}">مشاهده</button>
            </td>
        `;
        
        adminSupportTable.appendChild(row);
    });
}

// بارگذاری صفحه اصلی
window.onload = function() {
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
        
        if (!email || !password) {
            showNotification('لطفاً ایمیل/شماره تماس و رمز عبور را وارد کنید', 'error');
            return;
        }
        
        const user = User.findByCredentials(email, password);
        
        if (!user) {
            showNotification('ایمیل/شماره تماس یا رمز عبور اشتباه است', 'error');
            return;
        }
        
        if (user.status !== 'approved') {
            showNotification('حساب کاربری شما هنوز تایید نشده است', 'error');
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
        
        if (userType === 'driver' && (!licenseImageInput || !licenseImageInput.files[0])) {
            showError('licenseImage', 'عکس گواهینامه الزامی است');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // بررسی تکراری نبودن ایمیل
        const existingUser = User.findByEmailOrPhone(email);
        if (existingUser) {
            showError('registerEmail', 'این ایمیل قبلاً ثبت شده است');
            return;
        }
        
        // بررسی تکراری نبودن شماره تماس
        const existingPhone = User.findByEmailOrPhone(phone);
        if (existingPhone) {
            showError('registerPhone', 'این شماره تماس قبلاً ثبت شده است');
            return;
        }
        
        try {
            // خواندن فایل‌ها به صورت Data URL
            const readFileAsDataURL = (file) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = (e) => reject(e);
                    reader.readAsDataURL(file);
                });
            };
            
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
                id: generateRandomId(),
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
            
            showNotification('ثبت‌نام با موفقیت انجام شد. حساب شما پس از تأیید توسط مدیر فعال خواهد شد.', 'success');
            document.getElementById('registerForm').reset();
            document.getElementById('register-tab').classList.remove('active');
            document.getElementById('login-tab').classList.add('active');
            document.querySelector('.form-tab[data-tab="login"]').click();
            
            // نمایش اطلاعات ثبت‌نام به ادمین
            Notification.send(
                1, // شناسه مدیر
                'کاربر جدید ثبت‌نام کرده است',
                `کاربر ${name} با ایمیل ${email} ثبت‌نام کرده است. لطفاً حساب را بررسی و تایید کنید.`,
                'info'
            );
            
        } catch (error) {
            console.error('Error during registration:', error);
            showNotification('خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.', 'error');
        }
    });

    // تغییر نوع کاربر در ثبت‌نام
    document.getElementById('userType')?.addEventListener('change', function() {
        const driverFields = document.getElementById('driverFields');
        if (driverFields) {
            driverFields.style.display = this.value === 'driver' ? 'block' : 'none';
        }
    });

    // نمایش/مخفی کردن رمز عبور
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // مدیریت خروج
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    document.getElementById('mobileLogoutBtn')?.addEventListener('click', logout);

    // مدیریت ناوبری
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            // پنهان کردن همه صفحات
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // نمایش صفحه انتخاب شده
            const targetPage = document.getElementById(`${pageId}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
                
                // بارگذاری محتوای صفحه
                switch(pageId) {
                    case 'profile':
                        updateProfilePage();
                        break;
                    case 'trips':
                        loadMyTrips();
                        break;
                    case 'discounts':
                        loadDiscounts();
                        break;
                    case 'admin':
                        loadAdminPanel();
                        break;
                }
            }
            
            // بستن منوی موبایل
            document.getElementById('mobileMenu').style.display = 'none';
        });
    });

    // منوی موبایل
    function setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (!mobileMenuBtn || !mobileMenu) return;
        
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (mobileMenu.style.display === 'block') {
                mobileMenu.style.display = 'none';
            } else {
                mobileMenu.style.display = 'block';
            }
        });
        
        // بستن منوی موبایل با کلیک خارج
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.style.display = 'none';
            }
        });
        
        // جلوگیری از بسته شدن منو هنگام کلیک داخل آن
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // بازگشت به خانه
    document.getElementById('backToHome')?.addEventListener('click', () => {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById('home-page').classList.add('active');
        
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) mobileMenu.style.display = 'none';
    });

    // مدیریت مدال‌ها
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // اتصال صفحه پرداخت
    document.getElementById('openPaymentModal')?.addEventListener('click', openPaymentModal);

    // پرداخت
    document.getElementById('payNowBtn')?.addEventListener('click', () => {
        if (!currentUser) {
            showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
            openAuthModal();
            return;
        }

        if (selectedPaymentMethod === 'wallet') {
            if (currentUser.wallet_balance >= currentPrice) {
                // پرداخت از کیف پول
                currentUser.wallet_balance -= currentPrice;
                currentUser.save();
                localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));

                const transaction = new WalletTransaction({
                    user_id: currentUser.id,
                    amount: -currentPrice,
                    type: 'payment',
                    description: `پرداخت سفر #${currentTripId}`,
                    status: 'completed'
                });
                transaction.save();

                showNotification(`پرداخت ${formatCurrency(currentPrice)} از کیف پول با موفقیت انجام شد`, 'success');
                completeTrip();
            } else {
                showNotification('موجودی کیف پول شما کافی نیست', 'error');
                document.getElementById('paymentModal').style.display = 'none';
                document.getElementById('paymentMethodModal').style.display = 'flex';
            }
        } else {
            // پرداخت نقدی
            showNotification('پرداخت نقدی ثبت شد. لطفاً مبلغ را به راننده پرداخت کنید.', 'success');
            completeTrip();
        }
    });

    // شارژ کیف پول
    document.getElementById('chargeWalletBtn')?.addEventListener('click', () => {
        if (!currentUser) {
            showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
            openAuthModal();
            return;
        }

        const amount = parseInt(document.getElementById('chargeAmount').value);
        if (!amount || amount < 100) {
            showNotification('مبلغ شارژ باید حداقل ۱۰۰ افغانی باشد', 'error');
            return;
        }

        currentUser.wallet_balance += amount;
        currentUser.save();
        localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));

        const transaction = new WalletTransaction({
            user_id: currentUser.id,
            amount: amount,
            type: 'deposit',
            description: 'شارژ کیف پول',
            status: 'completed'
        });
        transaction.save();

        showNotification(`کیف پول شما ${formatCurrency(amount)} شارژ شد`, 'success');
        document.getElementById('paymentMethodModal').style.display = 'none';
        updateProfilePage();
    });

    // ذخیره تغییرات پروفایل
    document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
        if (!currentUser) return;

        const newName = document.getElementById('editName').value.trim();
        const newEmail = document.getElementById('editEmail').value.trim();
        const newPhone = document.getElementById('editPhone').value.trim();

        if (newName && newName.length >= 2) {
            currentUser.name = newName;
        }
        
        if (newEmail && newEmail.includes('@')) {
            currentUser.email = newEmail;
        }
        
        if (newPhone && newPhone.length >= 10) {
            currentUser.phone = newPhone;
        }

        currentUser.save();
        localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
        updateUIAfterLogin();
        
        showNotification('اطلاعات پروفایل با موفقیت ذخیره شد', 'success');
    });

    // تغییر عکس پروفایل
    document.getElementById('changeAvatarBtn')?.addEventListener('click', () => {
        document.getElementById('avatarInput').click();
    });

    document.getElementById('avatarInput')?.addEventListener('change', async function(e) {
        if (!currentUser || !e.target.files[0]) return;

        try {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                currentUser.profile_image = event.target.result;
                currentUser.save();
                localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
                updateUIAfterLogin();
                showNotification('عکس پروفایل با موفقیت تغییر کرد', 'success');
            };
            
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error updating avatar:', error);
            showNotification('خطا در تغییر عکس پروفایل', 'error');
        }
    });

    // مدیریت پشتیبانی
    document.getElementById('sendSupportBtn')?.addEventListener('click', () => {
        if (!currentUser) {
            showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
            openAuthModal();
            return;
        }

        const subject = document.getElementById('supportSubject').value.trim();
        const message = document.getElementById('supportMessage').value.trim();
        const category = document.getElementById('supportCategory').value;

        if (!subject || !message) {
            showNotification('لطفاً موضوع و متن پیام را وارد کنید', 'error');
            return;
        }

        const ticket = new SupportTicket({
            user_id: currentUser.id,
            user_name: currentUser.name,
            subject,
            message,
            category,
            status: 'pending'
        });

        ticket.save();

        showNotification('درخواست پشتیبانی با موفقیت ثبت شد', 'success');
        document.getElementById('supportSubject').value = '';
        document.getElementById('supportMessage').value = '';
        document.getElementById('supportCategory').value = 'general';

        // اعلان به ادمین
        Notification.send(
            1,
            'درخواست پشتیبانی جدید',
            `${currentUser.name}: ${subject}`,
            'info'
        );
    });

    // مدیریت تخفیف‌ها در صفحه رزرو
    document.getElementById('applyDiscountBtn')?.addEventListener('click', () => {
        const code = document.getElementById('discountCode').value.trim();
        if (!code) {
            showNotification('لطفاً کد تخفیف را وارد کنید', 'error');
            return;
        }

        const discount = Discount.findByCode(code);
        if (!discount) {
            showNotification('کد تخفیف معتبر نیست', 'error');
            return;
        }

        if (!discount.isValid()) {
            showNotification('کد تخفیف منقضی شده است', 'error');
            return;
        }

        if (currentPrice < discount.min_order) {
            showNotification(`حداقل سفارش برای این کد تخفیف ${formatCurrency(discount.min_order)} است`, 'error');
            return;
        }

        const discountAmount = Math.round((currentPrice * discount.percent) / 100);
        const finalPrice = currentPrice - discountAmount;

        currentPrice = finalPrice;
        updatePrice();
        discount.use();

        showNotification(`کد تخفیف اعمال شد. ${discountAmount} افغانی تخفیف داده شد.`, 'success');
        document.getElementById('discountCode').value = '';
    });

    // فرم گزارش مشکل
    document.getElementById('reportForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
            openAuthModal();
            return;
        }

        const problemType = document.getElementById('problemType').value;
        const problemDescription = document.getElementById('problemDescription').value.trim();

        if (!problemDescription) {
            showNotification('لطفاً توضیحات مشکل را وارد کنید', 'error');
            return;
        }

        const ticket = new SupportTicket({
            user_id: currentUser.id,
            user_name: currentUser.name,
            subject: `گزارش مشکل - ${problemType}`,
            message: problemDescription,
            category: 'problem',
            status: 'pending'
        });

        ticket.save();

        showNotification('گزارش مشکل با موفقیت ثبت شد', 'success');
        document.getElementById('problemDescription').value = '';
    });

    // دکمه اشتراک‌گذاری
    document.getElementById('shareBtn')?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'اسنپ افغانستان',
                text: 'اولین سرویس تاکسی اینترنتی در کابل',
                url: window.location.href
            }).then(() => {
                showNotification('اشتراک‌گذاری با موفقیت انجام شد', 'success');
            }).catch(() => {
                showNotification('اشتراک‌گذاری لغو شد', 'info');
            });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showNotification('لینک با موفقیت کپی شد', 'success');
            }).catch(() => {
                showNotification('خطا در کپی لینک', 'error');
            });
        }
    });

    // بارگذاری اولیه
    calculateDistanceAndPrice();
    updatePrice();
};

// توابع کمکی اضافی
function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('loginEmail').focus();
    clearErrors();
}

function openPaymentModal() {
    if (!currentUser) {
        showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
        openAuthModal();
        return;
    }

    document.getElementById('paymentPrice').textContent = formatCurrency(currentPrice);
    document.getElementById('paymentMethodModal').style.display = 'flex';
}

function completeTrip() {
    document.getElementById('paymentModal').style.display = 'none';
    document.getElementById('liveTracking').style.display = 'none';

    const trip = Trip.findById(currentTripId);
    if (trip) {
        trip.status = 'completed';
        trip.completed_at = new Date().toISOString();
        trip.save();

        // به روز رسانی راننده
        if (currentDriver) {
            const driver = User.findById(currentDriver.id);
            if (driver) {
                driver.total_trips = (driver.total_trips || 0) + 1;
                driver.earning = (driver.earning || 0) + currentPrice;
                driver.save();
            }
        }

        openRatingModal(currentTripId);
    }

    if (carAnimationInterval) {
        clearInterval(carAnimationInterval);
    }
    if (carMarker) {
        map.removeLayer(carMarker);
        carMarker = null;
    }
    clearRoute();
}

function openRatingModal(tripId) {
    const trip = Trip.findById(tripId);
    if (!trip) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'ratingModal';
    modal.style.display = 'flex';

    modal.innerHTML = `
        <div class="modal-content" style="width: 400px;">
            <div class="modal-header">
                <h3>امتیازدهی به سفر</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <p>لطفاً به راننده ${trip.driver_name || '---'} امتیاز دهید:</p>
                <div class="rating-stars">
                    ${Array.from({length: 5}, (_, i) => `
                        <i class="far fa-star" data-rating="${i + 1}"></i>
                    `).join('')}
                </div>
                <textarea id="ratingComment" placeholder="نظر خود را بنویسید (اختیاری)" style="width: 100%; height: 100px; margin-top: 15px; padding: 10px; border: 1px solid var(--gray-light); border-radius: 4px;"></textarea>
                <button id="submitRatingBtn" class="btn-primary" style="width: 100%; margin-top: 15px;">ثبت امتیاز</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    let selectedRating = 0;
    const stars = modal.querySelectorAll('.fa-star');
    
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            highlightStars(selectedRating);
        });
    });
    
    modal.querySelector('.rating-stars').addEventListener('mouseleave', () => {
        highlightStars(selectedRating);
    });

    function highlightStars(count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.remove('far');
                star.classList.add('fas', 'active');
            } else {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            }
        });
    }

    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });

    document.getElementById('submitRatingBtn').addEventListener('click', () => {
        if (selectedRating === 0) {
            showNotification('لطفاً امتیاز انتخاب کنید', 'error');
            return;
        }

        trip.rated = true;
        trip.rating = selectedRating;
        trip.rating_comment = document.getElementById('ratingComment').value.trim();
        trip.save();

        // به روز رسانی امتیاز راننده
        if (trip.driver_id) {
            const driver = User.findById(trip.driver_id);
            if (driver) {
                driver.updateRating(selectedRating);
            }
        }

        showNotification('امتیاز شما با موفقیت ثبت شد', 'success');
        modal.remove();
        loadMyTrips();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// تابع انتخاب مکان از نقشه
function selectLocationFromMap(locationName, coordinates) {
    const selectionModal = document.createElement('div');
    selectionModal.className = 'modal';
    selectionModal.id = 'locationSelectModal';
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
                    <button id="setAsPickupFromMap" class="btn-primary" style="flex: 1;">مبدا</button>
                    <button id="setAsDestinationFromMap" class="btn-primary" style="flex: 1;">مقصد</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(selectionModal);

    selectionModal.querySelector('.close-modal').addEventListener('click', () => {
        selectionModal.remove();
    });

    document.getElementById('setAsPickupFromMap').addEventListener('click', () => {
        setPickupLocation(locationName, coordinates);
        selectionModal.remove();
        showNotification(`مبدا به "${locationName}" تنظیم شد`, 'success');
    });

    document.getElementById('setAsDestinationFromMap').addEventListener('click', () => {
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

// تابع چاپ قبض
function printReceipt(tripId) {
    const trip = Trip.findById(tripId);
    if (!trip) return;

    const receiptWindow = window.open('', '_blank');
    const date = formatDateTime(trip.created_at);
    const rideTypeText = {
        'economy': 'اقتصادی',
        'comfort': 'کلاسیک',
        'bike': 'موتور'
    }[trip.ride_type] || trip.ride_type;

    receiptWindow.document.write(`
        <html>
        <head>
            <title>رسید سفر اسنپ #${trip.id}</title>
            <style>
                body { font-family: Tahoma, Arial, sans-serif; direction: rtl; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                .header h1 { color: #00D474; margin: 0; }
                .receipt-details { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .receipt-details td { padding: 10px; border-bottom: 1px solid #ddd; }
                .receipt-details td:first-child { font-weight: bold; width: 30%; }
                .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>اسنپ افغانستان</h1>
                <p>رسید سفر تاکسی اینترنتی</p>
            </div>
            
            <table class="receipt-details">
                <tr>
                    <td>شماره سفر:</td>
                    <td>${trip.id}</td>
                </tr>
                <tr>
                    <td>تاریخ و زمان:</td>
                    <td>${date}</td>
                </tr>
                <tr>
                    <td>مسافر:</td>
                    <td>${trip.user_name}</td>
                </tr>
                <tr>
                    <td>راننده:</td>
                    <td>${trip.driver_name || '---'}</td>
                </tr>
                <tr>
                    <td>مبدا:</td>
                    <td>${trip.pickup}</td>
                </tr>
                <tr>
                    <td>مقصد:</td>
                    <td>${trip.destination}</td>
                </tr>
                <tr>
                    <td>نوع سفر:</td>
                    <td>${rideTypeText}</td>
                </tr>
                <tr>
                    <td>مسافت:</td>
                    <td>${trip.distance} کیلومتر</td>
                </tr>
                <tr>
                    <td>روش پرداخت:</td>
                    <td>${trip.payment_method === 'cash' ? 'نقدی' : 'کیف پول'}</td>
                </tr>
                <tr style="font-weight: bold; background-color: #f5f5f5;">
                    <td>مبلغ قابل پرداخت:</td>
                    <td>${formatCurrency(trip.price)}</td>
                </tr>
            </table>
            
            <div class="footer">
                <p>با تشکر از انتخاب اسنپ</p>
                <p>پشتیبانی: ۰۷۰۱۲۳۴۵۶۷</p>
                <p>www.snapp.af</p>
                <p class="no-print">برای چاپ این رسید از Ctrl+P استفاده کنید</p>
            </div>
            
            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `);
    
    receiptWindow.document.close();
}

// تابع آپدیت موقعیت راننده
function updateDriverLocation(driverId, newLocation) {
    const driver = User.findById(driverId);
    if (driver && driver.role === 'driver') {
        driver.current_location = newLocation;
        driver.save();
    }
}

// تابع گزارش آمار روزانه
function generateDailyReport() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const trips = Trip.getAll().filter(trip => {
        const tripDate = new Date(trip.created_at);
        tripDate.setHours(0, 0, 0, 0);
        return tripDate.getTime() === today.getTime();
    });
    
    const completedTrips = trips.filter(t => t.status === 'completed');
    const totalRevenue = completedTrips.reduce((sum, trip) => sum + trip.price, 0);
    const activeDrivers = User.getDrivers().filter(d => d.online_status === 'online').length;
    
    return {
        date: today.toLocaleDateString('fa-IR'),
        totalTrips: trips.length,
        completedTrips: completedTrips.length,
        cancelledTrips: trips.filter(t => t.status === 'cancelled').length,
        totalRevenue: totalRevenue,
        activeDrivers: activeDrivers,
        averageTripDistance: completedTrips.length > 0 ? 
            (completedTrips.reduce((sum, trip) => sum + trip.distance, 0) / completedTrips.length).toFixed(1) : 0,
        averageTripPrice: completedTrips.length > 0 ? 
            Math.round(totalRevenue / completedTrips.length) : 0
    };
}

// تابع نمایش گزارش
function showDailyReport() {
    if (!isAdmin) {
        showNotification('فقط مدیران می‌توانند گزارش مشاهده کنند', 'error');
        return;
    }
    
    const report = generateDailyReport();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h3>گزارش روزانه</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 15px;">
                    <strong>تاریخ:</strong> ${report.date}
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div class="stat-card">
                        <div class="stat-value">${report.totalTrips}</div>
                        <div class="stat-label">کل سفرها</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${report.completedTrips}</div>
                        <div class="stat-label">سفرهای تکمیل شده</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${report.activeDrivers}</div>
                        <div class="stat-label">رانندگان آنلاین</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${formatCurrency(report.totalRevenue)}</div>
                        <div class="stat-label">درآمد کل</div>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h4>متوسط‌ها:</h4>
                    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                        <span>میانگین مسافت: ${report.averageTripDistance} کیلومتر</span>
                        <span>میانگین هزینه: ${formatCurrency(report.averageTripPrice)}</span>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <button onclick="printReport()" class="btn-primary" style="width: 100%;">
                        <i class="fas fa-print"></i> چاپ گزارش
                    </button>
                </div>
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

// تابع چاپ گزارش
function printReport() {
    const report = generateDailyReport();
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>گزارش روزانه اسنپ - ${report.date}</title>
            <style>
                body { font-family: Tahoma, Arial; direction: rtl; padding: 30px; }
                .header { text-align: center; margin-bottom: 30px; }
                .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                .stat-box { border: 1px solid #ddd; padding: 15px; text-align: center; border-radius: 5px; }
                .stat-value { font-size: 24px; font-weight: bold; color: #00D474; }
                .stat-label { color: #666; margin-top: 5px; }
                .averages { margin-top: 30px; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                @media print {
                    @page { margin: 0.5cm; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>گزارش روزانه اسنپ افغانستان</h1>
                <h3>تاریخ: ${report.date}</h3>
            </div>
            
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-value">${report.totalTrips}</div>
                    <div class="stat-label">کل سفرها</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${report.completedTrips}</div>
                    <div class="stat-label">سفرهای تکمیل شده</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${report.activeDrivers}</div>
                    <div class="stat-label">رانندگان آنلاین</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value">${formatCurrency(report.totalRevenue)}</div>
                    <div class="stat-label">درآمد کل</div>
                </div>
            </div>
            
            <div class="averages">
                <h3>میانگین‌ها</h3>
                <p>میانگین مسافت هر سفر: ${report.averageTripDistance} کیلومتر</p>
                <p>میانگین هزینه هر سفر: ${formatCurrency(report.averageTripPrice)}</p>
                <p>تعداد سفرهای لغو شده: ${report.cancelledTrips}</p>
            </div>
            
            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// تابع بارگذاری مکان‌های محبوب
function loadPopularLocations() {
    const popularLocations = document.getElementById('popularLocations');
    if (!popularLocations) return;
    
    // مکان‌های پرطرفدار
    const popular = [
        { name: 'فرودگاه کابل', icon: 'plane', category: 'حمل و نقل' },
        { name: 'مرکز خرید شهرک', icon: 'shopping-cart', category: 'خرید' },
        { name: 'پارک زرنگار', icon: 'tree', category: 'تفریحی' },
        { name: 'بیمارستان علی آباد', icon: 'hospital', category: 'سلامت' },
        { name: 'پوهنتون کابل', icon: 'university', category: 'آموزشی' },
        { name: 'رستوران آریانا', icon: 'utensils', category: 'غذاخوری' }
    ];
    
    popularLocations.innerHTML = '';
    
    popular.forEach(location => {
        const locationElement = document.createElement('div');
        locationElement.className = 'popular-location';
        locationElement.innerHTML = `
            <div class="location-icon">
                <i class="fas fa-${location.icon}"></i>
            </div>
            <div class="location-info">
                <div class="location-name">${location.name}</div>
                <div class="location-category">${location.category}</div>
            </div>
            <button class="select-location" data-location="${location.name}">
                <i class="fas fa-arrow-left"></i>
            </button>
        `;
        
        popularLocations.appendChild(locationElement);
    });
    
    // اضافه کردن event listener برای دکمه انتخاب مکان
    document.querySelectorAll('.select-location').forEach(btn => {
        btn.addEventListener('click', function() {
            const locationName = this.getAttribute('data-location');
            const destinationInput = document.getElementById('destination');
            if (destinationInput) {
                destinationInput.value = locationName;
                showNotification(`مقصد به "${locationName}" تنظیم شد`, 'info');
                calculateDistanceAndPrice();
            }
        });
    });
}

// تابع نمایش وضعیت سیستم
function showSystemStatus() {
    const users = User.getAll();
    const drivers = User.getDrivers();
    const activeTrips = Trip.getActiveTrips();
    
    const statusModal = document.createElement('div');
    statusModal.className = 'modal';
    statusModal.style.display = 'flex';
    
    statusModal.innerHTML = `
        <div class="modal-content" style="width: 400px;">
            <div class="modal-header">
                <h3>وضعیت سیستم</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>کاربران ثبت شده:</span>
                        <strong>${users.length}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>رانندگان فعال:</span>
                        <strong>${drivers.filter(d => d.driver_status === 'active').length}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>رانندگان آنلاین:</span>
                        <strong>${drivers.filter(d => d.online_status === 'online').length}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>سفرهای در حال انجام:</span>
                        <strong>${activeTrips.length}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>سفرهای تکمیل شده:</span>
                        <strong>${Trip.getCompletedTrips().length}</strong>
                    </div>
                </div>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--gray-light);">
                    <p style="color: var(--gray); font-size: 12px;">
                        <i class="fas fa-info-circle"></i>
                        آخرین به‌روزرسانی: ${new Date().toLocaleTimeString('fa-IR')}
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(statusModal);
    
    statusModal.querySelector('.close-modal').addEventListener('click', () => {
        statusModal.remove();
    });
    
    statusModal.addEventListener('click', (e) => {
        if (e.target === statusModal) {
            statusModal.remove();
        }
    });
}

// تابع اولویت‌بندی رانندگان
function prioritizeDrivers(pickupLocation) {
    const drivers = User.getDrivers()
        .filter(driver => 
            driver.driver_status === 'active' && 
            driver.online_status === 'online'
        );
    
    // در اینجا می‌توان منطق پیچیده‌تری برای اولویت‌بندی اضافه کرد
    // بر اساس فاصله، امتیاز، تعداد سفرها و ...
    
    return drivers.sort((a, b) => {
        // اولویت با رانندگان با امتیاز بالاتر
        if (b.rating !== a.rating) {
            return b.rating - a.rating;
        }
        // سپس با تعداد سفرهای بیشتر
        return (b.total_trips || 0) - (a.total_trips || 0);
    });
}

// تابع ارسال نوتیفیکیشن به راننده
function notifyDriver(driverId, tripId) {
    const trip = Trip.findById(tripId);
    if (!trip) return;
    
    Notification.send(
        driverId,
        'درخواست سفر جدید',
        `یک سفر جدید از ${trip.pickup} به ${trip.destination} با مبلغ ${formatCurrency(trip.price)} در انتظار شماست.`,
        'info'
    );
}

// تابع ایجاد گزارش ماهانه
function generateMonthlyReport(month, year) {
    const targetMonth = month || new Date().getMonth() + 1;
    const targetYear = year || new Date().getFullYear();
    
    const trips = Trip.getAll().filter(trip => {
        const tripDate = new Date(trip.created_at);
        return tripDate.getMonth() + 1 === targetMonth && 
               tripDate.getFullYear() === targetYear;
    });
    
    const completedTrips = trips.filter(t => t.status === 'completed');
    const totalRevenue = completedTrips.reduce((sum, trip) => sum + trip.price, 0);
    
    // گروه‌بندی بر اساس نوع سفر
    const rideTypeStats = {};
    completedTrips.forEach(trip => {
        const type = trip.ride_type;
        if (!rideTypeStats[type]) {
            rideTypeStats[type] = { count: 0, revenue: 0 };
        }
        rideTypeStats[type].count++;
        rideTypeStats[type].revenue += trip.price;
    });
    
    // گروه‌بندی بر اساس روز
    const dailyStats = {};
    completedTrips.forEach(trip => {
        const date = new Date(trip.created_at).getDate();
        if (!dailyStats[date]) {
            dailyStats[date] = { trips: 0, revenue: 0 };
        }
        dailyStats[date].trips++;
        dailyStats[date].revenue += trip.price;
    });
    
    return {
        month: targetMonth,
        year: targetYear,
        totalTrips: trips.length,
        completedTrips: completedTrips.length,
        cancellationRate: trips.length > 0 ? 
            ((trips.filter(t => t.status === 'cancelled').length / trips.length) * 100).toFixed(1) : 0,
        totalRevenue: totalRevenue,
        averageTripPrice: completedTrips.length > 0 ? Math.round(totalRevenue / completedTrips.length) : 0,
        rideTypeStats: rideTypeStats,
        dailyStats: dailyStats,
        topDrivers: getTopDrivers(month, year)
    };
}

function getTopDrivers(month, year) {
    const drivers = User.getDrivers();
    const trips = Trip.getAll().filter(trip => {
        const tripDate = new Date(trip.created_at);
        return trip.status === 'completed' &&
               tripDate.getMonth() + 1 === month && 
               tripDate.getFullYear() === year;
    });
    
    const driverStats = {};
    trips.forEach(trip => {
        if (trip.driver_id) {
            if (!driverStats[trip.driver_id]) {
                driverStats[trip.driver_id] = {
                    name: trip.driver_name,
                    trips: 0,
                    revenue: 0
                };
            }
            driverStats[trip.driver_id].trips++;
            driverStats[trip.driver_id].revenue += trip.price;
        }
    });
    
    return Object.values(driverStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
}

// تابع جستجوی پیشرفته سفرها
function searchTrips(searchParams) {
    const { 
        startDate, 
        endDate, 
        minPrice, 
        maxPrice, 
        status, 
        rideType, 
        driverName 
    } = searchParams;
    
    let trips = Trip.getAll();
    
    if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        trips = trips.filter(trip => new Date(trip.created_at) >= start);
    }
    
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        trips = trips.filter(trip => new Date(trip.created_at) <= end);
    }
    
    if (minPrice) {
        trips = trips.filter(trip => trip.price >= minPrice);
    }
    
    if (maxPrice) {
        trips = trips.filter(trip => trip.price <= maxPrice);
    }
    
    if (status) {
        trips = trips.filter(trip => trip.status === status);
    }
    
    if (rideType) {
        trips = trips.filter(trip => trip.ride_type === rideType);
    }
    
    if (driverName) {
        trips = trips.filter(trip => 
            trip.driver_name && 
            trip.driver_name.includes(driverName)
        );
    }
    
    return trips;
}

// تابع ساختار کلی سیستم
function initializeSystem() {
    console.log('سیستم اسنپ افغانستان در حال راه‌اندازی...');
    
    // ایجاد پوشه‌های مورد نیاز
    if (!localStorage.getItem('snapp_initialized')) {
        // ذخیره اطلاعات اولیه
        storage.set('snapp_users', []);
        storage.set('snapp_trips', []);
        storage.set('snapp_discounts', []);
        storage.set('snapp_support', []);
        storage.set('snapp_notifications', []);
        storage.set('snapp_wallet_transactions', []);
        
        localStorage.setItem('snapp_initialized', 'true');
        console.log('ساختار داده‌ها ایجاد شد.');
    }
    
    // بارگذاری داده‌های نمونه
    initializeSampleData();
    
    // تنظیمات اولیه نقشه
    setTimeout(() => {
        if (map) {
            map.invalidateSize();
            addLocationMarkers();
        }
    }, 1000);
    
    // بارگذاری مکان‌های محبوب
    loadPopularLocations();
    
    // نمایش پیام خوش‌آمدگویی
    setTimeout(() => {
        if (!currentUser) {
            showNotification('برای استفاده از خدمات اسنپ، لطفاً وارد حساب کاربری خود شوید.', 'info');
        }
    }, 3000);
    
    console.log('سیستم اسنپ آماده به کار است.');
}

// فراخوانی اولیه سیستم
initializeSystem();

// متصل کردن توابع به آبجکت window برای دسترسی از HTML
window.logout = logout;
window.toggleOnlineStatus = toggleOnlineStatus;
window.printReceipt = printReceipt;
window.showDailyReport = showDailyReport;
window.showSystemStatus = showSystemStatus;

// شروع سیستم
console.log('اسنپ افغانستان - سیستم تاکسی اینترنتی');
console.log('نسخه: 1.0.0');
console.log('تاریخ انتشار: ۱۴۰۳');
console.log('تمامی حقوق محفوظ است © اسنپ افغانستان');