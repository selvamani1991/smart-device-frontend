export const ROOM_TYPE_CONSTANTS = {
    'URL': {
         ROOM_TYPE: '/room-type',
         ROOM_TYPE_LIST: '/room-type/list',
         ROOM_TYPE_CREATE: '/room-type/create',
         ROOM_TYPE_EDIT: '/room-type/edit',
         ROOM_TYPE_SHOW: '/room-type/show'
    },

    LINK: {
        LIST: 'list',
        CREATE: 'create',
        EDIT: 'edit/:alias',
        SHOW: 'show/:alias'
    },

    LABEL: {
        ROOM_TYPE: 'RoomType',
        ROOM_TYPE_IMAGE: 'Image',
        ROOM_TYPE_DESC: 'RoomType Company Management',
        ROOM_TYPE_USER: 'RoomTypeUser',
        ROOM_TYPE_ADMIN: 'RoomTypeAdmin',
        ROOM_TYPE_LIST_LINK: 'roomType.list.pageLink',
        ROOM_TYPE_LIST: 'roomType.list.pageTitle',
        ROOM_TYPE_LIST_DESC: 'roomType.list.pageDesc',
        ROOM_TYPE_EDIT_LINK: 'roomType.edit.pageLink',
        ROOM_TYPE_EDIT: 'roomType.edit.pageTitle',
        ROOM_TYPE_EDIT_DESC: 'roomType.edit.pageDesc',
        ROOM_TYPE_SHOW_LINK: 'roomType.show.pageLink',
        ROOM_TYPE_SHOW: 'roomType.show.pageTitle',
        ROOM_TYPE_SHOW_DESC: 'roomType.show.pageDesc',
        ROOM_TYPE_CREATE_LINK: 'roomType.create.pageLink',
        ROOM_TYPE_CREATE: 'roomType.create.pageTitle',
        ROOM_TYPE_CREATE_DESC: 'roomType.create.pageDesc',
        ROOM_TYPE_ACTION_CREATE: 'page.action.create',
        ROOM_TYPE_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        ROOM_TYPE_ACTION_EDIT: 'page.action.update',
        ROOM_TYPE_NEW_PRODUCT_LIST_LINK: 'roomType.newProduct.pageLink',
        ROOM_TYPE_NEW_PRODUCT_LIST: 'roomType.newProduct.pageTitle',
        ROOM_TYPE_NEW_PRODUCT_LIST_DESC: 'roomType.newProduct.pageDesc'
    },

    API: {
        ROOM_TYPE: '/crud/RoomType',
        ROOM_TYPE_ALIAS: '/crud/RoomType/:alias',
        ROOM_TYPE_STATUS: '/changeRoomTypeStatus',
        SEARCH_ROOM_TYPE: '/crud/RoomType/search/:query',
        FILE_UPLOAD: '/device/roomTypeImage',
        ROOM_TYPES: '/crud/RoomType/all',
        CURRENCY: '/crud/Currency/all',
        PRODUCT_CATEGORIES: '/crud/ProductCategory/all'

    },

     FIELD: {
         NAME: 'device_roomType.name',
         NAME_FIELD: 'name'
     }
};
