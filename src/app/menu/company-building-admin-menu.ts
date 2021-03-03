export const COMPANY_BUILDING_ADMIN_MENU_CONSTANTS = {
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
                             name: 'Product Management',
                             description: 'Product Management',
                             baseIcon: 'product.svg',
                             iconType: '',
                             core: false,
                             state: '/user',
                             parentUrl: ['company-building-product','new-company-building-product','all-company-building-product'],
                             translation: 'sidebar.nav.product.main',
                             features: [
                                        {
                                         id: 1,
                                               active: true,
                                               baseIcon: 'product.svg',
                                               crud: true,
                                               description: 'Product Management',
                                               name: 'Product Management',
                                               state: '/company-building/company-building-product',
                                               translation: 'sidebar.nav.building.unassignedProductList'
                                        },

                                       {
                                        id: 2,
                                              baseIcon: 'product.svg',
                                              crud: true,
                                              description: 'companyBuildingProductList',
                                              name: 'companyBuildingProductList',
                                              state: '/company-building/new-company-building-product',
                                              translation: 'sidebar.nav.building.NewCompanyBuildingProduct'
                                       },
                                        {
                                             id: 4,
                                             baseIcon: 'product.svg',
                                             crud: true,
                                             description: 'AllCompanyBuildingProduct',
                                             name: 'AllCompanyBuildingProduct',
                                             state: '/company-building/all-company-building-product',
                                             translation: 'sidebar.nav.building.allCompanyBuildingProduct'
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
                                         state: '/report/company-building',
                                         translation: 'sidebar.nav.report.buildingReport'
                                  },
                           ]
                       },

            ]

    },

    'features': [
                    {
                        id: 1,
                        active: true,
                        baseIcon: 'fa fa-cube',
                        crud: true,
                        description: 'Product Management',
                        locked: false,
                        name: 'Product',
                        sequence: 0,
                        state: '/product/list',
                        translation: 'sidebar.nav.product.main'
                    },
                    {
                           id: 2,
                           active: true,
                           baseIcon: 'fa fa-user',
                           crud: true,
                           description: 'CompanyBuilding Management',
                           name: 'CompanyBuilding Management',
                           state: '/company-building/new-company-building-product',
                           translation: 'sidebar.nav.CompanyBuilding.CompanyBuildingProduct'
                    },
                    {
                           id: 2,
                           active: true,
                           baseIcon: 'fa fa-user',
                           crud: true,
                           description: 'CompanyBuilding Management',
                           name: 'CompanyBuilding Management',
                            state: '/company-building/new-company-building-product',
                           translation: 'sidebar.nav.CompanyBuilding.NewCompanyBuildingProduct'
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
