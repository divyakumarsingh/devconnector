import React,{ Fragment,useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';
import { getProfileById } from '../../actions/profile';

const  ProfileDetail = ({ getProfileById,profile:{ profile,loading },auth,match,...props })=>{
    useEffect(()=>{
        getProfileById(match.params.id);
    },[ getProfileById,match.params.id ]);

    return (
        <Fragment>
            {profile===null || loading ? 
                <Spinner/> 
                :
                <Fragment>
                    <Link to="/profiles" className="btn btn-danger">Back to profiles</Link>
                    {
                        auth.isAuthenticated && 
                        auth.loading === false &&
                        auth.user._id === profile.user._id &&
                        <Link to='/edit-profile'  className="btn btn-danger">Edit Profile</Link>
                    }
                    
                    <div className="profile-grid my-1">
                        <ProfileTop profile={ profile }/>
                        <ProfileAbout profile={ profile }/>
                        <div className="profile-exp bg-white p-2">
                            <h2 className="text-primary">Experience</h2>
                            {profile.experience.length>0 ? 
                                (
                                    <Fragment>
                                        {profile.experience.map(exp=>(
                                            <ProfileExperience experience={ exp } key={ exp._id }/>
                                        ))}
                                    </Fragment>
                                )
                                :
                                (<h4>No experience</h4>)
                            }
                        </div>
                        <div className="profile-edu bg-white p-2">
                            <h2 className="text-primary">Education</h2>
                            {profile.education.length>0 ? 
                                (
                                    <Fragment>
                                        {profile.education.map(edu=>(
                                            <ProfileEducation education={ edu } key={ edu._id }/>
                                        ))}
                                    </Fragment>
                                )
                                :
                                (<h4>No experience</h4>)
                            }
                        </div>
                        <div>
                            {profile.githubusername 
                                &&  <ProfileGithub username={profile.githubusername}/>
                            }
                        </div>
                    </div>       
                </Fragment>
            }
        </Fragment>
    )
}

ProfileDetail.propTypes={
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired
}

const mapStateToProps=state=>({
    profile:state.profile,
    auth:state.auth
});

const mapActionToProps={
    getProfileById
}

export default connect(mapStateToProps,mapActionToProps) (ProfileDetail)