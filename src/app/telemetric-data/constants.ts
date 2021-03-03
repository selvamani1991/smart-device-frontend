export const TELEMETRIC_DATA_CONSTANTS = {
    'URL': {
         TELEMETRIC_DATA: '/telemetric-data',
         TELEMETRIC_DATA_LIST: '/telemetric-data/list',
         ERROR_DATA: '/error-data',
         TELEMETRIC_DATA_ERROR_DATA: '/telemetric-data/error-data'
    },
    LINK: {
        LIST: 'list',
        ERROR_DATA: 'error-data'
    },

    LABEL: {
        TELEMETRIC_DATA: 'TelemetricData',
        TELEMETRIC_DATA_ADMIN: 'TelemetricDataAdmin',
        TELEMETRIC_DATA_LIST_LINK: 'telemetricData.list.pageLink',
        TELEMETRIC_DATA_LIST: 'telemetricData.list.pageTitle',
        TELEMETRIC_DATA_LIST_DESC: 'telemetricData.list.pageDesc' ,
        ERROR_DATA_ADMIN: 'ErrorDataAdmin',
        ERROR_DATA: 'ErrorData',
        ERROR_DATA_LIST_LINK: 'errorData.list.pageLink',
        ERROR_DATA_LIST: 'errorData.list.pageTitle',
        ERROR_DATA_LIST_DESC: 'errorData.list.pageDesc'
    },

    API: {
        TELEMETRIC_DATA: '/device/getTelemetricDataByProductId/:alias',
        TELEMETRIC_DATA_ALIAS: '/TelemetricData/:alias',
        TELEMETRIC_DATA_STATUS: '/crud/telemetricData/status/:new',
        TELEMETRIC_DATAS: '/crud/telemetricData/all',
        ERROR_DATA: '/device/getErrorDataByProductId/:alias',
        ERROR_DATA_ALIAS: '/ErrorData/:alias',
        ERROR_DATA_STATUS: '/crud/ErrorData/status/:new',
        ERROR_DATAS: '/crud/ErrorData/all'
    },

    FIELD: {
         NAME: 'name',
         USERNAME: 'username'
    }
};

