// Fix OOM and native crashes in image capture & resizing on Android 13/14+ devices
const fs = require('fs');
const path = require('path');

try {
  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Patch react-native-image-resizer
  // ─────────────────────────────────────────────────────────────────────────────
  try {
    const resizerRoot = path.dirname(require.resolve('react-native-image-resizer/package.json'));

    // 1A. ImageResizerModule.java: catch Throwable instead of IOException in GuardedAsyncTask
    const moduleFile = path.join(
      resizerRoot,
      'android/src/main/java/fr/bamlab/rnimageresizer/ImageResizerModule.java'
    );
    if (fs.existsSync(moduleFile)) {
      let src = fs.readFileSync(moduleFile, 'utf8');
      const target = 'catch (IOException e) {\n                    failureCb.invoke(e.getMessage());\n                }';
      const replacement = 'catch (Throwable e) {\n                    failureCb.invoke(e.getMessage() != null ? e.getMessage() : "Image resizing failed");\n                }';
      if (src.includes(target)) {
        src = src.replace(target, replacement);
        fs.writeFileSync(moduleFile, src, 'utf8');
        console.log('[prepare-image-resizer] Patched ImageResizerModule.java to catch all Throwables');
      }
    }

    // 1B. ImageResizer.java: safe decoding with Throwable catch and recycle old bitmaps
    const resizerFile = path.join(
      resizerRoot,
      'android/src/main/java/fr/bamlab/rnimageresizer/ImageResizer.java'
    );
    if (fs.existsSync(resizerFile)) {
      let src = fs.readFileSync(resizerFile, 'utf8');

      // Fix recycle bug: "if (rotatedImage != rotatedImage)"
      if (src.includes('if (rotatedImage != rotatedImage)')) {
        src = src.replace(
          'if (rotatedImage != rotatedImage) {\n            sourceImage.recycle();\n        }',
          'if (rotatedImage != sourceImage && sourceImage != null) {\n            sourceImage.recycle();\n        }'
        );
        console.log('[prepare-image-resizer] Patched ImageResizer.java sourceImage recycling bug');
      }

      // Catch Throwable in loadBitmap file decode
      const targetDecodeFile = 'try {\n                sourceImage = BitmapFactory.decodeFile(imageUri.getPath(), options);\n            } catch (Exception e) {';
      const replacementDecodeFile = 'try {\n                sourceImage = BitmapFactory.decodeFile(imageUri.getPath(), options);\n            } catch (Throwable e) {';
      if (src.includes(targetDecodeFile)) {
        src = src.replace(targetDecodeFile, replacementDecodeFile);
        console.log('[prepare-image-resizer] Patched ImageResizer.java decodeFile Throwable');
      }

      // Catch Throwable in loadBitmap stream decode
      const targetDecodeStream = 'sourceImage = BitmapFactory.decodeStream(input, null, options);\n                input.close();';
      const replacementDecodeStream = 'try {\n                    sourceImage = BitmapFactory.decodeStream(input, null, options);\n                } catch (Throwable e) {\n                    throw new IOException("Error decoding image: " + e.getMessage());\n                } finally {\n                    try { input.close(); } catch (Exception ignored) {}\n                }';
      if (src.includes(targetDecodeStream)) {
        src = src.replace(targetDecodeStream, replacementDecodeStream);
        console.log('[prepare-image-resizer] Patched ImageResizer.java decodeStream Throwable');
      }

      fs.writeFileSync(resizerFile, src, 'utf8');
    }
  } catch (err) {
    console.warn('[prepare-image-resizer] Warning patching react-native-image-resizer:', err.message);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Patch react-native-image-picker
  // ─────────────────────────────────────────────────────────────────────────────
  try {
    const pickerRoot = path.dirname(require.resolve('react-native-image-picker/package.json'));

    // 2A. ImagePickerModuleImpl.java: catch Throwable in onAssetsObtained executor
    const implFile = path.join(
      pickerRoot,
      'android/src/main/java/com/imagepicker/ImagePickerModuleImpl.java'
    );
    if (fs.existsSync(implFile)) {
      let src = fs.readFileSync(implFile, 'utf8');
      const targetCatch = '} catch (RuntimeException exception) {\n                callback.invoke(getErrorMap(errOthers, exception.getMessage()));\n            }';
      const replacementCatch = '} catch (Throwable exception) {\n                callback.invoke(getErrorMap(errOthers, exception.getMessage() != null ? exception.getMessage() : "Photo capture failed"));\n            }';
      if (src.includes(targetCatch)) {
        src = src.replace(targetCatch, replacementCatch);
        fs.writeFileSync(implFile, src, 'utf8');
        console.log('[prepare-image-resizer] Patched ImagePickerModuleImpl.java onAssetsObtained Throwable');
      }
    }

    // 2B. Utils.java: downsample with inSampleSize before decodeStream and catch Throwable
    const utilsFile = path.join(
      pickerRoot,
      'android/src/main/java/com/imagepicker/Utils.java'
    );
    if (fs.existsSync(utilsFile)) {
      let src = fs.readFileSync(utilsFile, 'utf8');

      // Replace the full uncompressed decodeStream in resizeOrConvertImage
      const targetResizeBlock = `            try (InputStream imageStream = context.getContentResolver().openInputStream(uri)) {
                Bitmap b = BitmapFactory.decodeStream(imageStream);
                String originalOrientation = getOrientation(uri, context);

                if (needToSwapDimension(originalOrientation)) {
                    b = Bitmap.createScaledBitmap(b, newDimens[1], newDimens[0], true);
                } else {
                    b = Bitmap.createScaledBitmap(b, newDimens[0], newDimens[1], true);
                }

                File file = createFile(context, getFileTypeFromMime(mimeType));

                try (OutputStream os = context.getContentResolver().openOutputStream(Uri.fromFile(file))) {
                    b.compress(getBitmapCompressFormat(mimeType), targetQuality, os);
                }

                setOrientation(file, originalOrientation, context);

                deleteFile(uri);

                return Uri.fromFile(file);
            }

        } catch (Exception e) {`;

      const replacementResizeBlock = `            int inSampleSize = 1;
            if (origDimens[0] > 0 && origDimens[1] > 0 && (newDimens[0] > 0 || newDimens[1] > 0)) {
                int reqW = newDimens[0] > 0 ? newDimens[0] : origDimens[0];
                int reqH = newDimens[1] > 0 ? newDimens[1] : origDimens[1];
                int halfHeight = origDimens[1] / 2;
                int halfWidth = origDimens[0] / 2;
                while ((halfHeight / inSampleSize) >= reqH && (halfWidth / inSampleSize) >= reqW) {
                    inSampleSize *= 2;
                }
            }

            try (InputStream imageStream = context.getContentResolver().openInputStream(uri)) {
                BitmapFactory.Options decodeOptions = new BitmapFactory.Options();
                decodeOptions.inSampleSize = inSampleSize;
                Bitmap b = BitmapFactory.decodeStream(imageStream, null, decodeOptions);
                if (b == null) {
                    return uri;
                }
                String originalOrientation = getOrientation(uri, context);

                if (needToSwapDimension(originalOrientation)) {
                    b = Bitmap.createScaledBitmap(b, newDimens[1], newDimens[0], true);
                } else {
                    b = Bitmap.createScaledBitmap(b, newDimens[0], newDimens[1], true);
                }

                File file = createFile(context, getFileTypeFromMime(mimeType));

                try (OutputStream os = context.getContentResolver().openOutputStream(Uri.fromFile(file))) {
                    b.compress(getBitmapCompressFormat(mimeType), targetQuality, os);
                }

                setOrientation(file, originalOrientation, context);

                deleteFile(uri);

                return Uri.fromFile(file);
            }

        } catch (Throwable e) {`;

      if (src.includes(targetResizeBlock)) {
        src = src.replace(targetResizeBlock, replacementResizeBlock);
        fs.writeFileSync(utilsFile, src, 'utf8');
        console.log('[prepare-image-resizer] Patched Utils.java inSampleSize downsampling & Throwable catch');
      }
    }
  } catch (err) {
    console.warn('[prepare-image-resizer] Warning patching react-native-image-picker:', err.message);
  }

  console.log('[prepare-image-resizer] Done patching image capture & resizer native libraries.');
} catch (error) {
  console.warn('[prepare-image-resizer] Failed to patch:', error.message);
}

