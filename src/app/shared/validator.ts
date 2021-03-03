export const ADDRESS_VALIDATOR = [
    {
        name: 'houseNumber',
        messages: {
            required: 'address.error.houseNumber',
            minlength: 'address.error.minStreet',
            verified: 'address.error.verified',
            pattern: 'address.error.buildingPattern'
        }
    },
    {
        name: 'street',
        messages: {
            required: 'address.error.street',
            minlength: 'address.error.minStreet',
            verified: 'address.error.verified',
            pattern: 'address.error.streetPattern'
        }
    },
    {
        name: 'landMark',
        messages: {
            required: 'address.error.landMark',
            minlength: 'address.error.minStreet',
            verified: 'address.error.verified',
            pattern: 'address.error.landMarkPattern'
        }
    },
    {
        name: 'city',
        messages: {
            required: 'address.error.city',
            verified: 'address.error.verified'
        }
    },
    {
        name: 'region',
        messages: {
            required: 'address.error.region',
            minlength: 'address.error.minState',
            verified: 'address.error.verified'
        }
    },
    {
        name: 'country',
        messages: {
            required: 'address.error.country',
            minlength: 'address.error.minCountry',
            verified: 'address.error.verified'
        }
    },
    {
        name: 'zipCode',
        messages: {
            required: 'address.error.zipCode',
            verified: 'address.error.verified',
            pattern: 'address.error.pattern'
        }
    }
];


export const ADMIN_VALIDATOR = [
    {
        name: 'firstName',
        messages: {
            required: 'admin.error.firstName',
            minlength: 'admin.error.minFirstName',
            verified: 'admin.error.verified',
            pattern: 'admin.error.firstNamePattern'
        }
    },
    {
        name: 'lastName',
        messages: {
            required: 'admin.error.lastName',
            minlength: 'admin.error.minLastName',
            verified: 'admin.error.verified',
            pattern: 'admin.error.lastNamePattern'
        }
    },
    {
        name: 'email',
        messages: {
            required: 'admin.error.emailRequired',
            minlength: 'admin.error.minEmail',
            email: 'admin.error.email',
            duplicate: 'admin.error.duplicateEmail',
            verified: 'admin.error.verified'
        }
    },
    {
        name: 'phoneNo',
        messages: {
            required: 'admin.error.phoneNo',
            minlength: 'admin.error.minPhoneNo',
            duplicate: 'admin.error.duplicatePhoneNo',
            verified: 'admin.error.verified',
            pattern: 'admin.error.phoneNumberPattern'
        }
    },
    {
        name: 'password',
        messages: {
            required: 'admin.error.password',
            minlength: 'admin.error.minPassword',
            verified: 'admin.error.verified'
        }
    },
    {
        name: 'designation',
        messages: {
            required: 'admin.error.designation',
            minlength: 'admin.error.minLastName',
            verified: 'admin.error.verified'
        }
    },
    {
        name: 'landLineNo',
        messages: {
            required: 'admin.error.landLineNo',
            minlength: 'admin.error.minPhoneNo',
            duplicate: 'admin.error.duplicatePhoneNo',
            verified: 'admin.error.verified',
            pattern: 'admin.error.landLineNumberPattern'
        }
    },
    {
        name: 'confirmPassword',
        messages: {
            required: 'admin.error.confirmPassword',
            minlength: 'admin.error.minConfirmPassword',
            match: 'admin.error.sameConfirmPassword',
            verified: 'admin.error.verified'
        }
    }
];