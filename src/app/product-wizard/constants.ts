            export const PRODUCT_WIZARD_CONSTANTS = {
    "URL": {
         PRODUCT_WIZARD_CREATE_PRODUCT: '/product-wizard/create-product',
         PRODUCT_WIZARD_CREATE_PRODUCT_ALIAS: '/product-wizard/create-product',
         PRODUCT_WIZARD_PRODUCT_ORDER_CREATE: '/product-wizard/product-order-create',
         PRODUCT_WIZARD_ORDER_CREATE: '/product-wizard/order-create',
         PRODUCT_WIZARD_ORDER_LIST: '/product-wizard/order-list',
         PRODUCT_WIZARD_INVOICE_SHOW: '/product-wizard/invoice-show',
    },

    LINK:{
        CREATE_PRODUCT: 'create-product',
        CREATE_PRODUCT_ALIAS: 'create-product/:alias',
        PRODUCT_ORDER_CREATE: 'product-order-create/:alias',
        ORDER_CREATE: 'order-create',
        ORDER_LIST: 'order-list',
        INVOICE_SHOW: 'invoice-show/:alias',
    },

    LABEL: {
        PRODUCT_WIZARD: "Product Wizard",
        ORDER_WIZARD: "Order Wizard",
        PRODUCT_ORDER: "Product Order",
        MACHINE_ORDER: "Machine Order",
        PRODUCT_ASSIGNMENT: "Product Assignment",
        PRODUCT_DATA_LIST: "Product Data List",
        PRODUCT_IMAGE: "Image",
        INVOICE_IMAGE: 'Image',
        PRODUCT_ADMIN: "ProductAdmin",
        PRODUCT_WIZARD_EDIT_LINK: "Edit",
        INVOICE_SHOW_LINK: 'invoice.form.showPageLink',
        INVOICE_SHOW: 'invoice.show.pageTitle',
        INVOICE_SHOW_DESC: 'invoice.show.pageDesc',
        PRODUCT_WIZARD_EDIT: "product.show.pageTitle",
        PRODUCT_WIZARD_EDIT_DESC: "product.show.pageDesc",
        PRODUCT_WIZARD_ORDER_LIST_LINK: "Order Wizard List",
        PRODUCT_WIZARD_LIST_LINK: "Order Wizard List",
        PRODUCT_WIZARD_LIST: "product.list.pageTitleWizard",
        PRODUCT_WIZARD_LIST_DESC: "product.list.pageDescWizard",
        PRODUCT_WIZARD_ACTION_CREATE:'page.action.createWizard',
        PRODUCT_ACTION_CHANGE_PASSWORD:'page.action.change_password',
        PRODUCT_ACTION_EDIT:'page.action.update',
        PRODUCT_WIZARD_CREATE_LINK: "product.create.pageLinkWizard",
        PRODUCT_WIZARD_CREATE: "product.create.pageTitleWizard",
        PRODUCT_WIZARD_CREATE_DESC: "product.create.pageDescWizard",

    },

    API:{

        PRODUCT_TYPES:'/crud/ProductType/all',
        PRODUCT_TYPE:'/crud/ProductType',
        MANUFACTURERS:'/crud/Manufacturer/all',
        CLIENT_SUBSCRIPTION_ALIAS:'/device/getCurrentSubscriptions',
        BOARD_PRODUCT_TYPE :'/crud/BoardProductType',
        BOARD_MANUFACTURERS:'/crud/BoardManufacturer/all',
        MACHINE_MANUFACTURERS:'/crud/Manufacturer/all',
        PRODUCT_TYPE_ALIAS: '/crud/ProductType/:alias',
        COMPANIES: '/crud/Company/all',
        VENDORS: '/crud/Vendor/all',
        CLIENT_SUBSCRIPTIONS: '/crud/ClientSubscription/all',
        ORDER_WIZARD: '/crud/OrderWizard',
        ORDER_WIZARD_ALIAS: '/crud/OrderWizard/:alias',
        ACCEPT_PRODUCT: '/device/acceptInvoice/:alias/:subscriptionId',
        INVOICE_DATA: '/device/getInvoiceByAlias/:alias',
        BOARD_LIST: '/device/getBoardByBoardProductTypeId/:alias',
        MACHINE_LIST: '/device/getMachineByMachineProductTypeId/:alias',
        PRODUCT_STATUS: '/device/acceptInvoice/:alias',
        CLIENT: '/device/getClient',

    },

    FIELD:{
        NAME: "name",
        EMAIL: "email",
        USERNAME: "username",
        PHONE_NO: "phoneNo",
        CONFIRM_PASSWORD:"confirmPassword",
        DEVICE_ORDERMACHINE_DEVICEID:"device_ordermachine.deviceId",
        IMIEID:"device_product.imieId",
        MACHINEID:"device_machine.machineId",
        BOARDID:"boardId",
        BOARD_ID:"boardId",
    }
};

