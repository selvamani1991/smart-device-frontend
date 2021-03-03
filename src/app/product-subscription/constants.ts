export const PRODUCT_SUBSCRIPTION_CONSTANTS = {
    'URL': {
        PRODUCT_SUBSCRIPTION: '/product-subscription',
        PRODUCT_SUBSCRIPTION_LIST: '/product-subscription/list',
        PRODUCT_SUBSCRIPTION_EDIT: '/product-subscription/edit',
        PRODUCT_SUBSCRIPTION_SHOW: '/product-subscription/show',
        PRODUCT_SUBSCRIPTION_CREATE: '/product-subscription/create'


    },

    LINK: {
        LIST: 'list',
        CREATE: 'create',
        SHOW: 'show/:alias',
        EDIT: 'edit/:alias'

    },

    LABEL: {
        PRODUCT_SUBSCRIPTION: 'ProductSubscription',
        PRODUCT_SUBSCRIPTION_PASSWORD: 'ProductSubscription Password',
        PRODUCT_SUBSCRIPTION_IMAGE: 'Image',
        PRODUCT_SUBSCRIPTION_IMAGES: 'Image',
        PRODUCT_SUBSCRIPTION_LIST_LINK: 'productSubscription.list.pageLink',
        PRODUCT_SUBSCRIPTION_LIST: 'productSubscription.list.pageTitle',
        PRODUCT_SUBSCRIPTION_LIST_DESC: 'productSubscription.list.pageDesc',
        PRODUCT_SUBSCRIPTION_EDIT_LINK: 'productSubscription.edit.pageLink',
        PRODUCT_SUBSCRIPTION_EDIT: 'productSubscription.edit.pageTitle',
        PRODUCT_SUBSCRIPTION_EDIT_DESC: 'productSubscription.edit.pageDesc',
        PRODUCT_SUBSCRIPTION_VENDOR_PRODUCT_DESC: 'productSubscription.edit.vendorProductDesc',
        PRODUCT_SUBSCRIPTION_SHOW_LINK: 'productSubscription.show.pageLink',
        PRODUCT_SUBSCRIPTION_SHOW: 'productSubscription.show.pageTitle',
        PRODUCT_SUBSCRIPTION_SHOW_DESC: 'productSubscription.show.pageDesc',
        PRODUCT_SUBSCRIPTION_CREATE_LINK: 'productSubscription.create.pageLink',
        PRODUCT_SUBSCRIPTION_CREATE: 'productSubscription.create.pageTitle',
        PRODUCT_SUBSCRIPTION_CREATE_DESC: 'productSubscription.create.pageDesc',
        PRODUCT_SUBSCRIPTION_ACTION_CREATE: 'page.action.create',
        PRODUCT_SUBSCRIPTION_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        PRODUCT_SUBSCRIPTION_ACTION_EDIT: 'page.action.update',
        PRODUCT_SUBSCRIPTION_CHANGE_PASSWORD: 'productSubscription.changePassword.pageDesc',
        PRODUCT_SUBSCRIPTION_CHANGE_PASSWORD_DESC: 'productSubscription.changePassword.pageDesc',
        PRODUCT_SUBSCRIPTION_CHANGE_PASSWORD_LINK: 'productSubscription.form.changePasswordLink',


    },
    API: {
        PRODUCT_SUBSCRIPTION: '/crud/ProductSubscription',
        PRODUCT_SUBSCRIPTIONS: '/crud/ProductSubscription/all',
        PRODUCT_SUBSCRIPTION_ALIAS: '/crud/ProductSubscription/:alias',
        PRODUCT_SUBSCRIPTION_PASSWORD_ALIAS: '/crud/User/:alias',
        PRODUCT_SUBSCRIPTION_STATUS: '/changeProductSubscriptionStatus',
        SEARCH_PRODUCT_SUBSCRIPTION: '/crud/ProductSubscription/search/:query',
        PRODUCT_SUBSCRIPTION_PRODUCT : '/crud/ProductSubscriptionProduct',
        FILE_UPLOAD: '/device/productSubscriptionImage',
        PRODUCT: '/crud/Product',
        CITIES: '/crud/City/all',

    },

    FIELD: {
        NAME: 'name',
        NAME_FIELD: 'name',
        EMAIL: 'email',
        EMAIL_FIELD: 'email',
        PHONE_NUMBER: 'phoneNo',
        PHONE_NUMBER_FIELD: 'phoneNo',
        USERNAME: 'username',
        PASSWORD: 'password',
        CONFIRM_PASSWORD: 'confirmPassword'
    }
};
