import React,{Fragment} from 'react';
import {Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {PropTypes} from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = (props) => {
    console.log(props);
    const authLinks=(
        <ul>
            <li>
                <Link to="/profiles">
                    <span>Developers</span>
                </Link>
            </li>
            <li>
                <Link to="/posts">
                    <span>Posts</span>
                </Link>
            </li>
            <li>
                <Link to="/dashboard">
                    <i className="fas fa-user"></i>{' '}
                    <span className="hide-sm">Dashboard</span>
                </Link>
            </li>
            <li>
                <a onClick={()=>props.logout()}>
                    <i className="fas fa-sign-out-alt"></i>{' '}
                    <span className="hide-sm">Logout</span>
                </a>
            </li>
        </ul>
    );

    const guestLinks=(
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    );

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/">
                    <i className="fas fa-code"></i> DevConnector
                </Link>
            </h1>
            { !props.loading && <Fragment>{ props.isAuthenticated?authLinks:guestLinks }</Fragment>  }
        </nav>
    );
}

Navbar.propType={
    isAuthenticated:PropTypes.bool,
    loading:PropTypes.bool
};

const mapStateToProps=state=>({
    isAuthenticated:state.auth.isAuthenticated,
    loading:state.auth.loading
});

const mapActionToProps={
    logout: logout
};

export default connect(mapStateToProps,mapActionToProps) (Navbar);