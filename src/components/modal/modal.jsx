import React from 'react';
import ReactDOM from 'react-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

export const Modal = props => {
    const {title} = props;
    return  ReactDOM.createPortal(
        <div
            // onClick={() => history.push('')}
            // onClick={props.onDismiss}
            className='ui dimmer modals visible active'
        >
            <div
                // onClick={(event)=> event.stopPropagation()}
                className='ui standard modal visible active'
            >
                <div className='header'>{title}</div>
                <div className='content'>
                    <div className="ui center aligned container">
                        <CircularProgress />
                    </div>
                </div>
                {/* <div className='actions'>
                    {actions}
                </div> */}
            </div>
        </div>,
        document.querySelector('#modal')
    );
}
