import React, { Component } from 'react';
import {Navigation} from './Navigation';

export class Home extends Component {
    render() {
        return (
            <div>
                <Navigation history={this.props.history}/>
            <div className="mt-5 d-flex justify-content-left">
                
                <h3>
                    Welcome to Shelter Management Portal.
                    This is the Home page.
                </h3>
            </div>
            </div>
        )
    }
}