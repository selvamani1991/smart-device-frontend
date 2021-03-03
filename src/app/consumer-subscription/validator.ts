export const CONSUMER_SUBSCRIPTION_VALIDATOR = [
    {
         name: 'name',
         messages: {
            required: 'consumerSubscription.error.name',
            minlength: 'consumerSubscription.error.minName',
            duplicate: 'consumerSubscription.error.duplicate',
            verified: 'consumerSubscription.error.verified',
            pattern: 'consumerSubscription.error.namePattern'
         }
    },

    {
        name: 'description',
        messages: {
            required: 'consumerSubscription.error.description',
            minlength: 'consumerSubscription.error.minDescription',
            verified: 'consumerSubscription.error.verified',
            pattern: 'zone.error.descPattern'
        }
    },

    {
        name: 'price',
        messages: {
            required: 'consumerSubscription.error.price',
            minlength: 'consumerSubscription.error.minPrice',
            verified: 'consumerSubscription.error.verified',
            pattern: 'subscription.error.pricePattern'
        }
    },

    {
        name: 'duration',
        messages: {
            required: 'consumerSubscription.error.duration',
            verified: 'consumerSubscription.error.verified'
        }
    },

    {
        name: 'subscriberCount',
        messages: {
            required: 'consumerSubscription.error.subscriberCount',
            minlength: 'consumerSubscription.error.minSubscriberCount',
            verified: 'consumerSubscription.error.verified'
        }
    },

    {
        name: 'deviceCount',
        messages: {
            required: 'consumerSubscription.error.deviceCount',
            minlength: 'consumerSubscription.error.minDeviceCount',
            verified: 'consumerSubscription.error.verified',
            pattern: 'subscription.error.pricePattern'
        }
    },

    {
         name: 'sharedUserCount',
         messages: {
             required: 'consumerSubscription.error.sharedUserCount',
             minlength: 'consumerSubscription.error.minSharedCount',
             verified: 'consumerSubscription.error.verified'
         }
    },


];
