import firebase from 'firebase';
var firebaseConfig = {
    apiKey: "AIzaSyAFPBsdq69kog34D_ZXMTtLPcbMsdNTgX4",
    databaseURL: "https://dc-deck-default-rtdb.firebaseio.com",
    projectId: "dc-deck",
    messagingSenderId: "855704658762",
    appId: "1:855704658762:web:c866ad45c7e746c24097b3",
    measurementId: "G-JEMHPME02J"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase;