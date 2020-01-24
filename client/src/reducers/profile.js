import { GET_PROFILE,GET_PROFILES,GET_REPOS,PROFILE_ERROR,CLEAR_PROFILE } from "../actions/types"; 

const initialState={
    profile:null,
    profiles:[],
    repos:[],
    loading:true,
    error:{},
}

export default (state=initialState,action)=>{
    const {type,payload}=action;

    switch(type){
        case GET_PROFILE:
            return {
                ...state,
                profile:payload,
                loading:false,
                error:{}
            }
        case GET_PROFILES:
            return {
                ...state,
                profiles:payload,
                loading:false,
            }
        case GET_REPOS:
            return {
                ...state,
                repos:payload,
                loading:false,
            }
        case PROFILE_ERROR:
            return{
                ...state,
                error:payload,
                loading:false
            }
        case CLEAR_PROFILE:
            return{
                ...state,
                profiles:[],
                repos:[],
                loading:false,
                error:{},
            }
        default:{
            return state;
        }
    }
}



