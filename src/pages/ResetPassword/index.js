import React, { useState, useCallback } from "react";
import {useDispatch} from 'react-redux';
import {resetUser} from '../../redux/actions/userAction';
import { Link } from "react-router-dom";
// import clsx from 'clsx';
import styles from './ResetPassword.module.scss'
import Button from '../../components/Button'
import Waiting from '../../components/Waiting';
import Notification from '../../components/Notification';
function ResetPassword() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errNotification, setErrNotification] = useState(false);
    const [contentErr, setContentErr] = useState("");
    const handleResetPassword = useCallback(async (e) => {
        const result = await dispatch(resetUser(email, setLoading));
        if(result.status===200) {
            e.preventDefault();
            window.location.href='/login';
        }
        if(result.status===400) {
            setErrNotification(true);
            setContentErr(result.data.message);
        }
        if (result.status===500) {
            setErrNotification(true);
        }
    }, []);
    const handleLogin = useCallback(e => {
        console.log(e);
    }, []);
    const handleChangeEmail = e => {
        setEmail(e.target.value);
    };
    const handleClick = useCallback(() => {
        setErrNotification(false);
    }, []);
    if (loading) return (
        <Waiting />
    );
    if (errNotification) return (
        <>
            <div className={styles.container}>
                <div className={styles.top}></div>
                <div className={styles.bottom}></div>
                <div className={styles.center}>
                    <Notification error handleClick={handleClick} content={contentErr} />
                </div>
            </div>
        </>
    );
    return (
        <>
            <div className={styles.container}>
                <div className={styles.top}></div>
                <div className={styles.bottom}></div>
                <div className={styles.center}>
                    <h2>Reset Password</h2>
                    <input type="email" placeholder="email" value={email} onChange={e => handleChangeEmail(e)}/>
                    <div className={styles.btn}>
                        <Button light handleClick={e => handleResetPassword(e)}>RESET PASSWORD</Button>
                        <Link to="/login"><Button dark handleClick={handleLogin}>BACK</Button></Link>
                    </div>
                    <h2>&nbsp;</h2>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;