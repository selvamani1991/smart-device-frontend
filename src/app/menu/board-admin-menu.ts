export const BOARD_ADMIN_MENU_CONSTANTS = {
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
                            id: 2,
                            name: 'Board Management',
                            description: 'Board Management',
                            baseIcon: 'boardmanufact.svg',
                            iconType: '',
                            core: false,
                            state: '/board',
                            parentUrl: ['board'],
                            translation: 'sidebar.nav.board.main',
                            roleFeatures: [],
                            features: [
                                 {
                                       id: 2,
                                       baseIcon: 'boardmanufact.svg',
                                       crud: true,
                                       description: 'Board ProductType',
                                       name: 'Board ProductType',
                                       state: '/board-manufacturer/product-type',
                                       translation: 'sidebar.nav.boardProductType.main'
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


            ]
    },

    'features': [
                  {
                         id: 1,
                         active: true,
                         baseIcon: 'fa fa-puzzle-piece',
                         crud: true,
                         description: 'Board Management',
                         locked: false,
                         name: 'Board',
                         sequence: 0,
                         state: '/board/list',
                         translation: 'sidebar.nav.board.list'
                  },

                  {
                        id: 2,
                        baseIcon: 'fa fa-user',
                        crud: true,
                        description: 'Board ProductType',
                        name: 'Board ProductType',
                        state: '/board-manufacturer/product-type',
                        translation: 'sidebar.nav.boardProductType.main'
                  },

    ]
};
