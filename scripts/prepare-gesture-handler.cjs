// Fix compatibility issues between react-native-gesture-handler and React Native 0.79
const fs = require('fs');
const path = require('path');

try {
  const root = path.dirname(require.resolve('react-native-gesture-handler/package.json'));

  // 1. Fix 'val cannot be reassigned' in Kotlin ViewManager
  const ktFile = path.join(
    root,
    'android/src/main/java/com/swmansion/gesturehandler/react/RNGestureHandlerRootViewManager.kt'
  );
  if (fs.existsSync(ktFile)) {
    let source = fs.readFileSync(ktFile, 'utf8');
    const target = 'view.pointerEvents = parsePointerEvents(pointerEventsStr)';
    const replacement = 'view.setPointerEvents(parsePointerEvents(pointerEventsStr))';
    if (source.includes(target)) {
      source = source.replace(target, replacement);
      fs.writeFileSync(ktFile, source, 'utf8');
      console.log('[prepare-gesture-handler] Patched RNGestureHandlerRootViewManager.kt');
    }
  }

  // 2. Fix 'Unknown prop type for ...: "undefined"' in Codegen specs for RN 0.79
  const specDirs = [
    path.join(root, 'src/specs'),
    path.join(root, 'lib/module/specs'),
    path.join(root, 'lib/commonjs/specs'),
  ];

  for (const dir of specDirs) {
    // RootView spec
    const rootViewSpec = path.join(dir, 'RNGestureHandlerRootViewNativeComponent.ts');
    if (fs.existsSync(rootViewSpec)) {
      let code = fs.readFileSync(rootViewSpec, 'utf8');
      if (code.includes('CodegenTypes.WithDefault')) {
        code = code.replace(/CodegenTypes\.WithDefault/g, 'WithDefault');
        code = code.replace(
          /import type\s*\{[^}]*CodegenTypes[^}]*\}\s*from\s*'react-native';/,
          "import type { HostComponent, ViewProps } from 'react-native';\nimport type { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';"
        );
        fs.writeFileSync(rootViewSpec, code, 'utf8');
        console.log(`[prepare-gesture-handler] Patched ${path.relative(root, rootViewSpec)}`);
      }
    }

    // Button spec
    const buttonSpec = path.join(dir, 'RNGestureHandlerButtonNativeComponent.ts');
    if (fs.existsSync(buttonSpec)) {
      let code = fs.readFileSync(buttonSpec, 'utf8');
      if (code.includes('CodegenTypes.')) {
        code = code.replace(/CodegenTypes\.(\w+)/g, '$1');
        code = code.replace(/CodegenTypes,\s*/, '');
        code = "import type { WithDefault, Int32, Float } from 'react-native/Libraries/Types/CodegenTypes';\n" + code;
        fs.writeFileSync(buttonSpec, code, 'utf8');
        console.log(`[prepare-gesture-handler] Patched ${path.relative(root, buttonSpec)}`);
      }
    }
  }

  // 3. Fix java sourceSets to include paper/src/main/java (NativeRNGestureHandlerModuleSpec.java)
  const gradleFile = path.join(root, 'android/build.gradle');
  if (fs.existsSync(gradleFile)) {
    let gradleSource = fs.readFileSync(gradleFile, 'utf8');
    const javaBlock = 'sourceSets.main {\n        java {';
    if (!gradleSource.includes(javaBlock)) {
      const gradleTarget = '    sourceSets.main {\n        kotlin {';
      const gradleReplacement = `    sourceSets.main {
        java {
            if (isNewArchitectureEnabled()) {
                srcDirs += 'fabric/src/main/java'
            } else {
                srcDirs += 'paper/src/main/java'
            }
        }
        kotlin {`;
      if (gradleSource.includes(gradleTarget)) {
        gradleSource = gradleSource.replace(gradleTarget, gradleReplacement);
        fs.writeFileSync(gradleFile, gradleSource, 'utf8');
        console.log('[prepare-gesture-handler] Patched android/build.gradle sourceSets.main.java');
      }
    }
  }
} catch (err) {
  console.warn('[prepare-gesture-handler] Could not patch react-native-gesture-handler:', err.message);
}
