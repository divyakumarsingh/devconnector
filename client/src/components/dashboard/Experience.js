import React,{ Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from "react-moment";
import { connect } from 'react-redux';
import { deleteExperience } from '../../actions/profile';

const Experience=({ experience,deleteExperience })=>{
    const experiences=(
        experience.length===0?(
            <tr key={ 1 }>
                <td colSpan="4">No experience added</td>
            </tr>
        )
        :
        (
            experience.map(exp=>{
                return(
                    <tr key={ exp._id }>
                        <td>{exp.company}</td>
                        <td className="hide-sm">{exp.title}</td>
                        <td>
                            <Moment format='YYYY/MM/DD'>{ exp.from }</Moment> -{
                                exp.to===null?('Now'):(<Moment format='YYYY/MM/DD'>{ exp.to }</Moment>)
                            }
                        </td>
                        <td>
                            <button className="btn btn-danger" onClick={ ()=> deleteExperience( exp._id)  }>Delete</button>
                        </td>
                    </tr>
                )
            })
        )
    )

    return(
        <Fragment>
            <h2 className="my-2">Experience</h2>
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
                    {experiences}
                </tbody>
            </table>
        </Fragment>
    );
}


Experience.propTypes={
    experience:PropTypes.array,
    deleteExperience:PropTypes.func
}

const mapActionToProps={
    deleteExperience
}

export default connect(null,mapActionToProps)(Experience);