import React from 'react';
import {observer} from 'mobx-react';
import UserStore from './stores/UserStore';
import LoginForm from './loginComponents/loginForm';
import {Redirect} from 'react-router-dom';
import {Navigation} from './Navigation';
import './login.css';

class Login extends React.Component {
  
  async componentDidMount() {
    try {
      let res = await fetch('/isLoggedIn', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      let result = await res.json();
      if (result && result.success) {
        UserStore.loading = false;
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
        UserStore.usertype = result.usertype;
      } else {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
      }
    } catch(e) {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
    }
  }

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
      }
    } catch(e) {
      console.log(e);
    }
  }

  render() {
    if (UserStore.loading) {
      return (
        <div className="login">
          <div className='container'>
            Loading, please wait...
          </div>
        </div>
      );
    }
    else {
      if (UserStore.isLoggedIn) {
        return (
          <Redirect to='/animals' />
        //   <div className="login">
        //     <div className='container'>
        //       Welcome {UserStore.username}
        //       <SubmitButton
        //         text={'Log out'}
        //         disabled={false}
        //         onClick={()=>this.doLogout()}
        //       />
        //     </div>
        //   </div>
        );
      }
      return (
        <div className="login">
          <Navigation/>
          <div className='logContainer'>
            
            <LoginForm />
          </div>
          <div className='test-warning'>
            *This is a demo page, please use the following information to login as different user*
            <br />
            Owner: username: inge, password: inge
            <br />
            Employee: username: user02, password: pass02
            <br />
            Volunteer: username: user01, password: pass01
          </div>
        </div>
      );
    }
  }
}

export default observer(Login);
