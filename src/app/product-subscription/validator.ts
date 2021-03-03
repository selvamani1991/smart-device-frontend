export const PRODUCT_SUBSCRIPTION_VALIDATOR = [
    {
          name: 'name',
          messages: {
            required: 'productSubscription.error.name',
            minlength: 'productSubscription.error.minName',
            duplicate: 'productSubscription.error.duplicate',
            verified: 'productSubscription.error.verified',
            pattern: 'productSubscription.error.namePattern'
          }
    },

    {
        name: 'description',
        messages: {
            required: 'productSubscription.error.description',
            minlength: 'productSubscription.error.minDescription',
            verified: 'productSubscription.error.verified'
        }
    },
    {
        name: 'price',
        messages: {
            required: 'productSubscription.error.price',
            minlength: 'productSubscription.error.minPrice',
            verified: 'productSubscription.error.verified',
            pattern: 'productSubscription.error.pricePattern'

        }
    },
    {
        name: 'duration',
        messages: {
            required: 'productSubscription.error.duration',
            verified: 'productSubscription.error.verified'
        }
    },
    {
        name: 'machineTypeCount',
        messages: {
            required: 'productSubscription.error.machineTypeCount',
            minlength: 'productSubscription.error.minMachineTypeCount',
            verified: 'productSubscription.error.verified',
            pattern: 'productSubscription.error.machineTypeCountPattern'
        }
    },
     {
        name: 'machineCount',
        messages: {
            required: 'productSubscription.error.machineCount',
            minlength: 'productSubscription.error.minMachineCount',
            verified: 'productSubscription.error.verified',
            pattern: 'productSubscription.error.machineCountPattern'
        }
    },
     {
        name: 'maxUsages',
        messages: {
            required: 'productSubscription.error.maxUsages',
            verified: 'productSubscription.error.verified',
            minlength: 'productSubscription.error.minMaxUsages',
            pattern: 'productSubscription.error.maxUsagesPattern'
        }
    },
    {
        name: 'elapsedPeriod',
        messages: {
            required: 'productSubscription.error.elapsedPeriod',
            verified: 'productSubscription.error.verified'
        }
    },
    {
        name: 'salesPercentage',
        messages: {
            required: 'productSubscription.error.salesPercentage',
            minlength: 'productSubscription.error.minSalesPercentage',
            verified: 'productSubscription.error.verified',
            pattern: 'productSubscription.error.salesPercentagePattern'
        }
    },
    {
        name: 'productCount',
        messages: {
            required: 'productSubscription.error.productCount',
            minlength: 'productSubscription.error.minProductCount',
            verified: 'productSubscription.error.verified',
            pattern: 'productSubscription.error.productCountPattern'
        }
    },
    {
        name: 'file',
        messages: {
            required: 'productSubscription.error.file',
            verified: 'productSubscription.error.verified',
            pattern: 'productSubscription.error.invalidPattern'
        }
    },
];
