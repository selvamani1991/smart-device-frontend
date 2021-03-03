export const BOARD_CONSTANTS = {
    'URL': {
         BOARD: '/board',
         BOARD_BOARD_LIST: '/board/board-list',
         BOARD_BOARD_LIST_ALIAS: '/board/board-list/:alias',
         BOARD_EDIT: '/board/edit',
         BOARD_SHOW: '/board/show',
         BOARD_CREATE: '/board/create',
         BOARD_CREATE_ALIAS: '/board/create/:alias'
    },

    LINK: {
        BOARD_LIST: 'board-list',
        CREATE: 'create/:alias',
        SHOW: 'show/:alias',
        EDIT: 'edit/:alias'
    },

    LABEL: {
        BOARD: 'Board',
        BOARD_IMAGE: 'Image',
        BOARD_DESC: 'Board Company Management',
        BOARD_USER: 'BoardUser',
        BOARD_ADMIN: 'BoardAdmin',
        BOARD_LIST_LINK: 'board.list.pageLink',
        BOARD_LIST: 'board.list.pageTitle',
        BOARD_LIST_DESC: 'board.list.pageDesc',
        BOARD_EDIT_LINK: 'board.edit.pageLink',
        BOARD_EDIT: 'board.edit.pageTitle',
        BOARD_EDIT_DESC: 'board.edit.pageDesc',
        BOARD_SHOW_LINK: 'board.show.pageLink',
        BOARD_SHOW: 'board.show.pageTitle',
        BOARD_SHOW_DESC: 'board.show.pageDesc',
        BOARD_CREATE_LINK: 'board.create.pageLink',
        BOARD_CREATE: 'board.create.pageTitle',
        BOARD_CREATE_DESC: 'board.create.pageDesc',
        BOARD_ACTION_CREATE: 'page.action.create',
        BOARD_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        BOARD_ACTION_EDIT: 'page.action.update',
        BOARD_NEW_PRODUCT_LIST_LINK: 'board.newProduct.pageLink',
        BOARD_NEW_PRODUCT_LIST: 'board.newProduct.pageTitle',
        BOARD_NEW_PRODUCT_LIST_DESC: 'board.newProduct.pageDesc'
    },

    API: {
        BOARD: '/crud/Board',
        BOARD_ALIAS: '/crud/Board/:alias',
        BOARD_STATUS: '/changeBoardStatus',
        SEARCH_BOARD: '/crud/Board/search/:query',
        CITIES: '/crud/City/all',
        PRODUCTS: '/crud/Product',
        MANUFACTURERS: '/crud/Manufacturer/all',
        PRODUCT_STATUS: '/crud/Product/status/:new',
        FILE_UPLOAD: '/device/boardImage',
        BOARD_BY_BOARD_PRODUCT_TYPE: '/device/getBoardByBoardProductTypeId/:alias',
        UPDATE_ASSIGN_BOARD: '/crud/Board/:alias',
        BOARD_PRODUCT_TYPE_ALIAS: '/crud/BoardProductType/:alias',
        CLIENT:'/device/getClient'
    },

     FIELD: {
         BOARDID: 'device_board.UK_h9kuyt0prftmeoeoqar',
         BOARDID_DUPLICATE: 'UK_h9kuyt0prftmeoeoqar',
         DEVICEID_DUPLICATE: 'UK_khllmgnnm2jyr40s940',
         IMIEID_DUPLICATE: 'UK_5axk0hl2cnrhcxxapx0',
         BOARDID_FIELD: 'device_board.boardId',
         IMIEID: 'device_board.UK_5axk0hl2cnrhcxxapx0',
         DEVICEID: 'device_board.UK_khllmgnnm2jyr40s940'
     }
};
