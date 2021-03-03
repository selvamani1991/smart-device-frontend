export const MANUFACTURER_ADMIN_MENU_CONSTANTS = {
    'featureCategories':
    {
            others: [
                       {
                            id: 1,
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
                              id: 3,
                              name: 'Machine',
                              description: 'Machine',
                              baseIcon: 'machinemanufact.svg',
                              iconType: '',
                              core: false,
                              state: '/machine',
                              parentUrl: ['machine'],
                              translation: 'sidebar.nav.machine.main',
                              features: [

                                        {      id: 2,
                                               baseIcon: 'machinemanufact.svg',
                                               crud: true,
                                               description: 'Machine productType',
                                               name: 'machine productType',
                                               state: '/client/machine-productType',
                                               translation: 'sidebar.nav.machineProductType.main'
                                        },
                              ]
                       },
                       {
                          id: 2,
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
            ]

    },

    'features': [

                {       id: 1,
                        baseIcon: 'fa fa-wrench',
                        crud: true,
                        description: 'Machine',
                        name: 'machine Management',
                        state: '/machine/list',
                        translation: 'sidebar.nav.machine.list'
                },
                {       id: 2,
                        baseIcon: 'fa fa-wrench',
                        crud: true,
                        description: 'Machine productType',
                        name: 'machine productType',
                        state: '/client/machine-productType',
                        translation: 'sidebar.nav.machineProductType.main'
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
