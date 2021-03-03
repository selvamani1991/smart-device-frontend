export const CLIENT_TWO_ADMIN_MENU_CONSTANTS = {
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
                              name: 'Consumer Management',
                              description: 'Consumer Management',
                              baseIcon: 'consumer2.svg',
                              iconType: '',
                              core: false,
                              state: '/consumer',
                              parentUrl: ['consumer-product-type','consumer-list'],
                              translation: 'sidebar.nav.consumer.main',
                              features: [
                                   {
                                        id: 2,
                                        baseIcon: 'consumerlist.svg',
                                        crud: true,
                                        description: 'Consumer Management',
                                         name: 'Consumer List',
                                        state: '/consumer/consumer-list',
                                        translation: 'sidebar.nav.consumer.consumerList'
                                   },
                                   {
                                        id: 1,
                                        baseIcon  : 'ticketlist.svg',
                                        crud: true,
                                        description: 'Consumer Ticket Management',
                                        name: 'Consumer Ticket  Management',
                                        state: '/consumer/consumer-ticket/all-list',
                                        translation: 'sidebar.nav.consumerTicket.list'
                                   },


                              ]
                       },
                       {
                             id: 2,
                             name: 'Customer Management',
                             description: 'Customer Management',
                             baseIcon: 'customer.svg',
                             iconType: '',
                             core: false,
                             state: '/customer',
                             parentUrl: ['company','zone'],
                             translation: 'sidebar.nav.customer.main',
                             features: [

                                  {
                                     id: 1,
                                     baseIcon: 'companymanagement.svg',
                                     crud: true,
                                     description: 'Company Management',
                                     name: 'Company Management',
                                     state: '/company/list',
                                     translation: 'sidebar.nav.customer.company'
                                  },

                                  {
                                       id: 3,
                                       baseIcon: 'zonemanagement.svg',
                                       crud: true,
                                       description: 'Zone Management',
                                       name: 'Zone List',
                                       state: '/zone/list',
                                       translation: 'sidebar.nav.customer.zone'
                                  },
                             ]
                       },
                       {
                            id: 3,
                            name: 'Products Management',
                            description: 'Products Management',
                            baseIcon: 'product.svg',
                            iconType: '',
                            core: false,
                            state: '/product',
                            parentUrl: ['board-manufacturer','machine-manufacturer','product-type','assigned-company-product','product-wizard'],
                            translation: 'sidebar.nav.productManagement.main',
                                features: [

                                       {      id: 1,
                                              baseIcon: 'machinemanufact.svg',
                                              crud: true,
                                              description: 'Machine Management',
                                              name: 'Machine Management',
                                               state: '/machine-manufacturer/list',
                                              translation: 'sidebar.nav.productManagement.machine'
                                       },
                                       {      id: 2,
                                             baseIcon: 'boardmanufact.svg',
                                             crud: true,
                                             description: 'Board Management',
                                             name: 'Board Management',
                                             state: '/board-manufacturer/list',
                                             translation: 'sidebar.nav.productManagement.board'
                                       },
                                       {      id: 3,
                                             baseIcon: 'product.svg',
                                             crud: true,
                                             description: 'Product Type Management',
                                             name: 'Product Type Management',
                                             state: '/product-type/list',
                                             translation: 'sidebar.nav.productManagement.productType'
                                       },

                                       {      id: 4,
                                             baseIcon: 'companymanagement.svg',
                                             crud: true,
                                             description: 'Company Product Detail',
                                             name: 'Company Product Detail',
                                             state: '/client/assigned-company-product',
                                             translation: 'sidebar.nav.productManagement.companyProduct'
                                       },
                                       {      id: 5,
                                             baseIcon: 'product.svg',
                                             crud: true,
                                             description: 'Product Type Detail',
                                             name: 'Product Type Detail',
                                             state: '/product-wizard/order-list',
                                             translation: 'sidebar.nav.productManagement.product'
                                       },

                                ]

                       },

                     {
                           id: 4,
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

                     /*{
                          id: 5,
                          name: 'Consumer Ticket Management',
                          description: 'Consumer Ticket  Management',
                          baseIcon: 'fa fa-building',
                          iconType: 'font-awesome',
                          core: false,
                          state: '/consumer',
                          parentUrl: ['consumer'],
                          translation: 'sidebar.nav.consumerTicket.main',
                          features: [
                                 {
                                     id: 1,
                                     baseIcon: 'fa fa-building',
                                     crud: true,
                                     description: 'Consumer Ticket Management',
                                     name: 'Consumer Ticket  Management',
                                     state: '/consumer/consumer-ticket/all-list',
                                     translation: 'sidebar.nav.consumerTicket.list'
                                 },
                          ]
                     },*/
                     {
                         id: 6,
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
                             id: 7,
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
                                           baseIcon: 'companymanagement.svg',
                                           crud: true,
                                           description: 'Report Management',
                                           name: 'Report  Management',
                                           state: '/report/client-company',
                                           translation: 'sidebar.nav.report.companyReport'
                                    },
                                    {      id: 2,
                                           baseIcon: 'error.svg',
                                           crud: true,
                                           description: 'Report Management',
                                           name: 'Report  Management',
                                           state: '/report/company-error',
                                           translation: 'sidebar.nav.report.companyError'
                                    }
                             ]
                     },
                      {
                                  id:8,
                                  name:"Resources  Management",
                                  description:"Resources  Management",
                                  baseIcon:"resource.svg",
                                  iconType:"",
                                  core: false,
                                  state: "/resources",
                                  parentUrl: ['resources'],
                                  translation: "sidebar.nav.resources.main",
                                  features:[
                                             {      id: 1,
                                                    baseIcon: "firmware.svg",
                                                    crud: true,
                                                    description: "resources Management",
                                                    name: "resources  Management",
                                                    state: "/resources/media",
                                                    translation: "sidebar.nav.resources.media"
                                             },
                                             {      id: 2,
                                                     baseIcon: "firmware.svg",
                                                     crud: true,
                                                     description: "resources Management",
                                                     name: "resources  Management",
                                                     state: "/resources/fota",
                                                     translation: "sidebar.nav.resources.fota"
                                             },
                                             {      id: 3,
                                                      baseIcon: "qr.svg",
                                                      crud: true,
                                                      description: "resources Management",
                                                      name: "resources  Management",
                                                      state: "/resources/qrcode",
                                                      translation: "sidebar.nav.resources.qrcode"
                                             },
                                             {      id: 4,
                                                     baseIcon: "error.svg",
                                                     crud: true,
                                                     description: "resources Management",
                                                     name: "resources  Management",
                                                     state: "/resources/error-data",
                                                     translation: "sidebar.nav.resources.errorData"
                                             },
                                             {      id: 5,
                                                     baseIcon: "telemetry.svg",
                                                     crud: true,
                                                     description: "resources Management",
                                                     name: "resources  Management",
                                                     state: "/resources/telemetric-data",
                                                     translation: "sidebar.nav.resources.telemetric"
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
                         description: 'Company Management',
                         name: 'Company Management',
                         state: '/company/list',
                         translation: 'sidebar.nav.company.list'
                  },
                  {      id: 2,
                         baseIcon: 'fa fa-cube',
                         crud: true,
                         description: 'Products Management',
                         name: 'Products Management',
                         state: '/product/list',
                         translation: 'sidebar.nav.product.unassignedProductList'
                 },

                 {      id: 3,
                        baseIcon: 'fa fa-cube',
                        crud: true,
                        description: 'Products Management',
                        name: 'Products Management',
                        state: '/client/assigned-vendor-product',
                        translation: 'sidebar.nav.product.assignedVendorProduct'
                 },
                 {      id: 4,
                        baseIcon: 'fa fa-cube',
                        crud: true,
                        description: 'Products Management',
                        name: 'Products Management',
                        state: '/client/assigned-company-product',
                        translation: 'sidebar.nav.product.assignedCompanyProduct'
                 },
                 {       id: 3,
                         baseIcon: 'fa fa-user',
                         crud: true,
                         description: 'Vendor Management',
                         name: 'Vendor Management',
                         state: '/vendor/list',
                         translation: 'sidebar.nav.vendor.list'
                 },
                 {       id: 4,
                         baseIcon: 'fa fa-user',
                         crud: true,
                         description: 'Manufacturer Management',
                         name: 'Manufacturer Management',
                         state: '/manufacturer/list',
                         translation: 'sidebar.nav.manufacturer.list'
                 },
                 {      id: 2,
                        baseIcon: 'fa fa-cubes',
                        crud: true,
                        description: 'Product Type Management',
                        name: 'Product Type Management',
                        state: '/category/list',
                        translation: 'sidebar.nav.productType.list'
                 },
                 {     id: 1,
                       baseIcon: 'fa fa-user',
                       crud: true,
                       description: 'Board Management',
                       name: 'Board Management',
                       state: '/board-manufacturer/list',
                       translation: 'sidebar.nav.boardManufacturer.list'
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
                       baseIcon: 'fa fa-user-circle',
                       crud: true,
                       description: 'Consumer Management',
                       name: 'Consumer List',
                       state: '/consumer/consumer-list',
                       translation: 'sidebar.nav.consumer.consumerList'
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
