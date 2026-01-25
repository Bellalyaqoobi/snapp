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
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },
    set: (key, data) => localStorage.setItem(key, JSON.stringify(data)),
    remove: (key) => localStorage.removeItem(key),
    clear: () => localStorage.clear(),
    
    // ذخیره‌سازی امن
    setSecure: (key, data) => {
        try {
            const encrypted = btoa(JSON.stringify(data));
            localStorage.setItem(key, encrypted);
        } catch (e) {
            console.error('Encryption error:', e);
            localStorage.setItem(key, JSON.stringify(data));
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
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
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

    static getTotalRevenue() {
        return Trip.getCompletedTrips().reduce((sum, trip) => sum + (trip.price || 0), 0);
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

// ===================== بخش جدید: سیستم پشتیبانی =====================
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
        const ticketData = tickets.find(t => t.id === id);
        return ticketData ? new SupportTicket(ticketData) : null;
    }

    static findByUserId(userId) {
        const tickets = storage.get('snapp_tickets');
        return tickets
            .filter(t => t.user_id === userId)
            .map(data => new SupportTicket(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    static getAll() {
        return storage.get('snapp_tickets').map(data => new SupportTicket(data));
    }

    static getOpenTickets() {
        return SupportTicket.getAll().filter(ticket => ticket.status === 'open');
    }

    static getTicketsByCategory(category) {
        return SupportTicket.getAll().filter(ticket => ticket.category === category);
    }
}

// ===================== بخش جدید: سیستم اطلاع‌رسانی =====================
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
            .filter(n => n.user_id === userId)
            .map(data => new Notification(data))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    static getUnreadCount(userId) {
        const notifications = storage.get('snapp_notifications');
        return notifications.filter(n => n.user_id === userId && !n.read).length;
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

// ===================== بخش جدید: سیستم اشتراک‌های ویژه =====================
class Subscription {
    constructor(data) {
        this.id = data.id || Date.now();
        this.user_id = data.user_id;
        this.plan = data.plan || 'basic';
        this.start_date = data.start_date || new Date().toISOString();
        this.end_date = data.end_date;
        this.status = data.status || 'active';
        this.payment_method = data.payment_method;
        this.auto_renew = data.auto_renew || false;
        this.features = data.features || {
            priority_support: false,
            lower_fares: false,
            free_cancellations: 0,
            monthly_discount: 0
        };
    }

    save() {
        let subscriptions = storage.get('snapp_subscriptions');
        const index = subscriptions.findIndex(s => s.id === this.id);
        if (index !== -1) {
            subscriptions[index] = this;
        } else {
            subscriptions.push(this);
        }
        storage.set('snapp_subscriptions', subscriptions);
    }

    static findActiveByUserId(userId) {
        const subscriptions = storage.get('snapp_subscriptions');
        const now = new Date();
        const subData = subscriptions.find(s => 
            s.user_id === userId && 
            s.status === 'active' &&
            new Date(s.end_date) > now
        );
        return subData ? new Subscription(subData) : null;
    }

    static getPlans() {
        return {
            basic: {
                name: 'اسنپ معمولی',
                price: 0,
                features: ['سفرهای معمولی', 'پشتیبانی ایمیل']
            },
            premium: {
                name: 'اسنپ پرمیوم',
                price: 999,
                features: ['سفرهای اقتصادی‌تر', 'پشتیبانی تلفنی', 'اولویت در پیدا کردن راننده', '۳ بار لغو رایگان در ماه']
            },
            business: {
                name: 'اسنپ بیزینس',
                price: 1999,
                features: ['همه امکانات پرمیوم', 'گزارش‌گیری ماهانه', 'پشتیبانی اختصاصی', '۱۰ بار لغو رایگان در ماه']
            }
        };
    }
}

// ===================== بخش جدید: سیستم مسیرهای ذخیره شده =====================
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
            .filter(l => l.user_id === userId)
            .map(data => new SavedLocation(data))
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    static findByType(userId, type) {
        const locations = storage.get('snapp_saved_locations');
        const locationData = locations.find(l => 
            l.user_id === userId && l.type === type
        );
        return locationData ? new SavedLocation(locationData) : null;
    }

    static delete(id) {
        let locations = storage.get('snapp_saved_locations');
        locations = locations.filter(l => l.id !== id);
        storage.set('snapp_saved_locations', locations);
    }
}

// ===================== بخش جدید: سیستم امتیازدهی و جوایز =====================
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
            const date = new Date(t.created_at);
            return date.getDay() === 5 || date.getDay() === 6;
        });
        
        if (weekendTrips.length >= 3) {
            earnedBadges.push(this.badges[1]);
        }
        
        const nightTrips = trips.filter(t => {
            const date = new Date(t.created_at);
            return date.getHours() >= 22 || date.getHours() <= 4;
        });
        
        if (nightTrips.length >= 5) {
            earnedBadges.push(this.badges[2]);
        }
        
        return earnedBadges;
    }
}

