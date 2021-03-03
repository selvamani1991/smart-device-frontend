export const MACHINE_VALIDATOR = [
    {
        name: 'name',
        messages: {
            required: 'machine.error.name',
            minlength: 'machine.error.minName',
            verified: 'machine.error.verified',
            pattern: 'machine.error.namePattern'
        }
    },

    {
        name: 'description',
        messages: {
            required: 'machine.error.description',
            minlength: 'machine.error.minDescription',
            verified: 'machine.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },

    {
        name: 'machineId',
        messages: {
            required: 'machine.error.machineId',
            minlength: 'machine.error.minMachineId',
            duplicate: 'machine.error.machineIdDuplicate',
            verified: 'machine.error.verified',
            pattern: 'board.error.deviceIdPattern'

        }
    },
    {
        name: 'manufacturerDate',
        messages: {
            required: 'machine.error.manufacturerDate',
            verified: 'machine.error.verified'
        }
    },


];
