QB.init(QBApp.appId, QBApp.authKey, QBApp.authSecret, true);

QB.createSession(QBUser, function(err, result){
  if (err) {
    console.log('Something went wrong: ' + err);
  } else {
    console.log('Session created with id ' + result.id);
    // Get all posts

    myMap.initialize();

  }
});

var myMap = {
  map: null,
  markers: [],
  infowindow: null,
  minYear: 1900,
  maxYear: 2015,
  initialize: function() {
    this.setMinMaxYears();
    this.createMap();
    this.setMarkersAndInfoWindow();
    this.setSlider();
    this.getAllPosts();
  },
  getAllPosts: function() {
    QB.data.list("object", function(err, result){
      var str = '';
      for (var i=0; i < result.items.length; i++) {
        var item = result.items[result.items.length-i-1];
        str += '<li>';
        str += '<div class="col s4" >';
        str += '<div class="card" id="object">';
        str += '<div class="card-image">';
        str += "<img src='" + item.o_url[0] + "' width=350 height=200 alt=''/>";
        str += '</div>';
        str += '<div class="card-action">';
        str += '<a href=""><span class="name" id="send_object">'+item.o_description+'</span></a><br>';
        str += '<button type="button" class="qwert" data-id="'+item._id+'">Подробнее</button>'
        str += '</div>';
        str += '</div>';
        str += '</div>';
        str += '</li>';
      }
      $('#qwe').html(str);
            $('.qwert').click(function(e) {
        e.preventDefault();
        var itemid = $(this).data("id");
        console.log(itemid);
        window.location.href = "/object.html/?objectid="+itemid;
      });

      var monkeyList = new List('test-list', {
        valueNames: ['name'],
        page: 6,
        plugins: [ ListPagination({}) ] 
      });
    });
  },
  setMinMaxYears: function() {
    $('#currentRange').text('От ' + this.minYear + ' года' + ' - ' + 'До ' + this.maxYear + ' года');
  },
  createMap: function() {
    var mapOptions = {
      center: new google.maps.LatLng(48.747243, 44.551863), 
      zoom: 11,
      disableDefaultUI: true,
      draggable: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      styles: [{
                        "featureType": "water",
                        "stylers": [{"color": "#19a0d8"}]
                    }, {
                        "featureType": "administrative",
                        "elementType": "labels.text.stroke",
                        "stylers": [{"color": "#ffffff"}, {"weight": 6}]
                    }, {
                        "featureType": "administrative",
                        "elementType": "labels.text.fill",
                        "stylers": [{"color": "#e85113"}]
                    }, {
                        "featureType": "road.highway",
                        "elementType": "geometry.stroke",
                        "stylers": [{"color": "#efe9e4"}, {"lightness": -40}]
                    }, {
                        "featureType": "road.arterial",
                        "elementType": "geometry.stroke",
                        "stylers": [{"color": "#efe9e4"}, {"lightness": -20}]
                    }, {
                        "featureType": "road",
                        "elementType": "labels.text.stroke",
                        "stylers": [{"lightness": 100}]
                    }, {
                        "featureType": "road",
                        "elementType": "labels.text.fill",
                        "stylers": [{"lightness": -100}]
                    }, {"featureType": "road.highway", "elementType": "labels.icon"}, {
                        "featureType": "landscape",
                        "elementType": "labels",
                        "stylers": [{"visibility": "off"}]
                    }, {
                        "featureType": "landscape",
                        "stylers": [{"lightness": 20}, {"color": "#efe9e4"}]
                    }, {
                        "featureType": "landscape.man_made",
                        "stylers": [{"visibility": "off"}]
                    }, {
                        "featureType": "water",
                        "elementType": "labels.text.stroke",
                        "stylers": [{"lightness": 100}]
                    }, {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [{"lightness": -100}]
                    }, {
                        "featureType": "poi",
                        "elementType": "labels.text.fill",
                        "stylers": [{"hue": "#11ff00"}]
                    }, {
                        "featureType": "poi",
                        "elementType": "labels.text.stroke",
                        "stylers": [{"lightness": 100}]
                    }, {
                        "featureType": "poi",
                        "elementType": "labels.icon",
                        "stylers": [{"hue": "#4cff00"}, {"saturation": 58}]
                    }, {
                        "featureType": "poi",
                        "elementType": "geometry",
                        "stylers": [{"visibility": "on"}, {"color": "#f0e4d3"}]
                    }, {
                        "featureType": "road.highway",
                        "elementType": "geometry.fill",
                        "stylers": [{"color": "#efe9e4"}, {"lightness": -25}]
                    }, {
                        "featureType": "road.arterial",
                        "elementType": "geometry.fill",
                        "stylers": [{"color": "#efe9e4"}, {"lightness": -10}]
                    }, {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "simplified"}]}]
    };
    this.map = new google.maps.Map($("#map")[0], mapOptions);
    this.infowindow = new google.maps.InfoWindow();
    //иаичапип
  },
  setMarkersAndInfoWindow: function() {
    QB.data.list("object", function(err, result){
      for (var i=0; i < result.items.length; i++) {
        var item = result.items[i];
        var marker = new google.maps.Marker({
        position: new google.maps.LatLng(item.latitude, item.longitude),
        map: myMap.map,
        title: item.o_name,
        icon: 'http://icons.iconarchive.com/icons/paomedia/small-n-flat/32/map-marker-icon.png'
        });
        google.maps.event.addListener(marker, 'click', function(marker, item) {
          return function() {
            var content = $('#tabs').html();
            var str1 = '';
            str1 += '<h3>' + item.o_name + '</h3>';
            str1 += '<div>';
            str1 += item.o_description;
            for (var k = 0; k < item.o_year.length; k++) {
              str1 += '<div class="ui-state-highlight ui-corner-all" style="padding: 5px;">Год фото ' + item.o_year[k] + '</div>';
              str1 += "<img src='" + item.o_url[k] + "' width=350 height=200 alt=''/>";
            };
            str1 += '</div>';
            $('#listing1').html(str1);

            myMap.infowindow.setContent(str1);
            myMap.infowindow.open(myMap.map, marker);
                        $('#listing1').accordion({
            collapsible: true,
            active: false,
            heightStyle: 'content'
    });
          };

        }(marker, item));
      }
      google.maps.event.addListener(myMap.infowindow, 'domready', function() {
        $('#hotelFeatures').tabs();
      });
    });

  },
  setSlider: function() {
    $('#slider').slider({
      min: myMap.minYear,
      max: myMap.maxYear,
      markers: myMap.markers,
      range: true,
      values: [myMap.minYear, myMap.maxYear],
      step: 2,
      slide: function(event, ui) {
        $('#currentRange').text('От ' + ui.values[0] + ' - ' + 'До ' + ui.values[1]);
      },
      stop: function(event, ui) {
          $('#listing h3').each(function() {
            var year = parseInt($(this).data('price'), 10);
            var headerIndex = $('#listing h3').index($(this));
            if (year >= ui.values[0] && year <= ui.values[1]) {
              $('#listing h3:eq(' + headerIndex + ')').show();
              markers[headerIndex].push(myMap.map);
            } else {
              $('#listing h3:eq(' + headerIndex + ')').hide();
              $('#listing div.ui-accordion-content:eq(' + headerIndex + ')').hide();
               myMap.markers[headerIndex].setMap(null);
            }
          });
        }
      });
    }
};

 $('#like').on('click', function() {window.location.href = "/liked.html/?username="+login;});