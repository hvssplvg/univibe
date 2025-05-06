# univibe
# 📱 UniVibe – The Social & Academic Network for Students

**UniVibe** is a cross-platform mobile application designed to bridge the gap between academic collaboration and social interaction for university students.  
Developed as a final year project, UniVibe empowers students to connect by course, university, and interest, while offering real-time chat, event participation, academic assistance, and gamified engagement.

---

## 🚀 Features

- 🔐 Secure Sign-up & Authentication (Firebase)
- 🧑‍🎓 Course-Based Profiles and Communities
- 📝 Post Feed with Images, Videos, and Voice Notes
- 💬 Real-Time Chat with Message Reactions, Voice Notes, and Replies
- 🧠 **StudyBuddy AI** – Personal academic assistant powered by ChatGPT
- 🔊 **Party Rooms** – Group audio discussions
- 🎤 ElevenLabs Integration for realistic voice notes
- 🏆 Leaderboards for students and universities (gamification)
- 📅 Event Discovery & RSVP
- 🌐 Modular filtering: Nearby, City, Campus, University
- 🎨 Custom Chat Background Themes (Cloudinary Uploads + In-App Purchases)
- 🛠️ Admin Dashboard (React + Firebase) for viewing reports and abuse logs
- 🤖 Built-in SupportBot that logs user issues to Firestore and responds in-chat

---

## 🛠️ Tech Stack

| Technology     | Purpose |
|----------------|---------|
| **React Native (Expo SDK 53)** | Mobile App Development |
| **Firebase (Auth, Firestore, Storage)** | Backend & Real-Time Database |
| **Cloudinary** | Media hosting & optimization |
| **OpenAI GPT API** | StudyBuddy AI + SupportBot intelligence |
| **ElevenLabs API** | Voice note generation |
| **Expo-AV / Gifted Chat** | Audio playback and chat UI |
| **Stripe / RevenueCat** | In-App Purchases |
| **React (Admin Panel)** | Admin Dashboard Web App |
| **GitHub** | Version Control & Collaboration |

---

##  Testing

UniVibe was tested using:
- ✅ Unit & Integration Testing (UI + Data flow)
- ✅ Manual Usability Testing with 10 student participants
- ✅ Simulated Load Testing on Firebase reads/writes
- ✅ Real-time chat edge case testing (disconnections, emoji spam, reply chains)

---



##  Project Structure
univibe/
├── app/
│   ├── (tabs)/                # Main screens (Home, Connect, Inbox, Games)
│   ├── components/            # Reusable UI components (e.g. CustomPicker, FilterModal)
│   ├── screens/               # Functional screens like ChatRoom, UserProfile
│   ├── styles/                # Global and modular styling files
│   ├── firebase/              # Firestore queries and config
│   └── utils/                 # Helpers (auth, theme, storage)
├── assets/                    # Images, theme backgrounds, icons
├── App.js                     # Root file with navigation and context providers
└── package.json               # Dependencies and scripts
---

## 🧑‍💻 Installation

To run UniVibe locally:

```bash
git clone https://github.com/yourusername/univibe.git
cd univibe
npm install
npx expo start
Author

Hassan V
Final Year Student – BSc (Hons) Computer Science
University of Huddersfield
Email: [u2292659@unimail.hud.ac.uk]
Acknowledgements
	•	OpenAI (ChatGPT)
	•	ElevenLabs
	•	Firebase by Google
	•	React Native & Expo Team
	•	Cloudinary
