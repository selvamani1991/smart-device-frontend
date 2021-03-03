export const DISTRIBUTOR_ADMIN_MENU_CONSTANTS = {
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
                              name: 'Products Management',
                              description: 'Products Management',
                              baseIcon: 'product.svg',
                              iconType: '',
                              core: false,
                              state: '/product',
                              parentUrl: ['distributor-product','assigned-company-product','new-distributor-product','all-distributor-product'],
                              translation: 'sidebar.nav.product.main',
                              features: [
                                         {     id: 1,
                                                   active: true,
                                                   baseIcon: 'product.svg',
                                                   crud: true,
                                                   description: 'Distributor Management',
                                                   locked: false,
                                                   name: 'Distributor',
                                                   sequence: 0,
                                                   state: '/distributor/distributor-product',
                                                   translation: 'sidebar.nav.distributor.UnassignedDistributorProduct'

                                         },
                                         {     id: 1,
                                               active: true,
                                               baseIcon: 'product.svg',
                                               rud: true,
                                               description: 'Distributor Management',
                                               locked: false,
                                               name: 'Vendor',
                                               sequence: 0,
                                               state: '/distributor/assigned-company-product',
                                               translation: 'sidebar.nav.distributor.assignedDistributorProduct'

                                         },
                                         {
                                               id: 2,
                                               active: true,
                                               baseIcon: 'product.svg',
                                               crud: true,
                                               description: 'Product Management',
                                               locked: false,
                                               name: 'New  distributor Product',
                                               sequence: 0,
                                               state: '/distributor/new-distributor-product',
                                               translation: 'sidebar.nav.distributor.newDistributorProduct'
                                         },
                                          {
                                              id: 4,
                                              baseIcon: 'product.svg',
                                              crud: true,
                                              description: 'allDistributorProduct',
                                              name: 'allDistributorProduct',
                                              state: '/vendor/all-distributor-product',
                                              translation: 'sidebar.nav.distributor.allDistributorProduct'
                                          },

                              ]
                     },

                      {
                              id: 2,
                              name: 'Company Management',
                              description: 'Company ',
                              baseIcon: 'consumer2.svg',
                              iconType: '',
                              core: false,
                              state: '/company',
                              parentUrl: ['company'],
                              translation: 'sidebar.nav.company.main',
                              features: [
                                         {      id: 1,
                                                baseIcon: 'consumerlist.svg',
                                                crud: true,
                                                description: 'Company ',
                                                name: 'Company ',
                                                state: '/company/list',
                                                translation: 'sidebar.nav.company.list'
                                         },
                              ]
                      },
                      {
                           id: 2,
                           name: 'Subscription Management',
                           description: 'Subscription Management',
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
                                       name: 'Subscription Management',
                                       state: '/subscription/list',
                                       translation: 'sidebar.nav.subscription.list'
                                  },

                           ]
                      },
                      {
                           id: 7,
                           name: 'User  Management',
                           description: 'User  Management',
                           baseIcon: 'user.svg',
                           iconType: '',
                           core: false,
                           state: '/user',
                           parentUrl: ['user'],
                           translation: 'sidebar.nav.user.main',
                           features: [
                                      {      id: 1,
                                             baseIcon: 'userlist.svg',
                                             crud: true,
                                             description: 'User Management',
                                             name: 'User  Management',
                                             state: '/user/list',
                                             translation: 'sidebar.nav.user.list'
                                      },
                           ]
                      },

                      {
                           id: 3,
                           name: 'Report Management',
                           description: 'Report Management',
                           baseIcon: 'report.svg',
                           iconType: '',
                           core: false,
                           state: '/report',
                           parentUrl: ['report'],
                           translation: 'sidebar.nav.report.main',
                           features: [
                                  {      id: 1,
                                         baseIcon: 'report.svg',
                                         crud: true,
                                         description: 'Report Management',
                                         name: 'Report  Management',
                                         state: '/report/distributor',
                                         translation: 'sidebar.nav.report.vendorDReport'
                                  },
                           ]
                      },
            ]

    },

    'features': [
                    {
                        id: 1,
                        baseIcon: 'fa fa-building',
                        crud: true,
                        description: 'Company ',
                        name: 'Company ',
                        state: '/company/list',
                        translation: 'sidebar.nav.company.list'
                    },
                   {
                        id: 1,
                        active: true,
                        baseIcon: 'fa fa-user',
                        crud: true,
                        description: 'Distributor Management',
                        locked: false,
                        name: 'Distributor',
                        sequence: 0,
                        state: '/distributor/distributor-product',
                        translation: 'sidebar.nav.distributor.UnassignedDistributorProduct'

                   },

                   {
                         id: 1,
                         active: true,
                         baseIcon: 'fa fa-user',
                         rud: true,
                         description: 'Distributor Management',
                         locked: false,
                         name: 'Vendor',
                         sequence: 0,
                         state: '/distributor/assigned-company-product',
                         translation: 'sidebar.nav.distributor.assignedDistributorProduct'

                   },

                   {
                         id: 2,
                         active: true,
                         baseIcon: 'fa fa-cube',
                         crud: true,
                         description: 'Product Management',
                         locked: false,
                         name: 'New  distributor Product',
                         sequence: 0,
                         state: '/distributor/new-distributor-product',
                         translation: 'sidebar.nav.distributor.newDistributorProduct'
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
