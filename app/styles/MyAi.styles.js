// MyAi.styles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 24, justifyContent: 'center' },
  title: { color: '#1DB954', fontSize: 26, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: '#ccc', fontSize: 16, marginBottom: 30 },
  input: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 10,
    color: '#fff',
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1DB954',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  personalityOption: {
    padding: 14,
    backgroundColor: '#1a1a1a',
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedOption: {
    borderColor: '#1DB954',
    backgroundColor: '#1DB95433',
  },
  personalityText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#1DB954',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default styles;