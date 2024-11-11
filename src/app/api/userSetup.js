import { firebase_app } from "./firebase/config";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, firebaseCollection, storage } from './firebase/config'

// const auth = getAuth(firebase_app);

async function userSetup(req) {
    const userId = req.userId;
    const userName = req.name;
    const userPhone = req.phone;
    const userEmail = req.email;

    try {
        const result = await addDoc(firebaseCollection(db, 'UserDetails'), {
            'uId': userId,
            'name': userName,
            'phno': userPhone,
            'email': userEmail
        });

        return result;
    }
     catch (error) {
        // console.log('Error occured at user setup: ', e);
            
        return {
            "operationType": "userSetupError",
            "error": e
        }
     }
}

export { userSetup };