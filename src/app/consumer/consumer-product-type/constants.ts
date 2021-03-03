export const CONSUMER_PRODUCT_TYPE_CONSTANTS = {
    'URL': {
         CONSUMER_PRODUCT_TYPE: '/consumer/consumer-product-type',
         CONSUMER_PRODUCT_TYPE_LIST: '/consumer/consumer-product-type/list',
         CONSUMER_PRODUCT_TYPE_CREATE: '/consumer/consumer-product-type/create',
         CONSUMER_PRODUCT_TYPE_EDIT: '/consumer/consumer-product-type/edit',
         CONSUMER_PRODUCT_TYPE_SHOW: '/consumer/consumer-product-type/show',
         CONSUMER_PRODUCT_TYPE_CONSUMER_PRODUCT_LIST: '/consumer/consumer-product-type/consumer-product/list'
    },
    LINK: {
        LIST: 'list',
        CREATE: 'create',
        SHOW: 'show/:alias',
        EDIT: 'edit/:alias',
        CONSUMER_PRODUCT_LIST: 'consumer-product/list/:alias'
    },
    LABEL: {
        CONSUMER_PRODUCT_TYPE: 'Consumer ProductType',
        CONSUMER_PRODUCT_TYPE_IMAGE: 'consumerProductType.list.image',
        CONSUMER_PRODUCT_TYPE_DESC: 'consumerProductType.list.consumerProductType',
        CONSUMER_PRODUCT_TYPE_USER: 'consumerProductType.list.consumerProductTypeUser',
        CONSUMER_PRODUCT_TYPE_LIST_LINK: 'consumerProductType.list.pageLink',
        CONSUMER_PRODUCT_TYPE_LIST: 'consumerProductType.list.pageTitle',
        CONSUMER_PRODUCT_TYPE_LIST_DESC: 'consumerProductType.list.pageDesc',
        CONSUMER_PRODUCT_TYPE_CREATE_LINK: 'consumerProductType.create.pageLink',
        CONSUMER_PRODUCT_TYPE_CREATE: 'consumerProductType.create.pageTitle',
        CONSUMER_PRODUCT_TYPE_ACTION_CREATE: 'page.action.create',
        CONSUMER_PRODUCT_TYPE_CREATE_DESC: 'consumerProductType.create.pageDesc',
        CONSUMER_PRODUCT_TYPE_EDIT_LINK: 'consumerProductType.edit.pageLink',
        CONSUMER_PRODUCT_TYPE_EDIT: 'consumerProductType.edit.pageTitle',
        CONSUMER_PRODUCT_TYPE_EDIT_DESC: 'consumerProductType.edit.pageDesc',
        CONSUMER_PRODUCT_TYPE_ACTION_EDIT: 'page.action.update',
        CONSUMER_PRODUCT_TYPE_SHOW_LINK: 'consumerProductType.show.pageLink',
        CONSUMER_PRODUCT_TYPE_SHOW: 'consumerProductType.show.pageTitle',
        CONSUMER_PRODUCT_TYPE_SHOW_DESC: 'consumerProductType.show.pageDesc'

    },
    API: {
        CONSUMER_PRODUCT_TYPE: '/crud/ConsumerProductType',
        CONSUMER_PRODUCT_TYPE_ALIAS: '/crud/ConsumerProductType/:alias',
        FILE_UPLOAD: '/device/consumerProductTypeImage'
        // CONSUMER_PRODUCT_TYPE_STATUS: '/changeConsumerProductTypeStatus',
        // SEARCH_CONSUMER_PRODUCT_TYPE:'/crud/ConsumerProductType/search/:query'

    },

     FIELD: {
         NAME: 'name',
         NAME_FIELD: 'nameField'
    }
};
