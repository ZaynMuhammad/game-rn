import { StyleSheet, Text, View } from 'react-native';

import type { GodotGameProps } from './godot-game.types';

export function startGodot(_projectName: string): Promise<void> {
  return Promise.reject(new Error('React Native Godot only supports Android and iOS.'));
}

export function stopGodot(): Promise<void> {
  return Promise.resolve();
}

export function GodotGame({ style, ...viewProps }: GodotGameProps) {
  return (
    <View {...viewProps} style={[styles.container, style]}>
      <Text style={styles.message}>Godot is available in Android and iOS development builds.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    padding: 16,
    textAlign: 'center',
  },
});
