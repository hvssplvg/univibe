import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    position: 'relative',
  },
  // Chat related styles
  chat: {
    paddingHorizontal: 16,
    paddingBottom: 10, // Reduced bottom padding
  },
  // Header styles
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
  },
  tagline: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },

  // Input and button styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#1a1a1a',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // Position at the bottom of the screen
    height: 70, // Adjusted height to prevent overlap
  },
  plusBtn: {
    marginRight: 10,
    backgroundColor: '#1DB954',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    color: '#fff',
    fontSize: 16,
    padding: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 25,
    marginRight: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  sendBtn: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },

  // Modal for media upload
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalBtn: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalCancel: {
    paddingVertical: 14,
    marginTop: 10,
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalIcon: {
    marginRight: 15,
    color: '#1DB954',
  },

  // Media message styles
  mediaMessage: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageMessage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  fileContainer: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    marginRight: 10,
    color: '#1DB954',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: '#fff',
    fontSize: 14,
  },
  fileSize: {
    color: '#aaa',
    fontSize: 12,
  },
});

export default styles;