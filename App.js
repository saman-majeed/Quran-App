import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import { SettingsProvider } from './screens/SettingsContext';
import ReadScreen from './screens/ReadScreen';
import SurahDetailScreen from './screens/SurahDetailScreen';
import SearchScreen from './screens/SearchScreen'; 
import BookmarkScreen from './screens/BookmarkScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SettingsProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={({ navigation }) => ({
              title: 'Quran App',
              headerRight: () => (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Search')} 
                  style={{ marginRight: 15 }}
                >
                  <Ionicons name="search" size={24} color="black" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search Surahs' }} />
          <Stack.Screen name="Read" component={ReadScreen} options={{ title: 'Read Surahs' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
          <Stack.Screen name="SurahDetail" component={SurahDetailScreen} options={{ title: 'Surah Details' }} />
          <Stack.Screen name="Bookmark" component={BookmarkScreen} />

          
        </Stack.Navigator>
      </NavigationContainer>
    </SettingsProvider>
  );
}






