import styles from './Waiting.module.scss';

function Waiting() {
    return (
        <> 
            <div className={styles.waiting}>
                <h1 className={styles.title}>Waiting</h1>
                <div className={styles.rainbow_marker_loader}></div>
            </div>
        </>
    );
}

export default Waiting;