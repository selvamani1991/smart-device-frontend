export const INVOICE_VALIDATOR = [
    {
        name: 'name',
        messages: {
            required: 'invoice.error.name',
            minlength: 'invoice.error.minName',
            duplicate: 'invoice.error.duplicate',
            verified: 'invoice.error.verified',
            pattern: 'invoice.error.namePattern'
        }
    },

    {
        name: 'description',
        messages: {
            required: 'invoice.error.description',
            minlength: 'invoice.error.minDescription',
            verified: 'invoice.error.verified'
        }
    },
    {
        name: 'email',
        messages: {
          required: 'invoice.error.emailRequired',
          email: 'invoice.error.email',
          pattern: 'invoice.error.emailPattern',
          duplicate: 'invoice.error.duplicateEmail'
        }
    },
    {

        name: 'password',
        messages: {
            required: 'invoice.error.password',
            verified: 'invoice.error.verified',
            minlength: 'invoice.error.minPassword'
        }
    },

    {
        name: 'confirmPassword',
        messages: {
            required: 'invoice.error.confirmPassword',
            verified: 'invoice.error.verified',
            match:    'invoice.error.matchConfirmPassword',
            minlength: 'invoice.error.minConfirmPassword'
        }
    },
    {
        name: 'productCount',
        messages: {
            required: 'invoice.error.productCount',
            verified: 'invoice.error.verified',
            pattern: 'invoice.error.productCountPattern'
        }
    },
    {
        name: 'file',
        messages: {
            required: 'invoice.error.file',
            verified: 'invoice.error.verified',
            pattern: 'invoice.error.invalidPattern'
        }
    },
    {
        name: 'companySubscription',
        messages: {
            required: 'invoice.error.companySubscription',
            verified: 'invoice.error.verified',
        }
    },
    {
        name: 'distributorSubscription',
        messages: {
            required: 'invoice.error.distributorSubscription',
            verified: 'invoice.error.verified',
        }
    },
    {
        name: 'vendorSubscription',
        messages: {
            required: 'invoice.error.vendorSubscription',
            verified: 'invoice.error.verified',
        }
    },
];
