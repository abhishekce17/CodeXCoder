"use client"
import React, {useState} from 'react';
import styles from "@/Styles/TagManagment.module.css"
import {ImCircleUp} from 'react-icons/im'
import {useRouter} from 'next/navigation';
import {isEmpty} from 'lodash';


const AddCategory = () => {
  const router = useRouter()
  const [newTag, setTag] = useState('');

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handleAddTag = () => {

  };


  const handleSubmit = async () => {
    if (!isEmpty(newTag)) {
      const response = await fetch("/api/AddTag", {
        method: "POST",
        body: JSON.stringify({filterTag: newTag})
      })
      const result = await response.json()
      if (result.status === 200) {
        // alert("Success")
        router.push("/administrator/admin/tag-managment")
      }
    }
  }

  return (
    <div className={styles.add_category_page} >
      <div className={styles.add_category_container}>
        <div className={styles.add_category} >
          <label>Tag</label>
          <input type="text" value={newTag} onChange={handleTagChange} />
        </div>
        <div style={{gridColumn: "span 2"}} >
          <center>
            <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
          </center>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
