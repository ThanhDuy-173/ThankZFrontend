import { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './Loading.module.scss';

function Loading() {
    const [minWidth, setMinWidth] = useState(() => {
        if(window.innerWidth <= 990) return true;
        return false;
    });
    useEffect(() => {
        const handleResize = () => {
            setMinWidth(window.innerWidth <= 990);
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
    return (
        <>
            <div 
                className={clsx(styles.loader, {
                    [styles.loaderNormal]: !minWidth,
                    [styles.loaderMin]: minWidth
                })}
            >
                Loading..
            </div>
        </>
    );
}

export default Loading;