export const PRODUCT_WIZARD_VALIDATOR = [

    {
        name: "clientSubscription",
        messages: {
            required: "product.error.clientSubscription",
            minlength: "product.error.minDescription",
            verified: "product.error.verified"
        }
    },
    {
        name: "productTypeId",
        messages: {
            required: "report.error.productType",
            minlength: "product.error.minDescription",
            verified: "product.error.verified"
        }
    },

    {
          name: "deviceId",
          messages: {
                required: "product.error.deviceId",
                minlength: "product.error.minDeviceId",
                duplicate: "product.error.duplicateDeviceId",
                verified: "product.error.verified",
                pattern: "board.error.deviceIdPattern",
          }
    },

    {
          name: "imieId",
          messages: {
                required: "product.error.imieId",
                minlength: "product.error.minImieId",
                duplicate: "product.error.duplicateImieId",
                verified: "product.error.verified"
          }
    },

    {
       name: "boardManufacturerId",
       messages: {
            required: "product.error.boardManufacturerId",

       }

    },
    {
       name: "machineManufacturerId",
       messages: {
            required: "product.error.machineManufacturerId",

       }

    },

    {
       name: "orderCount",
       messages: {
            required: "product.error.orderCount",

       }

    },
    {
       name: "price",
       messages: {
            required: "product.error.price",
            pattern: 'subscription.error.pricePattern'

       }

    },

    {
        name: "machineId",
        messages: {
            required: "product.error.machineId",
            verified: "product.error.verified",
            duplicate: "product.error.duplicateMachineId",
        }
    },
    {
        name: "vendorId",
        messages: {
            required: "report.error.productType",
            verified: "product.error.verified",
        }
    },
    {
        name: "companyId",
        messages: {
            required: "report.error.productType",
            verified: "product.error.verified",
        }
    },
    {
        name: "boardId",
        messages: {
            required: "product.error.boardId",
            verified: "product.error.verified",
            duplicate: "product.error.duplicateBoardId",
        }
    },

    {
       name: "manufacturerDate",
       messages: {
            required: "product.error.manufacturerDate",

       }

    },

];
