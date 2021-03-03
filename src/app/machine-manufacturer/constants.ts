export const MACHINE_MANUFACTURER_CONSTANTS = {
    'URL': {
        MACHINE_MANUFACTURER: '/machine-manufacturer',
        MACHINE_MANUFACTURER_LIST: '/machine-manufacturer/list',
        MACHINE_MANUFACTURER_CREATE: '/machine-manufacturer/create',
        MACHINE_MANUFACTURER_EDIT: '/machine-manufacturer/edit',
        MACHINE_MANUFACTURER_SHOW: '/machine-manufacturer/show',
        MACHINE_MANUFACTURER_NEW_MANUFACTURER_PRODUCT: '/machine-manufacturer/new-manufacturer-product',
        MACHINE_MANUFACTURER_MANUFACTURER_PRODUCT: '/machine-manufacturer/manufacturer-product',
        MACHINE_MANUFACTURER_CHANGE_PASSWORD: '/machine-manufacturer/change-password',
        MACHINE_MANUFACTURER_LIST_MACHINE: '/machine-manufacturer/list-machine'
    },

    LINK: {
        LIST: 'list',
        CREATE: 'create',
        EDIT: 'edit/:alias',
        SHOW: 'show/:alias',
        NEW_MANUFACTURER_PRODUCT: 'new-manufacturer-product',
        MANUFACTURER_PRODUCT: 'manufacturer-product',
        CHANGE_PASSWORD: 'change-password/:alias',
        LIST_MACHINE: 'list-machine',
    },

    LABEL: {
        MACHINE_MANUFACTURER: 'Manufacturer',
        MACHINE: 'Machine Status',
        MACHINE_LIST: 'Machine List',
        MACHINE_MACHINE_LIST: 'Manufacturer Machine List',
        MACHINE_MACHINE_LIST_DESC: 'Machine List Desc',
        MANUFACTURER_PASSWORD: 'Manufacturer Password',
        MANUFACTURER_CHANGE_PASSWORD: 'Manufacturer Change Password',
        MANUFACTURER_CHANGE_PASSWORD_DESC: 'Manufacturer Password Desc',
        MANUFACTURER_IMAGE: 'Image',
        MANUFACTURER_LIST_LINK: 'manufacturer.list.pageLink',
        MANUFACTURER_LIST: 'manufacturer.list.pageTitle',
        MANUFACTURER_LIST_DESC: 'manufacturer.list.pageDesc',
        MANUFACTURER_CREATE_LINK: 'manufacturer.create.pageLink',
        MANUFACTURER_CREATE: 'manufacturer.create.pageTitle',
        MANUFACTURER_CREATE_DESC: 'manufacturer.create.pageDesc',
        MANUFACTURER_EDIT_LINK: 'manufacturer.edit.pageLink',
        MANUFACTURER_EDIT: 'manufacturer.edit.pageTitle',
        MANUFACTURER_EDIT_DESC: 'manufacturer.edit.pageDesc',
        MANUFACTURER_SHOW_LINK: 'manufacturer.show.pageLink',
        MANUFACTURER_SHOW: 'manufacturer.show.pageTitle',
        MANUFACTURER_SHOW_DESC: 'manufacturer.show.pageDesc',
        MANUFACTURER_ACTION_CREATE: 'page.action.create',
        MANUFACTURER_CHANGE_PASSWORD_LINK: 'Change Password',
        MANUFACTURER_ACTION_EDIT: 'page.action.update'

    },

    API: {
        MANUFACTURER: '/crud/Manufacturer',
        MANUFACTURER_ALIAS: '/crud/Manufacturer/:alias',
        MANUFACTURER_SEARCH : '/crud/Manufacturer/search/:query',
        CITIES: '/crud/City',
        CLIENT: '/crud/Client/all',
        PRODUCT: '/crud/Product/',
        MANUFACTURER_PRODUCT : '/crud/ManufacturerProduct',
        CLIENT_PRODUCT: '/crud/ClientProduct',
        MANUFACTURER_PRODUCT_STATUS: '/crud/ManufacturerProduct/status/:new',
        PRODUCT_STATUS: '/crud/ManufacturerProduct/:alias',
        FILE_UPLOAD: '/device/manufacturerImage',
        MANUFACTURER_PASSWORD_ALIAS: '/crud/User/:alias',
        MACHINE: '/crud/Machine',
        CLIENTS: '/device/getClient'

    },

    FIELD: {
        NAME: 'device_manufacturer.name',
        NAME_FIELD: 'device_manufacturer.name',
        EMAIL: 'email',
        EMAIL_FIELD: 'email',
        PHONE_NUMBER: 'phoneNo',
        PHONE_NUMBER_FIELD: 'phoneNo',
        PASSWORD: 'password',
        CONFIRM_PASSWORD: 'confirmPassword',
        MACHINE_ID: 'machineId',
        MACHINE_ID_FIELD: 'machineId'
    }
};
