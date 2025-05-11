import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SettingsContext } from './SettingsContext';
import { useNavigation } from '@react-navigation/native';

export default function ReadScreen() {
  const { fontSize } = useContext(SettingsContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const getQuranFromApiAsync = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/quran/quran-simple');
        const json = await response.json();
        setData(json.data.surahs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getQuranFromApiAsync();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.surahHeading}>List of Surahs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.item} 
              onPress={() => {
                console.log("Navigating to SurahDetail with:", item.number); // Debugging
                navigation.navigate('SurahDetail', { surahNumber: item.number });
              }}
            >
              {/* Wrapping the names correctly in <Text> and checking for valid values */}
              <Text style={[styles.surahName, { fontSize }]}>
                {item.englishName || 'No Name Available'}
              </Text>
              <Text style={[styles.arabicName, { fontSize: fontSize - 2 }]}>
                {item.name || 'اسم السورة غير متوفر'}
              </Text>
              <Text style={[styles.translation, { fontSize: fontSize - 2 }]}>
                {item.englishNameTranslation || 'Translation not available'}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.number.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10, paddingTop: 20, backgroundColor: '#fff' },
  surahHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  item: { padding: 10, marginVertical: 5, backgroundColor: '#ddd', borderRadius: 10 },
  surahName: { fontWeight: 'bold' },
  arabicName: { fontWeight: 'bold', color: '#2C3E50' }, // Styling for the Arabic name
  translation: {},
});
