import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { RestaurantListItem } from '@/components/RestaurantListItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Restaurant, useRestaurantLists } from '@/hooks/useRestaurantLists';

export default function ListasScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'favoritos' | 'porVisitar'>('favoritos');
  const [searchText, setSearchText] = useState('');
  
  const {
    lists,
    isLoading,
    removeFromFavorites,
    removeFromPorVisitar
  } = useRestaurantLists();

  // Filtrar restaurantes según el texto de búsqueda
  const filteredRestaurants = useMemo(() => {
    const currentList = activeTab === 'favoritos' ? lists.favoritos : lists.porVisitar;
    
    if (!searchText.trim()) {
      return currentList;
    }
    
    const searchLower = searchText.toLowerCase();
    const filtered = currentList.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchLower) ||
      (restaurant.address && restaurant.address.toLowerCase().includes(searchLower))
    );
    return filtered;
  }, [lists, activeTab, searchText]);

  const handleRestaurantPress = (restaurant: Restaurant) => {
    router.push({
      pathname: '/detalles_restaurante',
      params: { restaurant: JSON.stringify(restaurant) }
    });
  };

  const handleRemoveFromList = async (placeId: string) => {
    if (activeTab === 'favoritos') {
      await removeFromFavorites(placeId);
    } else {
      await removeFromPorVisitar(placeId);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.contentContainer}>
          <ThemedText style={styles.contentText}>Cargando listas...</ThemedText>
        </View>
      );
    }

    const currentList = activeTab === 'favoritos' ? lists.favoritos : lists.porVisitar;
    const filteredList = filteredRestaurants;

    if (currentList.length === 0) {
      return (
        <View style={styles.contentContainer}>
          <ThemedText style={styles.contentText}>
            No hay restaurantes en {activeTab === 'favoritos' ? 'Favoritos' : 'Por Visitar'}
          </ThemedText>
          <ThemedText style={styles.subtitleText}>
            Agrega restaurantes desde la pantalla de exploración
          </ThemedText>
        </View>
      );
    }

    if (filteredList.length === 0) {
      return (
        <View style={styles.contentContainer}>
          <ThemedText style={styles.contentText}>No se encontraron resultados</ThemedText>
          <ThemedText style={styles.subtitleText}>
            Intenta con otros términos de búsqueda
          </ThemedText>
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {filteredList.map((restaurant, index) => (
          <RestaurantListItem
            key={restaurant.placeId || index}
            restaurant={restaurant}
            listType={activeTab}
            onRemoveFromList={handleRemoveFromList}
            onPress={handleRestaurantPress}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Mis Listas</ThemedText>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar en la lista..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'favoritos' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('favoritos')}
        >
          <ThemedText
            style={[
              styles.tabButtonText,
              activeTab === 'favoritos' && styles.activeTabButtonText
            ]}
          >
            Favoritos ({lists.favoritos.length})
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'porVisitar' && styles.activeTabButton
          ]}
          onPress={() => setActiveTab('porVisitar')}
        >
          <ThemedText
            style={[
              styles.tabButtonText,
              activeTab === 'porVisitar' && styles.activeTabButtonText
            ]}
          >
            Por visitar ({lists.porVisitar.length})
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  searchContainer: {
    marginBottom: 20,
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
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    padding: 4,
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
  contentContainer: {
    flex: 1,
  },
  contentText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
  },
  subtitleText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
});
