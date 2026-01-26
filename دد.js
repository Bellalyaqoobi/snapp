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
        { name: "شفاخانه ایندیانا", coordinates: [34.5250, 69.1850] },
        
        // هتل‌ها
        { name: "هتل انترکانتیننتال", coordinates: [34.5300, 69.1650] },
        { name: "هتل سرینا", coordinates: [34.5250, 69.1700] },
        
        // پارک‌ها
        { name: "پارک بابه مزاری", coordinates: [34.5100, 69.1750] },
        { name: "پارک زرنگار", coordinates: [34.5200, 69.1750] }
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
let userNotifications = [];
let savedLocations = [];

// ذخیره‌سازی داده‌ها
const storage = {
    get: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error accessing localStorage:', e);
            return [];
        }
    },
    
    set: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    },
    
    setSecure: (key, data) => {
        try {
            const encrypted = btoa(JSON.stringify(data));
            localStorage.setItem(key, encrypted);
        } catch (e) {
            console.error('Encryption error:', e);
            this.set(key, data);
        }
    },
    
    getSecure: (key) => {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;
            const decrypted = atob(encrypted);
            return JSON.parse(decrypted);
        } catch (e) {
            console.error('Decryption error:', e);
            return this.get(key);
        }
    }
};

// کلاس‌های سیستم
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
        this.tazkira_number = data.tazkira_number || '';
        this.tazkira_image = data.tazkira_image || '';
        this.profile_image = data.profile_image || '';
        this.whatsapp_number = data.whatsapp_number || '';
        this.verified_whatsapp = data.verified_whatsapp || false;
        this.verified_email = data.verified_email || false;
        this.notification_settings = data.notification_settings || {
            trip_updates: true,
            promotions: true,
            news: true,
            sound: true
        };
        this.preferences = data.preferences || {
            favorite_ride_type: 'economy',
            auto_pay: false,
            language: 'fa'
        };
        
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
            this.daily_target = data.daily_target || 5;
            this.accepted_payment_methods = data.accepted_payment_methods || ['cash', 'wallet'];
            this.working_hours = data.working_hours || {
                start: '08:00',
                end: '22:00',
                days: [0, 1, 2, 3, 4, 5, 6]
            };
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
        const userData = users.find(u => u.id == id);
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
        const users = storage.get('snapp_users');
        return users.map(data => new User(data));
    }

    static getPassengers() {
        return this.getAll().filter(user => user.role === 'passenger' && user.status === 'approved');
    }

    static getDrivers() {
        return this.getAll().filter(user => user.role === 'driver' && user.status === 'approved');
    }

    static delete(id) {
        let users = storage.get('snapp_users');
        users = users.filter(u => u.id != id);
        storage.set('snapp_users', users);
    }

    updateRating(newRating) {
        const totalScore = (this.rating * (this.total_ratings || 0)) + newRating;
        this.total_ratings = (this.total_ratings || 0) + 1;
        this.rating = parseFloat((totalScore / this.total_ratings).toFixed(1));
        this.save();
    }

    static getPendingUsers() {
        return this.getAll().filter(user => user.status === 'pending');
    }

    static getActiveUsers() {
        return this.getAll().filter(user => user.status === 'approved');
    }
}

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
        this.notes = data.notes || '';
        this.stop_points = data.stop_points || [];
        this.passenger_count = data.passenger_count || 1;
        this.luggage_count = data.luggage_count || 0;
        this.scheduled_time = data.scheduled_time;
        this.discount_applied = data.discount_applied || 0;
        this.final_price = data.final_price || data.price;
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
        const tripData = trips.find(t => t.id == id);
        return tripData ? new Trip(tripData) : null;
    }

    static findByUserId(userId) {
        const trips = storage.get('snapp_trips');
        return trips
            .filter(t => t.user_id == userId)
            .map(data => new Trip(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    static getAll() {
        const trips = storage.get('snapp_trips');
        return trips.map(data => new Trip(data));
    }

    static getCompletedTrips() {
        return this.getAll().filter(trip => trip.status === 'completed');
    }

    static getActiveTrips() {
        return this.getAll().filter(trip => 
            ['requested', 'confirmed', 'in_progress'].includes(trip.status)
        );
    }

    static delete(id) {
        let trips = storage.get('snapp_trips');
        trips = trips.filter(t => t.id != id);
        storage.set('snapp_trips', trips);
    }

    static getTotalRevenue() {
        return this.getCompletedTrips().reduce((sum, trip) => sum + (trip.price || 0), 0);
    }
}

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
        this.ride_types = data.ride_types || ['economy', 'comfort', 'bike'];
        this.for_new_users = data.for_new_users || false;
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
            .filter(d => {
                const expiryDate = new Date(d.expiry_date);
                return expiryDate > now && 
                       d.used_count < d.max_uses &&
                       d.active !== false;
            })
            .map(data => new Discount(data));
    }

    static getAll() {
        const discounts = storage.get('snapp_discounts');
        return discounts.map(data => new Discount(data));
    }

    static findByCode(code) {
        const discounts = storage.get('snapp_discounts');
        const discountData = discounts.find(d => d.code === code);
        return discountData ? new Discount(discountData) : null;
    }

    static delete(id) {
        let discounts = storage.get('snapp_discounts');
        discounts = discounts.filter(d => d.id != id);
        storage.set('snapp_discounts', discounts);
    }

    isValid() {
        try {
            const now = new Date();
            const expiryDate = new Date(this.expiry_date);
            return expiryDate > now &&
                   this.used_count < this.max_uses &&
                   this.active !== false;
        } catch (e) {
            return false;
        }
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

class SupportTicket {
    constructor(data) {
        this.id = data.id || Date.now();
        this.user_id = data.user_id;
        this.user_name = data.user_name;
        this.user_role = data.user_role;
        this.subject = data.subject;
        this.category = data.category || 'general';
        this.message = data.message;
        this.status = data.status || 'open';
        this.priority = data.priority || 'medium';
        this.attachments = data.attachments || [];
        this.responses = data.responses || [];
        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || new Date().toISOString();
        this.closed_at = data.closed_at;
        this.assigned_to = data.assigned_to;
        this.resolved_by = data.resolved_by;
    }

    save() {
        let tickets = storage.get('snapp_tickets');
        const index = tickets.findIndex(t => t.id === this.id);
        if (index !== -1) {
            tickets[index] = this;
        } else {
            tickets.push(this);
        }
        storage.set('snapp_tickets', tickets);
    }

    addResponse(response) {
        this.responses.push({
            ...response,
            timestamp: new Date().toISOString()
        });
        this.updated_at = new Date().toISOString();
        this.save();
    }

    close(resolvedBy) {
        this.status = 'closed';
        this.closed_at = new Date().toISOString();
        this.resolved_by = resolvedBy;
        this.save();
    }

    static findById(id) {
        const tickets = storage.get('snapp_tickets');
        const ticketData = tickets.find(t => t.id == id);
        return ticketData ? new SupportTicket(ticketData) : null;
    }

    static findByUserId(userId) {
        const tickets = storage.get('snapp_tickets');
        return tickets
            .filter(t => t.user_id == userId)
            .map(data => new SupportTicket(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    static getAll() {
        const tickets = storage.get('snapp_tickets');
        return tickets.map(data => new SupportTicket(data));
    }

    static getOpenTickets() {
        return this.getAll().filter(ticket => ticket.status === 'open');
    }

    static getTicketsByCategory(category) {
        return this.getAll().filter(ticket => ticket.category === category);
    }
}

class Notification {
    constructor(data) {
        this.id = data.id || Date.now();
        this.user_id = data.user_id;
        this.type = data.type || 'info';
        this.title = data.title;
        this.message = data.message;
        this.read = data.read || false;
        this.created_at = data.created_at || new Date().toISOString();
        this.action = data.action;
        this.action_data = data.action_data;
        this.expires_at = data.expires_at;
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

    markAsRead() {
        this.read = true;
        this.save();
    }

    static findByUserId(userId) {
        const notifications = storage.get('snapp_notifications');
        return notifications
            .filter(n => n.user_id == userId)
            .map(data => new Notification(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    static getUnreadCount(userId) {
        const notifications = storage.get('snapp_notifications');
        return notifications.filter(n => n.user_id == userId && !n.read).length;
    }

    static createForUser(userId, title, message, type = 'info') {
        const notification = new Notification({
            user_id: userId,
            title,
            message,
            type
        });
        notification.save();
        return notification;
    }
}

class SavedLocation {
    constructor(data) {
        this.id = data.id || Date.now();
        this.user_id = data.user_id;
        this.name = data.name;
        this.address = data.address;
        this.coordinates = data.coordinates;
        this.type = data.type || 'home';
        this.created_at = data.created_at || new Date().toISOString();
        this.icon = data.icon || 'home';
    }

    save() {
        let locations = storage.get('snapp_saved_locations');
        const index = locations.findIndex(l => l.id === this.id);
        if (index !== -1) {
            locations[index] = this;
        } else {
            locations.push(this);
        }
        storage.set('snapp_saved_locations', locations);
    }

    static findByUserId(userId) {
        const locations = storage.get('snapp_saved_locations');
        return locations
            .filter(l => l.user_id == userId)
            .map(data => new SavedLocation(data))
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    static findByType(userId, type) {
        const locations = storage.get('snapp_saved_locations');
        const locationData = locations.find(l => 
            l.user_id == userId && l.type === type
        );
        return locationData ? new SavedLocation(locationData) : null;
    }

    static delete(id) {
        let locations = storage.get('snapp_saved_locations');
        locations = locations.filter(l => l.id != id);
        storage.set('snapp_saved_locations', locations);
    }
}

class Transaction {
    constructor(data) {
        this.id = data.id || Date.now();
        this.user_id = data.user_id;
        this.amount = data.amount;
        this.type = data.type;
        this.description = data.description;
        this.status = data.status || 'completed';
        this.reference_id = data.reference_id;
        this.payment_method = data.payment_method;
        this.created_at = data.created_at || new Date().toISOString();
    }

    save() {
        let transactions = storage.get('snapp_transactions');
        const index = transactions.findIndex(t => t.id === this.id);
        if (index !== -1) {
            transactions[index] = this;
        } else {
            transactions.push(this);
        }
        storage.set('snapp_transactions', transactions);
    }

    static findByUserId(userId) {
        const transactions = storage.get('snapp_transactions');
        return transactions
            .filter(t => t.user_id == userId)
            .map(data => new Transaction(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    static createWalletCharge(userId, amount, paymentMethod) {
        const transaction = new Transaction({
            user_id: userId,
            amount,
            type: 'charge',
            description: 'شارژ کیف پول',
            payment_method: paymentMethod
        });
        transaction.save();
        return transaction;
    }

    static createTripPayment(userId, amount, tripId) {
        const transaction = new Transaction({
            user_id: userId,
            amount: -amount,
            type: 'payment',
            description: 'پرداخت سفر',
            reference_id: tripId,
            payment_method: 'wallet'
        });
        transaction.save();
        return transaction;
    }
}

class RewardSystem {
    constructor() {
        this.levels = {
            1: { name: 'کاربر جدید', minTrips: 0, discount: 5, color: '#95a5a6' },
            2: { name: 'مسافر نقره‌ای', minTrips: 10, discount: 10, color: '#bdc3c7' },
            3: { name: 'مسافر طلایی', minTrips: 30, discount: 15, color: '#f1c40f' },
            4: { name: 'مسافر پلاتینیومی', minTrips: 60, discount: 20, color: '#e74c3c' },
            5: { name: 'مسافر VIP', minTrips: 100, discount: 25, color: '#9b59b6' }
        };

        this.badges = [
            { id: 'first_trip', name: 'اولین سفر', icon: '🎉', description: 'اولین سفر با اسنپ' },
            { id: 'weekend_rider', name: 'مسافر آخر هفته', icon: '🎯', description: '۳ سفر در آخر هفته' },
            { id: 'night_rider', name: 'مسافر شبانه', icon: '🌙', description: '۵ سفر بعد از ساعت 10 شب' },
            { id: 'safety_first', name: 'ایمنی اول', icon: '🛡️', description: '۱۰ سفر بدون مشکل' },
            { id: 'early_bird', name: 'پرنده سحرخیز', icon: '🌅', description: '۵ سفر قبل از ساعت 7 صبح' },
            { id: 'city_explorer', name: 'کاوشگر شهر', icon: '🏙️', description: 'سفر به 10 منطقه مختلف' }
        ];
    }

    calculateLevel(totalTrips) {
        let level = 1;
        for (let i = 5; i >= 1; i--) {
            if (totalTrips >= this.levels[i].minTrips) {
                level = i;
                break;
            }
        }
        return level;
    }

    getUserLevel(userId) {
        const trips = Trip.findByUserId(userId);
        const completedTrips = trips.filter(t => t.status === 'completed').length;
        return this.calculateLevel(completedTrips);
    }

    getEarnedBadges(userId) {
        const trips = Trip.findByUserId(userId);
        const earnedBadges = [];
        
        if (trips.length >= 1) {
            earnedBadges.push(this.badges[0]);
        }
        
        const weekendTrips = trips.filter(t => {
            try {
                const date = new Date(t.created_at);
                return date.getDay() === 5 || date.getDay() === 6;
            } catch {
                return false;
            }
        });
        
        if (weekendTrips.length >= 3) {
            earnedBadges.push(this.badges[1]);
        }
        
        const nightTrips = trips.filter(t => {
            try {
                const date = new Date(t.created_at);
                const hour = date.getHours();
                return hour >= 22 || hour <= 4;
            } catch {
                return false;
            }
        });
        
        if (nightTrips.length >= 5) {
            earnedBadges.push(this.badges[2]);
        }
        
        return earnedBadges;
    }
}

// توابع کمکی
function showNotification(message, type = 'success') {
    let notificationEl = document.getElementById('notification');
    
    if (!notificationEl) {
        notificationEl = document.createElement('div');
        notificationEl.id = 'notification';
        document.body.appendChild(notificationEl);
    }
    
    notificationEl.textContent = message;
    notificationEl.className = `notification ${type}`;
    notificationEl.style.display = 'block';
    
    setTimeout(() => {
        if (notificationEl) {
            notificationEl.style.display = 'none';
        }
    }, 5000);
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
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }
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
        return date.toLocaleDateString('fa-IR') + ' ' + 
               date.toLocaleTimeString('fa-IR', { 
                   hour: '2-digit', 
                   minute: '2-digit',
                   hour12: false 
               });
    } catch (e) {
        return 'نامشخص';
    }
}

function generateRandomId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// ===================== مدیریت نقشه =====================
function initMap() {
    try {
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('Element #map not found');
            return;
        }
        
        map = L.map('map').setView([34.5250, 69.1800], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        L.control.scale().addTo(map);
        addLocationMarkers();
        createDistrictsList();
        enableMapClickSelection();
        
    } catch (error) {
        console.error('Error initializing map:', error);
        showNotification('خطا در بارگذاری نقشه. لطفاً اینترنت خود را بررسی کنید.', 'error');
    }
}

function addLocationMarkers() {
    if (!map) return;

    markers.forEach(marker => {
        if (marker && marker.remove) {
            try {
                marker.remove();
            } catch (e) {
                console.error('Error removing marker:', e);
            }
        }
    });
    
    markers = [];

    kabulData.locations.forEach(location => {
        try {
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
                .bindPopup(`<b>${location.name}</b><br><button class="select-location-btn" data-name="${location.name}">انتخاب این مکان</button>`);

            markers.push(marker);
        } catch (e) {
            console.error('Error adding marker:', e);
        }
    });
    
    setTimeout(() => {
        document.querySelectorAll('.select-location-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const locationName = this.getAttribute('data-name');
                const location = kabulData.locations.find(loc => loc.name === locationName);
                if (location) {
                    openLocationSelectionModal(location.coordinates[0], location.coordinates[1]);
                }
            });
        });
    }, 100);
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
    const existingModal = document.getElementById('locationSelectionModal');
    if (existingModal) {
        existingModal.remove();
    }
    
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
                <div style="margin-top: 15px;">
                    <button id="saveAsFavorite" class="btn-secondary" style="width: 100%;">
                        <i class="fas fa-star"></i> ذخیره به عنوان مکان مورد علاقه
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('selectAsPickup').addEventListener('click', () => {
        const customName = document.getElementById('customLocationName').value.trim();
        const locationName = customName || `مکان انتخاب شده (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        
        setPickupLocation(locationName, [lat, lng]);
        modal.remove();
        showNotification(`مبدا به "${locationName}" تنظیم شد`, 'success');
    });
    
    document.getElementById('selectAsDestination').addEventListener('click', () => {
        const customName = document.getElementById('customLocationName').value.trim();
        const locationName = customName || `مکان انتخاب شده (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        
        setDestinationLocation(locationName, [lat, lng]);
        modal.remove();
        showNotification(`مقصد به "${locationName}" تنظیم شد`, 'success');
    });
    
    document.getElementById('saveAsFavorite').addEventListener('click', () => {
        if (!currentUser) {
            showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
            modal.remove();
            openAuthModal();
            return;
        }
        
        const customName = document.getElementById('customLocationName').value.trim();
        if (!customName) {
            showNotification('لطفاً نامی برای مکان مورد علاقه وارد کنید', 'error');
            return;
        }
        
        const savedLocation = new SavedLocation({
            user_id: currentUser.id,
            name: customName,
            address: `مکان ذخیره شده`,
            coordinates: [lat, lng],
            type: 'favorite'
        });
        
        savedLocation.save();
        modal.remove();
        showNotification(`"${customName}" به عنوان مکان مورد علاقه ذخیره شد`, 'success');
    });
    
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
    
    if (pickupMarker && pickupMarker.remove) {
        pickupMarker.remove();
    }
    
    try {
        pickupMarker = L.marker(coords, {
            icon: L.divIcon({
                html: '<div style="background: var(--primary); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><i class="fas fa-circle"></i></div>',
                className: 'pickup-marker',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(map).bindPopup(`<b>مبدا:</b> ${name}`);
    } catch (e) {
        console.error('Error setting pickup marker:', e);
    }
    
    calculateDistanceAndPrice();
}

function setDestinationLocation(name, coords) {
    const destinationInput = document.getElementById('destination');
    if (destinationInput) {
        destinationInput.value = name;
    }
    selectedDestinationCoords = coords;
    
    if (destinationMarker && destinationMarker.remove) {
        destinationMarker.remove();
    }
    
    try {
        destinationMarker = L.marker(coords, {
            icon: L.divIcon({
                html: '<div style="background: var(--accent); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"><i class="fas fa-flag-checkered"></i></div>',
                className: 'destination-marker',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            })
        }).addTo(map).bindPopup(`<b>مقصد:</b> ${name}`);
    } catch (e) {
        console.error('Error setting destination marker:', e);
    }
    
    calculateDistanceAndPrice();
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

// ===================== محاسبه مسافت و قیمت =====================
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
        currentDistance = parseFloat(randomDistance) || 5;
    } else {
        currentDistance = calculateDistance(pickupCoords, destinationCoords);
    }

    const distanceValue = document.getElementById('distanceValue');
    if (distanceValue) distanceValue.textContent = `${currentDistance} کیلومتر`;
    
    tripCalculator.classList.add('active');
    updatePrice();
}

function calculateDistance(coord1, coord2) {
    if (!coord1 || !coord2 || !Array.isArray(coord1) || !Array.isArray(coord2)) {
        return parseFloat((Math.random() * 15 + 2).toFixed(1));
    }
    
    const [lat1, lon1] = coord1.map(Number);
    const [lat2, lon2] = coord2.map(Number);
    
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
        return parseFloat((Math.random() * 15 + 2).toFixed(1));
    }
    
    try {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return parseFloat(distance.toFixed(1));
    } catch (e) {
        console.error('Error calculating distance:', e);
        return parseFloat((Math.random() * 15 + 2).toFixed(1));
    }
}

function updatePrice() {
    if (currentDistance === 0) return;

    const selectedRide = document.querySelector('.ride-type.selected');
    if (!selectedRide) return;
    
    const baseFare = parseInt(selectedRide.dataset.baseFare) || 50;
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
    const baseFare = baseFares[type] || 50;
    return baseFare + Math.round(currentDistance * 10);
}

// ===================== مدیریت کاربران =====================
function checkUserLoginStatus() {
    try {
        const savedUser = localStorage.getItem('snapp_current_user');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            if (userData && userData.id) {
                const user = User.findById(userData.id);
                if (user) {
                    currentUser = user;
                    isAdmin = currentUser.role === 'admin';
                    updateUIAfterLogin();
                }
            }
        }
    } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('snapp_current_user');
    }
    
    initializeSampleData();
    loadUserNotifications();
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
        userAvatar.textContent = currentUser.name ? currentUser.name.charAt(0) : 'U';
    }
    if (userName && currentUser) {
        userName.textContent = currentUser.name || 'کاربر';
    }
    
    if (isAdmin) {
        const adminLink = document.getElementById('adminLink');
        const mobileAdminLink = document.getElementById('mobileAdminLink');
        if (adminLink) adminLink.style.display = 'block';
        if (mobileAdminLink) mobileAdminLink.style.display = 'block';
    }
    
    updateProfilePage();
    loadSavedLocations();
    updateNotificationBadge();
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

// ===================== سیستم ثبت‌نام =====================
function openAuthModal() {
    const existingModal = document.getElementById('authModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'authModal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 400px;">
            <div class="modal-header">
                <h3>ورود / ثبت‌نام</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">ورود</button>
                    <button class="auth-tab" data-tab="register">ثبت‌نام</button>
                </div>
                
                <div class="auth-content">
                    <!-- فرم ورود -->
                    <form id="loginForm" class="auth-form active" data-tab="login">
                        <div class="form-group">
                            <label for="loginEmail">ایمیل یا شماره تماس</label>
                            <input type="text" id="loginEmail" class="form-input" placeholder="ایمیل یا شماره تماس" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="loginPassword">رمز عبور</label>
                            <input type="password" id="loginPassword" class="form-input" placeholder="رمز عبور" required>
                        </div>
                        
                        <div class="form-group">
                            <button type="submit" class="btn-primary" style="width: 100%;">
                                ورود به حساب
                            </button>
                        </div>
                        
                        <div class="form-links">
                            <a href="#" id="forgotPassword">فراموشی رمز عبور</a>
                        </div>
                    </form>
                    
                    <!-- فرم ثبت‌نام -->
                    <form id="registerForm" class="auth-form" data-tab="register">
                        <div class="form-group">
                            <label for="registerName">نام کامل</label>
                            <input type="text" id="registerName" class="form-input" placeholder="نام کامل" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="registerEmail">ایمیل</label>
                            <input type="email" id="registerEmail" class="form-input" placeholder="ایمیل" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="registerPhone">شماره تماس</label>
                            <input type="tel" id="registerPhone" class="form-input" placeholder="شماره تماس" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="registerRole">نقش</label>
                            <select id="registerRole" class="form-input" required>
                                <option value="passenger">مسافر</option>
                                <option value="driver">راننده</option>
                            </select>
                        </div>
                        
                        <div id="driverFields" style="display: none;">
                            <div class="form-group">
                                <label for="vehicleType">نوع وسیله</label>
                                <select id="vehicleType" class="form-input">
                                    <option value="car">ماشین</option>
                                    <option value="bike">موتور</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="carModel">مدل ماشین</label>
                                <input type="text" id="carModel" class="form-input" placeholder="مدل ماشین">
                            </div>
                            
                            <div class="form-group">
                                <label for="plateNumber">شماره پلاک</label>
                                <input type="text" id="plateNumber" class="form-input" placeholder="شماره پلاک">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="registerPassword">رمز عبور</label>
                            <input type="password" id="registerPassword" class="form-input" placeholder="رمز عبور" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="registerConfirmPassword">تکرار رمز عبور</label>
                            <input type="password" id="registerConfirmPassword" class="form-input" placeholder="تکرار رمز عبور" required>
                        </div>
                        
                        <div class="form-group">
                            <button type="submit" class="btn-primary" style="width: 100%;">
                                ایجاد حساب
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // بستن مدال
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // مدیریت تب‌ها
    modal.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            modal.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            modal.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            
            this.classList.add('active');
            const form = modal.querySelector(`.auth-form[data-tab="${tabId}"]`);
            if (form) form.classList.add('active');
        });
    });
    
    // مدیریت نمایش فیلدهای راننده
    const roleSelect = modal.querySelector('#registerRole');
    if (roleSelect) {
        roleSelect.addEventListener('change', function() {
            const driverFields = modal.querySelector('#driverFields');
            if (this.value === 'driver') {
                driverFields.style.display = 'block';
            } else {
                driverFields.style.display = 'none';
            }
        });
    }
    
    // مدیریت فرم ورود
    modal.querySelector('#loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = modal.querySelector('#loginEmail').value.trim();
        const password = modal.querySelector('#loginPassword').value;
        
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
        modal.remove();
        updateUIAfterLogin();
    });
    
    // مدیریت فرم ثبت‌نام
    modal.querySelector('#registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = modal.querySelector('#registerName').value.trim();
        const email = modal.querySelector('#registerEmail').value.trim();
        const phone = modal.querySelector('#registerPhone').value.trim();
        const role = modal.querySelector('#registerRole').value;
        const password = modal.querySelector('#registerPassword').value;
        const confirmPassword = modal.querySelector('#registerConfirmPassword').value;
        
        // اعتبارسنجی
        if (!name || name.length < 2) {
            showNotification('نام باید حداقل ۲ حرف داشته باشد', 'error');
            return;
        }
        
        if (!email.includes('@')) {
            showNotification('ایمیل معتبر وارد کنید', 'error');
            return;
        }
        
        if (phone.length < 10) {
            showNotification('شماره تماس معتبر وارد کنید', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('رمز عبور باید حداقل ۶ حرف داشته باشد', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('رمز عبور و تکرار آن مطابقت ندارند', 'error');
            return;
        }
        
        // بررسی تکراری نبودن ایمیل و شماره
        const existingUser = User.findByEmailOrPhone(email);
        if (existingUser) {
            showNotification('این ایمیل قبلاً ثبت شده است', 'error');
            return;
        }
        
        const existingPhone = User.findByEmailOrPhone(phone);
        if (existingPhone) {
            showNotification('این شماره تماس قبلاً ثبت شده است', 'error');
            return;
        }
        
        // ایجاد کاربر جدید
        const userData = {
            id: generateRandomId(),
            name,
            email,
            phone,
            password,
            role,
            status: 'pending',
            wallet_balance: role === 'passenger' ? 1000 : 0,
            rating: role === 'driver' ? 4.5 : 0
        };
        
        // اضافه کردن اطلاعات راننده
        if (role === 'driver') {
            userData.vehicle_type = modal.querySelector('#vehicleType').value;
            userData.car_model = modal.querySelector('#carModel').value.trim() || '';
            userData.plate_number = modal.querySelector('#plateNumber').value.trim() || '';
            userData.driver_status = 'pending';
            userData.online_status = 'offline';
            userData.total_trips = 0;
            userData.earning = 0;
        }
        
        const newUser = new User(userData);
        newUser.save();
        
        // ارسال نوتیفیکیشن
        Notification.createForUser(
            newUser.id,
            'خوش آمدید به اسنپ',
            `حساب شما با موفقیت ایجاد شد. ${role === 'driver' ? 'پس از تأیید مدیریت، می‌توانید فعالیت کنید.' : 'می‌توانید سفارش خود را ثبت کنید.'}`,
            'info'
        );
        
        // اطلاع‌رسانی به ادمین برای کاربران جدید
        const adminUsers = User.getAll().filter(u => u.role === 'admin');
        adminUsers.forEach(admin => {
            Notification.createForUser(
                admin.id,
                'کاربر جدید ثبت‌نام کرد',
                `کاربر ${name} (${email}) با نقش ${role === 'driver' ? 'راننده' : 'مسافر'} ثبت‌نام کرده است.`,
                'info'
            );
        });
        
        showNotification('حساب کاربری با موفقیت ایجاد شد. پس از تأیید مدیریت می‌توانید وارد شوید.', 'success');
        modal.remove();
    });
    
    // فراموشی رمز عبور
    modal.querySelector('#forgotPassword').addEventListener('click', function(e) {
        e.preventDefault();
        showNotification('این قابلیت در نسخه نمایشی فعال نیست', 'info');
    });
    
    // مدیریت کلیک خارج از مدال
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===================== پنل مدیریت =====================
function openAdminPanel() {
    if (!isAdmin) {
        showNotification('شما دسترسی به پنل مدیریت ندارید', 'error');
        return;
    }
    
    const existingModal = document.getElementById('adminPanelModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'adminPanelModal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 1000px; max-width: 95vw; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>پنل مدیریت اسنپ</h3>
                <span class="close-modal">&times;</span>
            </div>
            
            <div class="admin-tabs">
                <button class="admin-tab active" data-tab="dashboard">داشبورد</button>
                <button class="admin-tab" data-tab="users">کاربران</button>
                <button class="admin-tab" data-tab="drivers">رانندگان</button>
                <button class="admin-tab" data-tab="trips">سفرها</button>
                <button class="admin-tab" data-tab="tickets">تیکت‌ها</button>
                <button class="admin-tab" data-tab="reports">گزارش‌ها</button>
                <button class="admin-tab" data-tab="discounts">تخفیف‌ها</button>
            </div>
            
            <div class="admin-content">
                <div id="dashboard-tab" class="admin-tab-content active">
                    <div class="dashboard-stats">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="stat-info">
                                <h3 id="totalUsers">0</h3>
                                <p>کل کاربران</p>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-car"></i>
                            </div>
                            <div class="stat-info">
                                <h3 id="totalDrivers">0</h3>
                                <p>رانندگان فعال</p>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-road"></i>
                            </div>
                            <div class="stat-info">
                                <h3 id="totalTrips">0</h3>
                                <p>سفرهای امروز</p>
                            </div>
                        </div>
                        
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-money-bill-wave"></i>
                            </div>
                            <div class="stat-info">
                                <h3 id="totalRevenue">0</h3>
                                <p>درآمد امروز</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dashboard-charts">
                        <div class="chart-container">
                            <h4>آمار سفرها در هفته گذشته</h4>
                            <canvas id="tripsChart" width="400" height="200"></canvas>
                        </div>
                        
                        <div class="chart-container">
                            <h4>توزیع نوع سفرها</h4>
                            <canvas id="rideTypeChart" width="400" height="200"></canvas>
                        </div>
                    </div>
                </div>
                
                <div id="users-tab" class="admin-tab-content">
                    <div class="admin-section-header">
                        <h3>مدیریت کاربران</h3>
                        <button class="btn-primary" onclick="createNewUser()">
                            <i class="fas fa-plus"></i> کاربر جدید
                        </button>
                    </div>
                    <div id="usersTableContainer"></div>
                </div>
                
                <div id="drivers-tab" class="admin-tab-content">
                    <div class="admin-section-header">
                        <h3>مدیریت رانندگان</h3>
                    </div>
                    <div id="driversTableContainer"></div>
                </div>
                
                <div id="trips-tab" class="admin-tab-content">
                    <div class="admin-section-header">
                        <h3>مدیریت سفرها</h3>
                    </div>
                    <div id="tripsTableContainer"></div>
                </div>
                
                <div id="tickets-tab" class="admin-tab-content">
                    <div class="admin-section-header">
                        <h3>تیکت‌های پشتیبانی</h3>
                    </div>
                    <div id="ticketsTableContainer"></div>
                </div>
                
                <div id="reports-tab" class="admin-tab-content">
                    <div class="admin-section-header">
                        <h3>گزارش‌های سیستم</h3>
                    </div>
                    <div id="reportsContent">
                        <div class="report-filters">
                            <select id="reportType" class="form-input">
                                <option value="daily">گزارش روزانه</option>
                                <option value="weekly">گزارش هفتگی</option>
                                <option value="monthly">گزارش ماهانه</option>
                                <option value="drivers">گزارش رانندگان</option>
                            </select>
                            <input type="date" id="reportDate" class="form-input">
                            <button class="btn-primary" onclick="generateReport()">تولید گزارش</button>
                            <button class="btn-secondary" onclick="exportReport()">خروجی PDF</button>
                        </div>
                        <div id="reportResults"></div>
                    </div>
                </div>
                
                <div id="discounts-tab" class="admin-tab-content">
                    <div class="admin-section-header">
                        <h3>مدیریت تخفیف‌ها</h3>
                        <button class="btn-primary" onclick="createNewDiscount()">
                            <i class="fas fa-plus"></i> تخفیف جدید
                        </button>
                    </div>
                    <div id="discountsTableContainer"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // بستن مدال
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    // مدیریت تب‌ها
    modal.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            modal.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            modal.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            const tabContent = modal.querySelector(`#${tabId}-tab`);
            if (tabContent) tabContent.classList.add('active');
            
            // بارگذاری محتوای تب
            switch(tabId) {
                case 'dashboard':
                    loadAdminDashboard();
                    break;
                case 'users':
                    loadAdminUsers();
                    break;
                case 'drivers':
                    loadAdminDrivers();
                    break;
                case 'trips':
                    loadAdminTrips();
                    break;
                case 'tickets':
                    loadAdminTickets();
                    break;
                case 'discounts':
                    loadAdminDiscounts();
                    break;
            }
        });
    });
    
    // بارگذاری داشبورد اولیه
    loadAdminDashboard();
    
    // مدیریت کلیک خارج از مدال
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function loadAdminDashboard() {
    try {
        const users = User.getAll();
        const drivers = User.getDrivers();
        const trips = Trip.getAll();
        const today = new Date().toDateString();
        const todayTrips = trips.filter(t => {
            try {
                return new Date(t.created_at).toDateString() === today;
            } catch {
                return false;
            }
        });
        const todayRevenue = todayTrips
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + (t.price || 0), 0);
        
        const totalUsersEl = document.getElementById('totalUsers');
        const totalDriversEl = document.getElementById('totalDrivers');
        const totalTripsEl = document.getElementById('totalTrips');
        const totalRevenueEl = document.getElementById('totalRevenue');
        
        if (totalUsersEl) totalUsersEl.textContent = users.length;
        if (totalDriversEl) totalDriversEl.textContent = drivers.length;
        if (totalTripsEl) totalTripsEl.textContent = todayTrips.length;
        if (totalRevenueEl) totalRevenueEl.textContent = formatCurrency(todayRevenue);
        
        // ایجاد نمودارها
        createTripsChart();
        createRideTypeChart();
    } catch (e) {
        console.error('Error loading admin dashboard:', e);
    }
}

function createTripsChart() {
    try {
        const canvas = document.getElementById('tripsChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const last7Days = [];
        const tripCounts = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push(date.toLocaleDateString('fa-IR', { weekday: 'short' }));
            
            const targetDate = date.toDateString();
            const trips = Trip.getAll().filter(t => {
                try {
                    return new Date(t.created_at).toDateString() === targetDate;
                } catch {
                    return false;
                }
            });
            tripCounts.push(trips.length);
        }
        
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js library not loaded');
            return;
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days,
                datasets: [{
                    label: 'تعداد سفرها',
                    data: tripCounts,
                    borderColor: '#00D474',
                    backgroundColor: 'rgba(0, 212, 116, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        rtl: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.error('Error creating trips chart:', e);
    }
}

function createRideTypeChart() {
    try {
        const canvas = document.getElementById('rideTypeChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const trips = Trip.getAll();
        
        const rideTypes = {
            economy: trips.filter(t => t.ride_type === 'economy').length,
            comfort: trips.filter(t => t.ride_type === 'comfort').length,
            bike: trips.filter(t => t.ride_type === 'bike').length
        };
        
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js library not loaded');
            return;
        }
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['اقتصادی', 'کلاسیک', 'موتور'],
                datasets: [{
                    data: [rideTypes.economy, rideTypes.comfort, rideTypes.bike],
                    backgroundColor: [
                        '#00D474',
                        '#3498db',
                        '#f39c12'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        rtl: true
                    }
                }
            }
        });
    } catch (e) {
        console.error('Error creating ride type chart:', e);
    }
}

function loadAdminUsers() {
    const container = document.getElementById('usersTableContainer');
    if (!container) return;
    
    try {
        const users = User.getAll();
        
        container.innerHTML = `
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>شناسه</th>
                            <th>نام</th>
                            <th>ایمیل</th>
                            <th>شماره تماس</th>
                            <th>نقش</th>
                            <th>وضعیت</th>
                            <th>تاریخ ثبت</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td>${user.phone}</td>
                                <td>
                                    <span class="role-badge ${user.role}">
                                        ${user.role === 'admin' ? 'مدیر' : user.role === 'driver' ? 'راننده' : 'مسافر'}
                                    </span>
                                </td>
                                <td>
                                    <span class="status-badge ${user.status === 'approved' ? 'status-active' : 'status-pending'}">
                                        ${user.status === 'approved' ? 'تأیید شده' : 'در انتظار'}
                                    </span>
                                </td>
                                <td>${formatDate(user.created_at)}</td>
                                <td>
                                    <div class="action-buttons">
                                        ${user.status !== 'approved' ? `
                                        <button class="action-btn btn-approve" onclick="approveUser('${user.id}')">تأیید</button>
                                        ` : ''}
                                        <button class="action-btn btn-danger" onclick="deleteUser('${user.id}')">حذف</button>
                                        <button class="action-btn btn-info" onclick="viewUserDetails('${user.id}')">جزئیات</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) {
        console.error('Error loading admin users:', e);
        container.innerHTML = '<p class="error-message">خطا در بارگذاری کاربران</p>';
    }
}

function approveUser(userId) {
    try {
        const user = User.findById(userId);
        if (user) {
            user.status = 'approved';
            user.save();
            
            Notification.createForUser(
                user.id,
                'حساب کاربری شما تأیید شد',
                'حساب کاربری شما توسط مدیریت تأیید شد. اکنون می‌توانید از خدمات اسنپ استفاده کنید.',
                'success'
            );
            
            showNotification('کاربر با موفقیت تأیید شد', 'success');
            loadAdminUsers();
        }
    } catch (e) {
        console.error('Error approving user:', e);
        showNotification('خطا در تأیید کاربر', 'error');
    }
}

function deleteUser(userId) {
    if (confirm('آیا از حذف این کاربر مطمئن هستید؟')) {
        try {
            User.delete(userId);
            
            // حذف سفرهای مرتبط
            Trip.getAll()
                .filter(t => t.user_id == userId)
                .forEach(t => Trip.delete(t.id));
                
            showNotification('کاربر با موفقیت حذف شد', 'success');
            loadAdminUsers();
        } catch (e) {
            console.error('Error deleting user:', e);
            showNotification('خطا در حذف کاربر', 'error');
        }
    }
}

function viewUserDetails(userId) {
    try {
        const user = User.findById(userId);
        if (!user) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content" style="width: 600px;">
                <div class="modal-header">
                    <h3>جزئیات کاربر</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="user-details">
                        <div class="detail-row">
                            <span class="detail-label">نام:</span>
                            <span class="detail-value">${user.name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">ایمیل:</span>
                            <span class="detail-value">${user.email}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">شماره تماس:</span>
                            <span class="detail-value">${user.phone}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">نقش:</span>
                            <span class="detail-value">${user.role === 'admin' ? 'مدیر' : user.role === 'driver' ? 'راننده' : 'مسافر'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">وضعیت:</span>
                            <span class="detail-value status-badge ${user.status === 'approved' ? 'status-active' : 'status-pending'}">
                                ${user.status === 'approved' ? 'تأیید شده' : 'در انتظار'}
                            </span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">تاریخ ثبت:</span>
                            <span class="detail-value">${formatDateTime(user.created_at)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">موجودی کیف پول:</span>
                            <span class="detail-value">${formatCurrency(user.wallet_balance)}</span>
                        </div>
                        ${user.role === 'driver' ? `
                        <div class="detail-section">
                            <h4>اطلاعات راننده</h4>
                            <div class="detail-row">
                                <span class="detail-label">نوع وسیله:</span>
                                <span class="detail-value">${user.vehicle_type === 'car' ? 'ماشین' : 'موتور'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">مدل ماشین:</span>
                                <span class="detail-value">${user.car_model || '---'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">شماره پلاک:</span>
                                <span class="detail-value">${user.plate_number || '---'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">امتیاز:</span>
                                <span class="detail-value">${user.rating || 0}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">تعداد سفرها:</span>
                                <span class="detail-value">${user.total_trips || 0}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">درآمد کل:</span>
                                <span class="detail-value">${formatCurrency(user.earning || 0)}</span>
                            </div>
                        </div>
                        ` : ''}
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
    } catch (e) {
        console.error('Error viewing user details:', e);
    }
}

function createNewUser() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h3>ایجاد کاربر جدید</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="newUserForm">
                    <div class="form-group">
                        <label for="newUserName">نام کامل *</label>
                        <input type="text" id="newUserName" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="newUserEmail">ایمیل *</label>
                        <input type="email" id="newUserEmail" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="newUserPhone">شماره تماس *</label>
                        <input type="tel" id="newUserPhone" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="newUserRole">نقش *</label>
                        <select id="newUserRole" class="form-input" required>
                            <option value="passenger">مسافر</option>
                            <option value="driver">راننده</option>
                            <option value="admin">مدیر</option>
                        </select>
                    </div>
                    
                    <div id="newDriverFields" style="display: none;">
                        <div class="form-group">
                            <label for="newVehicleType">نوع وسیله</label>
                            <select id="newVehicleType" class="form-input">
                                <option value="car">ماشین</option>
                                <option value="bike">موتور</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="newCarModel">مدل ماشین</label>
                            <input type="text" id="newCarModel" class="form-input">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="newUserPassword">رمز عبور *</label>
                        <input type="password" id="newUserPassword" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="newUserStatus">وضعیت *</label>
                        <select id="newUserStatus" class="form-input" required>
                            <option value="pending">در انتظار</option>
                            <option value="approved">تأیید شده</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="btn-primary" style="width: 100%;">
                            ایجاد کاربر
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // مدیریت نمایش فیلدهای راننده
    modal.querySelector('#newUserRole').addEventListener('change', function() {
        const driverFields = modal.querySelector('#newDriverFields');
        if (this.value === 'driver') {
            driverFields.style.display = 'block';
        } else {
            driverFields.style.display = 'none';
        }
    });
    
    // مدیریت فرم
    modal.querySelector('#newUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            const name = modal.querySelector('#newUserName').value.trim();
            const email = modal.querySelector('#newUserEmail').value.trim();
            const phone = modal.querySelector('#newUserPhone').value.trim();
            const role = modal.querySelector('#newUserRole').value;
            const password = modal.querySelector('#newUserPassword').value;
            const status = modal.querySelector('#newUserStatus').value;
            
            // بررسی تکراری نبودن
            const existingUser = User.findByEmailOrPhone(email);
            if (existingUser) {
                showNotification('این ایمیل قبلاً ثبت شده است', 'error');
                return;
            }
            
            const existingPhone = User.findByEmailOrPhone(phone);
            if (existingPhone) {
                showNotification('این شماره تماس قبلاً ثبت شده است', 'error');
                return;
            }
            
            // ایجاد کاربر جدید
            const userData = {
                id: generateRandomId(),
                name,
                email,
                phone,
                password,
                role,
                status,
                wallet_balance: role === 'passenger' ? 1000 : 0
            };
            
            if (role === 'driver') {
                userData.vehicle_type = modal.querySelector('#newVehicleType').value;
                userData.car_model = modal.querySelector('#newCarModel').value.trim() || '';
                userData.driver_status = 'active';
                userData.online_status = 'online';
            }
            
            const newUser = new User(userData);
            newUser.save();
            
            showNotification('کاربر جدید با موفقیت ایجاد شد', 'success');
            modal.remove();
            loadAdminUsers();
        } catch (e) {
            console.error('Error creating new user:', e);
            showNotification('خطا در ایجاد کاربر', 'error');
        }
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function loadAdminDrivers() {
    const container = document.getElementById('driversTableContainer');
    if (!container) return;
    
    try {
        const drivers = User.getDrivers();
        
        container.innerHTML = `
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>شناسه</th>
                            <th>نام</th>
                            <th>شماره تماس</th>
                            <th>نوع وسیله</th>
                            <th>مدل ماشین</th>
                            <th>پلاک</th>
                            <th>امتیاز</th>
                            <th>وضعیت آنلاین</th>
                            <th>سفرها</th>
                            <th>درآمد</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${drivers.map(driver => `
                            <tr>
                                <td>${driver.id}</td>
                                <td>${driver.name}</td>
                                <td>${driver.phone}</td>
                                <td>${driver.vehicle_type === 'car' ? 'ماشین' : 'موتور'}</td>
                                <td>${driver.car_model || '---'}</td>
                                <td>${driver.plate_number || '---'}</td>
                                <td>
                                    <div class="rating-stars">
                                        ${'★'.repeat(Math.floor(driver.rating || 0))}
                                        ${(driver.rating || 0) % 1 >= 0.5 ? '☆' : ''}
                                        <span class="rating-text">(${driver.rating || 0})</span>
                                    </div>
                                </td>
                                <td>
                                    <span class="status-badge ${driver.online_status === 'online' ? 'status-online' : 'status-offline'}">
                                        ${driver.online_status === 'online' ? 'آنلاین' : 'آفلاین'}
                                    </span>
                                </td>
                                <td>${driver.total_trips || 0}</td>
                                <td>${formatCurrency(driver.earning || 0)}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn btn-info" onclick="viewDriverDetails('${driver.id}')">جزئیات</button>
                                        <button class="action-btn btn-warning" onclick="editDriver('${driver.id}')">ویرایش</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) {
        console.error('Error loading admin drivers:', e);
        container.innerHTML = '<p class="error-message">خطا در بارگذاری رانندگان</p>';
    }
}

function loadAdminTrips() {
    const container = document.getElementById('tripsTableContainer');
    if (!container) return;
    
    try {
        const trips = Trip.getAll();
        
        container.innerHTML = `
            <div class="admin-table-wrapper">
                <div class="table-filters">
                    <select id="tripFilter" class="form-input" onchange="filterAdminTrips()">
                        <option value="all">همه سفرها</option>
                        <option value="today">امروز</option>
                        <option value="completed">تکمیل شده</option>
                        <option value="cancelled">لغو شده</option>
                    </select>
                    <input type="date" id="tripDateFilter" class="form-input" onchange="filterAdminTrips()">
                </div>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>شماره سفر</th>
                            <th>مسافر</th>
                            <th>راننده</th>
                            <th>مبدا</th>
                            <th>مقصد</th>
                            <th>نوع سفر</th>
                            <th>مسافت</th>
                            <th>مبلغ</th>
                            <th>وضعیت</th>
                            <th>زمان</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody id="tripsTableBody">
                        ${trips.map(trip => `
                            <tr>
                                <td>#${trip.id}</td>
                                <td>${trip.user_name}</td>
                                <td>${trip.driver_name || '---'}</td>
                                <td>${trip.pickup}</td>
                                <td>${trip.destination}</td>
                                <td>${trip.ride_type === 'economy' ? 'اقتصادی' : trip.ride_type === 'comfort' ? 'کلاسیک' : 'موتور'}</td>
                                <td>${trip.distance} کیلومتر</td>
                                <td>${formatCurrency(trip.price)}</td>
                                <td>
                                    <span class="status-badge status-${trip.status}">
                                        ${trip.status === 'completed' ? 'تکمیل' : 
                                          trip.status === 'cancelled' ? 'لغو' : 
                                          trip.status === 'in_progress' ? 'در حال' : 'درخواست'}
                                    </span>
                                </td>
                                <td>${formatDateTime(trip.created_at)}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn btn-info" onclick="viewTripDetails('${trip.id}')">جزئیات</button>
                                        ${trip.status !== 'completed' && trip.status !== 'cancelled' ? `
                                        <button class="action-btn btn-danger" onclick="cancelTrip('${trip.id}')">لغو</button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) {
        console.error('Error loading admin trips:', e);
        container.innerHTML = '<p class="error-message">خطا در بارگذاری سفرها</p>';
    }
}

function filterAdminTrips() {
    const filter = document.getElementById('tripFilter')?.value || 'all';
    const dateFilter = document.getElementById('tripDateFilter')?.value;
    const tableBody = document.getElementById('tripsTableBody');
    
    if (!tableBody) return;
    
    let trips = Trip.getAll();
    
    if (filter === 'today') {
        const today = new Date().toDateString();
        trips = trips.filter(t => new Date(t.created_at).toDateString() === today);
    } else if (filter === 'completed') {
        trips = trips.filter(t => t.status === 'completed');
    } else if (filter === 'cancelled') {
        trips = trips.filter(t => t.status === 'cancelled');
    }
    
    if (dateFilter) {
        const filterDate = new Date(dateFilter).toDateString();
        trips = trips.filter(t => new Date(t.created_at).toDateString() === filterDate);
    }
    
    tableBody.innerHTML = trips.map(trip => `
        <tr>
            <td>#${trip.id}</td>
            <td>${trip.user_name}</td>
            <td>${trip.driver_name || '---'}</td>
            <td>${trip.pickup}</td>
            <td>${trip.destination}</td>
            <td>${trip.ride_type === 'economy' ? 'اقتصادی' : trip.ride_type === 'comfort' ? 'کلاسیک' : 'موتور'}</td>
            <td>${trip.distance} کیلومتر</td>
            <td>${formatCurrency(trip.price)}</td>
            <td>
                <span class="status-badge status-${trip.status}">
                    ${trip.status === 'completed' ? 'تکمیل' : 
                      trip.status === 'cancelled' ? 'لغو' : 
                      trip.status === 'in_progress' ? 'در حال' : 'درخواست'}
                </span>
            </td>
            <td>${formatDateTime(trip.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-info" onclick="viewTripDetails('${trip.id}')">جزئیات</button>
                    ${trip.status !== 'completed' && trip.status !== 'cancelled' ? `
                    <button class="action-btn btn-danger" onclick="cancelTrip('${trip.id}')">لغو</button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function viewTripDetails(tripId) {
    try {
        const trip = Trip.findById(tripId);
        if (!trip) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content" style="width: 600px;">
                <div class="modal-header">
                    <h3>جزئیات سفر #${trip.id}</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="trip-details">
                        <div class="detail-section">
                            <h4>اطلاعات اصلی</h4>
                            <div class="detail-row">
                                <span class="detail-label">مسافر:</span>
                                <span class="detail-value">${trip.user_name}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">راننده:</span>
                                <span class="detail-value">${trip.driver_name || '---'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">مبدا:</span>
                                <span class="detail-value">${trip.pickup}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">مقصد:</span>
                                <span class="detail-value">${trip.destination}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>جزئیات سفر</h4>
                            <div class="detail-row">
                                <span class="detail-label">نوع سفر:</span>
                                <span class="detail-value">${trip.ride_type === 'economy' ? 'اقتصادی' : trip.ride_type === 'comfort' ? 'کلاسیک' : 'موتور'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">مسافت:</span>
                                <span class="detail-value">${trip.distance} کیلومتر</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">مبلغ:</span>
                                <span class="detail-value">${formatCurrency(trip.price)}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">روش پرداخت:</span>
                                <span class="detail-value">${trip.payment_method === 'cash' ? 'نقدی' : 'کیف پول'}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>وضعیت و زمان‌بندی</h4>
                            <div class="detail-row">
                                <span class="detail-label">وضعیت:</span>
                                <span class="detail-value status-badge status-${trip.status}">
                                    ${trip.status === 'completed' ? 'تکمیل شده' : 
                                      trip.status === 'cancelled' ? 'لغو شده' : 
                                      trip.status === 'in_progress' ? 'در حال انجام' : 'درخواست شده'}
                                </span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">زمان درخواست:</span>
                                <span class="detail-value">${formatDateTime(trip.created_at)}</span>
                            </div>
                            ${trip.started_at ? `
                            <div class="detail-row">
                                <span class="detail-label">زمان شروع:</span>
                                <span class="detail-value">${formatDateTime(trip.started_at)}</span>
                            </div>
                            ` : ''}
                            ${trip.completed_at ? `
                            <div class="detail-row">
                                <span class="detail-label">زمان پایان:</span>
                                <span class="detail-value">${formatDateTime(trip.completed_at)}</span>
                            </div>
                            ` : ''}
                        </div>
                        
                        ${trip.rated ? `
                        <div class="detail-section">
                            <h4>امتیازدهی</h4>
                            <div class="detail-row">
                                <span class="detail-label">امتیاز:</span>
                                <span class="detail-value">
                                    <div class="rating-stars">
                                        ${'★'.repeat(Math.floor(trip.rating || 0))}
                                        ${(trip.rating || 0) % 1 >= 0.5 ? '☆' : ''}
                                        <span class="rating-text">(${trip.rating || 0})</span>
                                    </div>
                                </span>
                            </div>
                            ${trip.rating_comment ? `
                            <div class="detail-row">
                                <span class="detail-label">نظر:</span>
                                <span class="detail-value">${trip.rating_comment}</span>
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}
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
    } catch (e) {
        console.error('Error viewing trip details:', e);
    }
}

function cancelTrip(tripId) {
    if (confirm('آیا از لغو این سفر مطمئن هستید؟')) {
        try {
            const trip = Trip.findById(tripId);
            if (trip) {
                trip.status = 'cancelled';
                trip.save();
                
                // اطلاع به کاربر
                if (trip.user_id) {
                    Notification.createForUser(
                        trip.user_id,
                        'سفر لغو شد',
                        `سفر شما از ${trip.pickup} به ${trip.destination} توسط مدیریت لغو شد.`,
                        'warning'
                    );
                }
                
                showNotification('سفر با موفقیت لغو شد', 'success');
                loadAdminTrips();
            }
        } catch (e) {
            console.error('Error cancelling trip:', e);
            showNotification('خطا در لغو سفر', 'error');
        }
    }
}

function loadAdminTickets() {
    const container = document.getElementById('ticketsTableContainer');
    if (!container) return;
    
    try {
        const tickets = SupportTicket.getAll();
        
        container.innerHTML = `
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>شماره تیکت</th>
                            <th>کاربر</th>
                            <th>موضوع</th>
                            <th>دسته‌بندی</th>
                            <th>اولویت</th>
                            <th>وضعیت</th>
                            <th>زمان ایجاد</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tickets.map(ticket => `
                            <tr>
                                <td>#${ticket.id}</td>
                                <td>${ticket.user_name}</td>
                                <td>${ticket.subject}</td>
                                <td>
                                    <span class="category-badge ${ticket.category}">
                                        ${ticket.category === 'technical' ? 'فنی' : 
                                          ticket.category === 'payment' ? 'پرداخت' : 
                                          ticket.category === 'driver' ? 'راننده' : 'عمومی'}
                                    </span>
                                </td>
                                <td>
                                    <span class="priority-badge ${ticket.priority}">
                                        ${ticket.priority === 'high' ? 'زیاد' : 
                                          ticket.priority === 'urgent' ? 'فوری' : 
                                          ticket.priority === 'low' ? 'کم' : 'متوسط'}
                                    </span>
                                </td>
                                <td>
                                    <span class="status-badge ${ticket.status === 'open' ? 'status-pending' : 'status-active'}">
                                        ${ticket.status === 'open' ? 'باز' : 'بسته'}
                                    </span>
                                </td>
                                <td>${formatDateTime(ticket.created_at)}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn btn-info" onclick="viewTicket('${ticket.id}')">مشاهده</button>
                                        ${ticket.status === 'open' ? `
                                        <button class="action-btn btn-approve" onclick="closeTicket('${ticket.id}')">بستن</button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) {
        console.error('Error loading admin tickets:', e);
        container.innerHTML = '<p class="error-message">خطا در بارگذاری تیکت‌ها</p>';
    }
}

function viewTicket(ticketId) {
    try {
        const ticket = SupportTicket.findById(ticketId);
        if (!ticket) return;
        
        const user = User.findById(ticket.user_id);
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content" style="width: 700px;">
                <div class="modal-header">
                    <h3>تیکت #${ticket.id} - ${ticket.subject}</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="ticket-details">
                        <div class="ticket-info">
                            <div class="info-row">
                                <span>کاربر:</span>
                                <strong>${ticket.user_name} (${ticket.user_role === 'driver' ? 'راننده' : 'مسافر'})</strong>
                            </div>
                            <div class="info-row">
                                <span>ایمیل:</span>
                                <span>${user?.email || '---'}</span>
                            </div>
                            <div class="info-row">
                                <span>اولویت:</span>
                                <span class="priority-badge ${ticket.priority}">${ticket.priority}</span>
                            </div>
                            <div class="info-row">
                                <span>وضعیت:</span>
                                <span class="status-badge ${ticket.status === 'open' ? 'status-pending' : 'status-active'}">
                                    ${ticket.status === 'open' ? 'باز' : 'بسته'}
                                </span>
                            </div>
                            <div class="info-row">
                                <span>زمان ایجاد:</span>
                                <span>${formatDateTime(ticket.created_at)}</span>
                            </div>
                        </div>
                        
                        <div class="ticket-message">
                            <h4>پیام کاربر:</h4>
                            <div class="message-content">
                                ${ticket.message}
                            </div>
                        </div>
                        
                        ${ticket.responses.length > 0 ? `
                        <div class="ticket-responses">
                            <h4>پاسخ‌ها:</h4>
                            ${ticket.responses.map(response => `
                                <div class="response-item">
                                    <div class="response-header">
                                        <strong>${response.responder || 'مدیریت'}</strong>
                                        <span>${formatDateTime(response.timestamp)}</span>
                                    </div>
                                    <div class="response-content">
                                        ${response.message}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        ` : ''}
                        
                        ${ticket.status === 'open' ? `
                        <div class="ticket-reply">
                            <h4>پاسخ دادن:</h4>
                            <textarea id="ticketReply" class="form-input" rows="4" placeholder="پاسخ خود را وارد کنید..."></textarea>
                            <button class="btn-primary" onclick="sendTicketResponse('${ticket.id}')" style="margin-top: 10px;">
                                ارسال پاسخ
                            </button>
                        </div>
                        ` : ''}
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
    } catch (e) {
        console.error('Error viewing ticket:', e);
    }
}

function sendTicketResponse(ticketId) {
    try {
        const ticket = SupportTicket.findById(ticketId);
        if (!ticket) return;
        
        const reply = document.getElementById('ticketReply');
        if (!reply || !reply.value.trim()) {
            showNotification('لطفاً متن پاسخ را وارد کنید', 'error');
            return;
        }
        
        ticket.addResponse({
            responder: currentUser ? currentUser.name : 'مدیریت',
            message: reply.value.trim()
        });
        
        // اطلاع به کاربر
        Notification.createForUser(
            ticket.user_id,
            'پاسخ به تیکت شما',
            `مدیریت به تیکت شما پاسخ داد. برای مشاهده پاسخ به بخش تیکت‌ها مراجعه کنید.`,
            'info'
        );
        
        showNotification('پاسخ با موفقیت ارسال شد', 'success');
        viewTicket(ticketId); // بازکردن مجدد با اطلاعات جدید
    } catch (e) {
        console.error('Error sending ticket response:', e);
        showNotification('خطا در ارسال پاسخ', 'error');
    }
}

function closeTicket(ticketId) {
    try {
        const ticket = SupportTicket.findById(ticketId);
        if (!ticket) return;
        
        ticket.close(currentUser ? currentUser.name : 'مدیریت');
        
        // اطلاع به کاربر
        Notification.createForUser(
            ticket.user_id,
            'تیکت شما بسته شد',
            `تیکت شماره #${ticket.id} توسط مدیریت بسته شد.`,
            'info'
        );
        
        showNotification('تیکت با موفقیت بسته شد', 'success');
        loadAdminTickets();
    } catch (e) {
        console.error('Error closing ticket:', e);
        showNotification('خطا در بستن تیکت', 'error');
    }
}

function loadAdminDiscounts() {
    const container = document.getElementById('discountsTableContainer');
    if (!container) return;
    
    try {
        const discounts = Discount.getAll();
        
        container.innerHTML = `
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>کد</th>
                            <th>درصد تخفیف</th>
                            <th>توضیحات</th>
                            <th>حداقل سفارش</th>
                            <th>تاریخ انقضا</th>
                            <th>استفاده شده</th>
                            <th>وضعیت</th>
                            <th>عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${discounts.map(discount => `
                            <tr>
                                <td><strong>${discount.code}</strong></td>
                                <td>${discount.percent}%</td>
                                <td>${discount.description}</td>
                                <td>${formatCurrency(discount.min_order)}</td>
                                <td>${formatDate(discount.expiry_date)}</td>
                                <td>${discount.used_count} از ${discount.max_uses}</td>
                                <td>
                                    <span class="status-badge ${discount.isValid() ? 'status-active' : 'status-inactive'}">
                                        ${discount.isValid() ? 'فعال' : 'منقضی'}
                                    </span>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="action-btn btn-danger" onclick="deleteDiscount('${discount.id}')">حذف</button>
                                        <button class="action-btn btn-info" onclick="editDiscount('${discount.id}')">ویرایش</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) {
        console.error('Error loading admin discounts:', e);
        container.innerHTML = '<p class="error-message">خطا در بارگذاری تخفیف‌ها</p>';
    }
}

function createNewDiscount() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h3>ایجاد کد تخفیف جدید</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="newDiscountForm">
                    <div class="form-group">
                        <label for="discountCode">کد تخفیف *</label>
                        <input type="text" id="discountCode" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="discountPercent">درصد تخفیف *</label>
                        <input type="number" id="discountPercent" class="form-input" min="1" max="100" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="discountDescription">توضیحات</label>
                        <textarea id="discountDescription" class="form-input" rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="discountMinOrder">حداقل مبلغ سفارش</label>
                        <input type="number" id="discountMinOrder" class="form-input" min="0" value="0">
                    </div>
                    
                    <div class="form-group">
                        <label for="discountMaxUses">تعداد قابل استفاده</label>
                        <input type="number" id="discountMaxUses" class="form-input" min="1" value="100">
                    </div>
                    
                    <div class="form-group">
                        <label for="discountExpiry">تاریخ انقضا</label>
                        <input type="date" id="discountExpiry" class="form-input" required value="${tomorrowStr}">
                    </div>
                    
                    <div class="form-group">
                        <label for="discountRideTypes">نوع سرویس‌ها</label>
                        <select id="discountRideTypes" class="form-input" multiple style="height: 100px;">
                            <option value="economy" selected>اقتصادی</option>
                            <option value="comfort" selected>کلاسیک</option>
                            <option value="bike" selected>موتور</option>
                        </select>
                        <small>برای انتخاب چندگانه Ctrl را نگه دارید</small>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="btn-primary" style="width: 100%;">
                            ایجاد تخفیف
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#newDiscountForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            const code = modal.querySelector('#discountCode').value.trim().toUpperCase();
            const percent = parseInt(modal.querySelector('#discountPercent').value);
            const description = modal.querySelector('#discountDescription').value.trim();
            const minOrder = parseInt(modal.querySelector('#discountMinOrder').value) || 0;
            const maxUses = parseInt(modal.querySelector('#discountMaxUses').value) || 100;
            const expiryDate = modal.querySelector('#discountExpiry').value;
            
            const rideTypesSelect = modal.querySelector('#discountRideTypes');
            const rideTypes = Array.from(rideTypesSelect.selectedOptions).map(option => option.value);
            
            // بررسی تکراری نبودن کد
            const existingDiscount = Discount.findByCode(code);
            if (existingDiscount) {
                showNotification('این کد تخفیف قبلاً ثبت شده است', 'error');
                return;
            }
            
            const discountData = {
                code,
                percent,
                description,
                min_order: minOrder,
                max_uses: maxUses,
                expiry_date: expiryDate,
                ride_types: rideTypes,
                active: true
            };
            
            const newDiscount = new Discount(discountData);
            newDiscount.save();
            
            showNotification('کد تخفیف با موفقیت ایجاد شد', 'success');
            modal.remove();
            loadAdminDiscounts();
        } catch (e) {
            console.error('Error creating discount:', e);
            showNotification('خطا در ایجاد تخفیف', 'error');
        }
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function deleteDiscount(discountId) {
    if (confirm('آیا از حذف این کد تخفیف مطمئن هستید؟')) {
        try {
            Discount.delete(discountId);
            showNotification('کد تخفیف با موفقیت حذف شد', 'success');
            loadAdminDiscounts();
        } catch (e) {
            console.error('Error deleting discount:', e);
            showNotification('خطا در حذف تخفیف', 'error');
        }
    }
}

// ===================== سیستم درخواست سفر =====================
function requestRide() {
    if (!currentUser) {
        showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
        openAuthModal();
        return;
    }
    
    const pickupInput = document.getElementById('pickup');
    const destinationInput = document.getElementById('destination');
    
    if (!pickupInput || !destinationInput) {
        showNotification('لطفاً مبدا و مقصد را انتخاب کنید', 'error');
        return;
    }
    
    const pickup = pickupInput.value.trim();
    const destination = destinationInput.value.trim();
    
    if (!pickup || !destination) {
        showNotification('لطفاً مبدا و مقصد را انتخاب کنید', 'error');
        return;
    }
    
    if (currentDistance === 0 || currentPrice === 0) {
        calculateDistanceAndPrice();
    }
    
    // بررسی موجودی کیف پول برای پرداخت با کیف پول
    if (selectedPaymentMethod === 'wallet' && currentUser.wallet_balance < currentPrice) {
        showNotification('موجودی کیف پول شما کافی نیست', 'error');
        openWalletModal();
        return;
    }
    
    // نمایش تأیید نهایی
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 450px;">
            <div class="modal-header">
                <h3>تأیید درخواست سفر</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="trip-summary">
                    <div class="summary-item">
                        <span class="summary-label">مبدا:</span>
                        <span class="summary-value">${pickup}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">مقصد:</span>
                        <span class="summary-value">${destination}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">نوع سفر:</span>
                        <span class="summary-value">${selectedRideType === 'economy' ? 'اقتصادی' : selectedRideType === 'comfort' ? 'کلاسیک' : 'موتور'}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">مسافت:</span>
                        <span class="summary-value">${currentDistance} کیلومتر</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">هزینه:</span>
                        <span class="summary-value">${formatCurrency(currentPrice)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">روش پرداخت:</span>
                        <span class="summary-value">${selectedPaymentMethod === 'cash' ? 'نقدی' : 'کیف پول'}</span>
                    </div>
                </div>
                
                <div class="form-group" style="margin-top: 20px;">
                    <label for="tripNotes">یادداشت برای راننده (اختیاری)</label>
                    <textarea id="tripNotes" class="form-input" rows="2" placeholder="مثال: لطفا قبل از رسیدن بوق بزنید"></textarea>
                </div>
                
                <div class="form-group" style="margin-top: 15px;">
                    <button id="confirmRide" class="btn-primary" style="width: 100%;">
                        <i class="fas fa-car"></i> درخواست سفر
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('confirmRide').addEventListener('click', () => {
        createRideRequest(pickup, destination);
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function createRideRequest(pickup, destination) {
    try {
        const tripId = generateRandomId();
        
        const tripData = {
            id: tripId,
            pickup,
            destination,
            pickup_coords: selectedPickupCoords || kabulData.locations.find(loc => loc.name === pickup)?.coordinates,
            destination_coords: selectedDestinationCoords || kabulData.locations.find(loc => loc.name === destination)?.coordinates,
            ride_type: selectedRideType,
            distance: currentDistance,
            price: currentPrice,
            status: 'requested',
            user_id: currentUser.id,
            user_name: currentUser.name,
            payment_method: selectedPaymentMethod,
            notes: document.getElementById('tripNotes')?.value.trim() || ''
        };
        
        const newTrip = new Trip(tripData);
        newTrip.save();
        currentTripId = tripId;
        
        // اطلاع به رانندگان
        const drivers = User.getDrivers().filter(driver => driver.online_status === 'online');
        drivers.forEach(driver => {
            Notification.createForUser(
                driver.id,
                'درخواست سفر جدید',
                `درخواست سفر از ${pickup} به ${destination} با مبلغ ${formatCurrency(currentPrice)}`,
                'info'
            );
        });
        
        // نمایش وضعیت سفر
        showRideStatus();
        showNotification('درخواست سفر شما ثبت شد. در حال یافتن راننده...', 'success');
        
        // شبیه‌سازی یافتن راننده
        setTimeout(() => {
            assignDriverToTrip(tripId);
        }, 3000);
    } catch (e) {
        console.error('Error creating ride request:', e);
        showNotification('خطا در ثبت درخواست سفر', 'error');
    }
}

function assignDriverToTrip(tripId) {
    try {
        const trip = Trip.findById(tripId);
        if (!trip || trip.status !== 'requested') return;
        
        const availableDrivers = User.getDrivers().filter(driver => 
            driver.online_status === 'online' && 
            driver.vehicle_type === (trip.ride_type === 'bike' ? 'bike' : 'car')
        );
        
        if (availableDrivers.length === 0) {
            showNotification('راننده‌ای در دسترس نیست. لطفاً دوباره تلاش کنید.', 'error');
            trip.status = 'cancelled';
            trip.save();
            return;
        }
        
        // انتخاب راننده تصادفی
        const randomDriver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
        currentDriver = randomDriver;
        
        trip.driver_id = randomDriver.id;
        trip.driver_name = randomDriver.name;
        trip.status = 'confirmed';
        trip.save();
        
        // به‌روزرسانی راننده
        randomDriver.total_trips = (randomDriver.total_trips || 0) + 1;
        randomDriver.save();
        
        // نمایش اطلاعات راننده
        updateRideStatus();
        showNotification(`راننده ${randomDriver.name} سفر شما را پذیرفت`, 'success');
        
        // شروع شبیه‌سازی حرکت
        simulateRideProgress(tripId);
    } catch (e) {
        console.error('Error assigning driver:', e);
        showNotification('خطا در یافتن راننده', 'error');
    }
}

function simulateRideProgress(tripId) {
    const trip = Trip.findById(tripId);
    if (!trip) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        try {
            progress += 10;
            
            const progressBar = document.getElementById('rideProgress');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
                progressBar.textContent = `${progress}%`;
            }
            
            const statusText = document.getElementById('rideStatusText');
            if (statusText) {
                if (progress < 30) {
                    statusText.textContent = 'راننده در راه مبدا...';
                } else if (progress < 70) {
                    statusText.textContent = 'در حال رسیدن به مبدا...';
                    trip.status = 'in_progress';
                    trip.started_at = new Date().toISOString();
                    trip.save();
                } else if (progress < 90) {
                    statusText.textContent = 'در مسیر مقصد...';
                } else {
                    statusText.textContent = 'نزدیک مقصد...';
                }
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                completeRide(tripId);
            }
        } catch (e) {
            console.error('Error in ride simulation:', e);
            clearInterval(interval);
        }
    }, 2000);
}

function completeRide(tripId) {
    try {
        const trip = Trip.findById(tripId);
        if (!trip) return;
        
        trip.status = 'completed';
        trip.completed_at = new Date().toISOString();
        trip.save();
        
        // پرداخت
        if (trip.payment_method === 'wallet') {
            currentUser.wallet_balance -= trip.price;
            currentUser.save();
            
            Transaction.createTripPayment(currentUser.id, trip.price, tripId);
            
            // افزایش درآمد راننده
            const driver = User.findById(trip.driver_id);
            if (driver) {
                driver.earning = (driver.earning || 0) + trip.price;
                driver.save();
            }
        }
        
        // نمایش صفحه اتمام سفر
        showRideComplete();
        showNotification('سفر با موفقیت به پایان رسید. لطفاً به راننده امتیاز دهید.', 'success');
    } catch (e) {
        console.error('Error completing ride:', e);
    }
}

function showRideStatus() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const rideStatusPage = document.getElementById('ride-status-page');
    if (!rideStatusPage) return;
    
    rideStatusPage.classList.add('active');
    rideStatusPage.innerHTML = `
        <div class="ride-status-container">
            <div class="ride-status-header">
                <h2><i class="fas fa-car"></i> وضعیت سفر</h2>
                <button class="btn-secondary" onclick="cancelCurrentRide()">
                    <i class="fas fa-times"></i> لغو سفر
                </button>
            </div>
            
            <div class="ride-status-content">
                <div class="ride-progress">
                    <div class="progress-bar">
                        <div id="rideProgress" class="progress-fill" style="width: 0%">0%</div>
                    </div>
                    <div class="progress-text">
                        <span id="rideStatusText">در حال یافتن راننده...</span>
                    </div>
                </div>
                
                <div id="driverInfo" class="driver-info" style="display: none;">
                    <div class="driver-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="driver-details">
                        <h3 id="driverName">---</h3>
                        <div class="driver-rating">
                            <span id="driverRating">---</span>
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="driver-vehicle">
                            <span id="driverCarModel">---</span>
                            <span id="driverPlateNumber">---</span>
                        </div>
                        <div class="driver-distance">
                            <i class="fas fa-clock"></i>
                            <span id="driverEta">۵ دقیقه تا مبدا</span>
                        </div>
                    </div>
                </div>
                
                <div class="trip-details-card">
                    <div class="trip-detail">
                        <i class="fas fa-map-marker-alt pickup-icon"></i>
                        <div>
                            <small>مبدا</small>
                            <p id="currentPickup">---</p>
                        </div>
                    </div>
                    <div class="trip-detail">
                        <i class="fas fa-flag-checkered destination-icon"></i>
                        <div>
                            <small>مقصد</small>
                            <p id="currentDestination">---</p>
                        </div>
                    </div>
                    <div class="trip-detail">
                        <i class="fas fa-road"></i>
                        <div>
                            <small>مسافت</small>
                            <p id="currentDistance">--- کیلومتر</p>
                        </div>
                    </div>
                    <div class="trip-detail">
                        <i class="fas fa-money-bill-wave"></i>
                        <div>
                            <small>هزینه</small>
                            <p id="currentPrice">---</p>
                        </div>
                    </div>
                </div>
                
                <div class="ride-actions">
                    <button class="btn-primary" onclick="contactDriver()">
                        <i class="fas fa-phone"></i> تماس با راننده
                    </button>
                    <button class="btn-secondary" onclick="shareRide()">
                        <i class="fas fa-share-alt"></i> اشتراک گذاری
                    </button>
                </div>
            </div>
        </div>
    `;
    
    updateRideStatus();
}

function updateRideStatus() {
    const trip = Trip.findById(currentTripId);
    if (!trip) return;
    
    const driverInfo = document.getElementById('driverInfo');
    const driverName = document.getElementById('driverName');
    const driverRating = document.getElementById('driverRating');
    const driverCarModel = document.getElementById('driverCarModel');
    const driverPlateNumber = document.getElementById('driverPlateNumber');
    const currentPickup = document.getElementById('currentPickup');
    const currentDestination = document.getElementById('currentDestination');
    const currentDistance = document.getElementById('currentDistance');
    const currentPrice = document.getElementById('currentPrice');
    
    if (trip.driver_id && currentDriver) {
        if (driverInfo) driverInfo.style.display = 'flex';
        if (driverName) driverName.textContent = currentDriver.name;
        if (driverRating) driverRating.textContent = currentDriver.rating || '۴.۵';
        if (driverCarModel) driverCarModel.textContent = currentDriver.car_model || '---';
        if (driverPlateNumber) driverPlateNumber.textContent = currentDriver.plate_number || '---';
    }
    
    if (currentPickup) currentPickup.textContent = trip.pickup;
    if (currentDestination) currentDestination.textContent = trip.destination;
    if (currentDistance) currentDistance.textContent = `${trip.distance} کیلومتر`;
    if (currentPrice) currentPrice.textContent = formatCurrency(trip.price);
}

function showRideComplete() {
    const rideStatusPage = document.getElementById('ride-status-page');
    if (!rideStatusPage) return;
    
    rideStatusPage.innerHTML = `
        <div class="ride-complete-container">
            <div class="ride-complete-header">
                <div class="complete-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>سفر با موفقیت تکمیل شد</h2>
                <p>از همراهی شما متشکریم</p>
            </div>
            
            <div class="trip-summary-card">
                <div class="summary-item">
                    <span>راننده:</span>
                    <strong>${currentDriver?.name || '---'}</strong>
                </div>
                <div class="summary-item">
                    <span>مبلغ پرداختی:</span>
                    <strong>${formatCurrency(currentPrice)}</strong>
                </div>
                <div class="summary-item">
                    <span>روش پرداخت:</span>
                    <strong>${selectedPaymentMethod === 'cash' ? 'نقدی' : 'کیف پول'}</strong>
                </div>
                <div class="summary-item">
                    <span>مسافت طی شده:</span>
                    <strong>${currentDistance} کیلومتر</strong>
                </div>
                <div class="summary-item">
                    <span>زمان سفر:</span>
                    <strong>${Math.floor(currentDistance * 3)} دقیقه</strong>
                </div>
            </div>
            
            <div class="rating-section">
                <h3>امتیاز به راننده</h3>
                <div class="rating-stars">
                    <i class="far fa-star" data-rating="1"></i>
                    <i class="far fa-star" data-rating="2"></i>
                    <i class="far fa-star" data-rating="3"></i>
                    <i class="far fa-star" data-rating="4"></i>
                    <i class="far fa-star" data-rating="5"></i>
                </div>
                <textarea id="ratingComment" class="form-input" placeholder="نظر شما درباره سفر (اختیاری)" rows="3"></textarea>
                <button class="btn-primary" onclick="submitRating()">
                    ثبت امتیاز و تکمیل
                </button>
            </div>
            
            <div class="complete-actions">
                <button class="btn-secondary" onclick="goHome()">
                    <i class="fas fa-home"></i> بازگشت به خانه
                </button>
                <button class="btn-primary" onclick="requestAnotherRide()">
                    <i class="fas fa-car"></i> درخواست سفر جدید
                </button>
            </div>
        </div>
    `;
    
    // مدیریت ستاره‌های امتیازدهی
    const stars = rideStatusPage.querySelectorAll('.rating-stars i');
    let selectedRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            selectedRating = rating;
            
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
        
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
        
        star.addEventListener('mouseout', function() {
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.className = 'fas fa-star';
                } else {
                    s.className = 'far fa-star';
                }
            });
        });
    });
}

function submitRating() {
    try {
        const stars = document.querySelectorAll('.rating-stars i');
        let rating = 0;
        stars.forEach((star, index) => {
            if (star.className === 'fas fa-star') {
                rating = index + 1;
            }
        });
        
        if (rating === 0) {
            showNotification('لطفاً به راننده امتیاز دهید', 'error');
            return;
        }
        
        const trip = Trip.findById(currentTripId);
        if (trip) {
            trip.rated = true;
            trip.rating = rating;
            trip.rating_comment = document.getElementById('ratingComment')?.value.trim() || '';
            trip.save();
            
            // به‌روزرسانی امتیاز راننده
            if (currentDriver) {
                currentDriver.updateRating(rating);
            }
        }
        
        showNotification('امتیاز شما با موفقیت ثبت شد. متشکریم!', 'success');
        goHome();
    } catch (e) {
        console.error('Error submitting rating:', e);
        showNotification('خطا در ثبت امتیاز', 'error');
    }
}

function cancelCurrentRide() {
    if (confirm('آیا از لغو این سفر مطمئن هستید؟')) {
        try {
            const trip = Trip.findById(currentTripId);
            if (trip) {
                trip.status = 'cancelled';
                trip.save();
            }
            
            showNotification('سفر لغو شد', 'info');
            goHome();
        } catch (e) {
            console.error('Error cancelling ride:', e);
            showNotification('خطا در لغو سفر', 'error');
        }
    }
}

function contactDriver() {
    if (currentDriver) {
        alert(`شماره تماس راننده: ${currentDriver.phone}`);
    } else {
        showNotification('راننده‌ای انتخاب نشده است', 'error');
    }
}

function shareRide() {
    try {
        const trip = Trip.findById(currentTripId);
        if (trip) {
            const shareText = `سفر من از ${trip.pickup} به ${trip.destination} در اسنپ. کد پیگیری: #${trip.id}`;
            if (navigator.share) {
                navigator.share({
                    title: 'سفر اسنپ',
                    text: shareText
                });
            } else {
                navigator.clipboard.writeText(shareText);
                showNotification('متن سفر در کلیپ‌بورد کپی شد', 'success');
            }
        }
    } catch (e) {
        console.error('Error sharing ride:', e);
        showNotification('خطا در اشتراک‌گذاری', 'error');
    }
}

function goHome() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const homePage = document.getElementById('home-page');
    if (homePage) homePage.classList.add('active');
    currentTripId = null;
    currentDriver = null;
}

function requestAnotherRide() {
    goHome();
    setTimeout(() => {
        document.getElementById('pickup')?.focus();
    }, 100);
}

// ===================== سیستم کیف پول =====================
function openWalletModal() {
    if (!currentUser) {
        showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
        openAuthModal();
        return;
    }
    
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h3>کیف پول</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="wallet-balance">
                    <div class="balance-header">
                        <i class="fas fa-wallet"></i>
                        <div>
                            <small>موجودی کیف پول</small>
                            <h2>${formatCurrency(currentUser.wallet_balance)}</h2>
                        </div>
                    </div>
                </div>
                
                <div class="wallet-actions">
                    <h4>شارژ کیف پول</h4>
                    <div class="charge-amounts">
                        <button class="amount-btn" data-amount="10000">۱۰,۰۰۰</button>
                        <button class="amount-btn" data-amount="20000">۲۰,۰۰۰</button>
                        <button class="amount-btn" data-amount="50000">۵۰,۰۰۰</button>
                        <button class="amount-btn" data-amount="100000">۱۰۰,۰۰۰</button>
                    </div>
                    
                    <div class="form-group">
                        <label for="customAmount">مبلغ دلخواه</label>
                        <input type="number" id="customAmount" class="form-input" placeholder="مبلغ به افغانی">
                    </div>
                    
                    <div class="form-group">
                        <button class="btn-primary" onclick="chargeWallet()" style="width: 100%;">
                            <i class="fas fa-bolt"></i> شارژ کیف پول
                        </button>
                    </div>
                </div>
                
                <div class="wallet-history">
                    <h4>تاریخچه تراکنش‌ها</h4>
                    <div id="transactionHistory" class="transaction-list">
                        <!-- تاریخچه تراکنش‌ها -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // مدیریت دکمه‌های مبلغ
    modal.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            const customAmountInput = modal.querySelector('#customAmount');
            if (customAmountInput) {
                customAmountInput.value = amount;
            }
        });
    });
    
    // بارگذاری تاریخچه تراکنش‌ها
    loadTransactionHistory(modal.querySelector('#transactionHistory'));
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function chargeWallet() {
    const modal = document.querySelector('.modal');
    if (!modal) return;
    
    const customAmountInput = modal.querySelector('#customAmount');
    if (!customAmountInput) return;
    
    const amount = parseInt(customAmountInput.value);
    
    if (!amount || amount < 1000) {
        showNotification('حداقل مبلغ شارژ ۱,۰۰۰ افغانی است', 'error');
        return;
    }
    
    // در حالت واقعی اینجا باید به درگاه پرداخت وصل شویم
    // اما در این نسخه نمایشی فقط شبیه‌سازی می‌کنیم
    
    const confirmModal = document.createElement('div');
    confirmModal.className = 'modal';
    confirmModal.style.display = 'flex';
    
    confirmModal.innerHTML = `
        <div class="modal-content" style="width: 400px;">
            <div class="modal-header">
                <h3>تأیید پرداخت</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="payment-details">
                    <p>مبلغ: <strong>${formatCurrency(amount)}</strong></p>
                    <p>درگاه پرداخت: <strong>اسنپ پی</strong></p>
                </div>
                
                <div class="payment-actions">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">انصراف</button>
                    <button class="btn-primary" onclick="processWalletCharge(${amount})">پرداخت</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmModal);
    
    confirmModal.querySelector('.close-modal').addEventListener('click', () => {
        confirmModal.remove();
    });
    
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            confirmModal.remove();
        }
    });
}

function processWalletCharge(amount) {
    try {
        // در حالت واقعی اینجا باید با سرور ارتباط برقرار شود
        // اما در این نسخه نمایشی مستقیماً به کیف پول اضافه می‌کنیم
        
        currentUser.wallet_balance += amount;
        currentUser.save();
        
        // ایجاد تراکنش
        Transaction.createWalletCharge(currentUser.id, amount, 'snapp_pay');
        
        showNotification(`کیف پول شما به مبلغ ${formatCurrency(amount)} شارژ شد`, 'success');
        
        // بستن مدال‌ها
        document.querySelectorAll('.modal').forEach(modal => modal.remove());
        
        // به‌روزرسانی UI
        if (currentUser) {
            updateProfilePage();
        }
    } catch (e) {
        console.error('Error processing wallet charge:', e);
        showNotification('خطا در شارژ کیف پول', 'error');
    }
}

function loadTransactionHistory(container) {
    if (!container || !currentUser) return;
    
    try {
        const transactions = Transaction.findByUserId(currentUser.id);
        
        if (transactions.length === 0) {
            container.innerHTML = '<p class="empty-state">تراکنشی یافت نشد</p>';
            return;
        }
        
        container.innerHTML = transactions.map(transaction => `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-icon">
                    <i class="fas fa-${transaction.type === 'charge' ? 'arrow-down' : 'arrow-up'}"></i>
                </div>
                <div class="transaction-details">
                    <div class="transaction-header">
                        <span class="transaction-title">${transaction.description}</span>
                        <span class="transaction-amount ${transaction.type === 'charge' ? 'positive' : 'negative'}">
                            ${transaction.type === 'charge' ? '+' : ''}${formatCurrency(transaction.amount)}
                        </span>
                    </div>
                    <div class="transaction-footer">
                        <span class="transaction-method">${transaction.payment_method || '---'}</span>
                        <span class="transaction-date">${formatDateTime(transaction.created_at)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Error loading transaction history:', e);
        container.innerHTML = '<p class="error-message">خطا در بارگذاری تاریخچه</p>';
    }
}

// ===================== سیستم پروفایل کاربری =====================
function openProfilePage() {
    if (!currentUser) {
        showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
        openAuthModal();
        return;
    }
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const profilePage = document.getElementById('profile-page');
    if (profilePage) {
        profilePage.classList.add('active');
        updateProfilePage();
    }
}

function updateProfilePage() {
    if (!currentUser) return;
    
    const profilePage = document.getElementById('profile-page');
    if (!profilePage) return;
    
    try {
        const rewardSystem = new RewardSystem();
        const userLevel = rewardSystem.getUserLevel(currentUser.id);
        const earnedBadges = rewardSystem.getEarnedBadges(currentUser.id);
        
        profilePage.innerHTML = `
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-avatar">
                        <div class="avatar-circle">
                            ${currentUser.name ? currentUser.name.charAt(0) : 'U'}
                        </div>
                    </div>
                    <div class="profile-info">
                        <h2>${currentUser.name}</h2>
                        <p>${currentUser.email}</p>
                        <div class="profile-meta">
                            <span><i class="fas fa-phone"></i> ${currentUser.phone}</span>
                            <span><i class="fas fa-user-tag"></i> ${currentUser.role === 'driver' ? 'راننده' : 'مسافر'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="profile-stats">
                    <div class="stat-card">
                        <i class="fas fa-road"></i>
                        <div>
                            <h3>${Trip.findByUserId(currentUser.id).filter(t => t.status === 'completed').length}</h3>
                            <p>سفرهای تکمیل شده</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-star"></i>
                        <div>
                            <h3>${currentUser.rating || 0}</h3>
                            <p>امتیاز شما</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-wallet"></i>
                        <div>
                            <h3>${formatCurrency(currentUser.wallet_balance)}</h3>
                            <p>موجودی</p>
                        </div>
                    </div>
                    ${currentUser.role === 'driver' ? `
                    <div class="stat-card">
                        <i class="fas fa-money-bill-wave"></i>
                        <div>
                            <h3>${formatCurrency(currentUser.earning || 0)}</h3>
                            <p>درآمد کل</p>
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="profile-level">
                    <div class="level-header">
                        <h3>سطح ${userLevel}: ${rewardSystem.levels[userLevel]?.name || 'کاربر'}</h3>
                        <div class="level-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${(userLevel / 5) * 100}%"></div>
                            </div>
                            <span>${userLevel}/5</span>
                        </div>
                    </div>
                    <p>تخفیف سطح فعلی: ${rewardSystem.levels[userLevel]?.discount || 0}%</p>
                </div>
                
                ${earnedBadges.length > 0 ? `
                <div class="profile-badges">
                    <h3>نشان‌های شما</h3>
                    <div class="badges-grid">
                        ${earnedBadges.map(badge => `
                            <div class="badge-item">
                                <div class="badge-icon">${badge.icon}</div>
                                <div class="badge-info">
                                    <strong>${badge.name}</strong>
                                    <small>${badge.description}</small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="profile-sections">
                    <div class="profile-section">
                        <h3><i class="fas fa-cog"></i> تنظیمات</h3>
                        <div class="settings-list">
                            <button class="settings-item" onclick="openEditProfile()">
                                <i class="fas fa-user-edit"></i>
                                <span>ویرایش پروفایل</span>
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="settings-item" onclick="openNotificationSettings()">
                                <i class="fas fa-bell"></i>
                                <span>تنظیمات نوتیفیکیشن</span>
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="settings-item" onclick="openWalletModal()">
                                <i class="fas fa-wallet"></i>
                                <span>کیف پول</span>
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            ${currentUser.role === 'driver' ? `
                            <button class="settings-item" onclick="openDriverDashboard()">
                                <i class="fas fa-tachometer-alt"></i>
                                <span>داشبورد راننده</span>
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h3><i class="fas fa-history"></i> سفرهای اخیر</h3>
                        <div id="recentTripsList" class="trips-list">
                            <!-- سفرهای اخیر -->
                        </div>
                    </div>
                    
                    <div class="profile-section">
                        <h3><i class="fas fa-map-marker-alt"></i> مکان‌های ذخیره شده</h3>
                        <div id="savedLocationsList" class="locations-list">
                            <!-- مکان‌های ذخیره شده -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // بارگذاری سفرهای اخیر
        loadRecentTrips(profilePage.querySelector('#recentTripsList'));
        
        // بارگذاری مکان‌های ذخیره شده
        loadSavedLocations();
    } catch (e) {
        console.error('Error updating profile page:', e);
        profilePage.innerHTML = '<p class="error-message">خطا در بارگذاری پروفایل</p>';
    }
}

function loadRecentTrips(container) {
    if (!container || !currentUser) return;
    
    try {
        const trips = Trip.findByUserId(currentUser.id);
        
        if (trips.length === 0) {
            container.innerHTML = '<p class="empty-state">هنوز سفری ثبت نکرده‌اید</p>';
            return;
        }
        
        const recentTrips = trips.slice(0, 5);
        
        container.innerHTML = recentTrips.map(trip => `
            <div class="trip-item">
                <div class="trip-header">
                    <span class="trip-date">${formatDate(trip.created_at)}</span>
                    <span class="trip-status status-${trip.status}">
                        ${trip.status === 'completed' ? 'تکمیل' : 
                          trip.status === 'cancelled' ? 'لغو' : 
                          trip.status === 'in_progress' ? 'در حال' : 'درخواست'}
                    </span>
                </div>
                <div class="trip-details">
                    <div class="trip-route">
                        <div class="route-point">
                            <i class="fas fa-circle pickup-dot"></i>
                            <span>${trip.pickup}</span>
                        </div>
                        <div class="route-point">
                            <i class="fas fa-flag-checkered destination-dot"></i>
                            <span>${trip.destination}</span>
                        </div>
                    </div>
                    <div class="trip-footer">
                        <span>${trip.distance} کیلومتر</span>
                        <span class="trip-price">${formatCurrency(trip.price)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Error loading recent trips:', e);
        container.innerHTML = '<p class="error-message">خطا در بارگذاری سفرها</p>';
    }
}

function loadSavedLocations() {
    if (!currentUser) return;
    
    const locationsList = document.getElementById('savedLocationsList');
    if (!locationsList) return;
    
    try {
        savedLocations = SavedLocation.findByUserId(currentUser.id);
        
        if (savedLocations.length === 0) {
            locationsList.innerHTML = '<p class="empty-state">مکانی ذخیره نکرده‌اید</p>';
            return;
        }
        
        locationsList.innerHTML = savedLocations.map(location => `
            <div class="location-item">
                <div class="location-icon">
                    <i class="fas fa-${location.icon || 'map-marker-alt'}"></i>
                </div>
                <div class="location-details">
                    <strong>${location.name}</strong>
                    <small>${location.address}</small>
                </div>
                <div class="location-actions">
                    <button class="btn-icon" onclick="useSavedLocation('${location.id}', 'pickup')" title="استفاده به عنوان مبدا">
                        <i class="fas fa-play-circle"></i>
                    </button>
                    <button class="btn-icon" onclick="useSavedLocation('${location.id}', 'destination')" title="استفاده به عنوان مقصد">
                        <i class="fas fa-flag-checkered"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteSavedLocation('${location.id}')" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Error loading saved locations:', e);
        locationsList.innerHTML = '<p class="error-message">خطا در بارگذاری مکان‌ها</p>';
    }
}

function useSavedLocation(locationId, type) {
    try {
        const location = savedLocations.find(loc => loc.id == locationId);
        if (!location) return;
        
        if (type === 'pickup') {
            setPickupLocation(location.name, location.coordinates);
        } else {
            setDestinationLocation(location.name, location.coordinates);
        }
        
        showNotification(`مکان "${location.name}" به عنوان ${type === 'pickup' ? 'مبدا' : 'مقصد'} تنظیم شد`, 'success');
    } catch (e) {
        console.error('Error using saved location:', e);
    }
}

function deleteSavedLocation(locationId) {
    if (confirm('آیا از حذف این مکان مطمئن هستید؟')) {
        try {
            SavedLocation.delete(locationId);
            showNotification('مکان با موفقیت حذف شد', 'success');
            loadSavedLocations();
        } catch (e) {
            console.error('Error deleting saved location:', e);
            showNotification('خطا در حذف مکان', 'error');
        }
    }
}

function openEditProfile() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h3>ویرایش پروفایل</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="editProfileForm">
                    <div class="form-group">
                        <label for="editName">نام کامل</label>
                        <input type="text" id="editName" class="form-input" value="${currentUser.name || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editEmail">ایمیل</label>
                        <input type="email" id="editEmail" class="form-input" value="${currentUser.email || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editPhone">شماره تماس</label>
                        <input type="tel" id="editPhone" class="form-input" value="${currentUser.phone || ''}" required>
                    </div>
                    
                    ${currentUser.role === 'driver' ? `
                    <div class="form-section">
                        <h4>اطلاعات رانندگی</h4>
                        <div class="form-group">
                            <label for="editCarModel">مدل ماشین</label>
                            <input type="text" id="editCarModel" class="form-input" value="${currentUser.car_model || ''}">
                        </div>
                        
                        <div class="form-group">
                            <label for="editPlateNumber">شماره پلاک</label>
                            <input type="text" id="editPlateNumber" class="form-input" value="${currentUser.plate_number || ''}">
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="form-group">
                        <label for="editWhatsapp">شماره واتساپ (اختیاری)</label>
                        <input type="tel" id="editWhatsapp" class="form-input" value="${currentUser.whatsapp_number || ''}">
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="btn-primary" style="width: 100%;">
                            ذخیره تغییرات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#editProfileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            const name = modal.querySelector('#editName').value.trim();
            const email = modal.querySelector('#editEmail').value.trim();
            const phone = modal.querySelector('#editPhone').value.trim();
            const whatsapp = modal.querySelector('#editWhatsapp')?.value.trim() || '';
            
            // بررسی تغییر ایمیل
            if (email !== currentUser.email) {
                const existingUser = User.findByEmailOrPhone(email);
                if (existingUser && existingUser.id !== currentUser.id) {
                    showNotification('این ایمیل قبلاً ثبت شده است', 'error');
                    return;
                }
            }
            
            // بررسی تغییر شماره
            if (phone !== currentUser.phone) {
                const existingPhone = User.findByEmailOrPhone(phone);
                if (existingPhone && existingPhone.id !== currentUser.id) {
                    showNotification('این شماره تماس قبلاً ثبت شده است', 'error');
                    return;
                }
            }
            
            currentUser.name = name;
            currentUser.email = email;
            currentUser.phone = phone;
            currentUser.whatsapp_number = whatsapp;
            
            if (currentUser.role === 'driver') {
                currentUser.car_model = modal.querySelector('#editCarModel')?.value.trim() || '';
                currentUser.plate_number = modal.querySelector('#editPlateNumber')?.value.trim() || '';
            }
            
            currentUser.save();
            localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
            
            showNotification('پروفایل با موفقیت به‌روزرسانی شد', 'success');
            modal.remove();
            updateProfilePage();
        } catch (e) {
            console.error('Error editing profile:', e);
            showNotification('خطا در ویرایش پروفایل', 'error');
        }
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function openNotificationSettings() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    const settings = currentUser.notification_settings || {
        trip_updates: true,
        promotions: true,
        news: true,
        sound: true
    };
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h3>تنظیمات نوتیفیکیشن</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="notificationSettingsForm">
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>به‌روزرسانی‌های سفر</h4>
                            <p>اطلاع رسانی درباره وضعیت سفرهای شما</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="tripUpdates" ${settings.trip_updates ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>تخفیف‌ها و پیشنهادات</h4>
                            <p>اطلاع رسانی درباره تخفیف‌های ویژه</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="promotions" ${settings.promotions ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>اخبار و اعلانات</h4>
                            <p>اطلاع رسانی درباره اخبار و به‌روزرسانی‌های اسنپ</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="news" ${settings.news ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>صدا و ویبره</h4>
                            <p>پخش صدا و ویبره هنگام دریافت نوتیفیکیشن</p>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="sound" ${settings.sound ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                    
                    <div class="form-group" style="margin-top: 30px;">
                        <button type="submit" class="btn-primary" style="width: 100%;">
                            ذخیره تنظیمات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#notificationSettingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            currentUser.notification_settings = {
                trip_updates: modal.querySelector('#tripUpdates').checked,
                promotions: modal.querySelector('#promotions').checked,
                news: modal.querySelector('#news').checked,
                sound: modal.querySelector('#sound').checked
            };
            
            currentUser.save();
            localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
            
            showNotification('تنظیمات نوتیفیکیشن ذخیره شد', 'success');
            modal.remove();
        } catch (e) {
            console.error('Error saving notification settings:', e);
            showNotification('خطا در ذخیره تنظیمات', 'error');
        }
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===================== داشبورد راننده =====================
function openDriverDashboard() {
    if (!currentUser || currentUser.role !== 'driver') {
        showNotification('این بخش فقط برای رانندگان است', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'driverDashboardModal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>داشبورد راننده</h3>
                <span class="close-modal">&times;</span>
            </div>
            
            <div class="driver-dashboard">
                <div class="driver-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-road"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${currentUser.total_trips || 0}</h3>
                            <p>سفرهای امروز</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${currentUser.rating || '۴.۵'}</h3>
                            <p>امتیاز شما</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${formatCurrency(currentUser.earning || 0)}</h3>
                            <p>درآمد امروز</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-bullseye"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${currentUser.total_trips || 0}/${currentUser.daily_target || 5}</h3>
                            <p>هدف روزانه</p>
                        </div>
                    </div>
                </div>
                
                <div class="driver-controls">
                    <div class="online-status">
                        <h4>وضعیت آنلاین</h4>
                        <div class="status-toggle">
                            <label class="switch large">
                                <input type="checkbox" id="driverOnlineToggle" ${currentUser.online_status === 'online' ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                            <span class="status-text">${currentUser.online_status === 'online' ? 'آنلاین' : 'آفلاین'}</span>
                        </div>
                    </div>
                    
                    <div class="working-hours">
                        <h4>ساعات کاری</h4>
                        <div class="hours-display">
                            <span>${currentUser.working_hours?.start || '08:00'} - ${currentUser.working_hours?.end || '22:00'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="driver-trips">
                    <h3>درخواست‌های سفر</h3>
                    <div id="driverTripRequests" class="trip-requests">
                        <!-- درخواست‌های سفر -->
                    </div>
                </div>
                
                <div class="driver-history">
                    <h3>سفرهای اخیر</h3>
                    <div id="driverRecentTrips" class="trips-list">
                        <!-- سفرهای اخیر راننده -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // مدیریت وضعیت آنلاین
    const onlineToggle = modal.querySelector('#driverOnlineToggle');
    onlineToggle.addEventListener('change', function() {
        try {
            currentUser.online_status = this.checked ? 'online' : 'offline';
            currentUser.save();
            
            const statusText = modal.querySelector('.status-text');
            if (statusText) {
                statusText.textContent = this.checked ? 'آنلاین' : 'آفلاین';
            }
            
            showNotification(`وضعیت شما ${this.checked ? 'آنلاین' : 'آفلاین'} شد`, 'success');
            loadDriverTripRequests(modal.querySelector('#driverTripRequests'));
        } catch (e) {
            console.error('Error updating online status:', e);
        }
    });
    
    // بارگذاری درخواست‌های سفر
    loadDriverTripRequests(modal.querySelector('#driverTripRequests'));
    
    // بارگذاری سفرهای اخیر
    loadDriverRecentTrips(modal.querySelector('#driverRecentTrips'));
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function loadDriverTripRequests(container) {
    if (!container || !currentUser) {
        if (container) {
            container.innerHTML = '<p class="empty-state">برای مشاهده درخواست‌ها، وضعیت را آنلاین کنید</p>';
        }
        return;
    }
    
    try {
        if (currentUser.online_status !== 'online') {
            container.innerHTML = '<p class="empty-state">برای مشاهده درخواست‌ها، وضعیت را آنلاین کنید</p>';
            return;
        }
        
        const tripRequests = Trip.getAll().filter(trip => 
            trip.status === 'requested' && 
            trip.ride_type === (currentUser.vehicle_type === 'bike' ? 'bike' : 'economy') &&
            !trip.driver_id
        );
        
        if (tripRequests.length === 0) {
            container.innerHTML = '<p class="empty-state">درخواست سفر جدیدی وجود ندارد</p>';
            return;
        }
        
        container.innerHTML = tripRequests.map(trip => `
            <div class="trip-request-card">
                <div class="trip-request-header">
                    <h4>درخواست سفر #${trip.id}</h4>
                    <span class="trip-type-badge ${trip.ride_type}">
                        ${trip.ride_type === 'economy' ? 'اقتصادی' : trip.ride_type === 'comfort' ? 'کلاسیک' : 'موتور'}
                    </span>
                </div>
                
                <div class="trip-request-details">
                    <div class="trip-route">
                        <div class="route-point">
                            <i class="fas fa-circle pickup-dot"></i>
                            <span>${trip.pickup}</span>
                        </div>
                        <div class="route-point">
                            <i class="fas fa-flag-checkered destination-dot"></i>
                            <span>${trip.destination}</span>
                        </div>
                    </div>
                    
                    <div class="trip-info">
                        <div class="info-item">
                            <i class="fas fa-road"></i>
                            <span>${trip.distance} کیلومتر</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>${formatCurrency(trip.price)}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-user"></i>
                            <span>${trip.user_name}</span>
                        </div>
                    </div>
                </div>
                
                <div class="trip-request-actions">
                    <button class="btn-primary" onclick="acceptTripRequest('${trip.id}')">
                        <i class="fas fa-check"></i> پذیرش سفر
                    </button>
                    <button class="btn-secondary" onclick="declineTripRequest('${trip.id}')">
                        <i class="fas fa-times"></i> رد درخواست
                    </button>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Error loading driver trip requests:', e);
        if (container) {
            container.innerHTML = '<p class="error-message">خطا در بارگذاری درخواست‌ها</p>';
        }
    }
}

function loadDriverRecentTrips(container) {
    if (!container || !currentUser) return;
    
    try {
        const driverTrips = Trip.getAll().filter(trip => 
            trip.driver_id == currentUser.id
        ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
        
        if (driverTrips.length === 0) {
            container.innerHTML = '<p class="empty-state">هنوز سفری انجام نداده‌اید</p>';
            return;
        }
        
        container.innerHTML = driverTrips.map(trip => `
            <div class="driver-trip-item">
                <div class="trip-header">
                    <span>${formatDateTime(trip.created_at)}</span>
                    <span class="trip-status status-${trip.status}">
                        ${trip.status === 'completed' ? 'تکمیل' : 
                          trip.status === 'cancelled' ? 'لغو' : 'در حال'}
                    </span>
                </div>
                <div class="trip-details">
                    <div class="trip-route">
                        <span>${trip.pickup} → ${trip.destination}</span>
                    </div>
                    <div class="trip-footer">
                        <span>${trip.distance} کیلومتر</span>
                        <span class="trip-earning">${formatCurrency(trip.price)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Error loading driver recent trips:', e);
        container.innerHTML = '<p class="error-message">خطا در بارگذاری سفرها</p>';
    }
}

function acceptTripRequest(tripId) {
    try {
        const trip = Trip.findById(tripId);
        if (!trip) return;
        
        trip.driver_id = currentUser.id;
        trip.driver_name = currentUser.name;
        trip.status = 'confirmed';
        trip.save();
        
        // اطلاع به مسافر
        Notification.createForUser(
            trip.user_id,
            'راننده پیدا شد',
            `راننده ${currentUser.name} سفر شما را پذیرفت. به زودی در مبدا حاضر خواهد شد.`,
            'info'
        );
        
        showNotification('سفر با موفقیت پذیرفته شد', 'success');
        
        // بستن داشبورد و نمایش وضعیت سفر
        document.querySelector('#driverDashboardModal')?.remove();
        
        // اگر مسافر همان کاربر جاری است، وضعیت سفر را نشان بده
        if (trip.user_id == currentUser.id) {
            currentTripId = tripId;
            showRideStatus();
        } else {
            // بارگذاری مجدد درخواست‌ها
            openDriverDashboard();
        }
    } catch (e) {
        console.error('Error accepting trip request:', e);
        showNotification('خطا در پذیرش سفر', 'error');
    }
}

function declineTripRequest(tripId) {
    if (confirm('آیا از رد این درخواست سفر مطمئن هستید؟')) {
        showNotification('درخواست سفر رد شد', 'info');
        
        // بارگذاری مجدد درخواست‌ها
        const dashboard = document.querySelector('#driverDashboardModal');
        if (dashboard) {
            loadDriverTripRequests(dashboard.querySelector('#driverTripRequests'));
        }
    }
}

// ===================== سیستم پشتیبانی =====================
function openSupportPage() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const supportPage = document.getElementById('support-page');
    if (supportPage) {
        supportPage.classList.add('active');
        loadSupportTickets();
    }
}

function loadSupportTickets() {
    const supportPage = document.getElementById('support-page');
    if (!supportPage) return;
    
    supportPage.innerHTML = `
        <div class="support-container">
            <div class="support-header">
                <h2><i class="fas fa-headset"></i> پشتیبانی اسنپ</h2>
                <button class="btn-primary" onclick="createNewTicket()">
                    <i class="fas fa-plus"></i> تیکت جدید
                </button>
            </div>
            
            <div class="support-content">
                <div class="support-categories">
                    <div class="category-card" onclick="createTicketWithCategory('technical')">
                        <div class="category-icon">
                            <i class="fas fa-cogs"></i>
                        </div>
                        <h4>مشکلات فنی</h4>
                        <p>مشکل در برنامه یا پرداخت</p>
                    </div>
                    
                    <div class="category-card" onclick="createTicketWithCategory('driver')">
                        <div class="category-icon">
                            <i class="fas fa-car"></i>
                        </div>
                        <h4>مشکلات راننده</h4>
                        <p>مشکل با راننده یا سفر</p>
                    </div>
                    
                    <div class="category-card" onclick="createTicketWithCategory('payment')">
                        <div class="category-icon">
                            <i class="fas fa-credit-card"></i>
                        </div>
                        <h4>مشکلات مالی</h4>
                        <p>خرابی پرداخت یا کیف پول</p>
                    </div>
                    
                    <div class="category-card" onclick="createTicketWithCategory('safety')">
                        <div class="category-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h4>امنیت و حریم خصوصی</h4>
                        <p>مشکل امنیتی یا حریم خصوصی</p>
                    </div>
                </div>
                
                <div class="support-tickets">
                    <h3>تیکت‌های شما</h3>
                    <div id="ticketsList" class="tickets-list">
                        <!-- لیست تیکت‌ها -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // بارگذاری تیکت‌های کاربر
    loadUserTickets(supportPage.querySelector('#ticketsList'));
}

function loadUserTickets(container) {
    if (!container) return;
    
    try {
        const tickets = currentUser ? SupportTicket.findByUserId(currentUser.id) : [];
        
        if (tickets.length === 0) {
            container.innerHTML = '<p class="empty-state">تیکتی یافت نشد</p>';
            return;
        }
        
        container.innerHTML = tickets.map(ticket => `
            <div class="ticket-item" onclick="viewTicket('${ticket.id}')">
                <div class="ticket-header">
                    <h4>${ticket.subject}</h4>
                    <span class="ticket-status ${ticket.status}">
                        ${ticket.status === 'open' ? 'باز' : 'بسته'}
                    </span>
                </div>
                <div class="ticket-body">
                    <p>${ticket.message.substring(0, 100)}...</p>
                </div>
                <div class="ticket-footer">
                    <span class="ticket-category ${ticket.category}">
                        ${ticket.category === 'technical' ? 'فنی' : 
                          ticket.category === 'payment' ? 'پرداخت' : 
                          ticket.category === 'driver' ? 'راننده' : 'عمومی'}
                    </span>
                    <span class="ticket-date">${formatDate(ticket.created_at)}</span>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Error loading user tickets:', e);
        container.innerHTML = '<p class="error-message">خطا در بارگذاری تیکت‌ها</p>';
    }
}

function createNewTicket() {
    createTicketWithCategory('general');
}

function createTicketWithCategory(category) {
    if (!currentUser) {
        showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
        openAuthModal();
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 600px;">
            <div class="modal-header">
                <h3>تیکت پشتیبانی جدید</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="newTicketForm">
                    <div class="form-group">
                        <label for="ticketCategory">دسته‌بندی</label>
                        <select id="ticketCategory" class="form-input" required>
                            <option value="general" ${category === 'general' ? 'selected' : ''}>عمومی</option>
                            <option value="technical" ${category === 'technical' ? 'selected' : ''}>مشکلات فنی</option>
                            <option value="driver" ${category === 'driver' ? 'selected' : ''}>مشکلات راننده</option>
                            <option value="payment" ${category === 'payment' ? 'selected' : ''}>مشکلات مالی</option>
                            <option value="safety" ${category === 'safety' ? 'selected' : ''}>امنیت و حریم خصوصی</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="ticketSubject">موضوع *</label>
                        <input type="text" id="ticketSubject" class="form-input" placeholder="موضوع مشکل" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="ticketMessage">پیام *</label>
                        <textarea id="ticketMessage" class="form-input" rows="6" placeholder="شرح کامل مشکل خود را بنویسید..." required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="ticketPriority">اولویت</label>
                        <select id="ticketPriority" class="form-input">
                            <option value="low">کم</option>
                            <option value="medium" selected>متوسط</option>
                            <option value="high">زیاد</option>
                            <option value="urgent">فوری</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="btn-primary" style="width: 100%;">
                            ارسال تیکت
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#newTicketForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        try {
            const category = modal.querySelector('#ticketCategory').value;
            const subject = modal.querySelector('#ticketSubject').value.trim();
            const message = modal.querySelector('#ticketMessage').value.trim();
            const priority = modal.querySelector('#ticketPriority').value;
            
            if (!subject || !message) {
                showNotification('لطفاً موضوع و پیام را وارد کنید', 'error');
                return;
            }
            
            const ticketData = {
                user_id: currentUser.id,
                user_name: currentUser.name,
                user_role: currentUser.role,
                subject,
                category,
                message,
                priority
            };
            
            const newTicket = new SupportTicket(ticketData);
            newTicket.save();
            
            // اطلاع به ادمین‌ها
            const adminUsers = User.getAll().filter(u => u.role === 'admin');
            adminUsers.forEach(admin => {
                Notification.createForUser(
                    admin.id,
                    'تیکت پشتیبانی جدید',
                    `تیکت جدید از ${currentUser.name} با موضوع "${subject}"`,
                    'info'
                );
            });
            
            showNotification('تیکت با موفقیت ارسال شد. پاسخگویی حداکثر ۲۴ ساعت کاری طول می‌کشد.', 'success');
            modal.remove();
            loadSupportTickets();
        } catch (e) {
            console.error('Error creating ticket:', e);
            showNotification('خطا در ارسال تیکت', 'error');
        }
    });
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===================== سیستم نوتیفیکیشن =====================
function loadUserNotifications() {
    if (!currentUser) return;
    
    try {
        userNotifications = Notification.findByUserId(currentUser.id);
        updateNotificationBadge();
    } catch (e) {
        console.error('Error loading notifications:', e);
    }
}

function updateNotificationBadge() {
    const notificationBadge = document.getElementById('notificationBadge');
    const mobileNotificationBadge = document.getElementById('mobileNotificationBadge');
    
    if (!currentUser) {
        if (notificationBadge) notificationBadge.style.display = 'none';
        if (mobileNotificationBadge) mobileNotificationBadge.style.display = 'none';
        return;
    }
    
    try {
        const unreadCount = Notification.getUnreadCount(currentUser.id);
        
        if (notificationBadge) {
            if (unreadCount > 0) {
                notificationBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                notificationBadge.style.display = 'flex';
            } else {
                notificationBadge.style.display = 'none';
            }
        }
        
        if (mobileNotificationBadge) {
            if (unreadCount > 0) {
                mobileNotificationBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                mobileNotificationBadge.style.display = 'flex';
            } else {
                mobileNotificationBadge.style.display = 'none';
            }
        }
    } catch (e) {
        console.error('Error updating notification badge:', e);
    }
}

function openNotifications() {
    if (!currentUser) {
        showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
        openAuthModal();
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h3>نوتیفیکیشن‌ها</h3>
                <button class="btn-secondary" onclick="markAllAsRead()">خواندن همه</button>
                <span class="close-modal" style="margin-right: 10px;">&times;</span>
            </div>
            <div class="modal-body">
                <div id="notificationsList" class="notifications-list">
                    <!-- لیست نوتیفیکیشن‌ها -->
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    loadNotificationsList(modal.querySelector('#notificationsList'));
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        updateNotificationBadge();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            updateNotificationBadge();
        }
    });
}

function loadNotificationsList(container) {
    if (!container || !currentUser) return;
    
    try {
        userNotifications = Notification.findByUserId(currentUser.id);
        
        if (userNotifications.length === 0) {
            container.innerHTML = '<p class="empty-state">نوتیفیکیشنی یافت نشد</p>';
            return;
        }
        
        container.innerHTML = userNotifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" onclick="handleNotificationClick('${notification.id}')">
                <div class="notification-icon">
                    <i class="fas fa-${notification.type === 'success' ? 'check-circle' : 
                                       notification.type === 'error' ? 'exclamation-circle' : 
                                       notification.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <small>${formatDateTime(notification.created_at)}</small>
                </div>
                ${!notification.read ? '<div class="unread-dot"></div>' : ''}
            </div>
        `).join('');
    } catch (e) {
        console.error('Error loading notifications list:', e);
        container.innerHTML = '<p class="error-message">خطا در بارگذاری نوتیفیکیشن‌ها</p>';
    }
}

function handleNotificationClick(notificationId) {
    try {
        const notification = userNotifications.find(n => n.id == notificationId);
        if (!notification) return;
        
        notification.markAsRead();
        
        if (notification.action) {
            // انجام اکشن مربوطه
            if (notification.action === 'open_trip') {
                currentTripId = notification.action_data.trip_id;
                showRideStatus();
            } else if (notification.action === 'open_wallet') {
                openWalletModal();
            }
        }
        
        // به‌روزرسانی لیست
        const modal = document.querySelector('.modal');
        if (modal) {
            loadNotificationsList(modal.querySelector('#notificationsList'));
            updateNotificationBadge();
        }
    } catch (e) {
        console.error('Error handling notification click:', e);
    }
}

function markAllAsRead() {
    if (!currentUser) return;
    
    try {
        userNotifications.forEach(notification => {
            if (!notification.read) {
                notification.markAsRead();
            }
        });
        
        const modal = document.querySelector('.modal');
        if (modal) {
            loadNotificationsList(modal.querySelector('#notificationsList'));
            updateNotificationBadge();
        }
    } catch (e) {
        console.error('Error marking all as read:', e);
    }
}

// ===================== مدیریت منو =====================
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
}

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const pageElement = document.getElementById(pageId);
    if (pageElement) {
        pageElement.classList.add('active');
    }
    closeMobileMenu();
}

// ===================== راه‌اندازی اولیه =====================
function initializeSampleData() {
    try {
        // بررسی اینکه آیا داده‌های نمونه قبلاً ایجاد شده‌اند
        const usersExist = storage.get('snapp_users').length > 0;
        
        if (!usersExist) {
            // ایجاد کاربران نمونه
            const sampleUsers = [
                {
                    id: 1,
                    name: 'مدیر سیستم',
                    email: 'admin@snapp.af',
                    phone: '0700000001',
                    password: '123456',
                    role: 'admin',
                    status: 'approved',
                    wallet_balance: 1000000
                },
                {
                    id: 2,
                    name: 'احمد کریمی',
                    email: 'ahmad@email.com',
                    phone: '0700000002',
                    password: '123456',
                    role: 'passenger',
                    status: 'approved',
                    wallet_balance: 50000
                },
                {
                    id: 3,
                    name: 'رحمان رحیمی',
                    email: 'rahman@email.com',
                    phone: '0700000003',
                    password: '123456',
                    role: 'driver',
                    status: 'approved',
                    vehicle_type: 'car',
                    car_model: 'تویوتا کمری',
                    plate_number: 'کابل 1234',
                    rating: 4.8,
                    total_trips: 150,
                    earning: 250000,
                    online_status: 'online',
                    driver_status: 'approved'
                },
                {
                    id: 4,
                    name: 'سمیه محمدی',
                    email: 'somyeh@email.com',
                    phone: '0700000004',
                    password: '123456',
                    role: 'passenger',
                    status: 'approved',
                    wallet_balance: 30000
                },
                {
                    id: 5,
                    name: 'علی احمدی',
                    email: 'ali@email.com',
                    phone: '0700000005',
                    password: '123456',
                    role: 'driver',
                    status: 'pending',
                    vehicle_type: 'bike',
                    rating: 4.2,
                    total_trips: 50,
                    earning: 80000,
                    online_status: 'offline',
                    driver_status: 'pending'
                }
            ];
            
            sampleUsers.forEach(userData => {
                const user = new User(userData);
                user.save();
            });
            
            // ایجاد سفرهای نمونه
            const sampleTrips = [
                {
                    id: 1001,
                    pickup: 'کارته سخی',
                    destination: 'شهر نو',
                    ride_type: 'economy',
                    distance: 4.5,
                    price: 120,
                    status: 'completed',
                    user_id: 2,
                    user_name: 'احمد کریمی',
                    driver_id: 3,
                    driver_name: 'رحمان رحیمی',
                    payment_method: 'cash',
                    rated: true,
                    rating: 5,
                    rating_comment: 'خیلی خوب و مودب',
                    created_at: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 1002,
                    pickup: 'میدان هوایی بین المللی کابل',
                    destination: 'کارته چهار',
                    ride_type: 'comfort',
                    distance: 8.2,
                    price: 200,
                    status: 'completed',
                    user_id: 4,
                    user_name: 'سمیه محمدی',
                    driver_id: 3,
                    driver_name: 'رحمان رحیمی',
                    payment_method: 'wallet',
                    rated: true,
                    rating: 4,
                    created_at: new Date(Date.now() - 43200000).toISOString()
                }
            ];
            
            sampleTrips.forEach(tripData => {
                const trip = new Trip(tripData);
                trip.save();
            });
            
            // ایجاد کدهای تخفیف نمونه
            const sampleDiscounts = [
                {
                    code: 'SNAPP20',
                    percent: 20,
                    description: 'تخفیف ویژه برای اولین سفر',
                    min_order: 0,
                    max_uses: 100,
                    expiry_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                    active: true,
                    ride_types: ['economy', 'comfort']
                },
                {
                    code: 'WELCOME10',
                    percent: 10,
                    description: 'خوش آمدید به اسنپ',
                    min_order: 5000,
                    max_uses: 50,
                    expiry_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
                    active: true,
                    for_new_users: true
                }
            ];
            
            sampleDiscounts.forEach(discountData => {
                const discount = new Discount(discountData);
                discount.save();
            });
            
            // ایجاد نوتیفیکیشن‌های نمونه
            const sampleNotifications = [
                {
                    user_id: 1,
                    title: 'خوش آمدید مدیر',
                    message: 'به پنل مدیریت اسنپ خوش آمدید',
                    type: 'info'
                },
                {
                    user_id: 2,
                    title: 'تخفیف ویژه',
                    message: 'کد تخفیف SNAPP20 برای شما فعال شد',
                    type: 'success'
                }
            ];
            
            sampleNotifications.forEach(notificationData => {
                const notification = new Notification(notificationData);
                notification.save();
            });
        }
    } catch (e) {
        console.error('Error initializing sample data:', e);
    }
}

// ===================== توابع کمکی اضافی =====================
function generateReport() {
    const reportType = document.getElementById('reportType')?.value;
    const reportDate = document.getElementById('reportDate')?.value;
    const reportResults = document.getElementById('reportResults');
    
    if (!reportResults) return;
    
    try {
        let reportHTML = '<div class="report-content">';
        
        switch(reportType) {
            case 'daily':
                const trips = Trip.getAll();
                const date = reportDate ? new Date(reportDate) : new Date();
                const targetDate = date.toDateString();
                
                const dailyTrips = trips.filter(t => {
                    try {
                        return new Date(t.created_at).toDateString() === targetDate;
                    } catch {
                        return false;
                    }
                });
                
                reportHTML += `
                    <h4>گزارش روزانه - ${formatDate(date.toISOString())}</h4>
                    <div class="report-stats">
                        <p>تعداد سفرها: <strong>${dailyTrips.length}</strong></p>
                        <p>سفرهای تکمیل شده: <strong>${dailyTrips.filter(t => t.status === 'completed').length}</strong></p>
                        <p>درآمد کل: <strong>${formatCurrency(dailyTrips.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.price || 0), 0))}</strong></p>
                    </div>
                `;
                break;
                
            case 'drivers':
                const drivers = User.getDrivers();
                reportHTML += `
                    <h4>گزارش رانندگان</h4>
                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>نام</th>
                                <th>تعداد سفرها</th>
                                <th>میانگین امتیاز</th>
                                <th>درآمد کل</th>
                                <th>وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${drivers.map(driver => `
                                <tr>
                                    <td>${driver.name}</td>
                                    <td>${driver.total_trips || 0}</td>
                                    <td>${driver.rating || 0}</td>
                                    <td>${formatCurrency(driver.earning || 0)}</td>
                                    <td>${driver.online_status === 'online' ? 'آنلاین' : 'آفلاین'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
                break;
                
            default:
                reportHTML += '<p class="empty-state">لطفاً نوع گزارش را انتخاب کنید</p>';
                break;
        }
        
        reportHTML += '</div>';
        reportResults.innerHTML = reportHTML;
    } catch (e) {
        console.error('Error generating report:', e);
        reportResults.innerHTML = '<p class="error-message">خطا در تولید گزارش</p>';
    }
}

function exportReport() {
    showNotification('این قابلیت در نسخه نمایشی فعال نیست', 'info');
}

// ===================== رویدادهای اولیه =====================
document.addEventListener('DOMContentLoaded', function() {
    // بررسی وضعیت ورود کاربر
    checkUserLoginStatus();
    
    // راه‌اندازی نقشه بعد از بارگذاری کامل صفحه
    setTimeout(initMap, 100);
    
    // تنظیم رویدادهای دکمه‌ها
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', openAuthModal);
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', openAuthModal);
    }
    
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', logout);
    }
    
    // رویدادهای ناوبری
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                navigateTo(pageId);
            }
        });
    });
    
    // رویدادهای دکمه درخواست سفر
    const requestRideBtn = document.getElementById('requestRideBtn');
    if (requestRideBtn) {
        requestRideBtn.addEventListener('click', requestRide);
    }
    
    const mobileRequestRideBtn = document.getElementById('mobileRequestRideBtn');
    if (mobileRequestRideBtn) {
        mobileRequestRideBtn.addEventListener('click', requestRide);
    }
    
    // رویدادهای انتخاب نوع سفر
    document.querySelectorAll('.ride-type').forEach(ride => {
        ride.addEventListener('click', function() {
            document.querySelectorAll('.ride-type').forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
            selectedRideType = this.id.replace('Ride', '');
            updatePrice();
        });
    });
    
    // رویدادهای انتخاب روش پرداخت
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            selectedPaymentMethod = this.id.replace('Payment', '');
        });
    });
    
    // جستجوی مکان‌ها
    const pickupInput = document.getElementById('pickup');
    const destinationInput = document.getElementById('destination');
    
    if (pickupInput) {
        pickupInput.addEventListener('input', function() {
            calculateDistanceAndPrice();
        });
    }
    
    if (destinationInput) {
        destinationInput.addEventListener('input', function() {
            calculateDistanceAndPrice();
        });
    }
    
    // دکمه تعویض مبدا و مقصد
    const swapButton = document.getElementById('swapButton');
    if (swapButton) {
        swapButton.addEventListener('click', function() {
            if (pickupInput && destinationInput) {
                const tempValue = pickupInput.value;
                const tempCoords = selectedPickupCoords;
                
                pickupInput.value = destinationInput.value;
                destinationInput.value = tempValue;
                
                selectedPickupCoords = selectedDestinationCoords;
                selectedDestinationCoords = tempCoords;
                
                // به‌روزرسانی مارکرها
                if (selectedPickupCoords) {
                    setPickupLocation(pickupInput.value, selectedPickupCoords);
                }
                if (selectedDestinationCoords) {
                    setDestinationLocation(destinationInput.value, selectedDestinationCoords);
                }
                
                calculateDistanceAndPrice();
                showNotification('مبدا و مقصد جابجا شدند', 'info');
            }
        });
    }
    
    // دکمه استفاده از موقعیت فعلی
    const useCurrentLocationBtn = document.getElementById('useCurrentLocation');
    if (useCurrentLocationBtn) {
        useCurrentLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        setPickupLocation('موقعیت فعلی من', [lat, lng]);
                        showNotification('موقعیت فعلی شما به عنوان مبدا تنظیم شد', 'success');
                    },
                    function(error) {
                        showNotification('دسترسی به موقعیت مکانی امکان‌پذیر نیست', 'error');
                        // استفاده از یک موقعیت پیش‌فرض
                        setPickupLocation('میدان هوایی بین المللی کابل', [34.5658, 69.2120]);
                    }
                );
            } else {
                showNotification('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند', 'error');
            }
        });
    }
    
    // رویدادهای ادمین
    const adminLink = document.getElementById('adminLink');
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            openAdminPanel();
        });
    }
    
    const mobileAdminLink = document.getElementById('mobileAdminLink');
    if (mobileAdminLink) {
        mobileAdminLink.addEventListener('click', function(e) {
            e.preventDefault();
            openAdminPanel();
            closeMobileMenu();
        });
    }
    
    // رویدادهای پروفایل
    const profileLink = document.getElementById('profileLink');
    if (profileLink) {
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();
            openProfilePage();
        });
    }
    
    const mobileProfileLink = document.getElementById('mobileProfileLink');
    if (mobileProfileLink) {
        mobileProfileLink.addEventListener('click', function(e) {
            e.preventDefault();
            openProfilePage();
            closeMobileMenu();
        });
    }
    
    // رویدادهای پشتیبانی
    const supportLink = document.getElementById('supportLink');
    if (supportLink) {
        supportLink.addEventListener('click', function(e) {
            e.preventDefault();
            openSupportPage();
        });
    }
    
    const mobileSupportLink = document.getElementById('mobileSupportLink');
    if (mobileSupportLink) {
        mobileSupportLink.addEventListener('click', function(e) {
            e.preventDefault();
            openSupportPage();
            closeMobileMenu();
        });
    }
    
    // رویدادهای نوتیفیکیشن
    const notificationIcon = document.getElementById('notificationIcon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', openNotifications);
    }
    
    const mobileNotificationIcon = document.getElementById('mobileNotificationIcon');
    if (mobileNotificationIcon) {
        mobileNotificationIcon.addEventListener('click', function(e) {
            e.preventDefault();
            openNotifications();
            closeMobileMenu();
        });
    }
    
    // دکمه منو موبایل
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // بستن منو موبایل با کلیک خارج
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mobileMenu && mobileMenuBtn && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
    
    // تنظیم پیش‌فرض‌ها
    const economyRide = document.getElementById('economyRide');
    const cashPayment = document.getElementById('cashPayment');
    
    if (economyRide) economyRide.classList.add('selected');
    if (cashPayment) cashPayment.classList.add('selected');
    
    // بارگذاری نوتیفیکیشن‌ها به صورت دوره‌ای
    setInterval(() => {
        if (currentUser) {
            loadUserNotifications();
        }
    }, 30000);
    
    // نمایش پیام خوش‌آمدگویی
    console.log('سیستم اسنپ کابل با موفقیت بارگذاری شد!');
});

// اضافه کردن توابع به window برای دسترسی از HTML
window.openAuthModal = openAuthModal;
window.logout = logout;
window.openAdminPanel = openAdminPanel;
window.openWalletModal = openWalletModal;
window.openProfilePage = openProfilePage;
window.openSupportPage = openSupportPage;
window.openNotifications = openNotifications;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.navigateTo = navigateTo;
window.requestRide = requestRide;
window.cancelCurrentRide = cancelCurrentRide;
window.contactDriver = contactDriver;
window.shareRide = shareRide;
window.goHome = goHome;
window.requestAnotherRide = requestAnotherRide;
window.submitRating = submitRating;
window.chargeWallet = chargeWallet;
window.processWalletCharge = processWalletCharge;
window.openEditProfile = openEditProfile;
window.openNotificationSettings = openNotificationSettings;
window.openDriverDashboard = openDriverDashboard;
window.acceptTripRequest = acceptTripRequest;
window.declineTripRequest = declineTripRequest;
window.createNewTicket = createNewTicket;
window.createTicketWithCategory = createTicketWithCategory;
window.viewTicket = viewTicket;
window.markAllAsRead = markAllAsRead;
window.handleNotificationClick = handleNotificationClick;
window.useSavedLocation = useSavedLocation;
window.deleteSavedLocation = deleteSavedLocation;
window.generateReport = generateReport;
window.exportReport = exportReport;
window.approveUser = approveUser;
window.deleteUser = deleteUser;
window.viewUserDetails = viewUserDetails;
window.createNewUser = createNewUser;
window.viewDriverDetails = viewUserDetails; // استفاده از همان تابع
window.editDriver = viewUserDetails; // استفاده از همان تابع
window.filterAdminTrips = filterAdminTrips;
window.viewTripDetails = viewTripDetails;
window.cancelTrip = cancelTrip;
window.sendTicketResponse = sendTicketResponse;
window.closeTicket = closeTicket;
window.createNewDiscount = createNewDiscount;
window.deleteDiscount = deleteDiscount;
window.editDiscount = function(id) {
    // در نسخه نمایشی این تابع را پیاده‌سازی نکردیم
    showNotification('این قابلیت در نسخه نمایشی فعال نیست', 'info');
};