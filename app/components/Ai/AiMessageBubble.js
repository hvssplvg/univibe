import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as WebBrowser from 'expo-web-browser';

const AiMessageBubble = ({ item, avatar, voiceId }) => {
  if (!item) {
    console.error('Item is undefined or null:', item);
    return null;
  }

  const isUser = item.sender === 'user';
  const bubbleStyle = isUser ? styles.userBubble : styles.aiBubble;
  const textStyle = isUser ? styles.userText : styles.aiText;

  const handleOpenImage = () => {
    if (item.image) {
      WebBrowser.openBrowserAsync(item.image);
    }
  };

  const handleOpenFile = async () => {
    if (!item.file) return;

    try {
      // For Android, we need to get a content URI
      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(item.file);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
          type: item.mimeType || '*/*'
        });
      } else {
        // For iOS, we can use the DocumentPicker view
        await DocumentPicker.getDocumentAsync({
          type: item.mimeType || '*/*',
          copyToCacheDirectory: false,
          multiple: false,
          initialUri: item.file
        });
      }
    } catch (error) {
      console.error('Error opening file:', error);
      // Fallback to trying to open with Linking
      try {
        await Linking.openURL(item.file);
      } catch (linkError) {
        console.error('Failed to open with Linking:', linkError);
        alert('Unable to open file. Please make sure you have an appropriate app installed.');
      }
    }
  };

  return (
    <View style={[styles.messageContainer, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          {typeof avatar === 'string' && avatar.startsWith('http') ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.emojiAvatar}>{avatar || '🤖'}</Text>
          )}
        </View>
      )}
      
      <View style={[styles.bubble, bubbleStyle]}>
        {item.image ? (
          <TouchableOpacity onPress={handleOpenImage}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.imagePreview}
              resizeMode="contain"
            />
            <Text style={[styles.text, textStyle, styles.imageCaption]}>
              {item.text || '[Image]'}
            </Text>
          </TouchableOpacity>
        ) : item.file ? (
          <TouchableOpacity onPress={handleOpenFile} style={styles.fileContainer}>
            <Ionicons 
              name={getFileIcon(item.mimeType)} 
              size={24} 
              style={styles.fileIcon} 
            />
            <View style={styles.fileTextContainer}>
              <Text style={[styles.text, textStyle, styles.fileName]}>
                {item.fileName || 'Downloaded File'}
              </Text>
              <Text style={[styles.text, styles.fileSize]}>
                {formatFileSize(item.fileSize)}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.text, textStyle]}>{item.text}</Text>
        )}
      </View>
    </View>
  );
};

// Helper function to get appropriate icon for file type
const getFileIcon = (mimeType) => {
  if (!mimeType) return 'document-outline';
  
  if (mimeType.includes('pdf')) return 'document-text-outline';
  if (mimeType.includes('word')) return 'document-text-outline';
  if (mimeType.includes('excel')) return 'document-text-outline';
  if (mimeType.includes('powerpoint')) return 'document-text-outline';
  if (mimeType.includes('zip')) return 'archive-outline';
  if (mimeType.includes('image')) return 'image-outline';
  if (mimeType.includes('audio')) return 'musical-notes-outline';
  if (mimeType.includes('video')) return 'film-outline';
  
  return 'document-outline';
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '90%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    padding: 12,
    marginHorizontal: 8,
  },
  userBubble: {
    backgroundColor: '#1DB954',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#333',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#eee',
  },
  avatarContainer: {
    justifyContent: 'flex-end',
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  emojiAvatar: {
    fontSize: 28,
    width: 36,
    height: 36,
    textAlign: 'center',
    lineHeight: 36,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
  },
  imageCaption: {
    marginTop: 4,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    color: '#fff',
    marginRight: 12,
  },
  fileTextContainer: {
    flex: 1,
  },
  fileName: {
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
});

export default AiMessageBubble;