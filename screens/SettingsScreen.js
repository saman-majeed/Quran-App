import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { SettingsContext } from '../screens/SettingsContext';

export default function SettingsScreen() {
  const {
    fontSize,
    setFontSize,
    showEnglish,
    setShowEnglish,
    showUrdu,
    setShowUrdu,
    showTafseer,
    setShowTafseer,
  } = useContext(SettingsContext);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Font Size: {fontSize}</Text>
      <Slider
        style={styles.slider}
        minimumValue={12}
        maximumValue={30}
        step={1}
        value={fontSize}
        onValueChange={setFontSize}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#1E90FF"
      />

      <Text style={styles.label}>Show English Translation</Text>
      <Switch
        value={showEnglish}
        onValueChange={setShowEnglish}
      />

      <Text style={styles.label}>Show Urdu Translation</Text>
      <Switch
        value={showUrdu}
        onValueChange={setShowUrdu}
      />

      <Text style={styles.label}>Show Tafseer</Text>
      <Switch
        value={showTafseer}
        onValueChange={setShowTafseer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, marginVertical: 10 },
  slider: { width: '100%', height: 40 },
});
