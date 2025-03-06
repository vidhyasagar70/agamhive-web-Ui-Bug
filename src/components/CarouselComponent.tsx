import React from "react";
import styles from "../styles/CarouselComponent.module.css";

const CarouselComponent: React.FC = () => {
  return (
    <div className={styles.carousel}>
     
      <div className={styles.vectorBackground}>
       
        <svg className={styles.warehouseIcon} viewBox="0 0 64 64">
          <path fill="rgba(255, 255, 255, 0.7)" d="M32 4L4 20v40h56V20L32 4zm0 4l24 14v34H8V22l24-14z"/>
        </svg>

        
        <svg className={styles.rackIcon} viewBox="0 0 64 64">
          <path fill="rgba(255, 255, 255, 0.6)" d="M6 10h52v6H6v-6zm0 18h52v6H6v-6zm0 18h52v6H6v-6zM10 14h12v10H10V14zm0 18h12v10H10V32zm0 18h12v10H10V50zm32-36h12v10H42V14zm0 18h12v10H42V32zm0 18h12v10H42V50z"/>
        </svg>

       
        <svg className={styles.palletIcon} viewBox="0 0 64 64">
          <path fill="rgba(255, 255, 255, 0.8)" d="M10 44h12v12H10V44zm16 0h12v12H26V44zm16 0h12v12H42V44zM10 28h12v12H10V28zm16 0h12v12H26V28zm16 0h12v12H42V28z"/>
        </svg>

        
        <svg className={styles.conveyorIcon} viewBox="0 0 64 64">
          <path fill="rgba(255, 255, 255, 0.7)" d="M6 50h52v4H6v-4zm6-10h8v8h-8v-8zm12 0h8v8h-8v-8zm12 0h8v8h-8v-8zm12 0h8v8h-8v-8z"/>
        </svg>
      </div>

     
      <div className={styles.content}>
        <h1 className={styles.title}>AGAM HIVE</h1>
        <p className={styles.subtitle}>
          Empowering businesses with innovative solutions and seamless digital experiences.
        </p>
      </div>
      
      
      <div className={styles.imageContainer} style={{ position: "absolute", bottom: "50px", width: "100%", textAlign: "center" }}>
        {/* <img src="/images/non-bg.png" alt="Descriptive Alt Text" style={{ maxWidth: "150px", height: "auto" }} /> */}
      </div>
      
      
      <div className={styles.copyright} style={{ position: "absolute", bottom: "10px", width: "100%", textAlign: "center" }}>
        © {new Date().getFullYear()} Agam Hive. All rights reserved.
      </div>
    </div>
  );
};

export default CarouselComponent;
