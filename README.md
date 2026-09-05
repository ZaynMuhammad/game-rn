# Expo + React Native Godot

This iOS-only Expo project is configured to embed Godot with
[`@borndotcom/react-native-godot`](https://github.com/borndotcom/react-native-godot).

## Get started

1. Install dependencies

   The LibGodot downloader requires `curl` and `unzip` on your `PATH`.

   ```bash
   npm install
   ```

2. Export a Godot project.

   For a project named `main`, add the iOS export `main.pck` to the Xcode app target so it is copied
   into the application bundle. Generate the iOS native project first if it does not exist:

   ```bash
   npx expo prebuild --platform ios
   ```

3. Build the native development app

   ```bash
   npm run ios
   ```

4. Start Metro for the installed development build

   ```bash
   npm start
   ```

`react-native-godot` includes native code and does not work in Expo Go. Re-run the native build
after changing native dependencies.

## Render a Godot project

The platform-specific `GodotGame` component initializes Godot, renders its main window, and tears
down the singleton engine instance when it unmounts:

```tsx
import { GodotGame } from '@/components/godot-game';

export default function GameScreen() {
  return <GodotGame projectName="main" />;
}
```

The component expects `main.pck` in the iOS app bundle.

## Included tooling

- `npm run godot:download` downloads only the iOS LibGodot frameworks required by the native bridge.
- `npm install` also runs that download through `postinstall`, which keeps local and cloud builds
  reproducible.
- `babel.config.js` enables the React Native Worklets Core transform used by the Godot thread.
- Worklets Core is overridden to `1.6.3`, which includes the Hermes linker update required by
  React Native 0.82 and newer.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow Expo's step-by-step tutorial.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
