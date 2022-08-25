import {getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore'
import firebaseApp from "./credentials";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {updateProfile } from "firebase/auth"
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp);



export const saveWebsites = ({name, description, url, userId, createdAt}) => addDoc(collection(db, "websites"), {name, description, url, userId, createdAt})

export const getWebsites = () =>  getDocs(collection(db, "websites"))

export const onGetWebsites = (callback) => onSnapshot(collection(db, "websites"), callback)

export const  deleteWebsite = id =>  deleteDoc(doc(db, "websites", id));

export const getWebsite = id => getDoc(doc(db, "websites", id))

export const updateWebsite = (id, newFields) => updateDoc(doc(db, "websites", id), newFields)

export const timestamp = serverTimestamp()

// Storage
export async function upload(file, currentUser, setLoading) {
    const fileRef = ref(storage, currentUser.uid);
  
    setLoading(true);
    
    const snapshot = await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
  
    updateProfile(currentUser, {photoURL});
    
    setLoading(false);
    alert("Uploaded file!");
  }


