import React from 'react';
import { NavLink as Link, Switch, Route } from 'react-router-dom';

// import child components
import { Counter } from '../counter';
import { AppSimpleHeader } from '../appHeader';

// export entry application component
export class App extends React.Component {
    constructor(props) {
        console.log( 'App.constructor()' );
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
                id: null,
                fileName: null,
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
            }
        };
    }
    
    componentDidMount() {
        if (window.initial_state) {
            console.log(window.initial_state);
        }
    }
    // render view
    render() {
        console.log( 'App.render()' );

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

                <Switch>
                    <Route
                        path='/'
                        exact={ true }
                        render={ () => <Counter name='Monica Geller'/> }
                    />
                </Switch>
                
            </div>
        );
    }
}