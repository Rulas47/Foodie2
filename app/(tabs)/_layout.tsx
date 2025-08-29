import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 110,
              paddingBottom: 40,
            },
            android: {
              height: 110,
              paddingBottom: 40,
            },
            default: {
              height: 110,
              paddingBottom: 40,
            },
          }),
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '600',
            marginTop: 0,
            paddingTop: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
            paddingHorizontal: 4,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: () => null,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explorar',
            tabBarIcon: () => null,
          }}
        />
        <Tabs.Screen
          name="listas"
          options={{
            title: 'Listas',
            tabBarIcon: () => null,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
