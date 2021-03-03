export const BOARD_VALIDATOR = [
    {
          name: 'name',
          messages: {
            required: 'board.error.name',
            minlength: 'board.error.minName',
            duplicate: 'board.error.duplicate',
            verified: 'board.error.verified',
            pattern: 'board.error.namePattern'
          }
    },

    {
        name: 'description',
        messages: {
            required: 'board.error.description',
            minlength: 'board.error.minDescription',
            verified: 'board.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },

    {
        name: 'boardId',
        messages: {
            required: 'board.error.boardId',
            minlength: 'board.error.minBoardId',
            duplicate: 'board.error.boardIdDuplicate',
            verified: 'board.error.verified',
            pattern: 'board.error.deviceIdPattern'
        }
    },

    {
        name: 'imieId',
        messages: {
            required: 'board.error.imieId',
            minlength: 'board.error.minImieId',
            duplicate: 'board.error.imieIdDuplicate',
            verified: 'board.error.verified',
            pattern: 'board.error.imieIdPattern'
        }
    },

    {
        name: 'deviceId',
        messages: {
            required: 'board.error.deviceId',
            minlength: 'board.error.minDeviceId',
            duplicate: 'board.error.deviceIdDuplicate',
            verified: 'board.error.verified',
            pattern: 'board.error.deviceIdPattern'
        }
    },
    {
        name: 'manufacturerDate',
        messages: {
            required: 'board.error.manufacturerDate',
            minlength: 'board.error.minDescription',
            verified: 'board.error.verified'
        }
    },


];
