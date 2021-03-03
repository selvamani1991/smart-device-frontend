export const CONSUMER_PRODUCT_VALIDATOR = [
    {
        name: 'name',
        messages: {
            required: 'consumerProduct.error.name',
            minlength: 'consumerProduct.error.minName',
            verified: 'consumerProduct.error.verified',
            pattern: 'consumerProduct.error.namePattern',
            duplicate: 'consumerProduct.error.nameDuplicate'
        }
    },

    {
        name: 'description',
        messages: {
            required: 'consumerProduct.error.description',
            minlength: 'consumerProduct.error.minDescription',
            verified: 'consumerProduct.error.verified'
        }
    },

    {
        name: 'deviceId',
        messages: {
            required: 'consumerProduct.error.deviceId',
            minlength: 'consumerProduct.error.minDeviceId',
            verified: 'consumerProduct.error.verified',
            pattern: 'board.error.deviceIdPattern',
            duplicate: 'consumerProduct.error.deviceIdDuplicate'
        }
    },
    {
        name: 'imieId',
        messages: {
            required: 'consumerProduct.error.imeiId',
            minlength: 'consumerProduct.error.minImeidId',
            verified: 'consumerProduct.error.verified',
            pattern: 'consumerProduct.error.imeiIdPattern',
            duplicate: 'consumerProduct.error.imeiIdDuplicate'
        }
    },

    {
        name: 'modelNo',
        messages: {
            required: 'consumerProduct.error.modelNo',
            minlength: 'consumerProduct.error.minModelNo',
            verified: 'consumerProduct.error.verified',
            pattern: 'consumerProduct.error.modelNoPattern',
        }
    },

    {
        name: 'lotNo',
        messages: {
            required: 'consumerProduct.error.lotNo',
            minlength: 'consumerProduct.error.minLotNo',
            verified: 'consumerProduct.error.verified',
            pattern: 'consumerProduct.error.lotNoPattern',
            duplicate: 'consumerProduct.error.lotNoDuplicate'
        }
    },
    {
        name: 'manufacturingDate',
        messages: {
            required: 'consumerProduct.error.manufacturingDate',
            verified: 'consumerProduct.error.verified',
        }
    },
];
