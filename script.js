/**
 * ============================================
 * عداد التسبيح الرقمي - SCRIPT.JS
 * نسخة Google Sheets API كاملة - تصنيف عالمي حقيقي
 * ============================================
 */

// ============================================
// إعدادات API - عدّل هنا فقط
// ============================================

const CONFIG = {
  DHIKR_CYCLE_SIZE: 100,
  ENCOURAGEMENT_INTERVAL: 10,
  TOAST_DURATION: 2000,
  SPLASH_MIN_TIME: 1500,
  STORAGE_KEYS: {
    COUNTRY: 'tasbeeh_country',
    THEME: 'tasbeeh_theme',
    SOUND: 'tasbeeh_sound',
    TOTAL_CLICKS: 'tasbeeh_total_clicks',
    CURRENT_DHIKR_INDEX: 'tasbeeh_dhikr_index',
    CURRENT_DHIKR_COUNT: 'tasbeeh_dhikr_count',
    FIRST_VISIT: 'tasbeeh_first_visit',
    USER_ID: 'tasbeeh_user_id'
  },
  SOUND_ENABLED: true,
  SOUND_VOLUME: 0.3,
  VIBRATION_DURATION: 15,

  // ============================================
  // Google Apps Script Web App URL
  // ضع الرابط هنا بعد ما تنشر الـ Script
  // ============================================
  API_URL: 'https://script.google.com/macros/s/AKfycbxZ_RD-fMmnsL9U1Bp8FJhKDLnuHSAc8ChSvJq-JQ4e6FIni5AJzLA23oTCrVOoNhOrXQ/exec'
};

// قائمة الأذكار
const DHIKR_LIST = [
  { id: 'subhanallah', name: 'سبحان الله', transliteration: 'Glory be to Allah' },
  { id: 'alhamdulillah', name: 'الحمد لله', transliteration: 'Praise be to Allah' },
  { id: 'astaghfirullah', name: 'أستغفر الله', transliteration: 'I seek forgiveness from Allah' },
  { id: 'la_ilaha', name: 'لا إله إلا الله', transliteration: 'There is no god but Allah' },
  { id: 'salli_ala', name: 'اللهم صل على محمد', transliteration: "O Allah, send blessings upon Muhammad" }
];

