import {useCallback, useState, useRef} from 'react';
import { Link } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import FacebookLogin from 'react-facebook-login';
import { BsFacebook } from 'react-icons/bs';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { v4 as uuidV4} from 'uuid';
import {useDispatch} from 'react-redux';
// import clsx from 'clsx';
import {registerUser, loginUser} from '../../redux/actions/userAction';
import styles from './Register.module.scss';
import Button from '../../components/Button';
import Waiting from '../../components/Waiting';
import Notification from '../../components/Notification';
function Register() {
    // new Date().toLocaleString() + ""
    const dispatch = useDispatch();
    const clientID = "614168778952-4i9u69aejf5i7qne6jcjb8aqgj9ob8n7.apps.googleusercontent.com";
    const [loading, setLoading] = useState(false);
    const [errNotification, setErrNotification] = useState(false);
    const [contentErr, setContentErr] = useState("");
    const [newUser, setNewUser] = useState({
        ID: uuidV4(),
        Name: "",
        Email: "",
        Password: "",
        DoB: "17/03/2000",
        Avatar: "",
    });
    const [checkData, setCheckData] = useState({
        email: false,
        password: false,
        confirm: false,
        err: [
            "Check the format of your email",
            "Password should be at least 8 characters which must have digit, uppercase, and lowercase",
            "Password not match"
        ]
    });
    let inputRef = useRef([]);
    const validEmail = new RegExp( '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$');
    const validPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    // console.log(date);
    const handleDataUser = (e,type) => {
        if (type === "Name") {
            setNewUser({
                ...newUser,
                Name: (e.target.value).trim()
            })
        } else if (type === "Email") {
            if(validEmail.test(e.target.value)) {
                setNewUser({
                    ...newUser,
                    Email: (e.target.value).trim()
                })
                setCheckData({
                    ...checkData,
                    email: false
                })
            } else {
                setCheckData({
                    ...checkData,
                    email: true
                })
            }
        } else if (type === "Password") {
            // const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            if(validPass.test(e.target.value)){
                setNewUser({
                    ...newUser,
                    Password: (e.target.value).trim()
                })
                setCheckData({
                    ...checkData,
                    password: false
                })
            }
            else {
                setCheckData({
                    ...checkData,
                    password: true
                })
            }
        } else if (type === "DoB") {
            setNewUser({
                ...newUser,
                DoB: e.target.value
            })
        } else if (type === "Confirm") {
            if(newUser.Password === e.target.value) {
                setCheckData({
                    ...checkData,
                    confirm: false
                })
            } else {
                setCheckData({
                    ...checkData,
                    confirm: true
                })
            }
        } 
    }
    const handleLogin = useCallback(e => {
        console.log(e);
    }, []);
    const handleRegister = useCallback(async e => {
        if(newUser.Name === "") {
            inputRef.current[0].focus();
        } else if(newUser.Email === "" || !validEmail.test(newUser.Email)) {
            inputRef.current[1].focus();
        } else if(newUser.Password === "" || !validPass.test(newUser.Password)) {
            inputRef.current[2].focus();
        } else if(newUser.Password !== inputRef.current[3].value) {
            inputRef.current[3].focus();
        } else {
            const result = await dispatch(registerUser(newUser, "Web", setLoading));
            if(result.status===200) {
                e.preventDefault();
                window.location.href='/';
            }
            if(result.status===400) {
                setErrNotification(true);
                setContentErr(result.data.message);
            }
        }
    }, [newUser, validEmail, validPass]);
    const responseGoogle = async (response) => {
        // console.log('google',response);
        const data = response.profileObj;
        // console.log(data);
        const userGoogle = {
            ID: response.googleId,
            Name: data.name,
            Email: data.email,
            Password: response.googleId + data.email,
            DoB: "17/03/2000",
            Avatar: data.imageUrl,
        }
        const result = await dispatch(registerUser(userGoogle, "Google", setLoading));
        if(result.status===200) {
            window.location.href='/';
        }
        if(result.status===400) {
            const loginGoogle = await dispatch(loginUser(userGoogle.Email, userGoogle.Password, "Google", setLoading));
            if(loginGoogle.status===200) {
                window.location.href='/';
            }
            if (loginGoogle.status===500) {
                setErrNotification(true);
            }
        }
    }
    // const logout = (response) => {
    //     console.log('Log out google successfully');
    //     console.log('google', response);
    // }
    const responseFacebook = async (response) => {
        // console.log('facebook',response);
        const userFacebook = {
            ID: response.id,
            Name: response.name,
            Email: response.email,
            Password: response.id + response.email,
            DoB: "17/03/2000",
            Avatar: response.picture.data.url,
        }
        const result = await dispatch(registerUser(userFacebook, "Facebook", setLoading));
        if(result.status===200) {
            window.location.href='/';
        }
        if(result.status===400) {
            const loginFacebook = await dispatch(loginUser(userFacebook.Email, userFacebook.Password, "Facebook", setLoading));
            if(loginFacebook.status===200) {
                window.location.href='/';
            }
            if (loginFacebook.status===500) {
                setErrNotification(true);
            }
        }
        // console.log('result', result);
    }
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
                    <h2>Register</h2>
                    <input 
                        type="text" 
                        placeholder="UserName"
                        autoFocus
                        ref={el => inputRef.current[0]= el}
                        onChange={e => handleDataUser(e, "Name")}
                    />
                    <input 
                        type="email" 
                        placeholder="Email"
                        ref={el => inputRef.current[1]= el}
                        onChange={e => handleDataUser(e, "Email")}
                    />
                    {
                        (checkData.email) ?
                        <p className={styles.warning}>{checkData.err[0]}</p> :
                        <></>
                    }
                    <input 
                        type="password" 
                        placeholder="Password"
                        ref={el => inputRef.current[2]= el}
                        onChange={e => handleDataUser(e, "Password")}
                    />
                    {
                        (checkData.password) ?
                        <p className={styles.warning}>{checkData.err[1]}</p> :
                        <></>
                    }
                    <input 
                        type="password" 
                        placeholder="Confirm Password"
                        ref={el => inputRef.current[3]= el}
                        onChange={e => handleDataUser(e, "Confirm")}
                    />
                    {
                        (checkData.confirm) ?
                        <p className={styles.warning}>{checkData.err[2]}</p> :
                        <></>
                    }
                    <TextField
                        className={styles.date}
                        id="date"
                        label="Date of Birth"
                        type="date"
                        defaultValue="2000-03-17"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={e => handleDataUser(e, "DoB")}
                    />
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
                    </div>
                    <div className={styles.btn}>
                        <Button light handleClick={handleRegister}>REGISTER</Button>
                        <Link to="/login"><Button dark handleClick={handleLogin}>LOGIN</Button></Link>
                    </div>
                    <h2>&nbsp;</h2>
                </div>
            </div>
        </>
    );
}

export default Register;