import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, Vibration } from 'react-native';
import { ThemedText } from './ThemedText';

interface RestaurantActionButtonProps {
  restaurant: {
    name: string;
    rating: number;
    placeId: string;
    address?: string;
    phone?: string;
    website?: string;
  };
  isInFavorites: boolean;
  isInPorVisitar: boolean;
  onToggleFavorite: (restaurant: any) => Promise<void>;
  onTogglePorVisitar: (restaurant: any) => Promise<void>;
  size?: number;
}

export const RestaurantActionButton: React.FC<RestaurantActionButtonProps> = ({
  restaurant,
  isInFavorites,
  isInPorVisitar,
  onToggleFavorite,
  onTogglePorVisitar,
  size = 20
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const showActionMenu = () => {
    if (isLoading) return;
    
    // Vibración para feedback táctil
    Vibration.vibrate(50);
    
    Alert.alert(
      'Gestionar restaurante',
      `¿Qué quieres hacer con "${restaurant.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: isInFavorites ? 'Quitar de Favoritos' : 'Agregar a Favoritos',
          onPress: async () => {
            setIsLoading(true);
            try {
              await onToggleFavorite(restaurant);
              Vibration.vibrate(100); // Feedback de éxito
            } catch (error) {
              console.error('Error al cambiar favoritos:', error);
              Vibration.vibrate([100, 100, 100]); // Feedback de error
            } finally {
              setIsLoading(false);
            }
          }
        },
        {
          text: isInPorVisitar ? 'Quitar de Por Visitar' : 'Agregar a Por Visitar',
          onPress: async () => {
            setIsLoading(true);
            try {
              await onTogglePorVisitar(restaurant);
              Vibration.vibrate(100); // Feedback de éxito
            } catch (error) {
              console.error('Error al cambiar por visitar:', error);
              Vibration.vibrate([100, 100, 100]); // Feedback de error
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const getButtonColor = () => {
    if (isInFavorites && isInPorVisitar) {
      return '#FF6B6B'; // Rojo cuando está en ambas listas
    } else if (isInFavorites) {
      return '#FFD700'; // Dorado para favoritos
    } else if (isInPorVisitar) {
      return '#32CD32'; // Verde para por visitar
    } else {
      return '#4A90E2'; // Azul por defecto
    }
  };

  const getButtonText = () => {
    if (isInFavorites && isInPorVisitar) {
      return '★'; // Estrella cuando está en ambas listas
    } else if (isInFavorites) {
      return '★'; // Estrella para favoritos
    } else if (isInPorVisitar) {
      return '✓'; // Check para por visitar
    } else {
      return '+'; // Plus por defecto
    }
  };

  const getButtonDescription = () => {
    if (isInFavorites && isInPorVisitar) {
      return 'En ambas listas';
    } else if (isInFavorites) {
      return 'En favoritos';
    } else if (isInPorVisitar) {
      return 'Por visitar';
    } else {
      return 'Agregar a lista';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getButtonColor(),
          opacity: isLoading ? 0.6 : 1
        }
      ]}
      onPress={showActionMenu}
      onLongPress={showActionMenu}
      activeOpacity={0.7}
      disabled={isLoading}
      accessibilityLabel={getButtonDescription()}
      accessibilityHint="Toca para gestionar este restaurante en tus listas"
    >
      <ThemedText style={[styles.buttonText, { fontSize: size * 0.6 }]}>
        {getButtonText()}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