// ===================== بخش جدید: سیستم تراکنش‌های مالی =====================
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
            .filter(t => t.user_id === userId)
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

// ===================== بخش جدید: سیستم گزارش‌گیری =====================
class Report {
    static generateDailyReport(date = new Date()) {
        const trips = Trip.getAll();
        const targetDate = date.toDateString();
        
        const dailyTrips = trips.filter(t => {
            const tripDate = new Date(t.created_at).toDateString();
            return tripDate === targetDate;
        });
        
        const completedTrips = dailyTrips.filter(t => t.status === 'completed');
        const cancelledTrips = dailyTrips.filter(t => t.status === 'cancelled');
        const revenue = completedTrips.reduce((sum, t) => sum + (t.price || 0), 0);
        
        return {
            date: targetDate,
            total_trips: dailyTrips.length,
            completed_trips: completedTrips.length,
            cancelled_trips: cancelledTrips.length,
            revenue: revenue,
            average_price: completedTrips.length > 0 ? revenue / completedTrips.length : 0,
            popular_ride_type: this.getPopularRideType(dailyTrips)
        };
    }
    
    static getPopularRideType(trips) {
        const counts = {};
        trips.forEach(trip => {
            counts[trip.ride_type] = (counts[trip.ride_type] || 0) + 1;
        });
        
        return Object.keys(counts).reduce((a, b) => 
            counts[a] > counts[b] ? a : b
        );
    }
    
    static generateDriverReport(driverId) {
        const trips = Trip.getAll();
        const driverTrips = trips.filter(t => t.driver_id == driverId);
        const completedTrips = driverTrips.filter(t => t.status === 'completed');
        
        return {
            driver_id: driverId,
            total_trips: driverTrips.length,
            completed_trips: completedTrips.length,
            completion_rate: driverTrips.length > 0 ? 
                (completedTrips.length / driverTrips.length * 100).toFixed(1) : 0,
            total_earnings: completedTrips.reduce((sum, t) => sum + (t.price || 0), 0),
            average_rating: completedTrips.length > 0 ? 
                (completedTrips.reduce((sum, t) => sum + (t.rating || 0), 0) / completedTrips.length).toFixed(1) : 0
        };
    }
}

