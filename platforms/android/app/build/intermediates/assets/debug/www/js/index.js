/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        if(id == 'deviceready'){
          var option = {
            enableHighAccuracy: true
          };
          //crear mapa con tu posicion
          plugin.google.maps.LocationService.getMyLocation(option, function(location){
            crearMapa(location);
          })

          

        }

        //Observador de posicion
        watchMapPosition();
        
    }
};

var latitude,longitude;
var map;
var miPosicion;
var puntos= [
  {
    position: {lat: -33.606383, lng: -70.694662},
    title: "Maestranza"
  },
  {
    position: {lat: -33.593605, lng: -70.688835},
    title: "Esquina"
  }
];


var onMapWatchSuccess =  function(position){
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    actualizarMapa(latitude,longitude);
}



var onError = function(msg) {
    alert(JSON.stringify(msg));
};

var onSuccess = function(location) {
    var msg = ["Current your location:\n",
      "latitude:" + location.latLng.lat,
      "longitude:" + location.latLng.lng,
      "speed:" + location.speed,
      "time:" + location.time,
      "bearing:" + location.bearing].join("\n");
  
  
    var marker = map.addMarker({
      'position': location.latLng,
      'title': msg
    });
    
    map.animateCamera({
      target: location.latLng,
      zoom: 16
    }, function() {
      marker.showInfoWindow();
    });
};

//Ejemplo LatLng
const PRUEBA = {"lat": -33.593605, "lng": -70.688835};

app.initialize();


//Crear mapa y animar camara
function crearMapa(location){
    var mapDiv  = document.getElementById("map");

    map = plugin.google.maps.Map.getMap(mapDiv );

    //map.one(plugin.google.maps.event.MAP_READY, onMapInit);

    map.animateCamera({
        target: location.latLng,
        zoom: 16,
        tilt: 60,
        bearing: 140,
        duration: 5000
      }
    );

    /*map.addMarker({
      'position': PRUEBA
    });*/

    for(var locIndex = 0;locIndex<puntos.length;locIndex++){
      map.addMarker({
             'position': puntos[locIndex].position,
             'title': puntos[locIndex].title
      });
    
    }
 
}

//crear observador localizacion.
function watchMapPosition(){
    return navigator.geolocation.watchPosition(onMapWatchSuccess, onError, {enableHighAccuracy: true, timeout: 3000});
}

//Crea y actualiza marcador de posicion.
function actualizarMapa(latitude, longitude){
    

    if(miPosicion == undefined){

      miPosicion = map.addMarker({
        'position': {lat: latitude, lng: longitude}
      });

    }
    else{
      miPosicion.setPosition({lat: latitude, lng: longitude});
      
      calcularDistanciaPuntos({lat: latitude, lng: longitude});
    }
   
}

function calcularDistanciaPuntos(latLng){
  
  for(var locIndex = 0; locIndex<puntos.length; locIndex++){
    

    var distancia = plugin.google.maps.geometry.spherical.computeDistanceBetween(latLng, puntos[locIndex].position);

    if(distancia < 100){
      cordova.plugins.notification.local.schedule({
        id: 1,
        text: "Patrimonio cercano",
      });
    }

  }

}
