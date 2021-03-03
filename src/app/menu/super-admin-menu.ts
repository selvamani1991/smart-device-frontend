export const SUPER_ADMIN_MENU_CONSTANTS = {
    'featureCategories':
    {
            others: [
                       {
                            id: 100,
                            name: 'Dashboard',
                            description: 'Dashboard',
                            baseIcon: 'dashboard.svg',
                            iconType: '',
                            core: false,
                            state: '/dashboard',
                            translation: 'sidebar.nav.dashboard.main',
                            features: []
                       },



                       {
                            id: 1,
                            name: 'Client Management',
                            description: 'Client Management',
                            baseIcon: 'customer.svg',
                            iconType: '',
                            core: false,
                            state: '/client',
                            translation: 'sidebar.nav.client.main',
                            features: [

                                       {
                                            id: 1,
                                            baseIcon: 'userlist.svg',
                                            crud: true,
                                            description: 'Client Management',
                                            name: 'Client Management',
                                            state: '/client/list',
                                            translation: 'sidebar.nav.client.list'
                                       },

                            ]
                       },

                       {
                               id: 2,
                               name: 'User Management',
                               description: 'User Management',
                               baseIcon: 'user.svg',
                               iconType: '',
                               core: false,
                               state: '/user',
                               translation: 'sidebar.nav.user.main',
                               features: [
                                    {
                                        id: 1,
                                        baseIcon: 'userlist.svg',
                                        crud: true,
                                        description: 'User Management',
                                        name: 'User Management',
                                        state: '/user/list',
                                        translation: 'sidebar.nav.user.list'
                                    },
                               ]
                       },

                       {
                              id: 2,
                              name: 'Subscription Management',
                              description: 'Subscription  Management',
                              baseIcon: 'subscription.svg',
                              iconType: '',
                              core: false,
                              state: '/subscription',
                              parentUrl: ['subscription'],
                              translation: 'sidebar.nav.subscription.main',
                              features: [
                                     {
                                         id: 1,
                                         baseIcon: 'subscriptionlist.svg',
                                         crud: true,
                                         description: 'Subscription Management',
                                         name: 'Subscription  Management',
                                         state: '/subscription/list',
                                         translation: 'sidebar.nav.subscription.list'
                                     },
                              ]
                         },


                       {
                                id: 2,
                                name: 'Consumer Management',
                                description: 'Consumer Subscription',
                                baseIcon: 'consumer.svg',
                                iconType: '',
                                core: false,
                                state: '/consumer',
                                translation: 'sidebar.nav.subscription.consumerSubscription',
                                features: [
                                      {
                                          id: 1,
                                          baseIcon: 'subscriptionlist.svg',
                                          crud: true,
                                          description: 'Subscription Management',
                                          name: 'Consumer Subscription',
                                          state: '/consumer-subscription/list',
                                          translation: 'sidebar.nav.subscription.ConsumerSubscription'
                                      },

                                       {
                                            id: 1,
                                            baseIcon: 'consumerlist.svg',
                                            crud: true,
                                            description: 'Consumer Management',
                                            name: 'Consumer List',
                                            state: '/consumer/consumer-list',
                                            translation: 'sidebar.nav.consumer.consumerList'
                                       },


                                ]
                          },
                       {
                            id: 4,
                            name: 'Product Category  Management',
                            description: 'Product Category  Management',
                            baseIcon: 'product.svg',
                            iconType: '',
                            core: false,
                            state: '/product-category',
                            translation: 'sidebar.nav.productCategory.main',
                            features: [
                                       {      id: 1,
                                              baseIcon: 'product.svg',
                                              crud: true,
                                              description: 'Product Category  Management',
                                              name: 'Product Category  Management',
                                              state: '/product-category/list',
                                              translation: 'sidebar.nav.productCategory.list'
                                       },
                            ]
                       },
                       {
                           id: 5,
                           name: 'Room Type Management',
                           description: 'Room Type Management',
                           baseIcon: 'room.svg',
                           iconType: '',
                           core: false,
                           state: '/room-type',
                           translation: 'sidebar.nav.roomType.main',
                           features: [
                                      {      id: 1,
                                             baseIcon: 'room.svg',
                                             crud: true,
                                             description: 'Room Type Management',
                                             name: ' Room Type Management',
                                             state: '/room-type/list',
                                             translation: 'sidebar.nav.roomType.list'
                                      },
                           ]
                      },
            ]

    },

    'features': [

                   {      id: 1,
                          baseIcon: 'fa fa-user',
                          crud: true,
                          description: 'Client Management',
                          name: 'Client Management',
                          state: '/client/list',
                          translation: 'sidebar.nav.client.list'
                   },

                  {
                         id: 3,
                         baseIcon: 'fa fa-globe',
                         crud: true,
                         description: 'User Management',
                         name: 'User Management',
                         state: '/user/list',
                         translation: 'sidebar.nav.user.list'
                  },


                  {
                        id: 1,
                        baseIcon: 'fa fa-user-circle',
                        crud: true,
                        description: 'Consumer Management',
                        name: 'Consumer Product Type',
                        state: '/consumer/consumer-product-type/list',
                        translation: 'sidebar.nav.consumerProductType.list'
                  },

                  {
                        id: 1,
                        baseIcon: 'fa fa-calendar',
                        crud: true,
                        description: 'Subscription Management',
                        name: 'Subscription Management',
                        state: '/subscription/list',
                        translation: 'sidebar.nav.subscription.list'
                  },

    ]
};
