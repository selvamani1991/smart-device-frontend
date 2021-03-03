export const PRODUCT_CATEGORY_VALIDATOR = [
    {
          name: 'name',
          messages: {
            required: 'productCategory.error.name',
            minlength: 'productCategory.error.minName',
            duplicate: 'productCategory.error.duplicate',
            verified: 'productCategory.error.verified',
            pattern: 'productCategory.error.namePattern'
          }
    },

    {
        name: 'description',
        messages: {
            required: 'productCategory.error.description',
            minlength: 'productCategory.error.minDescription',
            verified: 'productCategory.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },

    {
        name: 'file',
        messages: {
            required: 'productCategory.error.file',
            verified: 'productCategory.error.verified',
            pattern: 'productCategory.error.invalidPattern'
        }
    },
];
