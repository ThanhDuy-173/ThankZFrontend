import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/actions/userAction';
import {firebase} from '../../firebase';
import { RiUserSettingsLine } from 'react-icons/ri';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { TiDeleteOutline } from 'react-icons/ti';
import { BiUpload } from 'react-icons/bi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import clsx from 'clsx';
import styles from './User.module.scss';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
function User() {
    const dispatch = useDispatch();
    const [user, setUser] = useState(() => {
        const data = localStorage.getItem('userData');
        const user = JSON.parse(data);
        if(user !== null) return user;
        return null;
    });
    const [typeUpdateUser, setTypeUpdateUser] = useState({
        Name: false,
        Avatar: false,
        Password: false
    });
    const [changeName, setChangeName] = useState(user.Name);
    const [changeAvatar, setChangeAvatar] = useState(user.Avatar);
    const [fileAvatar, setFileAvatar] = useState(null);
    const [changePassword, setChangePassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [typePassword, setTypePassword] = useState({
        new: "password",
        old: "password",
        confirm: "password"
    });
    const [progress, setProgress] = useState(0);
    const [disableButton, setDisableButton] = useState(true);
    const [min, setMin] = useState(() => {
        if(window.innerWidth*0.16 <= 100) return true;
        return false;
    });
    const [minWidth, setMinWidth] = useState(() => {
        if(window.innerWidth <= 990) return true;
        return false;
    });
    const [errPassword, setErrPassword] = useState({
        new: false,
        confirm: false,
        message: ["Password should be at least 8 characters which must have digit, uppercase, and lowercase","Password and Confirm Password don't correct!"]
    });
    const [typeUser, setTypeUser] = useState(() => {
        const data = localStorage.getItem('userData');
        const user = JSON.parse(data);
        if(user !== null && user.Type === "Web") return true;
        return false;
    });
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
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
    useEffect(() => {
        setDisableButton(true);
        if(
            (typeUpdateUser.Name === true && changeName !== user.Name) || 
            (typeUpdateUser.Avatar === true && changeAvatar !== user.Avatar) || 
            (typeUpdateUser.Password === true && changePassword.oldPassword !== "" && changePassword.newPassword !== "" && changePassword.confirmPassword !== "")
        ) {
            setDisableButton(false);
        }
    },[changeAvatar, changeName, changePassword.confirmPassword, changePassword.newPassword, changePassword.oldPassword, typeUpdateUser, user.Avatar, user.Name])
    const handleEU = useCallback(() => {
        setTypeUpdateUser({
            Name: false,
            Avatar: false,
            Password: false
        });
        setChangeName(user.Name);
        setChangeAvatar(user.Avatar);
        setChangePassword({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setErrPassword(pre => ({
            ...pre,
            new: false,
            confirm: false,
        }));
        setEdit(!edit)
    }, [edit, user.Avatar, user.Name]);
    const handleChangeTypeUpdate = e => {
        e.target.value === "Name" && e.target.checked === false && setChangeName(user.Name);
        e.target.value === "Avatar" && e.target.checked === false && setChangeAvatar(user.Avatar);
        e.target.value === "Password" && e.target.checked === false && setChangePassword({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        }) && setErrPassword(pre => ({
            ...pre,
            new: false,
            confirm: false,
        }));
        setTypeUpdateUser(pre => ({
            ...pre,
            [e.target.value]: e.target.checked
        }))
    };
    const handleCancel = useCallback(() => {
        setTypeUpdateUser({
            Name: false,
            Avatar: false,
            Password: false
        });
        setChangeName(user.Name);
        setChangeAvatar(user.Avatar);
        setChangePassword({
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
        setErrPassword(pre => ({
            ...pre,
            new: false,
            confirm: false,
        }));
        setEdit(!edit);
    }, [edit, user.Avatar, user.Name]);
    const handleNotification = useCallback(() => {
        confirmAlert({
        customUI: ({ onClose }) => {
            return (
            <div className={!minWidth ? styles.dialog : undefined}>
                <h1>Error</h1>
                <p>Nothing update!</p>
                <div className={styles.btn} onClick={onClose}>
                    <Button light handleClick={() => true}>OK</Button>
                </div>
            </div>
            );
        }
        });
    }, [minWidth]);
    const handleChangeName = e => {
        setChangeName(e.target.value)
    };
    const handleAddMedia = (e) => {
        console.log('addMedia', e);
    }
    const handleChangeFileAvatar = (e) => {
        console.log("Call");
        if(e.target.files[0]){
            const file = e.target.files[0];
            file.preview = URL.createObjectURL(file);
            setFileAvatar(file)
        }
    };
    const handleDeleteFile = () => {
        URL.revokeObjectURL(fileAvatar.preview);
        setFileAvatar(null);
    }
    const handleUploadAvatar = () => {
        const uploadTask = firebase.storage().ref(`avatars/${fileAvatar.name}`).put(fileAvatar);
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            error => {
                console.log(error);
            }, 
            () => {
                firebase.storage()
                .ref("avatars")
                .child(fileAvatar.name)
                .getDownloadURL()
                .then(url => {
                    console.log(url);
                    setChangeAvatar(url);
                    setFileAvatar(null);
                })
            }
        )
    };
    const handleDeleteAvatar = () => {
        setChangeAvatar(null);
    };
    const handleChangePassword = (e, type) => {
        const validPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        type === "old" && setChangePassword(pre => ({
            ...pre,
            oldPassword: e.target.value
        }));
        type === "new" && setChangePassword(pre => ({
            ...pre,
            newPassword: e.target.value
        }));
        type === "new" && !validPass.test(e.target.value) && e.target.value !== "" && setErrPassword(pre => ({
            ...pre,
            new: true
        }));
        type === "new" && validPass.test(e.target.value) && e.target.value !== "" && setErrPassword(pre => ({
            ...pre,
            new: false
        }));
        type === "new" && e.target.value === "" && setErrPassword(pre => ({
            ...pre,
            new: false
        }));
        type === "new" && changePassword.confirmPassword !== "" && changePassword.newPassword !== changePassword.confirmPassword && setErrPassword(pre => ({
            ...pre,
            confirm: true
        }));
        type === "confirm" && setChangePassword(pre => ({
            ...pre,
            confirmPassword: e.target.value
        }));
        type === "confirm" && changePassword.newPassword !== e.target.value && e.target.value !== "" && setErrPassword(pre => ({
            ...pre,
            confirm: true
        }));
        type === "confirm" && changePassword.newPassword === e.target.value && e.target.value !== "" && setErrPassword(pre => ({
            ...pre,
            confirm: false
        }));
        type === "confirm" && e.target.value === "" && setErrPassword(pre => ({
            ...pre,
            confirm: false
        }));
    }
    const handleUpdateUser = useCallback(async (onClose, dataUpdateUser) => {
        const res = await dispatch(updateUser(user.ID, dataUpdateUser.Name, dataUpdateUser.Avatar, dataUpdateUser.Password, setLoading));
        if(res.status === 200) {
            window.location.reload();
            onClose();
        }
        
    }, [dispatch, user.ID])
    const handleUpdate = useCallback(() => {
        if(
            (typeUpdateUser.Name === true && changeName !== user.Name) || 
            (typeUpdateUser.Avatar === true && changeAvatar !== user.Avatar) || 
            (typeUpdateUser.Password === true && changePassword.oldPassword !== "" && changePassword.newPassword !== "")
        ) {
            setDisableButton(false);
        }
        const dataUpdateUser = {};
        const typeUpdate = {};
        dataUpdateUser.ID = user.ID;
        if (typeUpdateUser.Name === true && changeName !== user.Name) {
            dataUpdateUser.Name = changeName;
            typeUpdate.Name = "Name";
        } else {
            dataUpdateUser.Name = "";
        }
        if (typeUpdateUser.Avatar === true && changeAvatar !== user.Avatar) {
            dataUpdateUser.Avatar = changeAvatar;
            typeUpdate.Avatar = "Avatar";
        } else {
            dataUpdateUser.Avatar = "";
        }
        if (typeUpdateUser.Password === true && changePassword.oldPassword !== "" && changePassword.newPassword !== "" && changePassword.confirmPassword !== "") {
            dataUpdateUser.Password = {
                new: changePassword.newPassword,
                old: changePassword.oldPassword
            }
            typeUpdate.Password = "Password";
        } else {
            dataUpdateUser.Password = {old: "", new: ""}
        }
        confirmAlert({
        customUI: ({ onClose }) => {
            return (
            <div className={!minWidth ? styles.dialogConfirm : undefined}>
                <h2>Are you sure want to update?</h2>
                {
                    typeUpdate !== null ?
                    <>
                        <p>Update cover:</p>
                        <ul>
                            <li>{typeUpdate.Name !== undefined && "Name"}</li>
                            <li>{typeUpdate.Avatar !== undefined && "Avatar"}</li>
                            <li>{typeUpdate.Password !== undefined  && "Password"}</li>
                        </ul>
                    </> :
                    <p>No new information to update!</p>
                }
                <div className={styles.btn}>
                    <Button drop handleClick={() => handleUpdateUser(onClose, dataUpdateUser)}>Update Now!</Button>
                </div>
                <div className={styles.btn} onClick={onClose}>
                    <Button light handleClick={() => true}>Cancel</Button>
                </div>
            </div>
            );
        }
        });
    }, [changeAvatar, changeName, changePassword.confirmPassword, changePassword.newPassword, changePassword.oldPassword, handleUpdateUser, minWidth, typeUpdateUser.Avatar, typeUpdateUser.Name, typeUpdateUser.Password, user.Avatar, user.ID, user.Name]);
    const handleChangeTypePassWord = (type, data) => {
        type === "old" ?
        setTypePassword(pre => ({
            ...pre,
            old: data,
        })) :
        type === "new" ?
        setTypePassword(pre => ({
            ...pre,
            new: data,
        })) :
        setTypePassword(pre => ({
            ...pre,
            confirm: data,
        }))
    }
    const style = { color: "#FCEE21", fontSize: "30px" };
    const styleMin = { color: "#FCEE21", fontSize: "20px" };
    const styleAdd = { color: "#1e90ff", fontSize: "30px" };
    const styleUpload = { color: "#48dbfb", fontSize: "30px" };
    if(loading) return (
        <>
            <Loading />
        </>
    );
    return (
        <>
            <div className={styles.container}>
                <div className={clsx(styles.bigTitle)}>{user.Name}'s Profile </div>
                {
                    typeUser &&
                    <div className={styles.create}>
                        <Button edit handleClick={handleEU}>
                            {
                                min ? 
                                <RiUserSettingsLine style={styleMin} /> :
                                <RiUserSettingsLine style={style} />
                            }
                        </Button>
                    </div>
                }
                {
                    edit ?
                    <>
                        <div className={styles.boxUpdate}>
                            <div className={styles.boxUpdateChild}>
                                <input type="checkbox" id="Name" name="Name" defaultValue="Name" onChange={e => handleChangeTypeUpdate(e)} />
                                <label htmlFor="Name">Name</label>
                            </div>
                            {
                                typeUpdateUser.Name && (
                                    <>
                                        <input 
                                            className={styles.changeName} 
                                            type="text" 
                                            value={changeName} 
                                            onChange={e => handleChangeName(e)} 
                                        />
                                    </>
                                )
                            }
                            <div className={styles.boxUpdateChild}>
                                <input type="checkbox" id="Avatar" name="Avatar" defaultValue="Avatar" onChange={e => handleChangeTypeUpdate(e)} />
                                <label htmlFor="Avatar">Avatar</label>
                            </div>
                            {
                                typeUpdateUser.Avatar && (
                                    <>
                                        <div className={styles.boxUpdateAvatar}>
                                            {
                                                changeAvatar &&  (
                                                    <div className={styles.boxMedia}>
                                                        <div className={styles.delete} onClick={handleDeleteAvatar}>
                                                            <TiDeleteOutline style={style} />
                                                        </div>
                                                        <img src={changeAvatar} alt={user.Name} className={styles.image}/>
                                                    </div>
                                                )
                                            }
                                            {
                                                fileAvatar && !changeAvatar &&  (
                                                    <>
                                                        <div className={styles.boxMedia}>
                                                            <div className={styles.delete} onClick={handleDeleteFile}>
                                                                <TiDeleteOutline style={style} />
                                                            </div>
                                                            <div className={styles.update} onClick={handleUploadAvatar}>
                                                                <BiUpload style={styleUpload} />
                                                            </div>
                                                            <img src={fileAvatar.preview} alt={fileAvatar.name} className={styles.image}/>
                                                        </div>
                                                        <br/>
                                                    </>
                                                )
                                            }
                                            {
                                                !fileAvatar && !changeAvatar && (
                                                    <div className={styles.addition}>
                                                        <label htmlFor="file">
                                                            <IoMdAddCircleOutline style={styleAdd} onClick={e => handleAddMedia(e)} className={styles.icon} />
                                                        </label>
                                                        <input id="file" type="file" onChange={e => handleChangeFileAvatar(e)} className={styles.inputFile} />
                                                        <br />
                                                        <progress hidden value={progress} max="100" />
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </>
                                )
                            }
                            <div className={styles.boxUpdateChild}>
                                <input type="checkbox" id="Password" name="Password" defaultValue="Password" onChange={e => handleChangeTypeUpdate(e)} />
                                <label htmlFor="Password">Password</label>
                            </div>
                            {
                                typeUpdateUser.Password && (
                                    <>
                                        <div className={styles.boxInput}>
                                            <input 
                                                className={styles.changePass} 
                                                type={typePassword.old}
                                                value={changePassword.oldPassword}
                                                placeholder="Old Password" 
                                                onChange={e => handleChangePassword(e, "old")} 
                                            />
                                            <div className={styles.hiddenPassword}>
                                                {
                                                    typePassword.old === "password" ?
                                                    <AiOutlineEyeInvisible style={style} onClick={() => handleChangeTypePassWord("old", "text")} /> :
                                                    <AiOutlineEye style={style} onClick={() => handleChangeTypePassWord("old", "password")} />
                                                }
                                            </div>
                                        </div>
                                        <div className={styles.boxInput}>
                                            <input 
                                                className={styles.changePass} 
                                                type={typePassword.new} 
                                                value={changePassword.newPassword}
                                                placeholder="New Password"  
                                                onChange={e => handleChangePassword(e, "new")} 
                                            />
                                            <div className={styles.hiddenPassword}>
                                                {
                                                    typePassword.new === "password" ?
                                                    <AiOutlineEyeInvisible style={style} onClick={() => handleChangeTypePassWord("new", "text")} /> :
                                                    <AiOutlineEye style={style} onClick={() => handleChangeTypePassWord("new", "password")} />
                                                }
                                            </div>
                                        </div>
                                        {
                                            errPassword.new && <p className={styles.errMessage}>{errPassword.message[0]}</p>
                                        }
                                        <div className={styles.boxInput}>
                                            <input 
                                                className={styles.changePass} 
                                                type={typePassword.confirm}
                                                value= {changePassword.confirmPassword}
                                                placeholder="Confirm Password"  
                                                onChange={e => handleChangePassword(e, "confirm")} 
                                            />
                                            <div className={styles.hiddenPassword}>
                                                {
                                                    typePassword.confirm === "password" ?
                                                    <AiOutlineEyeInvisible style={style} onClick={() => handleChangeTypePassWord("confirm", "text")} /> :
                                                    <AiOutlineEye style={style} onClick={() => handleChangeTypePassWord("confirm", "password")} />
                                                }
                                            </div>
                                        </div>
                                        {
                                            errPassword.confirm && <p className={styles.errMessage}>{errPassword.message[1]}</p>
                                        }
                                    </>
                                )
                            }
                            <div className={styles.listBtn}>
                                <div className={styles.btn}>
                                    <Button edit handleClick={disableButton ? handleNotification : handleUpdate}>Update</Button>
                                </div>
                                <div className={styles.btn}>
                                    <Button light handleClick={handleCancel}>Cancel</Button>
                                </div>
                            </div>
                        </div>
                    </> :
                    <>
                        <div className={styles.boxAvatar}>
                            {user.Avatar ? 
                                <img src={user.Avatar} alt={user.Avatar} /> :
                                <img src="https://res.cloudinary.com/thankz/image/upload/v1642301145/LogoThankZ_h7brqq.png" alt="ThankZ" />
                            }
                        </div>
                        <div className={styles.boxInfo}>
                            <div className={styles.boxInfoChild}>
                                <h4>Name:</h4>
                                <h4>{user.Name}</h4>
                            </div>
                            <div className={styles.boxInfoChild}>
                                <h4>Birth of Date:</h4>
                                <h4>{user.DoB}</h4>
                            </div>
                            <div className={styles.boxInfoChild}>
                                <h4>Email:</h4>
                                <h4>{user.Email}</h4>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    );
}

export default User;