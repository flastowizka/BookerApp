angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      })

      .state('indicacao', {
        url: '/indicacao',
        templateUrl: 'templates/indicacao.html',
          controller: 'indicacaoCtrl'
      })

      .state('menu', {
        url: '/side-menu-principal',
        templateUrl: 'templates/menu.html',
        abstract:true
      })

      .state('menu.livros', {
        url: '/livros',
        views: {
          'side-menu-principal': {
            templateUrl: 'templates/livros.html',
            controller: 'livrosCtrl'
          }
        }
      })

      .state('menu.livrosLidos', {
        url: '/livrosLidos',
        views: {
          'side-menu-principal': {
            templateUrl: 'templates/livrosLidos.html',
            controller: 'livrosLidosCtrl'
          }
        }
      })

      .state('menu.detalheDoLivro', {
        url: '/detalhe/:livro',
        views: {
          'side-menu-principal': {
            templateUrl: 'templates/detalheDoLivro.html',
            controller: 'detalheDoLivroCtrl'
          }
        }
      })

$urlRouterProvider.otherwise('/home')



});
