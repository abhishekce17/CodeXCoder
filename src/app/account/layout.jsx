"use client"
import { Inter } from 'next/font/google'
import style from "@/Styles/Account.module.css"
import AccountSidebar from '@/Components/AccountSidebar'
import { useContext } from 'react'
import UserAuthContext from '../contextProvider'
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function AccountLayout({ children }) {
  const router = useRouter()
  const context = useContext(UserAuthContext)

  return (
    <>{
      !context.isUserLoggedIn ?
        router.replace('/authentication/sign-in')
        :
        <div className={style.account_container} >
          <div className={style.sidebar_container} >
            <AccountSidebar />
          </div>
          <div className={style.account_page_features} >
            {children}
          </div>
        </div>
    }</>

  )
}
