export const CONSUMER_SUBSCRIPTION_CONSTANTS = {
    'URL': {
        CONSUMER_SUBSCRIPTION: '/consumer-subscription',
        CONSUMER_SUBSCRIPTION_LIST: '/consumer-subscription/list',
        CONSUMER_SUBSCRIPTION_EDIT: '/consumer-subscription/edit',
        CONSUMER_SUBSCRIPTION_SHOW: '/consumer-subscription/show',
        CONSUMER_SUBSCRIPTION_CREATE: '/consumer-subscription/create'
    },

    LINK: {
        LIST: 'list',
        CREATE: 'create',
        SHOW: 'show/:alias',
        EDIT: 'edit/:alias'
    },

    LABEL: {
        CONSUMER_SUBSCRIPTION: 'ConsumerSubscription',
        CONSUMER_SUBSCRIPTION_PASSWORD: 'ConsumerSubscription Password',
        CONSUMER_SUBSCRIPTION_IMAGE: 'Image',
        CONSUMER_SUBSCRIPTION_IMAGES: 'Image',
        CONSUMER_SUBSCRIPTION_LIST_LINK: 'consumerSubscription.list.pageLink',
        CONSUMER_SUBSCRIPTION_LIST: 'consumerSubscription.list.pageTitle',
        CONSUMER_SUBSCRIPTION_LIST_DESC: 'consumerSubscription.list.pageDesc',
        CONSUMER_SUBSCRIPTION_EDIT_LINK: 'consumerSubscription.edit.pageLink',
        CONSUMER_SUBSCRIPTION_EDIT: 'consumerSubscription.edit.pageTitle',
        CONSUMER_SUBSCRIPTION_EDIT_DESC: 'consumerSubscription.edit.pageDesc',
        CONSUMER_SUBSCRIPTION_VENDOR_PRODUCT_DESC: 'consumerSubscription.edit.vendorProductDesc',
        CONSUMER_SUBSCRIPTION_SHOW_LINK: 'consumerSubscription.show.pageLink',
        CONSUMER_SUBSCRIPTION_SHOW: 'consumerSubscription.show.pageTitle',
        CONSUMER_SUBSCRIPTION_SHOW_DESC: 'consumerSubscription.show.pageDesc',
        CONSUMER_SUBSCRIPTION_CREATE_LINK: 'consumerSubscription.create.pageLink',
        CONSUMER_SUBSCRIPTION_CREATE: 'consumerSubscription.create.pageTitle',
        CONSUMER_SUBSCRIPTION_CREATE_DESC: 'consumerSubscription.create.pageDesc',
        CONSUMER_SUBSCRIPTION_ACTION_CREATE: 'page.action.create',
        CONSUMER_SUBSCRIPTION_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        CONSUMER_SUBSCRIPTION_ACTION_EDIT: 'page.action.update'
    },

    API: {
        CONSUMER_SUBSCRIPTION: '/crud/AMSubscription',
        CONSUMER_SUBSCRIPTIONS: '/crud/AMSubscription/all',
        CONSUMER_SUBSCRIPTION_ALIAS: '/crud/AMSubscription/:alias',
        SEARCH_CONSUMER_SUBSCRIPTION: '/crud/AMSubscription/search/:query',
        FILE_UPLOAD: '/device/consumerProductImage',
    },

    FIELD: {
        NAME: 'name',
        NAME_FIELD: 'name'
    }
};