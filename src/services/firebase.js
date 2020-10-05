import firebase from "firebase";
import React, { createContext } from 'react'

const config = {
  apiKey: "AIzaSyC8TsLBX7moBEAZcnv6PvQUWgjN9JCy6s8",
  authDomain: "small-business-relief.firebaseapp.com",
  databaseURL: "https://small-business-relief.firebaseio.com",
};

const FirebaseContext = createContext(null)
export { FirebaseContext }
// export const db = firebase.database();
// export const auth = firebase.auth;

export default ({ children }) => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)
  }
  return (
    <FirebaseContext.Provider value={ firebase }>
      { children }
    </FirebaseContext.Provider>
  )
}