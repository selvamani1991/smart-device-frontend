export const PRODUCT_TYPE_VALIDATOR = [
    {
          name: 'name',
          messages: {
            required: 'productType.error.name',
            minlength: 'productType.error.minName',
            verified: 'productType.error.verified',
            pattern: 'productType.error.namePattern',
            duplicate: 'product.error.duplicate'
          }
    },

    {
        name: 'description',
        messages: {
            required: 'productType.error.description',
            minlength: 'productType.error.minDescription',
            verified: 'productType.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },
    {
        name: 'modelNo',
        messages: {
            required: 'productType.error.modelNo',
            verified: 'productType.error.verified',
            minlength: 'productType.error.minName',
            pattern: 'productType.error.modelPattern',
        }
    },
    {
        name: 'file',
        messages: {
            required: 'productType.error.file',
            verified: 'productType.error.verified'
        }
    },
    {
        name: 'subscriptionId',
        messages: {
            required: 'productType.error.subscriptionId',
            verified: 'productType.error.verified'
        }
    },
    {
        name: 'productCategory',
        messages: {
            required: 'productType.error.productCategory',
            verified: 'productType.error.verified'
        }
    },
    {
        name: 'provider',
        messages: {
            required: 'productType.error.provider',
            verified: 'productType.error.verified'
        }
    },
    {
          name: 'boardId',
          messages: {
                required: 'productType.error.boardId',
                pattern: 'productType.error.boardIdPattern',
                duplicate: 'product.error.duplicateImieId',
                verified: 'productType.error.verified'
          }
    },
    {
        name: 'machineId',
        messages: {
            required: 'productType.error.machineId',
            pattern: 'productType.error.boardIdPattern',
            duplicate: 'product.error.duplicateImieId',
            verified: 'productType.error.verified'
        }
    },
];



export const COMPONENT_VALIDATOR = [

    {
       name: 'name',
       messages: {
            required: 'productType.error.componentNameRequired',
            minlength: 'productType.error.minName'
       }
    },

    {
       name: 'code',
       messages: {
            required: 'productType.error.codeRequired',
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
    }


];