// بيانات الدول
const COUNTRIES = [
  { code: 'AF', name: 'أفغانستان', flag: '🇦🇫' },
  { code: 'AL', name: 'ألبانيا', flag: '🇦🇱' },
  { code: 'DZ', name: 'الجزائر', flag: '🇩🇿' },
  { code: 'AD', name: 'أندورا', flag: '🇦🇩' },
  { code: 'AO', name: 'أنغولا', flag: '🇦🇴' },
  { code: 'AR', name: 'الأرجنتين', flag: '🇦🇷' },
  { code: 'AM', name: 'أرمينيا', flag: '🇦🇲' },
  { code: 'AU', name: 'أستراليا', flag: '🇦🇺' },
  { code: 'AT', name: 'النمسا', flag: '🇦🇹' },
  { code: 'AZ', name: 'أذربيجان', flag: '🇦🇿' },
  { code: 'BS', name: 'الباهاماس', flag: '🇧🇸' },
  { code: 'BH', name: 'البحرين', flag: '🇧🇭' },
  { code: 'BD', name: 'بنغلاديش', flag: '🇧🇩' },
  { code: 'BY', name: 'بيلاروس', flag: '🇧🇾' },
  { code: 'BE', name: 'بلجيكا', flag: '🇧🇪' },
  { code: 'BZ', name: 'بليز', flag: '🇧🇿' },
  { code: 'BJ', name: 'بنين', flag: '🇧🇯' },
  { code: 'BT', name: 'بوتان', flag: '🇧🇹' },
  { code: 'BO', name: 'بوليفيا', flag: '🇧🇴' },
  { code: 'BA', name: 'البوسنة والهرسك', flag: '🇧🇦' },
  { code: 'BW', name: 'بوتسوانا', flag: '🇧🇼' },
  { code: 'BR', name: 'البرازيل', flag: '🇧🇷' },
  { code: 'BN', name: 'بروناي', flag: '🇧🇳' },
  { code: 'BG', name: 'بلغاريا', flag: '🇧🇬' },
  { code: 'BF', name: 'بوركينا فاسو', flag: '🇧🇫' },
  { code: 'BI', name: 'بوروندي', flag: '🇧🇮' },
  { code: 'KH', name: 'كمبوديا', flag: '🇰🇭' },
  { code: 'CM', name: 'الكاميرون', flag: '🇨🇲' },
  { code: 'CA', name: 'كندا', flag: '🇨🇦' },
  { code: 'CV', name: 'الرأس الأخضر', flag: '🇨🇻' },
  { code: 'CF', name: 'جمهورية أفريقيا الوسطى', flag: '🇨🇫' },
  { code: 'TD', name: 'تشاد', flag: '🇹🇩' },
  { code: 'CL', name: 'تشيلي', flag: '🇨🇱' },
  { code: 'CN', name: 'الصين', flag: '🇨🇳' },
  { code: 'CO', name: 'كولومبيا', flag: '🇨🇴' },
  { code: 'KM', name: 'جزر القمر', flag: '🇰🇲' },
  { code: 'CG', name: 'الكونغو', flag: '🇨🇬' },
  { code: 'CR', name: 'كوستاريكا', flag: '🇨🇷' },
  { code: 'HR', name: 'كرواتيا', flag: '🇭🇷' },
  { code: 'CU', name: 'كوبا', flag: '🇨🇺' },
  { code: 'CY', name: 'قبرص', flag: '🇨🇾' },
  { code: 'CZ', name: 'التشيك', flag: '🇨🇿' },
  { code: 'DK', name: 'الدنمارك', flag: '🇩🇰' },
  { code: 'DJ', name: 'جيبوتي', flag: '🇩🇯' },
  { code: 'DM', name: 'دومينيكا', flag: '🇩🇲' },
  { code: 'DO', name: 'جمهورية الدومينيكان', flag: '🇩🇴' },
  { code: 'EC', name: 'الإكوادور', flag: '🇪🇨' },
  { code: 'EG', name: 'مصر', flag: '🇪🇬' },
  { code: 'SV', name: 'السلفادور', flag: '🇸🇻' },
  { code: 'GQ', name: 'غينيا الاستوائية', flag: '🇬🇶' },
  { code: 'ER', name: 'إريتريا', flag: '🇪🇷' },
  { code: 'EE', name: 'إستونيا', flag: '🇪🇪' },
  { code: 'ET', name: 'إثيوبيا', flag: '🇪🇹' },
  { code: 'FJ', name: 'فيجي', flag: '🇫🇯' },
  { code: 'FI', name: 'فنلندا', flag: '🇫🇮' },
  { code: 'FR', name: 'فرنسا', flag: '🇫🇷' },
  { code: 'GA', name: 'الغابون', flag: '🇬🇦' },
  { code: 'GM', name: 'غامبيا', flag: '🇬🇲' },
  { code: 'GE', name: 'جورجيا', flag: '🇬🇪' },
  { code: 'DE', name: 'ألمانيا', flag: '🇩🇪' },
  { code: 'GH', name: 'غانا', flag: '🇬🇭' },
  { code: 'GR', name: 'اليونان', flag: '🇬🇷' },
  { code: 'GT', name: 'غواتيمالا', flag: '🇬🇹' },
  { code: 'GN', name: 'غينيا', flag: '🇬🇳' },
  { code: 'GW', name: 'غينيا بيساو', flag: '🇬🇼' },
  { code: 'GY', name: 'غيانا', flag: '🇬🇾' },
  { code: 'HT', name: 'هايتي', flag: '🇭🇹' },
  { code: 'HN', name: 'هندوراس', flag: '🇭🇳' },
  { code: 'HU', name: 'المجر', flag: '🇭🇺' },
  { code: 'IS', name: 'آيسلندا', flag: '🇮🇸' },
  { code: 'IN', name: 'الهند', flag: '🇮🇳' },
  { code: 'ID', name: 'إندونيسيا', flag: '🇮🇩' },
  { code: 'IR', name: 'إيران', flag: '🇮🇷' },
  { code: 'IQ', name: 'العراق', flag: '🇮🇶' },
  { code: 'IE', name: 'أيرلندا', flag: '🇮🇪' },
  { code: 'IL', name: 'إسرائيل', flag: '🇮🇱' },
  { code: 'IT', name: 'إيطاليا', flag: '🇮🇹' },
  { code: 'JM', name: 'جامايكا', flag: '🇯🇲' },
  { code: 'JP', name: 'اليابان', flag: '🇯🇵' },
  { code: 'JO', name: 'الأردن', flag: '🇯🇴' },
  { code: 'KZ', name: 'كازاخستان', flag: '🇰🇿' },
  { code: 'KE', name: 'كينيا', flag: '🇰🇪' },
  { code: 'KI', name: 'كيريباتي', flag: '🇰🇮' },
  { code: 'KP', name: 'كوريا الشمالية', flag: '🇰🇵' },
  { code: 'KR', name: 'كوريا الجنوبية', flag: '🇰🇷' },
  { code: 'KW', name: 'الكويت', flag: '🇰🇼' },
  { code: 'KG', name: 'قيرغيزستان', flag: '🇰🇬' },
  { code: 'LA', name: 'لاوس', flag: '🇱🇦' },
  { code: 'LV', name: 'لاتفيا', flag: '🇱🇻' },
  { code: 'LB', name: 'لبنان', flag: '🇱🇧' },
  { code: 'LS', name: 'ليسوتو', flag: '🇱🇸' },
  { code: 'LR', name: 'ليبيريا', flag: '🇱🇷' },
  { code: 'LY', name: 'ليبيا', flag: '🇱🇾' },
  { code: 'LI', name: 'ليختنشتاين', flag: '🇱🇮' },
  { code: 'LT', name: 'ليتوانيا', flag: '🇱🇹' },
  { code: 'LU', name: 'لوكسمبورغ', flag: '🇱🇺' },
  { code: 'MG', name: 'مدغشقر', flag: '🇲🇬' },
  { code: 'MW', name: 'مالاوي', flag: '🇲🇼' },
  { code: 'MY', name: 'ماليزيا', flag: '🇲🇾' },
  { code: 'MV', name: 'المالديف', flag: '🇲🇻' },
  { code: 'ML', name: 'مالي', flag: '🇲🇱' },
  { code: 'MT', name: 'مالطا', flag: '🇲🇹' },
  { code: 'MH', name: 'جزر مارشال', flag: '🇲🇭' },
  { code: 'MR', name: 'موريتانيا', flag: '🇲🇷' },
  { code: 'MU', name: 'موريشيوس', flag: '🇲🇺' },
  { code: 'MX', name: 'المكسيك', flag: '🇲🇽' },
  { code: 'FM', name: 'ميكرونيزيا', flag: '🇫🇲' },
  { code: 'MD', name: 'مولدوفا', flag: '🇲🇩' },
  { code: 'MC', name: 'موناكو', flag: '🇲🇨' },
  { code: 'MN', name: 'منغوليا', flag: '🇲🇳' },
  { code: 'ME', name: 'الجبل الأسود', flag: '🇲🇪' },
  { code: 'MA', name: 'المغرب', flag: '🇲🇦' },
  { code: 'MZ', name: 'موزمبيق', flag: '🇲🇿' },
  { code: 'MM', name: 'ميانمار', flag: '🇲🇲' },
  { code: 'NA', name: 'ناميبيا', flag: '🇳🇦' },
  { code: 'NR', name: 'ناورو', flag: '🇳🇷' },
  { code: 'NP', name: 'نيبال', flag: '🇳🇵' },
  { code: 'NL', name: 'هولندا', flag: '🇳🇱' },
  { code: 'NZ', name: 'نيوزيلندا', flag: '🇳🇿' },
  { code: 'NI', name: 'نيكاراغوا', flag: '🇳🇮' },
  { code: 'NE', name: 'النيجر', flag: '🇳🇪' },
  { code: 'NG', name: 'نيجيريا', flag: '🇳🇬' },
  { code: 'MK', name: 'شمال مقدونيا', flag: '🇲🇰' },
  { code: 'NO', name: 'النرويج', flag: '🇳🇴' },
  { code: 'OM', name: 'عمان', flag: '🇴🇲' },
  { code: 'PK', name: 'باكستان', flag: '🇵🇰' },
  { code: 'PW', name: 'بالاو', flag: '🇵🇼' },
  { code: 'PA', name: 'بنما', flag: '🇵🇦' },
  { code: 'PG', name: 'بابوا غينيا الجديدة', flag: '🇵🇬' },
  { code: 'PY', name: 'باراغواي', flag: '🇵🇾' },
  { code: 'PE', name: 'بيرو', flag: '🇵🇪' },
  { code: 'PH', name: 'الفلبين', flag: '🇵🇭' },
  { code: 'PL', name: 'بولندا', flag: '🇵🇱' },
  { code: 'PT', name: 'البرتغال', flag: '🇵🇹' },
  { code: 'QA', name: 'قطر', flag: '🇶🇦' },
  { code: 'RO', name: 'رومانيا', flag: '🇷🇴' },
  { code: 'RU', name: 'روسيا', flag: '🇷🇺' },
  { code: 'RW', name: 'رواندا', flag: '🇷🇼' },
  { code: 'KN', name: 'سانت كيتس ونيفيس', flag: '🇰🇳' },
  { code: 'LC', name: 'سانت لوسيا', flag: '🇱🇨' },
  { code: 'VC', name: 'سانت فنسنت والغرينادين', flag: '🇻🇨' },
  { code: 'WS', name: 'ساموا', flag: '🇼🇸' },
  { code: 'SM', name: 'سان مارينو', flag: '🇸🇲' },
  { code: 'ST', name: 'ساو تومي وبرينسيبي', flag: '🇸🇹' },
  { code: 'SA', name: 'المملكة العربية السعودية', flag: '🇸🇦' },
  { code: 'SN', name: 'السنغال', flag: '🇸🇳' },
  { code: 'RS', name: 'صربيا', flag: '🇷🇸' },
  { code: 'SC', name: 'سيشيل', flag: '🇸🇨' },
  { code: 'SL', name: 'سيراليون', flag: '🇸🇱' },
  { code: 'SG', name: 'سنغافورة', flag: '🇸🇬' },
  { code: 'SK', name: 'سلوفاكيا', flag: '🇸🇰' },
  { code: 'SI', name: 'سلوفينيا', flag: '🇸🇮' },
  { code: 'SB', name: 'جزر سليمان', flag: '🇸🇧' },
  { code: 'SO', name: 'الصومال', flag: '🇸🇴' },
  { code: 'ZA', name: 'جنوب أفريقيا', flag: '🇿🇦' },
  { code: 'SS', name: 'جنوب السودان', flag: '🇸🇸' },
  { code: 'ES', name: 'إسبانيا', flag: '🇪🇸' },
  { code: 'LK', name: 'سريلانكا', flag: '🇱🇰' },
  { code: 'SD', name: 'السودان', flag: '🇸🇩' },
  { code: 'SR', name: 'سورينام', flag: '🇸🇷' },
  { code: 'SE', name: 'السويد', flag: '🇸🇪' },
  { code: 'CH', name: 'سويسرا', flag: '🇨🇭' },
  { code: 'SY', name: 'سوريا', flag: '🇸🇾' },
  { code: 'TJ', name: 'طاجيكستان', flag: '🇹🇯' },
  { code: 'TZ', name: 'تنزانيا', flag: '🇹🇿' },
  { code: 'TH', name: 'تايلاند', flag: '🇹🇭' },
  { code: 'TL', name: 'تيمور الشرقية', flag: '🇹🇱' },
  { code: 'TG', name: 'توغو', flag: '🇹🇬' },
  { code: 'TO', name: 'تونغا', flag: '🇹🇴' },
  { code: 'TT', name: 'ترينيداد وتوباغو', flag: '🇹🇹' },
  { code: 'TN', name: 'تونس', flag: '🇹🇳' },
  { code: 'TR', name: 'تركيا', flag: '🇹🇷' },
  { code: 'TM', name: 'تركمانستان', flag: '🇹🇲' },
  { code: 'TV', name: 'توفالو', flag: '🇹🇻' },
  { code: 'UG', name: 'أوغندا', flag: '🇺🇬' },
  { code: 'UA', name: 'أوكرانيا', flag: '🇺🇦' },
  { code: 'AE', name: 'الإمارات العربية المتحدة', flag: '🇦🇪' },
  { code: 'GB', name: 'المملكة المتحدة', flag: '🇬🇧' },
  { code: 'US', name: 'الولايات المتحدة', flag: '🇺🇸' },
  { code: 'UY', name: 'أوروغواي', flag: '🇺🇾' },
  { code: 'UZ', name: 'أوزبكستان', flag: '🇺🇿' },
  { code: 'VU', name: 'فانواتو', flag: '🇻🇺' },
  { code: 'VA', name: 'مدينة الفاتيكان', flag: '🇻🇦' },
  { code: 'VE', name: 'فنزويلا', flag: '🇻🇪' },
  { code: 'VN', name: 'فيتنام', flag: '🇻🇳' },
  { code: 'YE', name: 'اليمن', flag: '🇾🇪' },
  { code: 'ZM', name: 'زامبيا', flag: '🇿🇲' },
  { code: 'ZW', name: 'زيمبابوي', flag: '🇿🇼' }
];

