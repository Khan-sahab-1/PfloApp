// sqlite-storage 6 ships an AGP 3 build file. Use the app's AGP and SDKs.
const fs = require('fs');
const path = require('path');
const root = path.dirname(require.resolve('react-native-sqlite-storage/package.json'));
for (const platform of ['android', 'android-native']) {
  const file = path.join(root, 'platforms', platform, 'build.gradle');
  let source = fs.readFileSync(file, 'utf8');
  const plugin = source.indexOf("apply plugin: 'com.android.library'");
  if (plugin < 0) { throw new Error('Unexpected SQLite Android build file'); }
  source = source.slice(plugin);
  if (!source.includes("namespace 'org.pgsqlite'")) {
    source = source.replace('android {', "android {\n    namespace 'org.pgsqlite'");
  }
  fs.writeFileSync(file, source);
}
for (const platform of ['android', 'android-native']) {
  const manifest = path.join(root, 'platforms', platform, 'src/main/AndroidManifest.xml');
  fs.writeFileSync(manifest, fs.readFileSync(manifest, 'utf8').replace(/ package="org.pgsqlite"/g, ''));
}
