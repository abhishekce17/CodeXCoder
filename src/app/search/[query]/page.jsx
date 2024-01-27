"use client"
import styles from "@/Styles/productsLayout.module.css"
import Link from "next/link"
import Image from "next/image"
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai"
import {useContext, useEffect, useState} from "react"
import Loading from "@/app/administrator/admin/loading"
import UserAuthContext from "@/app/contextProvider"




const Page = ({params}) => {
    const {query} = params;
    const [queryProducts, setQueryProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const context = useContext(UserAuthContext)

    useEffect(() => {
        const queryResult = async () => {
            const fetchRsult = await fetch(`/api/Search/${query}`);
            const fetchData = await fetchRsult.json();
            if (fetchData.status === 200) {
                setQueryProducts(fetchData.data)
                // console.log(fetchData.data);
                setIsLoading(false)
            } else {
                alert("Something went wrong please try again later");
                setIsLoading(false)
            }
        }
        queryResult();
    }, []);


    return (
        <div className={styles.layout} >
            <center> <p style={{fontSize: "20px"}} > Showing Result for <span style={{fontWeight: 600}} >{query.replace("-", " ")}</span> </p></center>            {
                isLoading ? Loading() :
                    <div className={styles.layout_container} >
                        {queryProducts.length ? queryProducts.map((value, index) => {
                            return (
                                <div key={index} className={styles.each_product_card} >
                                    <Link href={{pathname: `/product/${value.productId}`}} >
                                        <Image width={500} height={500} src={value.productFirtsImgURL} alt={value.productFirtsImgURL} />
                                        <div>
                                            <p>{value.productName}</p>
                                        </div>
                                        <div><p>From   &#8377;{value.price}</p> </div>
                                    </Link>
                                </div>
                            )
                        }) :
                            <h1>No Result Found</h1>
                        }

                    </div>
            }
        </div >
    )
}

export default Page