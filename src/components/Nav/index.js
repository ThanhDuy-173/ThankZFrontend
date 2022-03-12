import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import clsx from 'clsx';
import { RiHomeHeartLine } from "react-icons/ri";
import { MdOutlineAutoStories, MdOutlinePermMedia, MdOutlineArrowDropDownCircle, MdOutlineLogout } from "react-icons/md";
import { BiWorld, BiUserCircle } from "react-icons/bi";
import styles from './Nav.module.scss';

function Nav() {
    const [user, setUser] = useState(() => {
        const data = localStorage.getItem('userData');
        const user = JSON.parse(data);
        if(user !== null) return user;
        return null;
    });
    const [min, setMin] = useState(() => {
        if(window.innerWidth*0.2 < 200) return true;
        return false;
    });
    const [url, setUrl] = useState(() => {
        const uri = window.location.pathname;
        const arrUri = uri.split("/");
        return arrUri[1];
    });
    const [selected, setSelected] = useState(() => {
        if(url === "stories") {
            return {
                    Home: false,
                    Stories: true,
                    Media: false,
                    About: false,
                    User: false
                }
        }
        if(url === "media") {
            return {
                    Home: false,
                    Stories: false,
                    Media: true,
                    About: false,
                    User: false
                }
        }
        if(url === "about") {
            return {
                    Home: false,
                    Stories: false,
                    Media: false,
                    About: true,
                    User: false
                }
        }
        if(url === "user") {
            return {
                    Home: false,
                    Stories: false,
                    Media: false,
                    About: false,
                    User: true
                }
        }
        return {
                Home: true,
                Stories: false,
                Media: false,
                About: false,
                User: false
        }
    });
    const style = { color: "#71E1FF", fontSize: "30px" };
    const styleSelected = { color: "#FF7081", fontSize: "30px" };
    const styleUser = { color: "#3498DB", fontSize: "40px" };
    const styleUserSelected = { color: "#55efc4", fontSize: "40px" };
    const styleLogout = { color: "red", fontSize: "30px" };
    useEffect(() => {
        const handleResize = () => {
            setMin(window.innerWidth*0.2 < 200);
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
    const handleHome = () => {
        setSelected({
        Home: true,
        Stories: false,
        Media: false,
        About: false,
        User: false
    });
    }
    const handleStories = () => {
        setSelected({
        Home: false,
        Stories: true,
        Media: false,
        About: false,
        User: false
    });
    }
    const handleMedia = () => {
        setSelected({
        Home: false,
        Stories: false,
        Media: true,
        About: false,
        User: false
    });
    }
    const handleAbout = () => {
        setSelected({
        Home: false,
        Stories: false,
        Media: false,
        About: true,
        User: false
    });
    }
    const handleUser = () => {
        setSelected({
        Home: false,
        Stories: false,
        Media: false,
        About: false,
        User: true
    });
    }
    const handleLogout = () => {
        setSelected({
        Home: false,
        Stories: false,
        Media: false,
        About: false,
        User: false
    });
    localStorage.removeItem('userData');
    }
    if (min) return (
        <>
            <nav className={styles.navMin}>
                <ul>
                    <li onClick={handleHome}>
                        <Link to="/">
                            {
                                selected.Home ? 
                                <RiHomeHeartLine style={styleSelected} /> : 
                                <RiHomeHeartLine style={style} />
                            }
                        </Link>
                    </li>
                    <li onClick={handleStories}>
                        <Link to="/stories">
                            {
                                selected.Stories ? 
                                <MdOutlineAutoStories style={styleSelected} /> : 
                                <MdOutlineAutoStories style={style} />
                            }
                        </Link>
                    </li>
                    <li onClick={handleMedia}>
                        <Link to="/media">
                            {
                                selected.Media ?
                                <MdOutlinePermMedia style={styleSelected} /> :
                                <MdOutlinePermMedia style={style} />
                            }
                        </Link>
                    </li>
                    <li onClick={handleAbout}>
                        <Link to="/about">
                            {
                                selected.About ?
                                <BiWorld style={styleSelected} /> :
                                <BiWorld style={style} />
                            }
                        
                        </Link>
                    </li>
                    <li onClick={handleUser}>
                        <Link to="/user">
                        {
                            user !== null && user.Avatar ?
                            <img 
                                src={user.Avatar} 
                                alt={user.Avatar} 
                                className={
                                    clsx(styles.avatar, {
                                        [styles.avatarSelect]: selected.User
                                    })
                                } 
                            /> :
                            selected.User ?
                            <BiUserCircle style={styleSelected} /> :
                            <BiUserCircle style={style} />
                        }
                        
                        </Link>
                    </li>
                    <li>
                        <div className={styles.dropdown}>
                            <MdOutlineArrowDropDownCircle style={style} />
                            <div className={styles.dropdown_content}>
                                <Link to="/login">
                                    <MdOutlineLogout style={styleLogout} /><span>Logout</span>
                                </Link>    
                                <br />
                                <Link to="/user">
                                    <MdOutlineLogout style={style} /><span>Account</span>
                                </Link>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
        </>
    );
    return (
        <>
            <div className={styles.nav}>
                <Link to="/">
                    <img className={styles.img} src={process.env.PUBLIC_URL + '/images/LogoRB.png'} alt='Logo' />
                </Link>
                <div className={clsx(styles.navUser, {
                    [styles.selectUser]: selected.User,
                })} onClick={handleUser}>
                    <Link to="/user">
                        <div className={clsx(styles.boxUser, {
                            [styles.selectBoxUser]: selected.User
                        })}>
                            {
                                user !== null && user.Avatar ?
                                <img src={user.Avatar} alt={user.Avatar} /> :
                                selected.User ? 
                                <BiUserCircle style={styleUserSelected} /> : 
                                <BiUserCircle style={styleUser} />
                            }
                            <div 
                                className={clsx(styles.nameUser, {
                                    [styles.selectUser]: selected.User
                                })}
                            >
                                {
                                    user ? user.Name : "User"
                                }
                            </div>
                        </div>
                    </Link>
                </div>
                <nav>
                    <ul>
                        <Link 
                            to="/" 
                            className={clsx({
                                [styles.selected]: selected.Home,
                            })}
                        >
                            <li 
                                onClick={handleHome} 
                            >
                                Home
                            </li>
                        </Link>
                        <Link 
                            to="/stories"
                            className={clsx({
                                [styles.selected]: selected.Stories,
                            })}
                        >
                            <li 
                                onClick={handleStories}
                            >
                                Stories
                            </li>
                        </Link>
                        <Link 
                            to="/media"
                            className={clsx({
                                [styles.selected]: selected.Media,
                            })}
                        >
                            <li 
                                onClick={handleMedia}
                            >
                                Media
                            </li>
                        </Link>
                        <Link 
                            to="/about"
                            className={clsx({
                                [styles.selected]: selected.About,
                            })}
                        >
                            <li 
                                onClick={handleAbout}
                            >
                                About
                            </li>
                        </Link>
                    </ul>
                </nav>
                <div className={styles.navLogout} onClick={handleLogout}>
                    <Link to="/login"><div className={styles.iconLogout}><span>Logout</span><MdOutlineLogout style={styleLogout} /></div></Link>
                </div>
            </div>
        </>
    );
}

export default Nav;