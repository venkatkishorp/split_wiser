import { firebase_app } from "../config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

async function signIn(req) {
  let result = null,
    error = null;

  if (req.method == 'POST') {
    let email = req.body.email;
    let password = req.body.password;

    try {
      result = await signInWithEmailAndPassword(auth, email, password);

      return result;
    } 
    catch (e) {
      // console.log('Error occured at signin: ', e);

      return {
        "operationType": "signInError",
        "error": e
      }
    }
  }

  return { result, error };
}

export { signIn };