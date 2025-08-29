import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface Restaurant {
  name: string;
  rating: number;
  placeId: string;
  address?: string;
  phone?: string;
  website?: string;
}

export default function ExploreScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'mapa' | 'lista'>('mapa');
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState<{north: number, south: number, east: number, west: number} | null>(null);
  const [restaurantCount, setRestaurantCount] = useState<number>(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        console.log('Solicitando permisos de ubicación...');
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log('Estado del permiso:', status);
        
        if (status !== 'granted') {
          setErrorMsg('Se requiere permiso para acceder a la ubicación');
          Alert.alert('Permiso denegado', 'Se requiere permiso para acceder a la ubicación');
          setIsLoading(false);
          return;
        }

        console.log('Obteniendo ubicación actual...');
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        console.log('Ubicación obtenida:', currentLocation);
        setLocation(currentLocation);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener ubicación:', error);
        setErrorMsg(`Error al obtener ubicación: ${error}`);
        setIsLoading(false);
      }
    })();
  }, []);

  const openInMaps = async () => {
    if (location) {
      try {
        const url = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
        await Linking.openURL(url);
      } catch (error) {
        console.error('Error al abrir mapa:', error);
        Alert.alert('Error', 'No se pudo abrir el mapa');
      }
    }
  };

  const getMapHtml = () => {
    if (!location) return '';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin: 0; padding: 0; }
            #map { width: 100%; height: 100vh; }
            
            /* Ocultar elementos de Google Maps */
            .gmnoprint, .gm-style-cc, .gm-style-moc, .gm-style-pbc, .gm-style-iw-d, .gm-style-iw-c, .gm-style-iw-t::after {
              display: none !important;
            }
            
            /* Ocultar controles de mapa */
            .gm-control-active, .gm-svpc, .gm-style-mtc, .gm-style-cc, .gm-style-moc, .gm-style-pbc {
              display: none !important;
            }
            
            /* Ocultar texto de Google */
            .gm-style a[href^="https://maps.google.com/maps"] {
              display: none !important;
            }
            
            /* Ocultar términos y condiciones */
            .gm-style-cc, .gm-style-moc, .gm-style-pbc {
              display: none !important;
            }
            
            /* Ocultar botones de Street View */
            .gm-style-sv, .gm-style-sv-label {
              display: none !important;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            let map;
            let markers = [];
            let currentBounds = null;
            
            function initMap() {
              map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: ${location.coords.latitude}, lng: ${location.coords.longitude} },
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: false,
                styles: [
                  {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [
                      { visibility: 'off' }
                    ]
                  },
                  {
                    featureType: 'poi.business',
                    elementType: 'labels',
                    stylers: [
                      { visibility: 'off' }
                    ]
                  }
                ]
              });
              
              // Marcador de tu ubicación
              new google.maps.Marker({
                position: { lat: ${location.coords.latitude}, lng: ${location.coords.longitude} },
                map: map,
                title: 'Tu ubicación',
                label: 'Tú',
                icon: {
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23007AFF"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
                  scaledSize: new google.maps.Size(40, 40)
                }
              });

              // Cargar restaurantes iniciales
              loadRestaurantsInBounds();
              
              // Agregar listeners para detectar cambios en la vista del mapa
              map.addListener('bounds_changed', function() {
                setTimeout(() => {
                  const bounds = map.getBounds();
                  if (bounds) {
                    const newBounds = {
                      north: bounds.getNorthEast().lat(),
                      south: bounds.getSouthWest().lat(),
                      east: bounds.getNorthEast().lng(),
                      west: bounds.getSouthWest().lng()
                    };
                    
                    // Verificar si los bounds han cambiado significativamente
                    if (!currentBounds || 
                        Math.abs(newBounds.north - currentBounds.north) > 0.01 ||
                        Math.abs(newBounds.south - currentBounds.south) > 0.01 ||
                        Math.abs(newBounds.east - currentBounds.east) > 0.01 ||
                        Math.abs(newBounds.west - currentBounds.west) > 0.01) {
                      
                      currentBounds = newBounds;
                      
                      // Enviar los nuevos bounds a React Native
                      if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'bounds_changed',
                          bounds: newBounds
                        }));
                      }
                      
                      // Recargar restaurantes en la nueva zona
                      loadRestaurantsInBounds();
                    }
                  }
                }, 500); // Delay para evitar demasiadas llamadas
              });
            }
            
            function loadRestaurantsInBounds() {
              // Limpiar marcadores existentes
              markers.forEach(marker => marker.setMap(null));
              markers = [];
              
              if (!map) return;
              
              const bounds = map.getBounds();
              if (!bounds) return;
              
              const center = map.getCenter();
              const service = new google.maps.places.PlacesService(map);
              
              // Búsqueda inicial en el centro
              const centerRequest = {
                location: center,
                radius: 2000,
                type: 'restaurant',
                maxResults: 30
              };
              
              service.nearbySearch(centerRequest, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                  const allRestaurants = [];
                  
                  results.forEach(place => {
                    const marker = new google.maps.Marker({
                      position: place.geometry.location,
                      map: map,
                      title: place.name,
                      icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
                        scaledSize: new google.maps.Size(30, 30)
                      }
                    });
                    
                    // Agregar listener de clic al marcador
                    marker.addListener('click', function() {
                      const restaurantInfo = {
                        name: place.name,
                        rating: place.rating || 0,
                        placeId: place.place_id,
                        address: place.vicinity
                      };
                      
                      // Enviar información del restaurante a React Native
                      if (window.ReactNativeWebView) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'restaurant_selected',
                          restaurant: restaurantInfo
                        }));
                      }
                      
                      // Obtener detalles completos del restaurante
                      const detailsRequest = {
                        placeId: place.place_id,
                        fields: ['name', 'rating', 'formatted_address', 'formatted_phone_number', 'website']
                      };
                      
                      service.getDetails(detailsRequest, (detailsResult, detailsStatus) => {
                        if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && detailsResult) {
                          const detailedRestaurant = {
                            name: detailsResult.name || place.name,
                            rating: detailsResult.rating || place.rating || 0,
                            placeId: place.place_id,
                            address: detailsResult.formatted_address || place.vicinity,
                            phone: detailsResult.formatted_phone_number,
                            website: detailsResult.website
                          };
                          
                          // Enviar detalles completos a React Native
                          if (window.ReactNativeWebView) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                              type: 'restaurant_details',
                              restaurant: detailedRestaurant
                            }));
                          }
                        }
                      });
                    });
                    
                    markers.push(marker);
                    
                    // Agregar a la lista de restaurantes
                    allRestaurants.push({
                      name: place.name,
                      rating: place.rating || 0,
                      placeId: place.place_id,
                      address: place.vicinity
                    });
                  });
                  
                  // Enviar conteo inicial a React Native
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'restaurant_count',
                      count: markers.length
                    }));
                    
                    // Enviar lista completa de restaurantes
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'restaurants_loaded',
                      restaurants: allRestaurants
                    }));
                  }
                }
                
                // Búsqueda adicional en las esquinas del mapa para cubrir toda el área visible
                const corners = [
                  bounds.getNorthEast(),
                  bounds.getNorthWest(),
                  bounds.getSouthEast(),
                  bounds.getSouthWest()
                ];
                
                corners.forEach((corner, index) => {
                  setTimeout(() => {
                    const cornerRequest = {
                      location: corner,
                      radius: 1000,
                      type: 'restaurant',
                      maxResults: 15
                    };
                    
                    service.nearbySearch(cornerRequest, (cornerResults, cornerStatus) => {
                      if (cornerStatus === google.maps.places.PlacesServiceStatus.OK && cornerResults) {
                        cornerResults.forEach(place => {
                          // Verificar si ya existe un marcador en esta ubicación
                          const exists = markers.some(marker => 
                            Math.abs(marker.getPosition().lat() - place.geometry.location.lat()) < 0.0001 &&
                            Math.abs(marker.getPosition().lng() - place.geometry.location.lng()) < 0.0001
                          );
                          
                          if (!exists && markers.length < 30) {
                            const marker = new google.maps.Marker({
                              position: place.geometry.location,
                              map: map,
                              title: place.name,
                              icon: {
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red"><path d="M12 2C8.13 2 5 5.13 5 9c0 3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'),
                                scaledSize: new google.maps.Size(30, 30)
                              }
                            });
                            
                            // Agregar listener de clic al marcador
                            marker.addListener('click', function() {
                              const restaurantInfo = {
                                name: place.name,
                                rating: place.rating || 0,
                                placeId: place.place_id,
                                address: place.vicinity
                              };
                              
                              // Enviar información del restaurante a React Native
                              if (window.ReactNativeWebView) {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                  type: 'restaurant_selected',
                                  restaurant: restaurantInfo
                                }));
                              }
                              
                              // Obtener detalles completos del restaurante
                              const detailsRequest = {
                                placeId: place.place_id,
                                fields: ['name', 'rating', 'formatted_address', 'formatted_phone_number', 'website']
                              };
                              
                              service.getDetails(detailsRequest, (detailsResult, detailsStatus) => {
                                if (detailsStatus === google.maps.places.PlacesServiceStatus.OK && detailsResult) {
                                  const detailedRestaurant = {
                                    name: detailsResult.name || place.name,
                                    rating: detailsResult.rating || place.rating || 0,
                                    placeId: place.place_id,
                                    address: detailsResult.formatted_address || place.vicinity,
                                    phone: detailsResult.formatted_phone_number,
                                    website: detailsResult.website
                                  };
                                  
                                  // Enviar detalles completos a React Native
                                  if (window.ReactNativeWebView) {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({
                                      type: 'restaurant_details',
                                      restaurant: detailedRestaurant
                                    }));
                                  }
                                }
                              });
                            });
                            
                            markers.push(marker);
                            
                            // Agregar a la lista de restaurantes si no existe
                            const restaurantExists = allRestaurants.some(r => r.placeId === place.place_id);
                            if (!restaurantExists) {
                              allRestaurants.push({
                                name: place.name,
                                rating: place.rating || 0,
                                placeId: place.place_id,
                                address: place.vicinity
                              });
                            }
                            
                            // Enviar conteo actualizado a React Native
                            if (window.ReactNativeWebView) {
                              window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'restaurant_count',
                                count: markers.length
                              }));
                              
                              // Enviar lista actualizada de restaurantes
                              window.ReactNativeWebView.postMessage(JSON.stringify({
                                type: 'restaurants_loaded',
                                restaurants: allRestaurants
                              }));
                            }
                          }
                        });
                      }
                    });
                  }, index * 200); // Delay escalonado para evitar límites de API
                });
              });
            }
            
            // Función para recargar restaurantes manualmente
            function reloadRestaurants() {
              loadRestaurantsInBounds();
            }
            
            // Exponer función globalmente
            window.reloadRestaurants = reloadRestaurants;
            
            // Listener para mensajes de React Native
            window.addEventListener('message', function(event) {
              try {
                const data = JSON.parse(event.data);
                if (data.type === 'reload_markers') {
                  console.log('Recargando marcadores...');
                  loadRestaurantsInBounds();
                }
              } catch (error) {
                console.error('Error al procesar mensaje:', error);
              }
            });
          </script>
          <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD7kzNEvIn1Ut3eOrxHE18k0KGXLgDU7Vs&libraries=places&callback=initMap"></script>
        </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'bounds_changed') {
        setMapBounds(data.bounds);
        console.log('Nuevos bounds del mapa:', data.bounds);
      } else if (data.type === 'restaurant_count') {
        setRestaurantCount(data.count);
        console.log('Restaurantes cargados:', data.count);
      } else if (data.type === 'restaurant_selected') {
        setSelectedRestaurant(data.restaurant);
        console.log('Restaurante seleccionado:', data.restaurant);
      } else if (data.type === 'restaurants_loaded') {
        setRestaurants(data.restaurants || []);
        console.log('Lista de restaurantes actualizada:', data.restaurants?.length || 0);
      } else if (data.type === 'restaurant_details') {
        // Actualizar restaurante con detalles completos
        const updatedRestaurant = data.restaurant;
        setSelectedRestaurant(updatedRestaurant);
        
        // Actualizar también en la lista
        setRestaurants(prev => 
          prev.map(r => 
            r.placeId === updatedRestaurant.placeId ? updatedRestaurant : r
          )
        );
        
        console.log('Detalles del restaurante cargados:', updatedRestaurant);
      }
    } catch (error) {
      console.error('Error al procesar mensaje del WebView:', error);
    }
  };

  const reloadMapMarkers = () => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'reload_markers'
      }));
    }
  };

  const loadRestaurantsForList = () => {
    if (webViewRef.current && restaurants.length === 0) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'reload_markers'
      }));
    }
  };

  const navigateToRestaurantDetails = (restaurant: Restaurant) => {
    router.push({
      pathname: '/detalles_restaurante',
      params: { restaurant: JSON.stringify(restaurant) }
    });
  };

  const renderMapContent = () => {
    if (isLoading) {
      return (
        <View style={styles.mapContainer}>
          <ThemedText style={styles.loadingText}>Obteniendo ubicación...</ThemedText>
          <Text style={styles.debugText}>Estado: Cargando...</Text>
        </View>
      );
    }

    if (errorMsg) {
      return (
        <View style={styles.mapContainer}>
          <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
          <Text style={styles.debugText}>Error detectado</Text>
        </View>
      );
    }

    if (!location) {
      return (
        <View style={styles.mapContainer}>
          <ThemedText style={styles.loadingText}>No se pudo obtener la ubicación</ThemedText>
          <Text style={styles.debugText}>Estado: Sin ubicación</Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: getMapHtml() }}
            style={styles.map}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            onMessage={handleWebViewMessage}
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <Text style={styles.loadingText}>Cargando mapa...</Text>
              </View>
            )}
          />
        </View>
        
        {/* Viñeta del restaurante seleccionado */}
        {selectedRestaurant && (
          <TouchableOpacity 
            style={styles.restaurantCard}
            onPress={() => navigateToRestaurantDetails(selectedRestaurant)}
            activeOpacity={0.8}
          >
            <View style={styles.restaurantHeader}>
              <ThemedText style={styles.restaurantName}>{selectedRestaurant.name}</ThemedText>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedRestaurant(null)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.restaurantInfo}>
              <View style={styles.ratingContainer}>
                <Text style={styles.starIcon}>⭐</Text>
                <ThemedText style={styles.ratingText}>
                  {selectedRestaurant.rating > 0 ? selectedRestaurant.rating.toFixed(1) : 'Sin valoración'}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderListContent = () => {
    if (isLoading) {
      return (
        <View style={styles.contentContainer}>
          <ThemedText style={styles.loadingText}>Obteniendo ubicación...</ThemedText>
        </View>
      );
    }

    if (errorMsg) {
      return (
        <View style={styles.contentContainer}>
          <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
        </View>
      );
    }

    if (!location) {
      return (
        <View style={styles.contentContainer}>
          <ThemedText style={styles.loadingText}>No se pudo obtener la ubicación</ThemedText>
        </View>
      );
    }

    if (restaurants.length === 0) {
      return (
        <View style={styles.contentContainer}>
          <ThemedText style={styles.contentText}>Cargando restaurantes...</ThemedText>
          <ThemedText style={styles.subtitleText}>Cambia al tab Mapa para cargar restaurantes</ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          {restaurants.map((restaurant, index) => (
            <TouchableOpacity 
              key={restaurant.placeId || index} 
              style={styles.restaurantItem}
              onPress={() => navigateToRestaurantDetails(restaurant)}
              activeOpacity={0.8}
            >
              <View style={styles.restaurantItemContent}>
                <View style={styles.restaurantItemInfo}>
                  <ThemedText style={styles.restaurantItemName}>{restaurant.name}</ThemedText>
                  {restaurant.address && (
                    <ThemedText style={styles.restaurantAddress}>{restaurant.address}</ThemedText>
                  )}
                </View>
                
                <View style={styles.ratingContainer}>
                  <Text style={styles.starIcon}>⭐</Text>
                  <ThemedText style={styles.ratingText}>
                    {restaurant.rating > 0 ? restaurant.rating.toFixed(1) : 'Sin valoración'}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'mapa':
        return renderMapContent();
      case 'lista':
        return renderListContent();
      default:
        return renderMapContent();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'mapa' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('mapa')}
        >
          <ThemedText
            style={[
              styles.tabButtonText,
              activeTab === 'mapa' && styles.activeTabButtonText
            ]}
          >
            Mapa
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'lista' && styles.activeTabButton
          ]}
          onPress={() => {
            setActiveTab('lista');
            if (restaurants.length === 0) {
              loadRestaurantsForList();
            }
          }}
        >
          <ThemedText
            style={[
              styles.tabButtonText,
              activeTab === 'lista' && styles.activeTabButtonText
            ]}
          >
            Lista
          </ThemedText>
        </TouchableOpacity>
      </View>

      {activeTab === 'lista' && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      )}

      {renderContent()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 20,
    marginTop: 20,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 0,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    padding: 4,
    zIndex: 10,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#4A90E2',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  mapContainer: {
    flex: 1,
    borderRadius: 0,
    overflow: 'hidden',
    marginBottom: 0,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    marginTop: 50,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  debugText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'gray',
    marginTop: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  restaurantCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  restaurantInfo: {
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starIcon: {
    fontSize: 16,
  },
  ratingText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  tapToViewText: {
    fontSize: 14,
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  subtitleText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  restaurantCount: {
    fontSize: 14,
    color: '#666',
  },
  restaurantItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  restaurantItemContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  restaurantItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#999',
  },
  restaurantItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  restaurantCardActions: {
    marginTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
});
