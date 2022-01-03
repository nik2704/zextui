import React from 'react';
// import { NavLink as Link, Switch, Route } from 'react-router-dom';
// import fetch from 'node-fetch';
// import axios from 'axios';
// import https from 'https';
import { fetchSMAXData } from '../../utils/commonMethods';

// import child components
import { AppHeader } from '../appHeader';
import { AppSimpleHeader } from '../appSimpleHeader';
import { MapList } from '../mapList';
import { SchemaView } from '../schemaView';
import { renderSpinner, switchStateField } from '../../utils/commonMethods';

// export entry application component
export class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            cfg: {},
            token: null,
            spinner: false,
            originalUrl: '/',
            mode: 'unknown',
            showOtherCIs: false,
            previousMode: 'unknown',
            currentCi: {},
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
                file_name: null
            },
            tmpSelectedMap: {
                id: null,
                file_name: null
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
        let mode = 'mapselection';

        if (window.initial_state) {
            //console.log(window.initial_state);

            let selectedMap = null,
                currentCi = null,
                mapKey = window.initial_state.requestData.queryCoords.mapKey,
                currentCiId =  window.initial_state.requestData.srcObj.id;

            if (window.initial_state.token !== null) {

                if (Object.keys(window.initial_state.fetchedData.ciColocated).length > 0) {
                    if (window.initial_state.fetchedData.ciColocated.entities.length > 0) {
                        currentCi = window.initial_state.fetchedData.ciColocated.entities.find(item => item.properties.Id === currentCiId );
                        if (typeof currentCi === "object" && currentCi.properties.id) {
                            mode = 'mapview';
                        }
                    }
                }

                if (mapKey !== null) {
                    if (Object.keys(window.initial_state.fetchedData.locationFiles).length > 0) {
                        if (window.initial_state.fetchedData.locationFiles.length > 0) {
                            selectedMap = window.initial_state.fetchedData.locationFiles.find(item => item.id === mapKey );

                            if (typeof selectedMap === "object" && selectedMap.id) {
                                mode = 'mapview';
                            }
                        } else {
                            mode = 'error';
                        }
                    } else {
                        mode = 'error';
                        //mode = 'wrongmap';
                    }
                } else {
                    if (Object.keys(window.initial_state.fetchedData.locationFiles).length === 0) {
                        mode = 'nomaps';
                    }
                }
            } else {
                mode = 'error';
            }

            let stateFields = ['cfg', 'token','srcObj', 'tgtObj', 'queryCoords', 'fetchedData', 'originalUrl', 'mode'];
            let stateValues = [
                window.initial_state.cfg,
                window.initial_state.token,
                window.initial_state.requestData.srcObj,
                window.initial_state.requestData.tgtObj,
                window.initial_state.requestData.queryCoords,
                window.initial_state.fetchedData,
                window.initial_state.originalUrl,
                mode
            ];

            if (currentCi !== null) {
                stateFields.push('currentCi');
                stateValues.push(currentCi);    
            };

            if (mode === 'mapview') {
                stateFields.push('selectedMap');
                stateValues.push({ id: selectedMap.id, file_name: selectedMap.file_name });

                if (window.initial_state.requestData.queryCoords.x !== null && window.initial_state.requestData.queryCoords.y !== null) {
                    stateFields.push('selectedPoint');
                    stateValues.push({ x: window.initial_state.requestData.queryCoords.x, y: window.initial_state.requestData.queryCoords.y});    
                }
            }

            this.switchStateField(
                stateFields,
                stateValues
            );
        }
    }
    // render view
    getHeaderText = () => {
        let msg = 'Data loading...';

        switch (this.state.mode) {
            case 'unknown':
                msg = 'The data is being prepared';
                break;
            case 'mapview':
                msg = `View the location file ${this.state.selectedMap.file_name}`;
                break;
            case 'mapselection':
                msg = 'SELECT a map from the list';
                break;
            case 'nomaps':
                msg = 'There is no map attached to the Location...'
                break;
            default:
                msg = 'ERROR';
                break;
        }

        return msg;
    }

    renderContent() {
        if (this.state.mode === 'mapview') {
            return (
                <SchemaView
                    state={this.state}
                    switchStateField = {this.switchStateField}
                />
            )
        };

        if (this.state.mode === 'mapselection') {
            return (
                <MapList switchStateField = {this.switchStateField} state={this.state} />
            )
        };

        return '';
    }
    
    render() {
        return (
            <div className='ui container'>
                <AppSimpleHeader title={this.getHeaderText()} />
                <AppHeader switchStateField = {this.switchStateField} state={this.state}/>
                {this.renderContent()}
                {/* navigation */}
                {/* <div className='ui-app__navigation'>
                    <Link
                        className='ui-app__navigation__link'
                        activeClassName='ui-app__navigation__link--active'
                        to={`${this.state.originalUrl}`}
                        exact={ true }
                    >{`TOKEN ${this.state.token}`}</Link>

                </div>  */}
            </div>
        );
    }
}