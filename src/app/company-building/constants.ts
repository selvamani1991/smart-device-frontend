export const COMPANY_BUILDING_CONSTANTS = {
    'URL': {
         COMPANY_BUILDING: '/company-building',
         COMPANY_BUILDING_LIST: '/company-building/list',
         COMPANY_BUILDING_COMPANY_BUILDING_PRODUCT: '/company-building/company-building-product',
         COMPANY_BUILDING_ALL_COMPANY_BUILDING_PRODUCT: '/company-building/all-company-building-product',
         COMPANY_BUILDING_NEW_COMPANY_BUILDING_PRODUCT: '/company-building/new-company-building-product',
         COMPANY_BUILDING_EDIT: '/company-building/edit/',
         COMPANY_BUILDING_SHOW: '/company-building/show',
         COMPANY_BUILDING_CREATE: '/company-building/create',
         PRODUCT_TELEMETRIC_DATA: '/product/telemetric-data',
         PRODUCT_ERROR_DATA: '/product/error-data',
         COMPANY_BUILDING_CHANGE_PASSWORD: '/company-building/change-password'
    },

    LINK: {
        LIST: 'list',
        CREATE: 'create',
        SHOW: 'show/:alias',
        EDIT: 'edit/:alias',
        COMPANY_BUILDING_PRODUCT: 'company-building-product',
        ALL_COMPANY_BUILDING_PRODUCT: 'all-company-building-product',
        NEW_COMPANY_BUILDING_PRODUCT: 'new-company-building-product',
        TELEMETRIC_DATA: 'telemetric-data/:alias',
        ERROR_DATA: 'error-data/:alias',
        CHANGE_PASSWORD: 'change-password/:alias'
    },

    LABEL: {
        COMPANY_BUILDING: 'CompanyBuilding',
        ALL_COMPANY_BUILDING_PRODUCT_LINK: 'All Company Building Product',
        COMPANY_BUILDING_PASSWORD: 'CompanyBuilding Password',
        COMPANY_BUILDING_CHANGE_PASSWORD: 'CompanyBuilding Change Password',
        COMPANY_BUILDING_CHANGE_PASSWORD_DESC: 'Change Password Description',
        COMPANY_BUILDING_CHANGE_PASSWORD_LINK: 'companyBuilding.form.companyBuildingChangePasswordLink',
        COMPANY_BUILDING_IMAGE: 'Image',
        COMPANY_BUILDING_USER: 'CompanyBuildingUser',
        COMPANY_BUILDING_ADMIN: 'CompanyBuildingAdmin',
        COMPANY_BUILDING_PRODUCT_LIST_LINK: 'companyBuilding.list.companyBuildingProductListLink',
        COMPANY_BUILDING_LIST_LINK: 'companyBuilding.list.pageLink',
        COMPANY_BUILDING_NEW_PRODUCT_LIST_LINK: 'companyBuilding.list.companyBuildingNewProductList',
        COMPANY_BUILDING_LIST: 'companyBuilding.list.pageTitle',
        COMPANY_BUILDING_LIST_DESC: 'companyBuilding.list.pageDesc',
        COMPANY_BUILDING_EDIT: 'companyBuilding.edit.pageTitle',
        COMPANY_BUILDING_EDIT_DESC: 'companyBuilding.edit.pageDesc',
        COMPANY_BUILDING_SHOW: 'companyBuilding.show.pageTitle',
        COMPANY_BUILDING_SHOW_DESC: 'companyBuilding.show.pageDesc',
        COMPANY_BUILDING_CREATE: 'companyBuilding.create.pageTitle',
        COMPANY_BUILDING_CREATE_DESC: 'companyBuilding.create.pageDesc',
        COMPANY_BUILDING_ACTION_CREATE: 'page.action.create',
        COMPANY_BUILDING_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        COMPANY_BUILDING_ACTION_EDIT: 'page.action.update'
    },

    API: {
        COMPANY_BUILDING: '/crud/CompanyBuilding',
        COMPANY_BUILDING_ALIAS: '/crud/CompanyBuilding/:alias',
        COMPANY_BUILDING_STATUS: '/changeCompanyBuildingStatus',
        SEARCH_COMPANY_BUILDING: '/crud/CompanyBuilding/search/:query',
        CITIES: '/crud/City',
        COMPANY_BUILDING_PRODUCT: '/crud/CompanyBuildingProduct?fieldName=status&value=accepted',
        COMPANY_BUILDING_PRODUCTS: '/crud/CompanyBuildingProduct?fieldName=status&value=New',
        ALL_COMPANY_BUILDING_PRODUCT: '/crud/CompanyBuildingProduct',
        COMPANY_BUILDING_PRODUCT_STATUS: '/crud/CompanyBuildingProduct/:alias',
        FILE_UPLOAD: '/device/companyBuildingImage',
        COMPANY_BUILDING_PASSWORD_ALIAS: '/crud/User/:alias',
        COMPANY_BUILDING_PRODUCT_REJECT: '/crud/CompanyBuildingProduct/:alias',
        CLIENT: '/device/getClient',

    },

     FIELD: {
         NAME: 'device_companyBuilding.name',
         NAME_FIELD: 'name',
         EMAIL: 'auth_user.email',
         EMAIL_FIELD: 'email',
         PHONE_NUMBER: 'auth_user.phoneNo',
         PHONE_NUMBER_FIELD: 'phoneNo',
         PASSWORD: 'password',
         CONFIRM_PASSWORD: 'confirmPassword',
         COMPANY_BUILDING_NAME: 'companyBuildingName'
     }
};
