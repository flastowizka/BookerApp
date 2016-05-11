// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ionic.contrib.ui.tinderCards2', 'ngCordova', 'ngCordovaBeacon', 'ionic.rating'])

.run(function($ionicPlatform, $cordovaBeacon, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    
    $cordovaBeacon.requestAlwaysAuthorization();
        
    var openNotification = function(tit, msg) {
        cordova.plugins.notification.local.schedule({
            title: tit,
            message: msg
        });
    };
 
    $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
        var uniqueBeaconKey;
        for(var i = 0; i < pluginResult.beacons.length; i++) {
            uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
        }
    });
        
    $rootScope.$on("$cordovaBeacon:didDetermineStateForRegion", function(event, pluginResult) {
        var event = pluginResult;
            
        switch (pluginResult.state) {
            case "CLRegionStateInside":
                
              openNotification("Novidade", "Livro disponivel para você ler! :)");

/*
                    $http.get("http://hackathon.epadoca.com/Lista/Promocao").then(function(response) {
                      console.log(data);
                      
                      if (typeof response.data.nome != "undefined") {
                        openNotification("Promoção", response.data.nome);  
                      }
                    });
*/
                    break;
                //case "CLRegionStateOutside":
                
                //break;
          }
    });
 
    var beaconRegions = [{
        identifier: "area1",
        uuid:  "74278BDA-B644-4520-8F0C-720EAF059935",
        minor: "65305",
        major: "11679",
    }];
        
    for (var i = 0; i < beaconRegions.length; i++) {
        var beacon = beaconRegions[i];
        var beaconRegion = $cordovaBeacon.createBeaconRegion(
            beacon.identifier,
            beacon.uuid,
            beacon.major,
            beacon.minor,
            true);

        $cordovaBeacon.startRangingBeaconsInRegion(beaconRegion);
        $cordovaBeacon.startMonitoringForRegion(beaconRegion);
    }
  });
})