import React from 'react'
import styles from "@/Styles/FormArea.module.css"
import Link from 'next/link'
import ImageUpload from './ImageUpload'

const FormArea = () => {
    return (
        <section className={styles.formArea} >
            <div className={styles.symptoms} >
                <Link href={"/cure-by-symptoms"} >Cure by Symptoms</Link>
            </div>
        </section>
    )
}

export default FormArea