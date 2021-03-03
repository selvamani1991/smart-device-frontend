export const MACHINE_CONSTANTS = {
    'URL': {
         MACHINE: '/machine',
         MACHINE_MACHINE_LIST: '/machine/machine-list',
         MACHINE_MACHINE_LIST_ALIAS: '/machine/machine-list/:alias',
         MACHINE_EDIT: '/machine/edit',
         MACHINE_SHOW: '/machine/show',
         MACHINE_CREATE: '/machine/create'
    },

    LINK: {
        MACHINE_LIST: 'machine-list/:alias',
        CREATE: 'create/:alias',
        SHOW: 'show/:alias',
        EDIT: 'edit/:alias'
    },

    LABEL: {
        MACHINE: 'Machine',
        MACHINE_IMAGE: 'Image',
        MACHINE_DESC: 'Machine Company Management',
        MACHINE_USER: 'MachineUser',
        MACHINE_ADMIN: 'MachineAdmin',
        MACHINE_LIST_LINK: 'machine.list.pageLink',
        MACHINE_MACHINE_LIST_LINK: 'machine.list.pageLink',
        MACHINE_MACHINE_PRODUCT_TYPE_LIST_LINK: 'machine.list.pageTypeLink',
        MACHINE_MACHINE_LIST: 'machine.list.pageTitle',
        MACHINE_MACHINE_LIST_DESC: 'machine.list.pageDesc',
        MACHINE_EDIT_LINK: 'machine.edit.pageLink',
        MACHINE_EDIT: 'machine.edit.pageTitle',
        MACHINE_EDIT_DESC: 'machine.edit.pageDesc',
        MACHINE_SHOW_LINK: 'machine.show.pageLink',
        MACHINE_SHOW: 'machine.show.pageTitle',
        MACHINE_SHOW_DESC: 'machine.show.pageDesc',
        MACHINE_CREATE_LINK: 'machine.create.pageLink',
        MACHINE_CREATE: 'machine.create.pageTitle',
        MACHINE_CREATE_DESC: 'machine.create.pageDesc',
        MACHINE_ACTION_CREATE: 'page.action.create',
        MACHINE_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        MACHINE_ACTION_EDIT: 'page.action.update',
        MACHINE_NEW_PRODUCT_LIST_LINK: 'machine.newProduct.pageLink',
        MACHINE_NEW_PRODUCT_LIST: 'machine.newProduct.pageTitle',
        MACHINE_NEW_PRODUCT_LIST_DESC: 'machine.newProduct.pageDesc'
    },

    API: {
        MACHINE: '/crud/Machine',
        MACHINE_ALIAS: '/crud/Machine/:alias',
        MACHINE_STATUS: '/changeMachineStatus',
        SEARCH_MACHINE: '/crud/Machine/search/:query',
        CITIES: '/crud/City/all',
        PRODUCTS: '/crud/Product',
        MANUFACTURERS: '/crud/Manufacturer/all',
        PRODUCT_STATUS: '/crud/Product/status/:new',
        FILE_UPLOAD: '/device/machineImage',
        MACHINE_PRODUCT_TYPE_ALIAS: '/device/getMachineByProductTypeId/:alias',
        MACHINE_BY_MACHINE_PRODUCT_TYPE: '/device/getMachineByMachineProductTypeId/:alias',
        MACHINE_PRODUCT_TYPE: '/crud/MachineProductType/:alias',
        UPDATE_ASSIGN_MACHINE: '/crud/Machine/:alias',
        MACHINE_PRODUCT_TYPE_DATA: '/crud/MachineProductType',
        CLIENT: '/device/getClient'
    },

     FIELD: {
         /* NAME: "name",
         NAME_FIELD: "name", */
         MACHINE_ID: 'device_machine.machineId',
         MACHINEID: 'machineId',
         MACHINE_ID_FIELD: 'machineId',
         MACHINEID_FIELD: 'machineId',
     }
};