// ============================================
// إدارة الحالة
// ============================================

var AppState = {
  currentDhikrIndex: 0,
  currentDhikrCount: 0,
  totalClicks: 0,
  selectedCountry: null,
  theme: 'light',
  soundEnabled: true,
  isFirstVisit: true,
  userId: null,

  setState: function(updates) {
    Object.assign(this, updates);
    this.persist();
  },

  persist: function() {
    try {
      var data = {
        totalClicks: this.totalClicks,
        currentDhikrIndex: this.currentDhikrIndex,
        currentDhikrCount: this.currentDhikrCount,
        selectedCountry: this.selectedCountry,
        theme: this.theme,
        soundEnabled: this.soundEnabled,
        isFirstVisit: false,
        userId: this.userId
      };
      localStorage.setItem(CONFIG.STORAGE_KEYS.FIRST_VISIT, JSON.stringify(data));
    } catch (e) {
      console.warn('فشل في حفظ الحالة:', e);
    }
  },

  load: function() {
    try {
      var raw = localStorage.getItem(CONFIG.STORAGE_KEYS.FIRST_VISIT);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data) {
        this.totalClicks = data.totalClicks || 0;
        this.currentDhikrIndex = data.currentDhikrIndex || 0;
        this.currentDhikrCount = data.currentDhikrCount || 0;
        this.selectedCountry = data.selectedCountry || null;
        this.theme = data.theme || 'light';
        this.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
        this.isFirstVisit = false;
        this.userId = data.userId || null;
      }
    } catch (e) {
      console.warn('فشل في تحميل الحالة:', e);
    }
  }
};

