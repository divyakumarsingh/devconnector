import axios from 'axios';
import {GET_PROFILE,PROFILE_ERROR,CLEAR_PROFILE,ACCOUNT_DELETED,GET_PROFILES,GET_REPOS} from './types';
import Constant from '../utils/constant';
import { setAlert } from './alert';

//Get the profile of the current user
export const getCurrentProfile=()=>async dispatch=>{
    try{
        const res= await axios.get(Constant.URL+'/api/profile/me');
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });
    }catch(err){
        console.log(err.response);
        dispatch({
            type:PROFILE_ERROR,
            payload: err.response
        });
    }   
}

//create or edit profile of the current user
export const createProfile=(formData,history,edit=false)=>async dispatch=>{
    try{
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }

        const res= await axios.post(Constant.URL+'/api/profile/update',formData,config);
        dispatch({
            type:GET_PROFILE,
            payload:res.data
        });

        dispatch(setAlert(edit?"Profile updated successfully":"Profile created successfully","success"));

        if(!edit){
            history.push('/dashboard');
        }
    }catch(err){        
        const errors=err.response.data.errors;
        if(errors){
            errors.errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
            return;
        }

        dispatch({
            type:PROFILE_ERROR,
            payload: err
        });
    }   
}

//Add experience to the profile
export const addExperience=(formData,history)=>async dispatch=>{
    try{
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }

        const res= await axios.put(Constant.URL+'/api/profile/experience',formData,config);
        dispatch({
            type:GET_PROFILE,
            payload:res.data.profile
        });

        dispatch(setAlert(res.data.msg,"success"));
        history.push('/dashboard');
    }catch(err){    
        const errors=err.response.data.errors;
        if(errors){
            errors.errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
            return;
        }

        dispatch({
            type:PROFILE_ERROR,
            payload: err
        });
    }   
}

//Add education to the profile
export const addEducation=(formData,history)=>async dispatch=>{
    try{
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }

        const res= await axios.put(Constant.URL+'/api/profile/education',formData,config);
        dispatch({
            type:GET_PROFILE,
            payload:res.data.profile
        });

        dispatch(setAlert(res.data.msg,"success"));
        history.push('/dashboard');
    }catch(err){        
        const errors=err.response.data.errors;
        if(errors){
            errors.errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
            return;
        }

        dispatch({
            type:PROFILE_ERROR,
            payload: err
        });
    }   
}

// Delete experience
export const deleteExperience=id=> async dispatch =>{
    try{
        const res= await axios.delete(Constant.URL+`/api/profile/experience/${id}`);
        dispatch({
            type: GET_PROFILE,
            payload:res.data.profile
        });
        dispatch(setAlert(res.data.msg,"success"));
    } catch(err){
        dispatch({
            type:PROFILE_ERROR,
            payload: err
        });
    }
}

// Delete experience
export const deleteEducation=id=> async dispatch =>{
    try{
        const res= await axios.delete(Constant.URL+`/api/profile/education/${id}`);
        dispatch({
            type: GET_PROFILE,
            payload:res.data.profile
        });
        dispatch(setAlert(res.data.msg,"success"));
    } catch(err){
        dispatch({
            type:PROFILE_ERROR,
            payload: err
        });
    }
}

// Delete account an profile
export const deleteAccount =()=>async dispatch=>{
    if(window.confirm("Are you sure you want to delete your account?")){
        try{
            const res=await axios.delete(Constant.URL+'/api/profile');
            dispatch({ type:CLEAR_PROFILE });
            dispatch({ type:ACCOUNT_DELETED });

            dispatch(setAlert(res.data.msg,"success"));
        }catch(err){
            dispatch({
                type:PROFILE_ERROR,
                payload: err
            });
        }   
    }
}

//Get profiles 
export const getProfiles=()=> async dispatch =>{
    try{
        const res=await axios.get(Constant.URL+'/api/profile');

        dispatch({
            type:GET_PROFILES,
            payload: res.data
        });
    }catch(err){
        dispatch({
            type: PROFILE_ERROR,
            payload:err
        });
    }
}

//Get profiles using user id
export const getProfileById=(userId)=> async dispatch =>{
    dispatch({  type:CLEAR_PROFILE });

    try{
        const res=await axios.get(Constant.URL+`/api/profile/user/${userId}`);

        dispatch({
            type:GET_PROFILE,
            payload: res.data
        });
    }catch(err){
        dispatch({
            type: PROFILE_ERROR,
            payload:err
        });
    }
}


//Get get repos
export const getGithubRepos=(username)=> async dispatch =>{
    try{
        const res=await axios.get(Constant.URL+`/api/profile/github/${username}`);

        dispatch({
            type:GET_REPOS,
            payload: res.data
        });
    }catch(err){
        dispatch({
            type: PROFILE_ERROR,
            payload:err
        });
    }
}
