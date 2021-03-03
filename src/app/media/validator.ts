export const MEDIA_VALIDATOR = [
    {
         name: 'name',
         messages: {
            required: 'media.error.name',
            minlength: 'media.error.minName',
            duplicate: 'media.error.duplicate',
            verified: 'media.error.verified',
            pattern: 'media.error.namePattern'
         }
    },

    {
        name: 'description',
        messages: {
            required: 'media.error.description',
            minlength: 'media.error.minDescription',
            verified: 'media.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },

    {
        name: 'mediaType',
        messages: {
            required: 'media.error.mediaType',
            verified: 'media.error.verified'
        }
    },

    {
        name: 'file',
        messages: {
            required: 'media.error.file',
            verified: 'media.error.verified'
        }
    },

];


export const FIRMWARE_VALIDATOR = [
    {
         name: 'name',
         messages: {
            required: 'media.error.name',
            minlength: 'media.error.minName',
            duplicate: 'media.error.duplicate',
            verified: 'media.error.verified',
            pattern: 'media.error.namePattern'
         }
    },

    {
        name: 'description',
        messages: {
            required: 'media.error.description',
            minlength: 'media.error.minDescription',
            verified: 'media.error.verified'
        }
    },

    {
        name: 'file',
        messages: {
            required: 'media.error.file',
            verified: 'media.error.verified'
        }
    },

];
