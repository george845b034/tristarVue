import Firebase from 'firebase'

const config = {
	apiKey: process.env.FIREBASE_ENV.apiKey,
    authDomain: process.env.FIREBASE_ENV.authDomain,
    databaseURL: process.env.FIREBASE_ENV.databaseURL,
    storageBucket: process.env.FIREBASE_ENV.storageBucket,
    messagingSenderId: process.env.FIREBASE_ENV.messagingSenderId
}
const app = Firebase.initializeApp(config)
const auth = Firebase.auth()
const db = app.database()
const photosRef = db.ref('photos')
const photosTypeRef = db.ref('photos_type')
const photosSchemaRef = db.ref('photos_schema')
const storage = Firebase.storage()
const storageRef = storage.ref()
const uploadRef = storageRef.child('upload');

export default {
    auth: auth,
    db: db,
    photosSchemaRef: photosSchemaRef,
    photosRef: photosRef,
    photosTypeRef: photosTypeRef,
    uploadRef: uploadRef,
    login(inEmail, inPassword) {
        return Firebase.auth().signInWithEmailAndPassword(inEmail, inPassword);
    },
    logout() {
        Firebase.auth().signOut();
    }
}