"use client"
import style from "@/Styles/Account.module.css"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

const AccountSidebar = () => {
  let pathname = usePathname()
  let choosenRoute = pathname.split("/")[2]
  let features = ["Your Account", "Order History", "Wishlist", "Payment Methods", "Account Setting", "Help and Support", "Privacy and Policy"]


  const signOut = async () => {
    const signOutResponse = await fetch("/api/Authentication/userAuth/SignOut", { method: "DELETE" })
    const result = await signOutResponse.json()
    if (result.status === 200) {
      window.location.href = "/";
    }
  }

  useEffect(() => {
    const options = document.querySelectorAll('li > a');
    options.forEach(option => {
      option.setAttribute('data-choosed', 'false');
    });
  }, [pathname])
  // const [dataDefault, setDefaultdata] = useState("false")
  function handleSelection(e) {
    const selectedElement = e.target;
    const optionsContainer = selectedElement.parentNode.parentNode;

    const options = optionsContainer.querySelectorAll('li > a');
    options.forEach(option => {
      option.setAttribute('data-choosed', 'false');
      option.setAttribute('data-default', 'false');
    });

    selectedElement.setAttribute('data-choosed', 'true');
  }

  return (
    <ul className={style.sidebar} >

      {
        features.map((feature, index) => {
          return (
            <li key={index} >
              <Link href={"/account/" + feature.toLowerCase().replace(/ /g, "-")} data-choosed="false" data-default={feature.toLowerCase().replace(/ /g, "-") === choosenRoute && "true"} onClick={handleSelection} >{feature}</Link>
            </li>
          )
        })
      }
      <li>
        <button onClick={signOut} style={{ width: "100%", padding: "7px 0", fontWeight: "500", fontSize: "14px", color: "var(--dark-bg-color)", borderRadius: "5px", border: "1px solid var(--dark-bg-color)" }} className={style.signOut} >Sign Out</button>
      </li>
    </ul>

  )
}

export default AccountSidebar