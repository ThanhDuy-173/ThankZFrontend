import { useState, useEffect } from 'react';
// import clsx from 'clsx';
import { Outlet } from "react-router-dom";
import { FaAutoprefixer } from "react-icons/fa";
import styles from './Layout.module.scss';
import Nav from '../../components/Nav'
function Layout() {
  const [goToTop, setGoToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setGoToTop(window.scrollY >= 17)
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])
  const handleGoToTop = () => {
    window.scrollTo(0, 0)
  }
    return (
    <div className={styles.container}>
      <Nav />
      <div className={styles.content}>
        <Outlet />
      </div>
      {goToTop && (
        <button className={styles.toTop} onClick={handleGoToTop}><FaAutoprefixer color="#FF1A3C" fontSize="25px"/></button>
      )}
    </div>
  );
}

export default Layout;