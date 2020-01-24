import React from 'react';
import { Route,Switch } from "react-router-dom";
import Alert from '../layout/Alert';
import Login from '../auth/Login';
import Register from '../auth/Register';
import ProfileDetail from '../profile/ProfileDetail';
import Dashboard from "../dashboard/Dashboard";
import CreateProfile from "../layout/profile-forms/CreateProfile";
import EditProfile from "../layout/profile-forms/EditProfile";
import AddEducation from "../layout/profile-forms/AddEducation";
import AddExperience from "../layout/profile-forms/AddExperience";
import Profiles from "../profile/Profiles";
import Posts from '../posts/Posts';
import Post from '../posts/Post';
import PrivateRoute from "./PrivateRoute";
import PageNotFound from "../layout/PageNotFound";

const Routes = () =>{
    return(
        <section className="container">
            <Alert/>
            <Switch>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/profiles' component={Profiles}/>
                <Route exact path='/profile/:id' component={ProfileDetail}/>
                <PrivateRoute exact path="/dashboard" component={ Dashboard }/>
                <PrivateRoute exact path="/create-profile" component={ CreateProfile }/>
                <PrivateRoute exact path="/edit-profile" component={ EditProfile }/>
                <PrivateRoute exact path="/add-education" component={ AddEducation }/>
                <PrivateRoute exact path="/add-experience" component={ AddExperience }/>
                <PrivateRoute exact path="/posts" component={ Posts }/>
                <PrivateRoute exact path="/posts/:id" component={ Post }/>
                <Route component={PageNotFound}/>

            </Switch>
        </section>
    )
}

export default Routes;