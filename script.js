// داده‌های اصلی سیستم
const kabulData = {
    locations: [
        // مناطق مرکزی
        { name: "میدان هوایی بین المللی کابل", coordinates: [34.5658, 69.2120], type: "airport" },
        { name: "کارته سخی", coordinates: [34.5160, 69.1725], type: "commercial" },
        { name: "کارته چهار", coordinates: [34.5265, 69.1768], type: "commercial" },
        { name: "شهر نو", coordinates: [34.5320, 69.1680], type: "residential" },
        { name: "دشت برچی", coordinates: [34.4700, 69.1400], type: "residential" },
        { name: "قلعه نور", coordinates: [34.5500, 69.1900], type: "residential" },
        { name: "پغمان", coordinates: [34.5800, 69.1200], type: "suburb" },
        { name: "خیرخانه", coordinates: [34.5300, 69.2100], type: "residential" },
        { name: "قلعه فتح الله", coordinates: [34.5000, 69.1800], type: "historical" },
        { name: "مکروریان", coordinates: [34.4900, 69.2000], type: "commercial" },
        
        // سفارتخانه‌ها
        { name: "سفارت امریکا", coordinates: [34.5350, 69.1833], type: "embassy" },
        { name: "سفارت ایران", coordinates: [34.5250, 69.1850], type: "embassy" },
        { name: "سفارت پاکستان", coordinates: [34.5200, 69.1870], type: "embassy" },
        { name: "سفارت ترکیه", coordinates: [34.5300, 69.1900], type: "embassy" },
        
        // وزارتخانه‌ها
        { name: "ارگ ریاست جمهوری", coordinates: [34.5250, 69.1800], type: "government" },
        { name: "وزارت امور خارجه", coordinates: [34.5270, 69.1820], type: "government" },
        { name: "وزارت داخله", coordinates: [34.5290, 69.1840], type: "government" },
        { name: "وزارت دفاع", coordinates: [34.5310, 69.1860], type: "government" },
        
        // مراکز خرید
        { name: "بازار کابل", coordinates: [34.5150, 69.1700], type: "shopping" },
        { name: "بازار کارته سخی", coordinates: [34.5160, 69.1725], type: "shopping" },
        { name: "بازار شورا", coordinates: [34.5200, 69.1650], type: "shopping" },
        { name: "فروشگاه زنجیره ای شهرداری", coordinates: [34.5100, 69.1750], type: "shopping" },
        
        // دانشگاه‌ها
        { name: "پوهنتون کابل", coordinates: [34.5400, 69.1600], type: "education" },
        { name: "پوهنتون پولی تخنیک کابل", coordinates: [34.5350, 69.1550], type: "education" },
        { name: "پوهنتون ابن سینا", coordinates: [34.5450, 69.1500], type: "education" },
        { name: "پوهنتون امریکایی افغانستان", coordinates: [34.5050, 69.1500], type: "education" },
        
        // شفاخانه‌ها
        { name: "شفاخانه علی آباد", coordinates: [34.5150, 69.1750], type: "hospital" },
        { name: "شفاخانه جمهوریت", coordinates: [34.5200, 69.1800], type: "hospital" },
        { name: "شفاخانه ایندیانا", coordinates: [34.5250, 69.1850], type: "hospital" },
        { name: "شفاخانه فرانسوی", coordinates: [34.5150, 69.1900], type: "hospital" },
        
        // هتل‌ها
        { name: "هتل انترکانتیننتال", coordinates: [34.5300, 69.1950], type: "hotel" },
        { name: "هتل سرنا", coordinates: [34.5400, 69.1700], type: "hotel" },
        { name: "هتل کابل", coordinates: [34.5250, 69.1700], type: "hotel" },
        
        // رستوران‌ها
        { name: "رستوران آریانا", coordinates: [34.5200, 69.1600], type: "restaurant" },
        { name: "رستوران بلخی", coordinates: [34.5150, 69.1650], type: "restaurant" },
        { name: "رستوران پامیر", coordinates: [34.5350, 69.1650], type: "restaurant" }
    ],
    
    districts: [
        { name: "کارته سخی", zone: "مرکزی" },
        { name: "کارته چهار", zone: "مرکزی" },
        { name: "شهر نو", zone: "مرکزی" },
        { name: "دشت برچی", zone: "غربی" },
        { name: "قلعه نور", zone: "شمالی" },
        { name: "قلعه فتح الله", zone: "مرکزی" },
        { name: "پغمان", zone: "غربی" },
        { name: "مکروریان", zone: "جنوبی" },
        { name: "خیرخانه", zone: "شرقی" },
        { name: "قلعه ذوالفقار", zone: "جنوبی" },
        { name: "چندول", zone: "غربی" },
        { name: "ده سبز", zone: "شرقی" },
        { name: "افشار", zone: "غربی" },
        { name: "قره باغ", zone: "شرقی" },
        { name: "بگرامی", zone: "جنوبی" },
        { name: "نادر پشته", zone: "مرکزی" },
        { name: "کارته پروان", zone: "مرکزی" },
        { name: "کارته منصور", zone: "مرکزی" },
        { name: "کارته خوشحال", zone: "مرکزی" },
        { name: "کارته سید", zone: "مرکزی" }
    ],
    
    vehicleTypes: {
        economy: {
            name: "اقتصادی",
            baseFare: 50,
            perKm: 10,
            perMinute: 2,
            minFare: 70,
            icon: "🚗",
            color: "#00D474",
            description: "خودروی اقتصادی با قیمت مناسب"
        },
        comfort: {
            name: "کلاسیک",
            baseFare: 80,
            perKm: 15,
            perMinute: 3,
            minFare: 100,
            icon: "🚖",
            color: "#3B82F6",
            description: "خودروی راحت و کلاسیک"
        },
        bike: {
            name: "موتور",
            baseFare: 30,
            perKm: 7,
            perMinute: 1,
            minFare: 40,
            icon: "🏍️",
            color: "#8B5CF6",
            description: "موتورسیکلت برای ترافیک سنگین"
        },
        vip: {
            name: "ویژه",
            baseFare: 150,
            perKm: 25,
            perMinute: 5,
            minFare: 200,
            icon: "⭐",
            color: "#F59E0B",
            description: "خودروی لوکس با خدمات ویژه"
        },
        van: {
            name: "ون",
            baseFare: 100,
            perKm: 20,
            perMinute: 4,
            minFare: 150,
            icon: "🚐",
            color: "#10B981",
            description: "مناسب برای خانواده و بار"
        }
    },
    
    trafficData: {
        peakHours: ["07:00-09:00", "16:00-19:00"],
        congestedAreas: ["کارته سخی", "شهر نو", "کارته چهار"],
        averageSpeeds: {
            normal: 30, // km/h
            peak: 15, // km/h
            congested: 10 // km/h
        }
    }
};

// کلاس اصلی سیستم
class KabulSnapp {
    constructor() {
        this.currentUser = null;
        this.isAdmin = false;
        this.selectedRideType = 'economy';
        this.selectedPaymentMethod = 'cash';
        this.currentDistance = 0;
        this.currentPrice = 0;
        this.currentTripId = null;
        this.currentDriver = null;
        this.map = null;
        this.markers = [];
        this.currentRoute = null;
        this.carMarker = null;
        this.carAnimationInterval = null;
        this.pickupMarker = null;
        this.destinationMarker = null;
        this.selectedPickupCoords = null;
        this.selectedDestinationCoords = null;
        this.rideOptions = {};
        this.drivers = [];
        this.isSearchingDriver = false;
        this.notifications = [];
        
        this.initialize();
    }

    // راه‌اندازی اولیه
    initialize() {
        console.log('🚗 اسنپ کابل در حال راه‌اندازی...');
        
        // ایجاد ذخیره‌سازی در صورت عدم وجود
        this.initializeStorage();
        
        // بارگذاری داده‌های نمونه
        this.initializeSampleData();
        
        // تنظیم نقشه
        this.setupMap();
        
        // راه‌اندازی رابط کاربری
        this.setupUI();
        
        // بررسی وضعیت ورود کاربر
        this.checkUserLoginStatus();
        
        // بارگذاری رانندگان آنلاین
        this.loadOnlineDrivers();
        
        // شروع به روزرسانی‌های دوره‌ای
        this.startPeriodicUpdates();
        
        console.log('✅ اسنپ کابل آماده به کار است');
    }

    // ذخیره‌سازی داده‌ها
    initializeStorage() {
        if (!localStorage.getItem('kabul_snapp_initialized')) {
            const defaultData = {
                users: [],
                trips: [],
                discounts: [],
                supportTickets: [],
                notifications: [],
                walletTransactions: [],
                settings: {
                    appName: 'اسنپ کابل',
                    currency: 'AFN',
                    language: 'fa',
                    theme: 'light'
                }
            };
            
            Object.keys(defaultData).forEach(key => {
                localStorage.setItem(`kabul_snapp_${key}`, JSON.stringify(defaultData[key]));
            });
            
            localStorage.setItem('kabul_snapp_initialized', 'true');
        }
    }