// توابع کمکی
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) {
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

function getTimeRemaining(expiryDate) {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;
    
    if (diff <= 0) return 'منقضی شده';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days} روز و ${hours} ساعت باقی مانده`;
}

// مدیریت نقشه
function initMap() {
    try {
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
            .bindPopup(`<b>${location.name}</b><br><button class="select-location-btn" data-name="${location.name}">انتخاب این مکان</button>`);

        markers.push(marker);
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

// مدیریت منوی موبایل
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }

    document.querySelectorAll('.mobile-nav-links .nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    mobileMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
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
        userAvatar.textContent = currentUser.name.charAt(0);
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
                verified_whatsapp: true,
                wallet_balance: 100000
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
                total_ratings: 15,
                preferences: {
                    favorite_ride_type: 'comfort',
                    auto_pay: false,
                    language: 'fa'
                }
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
                license_image: '',
                profile_image: '',
                tazkira_image: '',
                driver_status: 'active',
                rating: 4.7,
                total_trips: 125,
                current_location: [34.5250, 69.1800],
                online_status: 'online',
                earning: 12500,
                tazkira_number: '456123789',
                verified_email: true,
                verified_whatsapp: true,
                daily_target: 8,
                accepted_payment_methods: ['cash', 'wallet']
            },
            {
                id: 4,
                name: 'سید کریم',
                email: 'karim@example.com',
                phone: '0700777888',
                password: '123456',
                role: 'driver',
                status: 'approved',
                vehicle_type: 'bike',
                car_model: 'هوندا 125',
                car_color: 'قرمز',
                plate_number: 'کابل ۵۶۷۸',
                driver_license: 'DL789012',
                driver_status: 'active',
                rating: 4.3,
                total_trips: 80,
                current_location: [34.5100, 69.1700],
                online_status: 'online',
                earning: 8500,
                daily_target: 10
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
                destination: 'دشت برچی',
                pickup_coords: [34.5320, 69.1680],
                destination_coords: [34.4700, 69.1400],
                ride_type: 'bike',
                distance: 8.2,
                price: 112,
                status: 'completed',
                user_id: 2,
                user_name: 'احمد محمدی',
                driver_id: 4,
                driver_name: 'سید کریم',
                payment_method: 'wallet',
                rated: true,
                rating: 4,
                rating_comment: 'سریع و مطمئن',
                created_at: new Date(Date.now() - 172800000).toISOString()
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
                description: 'تخفیف ویژه اسنپ',
                ride_types: ['economy', 'comfort', 'bike']
            },
            {
                id: 2,
                code: 'WELCOME10',
                percent: 10,
                expiry_date: futureDate.toISOString(),
                max_uses: 50,
                used_count: 5,
                min_order: 50,
                description: 'تخفیف خوش آمدگویی',
                for_new_users: true
            },
            {
                id: 3,
                code: 'BIKE15',
                percent: 15,
                expiry_date: futureDate.toISOString(),
                max_uses: 30,
                used_count: 8,
                min_order: 30,
                description: 'تخفیف ویژه موتور',
                ride_types: ['bike']
            }
        ];
        
        sampleDiscounts.forEach(discount => {
            const discountObj = new Discount(discount);
            discountObj.save();
        });
    }
    
    // ایجاد داده‌های نمونه برای مکان‌های ذخیره شده
    let savedLocations = storage.get('snapp_saved_locations');
    
    if (savedLocations.length === 0) {
        const sampleLocations = [
            {
                id: 1,
                user_id: 2,
                name: 'منزل',
                address: 'کارته چهار، کوچه ۵',
                coordinates: [34.5265, 69.1768],
                type: 'home',
                icon: 'home'
            },
            {
                id: 2,
                user_id: 2,
                name: 'دفتر کار',
                address: 'شهر نو، خیابان اصلی',
                coordinates: [34.5320, 69.1680],
                type: 'work',
                icon: 'briefcase'
            }
        ];
        
        sampleLocations.forEach(location => {
            const locationObj = new SavedLocation(location);
            locationObj.save();
        });
    }
    
    // ایجاد داده‌های نمونه برای تراکنش‌ها
    let transactions = storage.get('snapp_transactions');
    
    if (transactions.length === 0) {
        const sampleTransactions = [
            {
                id: 1,
                user_id: 2,
                amount: 5000,
                type: 'charge',
                description: 'شارژ کیف پول',
                status: 'completed',
                payment_method: 'online',
                created_at: new Date(Date.now() - 259200000).toISOString()
            },
            {
                id: 2,
                user_id: 2,
                amount: -112,
                type: 'payment',
                description: 'پرداخت سفر #2',
                status: 'completed',
                payment_method: 'wallet',
                created_at: new Date(Date.now() - 172800000).toISOString()
            }
        ];
        
        sampleTransactions.forEach(transaction => {
            const transactionObj = new Transaction(transaction);
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
                ${trip.status === 'completed' && !trip.rated ? 
                  `<button class="action-btn btn-approve rate-trip-btn" data-id="${trip.id}">امتیازدهی</button>` : ''}
                ${trip.status === 'completed' ? 
                  `<button class="action-btn btn-info view-trip-btn" data-id="${trip.id}">جزئیات</button>` : ''}
            </td>
        `;
        
        myTripsTable.appendChild(row);
    });
    
    setTimeout(() => {
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
        profileAvatar.textContent = currentUser.name.charAt(0);
    }
    if (profileName) profileName.textContent = currentUser.name;
    if (profileEmail) profileEmail.textContent = currentUser.email;
    if (profilePhone) profilePhone.textContent = currentUser.phone;
    if (profileRole) profileRole.textContent = currentUser.role === 'passenger' ? 'مسافر' : 'راننده';
    
    if (editName) editName.value = currentUser.name;
    if (editEmail) editEmail.value = currentUser.email;
    if (editPhone) editPhone.value = currentUser.phone;
    if (walletBalance) walletBalance.textContent = formatCurrency(currentUser.wallet_balance);
    
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
    
    // بارگذاری تراکنش‌ها
    loadUserTransactions();
    
    // بارگذاری سیستم امتیازدهی
    loadRewardSystem();
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

// ===================== توابع جدید =====================

function loadSavedLocations() {
    if (!currentUser) return;
    
    const savedLocationsContainer = document.getElementById('savedLocations');
    if (!savedLocationsContainer) return;
    
    const locations = SavedLocation.findByUserId(currentUser.id);
    savedLocationsContainer.innerHTML = '';
    
    if (locations.length === 0) {
        savedLocationsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--gray);">
                <i class="fas fa-star" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                <p>هیچ مکانی ذخیره نشده است</p>
            </div>
        `;
        return;
    }
    
    locations.forEach(location => {
        const locationItem = document.createElement('div');
        locationItem.className = 'saved-location-item';
        locationItem.innerHTML = `
            <div class="saved-location-icon">
                <i class="fas fa-${location.icon}"></i>
            </div>
            <div class="saved-location-details">
                <h4>${location.name}</h4>
                <p>${location.address}</p>
            </div>
            <div class="saved-location-actions">
                <button class="btn-sm btn-primary use-as-pickup" data-coords='${JSON.stringify(location.coordinates)}' data-name="${location.name}">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button class="btn-sm btn-accent use-as-destination" data-coords='${JSON.stringify(location.coordinates)}' data-name="${location.name}">
                    <i class="fas fa-flag"></i>
                </button>
            </div>
        `;
        
        savedLocationsContainer.appendChild(locationItem);
    });
    
    setTimeout(() => {
        document.querySelectorAll('.use-as-pickup').forEach(btn => {
            btn.addEventListener('click', function() {
                const coords = JSON.parse(this.getAttribute('data-coords'));
                const name = this.getAttribute('data-name');
                setPickupLocation(name, coords);
            });
        });
        
        document.querySelectorAll('.use-as-destination').forEach(btn => {
            btn.addEventListener('click', function() {
                const coords = JSON.parse(this.getAttribute('data-coords'));
                const name = this.getAttribute('data-name');
                setDestinationLocation(name, coords);
            });
        });
    }, 100);
}

function loadUserTransactions() {
    if (!currentUser) return;
    
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) return;
    
    const transactions = Transaction.findByUserId(currentUser.id);
    transactionsList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--gray);">
                <i class="fas fa-exchange-alt" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                <p>هیچ تراکنشی یافت نشد</p>
            </div>
        `;
        return;
    }
    
    transactions.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        const amountClass = transaction.amount > 0 ? 'positive' : 'negative';
        const amountSign = transaction.amount > 0 ? '+' : '';
        
        transactionItem.innerHTML = `
            <div class="transaction-icon">
                <i class="fas ${transaction.type === 'charge' ? 'fa-plus-circle' : 'fa-minus-circle'}"></i>
            </div>
            <div class="transaction-details">
                <h4>${transaction.description}</h4>
                <p>${formatDateTime(transaction.created_at)}</p>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${amountSign}${formatCurrency(Math.abs(transaction.amount))}
            </div>
        `;
        
        transactionsList.appendChild(transactionItem);
    });
}