// ============================================
// Google Apps Script API Client
// ============================================

var GASAPI = {
  isConfigured: function() {
    return CONFIG.API_URL && CONFIG.API_URL.indexOf('XXXXXXXX') === -1;
  },

  // GET - جلب التصنيف
  getRanking: function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      if (!self.isConfigured()) {
        reject(new Error('API not configured'));
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.timeout = 10000;
      xhr.open('GET', CONFIG.API_URL, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            var response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error('HTTP ' + xhr.status));
        }
      };

      xhr.onerror = function() { reject(new Error('Network error')); };
      xhr.ontimeout = function() { reject(new Error('Timeout')); };
      xhr.send();
    });
  },

  // POST - زيادة عداد دولة
  incrementCount: function(countryCode) {
    var self = this;
    return new Promise(function(resolve, reject) {
      if (!self.isConfigured()) {
        reject(new Error('API not configured'));
        return;
      }

      var xhr = new XMLHttpRequest();
      xhr.timeout = 10000;
      xhr.open('POST', CONFIG.API_URL, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            var response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error('HTTP ' + xhr.status));
        }
      };

      xhr.onerror = function() { reject(new Error('Network error')); };
      xhr.ontimeout = function() { reject(new Error('Timeout')); };

      xhr.send(JSON.stringify({
        countryCode: countryCode
      }));
    });
  }
};

// ============================================
// مراجع DOM
// ============================================

var DOM = {};

function initDOM() {
  DOM.app = document.getElementById('app');
  DOM.splashScreen = document.getElementById('splash-screen');
  DOM.countryModal = document.getElementById('country-modal');
  DOM.countrySearch = document.getElementById('country-search');
  DOM.countryList = document.getElementById('country-list');
  DOM.toastContainer = document.getElementById('toast-container');
  DOM.themeToggle = document.getElementById('theme-toggle');
  DOM.soundToggle = document.getElementById('sound-toggle');
  DOM.resetBtn = document.getElementById('reset-btn');
  DOM.dhikrName = document.getElementById('dhikr-name');
  DOM.dhikrTransliteration = document.getElementById('dhikr-transliteration');
  DOM.dhikrProgressBar = document.getElementById('dhikr-progress-bar');
  DOM.dhikrRemaining = document.getElementById('dhikr-remaining');
  DOM.currentCount = document.getElementById('current-count');
  DOM.totalCount = document.getElementById('total-count');
  DOM.countBtn = document.getElementById('count-btn');
  DOM.countBtnRipple = document.querySelector('.count-btn-ripple');
  DOM.rankingList = document.getElementById('ranking-list');
}

