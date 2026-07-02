/**
 * ============================================
 * عداد التسبيح الرقمي - SCRIPT.JS
 * نظام عداد حقيقي 100% مع API للخلفية
 * ============================================
 */

// ============================================
// الإعدادات والثوابت
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
    FIRST_VISIT: 'tasbeeh_first_visit'
  },
  SOUND_ENABLED: true,
  SOUND_VOLUME: 0.3,
  VIBRATION_DURATION: 15,

  // إعدادات API - عدّل هذه القيم عند ربط الخلفية
  API: {
    // قم بتغيير هذا إلى عنوان خادمك الحقيقي
    BASE_URL: '', // مثال: 'https://api.tasbeeh.app' أو '' للتخزين المحلي فقط
    ENDPOINTS: {
      INCREMENT: '/api/count/increment',
      RANKING: '/api/ranking',
      USER_STATS: '/api/user/stats'
    }
  }
};

// قائمة الأذكار بالعربية
const DHIKR_LIST = [
  { id: 'subhanallah', name: 'سبحان الله', arabic: 'سبحان الله', transliteration: 'Glory be to Allah' },
  { id: 'alhamdulillah', name: 'الحمد لله', arabic: 'الحمد لله', transliteration: 'Praise be to Allah' },
  { id: 'astaghfirullah', name: 'أستغفر الله', arabic: 'أستغفر الله', transliteration: 'I seek forgiveness from Allah' },
  { id: 'la_ilaha', name: 'لا إله إلا الله', arabic: 'لا إله إلا الله', transliteration: 'There is no god but Allah' },
  { id: 'salli_ala', name: 'اللهم صل على محمد', arabic: 'اللهم صل على محمد', transliteration: "O Allah, send blessings upon Muhammad" }
];

// بيانات الدول باللغة العربية
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
// إدارة الحالة - عداد حقيقي يبدأ من صفر
// ============================================

const AppState = {
  currentDhikrIndex: 0,
  currentDhikrCount: 0,
  totalClicks: 0,
  selectedCountry: null,
  theme: 'light',
  soundEnabled: true,
  isFirstVisit: true,

  setState(updates) {
    Object.assign(this, updates);
    this.persist();
  },

  persist() {
    try {
      const data = {
        totalClicks: this.totalClicks,
        currentDhikrIndex: this.currentDhikrIndex,
        currentDhikrCount: this.currentDhikrCount,
        selectedCountry: this.selectedCountry,
        theme: this.theme,
        soundEnabled: this.soundEnabled,
        isFirstVisit: false
      };
      localStorage.setItem(CONFIG.STORAGE_KEYS.FIRST_VISIT, JSON.stringify(data));
    } catch (e) {
      console.warn('فشل في حفظ الحالة:', e);
    }
  },

  load() {
    try {
      const data = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FIRST_VISIT));
      if (data) {
        this.totalClicks = data.totalClicks || 0;
        this.currentDhikrIndex = data.currentDhikrIndex || 0;
        this.currentDhikrCount = data.currentDhikrCount || 0;
        this.selectedCountry = data.selectedCountry || null;
        this.theme = data.theme || 'light';
        this.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
        this.isFirstVisit = false;
      }
    } catch (e) {
      console.warn('فشل في تحميل الحالة:', e);
    }
  }
};

// ============================================
// مراجع عناصر DOM
// ============================================

const DOM = {
  app: document.getElementById('app'),
  splashScreen: document.getElementById('splash-screen'),
  countryModal: document.getElementById('country-modal'),
  countrySearch: document.getElementById('country-search'),
  countryList: document.getElementById('country-list'),
  toastContainer: document.getElementById('toast-container'),
  themeToggle: document.getElementById('theme-toggle'),
  soundToggle: document.getElementById('sound-toggle'),
  resetBtn: document.getElementById('reset-btn'),
  dhikrName: document.getElementById('dhikr-name'),
  dhikrTransliteration: document.getElementById('dhikr-transliteration'),
  dhikrProgressBar: document.getElementById('dhikr-progress-bar'),
  dhikrRemaining: document.getElementById('dhikr-remaining'),
  currentCount: document.getElementById('current-count'),
  totalCount: document.getElementById('total-count'),
  countBtn: document.getElementById('count-btn'),
  countBtnRipple: document.querySelector('.count-btn-ripple'),
  rankingList: document.getElementById('ranking-list')
};

