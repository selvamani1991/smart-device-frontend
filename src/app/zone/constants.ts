export const ZONE_CONSTANTS = {
    'URL': {
        ZONE: '/zone',
        ZONE_LIST: '/zone/list',
        ZONE_EDIT: '/zone/edit',
        ZONE_SHOW: '/zone/show',
        ZONE_CREATE: '/zone/create'


    },

    LINK: {
        LIST: 'list',
        // CREATE: 'create/:alias',
        CREATE: 'create',
        SHOW: 'show/:alias',
        EDIT: 'edit/:alias'

    },

    LABEL: {
        ZONE: 'Zone',
        PRODUCT: 'Product',
        PRODUCT_LIST: 'Product List',
        PRODUCT_LIST_DESC: 'Product List Desc',
        ZONE_PASSWORD: 'Zone Password',
        MACHINE_PRODUCT_TYPE: 'Machine Product Type',
        ZONE_IMAGE: 'Image',
        ZONE_IMAGES: 'Image',
        ZONE_LIST_LINK: 'zone.list.pageLink',
        MACHINE_PRODUCT_LINK: 'zone.list.machineProduct',
        ZONE_PRODUCT_LINK: 'zone.list.zoneProduct',
        NEW_ZONE_PRODUCT_LINK: 'zone.list.newZoneProduct',
        ZONE_LIST: 'zone.list.pageTitle',
        ZONE_LIST_DESC: 'zone.list.pageDesc',
        ZONE_EDIT_LINK: 'zone.edit.pageLink',
        ZONE_EDIT: 'zone.edit.pageTitle',
        ZONE_EDIT_DESC: 'zone.edit.pageDesc',
        ZONE_VENDOR_PRODUCT_DESC: 'zone.edit.vendorProductDesc',
        ZONE_SHOW_LINK: 'zone.show.pageLink',
        ZONE_SHOW: 'zone.show.pageTitle',
        ZONE_SHOW_DESC: 'zone.show.pageDesc',
        ZONE_CREATE_LINK: 'zone.create.pageLink',
        ZONE_CREATE: 'zone.create.pageTitle',
        ZONE_CREATE_DESC: 'zone.create.pageDesc',
        ZONE_ACTION_CREATE: 'page.action.create',
        ZONE_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        ZONE_ACTION_EDIT: 'page.action.update',
        ZONE_CHANGE_PASSWORD: 'zone.changePassword.pageDesc',
        ZONE_CHANGE_PASSWORD_DESC: 'zone.changePassword.pageDesc',
        ZONE_CHANGE_PASSWORD_LINK: 'zone.form.changePasswordLink',


    },
    API: {
        ZONE: '/crud/Zone',
        ZONES: '/crud/Zone/all',
        ZONE_ALIAS: '/crud/Zone/:alias',
        ZONE_PASSWORD_ALIAS: '/crud/User/:alias',
        ZONE_STATUS: '/changeZoneStatus',
        SEARCH_ZONE: '/crud/Zone/search/:query',
        ZONE_PRODUCT : '/crud/ZoneProduct',
        FILE_UPLOAD: '/device/zoneImage',
        PRODUCT: '/crud/Product',
        CITIES: '/crud/City',

    },

    FIELD: {
        NAME: 'name',
        //NAME_FIELD: 'name',
        EMAIL: 'email',
        EMAIL_FIELD: 'email',
        PHONE_NUMBER: 'phoneNo',
        PHONE_NUMBER_FIELD: 'phoneNo',
        USERNAME: 'username',
        PASSWORD: 'password',
        CONFIRM_PASSWORD: 'confirmPassword'
    }
};
