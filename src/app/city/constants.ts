export const CITY_CONSTANTS = {
    "URL": {
         CITY: '/city',
         CITY_LIST: '/city/list',
         CITY_SHOW: '/city/show',
         CITY_CREATE: '/city/create',
         CITY_EDIT: '/city/edit'
    },

    LINK:{
        LIST: 'list',
        SHOW: 'show/:alias',
        CREATE: "create",
        EDIT: 'edit/:alias',
    },

    LABEL: {
        CITY: "City",
        //CITY: "city.list.city",
        CITY_IMAGE: "Image",
        CITY_IMAGES: "Image",
        CITY_ADMIN: "CityAdmin",
        CITY_LIST_LINK: "city.list.pageLink",
        CITY_LIST: "city.list.pageTitle",
        CITY_LIST_DESC: "city.list.pageDesc",
        CITY_EDIT_LINK: "city.edit.pageLink",
        CITY_EDIT: "city.edit.pageTitle",
        CITY_EDIT_DESC: "city.edit.pageDesc",
        CITY_SHOW_LINK: "city.show.pageLink",
        CITY_SHOW: "city.show.pageTitle",
        CITY_SHOW_DESC: "city.show.pageDesc",
        CITY_ACTION_CREATE:'page.action.create',
        CITY_ACTION_CHANGE_PASSWORD:'page.action.change_password',
        CITY_ACTION_EDIT:'page.action.update',
        CITY_CREATE_LINK: "city.create.pageLink",
        CITY_CREATE: "city.create.pageTitle",
        CITY_CREATE_DESC: "city.create.pageDesc",
        CITY_SHOW_COMPANY_CITY_LINK: "city.show-company-city.pageLink",
        CITY_SHOW_COMPANY_CITY: "city.show-company-city.pageTitle",
        CITY_SHOW_COMPANY_CITY_DESC: "city.show-company-city.pageDesc",
        CITY_SHOW_ADMIN_LINK: "city.show-admin.pageLink",
        CITY_SHOW_ADMIN: "city.show-admin.pageTitle",
        CITY_SHOW_ADMIN_DESC: "city.show-admin.pageDesc"
    },

    API:{
        CITY: '/crud/City',
        CITY_ALIAS: '/crud/City/:alias',
        SEARCH_CITY:'/crud/City/search/:query',
        CITY_BY_COMPANY_ID:'/company/getCityByCompanyId/:id',
        CITY_BY_ADMIN:'/company/getCityAdminByCityId/:id',
        CITY_ADMIN: '/crud/CityAdmin',
        CITY_ADMIN_ID: '/crud/CityAdmin/:id',
        SEARCH_CITY_ADMIN:'/crud/CityAdmin/search/:query',
        FILE_UPLOAD:'/device/cityImage'
    },

    FIELD:{
        NAME: "name",
        NAME_FIELD: "name",
        EMAIL: "email",
        USERNAME: "username",
        PHONE_NO: "phoneNo",
        CONFIRM_PASSWORD:"confirmPassword"
    }
};

