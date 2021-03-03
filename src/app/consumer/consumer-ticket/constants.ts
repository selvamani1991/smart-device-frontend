export const CONSUMER_TICKET_CONSTANTS = {
    'URL': {
         CONSUMER_TICKET: '/consumer-ticket',
         CONSUMER_TICKET_ALL_LIST: '/consumer/consumer-ticket/all-list',
         CONSUMER_TICKET_LIST: '/consumer/consumer-ticket/list',
         CONSUMER_TICKET_EDIT: '/consumer/consumer-ticket/edit',
         CONSUMER_TICKET_SHOW: '/consumer/consumer-ticket/show',
         CONSUMER_TICKET_CREATE: '/consumer/consumer-ticket/create',
         CONSUMER_PRODUCT_CONSUMER_TICKET_LIST: '/consumer/consumer-product/consumer-ticket/list',
         CONSUMER_PRODUCT_CONSUMER_TICKET_LIST_ALIAS: '/consumer/consumer-product/consumer-ticket/list/:alias',

    },

    LINK: {
        ALL_LIST: 'all-list',
        LIST: 'consumer-ticket/list/:alias',
        CREATE: 'consumer-ticket/create/:alias',
        SHOW: 'show/:alias',
        EDIT: 'edit/:alias/:product',
        ERROR_DATA: 'error-data/:alias'

    },

    LABEL: {
        CONSUMER_TICKET: 'ConsumerTicket',
        CONSUMER_TICKET_PASSWORD: 'ConsumerTicket Password',
        CONSUMER_TICKET_IMAGE: 'Image',
        CONSUMER_TICKET_USER: 'ConsumerTicketUser',
        CONSUMER_TICKET_ADMIN: 'ConsumerTicketAdmin',
        CONSUMER_TICKET_LIST_LINK: 'consumerTicket.list.pageLink',
        CONSUMER_TICKET_LIST: 'consumerTicket.list.pageTitle',
        CONSUMER_TICKET_LIST_DESC: 'consumerTicket.list.pageDesc',
        CONSUMER_TICKET_EDIT_LINK: 'consumerTicket.edit.pageLink',
        CONSUMER_TICKET_EDIT: 'consumerTicket.edit.pageTitle',
        CONSUMER_TICKET_EDIT_DESC: 'consumerTicket.edit.pageDesc',
        CONSUMER_TICKET_SHOW_LINK: 'consumerTicket.show.pageLink',
        CONSUMER_TICKET_SHOW: 'consumerTicket.show.pageTitle',
        CONSUMER_TICKET_SHOW_DESC: 'consumerTicket.show.pageDesc',
        CONSUMER_TICKET_CREATE_LINK: 'consumerTicket.create.pageLink',
        CONSUMER_TICKET_CREATE: 'consumerTicket.create.pageTitle',
        CONSUMER_TICKET_CREATE_DESC: 'consumerTicket.create.pageDesc',
        CONSUMER_TICKET_ACTION_CREATE: 'page.action.create',
        CONSUMER_TICKET_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        CONSUMER_TICKET_ACTION_EDIT: 'page.action.update',
        CONSUMER_TICKET_ALL_LIST_LINK: 'consumerTicket.list.pageLink',
        CONSUMER_TICKET_ALL_LIST: 'consumerTicket.list.pageTitle',
        CONSUMER_TICKET_ALL_LIST_DESC: 'consumerTicket.list.pageDesc',
    },

    API: {
        CONSUMER_TICKET: '/crud/ConsumerTicket',
        ALL_CONSUMER_TICKET: '/crud/ConsumerTicket/all',
        CONSUMER_TICKET_ALIAS: '/crud/ConsumerTicket/:alias',
        CONSUMER_TICKET_STATUS: '/changeConsumerTicketStatus',
        CITIES: '/crud/City/all',
        CONSUMER_TICKET_SEARCH : '/crud/ConsumerTicket/search/:query',
        FILE_UPLOAD: '/device/consumerTicketImage',
        CONSUMER_TICKET_CONSUMER_PRODUCT_ALIAS: '/device/getConsumerTicketByConsumerProductId/:alias',

    },

     FIELD: {
         NAME: 'name',
         NAME_FIELD: 'name'
     }
};
