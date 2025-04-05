import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  cameraView: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
  },
  cameraText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  camera: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
  partyRooms: {
    height: "50%",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 10,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  roomCard: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomInfo: {
    flexDirection: "column",
  },
  roomName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  roomParticipants: {
    color: "#888",
    fontSize: 14,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 12,
  },
  joinButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  activeButton: {
    backgroundColor: "#1DB954",
  },
  inactiveButton: {
    backgroundColor: "#888",
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // modal 

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    width: "85%",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#1DB954",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#aaa",
    fontSize: 16,
  },
  // friends 
  friendsSection: {
    width: '100%',
    marginTop: 15,
    maxHeight: 200,
  },
  friendsTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  friendImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendName: {
    color: '#fff',
    flex: 1,
  },
  inviteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#1DB954',
  },
  invitedButton: {
    backgroundColor: '#444',
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyFriendsText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  // extra 
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalText: {
    color: '#fff',
    fontSize: 16,
  },
  friendsSection: {
    width: '100%',
    marginTop: 15,
    flex: 1,
  },
  friendsTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  friendImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendName: {
    color: '#fff',
    flex: 1,
  },
  inviteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#1DB954',
  },
  invitedButton: {
    backgroundColor: '#444',
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyFriendsText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  createButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#fff',
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
});