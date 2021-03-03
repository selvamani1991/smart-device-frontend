export const DISTRIBUTOR_VALIDATOR = [
    {
         name: 'name',
         messages: {
            required: 'distributor.error.name',
            minlength: 'distributor.error.minName',
            duplicate: 'distributor.error.duplicate',
            verified: 'distributor.error.verified',
            pattern: 'distributor.error.namePattern'
         }
    },

    {
        name: 'description',
        messages: {
            required: 'distributor.error.description',
            minlength: 'distributor.error.minDescription',
            duplicate: 'distributor.error.duplicate',
            verified: 'distributor.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },

    {
        name: 'emailNotification',
        messages: {
          required: 'company.error.emailNotification',
          //email: 'user.error.email',
          pattern: 'user.error.emailPattern',
          duplicate: 'user.error.duplicateEmail'
        }
    },

    {
         name: 'company',
         messages: {
                required: 'distributor.error.company',
                verified: 'distributor.error.verified'
         }
    },


    {
         name: 'dispatchedDate',
         messages: {
             required: 'distributor.error.dispatchedDate',
             verified: 'distributor.error.verified'
         }
    },

    {

        name: 'password',
        messages: {
            required: 'distributor.error.password',
            verified: 'distributor.error.verified',
            minlength: 'distributor.error.minPassword'
        }
    },

    {

        name: 'confirmPassword',
        messages: {
            required: 'distributor.error.confirmPassword',
            verified: 'distributor.error.verified',
            match:    'distributor.error.matchConfirmPassword',
            minlength: 'distributor.error.minConfirmPassword'
        }
    },


    {
        name: 'invoiceId',
        messages: {
            required: 'distributor.error.invoiceId',
            verified: 'distributor.error.verified'
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

];

export const DISTRIBUTOR_SUBSCRIPTION_VALIDATOR = [
    {
          name: 'subscription',
          messages: {
            required: 'distributor.error.subscription',
            verified: 'distributor.error.verified'
          }
    },

    {
        name: 'startDate',
        messages: {
            required: 'distributor.error.startDate',
            verified: 'distributor.error.verified'
        }
    },

    {
        name: 'endDate',
        messages: {
            required: 'distributor.error.endDate',
            verified: 'distributor.error.verified'
        }
    },

    {
        name: 'active',
        messages: {
            required: 'distributor.error.active',
            verified: 'distributor.error.verified'
        }
    },


];
