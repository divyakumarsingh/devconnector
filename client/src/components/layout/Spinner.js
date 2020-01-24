import React,{Fragment} from 'react';
import loader from '../../img/loader.gif'

const Spinner = () => (
    <Fragment>
        <img
            src={ loader }
            alt="Loading"
        />
    </Fragment>
)

export default Spinner;