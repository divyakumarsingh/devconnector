import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = (props) =>
    props.alerts!==undefined && 
    props.alerts.length>0 && 
    props.alerts.map(alert=> (
            <div key={ alert.id } className={`alert alert-${ alert.alertType }` } >
                { alert.msg }
            </div>
        )
    );

Alert.propType={
    alerts:PropTypes.array.isRequired
}; 

const mapStateToProps=(state)=>({
    alerts:state.alerts
})

export default connect(mapStateToProps)(Alert);