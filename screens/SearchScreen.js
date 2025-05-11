import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOption, setSearchOption] = useState('entireQuran');

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        console.log('Fetching Surah List...');
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const json = await response.json();
        setSurahs(json.data);
        setFilteredSurahs(json.data);
        console.log('Fetched Surahs:', json.data.length);
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  const handleSearch = (text) => {
    setQuery(text);
    if (text.trim() === '') {
      setFilteredSurahs(surahs);
    } else {
      let filtered = [];
      switch (searchOption) {
        case 'entireQuran':
          filtered = surahs.filter((surah) =>
            surah.englishName.toLowerCase().includes(text.toLowerCase()) ||
            surah.name.toLowerCase().includes(text.toLowerCase())  // Search both English and Arabic names
          );
          break;
        case 'arabicText':
          filtered = surahs.filter((surah) =>
            surah.name.toLowerCase().includes(text.toLowerCase())  // Only Arabic name search
          );
          break;
        case 'translation':
          filtered = surahs.filter((surah) =>
            surah.englishNameTranslation.toLowerCase().includes(text.toLowerCase()) // Search translation
          );
          break;
        case 'tafseer':
          filtered = surahs.filter((surah) =>
            surah.tafseer && surah.tafseer.some(taf => taf.text.toLowerCase().includes(text.toLowerCase()))  // Search tafseer
          );
          break;
        case 'englishName':
          filtered = surahs.filter((surah) =>
            surah.englishName.toLowerCase().includes(text.toLowerCase())  // Only English name search
          );
          break;
        default:
          filtered = surahs;
          break;
      }
      setFilteredSurahs(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchOptionsContainer}>
        <Text>Search Option:</Text>
        <Picker
          selectedValue={searchOption}
          style={styles.picker}
          onValueChange={(itemValue) => setSearchOption(itemValue)}
        >
          <Picker.Item label="Search the Entire Quran" value="entireQuran" />
          <Picker.Item label="Search Arabic Text" value="arabicText" />
          <Picker.Item label="Search Translation" value="translation" />
          <Picker.Item label="Search Tafseer" value="tafseer" />
          <Picker.Item label="Search by English Name" value="englishName" />
        </Picker>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={query}
        onChangeText={handleSearch}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={filteredSurahs}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.surahItem} 
              onPress={() => navigation.navigate('SurahDetail', { surahNumber: item.number })}
            >
              <Text style={styles.surahName}>
                {item.name} ({item.englishName}) {/* Display Arabic and English names */}
              </Text>
              <Text style={styles.surahNameTranslation}>
                {item.englishNameTranslation} {/* Display English Translation */}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noResults}>No Surah found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  searchInput: { 
    height: 40, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    marginBottom: 10 
  },
  searchOptionsContainer: { marginBottom: 10 },
  picker: { height: 50, width: '100%' },
  surahItem: { padding: 10, backgroundColor: '#eee', marginVertical: 5, borderRadius: 5 },
  surahName: { fontWeight: 'bold' },
  surahNameTranslation: { fontStyle: 'italic', color: '#666' },
  noResults: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
});
