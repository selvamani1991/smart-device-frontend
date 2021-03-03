export const PRODUCT_CATEGORY_CONSTANTS = {
    'URL': {
        PRODUCT_CATEGORY: '/product-category',
        PRODUCT_CATEGORY_LIST: '/product-category/list',
        PRODUCT_CATEGORY_EDIT: '/product-category/edit',
        PRODUCT_CATEGORY_SHOW: '/product-category/show',
        PRODUCT_CATEGORY_CREATE: '/product-category/create'


    },

    LINK: {
        LIST: 'list',
        CREATE: 'create',
        SHOW: 'show/:alias',
        EDIT: 'edit/:alias'

    },

    LABEL: {
        PRODUCT_CATEGORY: 'Product Category',
        PRODUCT_CATEGORY_PASSWORD: 'ProductCategory Password',
        PRODUCT_CATEGORY_IMAGE: 'Image',
        PRODUCT_CATEGORY_IMAGES: 'Image',
        PRODUCT_CATEGORY_LIST_LINK: 'productCategory.list.pageLink',
        PRODUCT_CATEGORY_LIST: 'productCategory.list.pageTitle',
        PRODUCT_CATEGORY_LIST_DESC: 'productCategory.list.pageDesc',
        PRODUCT_CATEGORY_EDIT_LINK: 'productCategory.edit.pageLink',
        PRODUCT_CATEGORY_EDIT: 'productCategory.edit.pageTitle',
        PRODUCT_CATEGORY_EDIT_DESC: 'productCategory.edit.pageDesc',
        PRODUCT_CATEGORY_VENDOR_PRODUCT_DESC: 'productCategory.edit.vendorProductDesc',
        PRODUCT_CATEGORY_SHOW_LINK: 'productCategory.show.pageLink',
        PRODUCT_CATEGORY_SHOW: 'productCategory.show.pageTitle',
        PRODUCT_CATEGORY_SHOW_DESC: 'productCategory.show.pageDesc',
        PRODUCT_CATEGORY_CREATE_LINK: 'productCategory.create.pageLink',
        PRODUCT_CATEGORY_CREATE: 'productCategory.create.pageTitle',
        PRODUCT_CATEGORY_CREATE_DESC: 'productCategory.create.pageDesc',
        PRODUCT_CATEGORY_ACTION_CREATE: 'page.action.create',
        PRODUCT_CATEGORY_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        PRODUCT_CATEGORY_ACTION_EDIT: 'page.action.update',
        PRODUCT_CATEGORY_CHANGE_PASSWORD: 'productCategory.changePassword.pageDesc',
        PRODUCT_CATEGORY_CHANGE_PASSWORD_DESC: 'productCategory.changePassword.pageDesc',
        PRODUCT_CATEGORY_CHANGE_PASSWORD_LINK: 'productCategory.form.changePasswordLink',


    },
    API: {
        PRODUCT_CATEGORY: '/crud/ProductCategory',
        PRODUCT_CATEGORYS: '/crud/ProductCategory/all',
        PRODUCT_CATEGORY_ALIAS: '/crud/ProductCategory/:alias',
        PRODUCT_CATEGORY_PASSWORD_ALIAS: '/crud/User/:alias',
        PRODUCT_CATEGORY_STATUS: '/changeProductCategoryStatus',
        SEARCH_PRODUCT_CATEGORY: '/crud/ProductCategory/search/:query',
        FILE_UPLOAD: '/device/productCategoryImage',
        PRODUCT: '/crud/Product',

    },

    FIELD: {
        NAME: 'device_productcategory.name',
        NAME_FIELD: 'device_productcategory.name',
        EMAIL: 'email',
        EMAIL_FIELD: 'email',
        PHONE_NUMBER: 'phoneNo',
        PHONE_NUMBER_FIELD: 'phoneNo',
        USERNAME: 'username',
        PASSWORD: 'password',
        CONFIRM_PASSWORD: 'confirmPassword'
    }
};