// ============================================
// محرك الصوت
// ============================================

const AudioEngine = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playClick() {
    if (!AppState.soundEnabled) return;
    this.init();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(CONFIG.SOUND_VOLUME, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.15);
  },

  playCompletion() {
    if (!AppState.soundEnabled) return;
    this.init();

    const frequencies = [523.25, 659.25, 783.99];

    frequencies.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * 0.05);
      gain.gain.linearRampToValueAtTime(CONFIG.SOUND_VOLUME * 0.5, this.ctx.currentTime + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.05 + 0.3);

      osc.start(this.ctx.currentTime + i * 0.05);
      osc.stop(this.ctx.currentTime + i * 0.05 + 0.3);
    });
  }
};

// ============================================
// محرك الاهتزاز
// ============================================

const VibrationEngine = {
  trigger() {
    if (navigator.vibrate) {
      navigator.vibrate(CONFIG.VIBRATION_DURATION);
    }
  }
};

// ============================================
// نظام الإشعارات (Toast)
// ============================================

const ToastSystem = {
  queue: [],
  isShowing: false,

  show(message, type = 'default', duration = CONFIG.TOAST_DURATION) {
    this.queue.push({ message, type, duration });
    if (!this.isShowing) {
      this.processQueue();
    }
  },

  async processQueue() {
    if (this.queue.length === 0) {
      this.isShowing = false;
      return;
    }

    this.isShowing = true;
    const { message, type, duration } = this.queue.shift();

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'gold' ? 'toast-gold' : ''}`;
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    DOM.toastContainer.appendChild(toast);
    toast.offsetHeight;

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    await this.wait(duration);

    toast.classList.remove('show');
    toast.classList.add('hide');

    await this.wait(300);
    toast.remove();

    this.processQueue();
  },

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// ============================================
// محدد الدول
// ============================================

const CountrySelector = {
  filteredCountries: [],

  init() {
    this.filteredCountries = [...COUNTRIES];
    this.renderList();
    this.attachEvents();
  },

  attachEvents() {
    DOM.countrySearch.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    DOM.countrySearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstItem = DOM.countryList.querySelector('.country-item');
        if (firstItem) {
          firstItem.click();
        }
      }
    });
  },

  handleSearch(query) {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      this.filteredCountries = [...COUNTRIES];
    } else {
      this.filteredCountries = COUNTRIES.filter(country => 
        country.name.toLowerCase().includes(normalizedQuery) ||
        country.code.toLowerCase().includes(normalizedQuery)
      );
    }

    this.renderList();
  },

  renderList() {
    DOM.countryList.innerHTML = '';

    if (this.filteredCountries.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'country-item-empty';
      empty.textContent = 'لم يتم العثور على دول';
      DOM.countryList.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();

    this.filteredCountries.forEach(country => {
      const item = document.createElement('button');
      item.className = 'country-item';
      item.setAttribute('role', 'option');
      item.setAttribute('aria-label', `اختيار ${country.name}`);
      item.innerHTML = `
        <span class="country-item-flag" aria-hidden="true">${country.flag}</span>
        <span class="country-item-name">${this.escapeHtml(country.name)}</span>
      `;

      item.addEventListener('click', () => {
        this.selectCountry(country);
      });

      fragment.appendChild(item);
    });

    DOM.countryList.appendChild(fragment);
  },

  selectCountry(country) {
    AppState.setState({ selectedCountry: country.code });
    this.closeModal();
    RankingSystem.render();
    ToastSystem.show(`تم الاختيار: ${country.flag} ${country.name}`, 'default', 1500);
  },

  openModal() {
    DOM.countryModal.classList.add('active');
    DOM.countryModal.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      DOM.countrySearch.focus();
    }, 300);

    DOM.countrySearch.value = '';
    this.filteredCountries = [...COUNTRIES];
    this.renderList();
  },

  closeModal() {
    DOM.countryModal.classList.remove('active');
    DOM.countryModal.setAttribute('aria-hidden', 'true');
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// ============================================
// نظام التصنيف الحقيقي - يبدأ من صفر
// ============================================

const RankingSystem = {
  rankingData: [],
  isLoading: false,
  lastSyncTime: null,

  init() {
    this.loadFromStorage();
    this.render();
    // محاولة المزامنة مع الخلفية عند التحميل
    this.syncWithBackend();
  },

  /**
   * تحميل البيانات من التخزين المحلي (للعرض المؤقت فقط)
   * التصنيف الحقيقي يأتي دائماً من الخلفية
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('tasbeeh_ranking_cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.rankingData = parsed.data || [];
        this.lastSyncTime = parsed.timestamp || null;
      } else {
        // يبدأ من صفر - لا بيانات وهمية
        this.rankingData = [];
      }
    } catch (e) {
      this.rankingData = [];
    }
  },

  /**
   * حفظ البيانات مؤقتاً في التخزين المحلي
   */
  saveToStorage() {
    try {
      localStorage.setItem('tasbeeh_ranking_cache', JSON.stringify({
        data: this.rankingData,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('فشل في حفظ التصنيف:', e);
    }
  },

  /**
   * المزامنة مع الخلفية - جلب التصنيف الحقيقي
   * 
   * TODO: قم بتفعيل هذا عند ربط خلفية حقيقية
   * يجب أن يُرجع الخادم JSON بالهيكل التالي:
   * {
   *   "success": true,
   *   "data": [
   *     { "countryCode": "SA", "totalClicks": 150, "rank": 1 },
   *     { "countryCode": "EG", "totalClicks": 120, "rank": 2 }
   *   ]
   * }
   */
  async syncWithBackend() {
    // إذا لم يكن هناك API مُعد، نستخدم التخزين المحلي فقط
    if (!CONFIG.API.BASE_URL) {
      // التصنيف يعتمد فقط على النقرات الحقيقية للمستخدم الحالي
      // والبيانات المخزنة محلياً
      this.render();
      return;
    }

    this.isLoading = true;
    this.render(); // إظهار حالة التحميل

    try {
      const response = await fetch(`${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.RANKING}`);
      if (!response.ok) throw new Error('فشل في جلب التصنيف');

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        this.rankingData = result.data.map(item => {
          const country = COUNTRIES.find(c => c.code === item.countryCode);
          return {
            rank: item.rank,
            countryCode: item.countryCode,
            countryName: country ? country.name : item.countryCode,
            flag: country ? country.flag : '🏳️',
            totalClicks: item.totalClicks
          };
        });
        this.saveToStorage();
      }
    } catch (error) {
      console.warn('تعذر الاتصال بالخلفية، استخدام البيانات المحلية:', error);
      // نستمر بالبيانات المحلية - لا بيانات وهمية
    } finally {
      this.isLoading = false;
      this.render();
    }
  },

  /**
   * إرسال عداد حقيقي إلى الخلفية
   * 
   * TODO: قم بتفعيل هذا عند ربط خلفية حقيقية
   * يجب أن يستقبل الخادم:
   * POST /api/count/increment
   * Body: { "countryCode": "SA", "dhikrId": "subhanallah", "timestamp": 1234567890 }
   * 
   * ويُرجع:
   * { "success": true, "newTotal": 151, "userRank": 5 }
   */
  async incrementCountryClicks(countryCode) {
    if (!countryCode) return;

    // تحديث محلي فوري (العداد الحقيقي للمستخدم)
    this.updateLocalRanking(countryCode);

    // إذا كان هناك API مُعد، أرسل البيانات
    if (CONFIG.API.BASE_URL) {
      try {
        const response = await fetch(`${CONFIG.API.BASE_URL}${CONFIG.API.ENDPOINTS.INCREMENT}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            countryCode: countryCode,
            dhikrId: DHIKR_LIST[AppState.currentDhikrIndex].id,
            timestamp: Date.now()
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // تحديث التصنيف بالقيمة الحقيقية من الخادم
            this.syncWithBackend();
          }
        }
      } catch (error) {
        console.warn('فشل إرسال العداد إلى الخلفية:', error);
        // نستمر بالتحديث المحلي - العداد حقيقي
      }
    }
  },

  /**
   * تحديث التصنيف محلياً - عداد حقيقي فقط
   */
  updateLocalRanking(countryCode) {
    const entry = this.rankingData.find(r => r.countryCode === countryCode);

    if (entry) {
      // زيادة العداد الحقيقي
      entry.totalClicks += 1;
    } else {
      // إضافة دولة جديدة بالعداد 1 (أول نقرة حقيقية)
      const country = COUNTRIES.find(c => c.code === countryCode);
      if (country) {
        this.rankingData.push({
          rank: this.rankingData.length + 1,
          countryCode: countryCode,
          countryName: country.name,
          flag: country.flag,
          totalClicks: 1  // يبدأ من 1 - عداد حقيقي
        });
      }
    }

    // إعادة الترتيب حسب العداد (تنازلي)
    this.rankingData.sort((a, b) => b.totalClicks - a.totalClicks);

    // تحديث المراكز
    this.rankingData.forEach((item, index) => {
      item.rank = index + 1;
    });

    this.saveToStorage();
    this.render();
  },

  formatNumber(num) {
    return num.toLocaleString('ar-SA');
  },

  render() {
    DOM.rankingList.innerHTML = '';

    // إذا كان التصنيف فارغاً، اعرض رسالة توضيحية
    if (this.rankingData.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'ranking-empty-state';
      emptyState.style.cssText = 'text-align: center; padding: 2rem; color: var(--color-text-muted);';
      emptyState.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">📊</div>
        <div style="font-weight: 600; margin-bottom: 0.25rem;">التصنيف العالمي</div>
        <div style="font-size: 0.875rem;">ابدأ العد ليظهر تصنيف بلدك هنا</div>
      `;
      DOM.rankingList.appendChild(emptyState);
      return;
    }

    const fragment = document.createDocumentFragment();
    const displayData = this.rankingData.slice(0, 10);

    displayData.forEach(item => {
      const isUserCountry = item.countryCode === AppState.selectedCountry;

      const row = document.createElement('div');
      row.className = `ranking-item ${isUserCountry ? 'highlight' : ''}`;
      row.setAttribute('role', 'listitem');

      const rankClass = item.rank === 1 ? 'gold' : 
                        item.rank === 2 ? 'silver' : 
                        item.rank === 3 ? 'bronze' : 'normal';

      row.innerHTML = `
        <div class="ranking-rank ${rankClass}" aria-label="المرتبة ${item.rank}">${item.rank}</div>
        <span class="ranking-flag" aria-hidden="true">${item.flag}</span>
        <span class="ranking-country">${this.escapeHtml(item.countryName)}</span>
        <span class="ranking-clicks">${this.formatNumber(item.totalClicks)}</span>
      `;

      fragment.appendChild(row);
    });

    DOM.rankingList.appendChild(fragment);
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

// ============================================
// مدير الذكر
// ============================================

const DhikrManager = {
  getCurrentDhikr() {
    return DHIKR_LIST[AppState.currentDhikrIndex];
  },

  getRemaining() {
    return CONFIG.DHIKR_CYCLE_SIZE - AppState.currentDhikrCount;
  },

  getProgress() {
    return (AppState.currentDhikrCount / CONFIG.DHIKR_CYCLE_SIZE) * 100;
  },

  nextDhikr() {
    const nextIndex = (AppState.currentDhikrIndex + 1) % DHIKR_LIST.length;
    AppState.setState({
      currentDhikrIndex: nextIndex,
      currentDhikrCount: 0
    });

    this.animateTransition();
  },

  animateTransition() {
    const nameEl = DOM.dhikrName;
    const transEl = DOM.dhikrTransliteration;

    nameEl.classList.add('changing');
    transEl.classList.add('changing');

    setTimeout(() => {
      this.updateDisplay();
      nameEl.classList.remove('changing');
      transEl.classList.remove('changing');
      AudioEngine.playCompletion();
    }, 300);
  },

  updateDisplay() {
    const dhikr = this.getCurrentDhikr();
    const remaining = this.getRemaining();
    const progress = this.getProgress();

    DOM.dhikrName.textContent = dhikr.name;
    DOM.dhikrTransliteration.textContent = dhikr.transliteration;
    DOM.dhikrRemaining.textContent = `متبقي ${remaining}`;

    DOM.dhikrProgressBar.style.width = `${progress}%`;
    DOM.dhikrProgressBar.setAttribute('aria-valuenow', AppState.currentDhikrCount);

    DOM.currentCount.textContent = AppState.currentDhikrCount;
    DOM.totalCount.textContent = AppState.totalClicks.toLocaleString('ar-SA');
  }
};

// ============================================
// محرك العداد الحقيقي
// ============================================

const CounterEngine = {
  count() {
    const newDhikrCount = AppState.currentDhikrCount + 1;
    const newTotalClicks = AppState.totalClicks + 1;

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

    // إرسال العداد الحقيقي إلى التصنيف
    RankingSystem.incrementCountryClicks(AppState.selectedCountry);
  },

  triggerEffects() {
    DOM.currentCount.classList.remove('pulse');
    void DOM.currentCount.offsetWidth;
    DOM.currentCount.classList.add('pulse');

    DOM.countBtnRipple.classList.remove('active');
    void DOM.countBtnRipple.offsetWidth;
    DOM.countBtnRipple.classList.add('active');

    DOM.countBtn.classList.remove('pulse-ring');
    void DOM.countBtn.offsetWidth;
    DOM.countBtn.classList.add('pulse-ring');

    AudioEngine.playClick();
    VibrationEngine.trigger();
  },

  handleDhikrComplete() {
    DhikrManager.nextDhikr();

    ToastSystem.show(
      `تم الإكمال! التالي: ${DhikrManager.getCurrentDhikr().name}`,
      'gold',
      2500
    );
  },

  showEncouragement() {
    const messages = [
      'ممتاز! جزاك الله خيراً.',
      'ما شاء الله! استمر.',
      'بارك الله فيك! رائع.',
      'جزاك الله خيراً على ذكرك.',
      'جميل! استمر على الاستمرارية.'
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];
    ToastSystem.show(message, 'gold');
  },

  reset() {
    AppState.setState({ currentDhikrCount: 0 });
    DhikrManager.updateDisplay();
    ToastSystem.show('تم إعادة تعيين الذكر الحالي', 'default', 1500);
  }
};

// ============================================
// مدير الوضع (فاتح/داكن)
// ============================================

const ThemeManager = {
  init() {
    const savedTheme = AppState.theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(theme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!AppState.theme) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  },

  setTheme(theme) {
    AppState.setState({ theme });
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggle() {
    const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }
};

// ============================================
// مدير الصوت
// ============================================

const SoundManager = {
  init() {
    document.body.setAttribute('data-sound', AppState.soundEnabled ? 'on' : 'off');
  },

  toggle() {
    const newState = !AppState.soundEnabled;
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

const EventHandlers = {
  init() {
    this.initCountButton();
    this.initKeyboard();
    this.initControls();
    this.initTouch();
  },

  initCountButton() {
    const btn = DOM.countBtn;

    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      btn.setAttribute('aria-pressed', 'true');
    });

    btn.addEventListener('mouseup', () => {
      btn.setAttribute('aria-pressed', 'false');
    });

    btn.addEventListener('mouseleave', () => {
      btn.setAttribute('aria-pressed', 'false');
    });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      CounterEngine.count();
    });

    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      btn.click();
    });
  },

  initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (document.activeElement !== DOM.countrySearch) {
          DOM.countBtn.click();
          DOM.countBtn.setAttribute('aria-pressed', 'true');
        }
      }

      if (e.code === 'Escape') {
        if (DOM.countryModal.classList.contains('active')) {
          CountrySelector.closeModal();
        }
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        DOM.countBtn.setAttribute('aria-pressed', 'false');
      }
    });
  },

  initControls() {
    DOM.themeToggle.addEventListener('click', () => {
      ThemeManager.toggle();
    });

    DOM.soundToggle.addEventListener('click', () => {
      SoundManager.toggle();
    });

    DOM.resetBtn.addEventListener('click', () => {
      CounterEngine.reset();
    });
  },

  initTouch() {
    document.addEventListener('touchmove', (e) => {
      if (e.target.closest('.country-list')) {
        return;
      }
    }, { passive: true });
  }
};

// ============================================
// تهيئة التطبيق
// ============================================

const App = {
  async init() {
    AppState.load();

    ThemeManager.init();
    SoundManager.init();
    CountrySelector.init();
    RankingSystem.init();
    DhikrManager.updateDisplay();
    EventHandlers.init();

    await this.showSplash();

    if (!AppState.selectedCountry) {
      CountrySelector.openModal();
    }

    this.revealApp();
  },

  showSplash() {
    return new Promise(resolve => {
      const startTime = Date.now();

      const hideSplash = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, CONFIG.SPLASH_MIN_TIME - elapsed);

        setTimeout(() => {
          DOM.splashScreen.classList.add('hidden');
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

  revealApp() {
    DOM.app.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      DOM.app.classList.add('visible');
    });
  }
};

// ============================================
// التشغيل
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
