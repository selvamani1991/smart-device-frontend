export const CONSUMER_TICKET_VALIDATOR = [
    {
        name: 'subject',
        messages: {
            required: 'consumerTicket.error.subject',
            duplicate: 'consumerTicket.error.duplicate',
            verified: 'consumerTicket.error.verified',
        }
    },

    {
        name: 'description',
        messages: {
            required: 'consumerTicket.error.description',
            minlength: 'consumerTicket.error.minDescription',
            duplicate: 'consumerTicket.error.duplicate',
            verified: 'consumerTicket.error.verified'
        }
    },


    {
        name: 'issueType',
        messages: {
            required: 'consumerTicket.error.issueType',
            verified: 'consumerTicket.error.verified'
        }
    },
    {
         name: 'ticketId',
         messages: {
            required: 'consumerTicket.error.ticketId',
            duplicate: 'consumerTicket.error.duplicate',
            verified: 'consumerTicket.error.verified',
         }
    },
    {
         name: 'product',
         messages: {
            required: 'consumerTicket.error.product',
            duplicate: 'consumerTicket.error.duplicate',
            verified: 'consumerTicket.error.verified',
         }
    },
    {
         name: 'solution',
         messages: {
            required: 'consumerTicket.error.solution',
            minlength: 'consumerTicket.error.minSolution',
            verified: 'consumerTicket.error.verified'
         }
    },
    {
         name: 'status',
         messages: {
            required: 'consumerTicket.error.status',
            duplicate: 'consumerTicket.error.duplicate',
            verified: 'consumerTicket.error.verified',
         }
    },


];