// ============================================
// محرك الصوت
// ============================================

var AudioEngine = {
  ctx: null,

  init: function() {
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn('Web Audio API not available');
    }
  },

  playClick: function() {
    if (!AppState.soundEnabled || !this.ctx) return;
    try {
      var osc = this.ctx.createOscillator();
      var gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(CONFIG.SOUND_VOLUME, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  },

  playCompletion: function() {
    if (!AppState.soundEnabled || !this.ctx) return;
    try {
      var frequencies = [523.25, 659.25, 783.99];
      var self = this;
      frequencies.forEach(function(freq, i) {
        var osc = self.ctx.createOscillator();
        var gain = self.ctx.createGain();
        osc.connect(gain);
        gain.connect(self.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, self.ctx.currentTime + i * 0.05);
        gain.gain.setValueAtTime(0, self.ctx.currentTime + i * 0.05);
        gain.gain.linearRampToValueAtTime(CONFIG.SOUND_VOLUME * 0.5, self.ctx.currentTime + i * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, self.ctx.currentTime + i * 0.05 + 0.3);
        osc.start(self.ctx.currentTime + i * 0.05);
        osc.stop(self.ctx.currentTime + i * 0.05 + 0.3);
      });
    } catch (e) {}
  }
};

// ============================================
// محرك الاهتزاز
// ============================================

var VibrationEngine = {
  trigger: function() {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(CONFIG.VIBRATION_DURATION);
      }
    } catch (e) {}
  }
};

// ============================================
// نظام الإشعارات (Toast)
// ============================================

var ToastSystem = {
  queue: [],
  isShowing: false,

  show: function(message, type, duration) {
    type = type || 'default';
    duration = duration || CONFIG.TOAST_DURATION;
    this.queue.push({ message: message, type: type, duration: duration });
    if (!this.isShowing) {
      this.processQueue();
    }
  },

  processQueue: function() {
    var self = this;
    if (this.queue.length === 0) {
      this.isShowing = false;
      return;
    }

    this.isShowing = true;
    var item = this.queue.shift();

    var toast = document.createElement('div');
    toast.className = 'toast' + (item.type === 'gold' ? ' toast-gold' : '');
    toast.textContent = item.message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    if (DOM.toastContainer) {
      DOM.toastContainer.appendChild(toast);
      toast.offsetHeight;

      requestAnimationFrame(function() {
        toast.classList.add('show');
      });

      setTimeout(function() {
        toast.classList.remove('show');
        toast.classList.add('hide');

        setTimeout(function() {
          if (toast.parentNode) toast.remove();
          self.processQueue();
        }, 300);
      }, item.duration);
    } else {
      self.processQueue();
    }
  }
};

// ============================================
// محدد الدول
// ============================================

