import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface RestaurantListItemProps {
  restaurant: {
    name: string;
    rating: number;
    placeId: string;
    address?: string;
    phone?: string;
    website?: string;
  };
  listType: 'favoritos' | 'porVisitar';
  onRemoveFromList: (placeId: string) => Promise<void>;
  onPress: (restaurant: any) => void;
}

export const RestaurantListItem: React.FC<RestaurantListItemProps> = ({
  restaurant,
  listType,
  onRemoveFromList,
  onPress
}) => {
  const handleRemove = () => {
    Alert.alert(
      'Quitar de lista',
      `¿Quieres quitar "${restaurant.name}" de ${listType === 'favoritos' ? 'Favoritos' : 'Por Visitar'}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Quitar',
          style: 'destructive',
          onPress: () => onRemoveFromList(restaurant.placeId)
        }
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(restaurant)}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.info}>
          <ThemedText style={styles.name}>{restaurant.name}</ThemedText>
          {restaurant.address && (
            <ThemedText style={styles.address}>{restaurant.address}</ThemedText>
          )}
          <View style={styles.ratingContainer}>
            <ThemedText style={styles.starIcon}>⭐</ThemedText>
            <ThemedText style={styles.rating}>
              {restaurant.rating > 0 ? restaurant.rating.toFixed(1) : 'Sin valoración'}
            </ThemedText>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemove}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.removeButtonText}>✕</ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  content: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#ffffff',
  },
  address: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starIcon: {
    fontSize: 14,
  },
  rating: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
