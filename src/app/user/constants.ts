export const USER_CONSTANTS = {
    'URL': {
        USER: '/user',
        USER_LIST: '/user/list',
        USER_EDIT: '/user/edit',
        USER_CREATE: '/user/create',
        USER_SHOW: '/user/show',
        USER_CHANGE_PASSWORD: '/user/change-password'
    },
    LINK: {
        LIST: 'list',
        CREATE: 'create',
        SHOW: 'show/:alias',
        EDIT: 'edit/:alias',
        CHANGE_PASSWORD: 'change-password/:alias'
    },
    LABEL: {
        USER: 'User',
        USER_IMAGE: 'Image',
        USER_LIST_LINK: 'user.list.pageLink',
        USER_LIST: 'user.list.pageTitle',
        USER_LIST_DESC: 'user.list.pageDesc',
        USER_EDIT_LINK: 'user.edit.pageLink',
        USER_EDIT: 'user.edit.pageTitle',
        USER_EDIT_DESC: 'user.edit.pageDesc',
        USER_CREATE_LINK: 'user.create.pageLink',
        USER_CREATE: 'user.create.pageTitle',
        USER_CREATE_DESC: 'user.create.pageDesc',
        USER_SHOW_LINK: 'user.show.pageLink',
        USER_SHOW: 'user.show.pageTitle',
        USER_SHOW_DESC: 'user.show.pageDesc',
        USER_CHANGE_PASSWORD_LINK: 'user.changePassword.pageLink',
        USER_CHANGE_PASSWORD: 'user.changePassword.pageTitle',
        USER_CHANGE_PASSWORD_DESC: 'user.changePassword.pageDesc',
        USER_ACTION_CREATE: 'page.action.create',
        USER_ACTION_CHANGE_PASSWORD: 'page.action.change_password',
        USER_ACTION_EDIT: 'page.action.update'
    },
    API: {
        USER: '/crud/User',
        USERS: '/crud/User/all',
        USER_ALIAS: '/crud/User/:alias',
        USER_STATUS: '/changeUserStatus',
        SEARCH_USER: '/crud/User/search/:query',
        USER_TYPES : '/crud/UserType/all',
        FILE_UPLOAD: '/device/userImage',
        CURRENT_ADMIN_ALIAS: '/device/getOwnerDetailByAlias/:alias',
        PROFILE_PICTURE: '/crud/User/:alias'

    },
    FIELD: {

         PASSWORD: 'password',
         CONFIRM_PASSWORD: 'confirmPassword',
         OLD_PASSWORD: 'tempPassword',
         USER_NAME: 'organisation_organisation.username',
         USER_NAME_FIELD: 'username',

         EMAIL: 'email',
         EMAIL_FIELD: 'email',

         PHONE_NO: 'auth_user.phoneNo',
         PHONE_NO_FIELD: 'phoneNo'
         }



};
