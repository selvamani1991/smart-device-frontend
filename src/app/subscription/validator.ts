export const SUBSCRIPTION_VALIDATOR = [
    {
          name: 'name',
          messages: {
            required: 'subscription.error.name',
            minlength: 'subscription.error.minName',
            duplicate: 'subscription.error.duplicate',
            verified: 'subscription.error.verified',
            pattern: 'subscription.error.namePattern'
          }
    },

    {
        name: 'description',
        messages: {
            required: 'subscription.error.description',
            minlength: 'subscription.error.minDescription',
            verified: 'subscription.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },
    {
        name: 'price',
        messages: {
            required: 'subscription.error.price',
            verified: 'subscription.error.verified',
            pattern: 'subscription.error.pricePattern'
        }
    },
    {
        name: 'costPerMachine',
        messages: {
            required: 'subscription.error.costPerMachine',
            verified: 'subscription.error.verified',
            pattern: 'subscription.error.pricePattern'
        }
    },

    {
        name: 'duration',
        messages: {
            required: 'subscription.error.duration',
            verified: 'subscription.error.verified'
        }
    },
    {
        name: 'machineTypeCount',
        messages: {
            required: 'subscription.error.machineTypeCount',
            verified: 'subscription.error.verified',
            pattern: 'subscription.error.machineTypeCountPattern'
        }
    },
    {
        name: 'machineCount',
        messages: {
            required: 'subscription.error.machineCount',
            verified: 'subscription.error.verified',
            pattern: 'subscription.error.machineCountPattern'
        }
    },
    {
        name: 'maxUsages',
        messages: {
            required: 'subscription.error.maxUsages',
            verified: 'subscription.error.verified',
             pattern: 'subscription.error.machineCountPattern'
        }
    },
    {
        name: 'elapsedPeriod',
        messages: {
            required: 'subscription.error.elapsedPeriod',
            verified: 'subscription.error.verified'
        }
    },
    {
        name: 'salesPercentage',
        messages: {
            required: 'subscription.error.salesPercentage',
            verified: 'subscription.error.verified',
             pattern: 'subscription.error.salesPercentagePattern'
        }
    },
    {
        name: 'salesApplicable',
        messages: {
            required: 'subscription.error.salesApplicable',
            verified: 'subscription.error.verified'
        }
    },
    {
        name: 'currency',
        messages: {
            required: 'subscription.error.currency',
            verified: 'subscription.error.verified'
        }
    },
    {
        name: 'productCategory',
        messages: {
            required: 'subscription.error.productCategory',
            verified: 'subscription.error.verified'
        }
    },


];
