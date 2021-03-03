export const INVOICE_CONSTANTS = {
    'URL': {
        INVOICE: '/invoice',
        INVOICE_COMPANY_SHOW: '/invoice/company-show',
        INVOICE_VENDOR_SHOW: '/invoice/vendor-show',
        INVOICE_VENDOR_PRINT: '/invoice/vendor-print/:alias',
        INVOICE_VENDOR_SHOW_ALIAS: '/invoice/vendor-show/:alias',
        INVOICE_DISTRIBUTOR_SHOW: '/invoice/distributor-show',

    },

    LINK: {
        COMPANY_SHOW: 'company-show/:alias',
        VENDOR_SHOW: 'vendor-show/:alias',
        VENDOR_PRINT: 'vendor-print/:alias',
        DISTRIBUTOR_SHOW: 'distributor-show/:alias',


    },

    LABEL: {
        INVOICE: 'Invoice',
        PRODUCT: 'Product',
        PRODUCT_LIST: 'Product List',
        PRODUCT_LIST_DESC: 'Product List Desc',
        INVOICE_IMAGE: 'Image',
        INVOICE_IMAGES: 'Image',
        INVOICE_COMPANY_LIST_LINK: 'invoice.list.pageLink',
        INVOICE_COMPANY_LIST: 'invoice.list.pageTitle',
        INVOICE_COMPANY_LIST_DESC: 'invoice.list.pageDesc',
        INVOICE_COMPANY_SHOW_LINK: 'invoice.form.showPageLink',
        INVOICE_COMPANY_SHOW: 'invoice.show.pageTitle',
        INVOICE_COMPANY_SHOW_DESC: 'invoice.show.pageDesc',
        INVOICE_ACTION_CREATE: 'page.action.create',
        INVOICE_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        INVOICE_ACTION_EDIT: 'page.action.update',
        INVOICE_CHANGE_PASSWORD: 'invoice.changePassword.pageDesc',
        INVOICE_CHANGE_PASSWORD_DESC: 'invoice.changePassword.pageDesc',
        INVOICE_CHANGE_PASSWORD_LINK: 'invoice.form.changePasswordLink',
        INVOICE_CLIENT_LIST_LINK: 'invoice.list.pageLink',
        INVOICE_CLIENT_LIST: 'invoice.list.pageTitle',
        INVOICE_CLIENT_LIST_DESC: 'invoice.list.pageDesc',
        INVOICE_CLIENT_SHOW_LINK: 'invoice.form.showPageLink',
        INVOICE_CLIENT_SHOW: 'invoice.show.pageTitle',
        INVOICE_CLIENT_SHOW_DESC: 'invoice.show.pageDesc',
        INVOICE_VENDOR_LIST_LINK: 'invoice.list.pageLink',
        INVOICE_VENDOR_LIST: 'invoice.list.pageTitle',
        INVOICE_VENDOR_LIST_DESC: 'invoice.list.pageDesc',
        INVOICE_VENDOR_SHOW_LINK: 'invoice.form.showPageLink',
        INVOICE_VENDOR_SHOW: 'invoice.show.pageTitle',
        INVOICE_VENDOR_SHOW_DESC: 'invoice.show.pageDesc',
        INVOICE_DISTRIBUTOR_LIST_LINK: 'invoice.list.pageLink',
        INVOICE_DISTRIBUTOR_LIST: 'invoice.list.pageTitle',
        INVOICE_DISTRIBUTOR_LIST_DESC: 'invoice.list.pageDesc',
        INVOICE_DISTRIBUTOR_SHOW_LINK: 'invoice.form.showPageLink',
        INVOICE_DISTRIBUTOR_SHOW: 'invoice.show.pageTitle',
        INVOICE_DISTRIBUTOR_SHOW_DESC: 'invoice.show.pageDesc',



    },
    API: {
        INVOICE: '/crud/Invoice',
        INVOICES: '/crud/Invoice/all',
        INVOICE_ALIAS: '/crud/Invoice/:alias',
        INVOICE_PASSWORD_ALIAS: '/crud/User/:alias',
        INVOICE_STATUS: '/changeInvoiceStatus',
        SEARCH_INVOICE: '/crud/Invoice/search/:query',
        FILE_UPLOAD: '/device/invoiceImage',
        PRODUCT: '/crud/Product',
        CITIES: '/crud/City/all',
        DISTRIBUTOR: '/crud/Distributor',
        DISTRIBUTORS: '/crud/Distributor/all',
        COMPANY: '/crud/Company',
        COMPANYS: '/crud/Company/all',
        CLIENT: '/crud/Client',
        CLIENTS: '/crud/Client/all',
        VENDOR: '/crud/Vendor',
        VENDORS: '/crud/Vendor/all',
        VENDOR_ALIAS: '/crud/Vendor/:alias',
        CLIENT_ALIAS: '/crud/Client/:alias',
        PRODUCT_TYPE: '/crud/ProductType',
        PRODUCT_TYPES: '/crud/ProductType/all',
        MACHINE: '/crud/Machine',
        MACHINES: '/crud/Machine/all',
        ZONE: '/crud/Zone',
        ZONES: '/crud/Zone/all',
        COMPANY_BUILDINGS: '/crud/CompanyBuilding',
        COMPANY_BUILDING: '/crud/CompanyBuilding/all',
        COMPANY_BUILDING_PRODUCT: '/crud/CompanyBuildingProduct?fieldName=status&value=accepted',
        COMPANY_BUILDING_PRODUCTS: '/crud/CompanyBuildingProduct?fieldName=status&value=New',
        ALL_COMPANY_BUILDING_PRODUCT: '/crud/CompanyBuildingProduct',
        COMPANY_BUILDING_PRODUCT_STATUS: '/crud/CompanyBuildingProduct/:alias',
        DOWNLOAD_PRODUCT_DATA_ALIAS: '/device/downloadProductDataByProductId/:alias',
        VENDOR_PRODUCTS: '/crud/VendorProduct?fieldName=status&value=New',

        INVOICE_DATA: '/device/getInvoiceByAlias/:alias',
        INVOICE_PRODUCTS: 'crud/InvoiceProduct',
        // VENDOR_PRODUCT:'/crud/VendorProduct',
        PRODUCT_STATUS: '/device/acceptInvoice/:alias',
        SUBSCRIPTIONS: '/crud/Subscription/all',
        VENDOR_SUBSCRIPTIONS: '/crud/VendorSubscription/all',

        CURRENT_SUBSCRIPTIONS: '/device/getCurrentSubscriptions',

        ACCEPT_PRODUCT: '/device/acceptInvoice/:alias/:subscriptionId',
        COMPANY_ALIAS: '/crud/CompanyProduct/:alias',
        ALL_CLIENT: '/device/getClient',

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
