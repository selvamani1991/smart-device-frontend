export const PRODUCT_VALIDATOR = [
    {
         name: 'name',
         messages: {
             required: 'product.error.name',
             minlength: 'product.error.minName',
             duplicate: 'product.error.duplicate',
             verified: 'product.error.verified',
             pattern: 'product.error.namePattern'
         }
    },
    {
        name: 'description',
        messages: {
            required: 'product.error.description',
            minlength: 'product.error.minDescription',
            verified: 'product.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },
    {
        name: 'model',
        messages: {
            required: 'product.error.model',
            minlength: 'product.error.minDescription',
            verified: 'product.error.verified'
        }
    },
    {
        name: 'subscription',
        messages: {
            required: 'product.error.subscription',
            minlength: 'product.error.minDescription',
            verified: 'product.error.verified'
        }
    },

    {
        name: 'category',
        messages: {
            required: 'product.error.category',
            minlength: 'product.error.minDescription',
            verified: 'product.error.verified'
        }
    },

    {
         name: 'manufacturerDate',
         messages: {
             required: 'product.error.manufacturerDate',
             verified: 'product.error.verified'
         }
    },

    {
         name: 'deviceId',
         messages: {
              required: 'product.error.deviceId',
              minlength: 'product.error.minDeviceId',
              duplicate: 'product.error.duplicateDeviceId',
              verified: 'product.error.verified',
              pattern: 'board.error.deviceIdPattern',
         }
    },

    {
         name: 'imieId',
         messages: {
             required: 'product.error.imieId',
             minlength: 'product.error.minImieId',
             duplicate: 'product.error.duplicateImieId',
             verified: 'product.error.verified'
         }
    },

    {
          name: 'boardId',
          messages: {
                required: 'product.error.boardId',
                minlength: 'product.error.minImieId',
                duplicate: 'product.error.duplicateImieId',
                verified: 'product.error.verified'
          }
    },
    {
        name: 'machineId',
        messages: {
            required: 'product.error.machineId',
            minlength: 'product.error.minImieId',
            duplicate: 'product.error.duplicateImieId',
            verified: 'product.error.verified'
        }
    },

    {
        name: 'productType',
        messages: {
            required: 'product.error.productType',

        }

    },
    {
        name: 'board',
        messages: {
            required: 'product.error.board',

        }

    },
    {
        name: 'machine',
        messages: {
            required: 'product.error.machine',

        }

    },
    {
        name: 'machineId',
        messages: {
            required: 'product.error.machine',

        }

    },
    {
        name: 'startDate',
        messages: {
            required: 'product.error.startDate',

        }

    },
    {
        name: 'endDate',
        messages: {
            required: 'product.error.endDate',

        }

    },
    {
        name: 'manufacturerDate',
        messages: {
            required: 'product.error.manufacturerDate',

        }

    },

    {
        name: 'subscriptionId',
        messages: {
            required: 'product.error.subscriptionId',
            verified: 'product.error.verified'
        }
    },
    {
        name: 'vendorId',
        messages: {
            required: 'product.error.vendorId',
            verified: 'product.error.verified'
        }
    },
    {
        name: 'companyId',
        messages: {
            required: 'product.error.companyId',
            verified: 'product.error.verified'
        }
    },
    {
        name: 'url',
        messages: {
            required: 'product.error.url',
            minlength: 'product.error.minDescription',
            verified: 'product.error.verified',
            pattern: 'board.error.deviceIdPattern'
        }
    },

    {
        name: 'component',
        messages: {
            required: 'product.error.component',
            verified: 'product.error.verified'
        }
    },


];
