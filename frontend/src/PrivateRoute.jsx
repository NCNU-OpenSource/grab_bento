import React from 'react'
import {useAuth} from './content/AuthContent';
import {Route, Redirect} from 'react-router-dom';

function PrivateRouter({render: Render, ...rest}) {
    const { currentUser } = useAuth();
    console.log("redirect")
    return (
        <Route
        {...rest}
        render={
         currentUser ? Render : ()=>(<Redirect to="/SignIn" />)
        }
        >
        </Route>
    )
}

export default PrivateRouter