import { useState, useEffect } from 'react';
import { AiOutlineMail, AiOutlinePhone, AiOutlineFacebook } from 'react-icons/ai';
import clsx from 'clsx';
import styles from './About.module.scss';

function About() {
    const [min, setMin] = useState(() => {
        if(window.innerWidth*0.16 <= 100) return true;
        return false;
    });
    const [minWidth, setMinWidth] = useState(() => {
        if(window.innerWidth <= 990) return true;
        return false;
    });
    useEffect(() => {
        const handleResize = () => {
            setMin(window.innerWidth*0.16 <= 100);
            setMinWidth(window.innerWidth <= 990);
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
    const style = { color: "#FBFF20", fontSize: "30px" };
    return (
        <>
            <div 
                className={clsx(styles.container,{
                    [styles.containerNormal]: minWidth
                })}
            >
                <div  
                    className={clsx(styles.bigTitle)}
                >
                    About ThankZ Website
                </div>
                <div className={styles.box}>
                    <div className={styles.boxAbout}>
                        <p>The owner of this website is ThankZ</p>
                        <p>The purpose of the website is to become an online diary for everyone to keep their thoughts, anytime, anywhere.</p>
                        <p>@Copyright of the website belongs to ThankZ</p>
                    </div>
                    <div className={styles.boxContact}>
                        <div className={styles.boxContactDetail}>
                            <AiOutlineMail style={styles} />
                            <p>ThankZCD@gmail.com</p>
                        </div>
                        <div className={styles.boxContactDetail}>
                            <AiOutlinePhone style={styles} />
                            <p>0385076161</p>
                        </div>
                        <div className={styles.boxContactDetail}>
                            <AiOutlineFacebook style={styles} />
                            <p><a href="https://www.facebook.com/ZKStory" target="_blank" rel="noopener noreferrer">https://www.facebook.com/ZKStory</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;