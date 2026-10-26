import RNFS from 'react-native-fs';

/**
 * Automatically purges temporary camera and resized attendance images from cache
 * so the app never consumes excess storage on the user's device.
 */
export const cleanAttendanceImageCache = async () => {
  try {
    const cacheDir = RNFS.CachesDirectoryPath;
    const items = await RNFS.readDir(cacheDir);
    const now = Date.now();
    for (const item of items) {
      if (
        item.isFile() &&
        (item.name.endsWith('.jpg') || item.name.endsWith('.jpeg') || item.name.endsWith('.png'))
      ) {
        // Remove files that match camera picker or resizer, or older than 15 minutes
        const mtime = item.mtime ? new Date(item.mtime).getTime() : 0;
        if (
          now - mtime > 15 * 60 * 1000 ||
          item.name.startsWith('attendance-') ||
          item.name.startsWith('rn_image_picker') ||
          item.name.startsWith('photo-')
        ) {
          await RNFS.unlink(item.path).catch(() => {});
        }
      }
    }
  } catch (_) {
    // Silently ignore cache cleanup errors
  }
};

