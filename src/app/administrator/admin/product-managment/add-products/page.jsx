"use client"
import AdminProdcutActionPage from '@/Components/AdminProductAction'
import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/navigation';
import Loading from '../../loading';
import uploadImages from '../uploadImages';


const Page = () => {
  const router = useRouter()
  const [categories, setCategories] = useState(null)

  async function handleAddProduct(formDataAPI) {
    try {
      const imgArray = formDataAPI.getAll("file");
      const imgUrlArray = []
      const imgUploadPromise = new Promise((resolve, reject) => {
        imgArray.forEach((file) => {
          const result = uploadImages(file);
          result.then((value) => {
            if (value.status === 500) reject();
            imgUrlArray.push(value.imgUrl)
            if (imgUrlArray.length === imgArray.length) resolve()
          })
        })
      })
      await imgUploadPromise;
      formDataAPI.append("imgUrls", JSON.stringify(imgUrlArray));
      const res = await fetch(`/api/add-products`, {
        method: "POST",
        body: formDataAPI,
      });
      const result = await res.json()
      if (result.status === 200) {
        router.replace("/administrator/admin/product-managment")
      }
    } catch (error) {
      alert("Error : ", error);
    }

  };

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch("/api/AdminCategories/FetchCategories")
      const resultData = await response.json()
      setCategories(resultData.data)
    }
    fetchCategories()
  }, [])

  return (
    <div>
      {

        <AdminProdcutActionPage handleAddProduct={handleAddProduct} categories={categories} />
      }
    </div>
  )
}

export default Page