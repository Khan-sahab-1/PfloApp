


import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  PermissionsAndroid, Platform
} from 'react-native';
import {COLORS} from '../../../styles/Colors';
import HeaderCompo from '../../../components/HeaderCompo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {AuthContext} from '../../../Screens/Context';
// import DocumentPicker from 'react-native-document-picker';
import {pick} from '@react-native-documents/picker';
import urls from '../../../../url';
import makeApiCall from '../../../utils/apiHelper';
import {showFlashMessage} from '../../../utils/fleshmessage';


const Attachmentscreen = ({navigation, route}) => {
  const routedata = route?.params?.data || [];
  const {id} = route?.params;
  const {Enquery} = route?.params;
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const contextType = useContext(AuthContext);
  const server_origin = contextType.currentUrl;

  const getFileIcon = mimeType => {
    if (mimeType?.startsWith('image/')) return 'image';
    if (mimeType?.startsWith('application/pdf')) return 'picture-as-pdf';
    if (mimeType?.includes('text/')) return 'text-fields';
    if (
      mimeType?.includes('application/msword') ||
      mimeType?.includes('application/vnd.openxmlformats-officedocument')
    ) return 'description';
    if (mimeType?.includes('video/')) return 'videocam';
    if (mimeType?.includes('audio/')) return 'audiotrack';
    return 'insert-drive-file';
  };

  const formatFileSize = bytes => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;

  // Scoped storage (Android 10+) does not require legacy storage permission
  // when the system Download Manager handles the download.
  if (Platform.Version >= 29) return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'Storage Permission',
      message: 'App needs access to storage to download files.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};
const downloadFile = async file => {
  try {
    if (!file.download_url) {
      Alert.alert('Error', 'No download URL available');
      return;
    }

    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Storage permission is required to download files.');
      return;
    }

    setDownloadingId(file.id);
    const rawFileName = file.file_name || file.name || `file_${file.id}`;
    const fileName = rawFileName.replace(/[\\/:*?"<>|]/g, '_');
    const timestamp = Date.now();
    const downloadUrl = /^https?:\/\//i.test(file.download_url)
      ? file.download_url
      : `${server_origin}${file.download_url.startsWith('/') ? '' : '/'}${
          file.download_url
        }`;

    if (Platform.OS === 'android') {
      const destination = `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${timestamp}_${fileName}`;
      await ReactNativeBlobUtil.config({
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: destination,
          title: fileName,
          description: 'Downloading attachment',
          mime: file.mime_type || file.type || 'application/octet-stream',
          mediaScannable: true,
        },
      }).fetch('GET', downloadUrl);
      Alert.alert('Download started ✅', `${fileName} Downloads folder mein save hogi.`);
    } else {
      const localPath = `${RNFS.DocumentDirectoryPath}/${timestamp}_${fileName}`;
      const result = await RNFS.downloadFile({
        fromUrl: downloadUrl,
        toFile: localPath,
        background: true,
        discretionary: true,
      }).promise;
      if (result.statusCode < 200 || result.statusCode >= 300) {
        throw new Error(`Server returned status ${result.statusCode}`);
      }
      Alert.alert('Downloaded ✅', fileName);
    }
  } catch (error) {
    console.log('DOWNLOAD ERROR:', error);
    Alert.alert('Error', `Download failed: ${error.message}`);
  } finally {
    setDownloadingId(null);
  }
};

//  const downloadFile = async file => {
//   try {
//     setDownloadingId(file.id);

//     if (!file.download_url) {
//       Alert.alert('Error', 'No download URL available');
//       return;
//     }

//     // 🔥 FIX: direct URL use करो
//     const fullUrl = file.download_url;

//     const fileName = file.file_name || file.name || `file_${file.id}`;
//     const localPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;
//     // const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

//     console.log('DOWNLOAD URL:', fullUrl);

//     const downloadResult = await RNFS.downloadFile({
//       fromUrl: fullUrl,
//       toFile: localPath,
//     }).promise;

//     if (downloadResult.statusCode === 200) {
//       Alert.alert('Success', `"${fileName}" downloaded successfully`);
//     } else {
//       Alert.alert('Error', 'Download failed');
//     }
//   } catch (error) {
//     console.error('Download error:', error);
//     Alert.alert('Error', 'Failed to download file');
//   } finally {
//     setDownloadingId(null);
//   }
// };


// const downloadFile = async file => {
//   try {
//     const hasPermission = await requestStoragePermission();

//     if (!hasPermission) {
//       Alert.alert('Permission Denied');
//       return;
//     }

//     setDownloadingId(file.id);

//     if (!file.download_url) {
//       Alert.alert('Error', 'No download URL available');
//       return;
//     }

//     const fullUrl = file.download_url;

//     const fileName =
//       file.file_name || file.name || `file_${file.id}`;

//     // ✅ safer path
//     const localPath = `${RNFS.DownloadDirectoryPath}/${Date.now()}_${fileName}`;

//     console.log('DOWNLOAD URL:', fullUrl);
//     console.log('LOCAL PATH:', localPath);

//     const result = await RNFS.downloadFile({
//       fromUrl: fullUrl,
//       toFile: localPath,
//     }).promise;

//     console.log('DOWNLOAD RESULT:', result);

//     if (result.statusCode === 200) {
//       Alert.alert(
//         'Success',
//         `File downloaded successfully\n${localPath}`,
//       );
//     } else {
//       Alert.alert('Error', 'Download failed');
//     }
//   } catch (error) {
//     console.log('DOWNLOAD ERROR:', error);
//     Alert.alert('Error', error.message);
//   } finally {
//     setDownloadingId(null);
//   }
// };

  // const pickAnyFileBase64 = async () => {
  //   try {
  //     const res = await DocumentPicker.pickSingle({
  //       type: [DocumentPicker.types.allFiles],
  //       copyTo: 'cachesDirectory',
  //     });

  //     const fileUri = res.fileCopyUri || res.uri;
  //     const base64 = await RNFS.readFile(fileUri, 'base64');

  //     const payload = {
  //       id: id,
  //       model: Enquery === 'Enquiry' ? 'crm.enquiry' : 'crm.lead',
  //       name: res.name,
  //       type: res.type,
  //       size: res.size,
  //       base64: base64,
  //     };

  //     const response = await makeApiCall(
  //       server_origin,
  //       urls.UploadAttachment,
  //       'POST',
  //       {jsonrpc: '2.0', params: payload},
  //     );

  //     if (response?.result?.success === true) {
  //       showFlashMessage({
  //         message: 'Success',
  //         description: 'Attachment uploaded successfully',
  //         type: 'success',
  //         duration: 3000,
  //       });
  //       navigation.pop(2);
  //     }
  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       console.log('User cancelled');
  //     } else {
  //       console.error('Upload error:', err);
  //     }
  //   }
  // };

  const pickAnyFileBase64 = async () => {
  try {
    const [res] = await pick({
      mode: 'open',
      allowMultiSelection: false,
    });

    if (!res) return;

    const fileUri = res.uri;
    const base64 = await RNFS.readFile(fileUri, 'base64');

    const payload = {
      id: id,
      model: Enquery === 'Enquiry' ? 'crm.enquiry' : 'crm.lead',
      name: res.name,
      type: res.type,
      size: res.size,
      base64: base64,
    };

    const response = await makeApiCall(
      server_origin,
      urls.UploadAttachment,
      'POST',
      {
        jsonrpc: '2.0',
        params: payload,
      },
    );

    if (response?.result?.success) {
      showFlashMessage({
        message: 'Success',
        description: 'Attachment uploaded successfully',
        type: 'success',
        duration: 3000,
      });

      navigation.pop(2);
    }
  } catch (err) {
    console.log('Upload Error:', err);
  }
};

  return (
    <>
      <HeaderCompo
        title="Attachments"
        lefticon={require('../../../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        {routedata.length > 0 ? (
          <View style={styles.fileList}>
            {routedata.map((item, index) => {
              const fileSize = formatFileSize(item.file_size || item.size);
              const fileIcon = getFileIcon(item.mimetype || item.type);
              const isDownloading = downloadingId === item.id;

              return (
                <TouchableOpacity
                  key={item.id || index}
                  style={styles.card}
                  onPress={() => downloadFile(item)}
                  activeOpacity={0.7}>
                  {/* File Icon */}
                  <View style={styles.fileIconContainer}>
                    <Icon name={fileIcon} size={30} color={COLORS.PRIMARY} />
                  </View>

                  {/* File Info */}
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {item.file_name || item.name || 'Unknown File'}
                    </Text>

                    <View style={styles.fileDetails}>
                      <Text style={styles.fileType}>
                        {item.mimetype?.split('/')[1]?.toUpperCase() ||
                          item.type?.split('/')[1]?.toUpperCase() ||
                          'FILE'}
                      </Text>
                      <Text style={styles.fileSize}> • {fileSize}</Text>
                    </View>

                    <Text style={styles.tapHint}>Tap to download</Text>
                  </View>

                  {/* Download indicator */}
                  <View style={styles.downloadIcon}>
                    {isDownloading ? (
                      <ActivityIndicator size="small" color={COLORS.PRIMARY} />
                    ) : (
                      <Icon name="file-download" size={24} color={COLORS.PRIMARY} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="folder-open" size={80} color="#DDD" />
            <Text style={styles.emptyText}>No Attachments Found</Text>
            <Text style={styles.emptySubtext}>
              There are no files attached to this item
            </Text>
          </View>
        )}

        {/* Upload Button */}
        <TouchableOpacity
          style={styles.bottombutton}
          onPress={pickAnyFileBase64}
          >
          <Text style={styles.bottombuttonText}>Upload Attachment</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  fileList: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  fileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  fileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  fileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fileType: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '500',
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  tapHint: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
  downloadIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
    textAlign: 'center',
  },
  bottombutton: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    height: 60,
    width: 130,
    backgroundColor: COLORS.BLUE,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottombuttonText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default Attachmentscreen;
