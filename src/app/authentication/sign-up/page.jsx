"use client"
import React, {useContext, useEffect, useState} from "react";
import styles from "@/Styles/Authentication.module.css";
import Link from "next/link";
import {useRouter} from "next/navigation";
import UserAuthContext from "@/app/contextProvider";

const SignUpForm = () => {
  const context = useContext(UserAuthContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [hasAgreed, setHasAgreed] = useState(false);
  const [raiseError, setRaiseError] = useState({confirmPasswordError: false, somethingWentWrongError: false})
  const [errorMessage, setErrorMessage] = useState(null)
  // const [timeInterval, setTimeInterval] = useState(false)
  const router = useRouter();

  const handleChange = (event) => {
    const {name, value, type, checked} = event.target;

    if (type === "checkbox") {
      setHasAgreed(checked);
    } else if (name === "name") {
      setName(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  const createAccount = async (waitingTime) => {
    const accountCreationResponse = await fetch("/api/Authentication/userAuth/SignUp", {
      method: 'POST',
      body: JSON.stringify({email, password, name, agreedTermAndCondition: hasAgreed})
    })
    const result = await accountCreationResponse.json()
    if (result.status === 201) {
      context.setIsUserLoggedIn(true)
      context.fetchUserData()
      // clearInterval(waitingTime)
      router.replace("/")
    }
    else {
      // clearInterval(waitingTime)
      setRaiseError({confirmPasswordError: false, somethingWentWrongError: true})
      setErrorMessage(result.error)
    }
  }


  const validateUserSession = async () => {
    const existenceResponse = await fetch("/api/Authentication/userAuth/UserExistence", {
      method: "POST",
      body: JSON.stringify({email, password})
    })
    const existenceResult = await existenceResponse.json()
    if (existenceResult.status === 200) {
      setRaiseError({...raiseError, somethingWentWrongError: true})
      setErrorMessage("Eamil already exists")
    } else if (existenceResult.status === 401) {
      setRaiseError({somethingWentWrongError: false, confirmPasswordError: false})
      // setTimeInterval(60)
      // alert("a verification mail is send to your given mail id")
      createAccount()
    }
    // else if (existenceResponse.status === 429) {
    //   setErrorMessage("Verification mail is already send to you")
    //   setRaiseError({ ...raiseError, somethingWentWrongError: true })
    // }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setRaiseError({...raiseError, confirmPasswordError: true})
      return
    }
    else {
      validateUserSession()
    }
  };

  // useEffect(() => {
  //   if (timeInterval <= 0) return setTimeInterval(false)
  //   const timeOut = setTimeout(() => {
  //     setTimeInterval(timeInterval - 1)
  //   }, 1000)
  //   return () => clearTimeout(timeOut)
  // }, [timeInterval])

  return (
    <div className={styles.formCenter}>
      <form onSubmit={handleSubmit} className={styles.formFields}>
        <div className={styles.formField}>
          <label className={styles.formFieldLabel} htmlFor="name">
            Full Name
          </label>
          <input
            required
            type="text"
            id="name"
            className={styles.formFieldInput}
            placeholder="Enter your full name"
            name="name"
            value={name}
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
          <label className={styles.formFieldLabel} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            required
            type="password"
            id="confirmPassword"
            className={styles.formFieldInput}
            placeholder="Confirm your password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
          />
        </div>
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
          <label className={styles.formFieldCheckboxLabel}>
            <input
              required
              className={styles.formFieldCheckbox}
              type="checkbox"
              name="hasAgreed"
              checked={hasAgreed}
              onChange={handleChange}
            />{" "}
            I agree to all statements in{" "}
            <a href="null" className={styles.formFieldTermsLink}>
              terms of service
            </a>
          </label>
        </div>

        <div className={styles.formField}>
          {/* <button className={styles.formFieldButton} disabled={timeInterval} > {timeInterval ? `waiting for varification ${timeInterval}` : "Sign Up"}</button>{" "} */}
          <button className={styles.formFieldButton} > {"Sign Up"}</button>
          <Link href="/authentication/sign-in" className={styles.formFieldLink}>
            I&apos;m already a member
          </Link>
        </div>
      </form>
      {raiseError.somethingWentWrongError && <div style={{color: "red"}} >
        {errorMessage}
      </div>}
      {raiseError.confirmPasswordError && <div style={{color: "red"}} >
        password is not same
      </div>}
    </div>
  );
};

export default SignUpForm;
