export const CONSUMER_PRODUCT_TYPE_VALIDATOR = [
    {
        name: 'name',
        messages: {
            required: 'consumerProductType.error.name',
            minlength: 'consumerProductType.error.minName',
            verified: 'consumerProductType.error.verified',
            pattern: 'consumerProductType.error.namePattern',
            duplicate: 'consumerProductType.error.nameDuplicate'
        }
    },

    {
        name: 'description',
        messages: {
            required: 'consumerProductType.error.description',
            minlength: 'consumerProductType.error.minDescription',
            verified: 'consumerProductType.error.verified'
        }
    },

    {
        name: 'productInstruction',
        messages: {
            required: 'consumerProductType.error.productInstruction',
            minlength: 'consumerProductType.error.minProductInstruction',
            verified: 'consumerProductType.error.verified'
        }
    }
];

export const ATTRIBUTE_VALIDATOR = [
    {
        name: 'name',
        messages: {
            required: 'productType.error.attributeNameRequired',
            minlength: 'productType.error.minName'
        }
    },

    {

        name: 'valueType',
        messages: {
            required: 'productType.error.attributeTypeRequired',

        }

    },

    {
        name: 'valueMin',
        messages: {
            required: 'productType.error.minValueRequired',
            pattern: 'productType.error.valueMinPattern'

        }

    },

    {

        name: 'valueMax',
        messages: {
            required: 'productType.error.maxValueRequired',
            pattern: 'productType.error.valueMaxPattern'

        }

    },

    {
        name: 'valueDefault',
        messages: {
            required: 'productType.error.defaultValueRequired',
            pattern: 'productType.error.valueDefaultPattern'

        }

    },

    {
        name: 'code',
        messages: {
            required: 'productType.error.codeRequired',
            pattern: 'productType.error.codePattern'
        }
    },
    {

        name: 'attributeType',
        messages: {
            required: 'productType.error.attributeType',
        }
    }


];
