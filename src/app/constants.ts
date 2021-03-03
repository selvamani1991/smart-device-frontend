export const APP_CONSTANTS = {
    LINK: {
        HOME: '',
        AUTH: '',
        MAIN: '',
        USER: 'user',
        PERMISSION: 'permission',
        EXTERNAL: '',
        COMPANY:'company',
        DISTRIBUTOR:'distributor',
        CITY:'city',
        CLIENT:'client',
        MACHINE_MANUFACTURER:'machine-manufacturer',
        VENDOR: 'vendor',
        REPORT:'report',
        ATTENDANCE:'attendance',
        BUILDING:'building',
        COMPANY_BUILDING:"company-building",
        BOARD:'board',
        BOARD_MANUFACTURER:'board-manufacturer',
        PRODUCT_SUBSCRIPTION:'product-subscription',
        PRODUCT_CATEGORY:'product-category',
        PRODUCT:'product',
        PRODUCT_TYPE:'product-type',
        MACHINE:'machine',
        CONSUMER:'consumer',
        ZONE:'zone',
        INVOICE:'invoice',
        SUBSCRIPTION:'subscription',
        TELEMETRIC_DATA:'telemetric-data',
        MEDIA:'media',
        RESOURCES:'resources',
        PRODUCT_WIZARD:'product-wizard',
        CONSUMER_SUBSCRIPTION:'consumer-subscription',
        ROOM_TYPE:'room-type',
        PAGE404: "/page-not-found-404-error",
        OTHERS: '**'
    },
    URL: {
        DASHBOARD: 'dashboard',
        HOME: '',
        AUTH: '',
        MAIN: '',
        PAGE404: "/page-not-found-404-error",
        OTHERS: '**'
    },
    OTHER: {
        DOUBLECOLON: '::'
    }

};

export const APP_CONFIG = {
    'APP_NAME': 'TALKIO',
    'APP_VERSION': '0.0.0',
    'GOOGLE_ANALYTICS_ID': '',
     'BASE_URL': 'http://dev.talkio.co.in',
    'CONTEXT': "http://dev.talkio.co.in/smart-device",
    /*'BASE_URL': 'http://localhost:8080',
    'CONTEXT': "http://localhost:8080/smart-device",*/
    'API_URL': "/apis/",
    'API_VERSION': "v1",
    "IMAGE_URL": "http://smart-device.s3.amazonaws.com",
    'SYSTEM_LANGUAGE': '',
    'CONTACT_EMAIL': 'contact@smart-device.in',
    'PAGE_SIZE': 8,
    'CONTACT_PHONE': '+91-9108078692',
    'DASHBOARD': 'dashboard'
};

export const COMMON_CONSTANTS = {
    "MESSAGES": {
        SUCCESS: 0,
        ERROR: 1,
        INFO: 2
    }
};

export const LOCALES= {
    'locales':[
        {'localeId': 'en','name':'English','code':'flag-icon-us'},
        //{'localeId': 'it', 'name':'Italiano','code':'flag-icon-it'},
        //{'localeId': 'de', 'name':'Deutsch','code':'flag-icon-de'}
    ],
    'preferredLocale': 'en'
};

export const SERVICE_PERIODS={
  'servicePeriods':[
      {'id':15,'name':"Fortnightly"},
      {'id':30,'name':"Monthly"},
      {'id':60,'name':"BiMonthly"},
      {'id':90,'name':"Quarterly"},
      {'id':180,'name':"HalfYearly"},
      {'id':360,'name':"Yearly"},
  ],
};

export const USER_TYPES={
  'userTypes':[
     // {'id':1,'name':"Admin"},
      {'id':2,'name':"SuperAdmin"},
      {'id':3,'name':"CompanyBuildingAdmin"},
      {'id':4,'name':"DistributorAdmin"},
      {'id':5,'name':"CompanyAdmin"},
      {'id':6,'name':"BoardAdmin"},
      {'id':7,'name':"VendorAdmin"},
      {'id':8,'name':"ManufacturerAdmin"},
      {'id':9,'name':"ClientAdmin"}
  ],
};

export const STATUS={
  'statuses':[
      {'id':1,'name':"Accepted"},
      {'id':2,'name':"Rejected"},
      {'id':3,'name':"Pending"},
      {'id':4,'name':"Started"},
      {'id':5,'name':"Done"}
  ],
};

export const ERROR_CODE={
    "code_1": 1,
    "code_2": 2,
    "code_3": 3,
    "code_4": 4,
    "code_5": 5,
    "code_6": 6,
    "code_7": 7,
    "code_8": 8,
    "code_9": 9,
    "code_10": 10,
    "code_11": 11,
    "code_12": 12,
    "code_13": 13,
    "code_14": 14,
    "code_15": 15,
    "code_16": 16,
    "code_17": 17,
    "code_18": 18,
    "code_19": 19,
    "code_20": 20,
    "code_25": 25,
    "code_26": 26,
    "code_29": 29,
    "code_404": 404
};
export const SUCCESS_CODE={
    "code_1": 1,
    "code_2": 2,
    "code_3": 3,
    "code_4": 4,
    "code_5": 5,
    "code_6": 6,
    "code_7": 7,
    "code_8": 8,
    "code_9": 9,
    "code_10": 10,
    "code_11": 11,
    "code_12": 12,
    "code_13": 13,
    "code_14": 14,
    "code_15": 15,
    "code_16": 16,
    "code_17": 17,
    "code_18": 18,
    "code_19": 19,
    "code_20": 20
};
