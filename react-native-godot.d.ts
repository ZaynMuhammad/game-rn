declare module '@borndotcom/react-native-godot' {
  import type { HostComponent, ViewProps } from 'react-native';

  export interface GodotModule {
    createInstance(args: string[]): any;
    getInstance(): any;
    API(): any;
    updateWindow(windowName: string): any;
    pause(): void;
    resume(): void;
    is_paused(): boolean;
    runOnGodotThread<T>(worklet: () => T): Promise<T>;
    destroyInstance(): void;
    crash(): void;
  }

  export interface GodotViewProps extends ViewProps {
    windowName?: string;
  }

  export const RTNGodot: GodotModule;
  export const RTNGodotView: HostComponent<GodotViewProps>;
  export function runOnGodotThread<T>(worklet: () => T): Promise<T>;
}
