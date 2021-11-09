import React from 'react';
//import { switchStateField } from '../utils/commonMethods';

export class AppHeader extends React.Component {

    buttonClick(btnType) {
        switch (btnType) {
            case 'edit':
                this.props.switchStateField(['mode', 'previousMode'], ['mapselection', this.props.state.mode]);
                break;
            case 'cancel':
                this.props.switchStateField(['mode', 'previousMode', 'selectedMap', 'tmpSelectedMap'], [
                    this.props.state.previousMode,
                    this.props.state.mode,
                    this.props.state.tmpSelectedMap,
                    { id: null, file_name: null }
                ]);             
                break;
            case 'save':
                this.props.switchStateField(['mode', 'tmpSelectedMap'], [
                    'mapview',
                    { id: null, file_name: null }
                ]);             
                break;
            default:
                break;
        }
    }


    getButtonClass() {
        if (this.props.state.tmpSelectedMap.id !== null) return '';
        return 'disabled';
    }

    renderButton() {
        if (this.props.state.mode === 'mapview') {
            return (
                <button className={`ui compact icon button`} onClick={() => this.buttonClick('edit')}>
                    <i className="cog icon"></i>
                </button> 
            )    
        }

        if (this.props.state.mode === 'mapselection') {
            return (
                <React.Fragment>
                    <button className={`ui compact icon button green ${this.getButtonClass()}`} onClick={() => this.buttonClick('save')}>
                        <i className="check icon"></i>
                    </button>
                    <button className={`ui compact icon button red ${this.getButtonClass()}`} onClick={() => this.buttonClick('cancel')}>
                        <i className="undo icon"></i>
                    </button>
                </React.Fragment>
            )
        }

        return '';
    }

    render() {    
        return ( 
            <div className='ui container'>
                <br />
                    {this.renderButton()}
                <br />
            </div>

        )    
    }
};
