import React,{ useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { getCurrentProfile,deleteAccount } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import {Link} from 'react-router-dom';
import DashboardAction from './DashboardAction';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({ getCurrentProfile,deleteAccount,auth:{ user },profile }) => {
    useEffect(()=>{
        getCurrentProfile();
    },[getCurrentProfile]);

    return profile.loading && profile.profile==null ? 
        <Spinner/>
        :
        <Fragment>
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead">
                <i className="fas fa-user"> Welcome { user && user.name }</i>
            </p>
            {   
                profile.profile!==null?
                (
                    <Fragment>
                        <DashboardAction/>
                        <Experience experience={profile.profile.experience}/>
                        <Education education={profile.profile.education}/>
                    </Fragment>
                )
                :
                (
                    <Fragment>
                        <p>You have not set up your profile yet. Please set up your profile</p>
                        <Link to="/create-profile" className="btn btn-primary my-1">
                            Create Profile
                        </Link>
                    </Fragment>
                )
            }
        
            <div className="my-2">
                <button className="btn btn-danger" onClick={()=> deleteAccount() }>
                    <i className="fas fa-user-minus"></i>Delete my account
                </button>
            </div>
        </Fragment> 
}

Dashboard.propTypes ={
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps=(state)=>({
    auth: state.auth,
    profile: state.profile
})

const mapActionToProps={
    getCurrentProfile,
    deleteAccount
}

export default connect(mapStateToProps,mapActionToProps)(Dashboard);