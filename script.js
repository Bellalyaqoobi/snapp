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

// مدیریت منوی موبایل (اصلاح شده)
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');

    if (!hamburger || !mobileMenu) return;

    // باز کردن منو
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // بستن منو
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // بستن با دکمه X
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileMenu);
    }

    // بستن با کلیک روی overlay
    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }

    // بستن با کلیک روی لینک‌های منو
    document.querySelectorAll('.mobile-nav-links .nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // بستن با کلید ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // جلوگیری از انتشار رویداد در داخل منو
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

        const amount = 5000; // مقدار ثابت برای آزمایش
        currentUser.wallet_balance += amount;
        currentUser.save();
        localStorage.setItem('snapp_current_user', JSON.stringify(currentUser));

        showNotification(`کیف پول شما ${formatCurrency(amount)} شارژ شد`, 'success');
        updateProfilePage();
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

console.log('سیستم اسنپ افغانستان آماده به کار است.');