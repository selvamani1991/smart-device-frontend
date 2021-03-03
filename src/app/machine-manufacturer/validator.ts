export const MACHINE_MANUFACTURER_VALIDATOR = [
    {
         name: 'name',
         messages: {
            required: 'manufacturer.error.name',
            minlength: 'manufacturer.error.minName',
            duplicate: 'manufacturer.error.duplicate',
            verified: 'manufacturer.error.verified',
            pattern: 'manufacturer.error.namePattern'
         }
    },

    {
        name: 'description',
        messages: {
            required: 'manufacturer.error.description',
            minlength: 'manufacturer.error.minDescription',
            verified: 'manufacturer.error.verified',
            pattern: 'zone.error.descPattern'
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
        name: 'manufacturerDate',
        messages: {
            required: 'boardManufacturer.error.manufacturerDate',
            minlength: 'boardManufacturer.error.minDescription',
            verified: 'boardManufacturer.error.verified'
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
    }

];
