export const ZONE_VALIDATOR = [
    {
          name: 'name',
          messages: {
            required: 'zone.error.name',
            minlength: 'zone.error.minName',
            duplicate: 'zone.error.duplicate',
            verified: 'zone.error.verified',
            pattern: 'zone.error.namePattern'
          }
    },

    {
        name: 'description',
        messages: {
            required: 'zone.error.description',
            minlength: 'zone.error.minDescription',
            verified: 'zone.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },
    {
        name: 'email',
        messages: {
          required: 'zone.error.emailRequired',
          email: 'zone.error.email',
          pattern: 'zone.error.emailPattern',
          duplicate: 'zone.error.duplicateEmail'
        }
    },
    {

        name: 'password',
        messages: {
            required: 'zone.error.password',
            verified: 'zone.error.verified',
            minlength: 'zone.error.minPassword'
        }
    },

    {
        name: 'confirmPassword',
        messages: {
            required: 'zone.error.confirmPassword',
            verified: 'zone.error.verified',
            match:    'zone.error.matchConfirmPassword',
            minlength: 'zone.error.minConfirmPassword'
        }
    },
    {
        name: 'productCount',
        messages: {
            required: 'zone.error.productCount',
            verified: 'zone.error.verified',
            pattern: 'zone.error.productCountPattern'
        }
    },
    {
        name: 'file',
        messages: {
            required: 'zone.error.file',
            verified: 'zone.error.verified',
            pattern: 'zone.error.invalidPattern'
        }
    },
];
