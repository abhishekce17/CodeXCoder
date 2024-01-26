import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import FormArea from "@/components/FormArea";
import ImageUpload from "@/components/ImageUpload";
import styles1 from "@/Styles/FormArea.module.css"
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* <Navbar /> */}
      <FormArea />
      <div className={styles1.media} >
        <ImageUpload />
      </div>
      {/* <Footer /> */}
    </main>
  );
}
