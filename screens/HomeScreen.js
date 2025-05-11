import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';


export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request or any refresh operation
    setTimeout(() => {
      setRefreshing(false);
      // Optionally, you can add logic to fetch new data here
    }, 2000);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Top Section */}
      <View style={styles.boxone}>
        <Text style={styles.textonea}>QURAN</Text>
        <Image source={require('../assets/icons/quran.jpeg')} style={styles.image} />
        <Text style={styles.textoneb}>Read Quran</Text>
        <Text style={styles.textoneb}>بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ,</Text>
      </View>

      {/* Features Section */}
      <View style={styles.boxtwo}>
        <View style={styles.textContainer}>
          <Text style={styles.textviewtwo}>Features</Text>
        </View>

        {/* Read Button */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Read')}>
          <Image source={require('../assets/icons/read.jpeg')} style={styles.image1} />
          <Text style={styles.buttonText}>Read</Text>
        </TouchableOpacity>

        {/* Search Button */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search')}>
          <Image source={require('../assets/icons/search.jpeg')} style={styles.image1} />
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        {/* Bookmark Button */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Bookmark')}>
       <Image source={require('../assets/icons/save.jpeg')} style={styles.image1} />
        <Text style={styles.buttonText}>Bookmark</Text>
        </TouchableOpacity>
   

        {/* Settings Button */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
          <Image source={require('../assets/icons/setting.jpeg')} style={styles.image1} />
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  boxone: {
    flex: 0.40,
    backgroundColor: '#576ba6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  textonea: { color: 'white', fontWeight: 'bold', fontSize: 22 },
  textoneb: { color: 'white', fontSize: 14, marginTop: 5 },
  textContainer: { width: '100%', alignItems: 'center', marginVertical: 10 },
  boxtwo: {
    flex: 0.40,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  textviewtwo: { fontWeight: 'bold', color: '#000000', fontSize: 20, textAlign: 'center', marginBottom: 10 },
  image: { height: 100, width: 100, marginVertical: 5 },
  image1: { height: 60, width: 60, marginVertical: 5 },
  button: {
    width: 130,
    height: 130,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#aba2a2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: { fontSize: 14, color: '#333', fontWeight: '600', marginTop: 5 },
});
