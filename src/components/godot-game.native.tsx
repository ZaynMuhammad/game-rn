import 'setimmediate';

import {
  RTNGodot,
  RTNGodotView,
  runOnGodotThread,
} from '@borndotcom/react-native-godot';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';

import type { GodotGameProps } from './godot-game.types';

export function startGodot(projectName: string) {
  if (RTNGodot.getInstance() != null) {
    return Promise.resolve();
  }

  if (Platform.OS === 'ios' && FileSystem.bundleDirectory == null) {
    return Promise.reject(new Error('The iOS application bundle directory is unavailable.'));
  }

  return runOnGodotThread(() => {
    'worklet';

    if (Platform.OS === 'android') {
      RTNGodot.createInstance([
        '--path',
        `/${projectName}`,
        '--rendering-driver',
        'opengl3',
        '--rendering-method',
        'gl_compatibility',
        '--display-driver',
        'embedded',
      ]);
      return;
    }

    const args = [
      '--main-pack',
      `${FileSystem.bundleDirectory}${projectName}.pck`,
      '--display-driver',
      'embedded',
    ];

    if (Device.isDevice) {
      args.push('--rendering-driver', 'opengl3', '--rendering-method', 'gl_compatibility');
    } else {
      args.push('--rendering-driver', 'metal', '--rendering-method', 'mobile');
    }

    RTNGodot.createInstance(args);
  });
}

export function stopGodot() {
  if (RTNGodot.getInstance() == null) {
    return Promise.resolve();
  }

  return runOnGodotThread(() => {
    'worklet';
    RTNGodot.destroyInstance();
  });
}

export function GodotGame({ projectName, autoStart = true, style, ...viewProps }: GodotGameProps) {
  useEffect(() => {
    if (!autoStart) {
      return;
    }

    const ownsInstance = RTNGodot.getInstance() == null;
    void startGodot(projectName).catch((error: unknown) => {
      console.error('Unable to start Godot:', error);
    });

    return () => {
      if (ownsInstance) {
        void stopGodot();
      }
    };
  }, [autoStart, projectName]);

  return <RTNGodotView {...viewProps} style={[styles.view, style]} />;
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});
