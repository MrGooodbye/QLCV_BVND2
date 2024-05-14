import React from 'react';
import './Login_Template/vendor/bootstrap/css/bootstrap.min.css';
import './Login_Template/fonts/font-awesome-4.7.0/css/font-awesome.min.css';
import './Login_Template/fonts/iconic/css/material-design-iconic-font.min.css';
import './Login_Template/vendor/animate/animate.css';
import './Login_Template/vendor/css-hamburgers/hamburgers.min.css';
import './Login_Template/vendor/animsition/css/animsition.min.css';
import './Login_Template/vendor/select2/select2.min.css';
import './Login_Template/css/util.css';
import './Login_Template/css/main.css';
import image from './Login_Template/images/logo.png';

import './SCSS/Login.scss';
import { useState, useEffect, useContext, useDef } from 'react';
import { toast } from 'react-toastify';
import { userLogin } from "../../services/userService";
import { useHistory } from "react-router-dom";
import { UserContext } from '../../context/UserContext';


const LoginUser = () => {
    const { user, loginContext } = useContext(UserContext);

    let history = useHistory();

    const [valueUserName, setValueUserName] = useState("");
    const [valuePassword, setValuePassword] = useState("");

    const [inputType, setInputType] = useState('password');
    const [isChange, setIsChange] = useState('fa fa-eye-slash');

    const defaultObjValidInput = {
        isValidUserName: true,
        isValidPassword: true
    }
    const [objValidInput, setObjValidInput] = useState(defaultObjValidInput)

    const showPassword = () => {
        //console.log('da click'); 
        setInputType(inputType === 'password' ? 'text' : 'password');
        setIsChange(isChange === 'fa fa-eye' ? 'fa fa-eye-slash' : 'fa fa-eye');
    }

    const handlePressEnter = (event) => {
        if (event.which === 13 && event.code === "Enter") {
            btnDangNhap();
        }
    }

    const btnDangNhap = async () => {
        setObjValidInput(defaultObjValidInput);

        if (!valueUserName) {
            setObjValidInput({ ...defaultObjValidInput, isValidUserName: false })
            toast.error('Hãy nhập tên tài khoản!');
            ///setClassInvalid(classInvalid === 'form-control' ? 'form-control is-invalid' : 'form-control');
            return;
        }

        if (!valuePassword) {
            setObjValidInput({ defaultObjValidInput, isValidPassword: false })
            toast.error('Hãy nhập mật khẩu!');
            //setClassInvalid(classInvalid === 'form-control' ? 'form-control is-invalid' : 'form-control');
            return;
        }

        let response = await userLogin(valueUserName, valuePassword);
        if (response === 400) {
            toast.error('Tài khoản hoặc mật khẩu không chính xác!');
        }
        else {
            toast.success(`Xin chào ${response.userFullName}!`)

            let userId = response.userId;
            let fullName = response.userFullName;
            let email = response.userEmail;
            let departmentId = response.department.department_ID;
            let departmentName = response.department.department_Name;
            let departmentHead = response.department.department_Head;
            let departmentType = response.department.department_Type;

            //cập nhật lại giá trị của biến context global, biến data sẽ ghi đè lên biến user đang dùng state trong file UserContext
            let data = {
                isAuthenticated: true,
                account: { userId, fullName, email, departmentId, departmentName, departmentHead, departmentType }
            }

            localStorage.setItem('jwt', response.tokenDTO.token);
            loginContext(data);
            history.push('/');
        }
    }

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập khi component được render
        if (user && user.isAuthenticated === true) {
            history.push("/");
        }

        let session = localStorage.getItem("jwt");
        if (session) {
            history.push("/");
        }
    }, [user, history]);

    return (
        <div className='container-login-form' id='login-form' style={{ height: '100%' }}>
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <form className="login100-form validate-form">
                            <span className="login100-form-title p-b-26 text-uppercase text-primary">
                                Đăng nhập
                            </span>
                            <span className="login100-form-title p-b-48">
                                <img src={image} className="rounded" style={{ width: "10rem" }} />
                            </span>

                            <div className="wrap-input100">
                                <input className={objValidInput.isValidUserName ? 'form-control' : 'is-invalid form-control'} type="text" name="userName" placeholder='Tên người dùng' value={valueUserName} autoComplete='off' onChange={(event) => { setValueUserName(event.target.value) }} />
                            </div>

                            <div className="wrap-input100 ">
                                <span className="btn-show-pass" onClick={() => showPassword()}>
                                    <i className={isChange}></i>
                                </span>
                                <input
                                    type={inputType}
                                    className={objValidInput.isValidPassword ? 'form-control' : 'is-invalid form-control'}
                                    name="password"
                                    placeholder='Mật khẩu'
                                    value={valuePassword}
                                    onChange={(event) => { setValuePassword(event.target.value) }}
                                    onKeyDown={(event) => handlePressEnter(event)}
                                />
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"></div>
                                    <button type='button' className="login100-form-btn btn btn-primary" onClick={() => btnDangNhap()}>
                                        Đăng nhập
                                    </button>
                                </div>
                            </div>

                            <div className="text-center p-t-40">
                                <span className="fw-normal mr-1">
                                    Chưa có tài khoản?
                                </span>

                                <a className="fw-bolder" href="#" style={{ textDecoration: "none", fontSize: "16px" }}>
                                    Đăng ký
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginUser

