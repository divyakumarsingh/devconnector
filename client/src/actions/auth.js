import axios from 'axios';
import { REGISTER_SUCCESS,REGISTER_FAIL,USER_LOADED,AUTH_ERROR,LOGIN_SUCCESS,LOGIN_FAIL,LOGOUT,CLEAR_PROFILE } from './types';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import constant from '../utils/constant';


export const loadUser=()=>async dispatch=>{
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try{
        const res=await axios.get(constant.URL+'/api/auth');
        dispatch({
            type:USER_LOADED,
            payload:res.data.user
        });
    }catch(err){
        dispatch({ type:AUTH_ERROR })
    }
}

//Register user
export const register=({ name,email,password })=>async dispatch=>{
    const config={
        headers:{
            "Content-Type":"application/json"
        }
    }

    const body=JSON.stringify({ name,email,password });

    try{
        const  res =await axios.post(constant.URL+'/api/user/register',body,config);
        dispatch({
            type:REGISTER_SUCCESS,
            payload:res.data
        });
        dispatch(loadUser());
    } catch(err){
        if(err && err.response && err.response.data.errors.errors){
            const errors=err.response.data.errors.errors;
            if(errors){
                errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
            }
        }
        dispatch({
            type:REGISTER_FAIL,
        });
    }   
}


//Login user
export const login=(email,password)=>async dispatch=>{
    const config={
        headers:{
            "Content-Type":"application/json"
        }
    }

    const body=JSON.stringify({ email,password });

    try{
        const  res =await axios.post(constant.URL+'/api/auth',body,config);
        dispatch({
            type:LOGIN_SUCCESS,
            payload:res.data
        });
        dispatch(loadUser());
    } catch(err){
        if(err && err.response && err.response.data.errors.errors){
            const errors=err.response.data.errors.errors;
            if(errors){
                errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
            }
        }

        dispatch({
            type:LOGIN_FAIL,
        });
    }   
}

export const logout=()=> async dispatch=>{
    dispatch({type:CLEAR_PROFILE});
    dispatch({type:LOGOUT});
}