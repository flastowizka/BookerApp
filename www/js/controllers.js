angular.module('app.controllers', [])

.controller('homeCtrl', function($scope, $state) {
    $scope.twitterName = "flastowizka";

    $scope.entrar = function () {
        $state.go("indicacao");
    }
})

.controller('livrosLidosCtrl', function ($scope, $ionicPlatform, $ionicLoading, $state, LivroLidosService, $q, UserService) {
    $scope.books = [];

    $ionicLoading.show();

    $ionicPlatform.ready(function() {
        $scope.books = LivroLidosService.getLivro();

        $ionicLoading.hide();
    });



    var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      console.log(response);
      console.log(profileInfo);
      console.log(authResponse);

      $scope.getBooks(authResponse.accessToken);

      // For the purpose of this example I will store user data on local storage
      UserService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      $ionicLoading.hide();
      // $state.go('app.home');
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
				console.log(response);
        info.resolve(response);
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };


  $scope.getBooks = function (accessToken) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me/book.reads?access_token=' + accessToken, null,
      function (response) {
				console.log(response);
        info.resolve(response);

        LivroLidosService.setLivro(response.data);

        angular.forEach(response.data, function (it) {
          console.log(it.data.book.title);
        })
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );

  };



  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);

    		// Check if we have our user saved
    		var user = UserService.getUser('facebook');

    		if(!user.userID){
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						// For the purpose of this example I will store user data on local storage
						UserService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});

						// $state.go('app.home');
					}, function(fail){
						// Fail get profile info
						console.log('profile info fail', fail);
					});
				}else{
					// $state.go('app.home');
				}
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
        // Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.

				console.log('getLoginStatus', success.status);

				$ionicLoading.show({
          template: 'Logging in...'
        });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile', 'user_actions.books'], fbLoginSuccess, fbLoginError);
      }
    });
  };
})

.controller('livrosCtrl', function($scope, $ionicPlatform, $ionicLoading, LivroLikedService, $state) {
    $ionicLoading.show();

    $ionicPlatform.ready(function() {
        $scope.books = LivroLikedService.getLivroLiked();

        console.log($scope.books);

        $ionicLoading.hide();
    });

    $scope.detalhe = function(book) {
        console.log(book.$$hashKey);
        $state.go('menu.detalheDoLivro', { livro: book.$$hashKey });
    }
})

.controller('detalheDoLivroCtrl', function($scope, $stateParams, $ionicLoading, $ionicPlatform, LivroLikedService) {
    $ionicLoading.show();

    $ionicPlatform.ready(function() {
        $scope.book = LivroLikedService.getLivro($stateParams.livro);

        $ionicLoading.hide();
    });

    $scope.buyBook = function(book) {
      window.open(book.LinkBuy, "_self");
    }
})

.controller('indicacaoCtrl', function($scope, TDCardDelegate, $timeout, $ionicPlatform, $http, $ionicLoading, $state, LivroLikedService) {

  $ionicLoading.show();

  $ionicPlatform.ready(function () {

    //   var cards = [
    //     { image: 'http://c4.staticflickr.com/4/3924/18886530069_840bc7d2a5_n.jpg' },
    //     { image: 'http://c1.staticflickr.com/1/421/19046467146_548ed09e19_n.jpg' },
    //     { image: 'http://c1.staticflickr.com/1/278/18452005203_a3bd2d7938_n.jpg' },
    //     { image: 'http://c1.staticflickr.com/1/297/19072713565_be3113bc67_n.jpg' },
    //     { image: 'http://c1.staticflickr.com/1/536/19072713515_5961d52357_n.jpg' },
    //     { image: 'http://c4.staticflickr.com/4/3937/19072713775_156a560e09_n.jpg' },
    //     { image: 'http://c1.staticflickr.com/1/267/19067097362_14d8ed9389_n.jpg' }
    // ];

    // $http.get("http://hackathon.epadoca.com/Lista/Receitas").then(function(response) {
      
      var url = "/data/livros.json";
      
      if(ionic.Platform.isAndroid()){
        console.log("é ANDROID!!");
        url = "file:///android_asset/www/data/livros.json";
    }
      
    $http.get(url).then(function(response) {
      console.log(response);
      var cards = response.data;

      $scope.cards = {
        // Master - cards that haven't been discarded
        master: Array.prototype.slice.call(cards, 0),
        // Active - cards displayed on screen
        active: Array.prototype.slice.call(cards, 0),
        // Discards - cards that have been discarded
        discards: [],
        // Liked - cards that have been liked
        liked: [],
        // Disliked - cards that have disliked
        disliked: []
    };

      setTimeout(function () {
        $ionicLoading.hide();
      }, 5000);
      
    }, function (error) {
      console.log(error);
      alert("Ocorreu um erro ao buscar as informações, tente novamente");
      $ionicLoading.hide();
    });

  });



  // Removes a card from cards.active
  $scope.cardDestroyed = function(index) {
    $scope.cards.active.splice(index, 1);
  };

  // Adds a card to cards.active
  $scope.addCard = function() {
    var newCard = cardTypes[0];
    $scope.cards.active.push(angular.extend({}, newCard));
  }

  // Triggers a refresh of all cards that have not been discarded
  $scope.refreshCards = function() {
    // First set $scope.cards to null so that directive reloads
    $scope.cards.active = null;
    // Then set cards.active to a new copy of cards.master
    $timeout(function() {
      $scope.cards.active = Array.prototype.slice.call($scope.cards.master, 0);
    });
  }

  // Listens for the 'removeCard' event emitted from within the directive
  //  - triggered by the onClickTransitionOut click event
  $scope.$on('removeCard', function(event, element, card) {
    var discarded = $scope.cards.master.splice($scope.cards.master.indexOf(card), 1);
    $scope.cards.discards.push(discarded);
  });

  // On swipe left
  $scope.cardSwipedLeft = function(index) {
    var card = $scope.cards.active[index];
    $scope.cards.disliked.push(card);
  };

  // On swipe right
  $scope.cardSwipedRight = function(index) {
    var card = $scope.cards.active[index];
    $scope.cards.liked.push(card);
  };

  $scope.verLivros = function () {
      console.log($scope.cards);
      LivroLikedService.setLivroLiked($scope.cards.liked);

      $state.go("menu.livros");
  }
})
