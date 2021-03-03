export const VENDOR_VALIDATOR = [
    {
     name: 'name',
         messages: {
            required: 'vendor.error.name',
            minlength: 'vendor.error.minName',
            duplicate: 'vendor.error.duplicate',
            verified: 'vendor.error.verified',
            pattern: 'vendor.error.namePattern'
         }
    },

    {
    name: 'description',
        messages: {
            required: 'vendor.error.description',
            minlength: 'vendor.error.minDescription',
            duplicate: 'vendor.error.duplicate',
            verified: 'vendor.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },
    {
    name: 'zone',
        messages: {
            required: 'vendor.error.zone',
            duplicate: 'vendor.error.duplicate',
            verified: 'vendor.error.verified'
        }
    },

    {

        name: 'password',
        messages: {
            required: 'vendor.error.password',
            verified: 'vendor.error.verified',
            minlength: 'vendor.error.minPassword'
        }
    },

    {

        name: 'confirmPassword',
        messages: {
            required: 'vendor.error.confirmPassword',
            verified: 'vendor.error.verified',
            match:    'vendor.error.matchConfirmPassword',
            minlength: 'vendor.error.minConfirmPassword'
        }
    },

    {

        name: 'company',
        messages: {
            required: 'vendor.error.company',
            verified: 'vendor.error.verified'
        }
    },

    {

        name: 'distributor',
        messages: {
            required: 'vendor.error.distributor',
            verified: 'vendor.error.verified'
        }
    },

    {
        name: 'dispatchedDate',
        messages: {
            required: 'vendor.error.dispatchedDate',
            verified: 'vendor.error.verified'
        }
    },

    {
        name: 'zoneId',
        messages: {
            required: 'company.error.zoneId',
            verified: 'company.error.verified'
        }
    },

    {
        name: 'invoiceId',
        messages: {
            required: 'company.error.invoiceId',
            verified: 'company.error.verified'
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
        name: 'price',
        messages: {
            required: 'subscription.error.price',
            verified: 'subscription.error.verified',
            pattern: 'subscription.error.pricePattern'
        }
    },




];

export const VENDOR_SUBSCRIPTION_VALIDATOR = [
    {
          name: 'subscription',
          messages: {
            required: 'vendor.error.subscription',
            verified: 'vendor.error.verified'
          }
    },

    {
        name: 'startDate',
        messages: {
            required: 'vendor.error.startDate',
            verified: 'vendor.error.verified'
        }
    },

    {
        name: 'endDate',
        messages: {
            required: 'vendor.error.endDate',
            verified: 'vendor.error.verified'
        }
    },

    {
        name: 'active',
        messages: {
            required: 'vendor.error.active',
            verified: 'vendor.error.verified'
        }
    },


];