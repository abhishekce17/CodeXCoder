import React from 'react'
import styles from '@/Styles/Footer.module.css'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className={styles.footer_container} >
      <div>
        <ul>
          <li> <Link href={"#"} > Contact Us</Link></li>
          <li> <Link href={"#"} > About Us</Link></li>
          <li> <Link href={"#"} > Corporate Information</Link></li>
        </ul>
        <ul>
          <li> <Link href={"#"} > Report Infringment</Link></li>
          <li> <Link href={"#"} > Feedback</Link></li>
          <li> <Link href={"#"} > FAQ</Link></li>
        </ul>
        <ul>
          <li> <Link href={"#"} > Retrun policy</Link></li>
          <li> <Link href={"#"} > Terms of Use</Link></li>
          <li> <Link href={"#"} > Security</Link></li>
          <li> <Link href={"#"} > Privacy</Link></li>
        </ul>
      </div>
      <div>
        <p>	&#169; 2023-2024 cureill</p>
      </div>
    </div>
  )
}

export default Footer 