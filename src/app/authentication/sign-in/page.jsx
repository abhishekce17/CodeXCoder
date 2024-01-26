"use client"

import React, {useContext, useEffect, useState} from "react";
import {FcGoogle} from "react-icons/fc";
import Link from "next/link";
import styles from "@/Styles/Authentication.module.css";
import {useRouter, useSearchParams} from "next/navigation";
import UserAuthContext from "@/app/contextProvider";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import {initializeApp} from "firebase/app";
import {notify} from "@/JS/notify";
// import * as firebase from 'firebase'

const SignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const context = useContext(UserAuthContext)
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCredentailInvalid, setIsCredentailInvalid] = useState(false)
  const [user, setUser] = useState(null)

  // console.log(que)

  const handleChange = (event) => {
    const {name, value} = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const authFetch = await fetch("/api/Authentication/userAuth/SignIn", {
      method: "POST",
      body: JSON.stringify({email, password})
    })
    const fetchResult = await authFetch.json()
    if (fetchResult.status === 200) {
      context.setIsUserLoggedIn(true)
      context.fetchUserData()
      router.replace(callbackUrl ? callbackUrl : "/");
    } else if (fetchResult.status === 401) {
      setIsCredentailInvalid(true)
    } else if (fetchResult.status === 500) {
      notify("Server Error", "error");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const fetchResult = await fetch("/api/firebaseConfig");
      const firebaseConfigResponse = await fetchResult.json();

      if (firebaseConfigResponse.status !== 200) {
        console.error("Failed to fetch Firebase configuration.");
        return;
      }

      const {firebaseConfig} = firebaseConfigResponse;
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      onAuthStateChanged(auth, async (result) => {
        const accountCreationResponse = await fetch("/api/Authentication/userAuth/GoogleAuth", {
          method: "POST",
          body: JSON.stringify({userCredentials: result, creationTime: result.metadata.creationTime}),
        });
        const fetchResult = await accountCreationResponse.json();
        if (fetchResult.status === 200) {
          context.setIsUserLoggedIn(true);
          context.fetchUserData();
          router.replace("/");
        } else if (fetchResult.status === 500) {
          console.error("Server Error");
        } else if (fetchResult.status === 409) {
          notify("Email already exist please try to login", "error");
        } else {
          notify(fetchResult.error, "error");
        }
      })

    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className={styles.formCenter}>
      <form className={styles.formFields} onSubmit={handleSubmit}>
        <div className={styles.formField}>
          <label className={styles.formFieldLabel} htmlFor="email">
            E-Mail Address
          </label>
          <input
            required
            type="email"
            id="email"
            className={styles.formFieldInput}
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.formFieldLabel} htmlFor="password">
            Password
          </label>
          <input
            required
            type="password"
            id="password"
            className={styles.formFieldInput}
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formField}>
          <button className={styles.formFieldButton}>Sign In</button>{" "}
          <Link href="/authentication/sign-up" passHref>
            <p className={styles.formFieldLink}>Create an account</p>
          </Link>
        </div>

        {isCredentailInvalid && <div className={styles.formField} >
          <label className={styles.formFieldLabel} style={{color: "red"}} htmlFor="email">
            E-Mail or Password is Invalid
          </label>
        </div>}

        <div className={styles.socialMediaButtons}>
          <div style={{cursor: "default"}} onClick={signInWithGoogle} className={styles.googleButton}>
            Log in with <FcGoogle className={styles.googleIcon} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
