import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'ion-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Login',
    icon: 'nb-locked',
    link: '/pagessinples/loginf',
    home: true,
  },
  {
    title: 'Clientes',
    icon: 'ion-ios-people-outline',
    children: [
      {
        title: 'Ver Clientes',
        link: '/pages/clientes/ver',
      },
     
    ],
  },
  {
    title: 'Categorías',
    icon: 'nb-gear',
    children: [
      {
        title: 'Agregar Categorías',
        link: '/pages/categorias/agregar',
      },
      {
        title: 'Ver Categorías',
        link: '/pages/categorias/ver',
      },
     
    ],
  },
  {
    title: 'Subcategorías',
    icon: 'nb-gear',
    children: [
      {
        title: 'Agregar Subcategorías',
        link: '/pages/subcategorias/agregar',
      },
      {
        title: 'Ver Subcategorías',
        link: '/pages/subcategorias/ver',
      },
     
    ],
  },
  {
    title: 'Productos',
    icon: 'ion-ios-box-outline',
    children: [
      {
        title: 'Agregar Productos',
        link: '/pages/productos/agregar',
      },
      {
        title: 'Ver Productos',
        link: '/pages/productos/ver',
      },
     
    ],
  },
  {
    title: 'Establecimientos',
    icon: 'nb-home',
    children: [
      {
        title: 'Agregar Establecimientos',
        link: '/pages/establecimientos/agregar',
      },
      {
        title: 'Ver Establecimientos',
        link: '/pages/establecimientos/ver',
      },
     
    ],
  },
  {
    title: 'Pedidos',
    icon: 'nb-compose',
    children: [
      {
        title: 'En curso',
        link: '/pages/pedidos/encurso',
      },
      {
        title: 'Finalizados',
        link: '/pages/pedidos/finalizados',
      },
      
    ],
  },
  {
    title: 'Socios',
    icon: 'ion-android-bicycle',
    children: [
      {
        title: 'Agregar Socios',
        link: '/pages/socios/agregar',
      },
      {
        title: 'Ver Socios',
        link: '/pages/socios/ver',
      },
    ],
  },
  {
    title: 'Chat',
    icon: 'nb-email',
    link: '/pages/chat-box',
    home: true,
  },
  {
    title: 'Blogs',
    icon: 'fa fa-book',
    link: '/pages/blogs',
    home: true,
  },
  {
    title: 'Pagos',
    icon: 'ion-social-usd',
    children: [
      {
        title: 'Pendientes',
        link: '/pages/pagos/pendientes',
      },
      {
        title: 'Realizados',
        link: '/pages/pagos/realizados',
      },
     
    ],
  },
  {
    title: 'Sistema',
    icon: 'ion-wrench',
    link: '/pages/sistema',
    home: true,
  },


/*  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'UI Features',
    icon: 'nb-keypad',
    link: '/pages/ui-features',
    children: [
      {
        title: 'Buttons',
        link: '/pages/ui-features/buttons',
      },
      {
        title: 'Grid',
        link: '/pages/ui-features/grid',
      },
      {
        title: 'Icons',
        link: '/pages/ui-features/icons',
      },
      {
        title: 'Modals',
        link: '/pages/ui-features/modals',
      },
      {
        title: 'Typography',
        link: '/pages/ui-features/typography',
      },
      {
        title: 'Animated Searches',
        link: '/pages/ui-features/search-fields',
      },
      {
        title: 'Tabs',
        link: '/pages/ui-features/tabs',
      },
    ],
  },
  {
    title: 'Forms',
    icon: 'nb-compose',
    children: [
      {
        title: 'Form Inputs',
        link: '/pages/forms/inputs',
      },
      {
        title: 'Form Layouts',
        link: '/pages/forms/layouts',
      },
    ],
  },

  {
    title: 'Components',
    icon: 'nb-gear',
    children: [
      {
        title: 'Tree',
        link: '/pages/components/tree',
      }, {
        title: 'Notifications',
        link: '/pages/components/notifications',
      },
    ],
  },
  {
    title: 'Maps',
    icon: 'nb-location',
    children: [
      {
        title: 'Google Maps',
        link: '/pages/maps/gmaps',
      },
      {
        title: 'Leaflet Maps',
        link: '/pages/maps/leaflet',
      },
      {
        title: 'Bubble Maps',
        link: '/pages/maps/bubble',
      },
    ],
  },
  {
    title: 'Charts',
    icon: 'nb-bar-chart',
    children: [
      {
        title: 'Echarts',
        link: '/pages/charts/echarts',
      },
      {
        title: 'Charts.js',
        link: '/pages/charts/chartjs',
      },
      {
        title: 'D3',
        link: '/pages/charts/d3',
      },
    ],
  },
  {
    title: 'Editors',
    icon: 'nb-title',
    children: [
      {
        title: 'TinyMCE',
        link: '/pages/editors/tinymce',
      },
      {
        title: 'CKEditor',
        link: '/pages/editors/ckeditor',
      },
    ],
  },
  {
    title: 'Tables',
    icon: 'nb-tables',
    children: [
      {
        title: 'Smart Table',
        link: '/pages/tables/smart-table',
      },
    ],
  },
  {
    title: 'Auth',
    icon: 'nb-locked',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },*/
];
