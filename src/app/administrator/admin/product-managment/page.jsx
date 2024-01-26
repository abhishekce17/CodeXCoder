"use client"
import React, {useEffect, useState} from 'react'
import styles from "@/Styles/ProductsManagment.module.css"
import {RiSearch2Line} from 'react-icons/ri'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import Loading from '../loading'

const Page = () => {

  const [fetchedProducts, setFetchedProducts] = useState([])

  let router = useRouter()
  const handleClick = () => {
    router.push("/administrator/admin/product-managment/add-products")
  }

  function renderProductinfo(data, type, index) {
    return (
      <div key={index} className={styles.product_info} style={{margin: "20px 0"}} >
        <div>
          <Image src={data.productFirtsImgURL} width={100} height={100} alt='name' />
          <Link href={"product-managment/product-details/" + data.productId} >
            <p> {data.productName} </p>
          </Link>
        </div>
        <div>{type?.variant || "---"}</div>
        <div>{data.price}</div>
      </div>
    )
  }


  useEffect(() => {
    async function fetchingAllProductsSnap() {
      const res = await fetch(`/api/all-products`, {
        method: "GET",
        // body: formDataAPI,
      });
      const result = await res.json()
      if (result.status === 200) {
        setFetchedProducts(result.data)
      }
    }

    fetchingAllProductsSnap()

  }, [])

  return (
    <div className={styles.product_managemnet} >
      <div className={styles.view_products} >
        <div className={styles.top_bar} >
          <button onClick={handleClick} >+ Add Product</button>
        </div>
        <div className={styles.headings} >
          <div>Medicine Name</div>
          <div>Use cases</div>
          <div>Price</div>
        </div>

        {
          fetchedProducts.length ?
            fetchedProducts.map((data, index1) => {
              return (
                renderProductinfo(data, undefined, index1)
              )
            }) :
            Loading()
        }

      </div>
    </div>
  )
}

export default Page