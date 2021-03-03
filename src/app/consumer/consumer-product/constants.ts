export const CONSUMER_PRODUCT_CONSTANTS = {
    'URL': {
         CONSUMER_PRODUCT: '/consumer/consumer-product',
         CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST: '/consumer/consumer-product/consumer-product-list',
         CONSUMER_PRODUCT_CONSUMER_PRODUCT_LIST_ALIAS: '/consumer/consumer-product/consumer-product-list/:alias',
         CONSUMER_PRODUCT_CREATE: '/consumer/consumer-product/create',
         CONSUMER_PRODUCT_EDIT: '/consumer/consumer-product/edit',
         CONSUMER_PRODUCT_PRODUCT_SHOW: '/consumer/consumer-product/product-show',
         CONSUMER_TICKET_LIST: '/consumer/consumer-ticket/list',
         CONSUMER_PRODUCT_CONSUMER_TICKET_LIST: '/consumer/consumer-product/consumer-ticket/list'

    },

    LINK: {
        CONSUMER_PRODUCT_LIST: 'consumer-product-list/:alias',
        CREATE: 'create/:alias',
        PRODUCT_SHOW: 'product-show/:alias',
        EDIT: 'edit/:alias',
        CONSUMER_TICKET_LIST: 'consumer-ticket/list/:alias'

    },

    LABEL: {
        CONSUMER_PRODUCT: 'Consumer Product',
        CONSUMER_PRODUCT_IMAGE: 'consumerProduct.list.image',
        CONSUMER_PRODUCT_DESC: 'consumerProduct.list.consumerProduct',
        CONSUMER_PRODUCT_USER: 'consumerProduct.list.consumerProductUser',
        CONSUMER_PRODUCT_LIST_LINK: 'consumerProduct.list.pageLink',
        CONSUMER_PRODUCT_LIST: 'consumerProduct.list.pageTitle',
        CONSUMER_PRODUCT_LIST_DESC: 'consumerProduct.list.pageDesc',
        CONSUMER_PRODUCT_CREATE_LINK: 'consumerProduct.create.pageLink',
        CONSUMER_PRODUCT_CREATE: 'consumerProduct.create.pageTitle',
        CONSUMER_PRODUCT_ACTION_CREATE: 'page.action.create',
        CONSUMER_PRODUCT_CREATE_DESC: 'consumerProduct.create.pageDesc',
        CONSUMER_PRODUCT_EDIT_LINK: 'consumerProduct.edit.pageLink',
        CONSUMER_PRODUCT_EDIT: 'consumerProduct.edit.pageTitle',
        CONSUMER_PRODUCT_EDIT_DESC: 'consumerProduct.edit.pageDesc',
        CONSUMER_PRODUCT_ACTION_EDIT: 'page.action.update',
        CONSUMER_PRODUCT_PRODUCT_SHOW_LINK: 'consumerProduct.show.pageLink',
        CONSUMER_PRODUCT_PRODUCT_SHOW: 'consumerProduct.show.pageTitle',
        CONSUMER_PRODUCT_PRODUCT_SHOW_DESC: 'consumerProduct.show.pageDesc'

    },

    API: {
        CONSUMER_PRODUCT: '/crud/ConsumerProduct',
        CONSUMER_PRODUCT_ALIAS: '/crud/ConsumerProduct/:alias',
        FILE_UPLOAD: '/device/consumerProductImage',
        CONSUMER_PRODUCT_CONSUMER_PRODUCT_TYPE_ALIAS: '/device/getConsumerProductByConsumerProductTypeId/:alias'
        // CONSUMER_PRODUCT_STATUS: '/changeConsumerProductTypeStatus',
        // SEARCH_CONSUMER_PRODUCT:'/crud/ConsumerProductType/search/:query'
    },

    FIELD: {
        NAME: 'name',
        DEVICEID: 'deviceId',
        NAME_FIELD: 'nameField',
        IMIEID: 'imieId',
        LOTNO: 'lotNo'
    }
};
