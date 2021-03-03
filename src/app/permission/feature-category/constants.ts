export const FEATURE_CATEGORY_CONSTANTS = {
    'URL': {
        FEATURE_CATEGORY: '/permission/feature-category',
        FEATURE_CATEGORY_LIST: '/permission/feature-category/list',
        FEATURE_CATEGORY_EDIT: '/permission/feature-category/edit',
        FEATURE_CATEGORY_CREATE: '/permission/feature-category/create',
        FEATURE_CATEGORY_SHOW: '/permission/feature-category/show'
    },
    LINK: {
        LIST: 'list',
        CREATE: 'create',
        EDIT: 'edit/:alias',
        SHOW: 'show/:alias'
    },
    LABEL: {
        FEATURE_CATEGORY: 'FeatureCategory',
        FEATURE_CATEGORY_LIST_LINK: 'featureCategory.list.pageLink',
        FEATURE_CATEGORY_LIST: 'featureCategory.list.pageTitle',
        FEATURE_CATEGORY_LIST_DESC: 'featureCategory.list.pageDesc',
        FEATURE_CATEGORY_EDIT_LINK: 'featureCategory.edit.pageLink',
        FEATURE_CATEGORY_EDIT: 'featureCategory.edit.pageTitle',
        FEATURE_CATEGORY_EDIT_DESC: 'featureCategory.edit.pageDesc',
        FEATURE_CATEGORY_CREATE_LINK: 'featureCategory.create.pageLink',
        FEATURE_CATEGORY_CREATE: 'featureCategory.create.pageTitle',
        FEATURE_CATEGORY_CREATE_DESC: 'featureCategory.create.pageDesc',
        FEATURE_CATEGORY_SHOW_LINK: 'featureCategory.show.pageLink',
        FEATURE_CATEGORY_SHOW: 'featureCategory.show.pageTitle',
        FEATURE_CATEGORY_SHOW_DESC: 'featureCategory.show.pageDesc',
        FEATURE_CATEGORY_ACTION_CREATE: 'page.action.create',
        FEATURE_CATEGORY_ACTION_EDIT: 'page.action.update'
    },
    API: {
        FEATURE_CATEGORY: '/crud/FeatureCategory',
        FEATURE_CATEGORY_ALIAS: '/crud/FeatureCategory/:alias',
        FEATURE_CATEGORY_LOCK: '/permission/lockFeatureCategory/:featureCategoryId/:status',
        FEATURE: '/crud/Feature',
        SEARCH_FEATURE_CATEGORY: '/crud/FeatureCategory/search/:query'


    },
    FIELD: {
        NAME: 'name'
    }
};

export const FEATURE_CONSTANTS = {
    'URL': {
        FEATURE: '/permission/feature',
        FEATURE_LIST: '/permission/feature/list',
        FEATURE_EDIT: '/permission/feature/edit',
        FEATURE_CREATE: '/permission/feature/create',
        FEATURE_SHOW: '/permission/feature/show'
    },
    LINK: {
        LIST: 'list',
        CREATE: 'create',
        EDIT: 'edit/:alias',
        SHOW: 'show/:alias'
    },
    LABEL: {
        FEATURE: 'Feature',
        FEATURE_LIST_LINK: 'feature.list.pageLink',
        FEATURE_LIST: 'feature.list.pageTitle',
        FEATURE_LIST_DESC: 'feature.list.pageDesc',
        FEATURE_EDIT_LINK: 'feature.edit.pageLink',
        FEATURE_EDIT: 'feature.edit.pageTitle',
        FEATURE_EDIT_DESC: 'feature.edit.pageDesc',
        FEATURE_CREATE_LINK: 'feature.create.pageLink',
        FEATURE_CREATE: 'feature.create.pageTitle',
        FEATURE_CREATE_DESC: 'feature.create.pageDesc',
        FEATURE_SHOW_LINK: 'feature.show.pageLink',
        FEATURE_SHOW: 'feature.show.pageTitle',
        FEATURE_SHOW_DESC: 'feature.show.pageDesc',
        FEATURE_ACTION_CREATE: 'page.action.create',
        FEATURE_ACTION_EDIT: 'page.action.update'
    },
    API: {
        FEATURE: '/crud/Feature',
        FEATURE_ALIAS: '/crud/Feature/:alias',
        FEATURE_CATEGORIES: '/permission/featureCategories',
        FEATURE_LOCK: '/permission/lockFeature/:featureId/:status'
    },
    FIELD: {
        NAME: 'name',
        NAME_FIELD : 'nameField'
    }
};

