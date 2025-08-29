import { RestaurantActionButton } from '@/components/RestaurantActionButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRestaurantLists } from '@/hooks/useRestaurantLists';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

interface RestaurantDetails {
  name: string;
  address?: string;
  rating: number;
  phone?: string;
  website?: string;
  placeId: string;
}

export default function DetallesRestauranteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    isInFavorites,
    isInPorVisitar,
    toggleFavorite,
    togglePorVisitar
  } = useRestaurantLists();

  // Memoizar los parámetros para evitar re-renders innecesarios
  const restaurantParam = useMemo(() => {
    return params.restaurant;
  }, [params.restaurant]);

  useEffect(() => {
    // Verificar que realmente hay parámetros y que no se han procesado ya
    if (restaurantParam && !restaurant && isLoading) {
      try {
        const restaurantData = JSON.parse(restaurantParam as string);
        setRestaurant(restaurantData);
      } catch (error) {
        console.error('Error al parsear datos del restaurante:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos del restaurante');
      } finally {
        setIsLoading(false);
      }
    } else if (!restaurantParam && isLoading) {
      setIsLoading(false);
    }
  }, [restaurantParam, restaurant, isLoading]);

  const handleCall = async () => {
    if (!restaurant?.phone) {
      Alert.alert('Error', 'No hay número de teléfono disponible');
      return;
    }

    try {
      const phoneNumber = restaurant.phone.startsWith('+') ? restaurant.phone : `+${restaurant.phone}`;
      await Linking.openURL(`tel:${phoneNumber}`);
    } catch (error) {
      console.error('Error al abrir teléfono:', error);
      Alert.alert('Error', 'No se pudo abrir la aplicación de teléfono');
    }
  };

  const handleWebsite = async () => {
    if (!restaurant?.website) {
      Alert.alert('Error', 'No hay sitio web disponible');
      return;
    }

    try {
      let url = restaurant.website;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error al abrir sitio web:', error);
      Alert.alert('Error', 'No se pudo abrir el sitio web');
    }
  };

  const goBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Cargando...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!restaurant) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>No se encontró el restaurante</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tarjeta de nombre y valoración */}
        <View style={styles.card}>
          <View style={styles.nameRatingContainer}>
            <View style={styles.nameContainer}>
              <ThemedText style={styles.restaurantName}>{restaurant.name}</ThemedText>
            </View>
            <RestaurantActionButton
              restaurant={restaurant}
              isInFavorites={isInFavorites(restaurant.placeId)}
              isInPorVisitar={isInPorVisitar(restaurant.placeId)}
              onToggleFavorite={toggleFavorite}
              onTogglePorVisitar={togglePorVisitar}
              size={24}
            />
          </View>
          <View style={styles.ratingBadge}>
            <ThemedText style={styles.ratingText}>
              {restaurant.rating > 0 ? restaurant.rating.toFixed(1) : 'N/A'}
            </ThemedText>
          </View>
        </View>

        {/* Tarjeta de dirección */}
        {restaurant.address && (
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Dirección</ThemedText>
            <ThemedText style={styles.cardContent}>{restaurant.address}</ThemedText>
          </View>
        )}

        {/* Tarjeta de teléfono */}
        {restaurant.phone && (
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Teléfono</ThemedText>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <ThemedText style={styles.actionButtonText}>{restaurant.phone}</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Tarjeta de sitio web */}
        {restaurant.website && (
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Sitio Web</ThemedText>
            <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
              <ThemedText style={styles.actionButtonText}>Visitar Sitio Web</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {!restaurant.phone && !restaurant.website && (
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Información</ThemedText>
            <ThemedText style={styles.cardContent}>
              No hay información de contacto disponible
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  nameRatingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  nameContainer: {
    flex: 1,
    marginRight: 16,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 26,
  },
  blueCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4A90E2',
  },
  ratingBadge: {
    backgroundColor: '#9ACD32',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 22,
  },
  actionButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
