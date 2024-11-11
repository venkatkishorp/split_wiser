import { firebase_app } from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);


async function signUp(req) {
    let result = null,
    error = null;
    if (req.method == 'POST') {
        let email = req.body.email;
        let password = req.body.password;
        try {
            result = await createUserWithEmailAndPassword(auth, email, password);

            return result;
        } catch (e) {
            // console.log('Error occured at signup: ', e);
            
            return {
                "operationType": "signUpError",
                "error": e
            }
        }
    }
}
export { signUp };