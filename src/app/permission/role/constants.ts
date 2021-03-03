export const ROLE_CONSTANTS = {
    'URL': {
        ROLE: '/permission/role',
        ROLE_LIST: '/permission/role/list',
        ROLE_SHOW: '/permission/role/show',
        ROLE_CREATE: '/permission/role/create',
        ROLE_EDIT: '/permission/role/edit',
        ROLE_ASSIGN: '/permission/role/assign-feature'
    },
    LINK: {
        LIST: 'list',
        SHOW: 'show/:alias',
        CREATE: 'create',
        EDIT: 'edit/:alias',
        ASSIGN: 'assign-feature/:alias'
    },
    LABEL: {
        ROLE: 'Role',
        ROLE_LIST_LINK: 'role.list.pageLink',
        ROLE_LIST: 'role.list.pageTitle',
        ROLE_LIST_DESC: 'role.list.pageDesc',
        ROLE_CREATE_LINK: 'role.create.pageLink',
        ROLE_CREATE: 'role.create.pageTitle',
        ROLE_CREATE_DESC: 'role.create.pageDesc',
        ROLE_EDIT_LINK: 'role.edit.pageLink',
        ROLE_EDIT: 'role.edit.pageTitle',
        ROLE_EDIT_DESC: 'role.edit.pageDesc',
        ROLE_ASSIGN: 'role.assign.pageTitle',
        ROLE_ASSIGN_DESC: 'role.assign.pageDesc',
        ROLE_SHOW_LINK: 'role.show.pageLink',
        ROLE_SHOW: 'role.show.pageTitle',
        ROLE_SHOW_DESC: 'role.show.pageDesc',
        ROLE_ACTION_CREATE: 'page.action.create',
        ROLE_ACTION_EDIT: 'page.action.update',
        ROLE_ACTION_ASSIGN: 'page.action.assign'
    },
    API: {
        ROLE: '/crud/Role',
        ROLE_ALIAS: '/crud/Role/:alias',
        FEATURE_CATEGORIES: '/permission/featureCategories',
        FEATURES: '/permission/role-features/:alias',
        UPDATE_PERMISSION: '/permission/updateRoleFeature',
        SEARCH_ROLE: '/crud/Role/search/:query'
    },
    FIELD: {
        NAME: 'name',
        NAME_FIELD: 'name_filed'

    }
};
