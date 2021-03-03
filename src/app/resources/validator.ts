export const RESOURCES_VALIDATOR = [
    {
          name: "name",
          messages: {
            required: "resources.error.name",
            minlength: "resources.error.minName",
            duplicate: "resources.error.duplicate",
            pattern: "resources.error.namePattern"
          }
    },


    {
        name: "productType",
        messages: {
            required: "report.error.productType",
        }
    },

    {
        name: "product",
        messages: {
            required: "resources.error.product",
        }
    },

    {
        name: "companyBuilding",
        messages: {
            required: "resources.error.companyBuilding",
        }
    },
    {
        name: "startDate",
        messages: {
            required: "resources.error.startDate",
        }
    },
    {
        name: "endDate",
        messages: {
            required: "resources.error.endDate",
        }
    },
];