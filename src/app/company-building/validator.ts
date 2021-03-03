export const COMPANY_BUILDING_VALIDATOR = [
    {
        name: 'name',
        messages: {
            required: 'companyBuilding.error.name',
            minlength: 'companyBuilding.error.minName',
            duplicate: 'companyBuilding.error.duplicate',
            verified: 'companyBuilding.error.verified',
            pattern: 'companyBuilding.error.namePattern'
        }
    },

    {
    name: 'description',
        messages: {
            required: 'companyBuilding.error.description',
            minlength: 'companyBuilding.error.minDescription',
            duplicate: 'companyBuilding.error.duplicate',
            verified: 'companyBuilding.error.verified',
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

    name: 'password',
        messages: {
            required: 'companyBuilding.error.password',
            verified: 'companyBuilding.error.verified',
            minlength: 'companyBuilding.error.minPassword'
        }
    },

    {

        name: 'confirmPassword',
        messages: {
            required: 'companyBuilding.error.confirmPassword',
            verified: 'companyBuilding.error.verified',
            match:    'company.error.matchConfirmPassword',
            minlength: 'company.error.minConfirmPassword'
        }
    }

];
