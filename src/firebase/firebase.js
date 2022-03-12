import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


// const firebaseConfig = {
//   apiKey: "AIzaSyBaO78G3EmNPTuQYrsk_HFkp5AjLwJWCxY",
//   authDomain: "thankz-825a3.firebaseapp.com",
//   projectId: "thankz-825a3",
//   storageBucket: "thankz-825a3.appspot.com",
//   messagingSenderId: "704108020793",
//   appId: "1:704108020793:web:e24eb2aca07c41bd0e39e8"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBcz1AHclS4zP3UMsHNtyht57-z_nCVbXk",
  authDomain: "thankzweb.firebaseapp.com",
  projectId: "thankzweb",
  storageBucket: "thankzweb.appspot.com",
  messagingSenderId: "409659029538",
  appId: "1:409659029538:web:a45783236c07d5d428f27b"
};

firebase.initializeApp(firebaseConfig);

export default firebase;