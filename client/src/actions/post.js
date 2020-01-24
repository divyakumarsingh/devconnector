import axios from 'axios';
import { setAlert } from './alert';
import { GET_POSTS,POST_ERROR,UPDATE_LIKES,DELETE_POST,ADD_POST,GET_POST,ADD_COMMENT,REMOVE_COMMENT } from "../actions/types";
import Constant from '../utils/constant';

//Get posts
export const getPosts=()=>async dispatch=>{
    try {
        const res=await axios.get(Constant.URL+'/api/post');
        dispatch({
            type: GET_POSTS,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:err
        });
    }
}

//Get posts
export const getPost=(id)=>async dispatch=>{
    try {
        const res=await axios.get(Constant.URL+`/api/post/${id}`);
        dispatch({
            type: GET_POST,
            payload:res.data
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:err
        });
    }
}

//Delete post
export const deletePost=(postId)=>async dispatch=>{
    try {
        const res=await axios.delete(Constant.URL+`/api/post/${postId}`);

        dispatch({
            type: DELETE_POST,
            payload: postId
        });

        dispatch(setAlert('Post deleted successfully',"success"));
    } catch (err) {
        console.log(err);
        dispatch({
            type: POST_ERROR,
            payload:err
        });
    }
}

//Add post
export const addPost=(formData)=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }

    try 
    {
        const res=await axios.post(Constant.URL+`/api/post`,formData,config);

        dispatch({
            type: ADD_POST,
            payload: res.data.post
        });

        dispatch(setAlert(res.data.msg,"success"));
    } catch (err) {
        if(err && err.response && err.response.data.errors.errors){
            const errors=err.response.data.errors.errors;
            if(errors){
                errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
            }
        }
        dispatch({
            type: POST_ERROR,
            payload:err
        });
    }
}


//Like a post
export const addLike=(postId)=>async dispatch=>{
    try {
        const res=await axios.put(Constant.URL+`/api/post/like/${postId}`);
        dispatch({
            type: UPDATE_LIKES,
            payload:{ postId,likes:res.data.likes }
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:err
        });
    }
}

//Unlike a post
export const removeLike=(postId)=>async dispatch=>{
    try {
        const res=await axios.put(Constant.URL+`/api/post/unlike/${postId}`);
        
        dispatch({
            type: UPDATE_LIKES,
            payload:{ postId,likes:res.data.likes }
        });
    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload:err
        });
    }
}

//Add Comment
export const addComment=(postId,formData)=>async dispatch=>{
    const config={
        headers:{
            'Content-Type':'application/json'
        }
    }

    try 
    {
        const res=await axios.post(Constant.URL+`/api/post/comment/${postId}`,formData,config);
        dispatch({
            type: ADD_COMMENT,
            payload: res.data.comments
        });

        dispatch(setAlert(res.data.msg,"success"));
    } catch (err) {
        if(err && err.response && err.response.data && err.response.data.errors.errors){
            const errors=err.response.data.errors.errors;
            if(errors){
                errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
            }
        }
        dispatch({
            type: POST_ERROR,
            payload:err
        });
    }
}

//Remove Comment
export const removeComment=(postId,commentId)=>async dispatch=>{
    try 
    {
        const res=await axios.delete(Constant.URL+`/api/post/comment/${postId}/${commentId}`);
        dispatch({
            type: REMOVE_COMMENT,
            payload: commentId
        });

        dispatch(setAlert(res.data.msg,"success"));
    } catch (err) {
        if(err && err.response && err.response.data && err.response.data.errors && err.response.data.errors.errors){
            const errors=err.response.data.errors.errors;
            if(errors){
                errors.forEach(error=>dispatch(setAlert(error.msg,'danger')));
            }
        }
        dispatch({
            type: POST_ERROR,
            payload:err
        });
    }
}

