export const SUBSCRIPTION_CONSTANTS = {
    'URL': {
         SUBSCRIPTION: '/subscription',
         SUBSCRIPTION_LIST: '/subscription/list',
         SUBSCRIPTION_CREATE: '/subscription/create',
         SUBSCRIPTION_EDIT: '/subscription/edit',
         SUBSCRIPTION_SHOW: '/subscription/show'
    },

    LINK: {
        LIST: 'list',
        CREATE: 'create',
        EDIT: 'edit/:alias',
        SHOW: 'show/:alias'
    },

    LABEL: {
        SUBSCRIPTION: 'Subscription',
        SUBSCRIPTION_IMAGE: 'Image',
        SUBSCRIPTION_DESC: 'Subscription Company Management',
        SUBSCRIPTION_USER: 'SubscriptionUser',
        SUBSCRIPTION_ADMIN: 'SubscriptionAdmin',
        SUBSCRIPTION_LIST_LINK: 'subscription.list.pageLink',
        SUBSCRIPTION_LIST: 'subscription.list.pageTitle',
        SUBSCRIPTION_LIST_DESC: 'subscription.list.pageDesc',
        SUBSCRIPTION_EDIT_LINK: 'subscription.edit.pageLink',
        SUBSCRIPTION_EDIT: 'subscription.edit.pageTitle',
        SUBSCRIPTION_EDIT_DESC: 'subscription.edit.pageDesc',
        SUBSCRIPTION_SHOW_LINK: 'subscription.show.pageLink',
        SUBSCRIPTION_SHOW: 'subscription.show.pageTitle',
        SUBSCRIPTION_SHOW_DESC: 'subscription.show.pageDesc',
        SUBSCRIPTION_CREATE_LINK: 'subscription.create.pageLink',
        SUBSCRIPTION_CREATE: 'subscription.create.pageTitle',
        SUBSCRIPTION_CREATE_DESC: 'subscription.create.pageDesc',
        SUBSCRIPTION_ACTION_CREATE: 'page.action.create',
        SUBSCRIPTION_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        SUBSCRIPTION_ACTION_EDIT: 'page.action.update',
        SUBSCRIPTION_NEW_PRODUCT_LIST_LINK: 'subscription.newProduct.pageLink',
        SUBSCRIPTION_NEW_PRODUCT_LIST: 'subscription.newProduct.pageTitle',
        SUBSCRIPTION_NEW_PRODUCT_LIST_DESC: 'subscription.newProduct.pageDesc'
    },

    API: {
        SUBSCRIPTION: '/crud/Subscription',
        SUBSCRIPTION_ALIAS: '/crud/Subscription/:alias',
        SUBSCRIPTION_STATUS: '/changeSubscriptionStatus',
        SEARCH_SUBSCRIPTION: '/crud/Subscription/search/:query',
        FILE_UPLOAD: '/device/subscriptionImage',
        SUBSCRIPTIONS: '/crud/Subscription/all',
        CURRENCY: '/crud/Currency/all',
        PRODUCT_CATEGORIES: '/crud/ProductCategory/all'

    },

     FIELD: {
         NAME: 'device_subscription.UK_mmho1hnc24wfwkxabj7',
         NAME_FIELD: 'UK_mmho1hnc24wfwkxabj7'
     }
};
