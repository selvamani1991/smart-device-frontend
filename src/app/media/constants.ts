export const MEDIA_CONSTANTS = {
    'URL': {
         MEDIA: '/media',
         MEDIA_MEDIA_LIST: '/media/media-list',
         MEDIA_CREATE: '/media/create',
         MEDIA_EDIT: '/media/edit',
         MEDIA_SHOW: '/media/show',
         MEDIA_SHOW_FIRMWARE: '/media/show-firmware',
         MEDIA_FIRMWARE_LIST: '/media/firmware-list',
         MEDIA_CREATE_FIRMWARE: '/media/create-firmware'
    },

    LINK: {
        MEDIA_LIST: 'media-list',
        CREATE: 'create/:alias',
        EDIT: 'edit/:alias',
        SHOW: 'show/:alias',
        SHOW_FIRMWARE: 'show-firmware/:alias',
        FIRMWARE_LIST: 'firmware-list',
        CREATE_FIRMWARE: 'create-firmware/:alias',
    },

    LABEL: {
        MEDIA: 'Media',
        FIRMWARE: 'Firmware',
        FIRMWARE_LIST: 'media.list.firmWareList',
        FIRMWARE_LIST_LINK: 'media.list.firmWareList',
        FIRMWARE_LIST_DESC: 'media.list.firmWareDescription',
        FIRMWARE_CREATE: 'media.list.firmWareCreate',
        FIRMWARE_CREATE_DESC: 'media.list.firmWareCreate',
        MEDIA_IMAGE: 'media.list.image',
        MEDIA_DESC: 'media.form.title',
        MEDIA_LIST_LINK: 'media.list.pageLink',
        MEDIA_LIST: 'media.list.pageTitle',
        MEDIA_LIST_DESC: 'media.list.pageDesc',
        MEDIA_EDIT_LINK: 'media.edit.pageLink',
        MEDIA_EDIT: 'media.edit.pageTitle',
        MEDIA_EDIT_DESC: 'media.edit.pageDesc',
        MEDIA_SHOW_LINK: 'media.show.pageLink',
        FIRMWARE_SHOW_LINK: 'Show Firmware',
        MEDIA_SHOW: 'media.show.pageTitle',
        MEDIA_SHOW_DESC: 'media.show.pageDesc',
        MEDIA_CREATE_LINK: 'media.create.pageLink',
        MEDIA_CREATE: 'media.create.pageTitle',
        MEDIA_CREATE_DESC: 'media.create.pageDesc',
        MEDIA_ACTION_CREATE: 'page.action.create',
        MEDIA_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        MEDIA_ACTION_EDIT: 'page.action.update',
        MEDIA_NEW_PRODUCT_LIST_LINK: 'media.newProduct.pageLink',
        MEDIA_NEW_PRODUCT_LIST: 'media.newProduct.pageTitle',
        MEDIA_NEW_PRODUCT_LIST_DESC: 'media.newProduct.pageDesc'
    },

    API: {
        MEDIA: '/crud/Media',
        MEDIA_ALIAS: '/crud/Media/:alias',
        MEDIA_STATUS: '/changeMediaStatus',
        SEARCH_MEDIA: '/crud/Media/search/:query',
        MEDIAS: '/crud/Media/all',
        MEDIA_UPLOAD: '/device/mediaFile',
        IMAGE_UPLOAD: '/device/mediaImage',
        MEDIA_PRODUCT_TYPE_ALIAS: '/device/getMediaByProductTypeId/:alias',
        FIRMWARE_TYPE_MEDIA: '/device/getFirmwareMediaByProductTypeId/:alias',
        PRODUCT_TYPE_ALIAS: '/crud/ProductType/:alias',
        CLIENT: '/device/getClient',

    },

     FIELD: {
         NAME: 'name',
         NAME_FIELD: 'name'
     }
};

export const MEDIA_RESOURCES_CONSTANTS = {
    "URL": {
         MEDIA_SHOW: '/media/show/:alias',
         MEDIA_SHOW_FIRMWARE: '/media/show-firmware/:alias',
    }
}