var CountrySelector = {
  filteredCountries: [],

  init: function() {
    this.filteredCountries = COUNTRIES.slice();
    this.renderList();
    this.attachEvents();
  },

  attachEvents: function() {
    var self = this;
    if (!DOM.countrySearch) return;

    DOM.countrySearch.addEventListener('input', function(e) {
      self.handleSearch(e.target.value);
    });

    DOM.countrySearch.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        var firstItem = DOM.countryList ? DOM.countryList.querySelector('.country-item') : null;
        if (firstItem) firstItem.click();
      }
    });
  },

  handleSearch: function(query) {
    var normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
      this.filteredCountries = COUNTRIES.slice();
    } else {
      this.filteredCountries = COUNTRIES.filter(function(country) {
        return country.name.toLowerCase().indexOf(normalizedQuery) !== -1 ||
               country.code.toLowerCase().indexOf(normalizedQuery) !== -1;
      });
    }
    this.renderList();
  },

  renderList: function() {
    if (!DOM.countryList) return;
    DOM.countryList.innerHTML = '';

    if (this.filteredCountries.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'country-item-empty';
      empty.textContent = 'لم يتم العثور على دول';
      DOM.countryList.appendChild(empty);
      return;
    }

    var fragment = document.createDocumentFragment();
    var self = this;

    this.filteredCountries.forEach(function(country) {
      var item = document.createElement('button');
      item.className = 'country-item';
      item.setAttribute('role', 'option');
      item.setAttribute('aria-label', 'اختيار ' + country.name);
      item.innerHTML = '<span class="country-item-flag" aria-hidden="true">' + country.flag + '</span>' +
        '<span class="country-item-name">' + self.escapeHtml(country.name) + '</span>';
      item.addEventListener('click', function() {
        self.selectCountry(country);
      });
      fragment.appendChild(item);
    });

    DOM.countryList.appendChild(fragment);
  },

  selectCountry: function(country) {
    AppState.setState({ selectedCountry: country.code });
    this.closeModal();
    ToastSystem.show('تم الاختيار: ' + country.flag + ' ' + country.name, 'default', 1500);
    RankingSystem.render();
    RankingSystem.syncWithBackend();
  },

  openModal: function() {
    if (!DOM.countryModal) return;
    DOM.countryModal.classList.add('active');
    DOM.countryModal.setAttribute('aria-hidden', 'false');
    setTimeout(function() {
      if (DOM.countrySearch) DOM.countrySearch.focus();
    }, 300);
    if (DOM.countrySearch) DOM.countrySearch.value = '';
    this.filteredCountries = COUNTRIES.slice();
    this.renderList();
  },

  closeModal: function() {
    if (!DOM.countryModal) return;
    DOM.countryModal.classList.remove('active');
    DOM.countryModal.setAttribute('aria-hidden', 'true');
  },

  escapeHtml: function(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// ============================================
// نظام التصنيف العالمي - Google Sheets API
// ============================================

var RankingSystem = {
  rankingData: [],
  isLoading: false,
  apiConnected: false,
  lastSyncTime: null,

  init: function() {
    this.loadFromStorage();
    this.render();
    this.syncWithBackend();
    // تحديث كل 30 ثانية
    var self = this;
    setInterval(function() { self.syncWithBackend(); }, 30000);
  },

  loadFromStorage: function() {
    try {
      var stored = localStorage.getItem('tasbeeh_ranking_cache');
      if (stored) {
        var parsed = JSON.parse(stored);
        this.rankingData = parsed.data || [];
        this.lastSyncTime = parsed.timestamp || null;
      }
    } catch (e) {
      this.rankingData = [];
    }
  },

  saveToStorage: function() {
    try {
      localStorage.setItem('tasbeeh_ranking_cache', JSON.stringify({
        data: this.rankingData,
        timestamp: Date.now()
      }));
    } catch (e) {}
  },

  syncWithBackend: function() {
    var self = this;

    if (!GASAPI.isConfigured()) {
      this.apiConnected = false;
      this.render();
      return;
    }

    this.isLoading = true;
    this.render();

    GASAPI.getRanking().then(function(result) {
      if (result.success && Array.isArray(result.data)) {
        self.rankingData = result.data.map(function(item) {
          var country = COUNTRIES.find(function(c) { return c.code === item.countryCode; });
          return {
            rank: item.rank,
            countryCode: item.countryCode,
            countryName: country ? country.name : item.countryCode,
            flag: country ? country.flag : '🏳️',
            totalClicks: item.count || item.totalClicks || 0
          };
        });
        self.apiConnected = true;
        self.lastSyncTime = Date.now();
        self.saveToStorage();
      }
      self.isLoading = false;
      self.render();
    }).catch(function(error) {
      console.warn('تعذر الاتصال بالخادم:', error);
      self.apiConnected = false;
      self.isLoading = false;
      self.render();
    });
  },

  incrementCountryClicks: function(countryCode) {
    if (!countryCode) return;

    // تحديث محلي فوري
    this.updateLocalRanking(countryCode);

    // إرسال للخادم
    if (GASAPI.isConfigured()) {
      GASAPI.incrementCount(countryCode)
        .then(function(result) {
          if (result.success) {
            console.log('Count incremented on server:', result);
          }
        })
        .catch(function(error) {
          console.warn('فشل إرسال العداد:', error);
        });
    }
  },

  updateLocalRanking: function(countryCode) {
    var entry = null;
    for (var i = 0; i < this.rankingData.length; i++) {
      if (this.rankingData[i].countryCode === countryCode) {
        entry = this.rankingData[i];
        break;
      }
    }

    if (entry) {
      entry.totalClicks += 1;
    } else {
      var country = null;
      for (var j = 0; j < COUNTRIES.length; j++) {
        if (COUNTRIES[j].code === countryCode) {
          country = COUNTRIES[j];
          break;
        }
      }
      if (country) {
        this.rankingData.push({
          rank: this.rankingData.length + 1,
          countryCode: countryCode,
          countryName: country.name,
          flag: country.flag,
          totalClicks: 1
        });
      }
    }

    this.rankingData.sort(function(a, b) {
      return b.totalClicks - a.totalClicks;
    });

    for (var k = 0; k < this.rankingData.length; k++) {
      this.rankingData[k].rank = k + 1;
    }

    this.saveToStorage();
    this.render();
  },

  formatNumber: function(num) {
    return num.toLocaleString('ar-SA');
  },

  render: function() {
    if (!DOM.rankingList) return;
    DOM.rankingList.innerHTML = '';

    if (this.isLoading) {
      DOM.rankingList.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--color-text-muted)">' +
        '<div style="font-size:2rem;margin-bottom:0.5rem">⏳</div>' +
        '<div style="font-weight:600">جاري تحميل التصنيف...</div></div>';
      return;
    }

    var isApiConfigured = GASAPI.isConfigured();

    if (!isApiConfigured && this.rankingData.length === 0) {
      DOM.rankingList.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--color-text-muted)">' +
        '<div style="font-size:2rem;margin-bottom:0.5rem">⚙️</div>' +
        '<div style="font-weight:600;margin-bottom:0.25rem">API غير مُعد</div>' +
        '<div style="font-size:0.875rem">أضف رابط Google Apps Script في الكود</div></div>';
      return;
    }

    if (!this.apiConnected && this.rankingData.length === 0) {
      DOM.rankingList.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--color-text-muted)">' +
        '<div style="font-size:2rem;margin-bottom:0.5rem">📡</div>' +
        '<div style="font-weight:600;margin-bottom:0.25rem">تعذر الاتصال بالخادم</div>' +
        '<div style="font-size:0.875rem">التصنيف سيظهر عند استعادة الاتصال</div></div>';
      return;
    }

    if (this.rankingData.length === 0) {
      DOM.rankingList.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--color-text-muted)">' +
        '<div style="font-size:2rem;margin-bottom:0.5rem">📊</div>' +
        '<div style="font-weight:600">التصنيف العالمي</div>' +
        '<div style="font-size:0.875rem">ابدأ العد ليظهر تصنيف بلدك هنا</div></div>';
      return;
    }

    var fragment = document.createDocumentFragment();
    var displayData = this.rankingData.slice(0, 10);
    var self = this;

    displayData.forEach(function(item) {
      var isUserCountry = item.countryCode === AppState.selectedCountry;
      var row = document.createElement('div');
      row.className = 'ranking-item' + (isUserCountry ? ' highlight' : '');
      row.setAttribute('role', 'listitem');

      var rankClass = 'normal';
      if (item.rank === 1) rankClass = 'gold';
      else if (item.rank === 2) rankClass = 'silver';
      else if (item.rank === 3) rankClass = 'bronze';

      row.innerHTML = '<div class="ranking-rank ' + rankClass + '" aria-label="المرتبة ' + item.rank + '">' + item.rank + '</div>' +
        '<span class="ranking-flag" aria-hidden="true">' + item.flag + '</span>' +
        '<span class="ranking-country">' + self.escapeHtml(item.countryName) + '</span>' +
        '<span class="ranking-clicks">' + self.formatNumber(item.totalClicks) + '</span>';

      fragment.appendChild(row);
    });

    DOM.rankingList.appendChild(fragment);
  },

  escapeHtml: function(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// ============================================
// مدير الذكر
// ============================================

var DhikrManager = {
  getCurrentDhikr: function() {
    return DHIKR_LIST[AppState.currentDhikrIndex];
  },

  getRemaining: function() {
    return CONFIG.DHIKR_CYCLE_SIZE - AppState.currentDhikrCount;
  },

  getProgress: function() {
    return (AppState.currentDhikrCount / CONFIG.DHIKR_CYCLE_SIZE) * 100;
  },

  nextDhikr: function() {
    var nextIndex = (AppState.currentDhikrIndex + 1) % DHIKR_LIST.length;
    AppState.setState({
      currentDhikrIndex: nextIndex,
      currentDhikrCount: 0
    });
    this.animateTransition();
  },

  animateTransition: function() {
    var nameEl = DOM.dhikrName;
    var transEl = DOM.dhikrTransliteration;
    if (nameEl) nameEl.classList.add('changing');
    if (transEl) transEl.classList.add('changing');

    var self = this;
    setTimeout(function() {
      self.updateDisplay();
      if (nameEl) nameEl.classList.remove('changing');
      if (transEl) transEl.classList.remove('changing');
      AudioEngine.playCompletion();
    }, 300);
  },

  updateDisplay: function() {
    var dhikr = this.getCurrentDhikr();
    var remaining = this.getRemaining();
    var progress = this.getProgress();

    if (DOM.dhikrName) DOM.dhikrName.textContent = dhikr.name;
    if (DOM.dhikrTransliteration) DOM.dhikrTransliteration.textContent = dhikr.transliteration;
    if (DOM.dhikrRemaining) DOM.dhikrRemaining.textContent = 'متبقي ' + remaining;
    if (DOM.dhikrProgressBar) {
      DOM.dhikrProgressBar.style.width = progress + '%';
      DOM.dhikrProgressBar.setAttribute('aria-valuenow', AppState.currentDhikrCount);
    }
    if (DOM.currentCount) DOM.currentCount.textContent = AppState.currentDhikrCount;
    if (DOM.totalCount) DOM.totalCount.textContent = AppState.totalClicks.toLocaleString('ar-SA');
  }
};

// ============================================
// محرك العداد
// ============================================

var CounterEngine = {
  count: function() {
    var newDhikrCount = AppState.currentDhikrCount + 1;
    var newTotalClicks = AppState.totalClicks + 1;

    AppState.setState({
      currentDhikrCount: newDhikrCount,
      totalClicks: newTotalClicks
    });

    DhikrManager.updateDisplay();
    this.triggerEffects();

    if (newDhikrCount >= CONFIG.DHIKR_CYCLE_SIZE) {
      this.handleDhikrComplete();
    }

    if (newTotalClicks % CONFIG.ENCOURAGEMENT_INTERVAL === 0) {
      this.showEncouragement();
    }

    RankingSystem.incrementCountryClicks(AppState.selectedCountry);
  },

  triggerEffects: function() {
    if (DOM.currentCount) {
      DOM.currentCount.classList.remove('pulse');
      void DOM.currentCount.offsetWidth;
      DOM.currentCount.classList.add('pulse');
    }

    if (DOM.countBtnRipple) {
      DOM.countBtnRipple.classList.remove('active');
      void DOM.countBtnRipple.offsetWidth;
      DOM.countBtnRipple.classList.add('active');
    }

    if (DOM.countBtn) {
      DOM.countBtn.classList.remove('pulse-ring');
      void DOM.countBtn.offsetWidth;
      DOM.countBtn.classList.add('pulse-ring');
    }

    AudioEngine.playClick();
    VibrationEngine.trigger();
  },

  handleDhikrComplete: function() {
    DhikrManager.nextDhikr();
    ToastSystem.show(
      'تم الإكمال! التالي: ' + DhikrManager.getCurrentDhikr().name,
      'gold',
      2500
    );
  },

  showEncouragement: function() {
    var messages = [
      'ممتاز! جزاك الله خيراُ.',
      'ما شاء الله! استمر.',
      'بارك الله فيك! رائع.',
      'جزاك الله خيراُ على ذكرك.',
      'جميل! استمر على الاستمرارية.'
    ];
    var message = messages[Math.floor(Math.random() * messages.length)];
    ToastSystem.show(message, 'gold');
  },

  reset: function() {
    AppState.setState({ currentDhikrCount: 0 });
    DhikrManager.updateDisplay();
    ToastSystem.show('تم إعادة تعيين الذكر الحالي', 'default', 1500);
  }
};

// ============================================
// مدير الوضع (فاتح/داكن)
// ============================================

var ThemeManager = {
  init: function() {
    var savedTheme = AppState.theme;
    var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(theme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!AppState.theme) ThemeManager.setTheme(e.matches ? 'dark' : 'light');
    });
  },

  setTheme: function(theme) {
    AppState.setState({ theme: theme });
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggle: function() {
    var newTheme = AppState.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
};

// ============================================
// مدير الصوت
// ============================================

var SoundManager = {
  init: function() {
    document.body.setAttribute('data-sound', AppState.soundEnabled ? 'on' : 'off');
  },

  toggle: function() {
    var newState = !AppState.soundEnabled;
    AppState.setState({ soundEnabled: newState });
    document.body.setAttribute('data-sound', newState ? 'on' : 'off');
    ToastSystem.show(
      newState ? 'تم تفعيل المؤثرات الصوتية' : 'تم كتم المؤثرات الصوتية',
      'default',
      1500
    );
  }
};

// ============================================
// معالجات الأحداث
// ============================================

var EventHandlers = {
  init: function() {
    this.initCountButton();
    this.initKeyboard();
    this.initControls();
    this.initTouch();
  },

  initCountButton: function() {
    var btn = DOM.countBtn;
    if (!btn) return;

    btn.addEventListener('mousedown', function(e) {
      e.preventDefault();
      btn.setAttribute('aria-pressed', 'true');
    });

    btn.addEventListener('mouseup', function() {
      btn.setAttribute('aria-pressed', 'false');
    });

    btn.addEventListener('mouseleave', function() {
      btn.setAttribute('aria-pressed', 'false');
    });

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      CounterEngine.count();
    });

    btn.addEventListener('touchend', function(e) {
      e.preventDefault();
      btn.click();
    });
  },

  initKeyboard: function() {
    document.addEventListener('keydown', function(e) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (document.activeElement !== DOM.countrySearch) {
          if (DOM.countBtn) {
            DOM.countBtn.click();
            DOM.countBtn.setAttribute('aria-pressed', 'true');
          }
        }
      }
      if (e.code === 'Escape') {
        if (DOM.countryModal && DOM.countryModal.classList.contains('active')) {
          CountrySelector.closeModal();
        }
      }
    });

    document.addEventListener('keyup', function(e) {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (DOM.countBtn) DOM.countBtn.setAttribute('aria-pressed', 'false');
      }
    });
  },

  initControls: function() {
    if (DOM.themeToggle) {
      DOM.themeToggle.addEventListener('click', function() { ThemeManager.toggle(); });
    }
    if (DOM.soundToggle) {
      DOM.soundToggle.addEventListener('click', function() { SoundManager.toggle(); });
    }
    if (DOM.resetBtn) {
      DOM.resetBtn.addEventListener('click', function() { CounterEngine.reset(); });
    }
  },

  initTouch: function() {
    document.addEventListener('touchmove', function(e) {
      if (e.target.closest('.country-list')) return;
    }, { passive: true });
  }
};

