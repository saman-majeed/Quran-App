import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookmarkScreen({ navigation }) {
  const [bookmark, setBookmark] = useState(null);

  useEffect(() => {
    const loadBookmark = async () => {
      try {
        const json = await AsyncStorage.getItem('lastReadAyah');
        if (json) {
          setBookmark(JSON.parse(json));
        }
      } catch (e) {
        console.error("Failed to load bookmark", e);
      }
    };
    loadBookmark();
  }, []);

  const handleGoToBookmark = () => {
    if (bookmark) {
      navigation.navigate('SurahDetail', {
        surahNumber: bookmark.surahNumber,
        scrollToAyah: bookmark.ayahNumber, // Fixed key
      });
    }
  };

  return (
    <View style={styles.container}>
      {bookmark ? (
        <TouchableOpacity onPress={handleGoToBookmark} style={styles.card}>
          <Text style={styles.title}>📖 Resume Reading</Text>
          <Text style={styles.info}>Surah: {bookmark.surahName || 'N/A'}</Text>
          <Text style={styles.info}>Ayah: {bookmark.ayahNumber}</Text>
          <Text style={styles.timestamp}>
            Saved on: {new Date(bookmark.timestamp).toLocaleString()}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.noBookmark}>No bookmark found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4' },
  card: {
    backgroundColor: '#2e86de',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  info: { fontSize: 16, color: '#fff', marginVertical: 2 },
  timestamp: { fontSize: 12, color: '#e0e0e0', marginTop: 8 },
  noBookmark: { fontSize: 16, color: '#555' },
});
