const fs = require('fs');
const path = require('path');

const cameraSessionPath = path.resolve(
  __dirname,
  '../node_modules/react-native-vision-camera/android/src/main/java/com/mrousavy/camera/core/CameraSession.kt',
);

if (fs.existsSync(cameraSessionPath)) {
  let content = fs.readFileSync(cameraSessionPath, 'utf8');
  if (content.includes('override fun getLifecycle(): Lifecycle = lifecycleRegistry')) {
    content = content.replace(
      'override fun getLifecycle(): Lifecycle = lifecycleRegistry',
      'override val lifecycle: Lifecycle get() = lifecycleRegistry',
    );
    fs.writeFileSync(cameraSessionPath, content, 'utf8');
    console.log('[prepare-vision-camera] Patched CameraSession.kt lifecycle property for Kotlin 2.0');
  }
}

