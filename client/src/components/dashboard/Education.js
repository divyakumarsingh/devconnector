import React,{ Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from "react-moment";
import { connect } from 'react-redux';
import { deleteEducation } from '../../actions/profile';

const Education=({ education,deleteEducation })=>{
    const educations=(
        education.length===0?(
            <tr key={ 1 }>
                <td colSpan="4">No education added</td>
            </tr>
        )
        :
        (
            education.map(edu=>{
                return(
                    <tr key={ edu._id }>
                        <td>{edu.school}</td>
                        <td className="hide-sm">{edu.degree}</td>
                        <td>
                            <Moment format='YYYY/MM/DD'>{ edu.from }</Moment> -{
                                edu.to===null?('Now'):(<Moment format='YYYY/MM/DD'>{ edu.to }</Moment>)
                            }
                        </td>
                        <td>
                            <button className="btn btn-danger" onClick={ ()=> deleteEducation( edu._id)  }>Delete</button>
                        </td>
                    </tr>
                )
            })
        )
    );

    return(
        <Fragment>
            <h2 className="my-2">Education</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Company</th>    
                        <th className="hide-sm">Title</th>    
                        <th className="hide-sm">Years</th>    
                        <th className="hide-sm">Delete</th>    
                    </tr>
                </thead>
                <tbody>
                    {educations}
                </tbody>
            </table>
        </Fragment>
    );
}


Education.propTypes={
    education:PropTypes.array.isRequired,
    deleteEducation:PropTypes.func
}

const mapActionToProps={
    deleteEducation
}

export default connect(null,mapActionToProps)(Education);