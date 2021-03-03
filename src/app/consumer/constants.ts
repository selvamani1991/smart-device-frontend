export const CONSUMER_CONSTANTS = {

    'URL': {
        CONSUMER_CONSUMER_LIST: '/consumer/consumer-list',
        CONSUMER_CONSUMER_SUBSCRIPTION_LIST: '/consumer/consumer-subscription-list',
        CONSUMER_SUBSCRIPTION_CREATE: '/consumer/subscription-create',
        CONSUMER_DEVICE_LIST: '/consumer/device-list',
        CONSUMER_DEVICE_LIST_ALIAS: '/consumer/device-list/:alias'


    },


    LINK: {
        CONSUMER_PRODUCT_TYPE: 'consumer-product-type',
        CONSUMER_PRODUCT: 'consumer-product',
        CONSUMER_TICKET: 'consumer-ticket',
        CONSUMER_LIST: 'consumer-list',
        CONSUMER_PRODUCT_CONSUMER_TICKET_LIST: '/consumer/consumer-product/consumer-ticket/list',
        CONSUMER_SUBSCRIPTION_LIST: 'consumer-subscription-list/:alias',
        SUBSCRIPTION_CREATE: 'subscription-create',
        DEVICE_LIST: 'device-list/:alias'
    },

    LABEL: {
        CONSUMER: 'Consumer',
        CONSUMER_CONSUMER_LIST_LINK: 'consumer.list.pageLink',
        CONSUMER_CONSUMER_LIST: 'consumer.list.pageTitle',
        CONSUMER_CONSUMER_LIST_DESC: 'consumer.list.pageDesc',
        CONSUMER_SUBSCRIPTION: 'consumer.list.consumerSubscription',
        CONSUMER_SUBSCRIPTIONS: 'Consumer Subscription List',
        CONSUMER_SUBSCRIPTION_CREATE: 'consumer.list.consumerSubscriptionCreate',
        CONSUMER_SUBSCRIPTION_CREATE_DESC: 'consumer.list.consumerSubscription',
        CONSUMER_SUBSCRIPTION_CREATE_LINK: 'consumer.list.consumerSubscriptionCreate',
        CONSUMER_CONSUMER_DEVICE_LIST_LINK: 'consumer.list.consumerDevice',
    },

    API: {
        CONSUMER: '/crud/User?fieldName=userType&value=consumer',
        CONSUMER_SUBSCRIPTION_LIST: '/device/getUserSubscriptionByConsumerId/:alias',
        CONSUMER_SUBSCRIPTION: '/crud/AMSubscription',
        //CONSUMER_DEVICE_LIST: '/crud/ConsumerProduct/:alias'
        //CONSUMER_DEVICE_LIST: '/device/getConsumerProductByConsumerId/:alias'
        CONSUMER_DEVICE_LIST: '/device/getOwnedConsumerProductByConsumerId/:alias'
    }


};