function loadRewardSystem() {
    if (!currentUser) return;
    
    const rewardContainer = document.getElementById('rewardSystem');
    if (!rewardContainer) return;
    
    const rewardSystem = new RewardSystem();
    const userLevel = rewardSystem.getUserLevel(currentUser.id);
    const earnedBadges = rewardSystem.getEarnedBadges(currentUser.id);
    const levelInfo = rewardSystem.levels[userLevel];
    const nextLevel = userLevel < 5 ? rewardSystem.levels[userLevel + 1] : null;
    
    const trips = Trip.findByUserId(currentUser.id);
    const completedTrips = trips.filter(t => t.status === 'completed').length;
    const progress = nextLevel ? (completedTrips / nextLevel.minTrips * 100) : 100;
    
    rewardContainer.innerHTML = `
        <div class="reward-level-card" style="background: linear-gradient(135deg, ${levelInfo.color}20, ${levelInfo.color}40); border: 2px solid ${levelInfo.color};">
            <div class="level-info">
                <div class="level-icon" style="background: ${levelInfo.color};">
                    <i class="fas fa-crown"></i>
                </div>
                <div>
                    <h3 style="margin: 0; color: ${levelInfo.color};">${levelInfo.name}</h3>
                    <p style="margin: 5px 0 0 0; color: var(--gray);">${levelInfo.discount}% تخفیف در همه سفرها</p>
                </div>
            </div>
            ${nextLevel ? `
            <div style="margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>پیشرفت به سطح بعدی:</span>
                    <span>${completedTrips} از ${nextLevel.minTrips} سفر</span>
                </div>
                <div class="progress-bar" style="background: var(--bg-light);">
                    <div class="progress-fill" style="width: ${progress}%; background: ${levelInfo.color};"></div>
                </div>
            </div>
            ` : ''}
        </div>
        
        ${earnedBadges.length > 0 ? `
        <div style="margin-top: 30px;">
            <h3 style="margin-bottom: 15px;">نشان‌های شما</h3>
            <div class="badges-container">
                ${earnedBadges.map(badge => `
                    <div class="badge-item">
                        <div class="badge-icon">${badge.icon}</div>
                        <div class="badge-info">
                            <h4>${badge.name}</h4>
                            <p>${badge.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
}

function loadUserNotifications() {
    if (!currentUser) return;
    
    userNotifications = Notification.findByUserId(currentUser.id);
    updateNotificationBadge();
    
    const notificationsList = document.getElementById('notificationsList');
    if (!notificationsList) return;
    
    notificationsList.innerHTML = '';
    
    const unreadNotifications = userNotifications.filter(n => !n.read);
    const readNotifications = userNotifications.filter(n => n.read);
    
    if (unreadNotifications.length === 0 && readNotifications.length === 0) {
        notificationsList.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-bell-slash" style="font-size: 48px; color: var(--gray); margin-bottom: 15px; display: block;"></i>
                <p style="color: var(--gray);">هیچ اعلانی ندارید</p>
            </div>
        `;
        return;
    }
    
    [...unreadNotifications, ...readNotifications].forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        notificationItem.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${notification.type === 'info' ? 'info-circle' : notification.type === 'warning' ? 'exclamation-triangle' : 'check-circle'}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <small>${formatDateTime(notification.created_at)}</small>
            </div>
            ${!notification.read ? `<button class="mark-as-read" data-id="${notification.id}"><i class="fas fa-check"></i></button>` : ''}
        `;
        
        notificationsList.appendChild(notificationItem);
    });
    
    setTimeout(() => {
        document.querySelectorAll('.mark-as-read').forEach(btn => {
            btn.addEventListener('click', function() {
                const notificationId = this.getAttribute('data-id');
                const notification = userNotifications.find(n => n.id == notificationId);
                if (notification) {
                    notification.markAsRead();
                    loadUserNotifications();
                }
            });
        });
    }, 100);
}

function updateNotificationBadge() {
    if (!currentUser) return;
    
    const notificationBadge = document.getElementById('notificationBadge');
    const mobileNotificationBadge = document.getElementById('mobileNotificationBadge');
    const unreadCount = Notification.getUnreadCount(currentUser.id);
    
    if (notificationBadge) {
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount;
            notificationBadge.style.display = 'flex';
        } else {
            notificationBadge.style.display = 'none';
        }
    }
    
    if (mobileNotificationBadge) {
        if (unreadCount > 0) {
            mobileNotificationBadge.textContent = unreadCount;
            mobileNotificationBadge.style.display = 'flex';
        } else {
            mobileNotificationBadge.style.display = 'none';
        }
    }
}

function openSupportTicketModal() {
    if (!currentUser) {
        showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
        openAuthModal();
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'supportModal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 500px;">
            <div class="modal-header">
                <h3>ارسال تیکت پشتیبانی</h3>
                <span class="close-modal">&times;</span>
            </div>
            <div class="modal-body">
                <form id="supportForm">
                    <div class="form-group">
                        <label for="ticketSubject">موضوع</label>
                        <input type="text" id="ticketSubject" class="form-input" placeholder="موضوع مشکل خود را وارد کنید" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="ticketCategory">دسته‌بندی</label>
                        <select id="ticketCategory" class="form-input" required>
                            <option value="general">عمومی</option>
                            <option value="technical">مشکل فنی</option>
                            <option value="payment">مشکل پرداخت</option>
                            <option value="driver">مشکل با راننده</option>
                            <option value="suggestion">پیشنهاد</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="ticketPriority">اولویت</label>
                        <select id="ticketPriority" class="form-input" required>
                            <option value="low">کم</option>
                            <option value="medium" selected>متوسط</option>
                            <option value="high">زیاد</option>
                            <option value="urgent">فوری</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="ticketMessage">پیام</label>
                        <textarea id="ticketMessage" class="form-input" rows="5" placeholder="مشکل یا سوال خود را به طور کامل شرح دهید" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="btn-primary" style="width: 100%;">
                            <i class="fas fa-paper-plane"></i> ارسال تیکت
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    document.getElementById('supportForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const subject = document.getElementById('ticketSubject').value;
        const category = document.getElementById('ticketCategory').value;
        const priority = document.getElementById('ticketPriority').value;
        const message = document.getElementById('ticketMessage').value;
        
        const ticket = new SupportTicket({
            user_id: currentUser.id,
            user_name: currentUser.name,
            user_role: currentUser.role,
            subject,
            category,
            priority,
            message
        });
        
        ticket.save();
        
        Notification.createForUser(
            currentUser.id,
            'تیکت پشتیبانی ثبت شد',
            `تیکت شما با شماره #${ticket.id} ثبت شد و به زودی بررسی خواهد شد.`,
            'info'
        );
        
        modal.remove();
        showNotification('تیکت پشتیبانی شما با موفقیت ثبت شد', 'success');
        updateNotificationBadge();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function openAdminPanel() {
    if (!isAdmin) {
        showNotification('شما دسترسی به پنل مدیریت ندارید', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'adminPanelModal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 900px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>پنل مدیریت</h3>
                <span class="close-modal">&times;</span>
            </div>
            
            <div class="admin-panel-tabs">
                <button class="admin-tab active" data-tab="users">کاربران</button>
                <button class="admin-tab" data-tab="drivers">رانندگان</button>
                <button class="admin-tab" data-tab="trips">سفرها</button>
                <button class="admin-tab" data-tab="tickets">تیکت‌ها</button>
                <button class="admin-tab" data-tab="reports">گزارش‌ها</button>
            </div>
            
            <div class="admin-tab-content active" id="users-tab">
                <h4 style="margin-bottom: 20px;">مدیریت کاربران</h4>
                <div id="adminUsersList"></div>
            </div>
            
            <div class="admin-tab-content" id="drivers-tab">
                <h4 style="margin-bottom: 20px;">مدیریت رانندگان</h4>
                <div id="adminDriversList"></div>
            </div>
            
            <div class="admin-tab-content" id="trips-tab">
                <h4 style="margin-bottom: 20px;">مدیریت سفرها</h4>
                <div id="adminTripsList"></div>
            </div>
            
            <div class="admin-tab-content" id="tickets-tab">
                <h4 style="margin-bottom: 20px;">تیکت‌های پشتیبانی</h4>
                <div id="adminTicketsList"></div>
            </div>
            
            <div class="admin-tab-content" id="reports-tab">
                <h4 style="margin-bottom: 20px;">گزارش‌های سیستم</h4>
                <div id="adminReportsContent"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            switch(tabId) {
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
                case 'reports':
                    loadAdminReports();
                    break;
            }
        });
    });
    
    loadAdminUsers();
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function loadAdminUsers() {
    const usersList = document.getElementById('adminUsersList');
    if (!usersList) return;
    
    const users = User.getAll();
    usersList.innerHTML = `
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <span>تعداد کاربران: ${users.length}</span>
            <button class="btn-primary" onclick="createNewUser()">
                <i class="fas fa-plus"></i> کاربر جدید
            </button>
        </div>
        <div class="admin-table-container">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>شناسه</th>
                        <th>نام</th>
                        <th>ایمیل</th>
                        <th>نقش</th>
                        <th>وضعیت</th>
                        <th>تاریخ ثبت</th>
                        <th>عملیات</th>
                    </tr>
                </thead>
                <tbody id="adminUsersTable">
                </tbody>
            </table>
        </div>
    `;
    
    const tableBody = document.getElementById('adminUsersTable');
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role === 'admin' ? 'مدیر' : user.role === 'driver' ? 'راننده' : 'مسافر'}</td>
            <td>
                <span class="status-badge ${user.status === 'approved' ? 'status-active' : 'status-inactive'}">
                    ${user.status === 'approved' ? 'تأیید شده' : 'در انتظار'}
                </span>
            </td>
            <td>${formatDate(user.created_at)}</td>
            <td class="action-buttons">
                ${user.status !== 'approved' ? `
                <button class="action-btn btn-approve approve-user" data-id="${user.id}">تأیید</button>
                ` : ''}
                <button class="action-btn btn-danger delete-user" data-id="${user.id}">حذف</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    setTimeout(() => {
        document.querySelectorAll('.approve-user').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                approveUser(userId);
            });
        });
        
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                if (confirm('آیا از حذف این کاربر مطمئن هستید؟')) {
                    User.delete(userId);
                    loadAdminUsers();
                    showNotification('کاربر با موفقیت حذف شد', 'success');
                }
            });
        });
    }, 100);
}

function approveUser(userId) {
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
        
        loadAdminUsers();
        showNotification('کاربر با موفقیت تأیید شد', 'success');
    }
}

// Event Listeners اصلی
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    checkUserLoginStatus();
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

    // مدیریت خروج
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    document.getElementById('mobileLogoutBtn')?.addEventListener('click', logout);

    // مدیریت ناوبری
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            const targetPage = document.getElementById(`${pageId}-page`);
            if (targetPage) {
                targetPage.classList.add('active');
                
                switch(pageId) {
                    case 'profile':
                        updateProfilePage();
                        break;
                    case 'my-trips':
                        loadMyTrips();
                        break;
                    case 'discounts':
                        loadDiscounts();
                        break;
                    case 'notifications':
                        loadUserNotifications();
                        break;
                }
            }
            
            document.getElementById('mobileMenu').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
            document.body.style.overflow = '';
        });
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

    // بازکردن مدال پرداخت
    function openPaymentModal() {
        if (!currentUser) {
            showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
            openAuthModal();
            return;
        }

        document.getElementById('paymentPrice').textContent = formatCurrency(currentPrice);
        document.getElementById('paymentModal').style.display = 'flex';
    }

    // پرداخت با کیف پول
    document.getElementById('payWithWalletBtn')?.addEventListener('click', () => {
        if (!currentUser) return;
        
        if (currentUser.wallet_balance >= currentPrice) {
            currentUser.wallet_balance -= currentPrice;
            currentUser.save();
            localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));
            
            Transaction.createTripPayment(currentUser.id, currentPrice, currentTripId);
            
            showNotification(`پرداخت ${formatCurrency(currentPrice)} از کیف پول با موفقیت انجام شد`, 'success');
            completeTrip();
        } else {
            showNotification('موجودی کیف پول شما کافی نیست', 'error');
        }
    });

    // پرداخت نقدی
    document.getElementById('payWithCashBtn')?.addEventListener('click', () => {
        showNotification('پرداخت نقدی ثبت شد. لطفاً مبلغ را به راننده پرداخت کنید.', 'success');
        completeTrip();
    });

    function completeTrip() {
        document.getElementById('paymentModal').style.display = 'none';
        document.getElementById('liveTracking').style.display = 'none';

        const trip = Trip.findById(currentTripId);
        if (trip) {
            trip.status = 'completed';
            trip.completed_at = new Date().toISOString();
            trip.save();

            if (currentDriver) {
                const driver = User.findById(currentDriver.id);
                if (driver) {
                    driver.total_trips = (driver.total_trips || 0) + 1;
                    driver.earning = (driver.earning || 0) + currentPrice;
                    driver.save();
                }
            }

            Notification.createForUser(
                currentUser.id,
                'سفر تکمیل شد',
                `سفر شما از ${trip.pickup} به ${trip.destination} با موفقیت به پایان رسید.`,
                'success'
            );

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
        updateNotificationBadge();
    }

    // ذخیره تغییرات پروفایل
    document.getElementById('saveProfile')?.addEventListener('click', () => {
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

    // شارژ کیف پول
    document.getElementById('chargeWalletBtn')?.addEventListener('click', () => {
        if (!currentUser) {
            showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
            openAuthModal();
            return;
        }

        const amount = 5000;
        currentUser.wallet_balance += amount;
        currentUser.save();
        localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));

        Transaction.createWalletCharge(currentUser.id, amount, 'online');

        showNotification(`کیف پول شما ${formatCurrency(amount)} شارژ شد`, 'success');
        updateProfilePage();
    });

    // دکمه‌های جدید
    document.getElementById('supportBtn')?.addEventListener('click', openSupportTicketModal);
    document.getElementById('mobileSupportBtn')?.addEventListener('click', openSupportTicketModal);
    
    document.getElementById('notificationsBtn')?.addEventListener('click', () => {
        document.getElementById('notifications-page').classList.add('active');
        loadUserNotifications();
    });
    
    document.getElementById('mobileNotificationsBtn')?.addEventListener('click', () => {
        document.getElementById('notifications-page').classList.add('active');
        loadUserNotifications();
    });

    document.getElementById('adminLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        openAdminPanel();
    });

    document.getElementById('mobileAdminLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        openAdminPanel();
    });

    // بارگذاری اولیه
    calculateDistanceAndPrice();
    updatePrice();
});

// تابع باز کردن مدال ورود
function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('loginEmail').focus();
    clearErrors();
}

// تابع امتیازدهی
function openRatingModal(tripId) {
    const trip = Trip.findById(tripId);
    if (!trip) return;

    document.getElementById('ratingDriverAvatar').textContent = trip.driver_name?.charAt(0) || 'ا';
    document.getElementById('ratingDriverName').textContent = trip.driver_name || '---';
    
    document.getElementById('ratingModal').style.display = 'flex';
    
    let selectedRating = 0;
    const stars = document.querySelectorAll('#ratingStars .rating-star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            highlightRatingStars(selectedRating);
        });
    });
    
    function highlightRatingStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }
    
    document.getElementById('submitRating')?.addEventListener('click', function() {
        if (selectedRating === 0) {
            showNotification('لطفاً امتیاز انتخاب کنید', 'error');
            return;
        }

        trip.rated = true;
        trip.rating = selectedRating;
        trip.rating_comment = document.getElementById('ratingComment').value.trim();
        trip.save();

        if (trip.driver_id) {
            const driver = User.findById(trip.driver_id);
            if (driver) {
                driver.updateRating(selectedRating);
            }
        }

        showNotification('امتیاز شما با موفقیت ثبت شد', 'success');
        document.getElementById('ratingModal').style.display = 'none';
        loadMyTrips();
    });
}

// تابع‌های عمومی برای دسترسی از HTML
window.logout = logout;
window.toggleOnlineStatus = toggleOnlineStatus;
window.openAuthModal = openAuthModal;
window.openSupportTicketModal = openSupportTicketModal;
window.openAdminPanel = openAdminPanel;

console.log('سیستم اسنپ افغانستان با قابلیت‌های کامل آماده به کار است.');