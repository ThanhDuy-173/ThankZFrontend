import styles from './Notification.module.scss';
import clsx from 'clsx';

function Notification({content = "", error, success, handleClick}) {
    return (
        <>
            <div className={styles.containerNotification}>
                {
                    success &&
                    (
                        <div className={styles.success_box}>
                            <div className={styles.dot} onClick={handleClick}></div>
                            <div className={clsx(styles.dot, styles.two)} onClick={handleClick}></div>
                            <div className={styles.face}>
                                <div className={styles.eye}></div>
                                <div className={clsx(styles.eye, styles.right)}></div>
                                <div className={clsx(styles.mouth, styles.happy)}></div>
                            </div>
                            <div className={clsx(styles.shadow, styles.scale)}></div>
                            <div className={styles.message}>
                                <h1 className={styles.alert}>Success!</h1>
                                <p>yay, everything is working.</p>
                            </div>
                            <button className={styles.button_box} onClick={handleClick}>
                                <h1 className={styles.green}>continue</h1>
                            </button>
                        </div>
                    )
                }
                {
                    error &&
                    (
                        <div className={styles.error_box}>
                            <div className={styles.dot} onClick={handleClick}></div>
                            <div className={clsx(styles.dot, styles.two)} onClick={handleClick}></div>
                            <div className={styles.face2}>
                            <div className={styles.eye}></div>
                            <div className={clsx(styles.eye, styles.right)}></div>
                            <div className={clsx(styles.mouth, styles.sad)}></div>
                            </div>
                            <div className={clsx(styles.shadow, styles.move)}></div>
                            <div className={styles.message}>
                                <h1 className={styles.alert}>Error!</h1>
                                <p>{content !== "" ? content : "oh no, something went wrong."}</p>
                            </div>
                            <button className={styles.button_box} onClick={handleClick}>
                                <h1 className={styles.red}>try again</h1>
                            </button>
                        </div>
                    )
                }
            </div>
        </>
    );
}
export default Notification