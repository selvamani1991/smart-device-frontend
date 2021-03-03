export const REPORT_VALIDATOR = [
    {
          name: 'name',
          messages: {
            required: 'report.error.name',
            minlength: 'report.error.minName',
            duplicate: 'report.error.duplicate',
            pattern: 'report.error.namePattern'
          }
    },


    {
        name: 'productType',
        messages: {
            required: 'report.error.productType',
        }
    },

    {
        name: 'product',
        messages: {
            required: 'report.error.productType',
        }
    },

    {
        name: 'companyBuilding',
        messages: {
            required: 'report.error.companyBuilding',
        }
    },
    {
        name: 'companyBuildingProduct',
        messages: {
            required: 'report.error.companyBuildingProduct',
        }
    },
    {
        name: 'startDate',
        messages: {
            required: 'report.error.startDate',
        }
    },
    {
        name: 'endDate',
        messages: {
            required: 'report.error.endDate',
        }
    },
];
