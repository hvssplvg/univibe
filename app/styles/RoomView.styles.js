import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
  },
  roomHeader: {
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  roomName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1DB954',
  },
  roomStatus: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  participantsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  participantName: {
    fontSize: 16,
    color: '#fff',
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
  },
  joinButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  joinButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;