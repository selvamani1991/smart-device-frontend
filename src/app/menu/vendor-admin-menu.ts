export const VENDOR_ADMIN_MENU_CONSTANTS = {
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
                             parentUrl: ['vendor-product','assigned-distributor-product','assigned-company-product','new-vendor-product','all-vendor-product'],
                             translation: 'sidebar.nav.product.main',
                             features: [
                                        {     id: 1,
                                                  active: true,
                                                  baseIcon: 'product.svg',
                                                  crud: true,
                                                  description: 'Product Management',
                                                  locked: false,
                                                  name: 'Vendor',
                                                  sequence: 0,
                                                  state: '/vendor/vendor-product',
                                                  translation: 'sidebar.nav.vendor.unassignedProductList'

                                        },
                                        {     id: 2,
                                              active: true,
                                              baseIcon: 'product.svg',
                                              crud: true,
                                              description: 'Product Management',
                                              locked: false,
                                              name: 'Vendor',
                                              sequence: 0,
                                              state: '/vendor/assigned-distributor-product',
                                              translation: 'sidebar.nav.vendor.assignedDistributorProduct'

                                        },

                                        {     id: 2,
                                              active: true,
                                              baseIcon: 'product.svg',
                                              crud: true,
                                              description: 'Product Management',
                                              locked: false,
                                              name: 'Vendor',
                                              sequence: 0,
                                              state: '/vendor/assigned-company-product',
                                              translation: 'sidebar.nav.vendor.assignedCompanyProduct'
                                        },

                                        {
                                              id: 3,
                                              active: true,
                                              baseIcon: 'product.svg',
                                              crud: true,
                                              description: 'Product Management',
                                              locked: false,
                                              name: 'New  Vendor Product',
                                              sequence: 0,
                                              state: '/vendor/new-vendor-product',
                                              translation: 'sidebar.nav.vendor.newVendorProductList'
                                        },
                                        {
                                                 id: 4,
                                                 baseIcon: 'product.svg',
                                                 crud: true,
                                                 description: 'allVendorProduct',
                                                 name: 'allVendorProduct',
                                                 state: '/vendor/all-vendor-product',
                                                 translation: 'sidebar.nav.vendor.allVendorProduct'
                                       },

                             ]
                     },
                     {
                          id: 2,
                          name: 'Company Management',
                          description: 'Company Management',
                          baseIcon: 'customer.svg',
                          iconType: '',
                          core: false,
                          state: '/company',
                          parentUrl: ['company'],
                          translation: 'sidebar.nav.company.main',
                          features: [
                                     {      id: 1,
                                            baseIcon: 'customer.svg',
                                            crud: true,
                                            description: 'Company Management',
                                            name: 'Company Management',
                                            state: '/company/list',
                                            translation: 'sidebar.nav.company.list'
                                     },
                          ]
                     },
                  {
                       id: 3,
                       name: 'Distributor Management',
                       description: 'Distributor Management',
                       baseIcon: 'consumer2.svg',
                       iconType: '',
                       core: false,
                       state: '/distributor',
                       parentUrl: ['distributor'],
                       translation: 'sidebar.nav.distributor.main',
                       features: [
                                  {      id: 1,
                                         baseIcon: 'consumerlist.svg',
                                         crud: true,
                                         description: 'Distributor Management',
                                         name: 'Distributor Management',
                                         state: '/distributor/list',
                                         translation: 'sidebar.nav.distributor.list'
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
                        parentUrl: ['vendor-company','vendor'],
                        translation: 'sidebar.nav.report.main',
                        features: [
                               {      id: 1,
                                      baseIcon: 'report.svg',
                                      crud: true,
                                      description: 'Report Management',
                                      name: 'Report  Management',
                                      state: '/report/vendor',
                                      translation: 'sidebar.nav.report.vendorDReport'
                               },
                               {      id: 1,
                                     baseIcon: 'report.svg',
                                     crud: true,
                                     description: 'Report Management',
                                     name: 'Report  Management',
                                     state: '/report/vendor-company',
                                     translation: 'sidebar.nav.report.vendorCompany'
                               },
                        ]
                 },
            ]

    },

    'features': [

               {     id: 1,
                     active: true,
                     baseIcon: 'fa fa-cube',
                     crud: true,
                     description: 'Product Management',
                     locked: false,
                     name: 'Vendor',
                     sequence: 0,
                     state: '/vendor/vendor-product',
                     translation: 'sidebar.nav.vendor.unassignedProductList'

               },
               {     id: 2,
                     active: true,
                     baseIcon: 'fa fa-cube',
                     crud: true,
                     description: 'Product Management',
                     locked: false,
                     name: 'Vendor',
                     sequence: 0,
                     state: '/vendor/assigned-distributor-product',
                     translation: 'sidebar.nav.vendor.assignedDistributorProduct'

               },
               {
                     id: 3,
                     active: true,
                     baseIcon: 'fa fa-cube',
                     crud: true,
                     description: 'Product Management',
                     locked: false,
                     name: 'New  Vendor Product',
                     sequence: 0,
                     state: '/vendor/new-vendor-product',
                     translation: 'sidebar.nav.vendor.newVendorProductList'
               },
               {      id: 2,
                        baseIcon: 'fa fa-building',
                        crud: true,
                        description: 'Company Management',
                        name: 'Company Management',
                        state: '/company/list',
                        translation: 'sidebar.nav.company.list'
               },
               {      id: 3,
                       baseIcon: 'fa fa-user',
                       crud: true,
                       description: 'Distributor Management',
                       name: 'Distributor Management',
                       state: '/distributor',
                       translation: 'sidebar.nav.distributor.list'
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
