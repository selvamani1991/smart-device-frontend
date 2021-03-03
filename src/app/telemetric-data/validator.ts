export const TELEMETRIC_DATA_VALIDATOR = [
    {
          name: 'name',
          messages: {
            required: 'telemetricData.error.name',
            minlength: 'telemetricData.error.minName',
            duplicate: 'telemetricData.error.duplicate',
            verified: 'telemetricData.error.verified',
            pattern: 'telemetricData.error.namePattern'
          }
    },

    {
        name: 'description',
        messages: {
            required: 'telemetricData.error.description',
            minlength: 'telemetricData.error.minDescription',
            verified: 'telemetricData.error.verified'
        }
    },


];