// ============================================
// تهيئة التطبيق
// ============================================

var App = {
  init: function() {
    try {
      initDOM();
      AppState.load();
      ThemeManager.init();
      SoundManager.init();
      CountrySelector.init();
      RankingSystem.init();
      DhikrManager.updateDisplay();
      EventHandlers.init();

      this.showSplash().then(function() {
        if (!AppState.selectedCountry) {
          CountrySelector.openModal();
        }
        App.revealApp();
      });

    } catch (error) {
      console.error('خطأ في تهيئة التطبيق:', error);
      if (DOM.splashScreen) DOM.splashScreen.classList.add('hidden');
      App.revealApp();
    }
  },

  showSplash: function() {
    return new Promise(function(resolve) {
      var startTime = Date.now();

      var hideSplash = function() {
        var elapsed = Date.now() - startTime;
        var remaining = Math.max(0, CONFIG.SPLASH_MIN_TIME - elapsed);

        setTimeout(function() {
          if (DOM.splashScreen) DOM.splashScreen.classList.add('hidden');
          resolve();
        }, remaining);
      };

      if (document.readyState === 'complete') {
        hideSplash();
      } else {
        window.addEventListener('load', hideSplash);
      }
    });
  },

  revealApp: function() {
    if (DOM.app) {
      DOM.app.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(function() {
        DOM.app.classList.add('visible');
      });
    }
  }
};

// ============================================
// التشغيل
// ============================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    App.init();
  });
} else {
  App.init();
}
