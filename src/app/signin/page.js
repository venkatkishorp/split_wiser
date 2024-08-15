'use client'
import React from "react";
import { useRouter } from 'next/navigation';
import { signIn } from "../api/firebase/auth/signin";

function Page() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [signinError, setSigninError] = React.useState(false);
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const result = await signIn({
            method: 'POST',
            body: {
                'email': email,
                'password': password
            }
        });

        if (result?.operationType == "signIn") {
            router.push("/admin");
        }
        else {
            router.push("/signin");
            setSigninError(true);
            setPassword('');
            setTimeout(() => {
                setSigninError(false);
            }, 3000);
        }
    }

    return (
        <>
            { signinError ? <Alert severity="error">The email exists already!</Alert> : <></> }

            <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    {/* <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=600" alt="Your Company"/> */}
                    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
                </div>

                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="space-y-6"  onSubmit={handleForm} method="POST">
                        <div>
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                            <div class="mt-2">
                                <input id="email" name="email" type="email" placeholder="example@mail.com" onChange={(e) => setEmail(e.target.value)} autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between">
                                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <div class="text-sm">
                                    <a href="#" class="font-semibold text-red-600 hover:text-red-500">Forgot password?</a>
                                </div>
                            </div>
                            <div class="mt-2">
                                <input id="password" name="password" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"/>
                            </div>
                        </div>

                        <div>
                            <button type="submit" class="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Sign in</button>
                        </div>
                    </form>

                    <p class="mt-10 text-center text-sm text-gray-500">
                        Not a member?
                        <a href="/signup" class="font-semibold leading-6 text-emerald-600 hover:text-emerald-500"> Register</a>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Page;