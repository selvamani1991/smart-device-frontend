export const COMPANY_VALIDATOR = [
    {
         name: 'name',
         messages: {
             required: 'company.error.name',
             minlength: 'company.error.minName',
             duplicate: 'company.error.duplicate',
             verified: 'company.error.verified',
             pattern: 'company.error.namePattern'
         }
    },

    {
        name: 'description',
        messages: {
            required: 'company.error.description',
            minlength: 'company.error.minDescription',
            duplicate: 'company.error.duplicate',
            verified: 'company.error.verified',
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

        name: 'companyBuilding',
        messages: {
            required: 'company.error.companyBuilding',
            verified: 'company.error.verified'

        }
    },

    {
        name: 'dispatchedDate',
        messages: {
            required: 'company.error.dispatchedDate',
            verified: 'company.error.verified'
        }
    },
    {
        name: 'password',
        messages: {
            required: 'company.error.password',
            verified: 'company.error.verified',
            minlength: 'client.error.minPassword'
        }
    },

    {
        name: 'confirmPassword',
        messages: {
            required: 'company.error.confirmPassword',
            verified: 'company.error.verified',
            match:    'client.error.matchConfirmPassword',
            minlength: 'client.error.minConfirmPassword'
        }
    },

    {
        name: 'section',
        messages: {
            required: 'company.error.section',
            verified: 'company.error.verified',
            pattern: 'user.error.sectionPattern',
        }
    },

    {
        name: 'floor',
        messages: {
            required: 'company.error.floor',
            verified: 'company.error.verified',
            pattern: 'user.error.floorPattern',
        }
    },

    {
        name: 'zoneId',
        messages: {
            required: 'company.error.zoneId',
            verified: 'company.error.verified'
        }
    },


];
export const COMPANY_SUBSCRIPTION_VALIDATOR = [
    {
        name: 'subscription',
        messages: {
            required: 'company.error.subscription',
            verified: 'company.error.verified'
        }
    },

    {
        name: 'startDate',
        messages: {
            required: 'company.error.startDate',
            verified: 'company.error.verified'
        }
    },

    {
        name: 'endDate',
        messages: {
            required: 'company.error.endDate',
            verified: 'company.error.verified'
        }
    },

    {
        name: 'active',
        messages: {
            required: 'company.error.active',
            verified: 'company.error.verified'
        }
    },


];
