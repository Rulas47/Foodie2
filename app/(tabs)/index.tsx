import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      
      {/* Header con saludo */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">¡Bienvenido a Foodie2! 🍽️</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Descripción general */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">¿Qué es Foodie2?</ThemedText>
        <ThemedText>
          Foodie2 es tu compañero perfecto para descubrir restaurantes increíbles cerca de ti. 
          Utiliza la tecnología de Google Maps para mostrarte las mejores opciones gastronómicas 
          en tu área y te permite organizarlas en listas personalizadas.
        </ThemedText>
      </ThemedView>

      {/* Funcionalidades principales */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">🚀 Funcionalidades Principales</ThemedText>
        
        <ThemedView style={styles.featureContainer}>
          <ThemedText style={styles.featureTitle}>🗺️ Exploración con Mapas</ThemedText>
          <ThemedText>
            • Visualiza restaurantes en un mapa interactivo{'\n'}
            • Búsqueda automática en tu área{'\n'}
            • Marcadores con información detallada{'\n'}
            • Navegación fluida por la ciudad
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.featureContainer}>
          <ThemedText style={styles.featureTitle}>📋 Gestión de Listas</ThemedText>
          <ThemedText>
            • Lista de restaurantes favoritos{'\n'}
            • Lista "Por Visitar" para futuras aventuras{'\n'}
            • Búsqueda y filtrado inteligente{'\n'}
            • Sincronización automática
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.featureContainer}>
          <ThemedText style={styles.featureTitle}>🍴 Información Detallada</ThemedText>
          <ThemedText>
            • Valoraciones y reseñas{'\n'}
            • Direcciones y horarios{'\n'}
            • Teléfonos con llamada directa{'\n'}
            • Sitios web integrados
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Guía de uso */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">📖 Guía de Uso</ThemedText>
        
        <ThemedView style={styles.stepContainer}>
          <ThemedText style={styles.stepNumber}>1</ThemedText>
          <ThemedView style={styles.stepContent}>
            <ThemedText style={styles.stepTitle}>Permisos de Ubicación</ThemedText>
            <ThemedText>
              La primera vez que abras la app, te pedirá acceso a tu ubicación. 
              Esto es necesario para mostrarte restaurantes cercanos.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText style={styles.stepNumber}>2</ThemedText>
          <ThemedView style={styles.stepContent}>
            <ThemedText style={styles.stepTitle}>Explorar Restaurantes</ThemedText>
            <ThemedText>
              Ve a la pestaña "Explorar" para ver el mapa. Los restaurantes aparecerán 
              automáticamente como marcadores rojos. Toca uno para ver detalles.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText style={styles.stepNumber}>3</ThemedText>
          <ThemedView style={styles.stepContent}>
            <ThemedText style={styles.stepTitle}>Organizar en Listas</ThemedText>
            <ThemedText>
              En los detalles del restaurante, usa el botón circular para agregarlo a 
              "Favoritos" o "Por Visitar". Puedes gestionar tus listas en la pestaña "Listas".
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText style={styles.stepNumber}>4</ThemedText>
          <ThemedView style={styles.stepContent}>
            <ThemedText style={styles.stepTitle}>Acciones Rápidas</ThemedText>
            <ThemedText>
              Desde los detalles, puedes llamar directamente al restaurante, 
              visitar su sitio web, o abrir su ubicación en Google Maps.
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Pestañas disponibles */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">📱 Pestañas Disponibles</ThemedText>
        
        <ThemedView style={styles.tabInfoContainer}>
          <ThemedView style={styles.tabInfo}>
            <ThemedText style={styles.tabTitle}>🏠 Inicio</ThemedText>
            <ThemedText style={styles.tabDescription}>
              Esta pantalla con información y guía de uso
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.tabInfo}>
            <ThemedText style={styles.tabTitle}>🗺️ Explorar</ThemedText>
            <ThemedText style={styles.tabDescription}>
              Mapa interactivo y lista de restaurantes cercanos
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.tabInfo}>
            <ThemedText style={styles.tabTitle}>📋 Listas</ThemedText>
            <ThemedText style={styles.tabDescription}>
              Gestiona tus restaurantes favoritos y por visitar
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      {/* Consejos y trucos */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">💡 Consejos y Trucos</ThemedText>
        
        <ThemedView style={styles.tipContainer}>
          <ThemedText style={styles.tipText}>
            🔍 <ThemedText style={styles.tipHighlight}>Búsqueda Eficiente:</ThemedText> 
            Cambia entre vista de mapa y lista para encontrar restaurantes más rápido.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.tipContainer}>
          <ThemedText style={styles.tipText}>
            📍 <ThemedText style={styles.tipHighlight}>Ubicación Precisa:</ThemedText> 
            Asegúrate de tener GPS activado para obtener mejores resultados.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.tipContainer}>
          <ThemedText style={styles.tipText}>
            ⭐ <ThemedText style={styles.tipHighlight}>Valoraciones:</ThemedText> 
            Los restaurantes con mejor puntuación aparecen primero en los resultados.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.tipContainer}>
          <ThemedText style={styles.tipText}>
            🔄 <ThemedText style={styles.tipHighlight}>Sincronización:</ThemedText> 
            Tus listas se guardan automáticamente y están disponibles offline.
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Información técnica */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">⚙️ Información Técnica</ThemedText>
        <ThemedText>
          <ThemedText style={styles.techHighlight}>Desarrollada con:</ThemedText>{'\n'}
          • React Native + Expo SDK 53{'\n'}
          • Google Maps API para mapas y lugares{'\n'}
          • AsyncStorage para persistencia local{'\n'}
          • Sistema de temas claro/oscuro automático{'\n'}
          • Navegación fluida con Expo Router
        </ThemedText>
      </ThemedView>



      {/* Footer */}
      <ThemedView style={styles.footerContainer}>
        <ThemedText style={styles.footerText}>
          ¡Disfruta explorando los mejores restaurantes de tu ciudad! 🎉
        </ThemedText>
        <ThemedText style={styles.footerSubtext}>
          Foodie2 - Tu guía gastronómica personal
        </ThemedText>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  sectionContainer: {
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  featureContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4A90E2',
  },
  stepContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    color: 'white',
    textAlign: 'center',
    lineHeight: 32,
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#4A90E2',
  },
  tabInfoContainer: {
    gap: 12,
  },
  tabInfo: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FFD700',
  },
  tabDescription: {
    fontSize: 14,
    color: '#999',
  },
  tipContainer: {
    backgroundColor: 'rgba(154, 205, 50, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#9ACD32',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipHighlight: {
    fontWeight: 'bold',
    color: '#9ACD32',
  },
  techHighlight: {
    fontWeight: 'bold',
    color: '#FF6B6B',
  },

  footerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 20,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#4A90E2',
  },
  footerSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
