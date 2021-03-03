export const COMPANY_ADMIN_MENU_CONSTANTS = {
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
                             name: 'Building Management',
                             description: 'Building Management',
                             baseIcon: 'room.svg',
                             iconType: '',
                             core: false,
                             state: '/company-building',
                             parentUrl: ['company-building'],
                             translation: 'sidebar.nav.building.main',
                             features: [
                                        {      id: 1,
                                               baseIcon: 'room.svg',
                                               crud: true,
                                               description: 'Building ',
                                               name: 'Building Management',
                                               state: '/company-building/list',
                                               translation: 'sidebar.nav.building.list'
                                        },
                             ]
                       },


                       {
                            id: 2,
                            name: 'Product Management',
                            description: 'Product Management',
                            baseIcon: 'product.svg',
                            iconType: '',
                            core: false,
                            state: '/product',
                            parentUrl: ['company-product','assigned-company-building-product','new-company-product','all-company-product'],
                            translation: 'sidebar.nav.product.main',
                            features: [

                                       {      id: 1,
                                              baseIcon: 'product.svg',
                                              crud: true,
                                              description: 'companyProductList',
                                              name: 'Product Management',
                                              state: '/company/company-product',
                                              translation: 'Unassigned Product'
                                       },
                                       {      id: 2,
                                              baseIcon: 'product.svg',
                                              crud: true,
                                              description: 'assignedBuildingProduct',
                                              name: 'assignedBuildingProduct',
                                              state: '/company/assigned-company-building-product',
                                              translation: 'Assigned Building Product'
                                       },
                                       {
                                              id: 3,
                                              baseIcon: 'product.svg',
                                              crud: true,
                                              description: 'newCompanyProduct',
                                              name: 'newCompanyProduct',
                                              state: '/company/new-company-product',
                                              translation: 'New Company Product'
                                       },
                                       {
                                                 id: 4,
                                                 baseIcon: 'product.svg',
                                                 crud: true,
                                                 description: 'allCompanyProduct',
                                                 name: 'allCompanyProduct',
                                                 state: '/company/all-company-product',
                                                 translation: 'sidebar.nav.company.allCompanyProduct'
                                       },

                            ]

                      },

                      {
                           id: 3,
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
                                               state: '/report/company',
                                               translation: 'sidebar.nav.report.companyReport'
                                        },
                                 ]
                      },
            ]
    },

    'features': [
                          {
                                id: 1,
                                baseIcon: 'fa fa-user',
                                crud: true,
                                description: 'Building ',
                                name: 'Building Management',
                                state: '/companyBuilding/list',
                                translation: 'sidebar.nav.building.list'
                          },

                       {
                                 id: 2,
                                 baseIcon: 'fa fa-user',
                                 crud: true,
                                 description: 'companyProductList',
                                 name: 'companyProductList',
                                 state: '/company/company-product',
                                 translation: 'sidebar.nav.company.unassignedProductList'
                       },

                       {
                                 id: 3,
                                 baseIcon: 'fa fa-user',
                                 crud: true,
                                 description: 'assignedBuildingProduct',
                                 name: 'assignedBuildingProduct',
                                 state: '/company/assigned-company-building-product',
                                 translation: 'sidebar.nav.company.assignedBuildingProduct'
                       },
                       {
                                id: 4,
                                baseIcon: 'fa fa-user',
                                crud: true,
                                description: 'newCompanyProduct',
                                name: 'newCompanyProduct',
                                state: '/company/new-company-product',
                                translation: 'sidebar.nav.company.newCompanyProduct'
                      },
                      {
                              id: 5,
                              baseIcon: 'fa fa-user',
                              crud: true,
                              description: 'allCompanyProduct',
                              name: 'allCompanyProduct',
                              state: '/company/all-company-product',
                              translation: 'sidebar.nav.company.all-company-product'
                     },
                     {
                           id: 6,
                           baseIcon: 'fa fa-calendar',
                           crud: true,
                           description: 'Subscription Management',
                           name: 'Subscription Management',
                           state: '/subscription/list',
                           translation: 'sidebar.nav.subscription.list'
                     },

    ]
};
