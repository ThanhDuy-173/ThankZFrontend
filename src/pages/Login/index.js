import {useCallback, useState, useRef} from 'react';
import { Link } from "react-router-dom";
import {useDispatch} from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import { BsFacebook } from 'react-icons/bs';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import {loginUser, registerUser} from '../../redux/actions/userAction';
// import { AllUsers } from '../../redux/selectors';
// import clsx from 'clsx';
import styles from './Login.module.scss';
import Button from '../../components/Button';
import Waiting from '../../components/Waiting';
import Notification from '../../components/Notification';
function Login() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errNotification, setErrNotification] = useState(false);
    const [contentErr, setContentErr] = useState("");
    const clientID = "614168778952-4i9u69aejf5i7qne6jcjb8aqgj9ob8n7.apps.googleusercontent.com";
    let inputRef = useRef([]);
    const handleChangeEmail = e => {
        setEmail(e.target.value);
    };
    const handleChangePassword = e => {
        setPassword(e.target.value);
    }
    const handleLogin = useCallback(async e => {
        // e.preventDefault();
        // window.location.href='/';
        // let e = email.replace(/^\s+|\s+$/gm,'');
        // let p = password.replace(/^\s+|\s+$/gm,'');
        let u = email.trim();
        let p = password.trim();
        const type = "Web";
        if(u !== "" && p !== "") {
            const result = await dispatch(loginUser(u, p, type, setLoading));
            if(result.status===200) {
                e.preventDefault();
                window.location.href='/';
            }
            if(result.status===400) {
                setErrNotification(true);
                setContentErr(result.data.message);
            }
            if (result.status===500) {
                setErrNotification(true);
            }
        }
        if (u === "") {
            inputRef.current[0].focus();
        }
        if (p === "") {
            inputRef.current[1].focus();
        }
        // console.log(email, password);
    }, [email,password, dispatch, inputRef]);
    const handleRegister = useCallback(e => {
        console.log(e);
    }, []);
    const responseGoogle = async (response) => {
        // console.log('google',response);
        const data = response.profileObj;
        const userGoogle = {
            ID: response.googleId,
            Name: data.name,
            Email: data.email,
            Password: response.googleId + data.email,
            DoB: "17/03/2000",
            Avatar: data.imageUrl,
        }
        const loginGoogle = await dispatch(loginUser(userGoogle.Email, userGoogle.Password, "Google", setLoading));
        if(loginGoogle.status===200) {
            window.location.href='/';
        }
        if(loginGoogle.status===400) {
            const result = await dispatch(registerUser(userGoogle, "Google", setLoading));
            if(result.status===200) {
                window.location.href='/';
            }
        }
        if (loginGoogle.status===500) {
            setErrNotification(true);
        }
    }
    // const logout = (response) => {
    //     console.log('Log out google successfully');
    // }
    const responseFacebook = async (response) => {
        const userFacebook = {
            ID: response.id,
            Name: response.name,
            Email: response.email,
            Password: response.id + response.email,
            DoB: "17/03/2000",
            Avatar: response.picture.data.url,
        }
        const loginFacebook = await dispatch(loginUser(userFacebook.Email, userFacebook.Password, "Facebook", setLoading));
        if(loginFacebook.status===200) {
            window.location.href='/';
        }
        if(loginFacebook.status===400) {
            const result = await dispatch(registerUser(userFacebook, "Facebook", setLoading));
            if(result.status===200) {
                window.location.href='/';
            }
        }
        if (loginFacebook.status===500) {
            setErrNotification(true);
        }
    }
    // const logoutFB = (e) => {
    //     e.preventDefault();
    //     // window.FB.logout();
    //     window.FB.logout(function(response) {
    //         // user is now logged out
    //         console.log('logout', response);
    //     });
    // }
    const style = { color: "#097DEB", fontSize: "20px", paddingTop: "3px", paddingRight: "3px"};
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
                    <h2>Login</h2>
                    <input 
                        type="email" 
                        placeholder="email" 
                        value={email} 
                        onChange={handleChangeEmail}
                        autoFocus
                        ref={el => inputRef.current[0]= el}
                    />
                    <input
                        type="password" 
                        placeholder="password" 
                        value={password} 
                        onChange={handleChangePassword} 
                        ref={el => inputRef.current[1]= el}
                    />
                    <Link to="/resetpassword" className={styles.forgot}>You forgot your password?</Link>
                    <div className={styles.loginOther}>
                        <GoogleLogin
                            clientId={clientID}
                            buttonText="Login with Google"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                        {/* <GoogleLogout
                            clientId={clientID}
                            buttonText="Logout"
                            onLogoutSuccess={logout}
                        >
                        </GoogleLogout> */}
                        <FacebookLogin
                            appId="1535653313479169"
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={responseFacebook}
                            cssClass={styles.loginFacebook}
                            buttonText="Sign in with Facebook"
                            icon={<BsFacebook style={style} />}
                        />
                        {/* <button onClick={logoutFB}>logout</button> */}
                    </div>
                    <div className={styles.btn}>
                        <Button light handleClick={handleLogin}>LOGIN</Button>
                        <Link to="/register"><Button dark handleClick={handleRegister}>REGISTER</Button></Link>
                    </div>
                    <h2>&nbsp;</h2>
                    
                </div>
            </div>
        </>
    );
}

export default Login;