import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { SettingsContext } from '../screens/SettingsContext';
import { Audio } from 'expo-av';
import { debounce } from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SurahDetailScreen({ route }) {
  const { surahNumber: initialSurahNumber, scrollToAyah } = route.params || {};
  const { fontSize, showEnglish, showUrdu, showTafseer } = useContext(SettingsContext);

  const [surahNumber, setSurahNumber] = useState(initialSurahNumber);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedAyah, setHighlightedAyah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [surahName, setSurahName] = useState('');

  const flatListRef = useRef(null);
  const soundRef = useRef(null);

  const saveLastRead = async (surahNumber, ayahNumber, surahName) => {
    try {
      const bookmark = {
        surahNumber,
        ayahNumber,
        surahName,
        timestamp: new Date().toISOString()
      };
      await AsyncStorage.setItem('lastReadAyah', JSON.stringify(bookmark));
    } catch (e) {
      console.error("Failed to save bookmark:", e);
    }
  };

  useEffect(() => {
    if (!surahNumber || surahNumber < 1 || surahNumber > 114) {
      setError("Invalid Surah Number.");
      setLoading(false);
      return;
    }

    const fetchSurahDetails = async () => {
      try {
        setLoading(true);
        const [resAr, resEn, resUr, resTaf] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ur.jalandhry`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/tafsseer`)
        ]);

        const [jsonAr, jsonEn, jsonUr, jsonTaf] = await Promise.all([
          resAr.json(), resEn.json(), resUr.json(), resTaf.json()
        ]);

        if ([jsonAr, jsonEn, jsonUr, jsonTaf].every(j => j.status === "OK")) {
          const merged = jsonAr.data.ayahs.map((ayah, i) => ({
            numberInSurah: ayah.numberInSurah,
            arabicText: ayah.text,
            englishText: jsonEn.data.ayahs[i]?.text || "Translation not available",
            urduText: jsonUr.data.ayahs[i]?.text || "ترجمہ دستیاب نہیں ہے",
            tafseerText: jsonTaf.data[i]?.text || "Tafseer not available",
            audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`
          }));

          setAyahs(merged);
          setSurahName(jsonAr.data.name);
        } else {
          setError("Failed to load Surah details.");
        }
      } catch {
        setError("Error fetching data. Check your internet connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurahDetails();

    return () => stopAudio();
  }, [surahNumber]);

  useEffect(() => {
    if (route.params?.scrollToAyah && ayahs.length > 0) {
      const index = ayahs.findIndex(a => a.numberInSurah === route.params.scrollToAyah);
      if (index !== -1) {
        flatListRef.current?.scrollToIndex({ index, animated: true });
        setHighlightedAyah(index);
      }
    }
  }, [ayahs]);

  useEffect(() => {
    if (!loading && ayahs.length > 0 && isPlaying) {
      playAudio(0);
    }
  }, [ayahs]);

  const stopAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
    setCurrentIndex(null);
    setHighlightedAyah(null);
  };

  const playAudio = async (index = 0) => {
    try {
      if (!ayahs[index]) return;
      await stopAudio();

      const { sound } = await Audio.Sound.createAsync(
        { uri: ayahs[index].audioUrl },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setIsPlaying(true);
      setCurrentIndex(index);
      setHighlightedAyah(index);
      await saveLastRead(surahNumber, ayahs[index].numberInSurah, surahName);
      flatListRef.current?.scrollToIndex({ index, animated: true });

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish && !status.isLooping) {
          const nextIndex = index + 1;
          if (nextIndex < ayahs.length) {
            await playAudio(nextIndex);
          } else {
            setIsPlaying(false);
            setHighlightedAyah(null);
            const nextSurah = surahNumber === 114 ? 1 : surahNumber + 1;
            setSurahNumber(nextSurah);
          }
        }
      });
    } catch (error) {
      console.log("Audio error:", error);
    }
  };

  const pauseAudio = async () => {
    if (soundRef.current && isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeAudio = async () => {
    if (soundRef.current && !isPlaying) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const startFromAyah = async (index) => {
    await stopAudio();
    await saveLastRead(surahNumber, ayahs[index].numberInSurah, surahName);
    await playAudio(index);
  };

  const navigateSurah = async (direction) => {
    await stopAudio();
    const next = direction === "next"
      ? (surahNumber === 114 ? 1 : surahNumber + 1)
      : (surahNumber === 1 ? 114 : surahNumber - 1);
    setSurahNumber(next);
  };

  const debouncedScrollToIndex = debounce((index) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }, 500);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.surahName}>{surahName}</Text>
          </View>

          <FlatList
            ref={flatListRef}
            data={ayahs}
            keyExtractor={(item) => item.numberInSurah.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => startFromAyah(index)}>
                <View style={[
                  styles.ayahContainer,
                  highlightedAyah === index && styles.highlight
                ]}>
                  <Text style={[styles.arabicText, { fontSize: fontSize + 6 }]}>{item.arabicText}</Text>
                  {showEnglish && <Text style={[styles.translationText, { fontSize }]}>{item.numberInSurah}. {item.englishText}</Text>}
                  {showUrdu && <Text style={[styles.translationText, { fontSize }]}>{item.urduText}</Text>}
                  {showTafseer && <Text style={[styles.translationText, { fontSize }]}>{item.tafseerText}</Text>}
                </View>
              </TouchableOpacity>
            )}
            getItemLayout={(_, index) => ({ length: 140, offset: 140 * index, index })}
            initialScrollIndex={0}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                debouncedScrollToIndex(info.index);
              }, 1000);
            }}
          />

          <View style={styles.controls}>
            <Button title="Previous Surah" onPress={() => navigateSurah("prev")} />
            <Button title={isPlaying ? "Pause" : "Play"} onPress={isPlaying ? pauseAudio : resumeAudio} />
            <Button title="Next Surah" onPress={() => navigateSurah("next")} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20, paddingHorizontal: 10 },
  header: { alignItems: 'center', marginBottom: 20 },
  surahName: { fontSize: 24, fontWeight: 'bold' },
  ayahContainer: { marginBottom: 10, padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  arabicText: { fontFamily: 'Scheherazade', textAlign: 'right' },
  translationText: { marginTop: 5, fontFamily: 'Arial' },
  highlight: { backgroundColor: '#ffeb3b' },
  controls: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 }
});
