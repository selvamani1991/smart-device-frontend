export const COMPANY_ADMIN_MENU_CONSTANTS = {
    'featureCategories':
    {
            others: [


                       {
                        id: 2,
                        name: 'Client Management',
                        alias: '26704ebadc99013fffffcb5dd694437d8395a',
                        description: 'Management',
                        baseIcon: 'fa fa-user',
                        iconType: 'font-awesome',
                        core: false,
                        sequence: 0,
                        state: '/client',
                        translation: 'sidebar.nav.client.main',
                        roleFeatures: [],
                        features: [
                                   {      id: 1,
                                          active: true,
                                          baseIcon: 'fa-user',
                                          crud: true,
                                          description: 'User Management',
                                          locked: false,
                                          name: 'Client Management',
                                          sequence: 0,
                                          state: '/client/list',
                                          translation: 'sidebar.nav.client.list'
                                   },
                        ]
                  },

            ]

    },

    'features': [
                       {          id: 1,
                                  active: true,
                                  alias: '3676d55f84497cbeadfc614c1b1adsdsd',
                                  baseIcon: 'fa-user',
                                  crud: true,
                                  description: 'User Management',
                                  locked: false,
                                  name: 'User Management',
                                  sequence: 0,
                                  state: '/user',
                                  translation: 'sidebar.nav.user'
                       },
                       {           id: 2,
                                   active: true,
                                   baseIcon: 'fa-setting',
                                   crud: true,
                                   description: 'organisation ',
                                   locked: false,
                                   name: 'Organisation Management',
                                   sequence: 0,
                                   state: '/organisation',
                                   translation: 'sidebar.nav.organisation'
                       }
    ]
};
