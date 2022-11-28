import React, {useContext, createContext, useMemo, useState} from "react";
import {  useNavigate } from "react-router";
import baseService from "../services/base.service";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [token, setToken] = useState(null);

    const navigate = useNavigate();

    const login = async(email, password) => {
        try {
          let response = await baseService.login(email, password);
          if(response.status === 200){
            const token = response.headers['authorization'];
            const user = response.data;
            if(token && user){
                window.localStorage.setItem('token', token);
                window.localStorage.setItem('user', JSON.stringify(user));
                setUser(user);
                setToken(token);
                navigate('/admin/dashboard')
            }
          }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    const logout = () => {
      baseService.logout().then(() => {
        console.log('Logout');
        navigate('/admin/login');
        setToken(null);
        setUser(null);
      }).catch((error) => {
        console.log(error);
      })
    }

    const value = useMemo(() => ({user, token, login, logout}), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
}