    // بارگذاری داده‌های نمونه
    initializeSampleData() {
        let users = this.getStorage('users');
        
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
                    wallet_balance: 10000,
                    rating: 5.0
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
                    vehicle_capacity: 4,
                    languages: ['دری', 'پشتو'],
                    available_ride_types: ['economy', 'comfort']
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
                    plate_number: 'کابل ۵۵۶۶',
                    driver_license: 'DL789012',
                    license_image: '',
                    profile_image: '',
                    tazkira_image: '',
                    driver_status: 'active',
                    rating: 4.5,
                    total_trips: 89,
                    current_location: [34.5350, 69.1850],
                    online_status: 'online',
                    earning: 8500,
                    tazkira_number: '789123456',
                    verified_email: true,
                    verified_whatsapp: true,
                    vehicle_capacity: 1,
                    languages: ['دری'],
                    available_ride_types: ['bike']
                }
            ];
            
            sampleUsers.forEach(user => this.saveUser(user));
        }
        
        let trips = this.getStorage('trips');
        
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
                    completed_at: new Date(Date.now() - 86400000 + 1200000).toISOString(),
                    route: null,
                    estimated_time: 25,
                    actual_time: 28,
                    traffic_conditions: 'متوسط'
                }
            ];
            
            sampleTrips.forEach(trip => this.saveTrip(trip));
        }
        
        let discounts = this.getStorage('discounts');
        
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
                    active: true,
                    for_new_users: false
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
                    active: true,
                    for_new_users: true
                },
                {
                    id: 3,
                    code: 'FIRSTRIDE',
                    percent: 15,
                    expiry_date: futureDate.toISOString(),
                    max_uses: 200,
                    used_count: 42,
                    min_order: 0,
                    description: 'تخفیف اولین سفر',
                    active: true,
                    for_new_users: true
                }
            ];
            
            sampleDiscounts.forEach(discount => this.saveDiscount(discount));
        }
    }

    // مدیریت ذخیره‌سازی
    getStorage(key) {
        const data = localStorage.getItem(`kabul_snapp_${key}`);
        return data ? JSON.parse(data) : [];
    }

    setStorage(key, data) {
        localStorage.setItem(`kabul_snapp_${key}`, JSON.stringify(data));
    }

    // مدیریت کاربران
    saveUser(userData) {
        let users = this.getStorage('users');
        const index = users.findIndex(u => u.id === userData.id);
        
        if (index !== -1) {
            users[index] = userData;
        } else {
            users.push(userData);
        }
        
        this.setStorage('users', users);
        return userData;
    }

    getUserById(id) {
        const users = this.getStorage('users');
        return users.find(u => u.id === id);
    }

    getUserByCredentials(email, password) {
        const users = this.getStorage('users');
        return users.find(u => 
            (u.email === email || u.phone === email) && 
            u.password === password
        );
    }

    getOnlineDrivers() {
        const users = this.getStorage('users');
        return users.filter(u => 
            u.role === 'driver' && 
            u.status === 'approved' && 
            u.driver_status === 'active' && 
            u.online_status === 'online'
        );
    }

    // مدیریت سفرها
    saveTrip(tripData) {
        let trips = this.getStorage('trips');
        const index = trips.findIndex(t => t.id === tripData.id);
        
        if (index !== -1) {
            trips[index] = tripData;
        } else {
            trips.push(tripData);
        }
        
        this.setStorage('trips', tripData);
        return tripData;
    }

    getTripById(id) {
        const trips = this.getStorage('trips');
        return trips.find(t => t.id === id);
    }

    getUserTrips(userId) {
        const trips = this.getStorage('trips');
        return trips
            .filter(t => t.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    getActiveTrips() {
        const trips = this.getStorage('trips');
        return trips.filter(t => 
            t.status === 'requested' || 
            t.status === 'confirmed' || 
            t.status === 'in_progress'
        );
    }

    // مدیریت تخفیف‌ها
    saveDiscount(discountData) {
        let discounts = this.getStorage('discounts');
        const index = discounts.findIndex(d => d.id === discountData.id);
        
        if (index !== -1) {
            discounts[index] = discountData;
        } else {
            discounts.push(discountData);
        }
        
        this.setStorage('discounts', discounts);
        return discountData;
    }

    getValidDiscounts() {
        const discounts = this.getStorage('discounts');
        const now = new Date();
        
        return discounts.filter(d => 
            new Date(d.expiry_date) > now && 
            d.used_count < d.max_uses &&
            d.active === true
        );
    }

    // تنظیم نقشه
    setupMap() {
        try {
            if (!document.getElementById('map')) {
                console.warn('Element #map not found');
                return;
            }
            
            this.map = L.map('map').setView([34.5250, 69.1800], 12);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(this.map);
            
            L.control.scale().addTo(this.map);
            
            this.addLocationMarkers();
            this.setupMapEvents();
            
        } catch (error) {
            console.error('Error setting up map:', error);
        }
    }

    setupMapEvents() {
        if (!this.map) return;
        
        // کلیک روی نقشه
        this.map.on('click', (e) => {
            this.openLocationSelectionModal(e.latlng.lat, e.latlng.lng);
        });
        
        // حرکت روی نقشه
        this.map.on('moveend', () => {
            this.updateVisibleMarkers();
        });
        
        // تغییر زوم
        this.map.on('zoomend', () => {
            this.updateVisibleMarkers();
        });
    }

    addLocationMarkers() {
        if (!this.map) return;
        
        // پاک کردن نشانگرهای قبلی
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
        
        kabulData.locations.forEach(location => {
            const icon = this.getLocationIcon(location.type);
            
            const marker = L.marker(location.coordinates, { icon })
                .addTo(this.map)
                .bindPopup(this.createLocationPopup(location))
                .on('click', () => {
                    this.handleLocationClick(location);
                });
            
            this.markers.push(marker);
        });
    }

    getLocationIcon(type) {
        const icons = {
            airport: 'plane',
            commercial: 'store',
            residential: 'home',
            suburb: 'subway',
            historical: 'landmark',
            embassy: 'flag',
            government: 'university',
            shopping: 'shopping-cart',
            education: 'graduation-cap',
            hospital: 'hospital',
            hotel: 'bed',
            restaurant: 'utensils'
        };
        
        const iconName = icons[type] || 'map-marker-alt';
        
        return L.divIcon({
            html: `<div class="location-marker location-${type}" style="background: ${this.getLocationColor(type)};">
                    <i class="fas fa-${iconName}"></i>
                   </div>`,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    getLocationColor(type) {
        const colors = {
            airport: '#FF6B6B',
            commercial: '#4ECDC4',
            residential: '#45B7D1',
            embassy: '#96CEB4',
            government: '#FFEAA7',
            shopping: '#DDA0DD',
            education: '#98D8C8',
            hospital: '#F7CAC9',
            hotel: '#F4A460',
            restaurant: '#FFD700'
        };
        
        return colors[type] || '#00D474';
    }

    createLocationPopup(location) {
        return `
            <div class="location-popup">
                <h4>${location.name}</h4>
                <p>نوع: ${this.getLocationTypeText(location.type)}</p>
                <div class="popup-buttons">
                    <button class="btn-set-pickup" data-location='${JSON.stringify(location)}'>
                        <i class="fas fa-map-pin"></i> مبدا
                    </button>
                    <button class="btn-set-destination" data-location='${JSON.stringify(location)}'>
                        <i class="fas fa-flag-checkered"></i> مقصد
                    </button>
                </div>
            </div>
        `;
    }

    getLocationTypeText(type) {
        const types = {
            airport: 'فرودگاه',
            commercial: 'تجاری',
            residential: 'مسکونی',
            embassy: 'سفارت',
            government: 'دولتی',
            shopping: 'خرید',
            education: 'آموزشی',
            hospital: 'بیمارستان',
            hotel: 'هتل',
            restaurant: 'رستوران'
        };
        
        return types[type] || 'سایر';
    }

    updateVisibleMarkers() {
        // می‌توان منطق نمایش/مخفی کردن نشانگرها بر اساس زوم را اینجا پیاده‌سازی کرد
        console.log('Updating visible markers...');
    }

    // مدیریت رابط کاربری
    setupUI() {
        this.setupEventListeners();
        this.setupRideOptions();
        this.loadPopularLocations();
        this.updateNotifications();
    }

    setupEventListeners() {
        // دکمه شروع استفاده
        document.getElementById('start-using-btn')?.addEventListener('click', () => {
            this.showMainApp();
        });

        // انتخاب نوع سفر
        document.querySelectorAll('.ride-type').forEach(type => {
            type.addEventListener('click', (e) => {
                this.selectRideType(e.currentTarget.dataset.type);
            });
        });

        // تعویض مبدا و مقصد
        document.getElementById('swapLocations')?.addEventListener('click', () => {
            this.swapLocations();
        });

        // فرم درخواست سفر
        document.getElementById('rideForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.requestRide();
        });

        // مدیریت ورود
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // مدیریت ثبت‌نام
        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        // خروج
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.logout();
        });

        document.getElementById('mobileLogoutBtn')?.addEventListener('click', () => {
            this.logout();
        });

        // ناوبری
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(e.currentTarget.dataset.page);
            });
        });

        // منوی موبایل
        document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // سایر event listeners
        this.setupAdditionalEventListeners();
    }

    setupAdditionalEventListeners() {
        // تغییر در فیلدهای مبدا و مقصد
        const pickupInput = document.getElementById('pickup');
        const destinationInput = document.getElementById('destination');
        
        if (pickupInput && destinationInput) {
            pickupInput.addEventListener('input', () => {
                setTimeout(() => this.calculateDistanceAndPrice(), 500);
            });
            
            destinationInput.addEventListener('input', () => {
                setTimeout(() => this.calculateDistanceAndPrice(), 500);
            });
        }

        // پیشنهادات مقصد
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const destination = e.currentTarget.dataset.destination;
                this.setDestination(destination);
            });
        });

        // جستجوی مکان
        document.getElementById('locationSearch')?.addEventListener('input', (e) => {
            this.searchLocations(e.target.value);
        });

        // فیلتر نوع مکان
        document.querySelectorAll('.location-filter').forEach(filter => {
            filter.addEventListener('click', (e) => {
                this.filterLocations(e.currentTarget.dataset.type);
            });
        });

        // بازگشت به خانه
        document.getElementById('backToHome')?.addEventListener('click', () => {
            this.navigateTo('home');
        });

        // مدیریت نوتیفیکیشن‌ها
        document.getElementById('notificationBell')?.addEventListener('click', () => {
            this.showNotificationsPanel();
        });

        // تنظیمات
        document.getElementById('settingsBtn')?.addEventListener('click', () => {
            this.showSettings();
        });

        // کمک
        document.getElementById('helpBtn')?.addEventListener('click', () => {
            this.showHelp();
        });
    }

    setupRideOptions() {
        this.rideOptions = kabulData.vehicleTypes;
        
        const rideTypesContainer = document.getElementById('rideTypes');
        if (!rideTypesContainer) return;
        
        rideTypesContainer.innerHTML = '';
        
        Object.entries(this.rideOptions).forEach(([type, data]) => {
            const rideElement = document.createElement('div');
            rideElement.className = `ride-type ${type === this.selectedRideType ? 'selected' : ''}`;
            rideElement.dataset.type = type;
            
            rideElement.innerHTML = `
                <div class="ride-icon">${data.icon}</div>
                <div class="ride-details">
                    <div class="ride-name">${data.name}</div>
                    <div class="ride-price">${this.calculateRidePrice(type)}</div>
                    <div class="ride-description">${data.description}</div>
                </div>
                <div class="ride-select">
                    <i class="fas fa-check"></i>
                </div>
            `;
            
            rideTypesContainer.appendChild(rideElement);
        });
    }

    // توابع اصلی
    showMainApp() {
        const welcomePage = document.getElementById('welcome-page');
        const mainHeader = document.getElementById('main-header');
        const mainContainer = document.getElementById('main-container');
        const mainFooter = document.getElementById('main-footer');
        
        if (welcomePage) welcomePage.style.display = 'none';
        if (mainHeader) mainHeader.style.display = 'block';
        if (mainContainer) mainContainer.style.display = 'block';
        if (mainFooter) mainFooter.style.display = 'block';
        
        this.showNotification('به اسنپ کابل خوش آمدید!', 'success');
        
        // اعتبارسنجی نقشه
        setTimeout(() => {
            if (this.map) {
                this.map.invalidateSize();
            }
        }, 100);
    }

    selectRideType(type) {
        this.selectedRideType = type;
        
        document.querySelectorAll('.ride-type').forEach(el => {
            el.classList.remove('selected');
        });
        
        document.querySelector(`.ride-type[data-type="${type}"]`)?.classList.add('selected');
        
        this.updatePrice();
        this.updateAvailableDrivers();
    }

    swapLocations() {
        const pickupInput = document.getElementById('pickup');
        const destinationInput = document.getElementById('destination');
        
        if (!pickupInput || !destinationInput) return;
        
        const pickupValue = pickupInput.value;
        const destinationValue = destinationInput.value;
        
        if (!destinationValue) {
            this.showNotification('لطفاً ابتدا مقصد را وارد کنید', 'error');
            return;
        }
        
        pickupInput.value = destinationValue;
        destinationInput.value = pickupValue;
        
        // تعویض مختصات
        const tempCoords = this.selectedPickupCoords;
        this.selectedPickupCoords = this.selectedDestinationCoords;
        this.selectedDestinationCoords = tempCoords;
        
        // تعویض نشانگرها
        if (this.pickupMarker && this.destinationMarker) {
            const tempLatLng = this.pickupMarker.getLatLng();
            this.pickupMarker.setLatLng(this.destinationMarker.getLatLng());
            this.destinationMarker.setLatLng(tempLatLng);
            
            this.pickupMarker.setPopupContent(`<b>مبدا:</b> ${destinationValue}`);
            this.destinationMarker.setPopupContent(`<b>مقصد:</b> ${pickupValue}`);
        }
        
        this.calculateDistanceAndPrice();
        this.showNotification('مبدا و مقصد با موفقیت تعویض شدند', 'info');
    }

    setPickupLocation(name, coords) {
        const pickupInput = document.getElementById('pickup');
        if (pickupInput) {
            pickupInput.value = name;
        }
        
        this.selectedPickupCoords = coords;
        this.updatePickupMarker(name, coords);
        this.calculateDistanceAndPrice();
    }

    setDestinationLocation(name, coords) {
        const destinationInput = document.getElementById('destination');
        if (destinationInput) {
            destinationInput.value = name;
        }
        
        this.selectedDestinationCoords = coords;
        this.updateDestinationMarker(name, coords);
        this.calculateDistanceAndPrice();
    }

    updatePickupMarker(name, coords) {
        if (this.pickupMarker) {
            this.pickupMarker.remove();
        }
        
        this.pickupMarker = L.marker(coords, {
            icon: L.divIcon({
                html: `<div class="pickup-marker">
                        <i class="fas fa-map-pin"></i>
                       </div>`,
                className: 'pickup-marker-icon',
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            })
        }).addTo(this.map).bindPopup(`<b>مبدا:</b> ${name}`);
    }

    updateDestinationMarker(name, coords) {
        if (this.destinationMarker) {
            this.destinationMarker.remove();
        }
        
        this.destinationMarker = L.marker(coords, {
            icon: L.divIcon({
                html: `<div class="destination-marker">
                        <i class="fas fa-flag-checkered"></i>
                       </div>`,
                className: 'destination-marker-icon',
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            })
        }).addTo(this.map).bindPopup(`<b>مقصد:</b> ${name}`);
    }

    calculateDistanceAndPrice() {
        const pickupInput = document.getElementById('pickup');
        const destinationInput = document.getElementById('destination');
        
        if (!pickupInput || !destinationInput) return;
        
        const pickup = pickupInput.value.trim();
        const destination = destinationInput.value.trim();
        
        if (!pickup || !destination) {
            document.getElementById('tripCalculator')?.classList.remove('active');
            return;
        }
        
        // محاسبه مسافت
        this.currentDistance = this.calculateDistance(
            this.selectedPickupCoords || [34.5250, 69.1800],
            this.selectedDestinationCoords || [34.5300, 69.1900]
        );
        
        // نمایش مسافت
        const distanceValue = document.getElementById('distanceValue');
        if (distanceValue) {
            distanceValue.textContent = `${this.currentDistance.toFixed(1)} کیلومتر`;
        }
        
        // فعال کردن ماشین حساب
        document.getElementById('tripCalculator')?.classList.add('active');
        
        // به روزرسانی قیمت
        this.updatePrice();
    }

    calculateDistance(coord1, coord2) {
        if (!coord1 || !coord2) {
            return (Math.random() * 15 + 2).toFixed(1);
        }
        
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
        
        return R * c;
    }

    updatePrice() {
        if (this.currentDistance === 0) return;
        
        const rideType = this.rideOptions[this.selectedRideType];
        if (!rideType) return;
        
        // محاسبه قیمت بر اساس مسافت و زمان
        const distanceCost = this.currentDistance * rideType.perKm;
        const estimatedTime = this.calculateEstimatedTime(this.currentDistance);
        const timeCost = estimatedTime * rideType.perMinute;
        
        let totalPrice = rideType.baseFare + distanceCost + timeCost;
        
        // اعمال حداقل کرایه
        totalPrice = Math.max(totalPrice, rideType.minFare);
        
        // اعمال ضریب ترافیک
        const trafficMultiplier = this.getTrafficMultiplier();
        totalPrice = Math.round(totalPrice * trafficMultiplier);
        
        this.currentPrice = totalPrice;
        
        // نمایش قیمت
        this.updatePriceDisplay(totalPrice, estimatedTime);
    }

    calculateEstimatedTime(distance) {
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const currentTime = `${currentHour}:${currentMinute}`;
        
        let speed = kabulData.trafficData.averageSpeeds.normal;
        
        // بررسی ساعت اوج
        if (this.isPeakHour(currentTime)) {
            speed = kabulData.trafficData.averageSpeeds.peak;
        }
        
        // بررسی مناطق پرترافیک
        const pickup = document.getElementById('pickup')?.value;
        const destination = document.getElementById('destination')?.value;
        
        if (this.isCongestedArea(pickup) || this.isCongestedArea(destination)) {
            speed = Math.min(speed, kabulData.trafficData.averageSpeeds.congested);
        }
        
        return (distance / speed) * 60; // به دقیقه
    }

    isPeakHour(currentTime) {
        return kabulData.trafficData.peakHours.some(peakHour => {
            const [start, end] = peakHour.split('-');
            return currentTime >= start && currentTime <= end;
        });
    }

    isCongestedArea(area) {
        return kabulData.trafficData.congestedAreas.includes(area);
    }

    getTrafficMultiplier() {
        const currentTime = `${new Date().getHours()}:${new Date().getMinutes()}`;
        
        if (this.isPeakHour(currentTime)) {
            return 1.3; // 30% افزایش قیمت در ساعت اوج
        }
        
        return 1.0;
    }

    updatePriceDisplay(price, estimatedTime) {
        const priceElement = document.getElementById('priceValue');
        const timeElement = document.getElementById('timeValue');
        
        if (priceElement) {
            priceElement.textContent = this.formatCurrency(price);
        }
        
        if (timeElement) {
            timeElement.textContent = `${Math.round(estimatedTime)} دقیقه`;
        }
        
        // به روزرسانی قیمت در انواع سفر
        Object.keys(this.rideOptions).forEach(type => {
            const price = this.calculateRidePrice(type);
            const priceElement = document.getElementById(`${type}Price`);
            if (priceElement) {
                priceElement.textContent = this.formatCurrency(price);
            }
        });
    }

    calculateRidePrice(type) {
        const rideType = this.rideOptions[type];
        if (!rideType || this.currentDistance === 0) return '--';
        
        const distanceCost = this.currentDistance * rideType.perKm;
        const estimatedTime = this.calculateEstimatedTime(this.currentDistance);
        const timeCost = estimatedTime * rideType.perMinute;
        
        let totalPrice = rideType.baseFare + distanceCost + timeCost;
        totalPrice = Math.max(totalPrice, rideType.minFare);
        
        const trafficMultiplier = this.getTrafficMultiplier();
        return Math.round(totalPrice * trafficMultiplier);
    }

    requestRide() {
        if (!this.currentUser) {
            this.showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
            this.openAuthModal();
            return;
        }
        
        const pickupInput = document.getElementById('pickup');
        const destinationInput = document.getElementById('destination');
        
        if (!pickupInput || !destinationInput) return;
        
        const pickup = pickupInput.value.trim();
        const destination = destinationInput.value.trim();
        
        if (!pickup || !destination) {
            this.showNotification('لطفاً مبدا و مقصد را وارد کنید', 'error');
            return;
        }
        
        if (pickup === destination) {
            this.showNotification('مبدا و مقصد نمی‌توانند یکسان باشند', 'error');
            return;
        }
        
        // ایجاد سفر جدید
        const tripId = Date.now();
        const trip = {
            id: tripId,
            pickup,
            destination,
            pickup_coords: this.selectedPickupCoords || [34.5250, 69.1800],
            destination_coords: this.selectedDestinationCoords || [34.5300, 69.1900],
            ride_type: this.selectedRideType,
            distance: this.currentDistance,
            price: this.currentPrice,
            status: 'requested',
            user_id: this.currentUser.id,
            user_name: this.currentUser.name,
            payment_method: this.selectedPaymentMethod,
            estimated_time: this.calculateEstimatedTime(this.currentDistance),
            created_at: new Date().toISOString()
        };
        
        this.saveTrip(trip);
        this.currentTripId = tripId;
        
        this.showNotification('سفر شما ثبت شد. در حال یافتن راننده...', 'info');
        this.startDriverSearch();
    }

    startDriverSearch() {
        this.isSearchingDriver = true;
        
        const submitBtn = document.getElementById('submitBtn');
        const searchingOverlay = document.getElementById('searchingOverlay');
        
        if (submitBtn) submitBtn.disabled = true;
        if (searchingOverlay) searchingOverlay.style.display = 'flex';
        
        let searchTime = 0;
        const searchInterval = setInterval(() => {
            searchTime++;
            const searchingText = document.getElementById('searchingText');
            
            if (searchTime <= 3 && searchingText) {
                searchingText.textContent = "در حال جستجوی راننده...";
            } else if (searchTime <= 6 && searchingText) {
                searchingText.textContent = "بررسی موقعیت رانندگان...";
            } else if (searchTime <= 9 && searchingText) {
                searchingText.textContent = "ارسال درخواست به راننده...";
            } else if (searchTime >= 10) {
                clearInterval(searchInterval);
                this.findDriver();
            }
        }, 500);
    }

    findDriver() {
        const searchingOverlay = document.getElementById('searchingOverlay');
        const submitBtn = document.getElementById('submitBtn');
        
        if (searchingOverlay) searchingOverlay.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
        this.isSearchingDriver = false;
        
        const availableDrivers = this.getAvailableDrivers();
        
        if (availableDrivers.length === 0) {
            this.showNotification('هیچ راننده‌ای در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.', 'error');
            return;
        }
        
        // انتخاب بهترین راننده
        const selectedDriver = this.selectBestDriver(availableDrivers);
        this.currentDriver = selectedDriver;
        
        this.showDriverModal(selectedDriver);
        this.showNotification(`راننده ${selectedDriver.name} پیدا شد!`, 'success');
        
        // به روزرسانی وضعیت سفر
        const trip = this.getTripById(this.currentTripId);
        if (trip) {
            trip.driver_id = selectedDriver.id;
            trip.driver_name = selectedDriver.name;
            trip.status = 'confirmed';
            this.saveTrip(trip);
        }
    }

    getAvailableDrivers() {
        const drivers = this.getOnlineDrivers();
        const rideType = this.selectedRideType;
        
        return drivers.filter(driver => {
            // بررسی نوع وسیله نقلیه
            if (rideType === 'bike' && driver.vehicle_type !== 'bike') {
                return false;
            }
            
            // بررسی ظرفیت
            if (driver.available_ride_types && !driver.available_ride_types.includes(rideType)) {
                return false;
            }
            
            // بررسی فاصله (ساده شده)
            const distance = this.calculateDistance(
                this.selectedPickupCoords || [34.5250, 69.1800],
                driver.current_location || [34.5250, 69.1800]
            );
            
            return distance <= 10; // رانندگان در فاصله 10 کیلومتری
        });
    }

    selectBestDriver(drivers) {
        // الگوریتم انتخاب راننده بر اساس امتیاز، فاصله و تعداد سفر
        return drivers.sort((a, b) => {
            // اولویت با امتیاز بالاتر
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            
            // سپس با فاصله کمتر
            const distanceA = this.calculateDistance(
                this.selectedPickupCoords || [34.5250, 69.1800],
                a.current_location || [34.5250, 69.1800]
            );
            
            const distanceB = this.calculateDistance(
                this.selectedPickupCoords || [34.5250, 69.1800],
                b.current_location || [34.5250, 69.1800]
            );
            
            if (distanceA !== distanceB) {
                return distanceA - distanceB;
            }
            
            // سپس با تعداد سفر بیشتر
            return (b.total_trips || 0) - (a.total_trips || 0);
        })[0];
    }

    showDriverModal(driver) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'driverModal';
        
        const eta = this.calculateETA(driver.current_location);
        const distance = this.calculateDistance(
            this.selectedPickupCoords || [34.5250, 69.1800],
            driver.current_location || [34.5250, 69.1800]
        );
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>راننده پیدا شد!</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="driver-info">
                        <div class="driver-avatar">
                            ${driver.name.charAt(0)}
                        </div>
                        <div class="driver-details">
                            <h4>${driver.name}</h4>
                            <div class="driver-rating">
                                <i class="fas fa-star"></i>
                                <span>${driver.rating || 4.5}</span>
                                <span class="driver-trips">(${driver.total_trips || 0} سفر)</span>
                            </div>
                            <div class="driver-vehicle">
                                <i class="fas fa-car"></i>
                                <span>${driver.car_model || '---'} - ${driver.car_color || '---'}</span>
                            </div>
                            <div class="driver-plate">
                                <i class="fas fa-id-card"></i>
                                <span>${driver.plate_number || '---'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="ride-details">
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>زمان رسیدن: ${eta} دقیقه</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-road"></i>
                            <span>فاصله: ${distance.toFixed(1)} کیلومتر</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-money-bill"></i>
                            <span>مبلغ: ${this.formatCurrency(this.currentPrice)}</span>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button id="confirmRide" class="btn-primary">
                            <i class="fas fa-check"></i> تأیید سفر
                        </button>
                        <button id="cancelRide" class="btn-secondary">
                            <i class="fas fa-times"></i> لغو
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // بستن مدال
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        // تأیید سفر
        modal.querySelector('#confirmRide').addEventListener('click', () => {
            this.confirmRide();
            modal.remove();
        });
        
        // لغو سفر
        modal.querySelector('#cancelRide').addEventListener('click', () => {
            this.cancelRideSearch();
            modal.remove();
        });
        
        // بستن با کلیک خارج
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    calculateETA(driverLocation) {
        const distance = this.calculateDistance(
            this.selectedPickupCoords || [34.5250, 69.1800],
            driverLocation || [34.5250, 69.1800]
        );
        
        const speed = kabulData.trafficData.averageSpeeds.normal;
        const time = (distance / speed) * 60; // به دقیقه
        
        return Math.max(3, Math.round(time)); // حداقل 3 دقیقه
    }

    confirmRide() {
        const trip = this.getTripById(this.currentTripId);
        if (trip) {
            trip.status = 'in_progress';
            trip.started_at = new Date().toISOString();
            this.saveTrip(trip);
        }
        
        // نمایش ردیابی زنده
        this.showLiveTracking();
        
        // شروع شبیه‌سازی حرکت
        this.simulateTrip();
        
        this.showNotification('سفر شما شروع شد. راننده به زودی می‌رسد.', 'success');
    }

    cancelRideSearch() {
        const trip = this.getTripById(this.currentTripId);
        if (trip) {
            trip.status = 'cancelled';
            this.saveTrip(trip);
        }
        
        this.showNotification('جستجوی راننده لغو شد', 'warning');
    }

    showLiveTracking() {
        const liveTracking = document.getElementById('liveTracking');
        if (liveTracking) {
            liveTracking.style.display = 'block';
            
            // تنظیم اطلاعات ردیابی
            document.getElementById('trackingDriverName').textContent = this.currentDriver?.name || 'راننده';
            document.getElementById('trackingETA').textContent = this.calculateETA(this.currentDriver?.current_location);
            document.getElementById('trackingDistance').textContent = `${this.currentDistance.toFixed(1)} کیلومتر`;
            
            // رسم مسیر
            this.drawRoute();
        }
    }

    drawRoute() {
        if (!this.map) return;
        
        // پاک کردن مسیر قبلی
        if (this.currentRoute) {
            this.map.removeLayer(this.currentRoute);
        }
        
        // ایجاد نشانگر راننده
        if (this.carMarker) {
            this.map.removeLayer(this.carMarker);
        }
        
        const startCoords = this.selectedPickupCoords || [34.5250, 69.1800];
        const endCoords = this.selectedDestinationCoords || [34.5300, 69.1900];
        
        // ایجاد خط مسیر
        this.currentRoute = L.polyline([startCoords, endCoords], {
            color: '#00D474',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(this.map);
        
        // ایجاد نشانگر خودرو
        const carIcon = L.divIcon({
            html: `<div class="car-marker">🚗</div>`,
            className: 'car-marker-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        
        this.carMarker = L.marker(startCoords, { icon: carIcon }).addTo(this.map);
        
        // تنظیم نمای نقشه
        this.map.fitBounds([startCoords, endCoords], { padding: [50, 50] });
    }

    simulateTrip() {
        if (!this.carMarker || !this.selectedPickupCoords || !this.selectedDestinationCoords) return;
        
        const startCoords = this.selectedPickupCoords;
        const endCoords = this.selectedDestinationCoords;
        const steps = 100;
        
        const latStep = (endCoords[0] - startCoords[0]) / steps;
        const lngStep = (endCoords[1] - startCoords[1]) / steps;
        
        let currentStep = 0;
        
        if (this.carAnimationInterval) {
            clearInterval(this.carAnimationInterval);
        }
        
        this.carAnimationInterval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(this.carAnimationInterval);
                this.completeTrip();
                return;
            }
            
            const newLat = startCoords[0] + (latStep * currentStep);
            const newLng = startCoords[1] + (lngStep * currentStep);
            
            this.carMarker.setLatLng([newLat, newLng]);
            
            // به روزرسانی اطلاعات ردیابی
            this.updateTrackingInfo(currentStep, steps);
            
            currentStep++;
        }, 100);
    }

    updateTrackingInfo(currentStep, totalSteps) {
        const progress = (currentStep / totalSteps) * 100;
        const remainingTime = Math.round((totalSteps - currentStep) * 0.1);
        const remainingDistance = (this.currentDistance * (1 - progress/100)).toFixed(1);
        
        const trackingETA = document.getElementById('trackingETA');
        const trackingDistance = document.getElementById('trackingDistance');
        const trackingProgress = document.getElementById('trackingProgress');
        
        if (trackingETA) trackingETA.textContent = `${remainingTime} دقیقه`;
        if (trackingDistance) trackingDistance.textContent = `${remainingDistance} کیلومتر`;
        if (trackingProgress) trackingProgress.style.width = `${progress}%`;
    }

    completeTrip() {
        const liveTracking = document.getElementById('liveTracking');
        if (liveTracking) {
            liveTracking.style.display = 'none';
        }
        
        const trip = this.getTripById(this.currentTripId);
        if (trip) {
            trip.status = 'completed';
            trip.completed_at = new Date().toISOString();
            this.saveTrip(trip);
        }
        
        // پاک کردن نقشه
        if (this.currentRoute) {
            this.map.removeLayer(this.currentRoute);
            this.currentRoute = null;
        }
        
        if (this.carMarker) {
            this.map.removeLayer(this.carMarker);
            this.carMarker = null;
        }
        
        if (this.pickupMarker) {
            this.map.removeLayer(this.pickupMarker);
            this.pickupMarker = null;
        }
        
        if (this.destinationMarker) {
            this.map.removeLayer(this.destinationMarker);
            this.destinationMarker = null;
        }
        
        // نمایش مدال پرداخت
        this.showPaymentModal();
        
        this.showNotification('سفر شما با موفقیت تکمیل شد!', 'success');
    }

    showPaymentModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'paymentModal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>پرداخت</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="payment-summary">
                        <h4>خلاصه سفر</h4>
                        <div class="summary-item">
                            <span>مسافت:</span>
                            <span>${this.currentDistance.toFixed(1)} کیلومتر</span>
                        </div>
                        <div class="summary-item">
                            <span>زمان سفر:</span>
                            <span>${Math.round(this.calculateEstimatedTime(this.currentDistance))} دقیقه</span>
                        </div>
                        <div class="summary-item">
                            <span>نوع سفر:</span>
                            <span>${this.rideOptions[this.selectedRideType]?.name || 'اقتصادی'}</span>
                        </div>
                        <div class="summary-item total">
                            <span>مبلغ قابل پرداخت:</span>
                            <span class="total-amount">${this.formatCurrency(this.currentPrice)}</span>
                        </div>
                    </div>
                    
                    <div class="payment-methods">
                        <h4>روش پرداخت</h4>
                        <div class="method-option ${this.selectedPaymentMethod === 'cash' ? 'selected' : ''}" data-method="cash">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>پرداخت نقدی</span>
                        </div>
                        <div class="method-option ${this.selectedPaymentMethod === 'wallet' ? 'selected' : ''}" data-method="wallet">
                            <i class="fas fa-wallet"></i>
                            <span>کیف پول (موجودی: ${this.formatCurrency(this.currentUser?.wallet_balance || 0)})</span>
                        </div>
                        <div class="method-option" data-method="card">
                            <i class="fas fa-credit-card"></i>
                            <span>کارت بانکی</span>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button id="payNowBtn" class="btn-primary">
                            <i class="fas fa-check-circle"></i> پرداخت
                        </button>
                        <button id="payLaterBtn" class="btn-secondary">
                            پرداخت بعدی
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // انتخاب روش پرداخت
        modal.querySelectorAll('.method-option').forEach(option => {
            option.addEventListener('click', () => {
                modal.querySelectorAll('.method-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedPaymentMethod = option.dataset.method;
            });
        });
        
        // پرداخت
        modal.querySelector('#payNowBtn').addEventListener('click', () => {
            this.processPayment();
            modal.remove();
        });
        
        // پرداخت بعدی
        modal.querySelector('#payLaterBtn').addEventListener('click', () => {
            modal.remove();
            this.showNotification('مبلغ سفر در صورت پرداخت نقدی به راننده پرداخت شود.', 'info');
        });
        
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

    processPayment() {
        if (!this.currentUser) return;
        
        if (this.selectedPaymentMethod === 'wallet') {
            if (this.currentUser.wallet_balance >= this.currentPrice) {
                // کسر از کیف پول
                this.currentUser.wallet_balance -= this.currentPrice;
                this.saveUser(this.currentUser);
                
                // ثبت تراکنش
                this.recordWalletTransaction({
                    user_id: this.currentUser.id,
                    amount: -this.currentPrice,
                    type: 'payment',
                    description: `پرداخت سفر #${this.currentTripId}`
                });
                
                this.showNotification(`پرداخت ${this.formatCurrency(this.currentPrice)} از کیف پول انجام شد`, 'success');
            } else {
                this.showNotification('موجودی کیف پول کافی نیست', 'error');
                this.showWalletChargeModal();
                return;
            }
        } else if (this.selectedPaymentMethod === 'card') {
            this.showNotification('درگاه پرداخت بانکی به زودی فعال خواهد شد', 'info');
        }
        
        // به روزرسانی وضعیت سفر
        const trip = this.getTripById(this.currentTripId);
        if (trip) {
            trip.payment_method = this.selectedPaymentMethod;
            trip.payment_status = 'paid';
            this.saveTrip(trip);
        }
        
        // نمایش مدال امتیازدهی
        this.showRatingModal();
    }

    showRatingModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'ratingModal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>امتیازدهی</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <p>لطفاً به راننده ${this.currentDriver?.name || '---'} امتیاز دهید:</p>
                    
                    <div class="rating-stars">
                        ${[1,2,3,4,5].map(i => `
                            <i class="far fa-star" data-rating="${i}"></i>
                        `).join('')}
                    </div>
                    
                    <textarea id="ratingComment" placeholder="نظر خود را بنویسید (اختیاری)" rows="3"></textarea>
                    
                    <div class="modal-actions">
                        <button id="submitRating" class="btn-primary">
                            ثبت امتیاز
                        </button>
                        <button id="skipRating" class="btn-secondary">
                            بعداً
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        let selectedRating = 0;
        const stars = modal.querySelectorAll('.fa-star');
        
        stars.forEach(star => {
            star.addEventListener('mouseover', (e) => {
                const rating = parseInt(e.target.dataset.rating);
                this.highlightStars(stars, rating);
            });
            
            star.addEventListener('click', (e) => {
                selectedRating = parseInt(e.target.dataset.rating);
                this.highlightStars(stars, selectedRating);
            });
        });
        
        modal.querySelector('.rating-stars').addEventListener('mouseleave', () => {
            this.highlightStars(stars, selectedRating);
        });
        
        modal.querySelector('#submitRating').addEventListener('click', () => {
            if (selectedRating === 0) {
                this.showNotification('لطفاً امتیاز انتخاب کنید', 'error');
                return;
            }
            
            this.submitRating(selectedRating, modal.querySelector('#ratingComment').value);
            modal.remove();
        });
        
        modal.querySelector('#skipRating').addEventListener('click', () => {
            modal.remove();
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

    highlightStars(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('far');
                star.classList.add('fas', 'active');
            } else {
                star.classList.remove('fas', 'active');
                star.classList.add('far');
            }
        });
    }

    submitRating(rating, comment) {
        const trip = this.getTripById(this.currentTripId);
        if (trip) {
            trip.rating = rating;
            trip.rating_comment = comment;
            trip.rated = true;
            this.saveTrip(trip);
        }
        
        // به روزرسانی امتیاز راننده
        if (this.currentDriver) {
            const driver = this.getUserById(this.currentDriver.id);
            if (driver) {
                const totalRatings = driver.total_ratings || 0;
                const currentRating = driver.rating || 0;
                const newRating = ((currentRating * totalRatings) + rating) / (totalRatings + 1);
                
                driver.rating = parseFloat(newRating.toFixed(1));
                driver.total_ratings = (driver.total_ratings || 0) + 1;
                this.saveUser(driver);
            }
        }
        
        this.showNotification('امتیاز شما ثبت شد. سپاس!', 'success');
    }

    // مدیریت احراز هویت
    checkUserLoginStatus() {
        const savedUser = localStorage.getItem('kabul_snapp_current_user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                this.currentUser = userData;
                this.isAdmin = userData.role === 'admin';
                this.updateUIAfterLogin();
            } catch (error) {
                console.error('Error loading user:', error);
                localStorage.removeItem('kabul_snapp_current_user');
            }
        }
    }

    login() {
        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;
        
        if (!email || !password) {
            this.showNotification('لطفاً ایمیل/شماره تماس و رمز عبور را وارد کنید', 'error');
            return;
        }
        
        const user = this.getUserByCredentials(email, password);
        
        if (!user) {
            this.showNotification('ایمیل/شماره تماس یا رمز عبور اشتباه است', 'error');
            return;
        }
        
        if (user.status !== 'approved') {
            this.showNotification('حساب کاربری شما هنوز تایید نشده است', 'error');
            return;
        }
        
        this.currentUser = user;
        this.isAdmin = user.role === 'admin';
        
        localStorage.setItem('kabul_snapp_current_user', JSON.stringify(user));
        
        this.showNotification(`خوش آمدید ${user.name}`, 'success');
        this.closeAuthModal();
        this.updateUIAfterLogin();
    }

    register() {
        const formData = new FormData(document.getElementById('registerForm'));
        const userData = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            role: formData.get('role'),
            status: 'pending',
            created_at: new Date().toISOString(),
            wallet_balance: 0,
            rating: 0
        };
        
        // اعتبارسنجی
        if (!this.validateRegistration(userData)) {
            return;
        }
        
        // بررسی تکراری نبودن
        if (this.isUserExists(userData.email, userData.phone)) {
            this.showNotification('این ایمیل یا شماره تماس قبلاً ثبت شده است', 'error');
            return;
        }
        
        // ذخیره کاربر
        this.saveUser(userData);
        
        this.showNotification('ثبت‌نام با موفقیت انجام شد. پس از تأیید مدیر، حساب شما فعال خواهد شد.', 'success');
        
        // بازگشت به صفحه ورود
        document.querySelector('.form-tab[data-tab="login"]')?.click();
        document.getElementById('registerForm')?.reset();
    }

    validateRegistration(userData) {
        const errors = [];
        
        if (!userData.name || userData.name.length < 2) {
            errors.push('نام باید حداقل ۲ حرف داشته باشد');
        }
        
        if (!userData.email || !userData.email.includes('@')) {
            errors.push('ایمیل معتبر وارد کنید');
        }
        
        if (!userData.phone || userData.phone.length < 10) {
            errors.push('شماره تماس معتبر وارد کنید');
        }
        
        if (!userData.password || userData.password.length < 6) {
            errors.push('رمز عبور باید حداقل ۶ حرف داشته باشد');
        }
        
        if (errors.length > 0) {
            this.showNotification(errors.join('، '), 'error');
            return false;
        }
        
        return true;
    }

    isUserExists(email, phone) {
        const users = this.getStorage('users');
        return users.some(u => u.email === email || u.phone === phone);
    }

    logout() {
        if (this.currentUser?.role === 'driver') {
            // تغییر وضعیت راننده به آفلاین
            this.currentUser.online_status = 'offline';
            this.saveUser(this.currentUser);
        }
        
        this.currentUser = null;
        this.isAdmin = false;
        localStorage.removeItem('kabul_snapp_current_user');
        
        this.updateUIAfterLogout();
        this.showNotification('با موفقیت خارج شدید', 'success');
    }

    updateUIAfterLogin() {
        // به روزرسانی نوار ناوبری
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userProfile = document.getElementById('userProfile');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userProfile) userProfile.style.display = 'flex';
        
        if (userAvatar && this.currentUser) {
            userAvatar.textContent = this.currentUser.name.charAt(0);
        }
        if (userName && this.currentUser) {
            userName.textContent = this.currentUser.name;
        }
        
        // نمایش لینک مدیریت برای ادمین
        if (this.isAdmin) {
            const adminLinks = document.querySelectorAll('.admin-link');
            adminLinks.forEach(link => link.style.display = 'block');
        }
        
        // به روزرسانی صفحه پروفایل
        this.updateProfilePage();
    }

    updateUIAfterLogout() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userProfile = document.getElementById('userProfile');
        
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userProfile) userProfile.style.display = 'none';
        
        // پنهان کردن لینک‌های ادمین
        const adminLinks = document.querySelectorAll('.admin-link');
        adminLinks.forEach(link => link.style.display = 'none');
        
        // بازگشت به صفحه اصلی
        this.navigateTo('home');
    }

    openAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'flex';
            document.getElementById('loginEmail')?.focus();
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // ناوبری
    navigateTo(pageId) {
        // پنهان کردن همه صفحات
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // نمایش صفحه مورد نظر
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // بارگذاری محتوای صفحه
            switch(pageId) {
                case 'profile':
                    this.loadProfilePage();
                    break;
                case 'trips':
                    this.loadTripsPage();
                    break;
                case 'discounts':
                    this.loadDiscountsPage();
                    break;
                case 'admin':
                    this.loadAdminPage();
                    break;
                case 'support':
                    this.loadSupportPage();
                    break;
                case 'wallet':
                    this.loadWalletPage();
                    break;
            }
        }
        
        // بستن منوی موبایل
        this.closeMobileMenu();
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.style.display = 'none';
        }
    }

    // صفحه پروفایل
    loadProfilePage() {
        if (!this.currentUser) return;
        
        const profilePage = document.getElementById('profile-page');
        if (!profilePage) return;
        
        profilePage.innerHTML = `
            <div class="profile-container">
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${this.currentUser.name.charAt(0)}
                    </div>
                    <div class="profile-info">
                        <h2>${this.currentUser.name}</h2>
                        <p class="profile-email">${this.currentUser.email}</p>
                        <p class="profile-phone">${this.currentUser.phone}</p>
                        <span class="profile-badge ${this.currentUser.role}">
                            ${this.currentUser.role === 'passenger' ? 'مسافر' : 'راننده'}
                        </span>
                    </div>
                </div>
                
                <div class="profile-stats">
                    <div class="stat-card">
                        <div class="stat-value">${this.getUserTrips(this.currentUser.id).length}</div>
                        <div class="stat-label">تعداد سفرها</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.formatCurrency(this.getTotalSpent())}</div>
                        <div class="stat-label">کل هزینه‌ها</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.currentUser.rating || '--'}</div>
                        <div class="stat-label">امتیاز</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.formatCurrency(this.currentUser.wallet_balance || 0)}</div>
                        <div class="stat-label">موجودی</div>
                    </div>
                </div>
                
                ${this.currentUser.role === 'driver' ? this.renderDriverProfile() : ''}
                
                <div class="profile-actions">
                    <button class="btn-primary" onclick="snapp.editProfile()">
                        <i class="fas fa-edit"></i> ویرایش پروفایل
                    </button>
                    <button class="btn-secondary" onclick="snapp.showSettings()">
                        <i class="fas fa-cog"></i> تنظیمات
                    </button>
                </div>
            </div>
        `;
    }

    getTotalSpent() {
        const trips = this.getUserTrips(this.currentUser.id);
        return trips
            .filter(t => t.status === 'completed')
            .reduce((sum, trip) => sum + (trip.price || 0), 0);
    }

    renderDriverProfile() {
        return `
            <div class="driver-profile">
                <h3>اطلاعات راننده</h3>
                <div class="driver-details">
                    <div class="detail-item">
                        <span>نوع وسیله:</span>
                        <span>${this.currentUser.vehicle_type === 'car' ? 'خودرو' : 'موتور'}</span>
                    </div>
                    <div class="detail-item">
                        <span>مدل:</span>
                        <span>${this.currentUser.car_model || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <span>پلاک:</span>
                        <span>${this.currentUser.plate_number || '---'}</span>
                    </div>
                    <div class="detail-item">
                        <span>وضعیت:</span>
                        <span class="status-badge ${this.currentUser.online_status === 'online' ? 'active' : 'inactive'}">
                            ${this.currentUser.online_status === 'online' ? 'آنلاین' : 'آفلاین'}
                        </span>
                    </div>
                </div>
                
                <div class="driver-actions">
                    <button class="btn-${this.currentUser.online_status === 'online' ? 'secondary' : 'primary'}" 
                            onclick="snapp.toggleDriverStatus()">
                        <i class="fas fa-${this.currentUser.online_status === 'online' ? 'toggle-on' : 'toggle-off'}"></i>
                        ${this.currentUser.online_status === 'online' ? 'آفلاین شو' : 'آنلاین شو'}
                    </button>
                </div>
            </div>
        `;
    }

    toggleDriverStatus() {
        if (!this.currentUser || this.currentUser.role !== 'driver') return;
        
        this.currentUser.online_status = this.currentUser.online_status === 'online' ? 'offline' : 'online';
        this.saveUser(this.currentUser);
        localStorage.setItem('kabul_snapp_current_user', JSON.stringify(this.currentUser));
        
        const status = this.currentUser.online_status === 'online' ? 'آنلاین' : 'آفلاین';
        this.showNotification(`وضعیت شما به ${status} تغییر کرد`, 'success');
        
        this.loadProfilePage();
    }

    // صفحه سفرها
    loadTripsPage() {
        if (!this.currentUser) return;
        
        const tripsPage = document.getElementById('trips-page');
        if (!tripsPage) return;
        
        const trips = this.getUserTrips(this.currentUser.id);
        
        tripsPage.innerHTML = `
            <div class="trips-container">
                <h2>سفرهای من</h2>
                
                ${trips.length === 0 ? `
                    <div class="empty-state">
                        <i class="fas fa-road"></i>
                        <p>هیچ سفری یافت نشد</p>
                    </div>
                ` : `
                    <div class="trips-list">
                        ${trips.map(trip => this.renderTripCard(trip)).join('')}
                    </div>
                `}
            </div>
        `;
    }

    renderTripCard(trip) {
        const date = this.formatDate(trip.created_at);
        const statusClass = `status-${trip.status}`;
        const statusText = this.getStatusText(trip.status);
        const rideType = this.rideOptions[trip.ride_type]?.name || 'اقتصادی';
        
        return `
            <div class="trip-card">
                <div class="trip-header">
                    <span class="trip-date">${date}</span>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                
                <div class="trip-details">
                    <div class="trip-locations">
                        <div class="location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${trip.pickup}</span>
                        </div>
                        <div class="location">
                            <i class="fas fa-flag-checkered"></i>
                            <span>${trip.destination}</span>
                        </div>
                    </div>
                    
                    <div class="trip-info">
                        <div class="info-item">
                            <span>نوع:</span>
                            <span>${rideType}</span>
                        </div>
                        <div class="info-item">
                            <span>مسافت:</span>
                            <span>${trip.distance ? trip.distance.toFixed(1) : '--'} کیلومتر</span>
                        </div>
                        <div class="info-item">
                            <span>مبلغ:</span>
                            <span>${this.formatCurrency(trip.price || 0)}</span>
                        </div>
                    </div>
                    
                    ${trip.driver_name ? `
                        <div class="trip-driver">
                            <i class="fas fa-user"></i>
                            <span>${trip.driver_name}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="trip-actions">
                    ${trip.status === 'completed' && !trip.rated ? `
                        <button class="btn-primary" onclick="snapp.rateTrip(${trip.id})">
                            امتیازدهی
                        </button>
                    ` : ''}
                    
                    ${trip.status === 'completed' ? `
                        <button class="btn-secondary" onclick="snapp.viewTripDetails(${trip.id})">
                            جزئیات
                        </button>
                    ` : ''}
                    
                    ${trip.status === 'requested' || trip.status === 'confirmed' ? `
                        <button class="btn-danger" onclick="snapp.cancelTrip(${trip.id})">
                            لغو سفر
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statuses = {
            requested: 'در انتظار راننده',
            confirmed: 'تأیید شده',
            in_progress: 'در حال انجام',
            completed: 'تکمیل شده',
            cancelled: 'لغو شده'
        };
        
        return statuses[status] || status;
    }

    // صفحه تخفیف‌ها
    loadDiscountsPage() {
        const discounts = this.getValidDiscounts();
        
        const discountsPage = document.getElementById('discounts-page');
        if (!discountsPage) return;
        
        discountsPage.innerHTML = `
            <div class="discounts-container">
                <h2>تخفیف‌ها</h2>
                
                ${discounts.length === 0 ? `
                    <div class="empty-state">
                        <i class="fas fa-tag"></i>
                        <p>هیچ تخفیف فعالی موجود نیست</p>
                    </div>
                ` : `
                    <div class="discounts-grid">
                        ${discounts.map(discount => this.renderDiscountCard(discount)).join('')}
                    </div>
                `}
            </div>
        `;
    }

    renderDiscountCard(discount) {
        const expiryDate = this.formatDate(discount.expiry_date);
        const progress = (discount.used_count / discount.max_uses) * 100;
        
        return `
            <div class="discount-card">
                <div class="discount-header">
                    <div class="discount-code">${discount.code}</div>
                    <div class="discount-percent">${discount.percent}%</div>
                </div>
                
                <div class="discount-body">
                    <p class="discount-description">${discount.description}</p>
                    
                    <div class="discount-details">
                        <div class="detail">
                            <i class="fas fa-calendar"></i>
                            <span>تا ${expiryDate}</span>
                        </div>
                        <div class="detail">
                            <i class="fas fa-users"></i>
                            <span>${discount.used_count} از ${discount.max_uses}</span>
                        </div>
                        ${discount.min_order > 0 ? `
                            <div class="detail">
                                <i class="fas fa-money-bill"></i>
                                <span>حداقل ${this.formatCurrency(discount.min_order)}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="discount-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-text">
                            <span>${discount.used_count}</span>
                            <span>${discount.max_uses}</span>
                        </div>
                    </div>
                </div>
                
                <div class="discount-actions">
                    <button class="btn-primary" onclick="snapp.copyDiscountCode('${discount.code}')">
                        <i class="fas fa-copy"></i> کپی کد
                    </button>
                </div>
            </div>
        `;
    }

    copyDiscountCode(code) {
        navigator.clipboard.writeText(code).then(() => {
            this.showNotification(`کد ${code} کپی شد`, 'success');
        });
    }

    // صفحه مدیریت
    loadAdminPage() {
        if (!this.isAdmin) {
            this.showNotification('دسترسی به پنل مدیریت ندارید', 'error');
            this.navigateTo('home');
            return;
        }
        
        const adminPage = document.getElementById('admin-page');
        if (!adminPage) return;
        
        const stats = this.getAdminStats();
        
        adminPage.innerHTML = `
            <div class="admin-container">
                <h2>پنل مدیریت</h2>
                
                <div class="admin-stats">
                    <div class="stat-card admin">
                        <div class="stat-value">${stats.totalUsers}</div>
                        <div class="stat-label">کاربران</div>
                    </div>
                    <div class="stat-card admin">
                        <div class="stat-value">${stats.totalDrivers}</div>
                        <div class="stat-label">رانندگان</div>
                    </div>
                    <div class="stat-card admin">
                        <div class="stat-value">${stats.totalTrips}</div>
                        <div class="stat-label">سفرها</div>
                    </div>
                    <div class="stat-card admin">
                        <div class="stat-value">${this.formatCurrency(stats.totalRevenue)}</div>
                        <div class="stat-label">درآمد</div>
                    </div>
                </div>
                
                <div class="admin-sections">
                    <div class="admin-section">
                        <h3>کاربران در انتظار تأیید</h3>
                        <div id="pendingUsersList">
                            ${this.renderPendingUsers()}
                        </div>
                    </div>
                    
                    <div class="admin-section">
                        <h3>سفرهای امروز</h3>
                        <div id="todayTrips">
                            ${this.renderTodayTrips()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getAdminStats() {
        const users = this.getStorage('users');
        const trips = this.getStorage('trips');
        const today = new Date().toDateString();
        
        return {
            totalUsers: users.length,
            totalDrivers: users.filter(u => u.role === 'driver').length,
            totalTrips: trips.length,
            totalRevenue: trips
                .filter(t => t.status === 'completed')
                .reduce((sum, t) => sum + (t.price || 0), 0),
            todayTrips: trips.filter(t => 
                new Date(t.created_at).toDateString() === today
            ).length
        };
    }

    renderPendingUsers() {
        const users = this.getStorage('users');
        const pendingUsers = users.filter(u => u.status === 'pending');
        
        if (pendingUsers.length === 0) {
            return '<p class="empty">هیچ کاربری در انتظار تأیید نیست</p>';
        }
        
        return `
            <div class="admin-list">
                ${pendingUsers.map(user => `
                    <div class="admin-list-item">
                        <div class="item-info">
                            <strong>${user.name}</strong>
                            <span>${user.role === 'passenger' ? 'مسافر' : 'راننده'}</span>
                        </div>
                        <div class="item-actions">
                            <button class="btn-approve" onclick="snapp.approveUser(${user.id})">
                                تأیید
                            </button>
                            <button class="btn-reject" onclick="snapp.rejectUser(${user.id})">
                                رد
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderTodayTrips() {
        const trips = this.getStorage('trips');
        const today = new Date().toDateString();
        const todayTrips = trips.filter(t => 
            new Date(t.created_at).toDateString() === today
        );
        
        if (todayTrips.length === 0) {
            return '<p class="empty">هیچ سفری امروز ثبت نشده است</p>';
        }
        
        return `
            <div class="trips-summary">
                ${todayTrips.slice(0, 5).map(trip => `
                    <div class="trip-summary">
                        <span>${trip.user_name} → ${trip.destination}</span>
                        <span>${this.formatCurrency(trip.price)}</span>
                    </div>
                `).join('')}
                ${todayTrips.length > 5 ? `
                    <p class="more-trips">+ ${todayTrips.length - 5} سفر دیگر</p>
                ` : ''}
            </div>
        `;
    }

    approveUser(userId) {
        const user = this.getUserById(userId);
        if (user) {
            user.status = 'approved';
            this.saveUser(user);
            this.showNotification(`کاربر ${user.name} تأیید شد`, 'success');
            this.loadAdminPage();
        }
    }

    rejectUser(userId) {
        const user = this.getUserById(userId);
        if (user) {
            user.status = 'rejected';
            this.saveUser(user);
            this.showNotification(`کاربر ${user.name} رد شد`, 'warning');
            this.loadAdminPage();
        }
    }

    // صفحه کیف پول
    loadWalletPage() {
        if (!this.currentUser) return;
        
        const walletPage = document.getElementById('wallet-page');
        if (!walletPage) return;
        
        const transactions = this.getWalletTransactions(this.currentUser.id);
        
        walletPage.innerHTML = `
            <div class="wallet-container">
                <div class="wallet-balance">
                    <h3>موجودی کیف پول</h3>
                    <div class="balance-amount">
                        ${this.formatCurrency(this.currentUser.wallet_balance || 0)}
                    </div>
                </div>
                
                <div class="wallet-actions">
                    <button class="btn-primary" onclick="snapp.showChargeModal()">
                        <i class="fas fa-plus-circle"></i> افزایش موجودی
                    </button>
                    <button class="btn-secondary" onclick="snapp.showWithdrawModal()">
                        <i class="fas fa-minus-circle"></i> برداشت
                    </button>
                </div>
                
                <div class="transactions-list">
                    <h4>تراکنش‌ها</h4>
                    
                    ${transactions.length === 0 ? `
                        <div class="empty-state">
                            <i class="fas fa-exchange-alt"></i>
                            <p>هیچ تراکنشی یافت نشد</p>
                        </div>
                    ` : `
                        <div class="transactions">
                            ${transactions.map(t => this.renderTransaction(t)).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    getWalletTransactions(userId) {
        const transactions = this.getStorage('walletTransactions');
        return transactions
            .filter(t => t.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    renderTransaction(transaction) {
        const date = this.formatDateTime(transaction.created_at);
        const amountClass = transaction.amount >= 0 ? 'positive' : 'negative';
        const typeText = this.getTransactionTypeText(transaction.type);
        
        return `
            <div class="transaction-item">
                <div class="transaction-header">
                    <span class="transaction-type">${typeText}</span>
                    <span class="transaction-amount ${amountClass}">
                        ${transaction.amount >= 0 ? '+' : ''}${this.formatCurrency(transaction.amount)}
                    </span>
                </div>
                <div class="transaction-details">
                    <span class="transaction-date">${date}</span>
                    <span class="transaction-description">${transaction.description}</span>
                </div>
            </div>
        `;
    }

    getTransactionTypeText(type) {
        const types = {
            deposit: 'شارژ',
            withdrawal: 'برداشت',
            payment: 'پرداخت سفر',
            refund: 'بازگشت وجه',
            bonus: 'جایزه'
        };
        
        return types[type] || type;
    }

    showChargeModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'chargeModal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>افزایش موجودی کیف پول</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="amount-options">
                        ${[5000, 10000, 20000, 50000].map(amount => `
                            <button class="amount-option" data-amount="${amount}">
                                ${this.formatCurrency(amount)}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="custom-amount">
                        <input type="number" id="customAmount" placeholder="مبلغ دلخواه" min="1000" step="1000">
                    </div>
                    
                    <div class="modal-actions">
                        <button id="confirmCharge" class="btn-primary">
                            پرداخت
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // انتخاب مبلغ
        modal.querySelectorAll('.amount-option').forEach(option => {
            option.addEventListener('click', (e) => {
                modal.querySelectorAll('.amount-option').forEach(o => o.classList.remove('selected'));
                e.target.classList.add('selected');
                document.getElementById('customAmount').value = e.target.dataset.amount;
            });
        });
        
        // پرداخت
        modal.querySelector('#confirmCharge').addEventListener('click', () => {
            const amount = parseInt(document.getElementById('customAmount').value);
            
            if (!amount || amount < 1000) {
                this.showNotification('مبلغ باید حداقل ۱,۰۰۰ افغانی باشد', 'error');
                return;
            }
            
            this.chargeWallet(amount);
            modal.remove();
        });
        
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

    chargeWallet(amount) {
        if (!this.currentUser) return;
        
        this.currentUser.wallet_balance = (this.currentUser.wallet_balance || 0) + amount;
        this.saveUser(this.currentUser);
        
        // ثبت تراکنش
        this.recordWalletTransaction({
            user_id: this.currentUser.id,
            amount: amount,
            type: 'deposit',
            description: 'شارژ کیف پول'
        });
        
        this.showNotification(`موجودی کیف پول ${this.formatCurrency(amount)} افزایش یافت`, 'success');
        this.loadWalletPage();
    }

    recordWalletTransaction(transaction) {
        const transactions = this.getStorage('walletTransactions');
        transactions.push({
            id: Date.now(),
            ...transaction,
            created_at: new Date().toISOString(),
            status: 'completed'
        });
        
        this.setStorage('walletTransactions', transactions);
    }

    // صفحه پشتیبانی
    loadSupportPage() {
        const supportPage = document.getElementById('support-page');
        if (!supportPage) return;
        
        supportPage.innerHTML = `
            <div class="support-container">
                <h2>پشتیبانی</h2>
                
                <div class="support-categories">
                    <div class="category-card" onclick="snapp.showSupportForm('technical')">
                        <i class="fas fa-tools"></i>
                        <span>مشکلات فنی</span>
                    </div>
                    <div class="category-card" onclick="snapp.showSupportForm('payment')">
                        <i class="fas fa-money-bill"></i>
                        <span>مشکلات پرداخت</span>
                    </div>
                    <div class="category-card" onclick="snapp.showSupportForm('driver')">
                        <i class="fas fa-user"></i>
                        <span>مشکل با راننده</span>
                    </div>
                    <div class="category-card" onclick="snapp.showSupportForm('other')">
                        <i class="fas fa-question-circle"></i>
                        <span>سایر</span>
                    </div>
                </div>
                
                <div class="support-form" id="supportForm" style="display: none;">
                    <h3 id="supportFormTitle"></h3>
                    <form id="supportTicketForm">
                        <input type="hidden" id="supportCategory">
                        <textarea id="supportMessage" placeholder="پیام خود را بنویسید..." rows="5"></textarea>
                        <button type="submit" class="btn-primary">
                            ارسال پیام
                        </button>
                    </form>
                </div>
                
                <div class="support-tickets" id="supportTickets">
                    <h3>پیام‌های شما</h3>
                    <div id="ticketsList"></div>
                </div>
            </div>
        `;
        
        this.loadSupportTickets();
    }

    showSupportForm(category) {
        const form = document.getElementById('supportForm');
        const title = document.getElementById('supportFormTitle');
        const categoryInput = document.getElementById('supportCategory');
        
        if (form && title && categoryInput) {
            form.style.display = 'block';
            categoryInput.value = category;
            
            const titles = {
                technical: 'گزارش مشکل فنی',
                payment: 'گزارش مشکل پرداخت',
                driver: 'گزارش مشکل با راننده',
                other: 'سایر موارد'
            };
            
            title.textContent = titles[category] || 'ارسال پیام به پشتیبانی';
            
            // اسکرول به فرم
            form.scrollIntoView({ behavior: 'smooth' });
        }
        
        // ارسال فرم
        document.getElementById('supportTicketForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitSupportTicket();
        });
    }

    submitSupportTicket() {
        if (!this.currentUser) {
            this.showNotification('لطفاً ابتدا وارد حساب کاربری خود شوید', 'error');
            return;
        }
        
        const category = document.getElementById('supportCategory')?.value;
        const message = document.getElementById('supportMessage')?.value.trim();
        
        if (!message) {
            this.showNotification('لطفاً پیام خود را بنویسید', 'error');
            return;
        }
        
        const ticket = {
            id: Date.now(),
            user_id: this.currentUser.id,
            user_name: this.currentUser.name,
            category: category,
            message: message,
            status: 'pending',
            created_at: new Date().toISOString()
        };
        
        const tickets = this.getStorage('supportTickets');
        tickets.push(ticket);
        this.setStorage('supportTickets', tickets);
        
        this.showNotification('پیام شما با موفقیت ارسال شد', 'success');
        document.getElementById('supportMessage').value = '';
        document.getElementById('supportForm').style.display = 'none';
        
        this.loadSupportTickets();
    }

    loadSupportTickets() {
        if (!this.currentUser) return;
        
        const ticketsList = document.getElementById('ticketsList');
        if (!ticketsList) return;
        
        const tickets = this.getStorage('supportTickets')
            .filter(t => t.user_id === this.currentUser.id)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        if (tickets.length === 0) {
            ticketsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <p>هیچ پیامی یافت نشد</p>
                </div>
            `;
            return;
        }
        
        ticketsList.innerHTML = tickets.map(ticket => `
            <div class="ticket-item status-${ticket.status}">
                <div class="ticket-header">
                    <span class="ticket-category">${this.getSupportCategoryText(ticket.category)}</span>
                    <span class="ticket-date">${this.formatDate(ticket.created_at)}</span>
                </div>
                <div class="ticket-message">
                    ${ticket.message}
                </div>
                ${ticket.reply ? `
                    <div class="ticket-reply">
                        <strong>پاسخ پشتیبانی:</strong>
                        <p>${ticket.reply}</p>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    getSupportCategoryText(category) {
        const categories = {
            technical: 'مشکل فنی',
            payment: 'مشکل پرداخت',
            driver: 'مشکل راننده',
            other: 'سایر'
        };
        
        return categories[category] || category;
    }

    // مکان‌های محبوب
    loadPopularLocations() {
        const container = document.getElementById('popularLocations');
        if (!container) return;
        
        const popular = kabulData.locations.slice(0, 6);
        
        container.innerHTML = popular.map(location => `
            <div class="location-card" onclick="snapp.setDestinationLocation('${location.name}', [${location.coordinates}])">
                <div class="location-icon">
                    <i class="fas fa-${this.getLocationIconName(location.type)}"></i>
                </div>
                <div class="location-info">
                    <div class="location-name">${location.name}</div>
                    <div class="location-type">${this.getLocationTypeText(location.type)}</div>
                </div>
            </div>
        `).join('');
    }

    getLocationIconName(type) {
        const icons = {
            airport: 'plane',
            commercial: 'store',
            residential: 'home',
            embassy: 'flag',
            government: 'university',
            shopping: 'shopping-cart',
            education: 'graduation-cap',
            hospital: 'hospital',
            hotel: 'bed',
            restaurant: 'utensils'
        };
        
        return icons[type] || 'map-marker-alt';
    }

    searchLocations(query) {
        if (!query) {
            this.addLocationMarkers();
            return;
        }
        
        const filteredLocations = kabulData.locations.filter(location =>
            location.name.includes(query) ||
            location.type.includes(query)
        );
        
        // پاک کردن نشانگرهای قبلی
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
        
        // اضافه کردن نشانگرهای جدید
        filteredLocations.forEach(location => {
            const icon = this.getLocationIcon(location.type);
            
            const marker = L.marker(location.coordinates, { icon })
                .addTo(this.map)
                .bindPopup(this.createLocationPopup(location))
                .on('click', () => {
                    this.handleLocationClick(location);
                });
            
            this.markers.push(marker);
        });
        
        // تغییر نمای نقشه اگر نتایج وجود دارد
        if (filteredLocations.length > 0) {
            const bounds = L.latLngBounds(filteredLocations.map(l => l.coordinates));
            this.map.fitBounds(bounds);
        }
    }

    filterLocations(type) {
        if (type === 'all') {
            this.addLocationMarkers();
            return;
        }
        
        const filteredLocations = kabulData.locations.filter(location => 
            location.type === type
        );
        
        // پاک کردن نشانگرهای قبلی
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
        
        // اضافه کردن نشانگرهای جدید
        filteredLocations.forEach(location => {
            const icon = this.getLocationIcon(location.type);
            
            const marker = L.marker(location.coordinates, { icon })
                .addTo(this.map)
                .bindPopup(this.createLocationPopup(location))
                .on('click', () => {
                    this.handleLocationClick(location);
                });
            
            this.markers.push(marker);
        });
    }

    handleLocationClick(location) {
        this.openLocationSelectionModal(location.coordinates[0], location.coordinates[1], location.name);
    }

    openLocationSelectionModal(lat, lng, locationName = null) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'locationSelectionModal';
        
        const name = locationName || `(${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${name}</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="location-options">
                        <button class="btn-primary" id="setAsPickup">
                            <i class="fas fa-map-pin"></i> انتخاب به عنوان مبدا
                        </button>
                        <button class="btn-primary" id="setAsDestination">
                            <i class="fas fa-flag-checkered"></i> انتخاب به عنوان مقصد
                        </button>
                    </div>
                    
                    <div class="location-name-input">
                        <input type="text" id="customLocationName" placeholder="نام دلخواه برای این مکان">
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // انتخاب مبدا
        modal.querySelector('#setAsPickup').addEventListener('click', () => {
            const customName = document.getElementById('customLocationName').value.trim();
            const finalName = customName || name;
            
            this.setPickupLocation(finalName, [lat, lng]);
            modal.remove();
            this.showNotification(`مبدا به "${finalName}" تنظیم شد`, 'success');
        });
        
        // انتخاب مقصد
        modal.querySelector('#setAsDestination').addEventListener('click', () => {
            const customName = document.getElementById('customLocationName').value.trim();
            const finalName = customName || name;
            
            this.setDestinationLocation(finalName, [lat, lng]);
            modal.remove();
            this.showNotification(`مقصد به "${finalName}" تنظیم شد`, 'success');
        });
        
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

    loadOnlineDrivers() {
        this.drivers = this.getOnlineDrivers();
        
        // به روزرسانی نمایش رانندگان
        this.updateDriversOnMap();
    }

    updateDriversOnMap() {
        if (!this.map) return;
        
        // حذف نشانگرهای رانندگان قبلی
        document.querySelectorAll('.driver-marker').forEach(marker => {
            marker.remove();
        });
        
        // اضافه کردن نشانگرهای رانندگان جدید
        this.drivers.forEach(driver => {
            if (driver.current_location) {
                const icon = L.divIcon({
                    html: `<div class="driver-marker">
                            ${driver.vehicle_type === 'bike' ? '🏍️' : '🚗'}
                           </div>`,
                    className: 'driver-marker-icon',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });
                
                L.marker(driver.current_location, { icon })
                    .addTo(this.map)
                    .bindPopup(`
                        <div class="driver-popup">
                            <strong>${driver.name}</strong>
                            <p>${driver.vehicle_type === 'car' ? 'خودرو' : 'موتور'}</p>
                            <p>امتیاز: ${driver.rating || 4.5}</p>
                        </div>
                    `);
            }
        });
    }

    updateAvailableDrivers() {
        const availableDrivers = this.getAvailableDrivers();
        const countElement = document.getElementById('availableDriversCount');
        
        if (countElement) {
            countElement.textContent = availableDrivers.length;
            
            if (availableDrivers.length > 0) {
                countElement.classList.add('available');
            } else {
                countElement.classList.remove('available');
            }
        }
    }

    startPeriodicUpdates() {
        // به روزرسانی رانندگان هر 30 ثانیه
        setInterval(() => {
            this.loadOnlineDrivers();
            this.updateAvailableDrivers();
        }, 30000);
        
        // بررسی نوتیفیکیشن‌ها هر دقیقه
        setInterval(() => {
            this.updateNotifications();
        }, 60000);
        
        // به روزرسانی قیمت بر اساس ترافیک هر 5 دقیقه
        setInterval(() => {
            if (this.currentDistance > 0) {
                this.updatePrice();
            }
        }, 300000);
    }

    updateNotifications() {
        if (!this.currentUser) return;
        
        // دریافت نوتیفیکیشن‌های خوانده نشده
        const notifications = this.getStorage('notifications');
        const unreadCount = notifications.filter(n => 
            n.user_id === this.currentUser.id && !n.read
        ).length;
        
        // به روزرسانی شمارنده
        const bell = document.getElementById('notificationBell');
        if (bell) {
            const counter = bell.querySelector('.notification-counter') || 
                document.createElement('span');
            
            if (!counter.classList.contains('notification-counter')) {
                counter.className = 'notification-counter';
                bell.appendChild(counter);
            }
            
            counter.textContent = unreadCount;
            counter.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    showNotificationsPanel() {
        if (!this.currentUser) return;
        
        const notifications = this.getStorage('notifications')
            .filter(n => n.user_id === this.currentUser.id)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        const panel = document.createElement('div');
        panel.className = 'notifications-panel';
        panel.id = 'notificationsPanel';
        
        panel.innerHTML = `
            <div class="notifications-header">
                <h3>اعلان‌ها</h3>
                ${notifications.length > 0 ? `
                    <button onclick="snapp.markAllNotificationsAsRead()">
                        خواندن همه
                    </button>
                ` : ''}
            </div>
            
            <div class="notifications-list">
                ${notifications.length === 0 ? `
                    <div class="empty-notifications">
                        <i class="fas fa-bell-slash"></i>
                        <p>هیچ اعلانی وجود ندارد</p>
                    </div>
                ` : notifications.map(n => `
                    <div class="notification-item ${n.read ? 'read' : 'unread'}">
                        <div class="notification-icon">
                            <i class="fas fa-${this.getNotificationIcon(n.type)}"></i>
                        </div>
                        <div class="notification-content">
                            <div class="notification-title">${n.title}</div>
                            <div class="notification-message">${n.message}</div>
                            <div class="notification-time">${this.formatDateTime(n.created_at)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // نشان‌گذاری به عنوان خوانده شده با کلیک
        panel.querySelectorAll('.notification-item.unread').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.remove('unread');
                item.classList.add('read');
            });
        });
        
        // بستن پنل با کلیک خارج
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!panel.contains(e.target) && e.target.id !== 'notificationBell') {
                    panel.remove();
                }
            });
        }, 100);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        
        return icons[type] || 'bell';
    }

    markAllNotificationsAsRead() {
        const notifications = this.getStorage('notifications');
        const updatedNotifications = notifications.map(n => {
            if (n.user_id === this.currentUser.id) {
                n.read = true;
            }
            return n;
        });
        
        this.setStorage('notifications', updatedNotifications);
        
        // به روزرسانی پنل
        const panel = document.getElementById('notificationsPanel');
        if (panel) {
            panel.remove();
            this.showNotificationsPanel();
        }
        
        this.updateNotifications();
    }

    showNotification(message, type = 'info') {
        // ایجاد عنصر نوتیفیکیشن
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // اضافه کردن به صفحه
        document.body.appendChild(notification);
        
        // نمایش با انیمیشن
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // بستن خودکار پس از 5 ثانیه
        const autoClose = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // بستن دستی
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoClose);
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // ذخیره اعلان برای کاربر
        if (this.currentUser) {
            const notifications = this.getStorage('notifications');
            notifications.push({
                id: Date.now(),
                user_id: this.currentUser.id,
                title: this.getNotificationTitle(type),
                message: message,
                type: type,
                read: false,
                created_at: new Date().toISOString()
            });
            
            this.setStorage('notifications', notifications);
            this.updateNotifications();
        }
    }

    getNotificationTitle(type) {
        const titles = {
            success: 'موفقیت',
            error: 'خطا',
            warning: 'هشدار',
            info: 'اطلاعیه'
        };
        
        return titles[type] || 'اعلان';
    }

    showSettings() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'settingsModal';
        
        const settings = this.getStorage('settings');
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>تنظیمات</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="settings-section">
                        <h4>زبان</h4>
                        <select id="languageSelect">
                            <option value="fa" ${settings.language === 'fa' ? 'selected' : ''}>فارسی</option>
                            <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                        </select>
                    </div>
                    
                    <div class="settings-section">
                        <h4>تم</h4>
                        <select id="themeSelect">
                            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>روشن</option>
                            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>تیره</option>
                        </select>
                    </div>
                    
                    <div class="settings-section">
                        <h4>اعلان‌ها</h4>
                        <label class="checkbox-label">
                            <input type="checkbox" id="notificationsEnabled" ${settings.notifications !== false ? 'checked' : ''}>
                            دریافت اعلان‌ها
                        </label>
                    </div>
                    
                    <div class="modal-actions">
                        <button id="saveSettings" class="btn-primary">
                            ذخیره تنظیمات
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // ذخیره تنظیمات
        modal.querySelector('#saveSettings').addEventListener('click', () => {
            this.saveSettings({
                language: modal.querySelector('#languageSelect').value,
                theme: modal.querySelector('#themeSelect').value,
                notifications: modal.querySelector('#notificationsEnabled').checked
            });
            
            modal.remove();
            this.showNotification('تنظیمات ذخیره شد', 'success');
        });
        
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

    saveSettings(newSettings) {
        const settings = this.getStorage('settings');
        const updatedSettings = { ...settings, ...newSettings };
        this.setStorage('settings', updatedSettings);
        
        // اعمال تغییرات
        if (newSettings.theme) {
            document.body.setAttribute('data-theme', newSettings.theme);
        }
    }

    showHelp() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'helpModal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>راهنما و پشتیبانی</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="help-section">
                        <h4>چگونه سفر درخواست کنیم؟</h4>
                        <ol>
                            <li>مبدا و مقصد سفر خود را انتخاب کنید</li>
                            <li>نوع وسیله نقلیه مورد نظر را انتخاب کنید</li>
                            <li>روش پرداخت را انتخاب کنید</li>
                            <li>روی دکمه "درخواست سفر" کلیک کنید</li>
                        </ol>
                    </div>
                    
                    <div class="help-section">
                        <h4>روش‌های پرداخت</h4>
                        <ul>
                            <li>پرداخت نقدی به راننده</li>
                            <li>پرداخت از طریق کیف پول</li>
                            <li>کارت بانکی (به زودی)</li>
                        </ul>
                    </div>
                    
                    <div class="help-section">
                        <h4>تماس با پشتیبانی</h4>
                        <p>شماره تماس: ۰۷۰۱۲۳۴۵۶۷</p>
                        <p>ایمیل: support@snapp.af</p>
                        <p>ساعات کاری: ۸ صبح تا ۱۰ شب</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // توابع کمکی
    formatCurrency(amount) {
        return new Intl.NumberFormat('fa-AF').format(amount) + ' افغانی';
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fa-IR');
        } catch (e) {
            return 'نامشخص';
        }
    }

    formatDateTime(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fa-IR') + ' ' + 
                   date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return 'نامشخص';
        }
    }

    // متدهای عمومی برای دسترسی از HTML
    rateTrip(tripId) {
        // پیاده‌سازی امتیازدهی به سفر
        console.log('Rating trip:', tripId);
    }

    viewTripDetails(tripId) {
        // نمایش جزئیات سفر
        console.log('Viewing trip details:', tripId);
    }

    cancelTrip(tripId) {
        if (confirm('آیا از لغو این سفر مطمئن هستید؟')) {
            const trip = this.getTripById(tripId);
            if (trip) {
                trip.status = 'cancelled';
                this.saveTrip(trip);
                this.showNotification('سفر لغو شد', 'success');
                this.loadTripsPage();
            }
        }
    }

    editProfile() {
        // ویرایش پروفایل
        console.log('Editing profile');
    }

    setDestination(name, coords = null) {
        const destinationInput = document.getElementById('destination');
        if (destinationInput) {
            destinationInput.value = name;
            
            if (coords) {
                this.setDestinationLocation(name, coords);
            }
            
            this.calculateDistanceAndPrice();
            this.showNotification(`مقصد به "${name}" تنظیم شد`, 'info');
        }
    }
}

// راه‌اندازی سیستم
let snapp = new KabulSnapp();

// اضافه کردن توابع به آبجکت window برای دسترسی از HTML
window.snapp = snapp;

// رخدادهای کلیک برای نشانگرهای نقشه
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-set-pickup')) {
        const location = JSON.parse(e.target.dataset.location);
        snapp.setPickupLocation(location.name, location.coordinates);
    }
    
    if (e.target.classList.contains('btn-set-destination')) {
        const location = JSON.parse(e.target.dataset.location);
        snapp.setDestinationLocation(location.name, location.coordinates);
    }
});

console.log('🚗 اسنپ کابل بارگذاری شد!');