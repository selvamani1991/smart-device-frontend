    export const BOARD_MANUFACTURER_CONSTANTS = {
    'URL': {
         BOARD_MANUFACTURER: '/board-manufacturer',
         BOARD_MANUFACTURER_LIST: '/board-manufacturer/list',
         BOARD_MANUFACTURER_EDIT: '/board-manufacturer/edit',
         BOARD_MANUFACTURER_SHOW: '/board-manufacturer/show',
         BOARD_MANUFACTURER_CREATE: '/board-manufacturer/create',
         BOARD_MANUFACTURER_NEW_PRODUCT_LIST: '/board-manufacturer/new-product-list',
         BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE: '/board-manufacturer/product-type',
         BOARD_MANUFACTURER_BOARD_PRODUCT_TYPE_SHOW: '/board-manufacturer/board-product-type-show',
         BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD: '/board-manufacturer/product-type/board',
         BOARD_MANUFACTURER_PRODUCT_TYPE_BOARD_ALIAS: '/board-manufacturer/product-type/board/:alias',
         BOARD_MANUFACTURER_CHANGE_PASSWORD: '/board-manufacturer/change-password',
         BOARD_MANUFACTURER_LIST_BOARD: '/board-manufacturer/list-board'

    },

    LINK: {
        LIST: 'list',
        CREATE: 'create',
        SHOW: 'show/:alias',
        EDIT: 'edit/:alias',
        NEW_PRODUCT_LIST: 'new-product-list',
        BOARD_PRODUCT_TYPE_SHOW: 'board-product-type-show/:alias',
        PRODUCT_TYPE_BOARD: 'product-type/board/:alias',
        PRODUCT_TYPE_BOARD_ALIAS: 'product-type/board/:alias',
        CHANGE_PASSWORD: 'change-password/:alias',
        LIST_BOARD: 'list-board',
        BOARD_PRODUCT_TYPE: 'product-type'

    },

    LABEL: {
        BOARD_MANUFACTURER: 'BoardManufacturer',
        BOARD_MANUFACTURER_IMAGE: 'Image',
        BOARD_MANUFACTURER_PASSWORD: 'BoardManufacturer Password',
        BOARD_MANUFACTURER_CHANGE_PASSWORD: 'BoardManufacturer Change Password',
        BOARD_MANUFACTURER_CHANGE_PASSWORD_DESC: 'Change Password Description',
        BOARD_MANUFACTURER_CHANGE_PASSWORD_LINK: 'Change Password',
        BOARD_MANUFACTURER_DESC: 'BoardManufacturer Company Management',
        BOARD_MANUFACTURER_USER: 'BoardManufacturerUser',
        BOARD_MANUFACTURER_ADMIN: 'BoardManufacturerAdmin',
        BOARD_MANUFACTURER_LIST_LINK: 'boardManufacturer.list.pageLink',
        BOARD_MANUFACTURER_PRODUCT_TYPE_LINK: 'boardManufacturer.list.boardManufacturerProductType',
        BOARD_MANUFACTURER_LIST: 'boardManufacturer.list.pageTitle',
        BOARD_MANUFACTURER_LIST_DESC: 'boardManufacturer.list.pageDesc',
        BOARD_MANUFACTURER_EDIT_LINK: 'boardManufacturer.edit.pageLink',
        BOARD_MANUFACTURER_EDIT: 'boardManufacturer.edit.pageTitle',
        BOARD_MANUFACTURER_EDIT_DESC: 'boardManufacturer.edit.pageDesc',
        BOARD_MANUFACTURER_SHOW_LINK: 'boardManufacturer.show.pageLink',
        BOARD_MANUFACTURER_SHOW: 'boardManufacturer.show.pageTitle',
        BOARD_MANUFACTURER_SHOW_DESC: 'boardManufacturer.show.pageDesc',
        BOARD_MANUFACTURER_CREATE_LINK: 'boardManufacturer.create.pageLink',
        BOARD_MANUFACTURER_CREATE: 'boardManufacturer.create.pageTitle',
        BOARD_MANUFACTURER_CREATE_DESC: 'boardManufacturer.create.pageDesc',
        BOARD_MANUFACTURER_ACTION_CREATE: 'page.action.create',
        BOARD_MANUFACTURER_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        BOARD_MANUFACTURER_ACTION_EDIT: 'page.action.update',
        BOARD_MANUFACTURER_NEW_PRODUCT_LIST_LINK: 'boardManufacturer.newProduct.pageLink',
        BOARD_MANUFACTURER_NEW_PRODUCT_LIST: 'board-manufacturer.newProduct.pageTitle',
        BOARD_MANUFACTURER_NEW_PRODUCT_LIST_DESC: 'board-manufacturer.newProduct.pageDesc',
        BOARD_PRODUCT_TYPE: 'Board Product Type',
        BOARD_LIST_LINK: 'Board List'

    },

    API: {
        BOARD_MANUFACTURER: '/crud/BoardManufacturer',
        BOARD_MANUFACTURER_ALIAS: '/crud/BoardManufacturer/:alias',
        BOARD_MANUFACTURER_STATUS: '/changeBoardManufacturerStatus',
        SEARCH_BOARD_MANUFACTURER: '/crud/BoardManufacturer/search/:query',
        CITIES: '/crud/City',
        PRODUCTS: '/crud/Product',
        MANUFACTURERS: '/crud/Manufacturer/all',
        MANUFACTURER_PRODUCTS: '/crud/ManufacturerProduct/all',
        MANUFACTURER_PRODUCT: '/crud/ManufacturerProduct',
        PRODUCT_STATUS: '/crud/Product/status/:new',
        BOARD_PRODUCT_TYPE : '/crud/BoardProductType',
        BOARD_PRODUCT_TYPE_ALIAS : '/crud/BoardProductType/:alias',
        BOARD_PRODUCT_TYPE_STATUS: '/crud/BoardProductType/:alias',
        FILE_UPLOAD: '/device/boardManufacturerImage',
        BOARD_MANUFACTURER_PASSWORD_ALIAS: '/crud/User/:alias',
        BOARD: '/crud/Board',
        CLIENT: '/device/getClient',
        CLIENT_BOARD: '/crud/ClientBoard'

    },

    FIELD: {
         BOARD_MANUFACTURERNAME: 'board-manufacturername',
         NAME: 'device_boardmanufacturer.name',
         NAME_FIELD: 'name',
         EMAIL: 'auth_user.email',
         EMAIL_FIELD: 'auth_user.email',
         PHONE_NUMBER: 'auth_user.phoneNo',
         PHONE_NUMBER_FIELD: 'auth_user.phoneNo',
         PASSWORD: 'password',
         CONFIRM_PASSWORD: 'confirmPassword',
         BOARD_ID: 'boardId',
         BOARD_ID_FIELD: 'boardId'
    }
};
