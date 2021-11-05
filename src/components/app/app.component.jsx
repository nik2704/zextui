import React from 'react';
import { NavLink as Link, Switch, Route } from 'react-router-dom';
// import fetch from 'node-fetch';
// import axios from 'axios';
// import https from 'https';
import { fetchSMAXData } from '../../utils/commonMethods';

// import child components
import { AppSimpleHeader } from '../appHeader';
import { renderSpinner, switchStateField } from '../../utils/commonMethods';

// export entry application component
export class App extends React.Component {
    constructor(props) {
        // console.log( 'App.constructor()' );
        super(props);

        this.state = { 
            token: '',
            spinner: false,
            mode: 'unknown',
            srcObj: {
                id: null,
                recType: null
            },
            tgtObj: {
                id: null,
                recType: null
            },
            fileList: [],
            originalQuery: {
                mapKey: null,
                mapName: null,
                x: null,
                y: null
            },
            selectedMap: {
                id: null,
                fileName: null
            },
            selectedPoint: {
                x: null,
                y: null
            },
            fetchedData: {}
        };

        this.renderSpinner = renderSpinner.bind(this);
        this.switchStateField = switchStateField.bind(this);
    }
  
    static fetchData = ( fetchParams ) => {
        return fetchSMAXData(fetchParams);
    }
    
    componentDidMount() {
        if (window.initial_state) {
            console.log(window.initial_state);
            this.switchStateField(
                ['srcObj', 'tgtObj', 'queryCoords', 'fetchedData'],
                [
                    window.initial_state.requestData.srcObj,
                    window.initial_state.requestData.tgtObj,
                    window.initial_state.requestData.queryCoords,
                    window.initial_state.fetchedData
                ]);
        }
    }
    // render view
    render() {
        // console.log( 'App.render()' );

        return (
            <div className='ui container'>
                <AppSimpleHeader title={this.state.selectedMap.id === null ? `SELECT Location Diagram` : `Location Diagram (${this.state.selectedMap.fileName})`}/>
                {/* navigation */}
                <div className='ui-app__navigation'>
                    <Link
                        className='ui-app__navigation__link'
                        activeClassName='ui-app__navigation__link--active'
                        to='/'
                        exact={ true }
                    >{`Counter ${this.token}`}</Link>

                </div>               
            </div>
        );
    }
}