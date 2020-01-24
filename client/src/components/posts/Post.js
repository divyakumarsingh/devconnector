import React,{ Fragment,useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getPost } from '../../actions/post';
import PostItem from './PostItem';
import CommentItem from './CommentItem';
import CommentForm  from './CommentForm';
import { Link } from 'react-router-dom';

const Post=({ getPost,post:{ post,loading },match })=>{
    useEffect(()=>{
        getPost(match.params.id);
    },[getPost]);

    return(
        <Fragment>
            {
                loading? 
                    <Spinner/>
                :
                <Fragment> 
                    <div className="Post">
                        <Link to="/posts" className="btn btn-success">Back to posts</Link>
                        {   
                            post &&
                            <Fragment>
                                <PostItem key={ post._id } post={ post } showAction={ false } />  
                                <CommentForm postId={ post._id } /> 
                                {post.comments.map(comment=>(
                                    <CommentItem key={ comment._id } comment={ comment } postId={ post._id }/>
                                ))} 
                            </Fragment>
                        }
                    </div>
                </Fragment>
            }
        </Fragment>
    )
}

Post.propTypes={
    getPost:PropTypes.func.isRequired,
    post:PropTypes.object.isRequired
};

const mapStateToProps= state=>({
    post:state.post
});

const mapActionToProps= {
    getPost
}

export default connect(mapStateToProps,mapActionToProps) (Post);