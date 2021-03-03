export const CLIENT_VALIDATOR = [
    {
          name: 'name',
          messages: {
            required: 'client.error.name',
            minlength: 'client.error.minName',
            duplicate: 'client.error.duplicate',
            verified: 'client.error.verified',
            pattern: 'client.error.namePattern'
          }
    },

    {
        name: 'description',
        messages: {
            required: 'client.error.description',
            minlength: 'client.error.minDescription',
            verified: 'client.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },

    {
        name: 'subscription',
        messages: {
            required: 'client.error.subscription',
            verified: 'client.error.verified'
        }
    },

    {

        name: 'boardManufacturer',
        messages: {
                required: 'client.error.boardManufacturer',
                verified: 'client.error.verified'
        }
    },

    {

        name: 'manufacturer',
        messages: {
            required: 'client.error.manufacturer',
            verified: 'client.error.verified'
        }
    },

    {

        name: 'vendor',
        messages: {
            required: 'client.error.vendor',
            verified: 'client.error.verified'
        }
    },


    {

        name: 'assignedDate',
        messages: {
            required: 'client.error.assignedDate',
            verified: 'client.error.verified'
        }
    },

    {

        name: 'company',
        messages: {
            required: 'client.error.company',
            verified: 'client.error.verified'
        }
    },
    {

        name: 'price',
        messages: {
            required: 'client.error.price',
            verified: 'client.error.verified',
            pattern: 'subscription.error.pricePattern'
        }
    },

    {

        name: 'productCount',
        messages: {
            required: 'client.error.productCount',
            verified: 'client.error.verified',
            pattern: 'client.error.productCountPattern'
        }
    },

    {

        name: 'dispatchedDate',
        messages: {
            required: 'client.error.dispatchedDate',
            verified: 'client.error.verified'
        }
    },

    {

        name: 'password',
        messages: {
            required: 'client.error.password',
            verified: 'client.error.verified',
            minlength: 'client.error.minPassword'
        }
    },

    {

        name: 'confirmPassword',
        messages: {
            required: 'client.error.confirmPassword',
            verified: 'client.error.verified',
            match:    'client.error.matchConfirmPassword',
            minlength: 'client.error.minConfirmPassword'
        }
    },

    {
        name: 'file',
        messages: {
            required: 'client.error.file',
            verified: 'client.error.verified',
            pattern: 'client.error.invalidPattern'
        }
    },

    {
        name: 'productNickName',
        messages: {
            required: 'client.error.productNickName',
            minlength: 'client.error.minProductNickName',
            duplicate: 'client.error.duplicateProductNickName',
            verified: 'client.error.verified'
        }
    },

    {
        name: 'productTypeNickName',
        messages: {
            required: 'client.error.productTypeNickName',
            minlength: 'client.error.minProductTypeNickName',
            duplicate: 'client.error.duplicateProductTypeNickName',
            verified: 'client.error.verified'
        }
    },

    {
        name: 'vendorNickName',
        messages: {
            required: 'client.error.vendorNickName',
            minlength: 'client.error.minVendorNickName',
            duplicate: 'client.error.duplicateVendorNickName',
            verified: 'client.error.verified'
        }
    },

    {
        name: 'distributorNickName',
        messages: {
            required: 'client.error.distributorNickName',
            minlength: 'client.error.minDistributorNickName',
            duplicate: 'client.error.duplicateDistributorNickName',
            verified: 'client.error.verified'
        }
    },

    {
        name: 'companyNickName',
        messages: {
            required: 'client.error.companyNickName',
            minlength: 'client.error.minCompanyNickName',
            duplicate: 'client.error.duplicateCompanyNickName',
            verified: 'client.error.verified'
        }
    },

    {
        name: 'companyBuildingNickName',
        messages: {
            required: 'client.error.companyBuildingNickName',
            minlength: 'client.error.minCompanyBuildingNickName',
            duplicate: 'client.error.duplicateCompanyBuildingNickName',
            verified: 'client.error.verified'
        }
    },

    {
        name: 'invoiceId',
        messages: {
            required: 'client.error.invoiceId',
            verified: 'client.error.verified'
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
        name: 'productCategory',
        messages: {
            required: 'client.error.productCategory',
            verified: 'client.error.verified'
        }
    },
    {
        name: 'paymentGatewayAPIKey',
        messages: {
            required: 'client.error.paymentGatewayAPIKey',
            verified: 'client.error.verified'
        }
    },
    {
        name: 'paymentSecretKey',
        messages: {
            required: 'client.error.paymentSecretKey',
            verified: 'client.error.verified'
        }
    },

    {
        name: 'appUrl',
        messages: {
            required: 'client.error.appUrl',
            verified: 'client.error.verified',
            pattern: 'client.error.appUrlPattern'
        }
    },
];


export const CLIENT_SUBSCRIPTION_VALIDATOR = [
    {
         name: 'subscription',
         messages: {
            required: 'client.error.subscription',
            verified: 'client.error.verified'
         }
    },

    {
        name: 'startDate',
        messages: {
            required: 'client.error.startDate',
            verified: 'client.error.verified'
        }
    },

    {
        name: 'endDate',
        messages: {
            required: 'client.error.endDate',
            verified: 'client.error.verified'
        }
    },

    {
        name: 'active',
        messages: {
            required: 'client.error.active',
            verified: 'client.error.verified'
        }
    },

];
