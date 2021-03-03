export const AUTH_CONSTANTS = {
    'URL': {
        DASHBOARD: '/dashboard',
        LOGIN: '/login',
        REGISTER: '/register',
        REGISTERED: '/registered',
        CONFIRMED: '/confirmed',
        NOT_CONFIRMED: '/not-confirmed',
        FORGOT_PASSWORD: '/forgot-password',
        FORGOT_PASSWORD_CONFIRMATION: '/forgot-password-confirmation',
        RESET_PASSWORD: '/reset-password',
        MY_PROFILE: '/my-profile',
        PASSWORD_RESET: '/password-reset',
        SCREEN_LOCK: '/screen-lock',
        CHANGE_PASSWORD: '/change-password',
        SUBSCRIPTION: '/subscription',
        EDIT_PROFILE: '/edit-profile',

    },
    LINK: {
        LOGIN: 'login',
        REGISTER: 'register',
        REGISTERED: 'registered',
        CONFIRMED: 'confirmed',
        NOT_CONFIRMED: 'not-confirmed',
        FORGOT_PASSWORD: 'forgot-password',
        FORGOT_PASSWORD_CONFIRMATION: 'forgot-password-confirmation',
        RESET_PASSWORD: 'reset-password/:alias/:token',
        PASSWORD_RESET: 'password-reset',
        SCREEN_LOCK: 'screen-lock',
        MY_PROFILE: 'my-profile',
        CHANGE_PASSWORD: 'change-password/:alias',
        SUBSCRIPTION: 'subscription',
        EDIT_PROFILE: 'edit-profile/:alias',
    },
    'LABEL': {
        LOGIN_LINK: 'page.login.pageTitle',
        LOGIN_DESC: 'page.login.pageDesc',
        REGISTER_LINK: 'page.register.pageTitle',
        REGISTER_DESC: 'page.register.pageDesc',
        FORGOT_PASSWORD_LINK: 'page.forgot-password.pageTitle',
        FORGOT_PASSWORD_DESC: 'page.forgot-password.pageDesc',
        REGISTERED_LINK: 'page.registered.pageTitle',
        REGISTERED_DESC: 'page.registered.pageDesc',
        CONFIRMED_LINK: 'page.confirmed.pageTitle',
        CONFIRMED_DESC: 'page.confirmed.pageDesc',
        FORGOT_PASSWORD_CONFIRMATION_LINK: 'page.password-confirmed.pageTitle',
        FORGOT_PASSWORD_CONFIRMATION_DESC: 'page.password-confirmed.pageDesc',
        NOT_CONFIRMED_LINK: 'page.not-confirmed.pageTitle',
        NOT_CONFIRMED_DESC: 'page.not-confirmed.pageDesc',
        PASSWORD_RESET_LINK: 'page.password-reset.pageTitle',
        PASSWORD_RESET_DESC: 'page.password-reset.pageDesc',
        RESET_PASSWORD_LINK: 'page.reset-password.pageTitle',
        RESET_PASSWORD_DESC: 'page.reset-password.pageDesc',
        SCREEN_LOCK: 'Screen Lock',
        MY_PROFILE_LINK: 'My Profile',
        PROFILE_EDIT_LINK: 'My Profile Edit',
        MY_PROFILE_DESC: 'page.my-profile.pageDesc',
        USER_IMAGE: 'Image',
        PROFILE_UPDATE: 'My Profile',
        USER: 'User',
        USER_IMAGES: 'Image',
        USER_CHANGE_PASSWORD: 'User Change Password',
        USER_CHANGE_PASSWORD_DESC: 'Change Password Description',
        USER_CHANGE_PASSWORD_LINK: 'Change Password',
        USER_ACTION_CREATE: 'Create',
        USER_LIST: 'List',
        USER_LIST_LINK: 'List Link',
        SUBSCRIPTION: 'Subscription'

    },
    API: {
        AUTHENTICATE: '/authenticate',
        REGISTER: '/register',
        RESET: '/resetPassword',
        FORGOT: '/forgotPassword',
        LOGOUT: '/logout',
        ABOUT: '/me',
        FILE_UPLOAD: '/device/currentUserImage',
        DASHBOARD: '/permission/dashboard/:userId',
        FEATURES: '/permission/features/:userId',
        CHANGE_PASSWORD_ALIAS: '/crud/User/:alias',
        SUBSCRIPTION: '/crud/Subscription'
    },


     FIELD: {
            NAME: 'name',
            NAME_FIELD: 'name',
            EMAIL: 'email',
            EMAIL_FIELD: 'email',
            PHONE_NUMBER: 'phoneNo',
            PHONE_NUMBER_FIELD: 'phoneNo',
            PASSWORD: 'password',
            CONFIRM_PASSWORD: 'confirmPassword'
     }
};