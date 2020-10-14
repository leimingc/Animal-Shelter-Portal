import React from 'react';
import UserStore from '../stores/UserStore';
import SubmitButton from './SubmitButton';
import {Redirect} from 'react-router-dom';

class logoutButton extends React.Component {

    async doLogout() {
        try {
          let res = await fetch('/logout', {
            method: 'post',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          let result = await res.json();
          if (result && result.success) {
            UserStore.isLoggedIn = false;
            UserStore.username = '';
            UserStore.usertype = '';
            this.props.history.push(`/`);
          }
        } catch(e) {
          console.log(e);
        }
      }

    render() {
        console.log(UserStore.isLoggedIn);
        if (UserStore.isLoggedIn === true) {
            return (
                <div className='container'>
                    Welcome {UserStore.username} {UserStore.usertype}
                    <SubmitButton
                        text={'Log out'}
                        disabled={false}
                        onClick={()=>this.doLogout()}
                    />
                </div>
            );
        } else {
            return <Redirect to='/' />;
        }
    }
}

export default logoutButton;
