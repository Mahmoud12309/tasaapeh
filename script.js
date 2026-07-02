/**
 * ============================================
 * عداد التسبيح الرقمي - SCRIPT.JS (نسخة مُصلحة)
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
    FIRST_VISIT: 'tasbeeh_first_visit',
    USER_ID: 'tasbeeh_user_id'
  },
  SOUND_ENABLED: true,
  SOUND_VOLUME: 0.3,
  VIBRATION_DURATION: 15,

  // Cactus API - غيّر ده لعنوانك
  API: {
    BASE_URL: 'https://firestore.googleapis.com/v1/projects/tasapeh-56e44/databases/(default)/documents

',  // فاضي = شغال محلي بدون API
    API_KEY: 'cactus_live_02814c86e511017177e4c4d735cd1d31',
    ENDPOINTS: {
      REGISTER: '/api/v1/users/register',
      INCREMENT: '/api/v1/count/increment',
      RANKING: '/api/v1/ranking',
      USER_STATS: '/api/v1/users/stats',
      SYNC: '/api/v1/count/sync'
    },
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  }
};

// قائمة الأذكار
const DHIKR_LIST = [
  { id: 'subhanallah', name: 'سبحان الله', arabic: 'سبحان الله', transliteration: 'Glory be to Allah' },
  { id: 'alhamdulillah', name: 'الحمد لله', arabic: 'الحمد لله', transliteration: 'Praise be to Allah' },
  { id: 'astaghfirullah', name: 'أستغفر الله', arabic: 'أستغفر الله', transliteration: 'I seek forgiveness from Allah' },
  { id: 'la_ilaha', name: 'لا إله إلا الله', arabic: 'لا إله إلا الله', transliteration: 'There is no god but Allah' },
  { id: 'salli_ala', name: 'اللهم صل على محمد', arabic: 'اللهم صل على محمد', transliteration: "O Allah, send blessings upon Muhammad" }
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
// إدارة الحالة - مع حماية كاملة
// ============================================

const AppState = {
  currentDhikrIndex: 0,
  currentDhikrCount: 0,
  totalClicks: 0,
  selectedCountry: null,
  theme: 'light',
  soundEnabled: true,
  isFirstVisit: true,
  userId: null,
  pendingSync: [],

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
        isFirstVisit: false,
        userId: this.userId,
        pendingSync: this.pendingSync
      };
      localStorage.setItem(CONFIG.STORAGE_KEYS.FIRST_VISIT, JSON.stringify(data));
    } catch (e) {
      console.warn('فشل في حفظ الحالة:', e);
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.FIRST_VISIT);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data) {
        this.totalClicks = data.totalClicks || 0;
        this.currentDhikrIndex = data.currentDhikrIndex || 0;
        this.currentDhikrCount = data.currentDhikrCount || 0;
        this.selectedCountry = data.selectedCountry || null;
        this.theme = data.theme || 'light';
        this.soundEnabled = data.soundEnabled !== undefined ? data.soundEnabled : true;
        this.isFirstVisit = false;
        this.userId = data.userId || null;
        this.pendingSync = data.pendingSync || [];
      }
    } catch (e) {
      console.warn('فشل في تحميل الحالة:', e);
    }
  }
};

// ============================================
// Cactus API Client - مع معالجة أخطاء كاملة
// ============================================

const CactusAPI = {
  isAvailable() {
    return CONFIG.API.BASE_URL && CONFIG.API.BASE_URL.length > 0 && 
           !CONFIG.API.BASE_URL.includes('example.com');
  },

  getOrCreateUserId() {
    if (!AppState.userId) {
      AppState.userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      AppState.persist();
    }
    return AppState.userId;
  },

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-User-ID': this.getOrCreateUserId()
    };
    if (CONFIG.API.API_KEY) {
      headers['Authorization'] = `Bearer ${CONFIG.API.API_KEY}`;
    }
    return headers;
  },

  async request(endpoint, options = {}, retryCount = 0) {
    if (!this.isAvailable()) {
      throw new Error('API not configured');
    }

    const url = `${CONFIG.API.BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...this.getHeaders(), ...options.headers },
        signal: AbortSignal.timeout(CONFIG.API.TIMEOUT)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (retryCount < CONFIG.API.RETRY_ATTEMPTS) {
        await new Promise(r => setTimeout(r, CONFIG.API.RETRY_DELAY * (retryCount + 1)));
        return this.request(endpoint, options, retryCount + 1);
      }
      throw error;
    }
  },

  async registerUser() {
    if (!this.isAvailable()) return { success: false };
    try {
      return await this.request(CONFIG.API.ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({
          userId: this.getOrCreateUserId(),
          countryCode: AppState.selectedCountry,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.warn('فشل تسجيل المستخدم:', error);
      return { success: false };
    }
  },

  async incrementCount(countryCode, dhikrId) {
    if (!this.isAvailable() || !countryCode) return { success: false };

    const payload = {
      userId: this.getOrCreateUserId(),
      countryCode: countryCode,
      dhikrId: dhikrId,
      timestamp: Date.now()
    };

    try {
      return await this.request(CONFIG.API.ENDPOINTS.INCREMENT, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (error) {
      this.addToPendingSync(payload);
      return { success: false, queued: true };
    }
  },

  addToPendingSync(payload) {
    AppState.pendingSync.push(payload);
    if (AppState.pendingSync.length > 100) {
      AppState.pendingSync = AppState.pendingSync.slice(-100);
    }
    AppState.persist();
  },

  async syncPending() {
    if (!this.isAvailable() || AppState.pendingSync.length === 0) return;

    const pending = [...AppState.pendingSync];
    const successful = [];

    for (const payload of pending) {
      try {
        await this.request(CONFIG.API.ENDPOINTS.INCREMENT, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        successful.push(payload);
      } catch (error) {
        break;
      }
    }

    AppState.pendingSync = AppState.pendingSync.filter(p => !successful.includes(p));
    AppState.persist();
  },

  async getRanking() {
    if (!this.isAvailable()) throw new Error('API not configured');
    return await this.request(CONFIG.API.ENDPOINTS.RANKING, { method: 'GET' });
  },

  async getUserStats() {
    if (!this.isAvailable()) throw new Error('API not configured');
    return await this.request(CONFIG.API.ENDPOINTS.USER_STATS, { method: 'GET' });
  }
};

// ============================================
// مراجع DOM - مع تحقق من الوجود
// ============================================

function getElement(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`عنصر غير موجود: #${id}`);
  return el;
}

const DOM = {
  app: getElement('app'),
  splashScreen: getElement('splash-screen'),
  countryModal: getElement('country-modal'),
  countrySearch: getElement('country-search'),
  countryList: getElement('country-list'),
  toastContainer: getElement('toast-container'),
  themeToggle: getElement('theme-toggle'),
  soundToggle: getElement('sound-toggle'),
  resetBtn: getElement('reset-btn'),
  dhikrName: getElement('dhikr-name'),
  dhikrTransliteration: getElement('dhikr-transliteration'),
  dhikrProgressBar: getElement('dhikr-progress-bar'),
  dhikrRemaining: getElement('dhikr-remaining'),
  currentCount: getElement('current-count'),
  totalCount: getElement('total-count'),
  countBtn: getElement('count-btn'),
  countBtnRipple: document.querySelector('.count-btn-ripple'),
  rankingList: getElement('ranking-list')
};

// ============================================
// محرك الصوت
// ============================================

const AudioEngine = {
  ctx: null,

  init() {
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

  playClick() {
    if (!AppState.soundEnabled || !this.ctx) return;
    try {
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
    } catch (e) {
      // صوت مش شغال، استمر
    }
  },

  playCompletion() {
    if (!AppState.soundEnabled || !this.ctx) return;
    try {
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
    } catch (e) {
      // استمر بدون صوت
    }
  }
};

// ============================================
// محرك الاهتزاز
// ============================================

const VibrationEngine = {
  trigger() {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(CONFIG.VIBRATION_DURATION);
      }
    } catch (e) {
      // استمر بدون اهتزاز
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

    if (DOM.toastContainer) {
      DOM.toastContainer.appendChild(toast);
      toast.offsetHeight;

      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      await this.wait(duration);

      toast.classList.remove('show');
      toast.classList.add('hide');

      await this.wait(300);
      if (toast.parentNode) toast.remove();
    }

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
    if (!DOM.countrySearch) return;

    DOM.countrySearch.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    DOM.countrySearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstItem = DOM.countryList ? DOM.countryList.querySelector('.country-item') : null;
        if (firstItem) firstItem.click();
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
    if (!DOM.countryList) return;
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
      item.addEventListener('click', () => this.selectCountry(country));
      fragment.appendChild(item);
    });
    DOM.countryList.appendChild(fragment);
  },

  async selectCountry(country) {
    AppState.setState({ selectedCountry: country.code });
    this.closeModal();

    if (CactusAPI.isAvailable()) {
      try {
        await CactusAPI.registerUser();
        ToastSystem.show(`تم الاختيار: ${country.flag} ${country.name} ✅`, 'default', 1500);
      } catch (error) {
        ToastSystem.show(`تم الاختيار: ${country.flag} ${country.name}`, 'default', 1500);
      }
    } else {
      ToastSystem.show(`تم الاختيار: ${country.flag} ${country.name}`, 'default', 1500);
    }

    RankingSystem.render();
    RankingSystem.syncWithBackend();
  },

  openModal() {
    if (!DOM.countryModal) return;
    DOM.countryModal.classList.add('active');
    DOM.countryModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      if (DOM.countrySearch) DOM.countrySearch.focus();
    }, 300);
    if (DOM.countrySearch) DOM.countrySearch.value = '';
    this.filteredCountries = [...COUNTRIES];
    this.renderList();
  },

  closeModal() {
    if (!DOM.countryModal) return;
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
// نظام التصنيف - يعمل محلي ومع API
// ============================================

const RankingSystem = {
  rankingData: [],
  isLoading: false,
  lastSyncTime: null,
  apiConnected: false,

  init() {
    this.loadFromStorage();
    this.render();
    this.syncWithBackend();
    setInterval(() => this.syncWithBackend(), 30000);
  },

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('tasbeeh_ranking_cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.rankingData = parsed.data || [];
        this.lastSyncTime = parsed.timestamp || null;
      } else {
        this.rankingData = [];
      }
    } catch (e) {
      this.rankingData = [];
    }
  },

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

  async syncWithBackend() {
    if (!CactusAPI.isAvailable()) {
      this.apiConnected = false;
      this.render();
      return;
    }

    this.isLoading = true;
    this.render();

    try {
      await CactusAPI.syncPending();
      const result = await CactusAPI.getRanking();

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
        this.apiConnected = true;
        this.lastSyncTime = Date.now();
        this.saveToStorage();
      }
    } catch (error) {
      console.warn('تعذر الاتصال بـ API:', error);
      this.apiConnected = false;
    } finally {
      this.isLoading = false;
      this.render();
    }
  },

  async incrementCountryClicks(countryCode) {
    if (!countryCode) return;
    this.updateLocalRanking(countryCode);

    if (CactusAPI.isAvailable()) {
      try {
        const result = await CactusAPI.incrementCount(
          countryCode, 
          DHIKR_LIST[AppState.currentDhikrIndex].id
        );
        if (result.success && result.ranking) {
          this.rankingData = result.ranking.map(item => {
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
          this.render();
        }
      } catch (error) {
        console.warn('فشل إرسال العداد:', error);
      }
    }
  },

  updateLocalRanking(countryCode) {
    const entry = this.rankingData.find(r => r.countryCode === countryCode);
    if (entry) {
      entry.totalClicks += 1;
    } else {
      const country = COUNTRIES.find(c => c.code === countryCode);
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
    this.rankingData.sort((a, b) => b.totalClicks - a.totalClicks);
    this.rankingData.forEach((item, index) => { item.rank = index + 1; });
    this.saveToStorage();
    this.render();
  },

  formatNumber(num) {
    return num.toLocaleString('ar-SA');
  },

  render() {
    if (!DOM.rankingList) return;
    DOM.rankingList.innerHTML = '';

    if (this.isLoading) {
      DOM.rankingList.innerHTML = `
        <div style="text-align:center;padding:2rem;color:var(--color-text-muted)">
          <div style="font-size:2rem;margin-bottom:0.5rem">⏳</div>
          <div style="font-weight:600">جاري تحميل التصنيف...</div>
        </div>`;
      return;
    }

    const isApiConfigured = CactusAPI.isAvailable();

    if (!isApiConfigured && this.rankingData.length === 0) {
      DOM.rankingList.innerHTML = `
        <div style="text-align:center;padding:2rem;color:var(--color-text-muted)">
          <div style="font-size:2rem;margin-bottom:0.5rem">📊</div>
          <div style="font-weight:600;margin-bottom:0.25rem">التصنيف المحلي</div>
          <div style="font-size:0.875rem">ابدأ العد ليظهر تصنيف بلدك</div>
        </div>`;
      return;
    }

    if (!this.apiConnected && this.rankingData.length === 0) {
      DOM.rankingList.innerHTML = `
        <div style="text-align:center;padding:2rem;color:var(--color-text-muted)">
          <div style="font-size:2rem;margin-bottom:0.5rem">📡</div>
          <div style="font-weight:600;margin-bottom:0.25rem">تعذر الاتصال بالخادم</div>
          <div style="font-size:0.875rem">التصنيف سيظهر عند استعادة الاتصال</div>
        </div>`;
      return;
    }

    if (this.rankingData.length === 0) {
      DOM.rankingList.innerHTML = `
        <div style="text-align:center;padding:2rem;color:var(--color-text-muted)">
          <div style="font-size:2rem;margin-bottom:0.5rem">📊</div>
          <div style="font-weight:600">التصنيف العالمي</div>
          <div style="font-size:0.875rem">ابدأ العد ليظهر تصنيف بلدك هنا</div>
        </div>`;
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
    if (nameEl) nameEl.classList.add('changing');
    if (transEl) transEl.classList.add('changing');

    setTimeout(() => {
      this.updateDisplay();
      if (nameEl) nameEl.classList.remove('changing');
      if (transEl) transEl.classList.remove('changing');
      AudioEngine.playCompletion();
    }, 300);
  },

  updateDisplay() {
    const dhikr = this.getCurrentDhikr();
    const remaining = this.getRemaining();
    const progress = this.getProgress();

    if (DOM.dhikrName) DOM.dhikrName.textContent = dhikr.name;
    if (DOM.dhikrTransliteration) DOM.dhikrTransliteration.textContent = dhikr.transliteration;
    if (DOM.dhikrRemaining) DOM.dhikrRemaining.textContent = `متبقي ${remaining}`;
    if (DOM.dhikrProgressBar) {
      DOM.dhikrProgressBar.style.width = `${progress}%`;
      DOM.dhikrProgressBar.setAttribute('aria-valuenow', AppState.currentDhikrCount);
    }
    if (DOM.currentCount) DOM.currentCount.textContent = AppState.currentDhikrCount;
    if (DOM.totalCount) DOM.totalCount.textContent = AppState.totalClicks.toLocaleString('ar-SA');
  }
};

// ============================================
// محرك العداد
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

    RankingSystem.incrementCountryClicks(AppState.selectedCountry);
  },

  triggerEffects() {
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
      'ممتاز! جزاك الله خيراُ.',
      'ما شاء الله! استمر.',
      'بارك الله فيك! رائع.',
      'جزاك الله خيراُ على ذكرك.',
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
      if (!AppState.theme) this.setTheme(e.matches ? 'dark' : 'light');
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
    if (!btn) return;

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

    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (DOM.countBtn) DOM.countBtn.setAttribute('aria-pressed', 'false');
      }
    });
  },

  initControls() {
    if (DOM.themeToggle) {
      DOM.themeToggle.addEventListener('click', () => ThemeManager.toggle());
    }
    if (DOM.soundToggle) {
      DOM.soundToggle.addEventListener('click', () => SoundManager.toggle());
    }
    if (DOM.resetBtn) {
      DOM.resetBtn.addEventListener('click', () => CounterEngine.reset());
    }
  },

  initTouch() {
    document.addEventListener('touchmove', (e) => {
      if (e.target.closest('.country-list')) return;
    }, { passive: true });
  }
};

// ============================================
// تهيئة التطبيق - مع حماية كاملة من الأخطاء
// ============================================

const App = {
  async init() {
    try {
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

      if (CactusAPI.isAvailable()) {
        CactusAPI.syncPending().catch(() => {});
      }
    } catch (error) {
      console.error('خطأ في تهيئة التطبيق:', error);
      // حتى لو فيه خطأ، أخفي شاشة التحميل
      if (DOM.splashScreen) DOM.splashScreen.classList.add('hidden');
      if (DOM.app) {
        DOM.app.setAttribute('aria-hidden', 'false');
        DOM.app.classList.add('visible');
      }
    }
  },

  showSplash() {
    return new Promise(resolve => {
      const startTime = Date.now();

      const hideSplash = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, CONFIG.SPLASH_MIN_TIME - elapsed);

        setTimeout(() => {
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

  revealApp() {
    if (DOM.app) {
      DOM.app.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => {
        DOM.app.classList.add('visible');
      });
    }
  }
};

// ============================================
// التشغيل
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
