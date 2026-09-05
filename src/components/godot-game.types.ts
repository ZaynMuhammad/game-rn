import type { ViewProps } from 'react-native';

export type GodotGameProps = ViewProps & {
  /** Name of the exported iOS PCK, without extension. */
  projectName: string;
  /** Start and stop the singleton Godot instance with this component's lifecycle. */
  autoStart?: boolean;
};
