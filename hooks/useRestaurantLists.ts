import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export interface Restaurant {
  name: string;
  rating: number;
  placeId: string;
  address?: string;
  phone?: string;
  website?: string;
}

export interface RestaurantLists {
  favoritos: Restaurant[];
  porVisitar: Restaurant[];
}

const STORAGE_KEY = 'restaurant_lists';

export const useRestaurantLists = () => {
  const [lists, setLists] = useState<RestaurantLists>({
    favoritos: [],
    porVisitar: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar listas desde AsyncStorage al inicializar
  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      const storedLists = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (storedLists) {
        const parsedLists = JSON.parse(storedLists);
        setLists(parsedLists);
      }
    } catch (error) {
      console.error('Error al cargar las listas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveLists = async (newLists: RestaurantLists) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLists));
      setLists(newLists);
    } catch (error) {
      console.error('Error al guardar las listas:', error);
    }
  };

  const addToFavorites = async (restaurant: Restaurant) => {
    const newLists = {
      ...lists,
      favoritos: [...lists.favoritos.filter(r => r.placeId !== restaurant.placeId), restaurant]
    };
    await saveLists(newLists);
  };

  const removeFromFavorites = async (placeId: string) => {
    const newLists = {
      ...lists,
      favoritos: lists.favoritos.filter(r => r.placeId !== placeId)
    };
    await saveLists(newLists);
  };

  const addToPorVisitar = async (restaurant: Restaurant) => {
    const newLists = {
      ...lists,
      porVisitar: [...lists.porVisitar.filter(r => r.placeId !== restaurant.placeId), restaurant]
    };
    await saveLists(newLists);
  };

  const removeFromPorVisitar = async (placeId: string) => {
    const newLists = {
      ...lists,
      porVisitar: lists.porVisitar.filter(r => r.placeId !== placeId)
    };
    await saveLists(newLists);
  };

  const isInFavorites = (placeId: string): boolean => {
    return lists.favoritos.some(r => r.placeId === placeId);
  };

  const isInPorVisitar = (placeId: string): boolean => {
    return lists.porVisitar.some(r => r.placeId === placeId);
  };

  const toggleFavorite = async (restaurant: Restaurant) => {
    
    if (isInFavorites(restaurant.placeId)) {
      await removeFromFavorites(restaurant.placeId);
    } else {
      await addToFavorites(restaurant);
    }
  };

  const togglePorVisitar = async (restaurant: Restaurant) => {
    
    if (isInPorVisitar(restaurant.placeId)) {
      await removeFromPorVisitar(restaurant.placeId);
    } else {
      await addToPorVisitar(restaurant);
    }
  };

  const clearAllLists = async () => {
    const newLists = { favoritos: [], porVisitar: [] };
    await saveLists(newLists);
  };

  return {
    lists,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    addToPorVisitar,
    removeFromPorVisitar,
    isInFavorites,
    isInPorVisitar,
    toggleFavorite,
    togglePorVisitar,
    clearAllLists,
    loadLists
  };
};
