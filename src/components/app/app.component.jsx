import React from 'react';
import { NavLink as Link, Switch, Route } from 'react-router-dom';

// import child components
import { Counter } from '../counter';

// export entry application component
export class App extends React.Component {
    constructor(props) {
        console.log( 'App.constructor()' );
        super(props);

        this.state = { token: '' };
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
            <div className='ui-app'>
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