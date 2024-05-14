import React, { useState, useEffect } from 'react';
import { getUserAccount } from '../services/userService';
import { toast } from 'react-toastify';

const UserContext = React.createContext(null);

const UserProvider = ({ children }) => {
    const userDefault = {
        isLoading: true,
        isAuthenticated: false,
        token: "",
        account: {}
    };

    const [user, setUser] = useState(userDefault);

    const loginContext = (userData) => {
        setUser({ ...userData, isLoading: false });
    };

    const logoutContext = () => {
        setUser({ ...userDefault, isLoading: false });
    }

    const parseJwt = (token) => {
        try {
          return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
          return null;
        }
    };

    const checkJWTExpire = () => {
        let result = false;
        let getJWT = localStorage.getItem('jwt');
        if(getJWT){
            let decodeJWT = parseJwt(getJWT);
            let currentDate  = new Date();

            if(decodeJWT.exp * 1000 < currentDate.getTime()) {
                //console.log('Token đã hết hạn hoặc không tồn tại')
                localStorage.removeItem('jwt'); //xóa localStorage
                return result 
            }
            else{
                //console.log('token còn hạn');
                result = true;
                return result
            }
        }
        else{
            return result
        }
    }

    const checkURLToAccess = (data) => {
        let check = true;
        if(window.location.pathname === '/list-doc' && data.account.departmentName === 'Phòng Giám đốc' && data.account.departmentHead === true 
        || window.location.pathname === '/list-doc' && data.account.departmentName === 'Phòng Hành chính quản trị' && data.account.departmentHead === true){
            return check;
        }

        else if(window.location.pathname === '/list-doc-department' && data.account.departmentName === 'Phòng Giám đốc' && data.account.departmentHead === true 
        || window.location.pathname === '/list-doc-department' && data.account.departmentName === 'Phòng Hành chính quản trị' && data.account.departmentHead === true){
            check = false
            return check;
        }

        else{
            console.log('trường hợp này chưa biết...')
        }
    }

    const fetchUser = async () => {
        let response = await getUserAccount();
        if(response === 401){
            //alert('Token đã hết hạn hoặc không tồn tại!');
            toast.error('Hãy đăng nhập để sử dụng chức năng này!');
            setUser({ ...userDefault, isLoading: false });
        }
        else{
            let userId = response.userId;
            let fullName = response.userFullName;
            let email = response.userEmail;
            let departmentId = response.department.department_ID;   
            let departmentName = response.department.department_Name;
            let departmentHead = response.department.department_Head;
            let departmentType = response.department.department_Type;

            let data = {
                isAuthenticated: true,
                account: {userId, fullName, email, departmentId, departmentName, departmentHead, departmentType}
            }

            // let check = checkURLToAccess(data);
            // console.log(check)
            setTimeout(() => {
                setUser(data);
            }, 1.5 * 1000)
        }
    }

    useEffect(() => {
        if (window.location.pathname !== '/' && window.location.pathname !== '/login-user') {
            let result = checkJWTExpire();
            if(result === true){
                fetchUser();
            }
            else{
                //không có token
                setUser({ ...user, isLoading: false });
            }
        }
        else if (window.location.pathname === '/' || window.location.pathname === '/login-user') {
            (async () => {
                try {
                    let response = await getUserAccount();
                    //không có token
                    if(response === 401){
                        setUser({ ...user, isLoading: false });
                    }
                    else{
                        let result = checkJWTExpire();
                        if(result === true){
                            let userId = response.userId;
                            let fullName = response.userFullName;
                            let email = response.userEmail;
                            let departmentId = response.department.department_ID;   
                            let departmentName = response.department.department_Name;
                            let departmentHead = response.department.department_Head;
                            let departmentType = response.department.department_Type;

                            let data = {
                                isAuthenticated: true,
                                account: {userId, fullName, email, departmentId, departmentName, departmentHead, departmentType}
                            }

                            setTimeout(() => {
                                setUser(data);
                            }, 1.5 * 1000)
                        }
                        else{
                            setUser({ ...user, isLoading: false });
                            
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            })();
        }
        else {
            setUser({ ...user, isLoading: false });
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, loginContext, logoutContext }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }