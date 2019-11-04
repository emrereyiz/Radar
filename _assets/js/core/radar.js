
		var track = {
			component: {
				infoDetail: {
					close: function(){
						$(document).on('click', '#info-box .icon-close', function(){
							$("#info-box").addClass("closing");
							setTimeout(function(){
								$("#info-box").fadeOut(function(){
									$("#info-box").removeClass("active closing");
								});
							}, 500);
						});
					},
					open: function(){

					},
					init: function(){
						this.open();
						this.close();
					},
				},
				box: {
					open: function(){
						$(document).on('click', '.swiper-item a', function(){
							$("#info-box").fadeIn(function(){
								$("#info-box").addClass("active");
							});
						});
					},
					init: function(){
						this.open();
					},
				},
				init: function(){
					this.infoDetail.init();
					this.box.init();
				},
			},
			preload: {
				open: function(){
					$("#preload").fadeIn();
				},
				close: function(){
					$("#preload").fadeOut();
				},
			},
		    mapDetail: {
			  	parse: {
			  		clearCoords: {
			  			lat: function(param){
				  			return Number(param.split(",")[0].replace("{",""));
				  		},
			  			lng: function(param){
				  			return Number(param.split(",")[1].replace("}",""));
				  		},
				  		parseLat: function(param){
							return Number(param.position.lat().toString().substr(0,9))
				  		},
				  		parseLng: function(param){
							return Number(param.position.lng().toString().substr(0,9))
				  		},
			  		},
			  	},
			  	getInfo: function(){
			  		$(".swiper-item").each(function(index, item){
			  			var $this = $(this),
			  				title = $this.attr("data-title"),
			  				coords = $this.attr("data-cords"),
			  				lat = track.mapDetail.parse.clearCoords.lat(coords),
			  				lng = track.mapDetail.parse.clearCoords.lng(coords);
			  				track.mapDetail.array.push([title, lat, lng]);
			  		});
			  		track.mapDetail.coordsInfo._set();
			  	},
			  	array: [],
			  	marker: {
			  		array: [],
			  	},
			  	coordsInfo: {
			  		first: {
			  			lat: null,
			  			lng: null,
			  		},
			  		active: {
			  			lat: null,
			  			lng: null,
			  		},
			  		myLocation: {
			  			lat: null,
			  			lng: null,
			  		},
			  		_set: function(){
			  			track.mapDetail.coordsInfo.first.lat = track.mapDetail.array[0][1];
			  			track.mapDetail.coordsInfo.first.lng = track.mapDetail.array[0][2];
			  		},
			  	},
			  	elements: {
			  		map: null,
			  		infowindow: null,
			  		marker: null,
			  	},
		  	getLocation: function(){
		  		track.preload.open();
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getPos);
                    navigator.geolocation.getCurrentPosition(function (getPos) {
                    }, function () {
                    	alert("Konum seçmeniz lazım.")
                    });
                    // navigator.geolocation.getCurrentPosition(getPos);
                } else {
                    alert("Konum alamıyoruz.")
                } 
                function getPos(position) {
		  		track.preload.close();
                    var pos = position,
                        lat = pos.coords.latitude,
                        lng = pos.coords.longitude;
                    track.mapDetail.coordsInfo.myLocation.lat = lat;
                    track.mapDetail.coordsInfo.myLocation.lng = lng;
  					
  					track.mapDetail.array.push(['me', lat, lng]);
		  			track.mapDetail.initMap();
                };
		  	},
		  	initMap: function(){

				    var map = new google.maps.Map(document.getElementById('map'), {
				      zoom: 17,
				      styles:track.mapStyle,
				      center: new google.maps.LatLng(track.mapDetail.coordsInfo.myLocation.lat, track.mapDetail.coordsInfo.myLocation.lng),
				      mapTypeId: google.maps.MapTypeId.ROADMAP,
					  disableDefaultUI: true
				    });
				    track.mapDetail.elements.map = map;

				    var infowindow = new google.maps.InfoWindow();
				    var marker, i;
				    var icon = {
		                url: "https://img.icons8.com/nolan/64/000000/map-pin.png", // url
		                scaledSize: new google.maps.Size(50, 50), // scaled size
		                origin: new google.maps.Point(0,0), // origin
		                anchor: new google.maps.Point(0, 0) // anchor
	            	};
				    for (i = 0; i < track.mapDetail.array.length; i++) {  
				    	var _title = track.mapDetail.array[i][0];
				    	console.log(_title)
				    	if(_title == "me"){
						    var icon = {
							      url: "https://media1.giphy.com/media/1oF1MaxVOqrgtG4hev/giphy.gif?cid=790b7611b65eb10c09d92e0ca9c8a2ac11a6ab7333b529a7&rid=giphy.gif", // url
		                    scaledSize: new google.maps.Size(50, 50), // scaled size
		                    origin: new google.maps.Point(0,0), // origin
		                    anchor: new google.maps.Point(0, 0) // anchor
                	};
				    	};

				      var marker = new google.maps.Marker({
				        position: new google.maps.LatLng(track.mapDetail.array[i][1], track.mapDetail.array[i][2]),
				        map: map,
				        icon: icon,
				      });

				      track.mapDetail.marker.array.push(marker);

				      google.maps.event.addListener(marker, 'click', (function(marker, i) {
				        return function() {
				        	var _target = track.mapDetail.array[i][0];
					          if(_target != "me"){
					          	infowindow.setContent(_target);
					          	infowindow.open(map, marker);
					          };
				        }
				      })(marker, i));


	                google.maps.event.addListener(marker, 'click', (function (marker) {
	                    return function () {
	                    	var _lat = track.mapDetail.parse.clearCoords.parseLat(marker),
	                    		_lng = track.mapDetail.parse.clearCoords.parseLng(marker);

								$(".swiper-slide").each(function(index, item){
									var $this = $(this),
										itemIndex = index;
									setTimeout(function(){
											$child = $this.find(".swiper-item"),
											title = $child.attr("data-title"),
											coords = $child.attr("data-cords");
											lat = track.mapDetail.parse.clearCoords.lat(coords),
					  						lng = track.mapDetail.parse.clearCoords.lng(coords);
											$.each(track.mapDetail.marker.array, function(index, item){
												if(lat == _lat && lng == _lng){
													 track.slide.slideEl.slideTo(itemIndex);
													 return false;
												}; 

											});
									}, 1);
								});
	                    };
	                })(marker));
				    };

		  	},
		  	init: function(){
		  		track.mapDetail.getLocation();
		  		track.mapDetail.getInfo();
		  	},
		  },
		  slide: {
		  		slideEl: null,
		  		control: function(){
				  	var mySwiper = new Swiper ('.swiper-container', {
						slidesPerView: 4,
						spaceBetween: 20,
						centeredSlides: true,
						pagination: {
						el: '.swiper-pagination',
						clickable: true,
						},
				  	}); 
				  	track.slide.slideEl = mySwiper;
		  		},
		  		_click: function(){
		  			$(document).on('click', '.swiper-slide', function(){
		  				var $this = $(this),
		  					index = $this.index();
						    track.slide.slideEl.slideTo(index);
		  			});
		  		},
		  		events: function(){
					track.slide.slideEl.on('slideChangeTransitionStart', function () {
						track.preload.open();
					});
					track.slide.slideEl.on('slideChangeTransitionEnd', function () {
						var $this = $(".swiper-slide-active"),
							$child = $this.find(".swiper-item"),
							title = $child.attr("data-title"),
							coords = $child.attr("data-cords");

							var _title = $this.find(".swiper-item").attr("data-title");
							lat = track.mapDetail.parse.clearCoords.lat(coords),
	  						lng = track.mapDetail.parse.clearCoords.lng(coords);

			    			track.mapDetail.elements.map.setCenter({lat:lat, lng:lng});

							$.each(track.mapDetail.marker.array, function(index, item){
								_lat = Number(item.position.lat().toString().substr(0,9));
								_lng = Number(item.position.lng().toString().substr(0,9));
								if(lat == _lat && lng == _lng){
									new google.maps.event.trigger( track.mapDetail.marker.array[index], 'click' );		
								};
							});
						track.preload.close();
					});
		  		},
	  			init: function(){
	  				track.slide.control();
	  				track.slide.events();
	  				track.slide._click();
	  			},
		  },
		  mapStyle: [
				    {
				        "featureType": "all",
				        "elementType": "labels.text.fill",
				        "stylers": [
				            {
				                "saturation": 36
				            },
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 40
				            }
				        ]
				    },
				    {
				        "featureType": "all",
				        "elementType": "labels.text.stroke",
				        "stylers": [
				            {
				                "visibility": "on"
				            },
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 16
				            }
				        ]
				    },
				    {
				        "featureType": "all",
				        "elementType": "labels.icon",
				        "stylers": [
				            {
				                "visibility": "off"
				            }
				        ]
				    },
				    {
				        "featureType": "administrative",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 20
				            }
				        ]
				    },
				    {
				        "featureType": "administrative",
				        "elementType": "geometry.stroke",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 17
				            },
				            {
				                "weight": 1.2
				            }
				        ]
				    },
				    {
				        "featureType": "landscape",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 20
				            }
				        ]
				    },
				    {
				        "featureType": "poi",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 21
				            }
				        ]
				    },
				    {
				        "featureType": "road.highway",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 17
				            }
				        ]
				    },
				    {
				        "featureType": "road.highway",
				        "elementType": "geometry.stroke",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 29
				            },
				            {
				                "weight": 0.2
				            }
				        ]
				    },
				    {
				        "featureType": "road.arterial",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 18
				            }
				        ]
				    },
				    {
				        "featureType": "road.local",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 16
				            }
				        ]
				    },
				    {
				        "featureType": "transit",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 19
				            }
				        ]
				    },
				    {
				        "featureType": "water",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#000000"
				            },
				            {
				                "lightness": 17
				            }
				        ]
				    }
				],
		  init: function(){
		    this.mapDetail.init(); 
		    this.slide.init();
		    this.component.init();
		  },
		};

		$(document).ready(function(){
			setTimeout(function(){
		  		track.init();
			})
		}); 