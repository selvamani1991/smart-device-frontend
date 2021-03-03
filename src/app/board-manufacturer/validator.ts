export const BOARD_MANUFACTURER_VALIDATOR = [
    {
        name: 'name',
        messages: {
            required: 'boardManufacturer.error.name',
            minlength: 'boardManufacturer.error.minName',
            duplicate: 'boardManufacturer.error.duplicate',
            verified: 'boardManufacturer.error.verified',
            pattern: 'boardManufacturer.error.namePattern'
        }
    },

    {
        name: 'description',
        messages: {
            required: 'boardManufacturer.error.description',
            minlength: 'boardManufacturer.error.minDescription',
            verified: 'boardManufacturer.error.verified',
            pattern: 'zone.error.descPattern'
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
    }
];
