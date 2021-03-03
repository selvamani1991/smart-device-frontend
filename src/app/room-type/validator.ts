export const ROOM_TYPE_VALIDATOR = [
    {
          name: 'name',
          messages: {
            required: 'roomType.error.name',
            minlength: 'roomType.error.minName',
            duplicate: 'roomType.error.duplicate',
            verified: 'roomType.error.verified',
            pattern: 'roomType.error.namePattern'
          }
    },

    {
        name: 'description',
        messages: {
            required: 'roomType.error.description',
            minlength: 'roomType.error.minDescription',
            verified: 'roomType.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },
    {
        name: 'price',
        messages: {
            required: 'roomType.error.price',
            verified: 'roomType.error.verified',
            pattern: 'roomType.error.pricePattern'
        }
    },
    {
        name: 'costPerMachine',
        messages: {
            required: 'roomType.error.costPerMachine',
            verified: 'roomType.error.verified',
            pattern: 'roomType.error.pricePattern'
        }
    },

    {
        name: 'duration',
        messages: {
            required: 'roomType.error.duration',
            verified: 'roomType.error.verified'
        }
    },
    {
        name: 'machineTypeCount',
        messages: {
            required: 'roomType.error.machineTypeCount',
            verified: 'roomType.error.verified',
            pattern: 'roomType.error.machineTypeCountPattern'
        }
    },
    {
        name: 'machineCount',
        messages: {
            required: 'roomType.error.machineCount',
            verified: 'roomType.error.verified',
            pattern: 'roomType.error.machineCountPattern'
        }
    },
    {
        name: 'maxUsages',
        messages: {
            required: 'roomType.error.maxUsages',
            verified: 'roomType.error.verified'
        }
    },
    {
        name: 'elapsedPeriod',
        messages: {
            required: 'roomType.error.elapsedPeriod',
            verified: 'roomType.error.verified'
        }
    },
    {
        name: 'salesPercentage',
        messages: {
            required: 'roomType.error.salesPercentage',
            verified: 'roomType.error.verified'
        }
    },
    {
        name: 'salesApplicable',
        messages: {
            required: 'roomType.error.salesApplicable',
            verified: 'roomType.error.verified'
        }
    },
    {
        name: 'currency',
        messages: {
            required: 'roomType.error.currency',
            verified: 'roomType.error.verified'
        }
    },
    {
        name: 'productCategory',
        messages: {
            required: 'roomType.error.productCategory',
            verified: 'roomType.error.verified'
        }
    },


];
