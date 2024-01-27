"use client"
import React, {useEffect, useState} from 'react'
import styles from "@/Styles/TagManagment.module.css"
import {RiSearch2Line} from 'react-icons/ri'
import {BiEditAlt} from "react-icons/bi"
import {MdDeleteOutline} from 'react-icons/md'
import {ImCircleDown} from 'react-icons/im'
import {useRouter} from 'next/navigation'
import Loading from '../loading'
import {notify} from '@/JS/notify'

const Page = () => {
  let router = useRouter()
  const [isSelected, setIsSelected] = useState(false);
  const [tags, settags] = useState([])
  const handleRemoveCategory = async (tagId) => {
    const response = await fetch("/api/Admintags/DeleteTag/" + tagId)
    const result = await response.json()
    if (result.data.status === 200) {
      notify("Tag removed");
    }
  }

  const handleClick = (route) => {
    router.push("/administrator/admin/tag-managment/" + route)
  }

  useEffect(() => {
    async function fetchtags() {
      const response = await fetch("/api/FetchTag")
      const resultData = await response.json()
      console.log(resultData.data)
      settags(resultData.data)
    }
    fetchtags()
  }, [])

  return (
    <div className={styles.category_managemnet} >
      <div className={styles.view_category} >
        <div className={styles.top_bar} >
          <div> <RiSearch2Line style={{position: "relative", top: "4px"}} /> <input type='text' placeholder='Search...' /> </div>
          <button onClick={() => {handleClick("add-tag")}} >+ New Tag</button>
        </div>
        <div className={styles.headings} >
          <div>Tags</div>
        </div>

        {tags.length ? tags.map((tag, index) => {
          return (
            <div key={index} className={`${styles.category_info}  ${isSelected === index ? styles.selected : undefined}`} >
              <div>
                <div>
                  <p> {tag.filterTag} </p>
                </div>
                <div className={styles.action_icons} > <div onClick={() => {handleRemoveCategory(tag.tagId)}} > <MdDeleteOutline /></div> </div>
              </div>
            </div>
          )
        })
          : Loading()
        }

      </div>
    </div>
  )
}

export default Page