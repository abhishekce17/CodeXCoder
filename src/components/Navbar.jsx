"use client"
import React, {useContext, useEffect, useState} from "react";
import Link from "next/link";
import styles from "../Styles/Navbar.module.css"
import {useRouter} from "next/navigation";
import UserAuthContext from "@/app/contextProvider";

const Navbar = () => {
  let router = useRouter()
  const context = useContext(UserAuthContext)
  const [categories, setCategories] = useState([])
  const [queryValue, setQueryValue] = useState("");
  const handleQueryRequest = (e) => {
    e.preventDefault()
    router.push("/search/" + queryValue.replace(" ", "-"))
  }
  const handleChange = (e) => {
    setQueryValue(e.target.value)
  }

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const response = await fetch("/api/fetchCategories");
  //     const result = await response.json();
  //     // console.log(result.ctgry)
  //     if (result.status === 200) {
  //       setCategories(result.ctgry)
  //     }
  //   }
  //   fetchCategories()
  // }, [])
  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href={"/"}>Official LOGO</Link>
        </li>
        <li >
          <Link href={"/medicine"} >Medicines</Link>
        </li>
        <li >
          <Link href={"/contact-doctor"} >Contact Dr.</Link>
        </li>
        <li >
          <Link href={"/near-by"} >Medical</Link>
        </li>
        {
          context.isUserLoggedIn ?
            <li>
              <Link href={"/account/your-account"}><RiAccountCircleLine className={styles.account_icon} />Account</Link>
            </li> :
            <li>
              <Link href={"/authentication/sign-in"}>Sign In</Link>
            </li>
        }
      </ul>
    </nav>
  );
};

export default Navbar;
