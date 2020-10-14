import React from 'react';
import {Navigation} from './Navigation';

const NotFoundPage = () => {
    return (
        <div>
            <Navigation history={this.props.history}/>
            <h3>404 Not Found!</h3>
        </div>
    );
};

export default NotFoundPage;