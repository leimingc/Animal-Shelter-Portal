import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import UserStore from './stores/UserStore';
// import checkLogin from './checkLogin';

export const ProtectedRoute = ({component: Component, ...rest}) => {
    
    return (
        <Route 
            {...rest} 
            render={props => {
                if (UserStore.isLoggedIn === true) {
                    return <Component {...props} />
                } else {
                    alert("Please log in first.");
                    return (<Redirect to={
                        {
                            pathname: "/",
                            state: {
                                from: props.location
                            }
                        }
                    } />);
                }
            }}
        />
    );
};