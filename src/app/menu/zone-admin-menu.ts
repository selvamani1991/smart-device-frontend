export const ZONE_ADMIN_MENU_CONSTANTS = {
    'featureCategories':
    {
            others: [
                       {
                            id: 100,
                            name: 'Dashboard',
                            description: 'Dashboard',
                            baseIcon: 'icon-speedometer',
                            iconType: 'flatIcon',
                            core: false,
                            state: '/dashboard',
                            translation: 'sidebar.nav.dashboard.main',
                            features: []
                       },

                       {
                                 id:1,
                                 name:"Resources  Management",
                                 description:"Resources  Management",
                                 baseIcon:"fa fa-money",
                                 iconType:"font-awesome",
                                 core: false,
                                 state: "/resources",
                                 translation: "sidebar.nav.resources.main",
                                 features:[
                                            {      id: 1,
                                                   baseIcon: "fa fa-money",
                                                   crud: true,
                                                   description: "resources Management",
                                                   name: "resources  Management",
                                                   state: "/resources/media",
                                                   translation: "sidebar.nav.resources.media"
                                            },
                                            {      id: 2,
                                                    baseIcon: "fa fa-money",
                                                    crud: true,
                                                    description: "resources Management",
                                                    name: "resources  Management",
                                                    state: "/resources/fota",
                                                    translation: "sidebar.nav.resources.fota"
                                            },
                                            {      id: 3,
                                                     baseIcon: "fa fa-money",
                                                     crud: true,
                                                     description: "resources Management",
                                                     name: "resources  Management",
                                                     state: "/resources/qrcode",
                                                     translation: "sidebar.nav.resources.qrcode"
                                            },
                                            {      id: 4,
                                                    baseIcon: "fa fa-money",
                                                    crud: true,
                                                    description: "resources Management",
                                                    name: "resources  Management",
                                                    state: "/resources/error-data",
                                                    translation: "sidebar.nav.resources.errorData"
                                            },
                                            {      id: 5,
                                                    baseIcon: "fa fa-money",
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


    ]
};
