import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SvgLoader } from 'react-svgmt';

import { Modal } from '../../modal';
// import history from '../../../utils/history';

/**
 * Loading the svg file using react-svgmt
 * @param props
 * @returns {*}
 * @constructor
 */
const ReactSvgPanZoomLoader = (props) => {
    const [showModal, setShowModal] = useState(true);

    const renderModal = () => {
        if (showModal === false) return '';
    
        return (
            <Modal
                title='Loading SVG file from SMAX attachment'
                // onDismiss={() => history.push('')}
            />
        )    
    }

    return (
        <div>
            {props.render(
                <SvgLoader path={props.src} onSVGReady={(svgnode) => {
                        setShowModal(false);
                        props.doDraw()
                    }}>
                    {props.proxy}
                </SvgLoader>
            )}
            {renderModal()}
        </div>
    )
}

ReactSvgPanZoomLoader.defaultProps = {
    proxy: ""
}

ReactSvgPanZoomLoader.propTypes = {
    src: PropTypes.string.isRequired,
    render: PropTypes.func.isRequired,
    proxy: PropTypes.node
}

export {ReactSvgPanZoomLoader}
