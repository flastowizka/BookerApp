angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('LivroLidosService', function() {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setLivro = function(user_data) {
    window.localStorage.starter_book_lidos = JSON.stringify(user_data);
  };

  var getLivro = function(){
    return JSON.parse(window.localStorage.starter_book_lidos || '{}');
  };
  
  return {
    getLivro: getLivro,
    setLivro: setLivro
  };
})

.service('UserService', function() {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
})

.service('LivroLikedService', function() {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setLivroLiked = function(user_data) {
    window.localStorage.starter_book_liked = JSON.stringify(user_data);
  };

  var getLivroLiked = function(){
    return JSON.parse(window.localStorage.starter_book_liked || '{}');
  };
  
  var getLivro = function(id) {
      var retu = [];
      
      angular.forEach(getLivroLiked(), function (it) {
         if (it.$$hashKey == id) {
             retu = it;
         } 
      });
      
      return retu;
  }

  return {
    getLivroLiked: getLivroLiked,
    setLivroLiked: setLivroLiked,
    getLivro: getLivro
  };
});