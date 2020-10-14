import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Button, NavDropdown} from 'react-bootstrap';
import UserStore from './stores/UserStore';

export class Navigation extends Component {
    constructor(props) {
        super(props);
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
            // return (
            //     <Redirect to='/' />
            // )
            this.props.history.push('/');
          }
        } catch(e) {
          console.log(e);
        }
      }

    render() {

        return (
            <Navbar bg="dark" expand="lg">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav>
                    <NavLink className="d-inline p-2 bg-dark text-white"
                    to="/home">Home</NavLink>
                    <NavLink className="d-inline p-2 bg-dark text-white"
                    to="/animals">Animal Dashboard</NavLink>
                </Nav>
                {
                  UserStore.usertype === "Owner" ?
                <NavDropdown title="Report" id="basic-nav-dropdown">
                    <NavDropdown.Item><NavLink to="/vaccinereminder">Vaccine Reminder</NavLink></NavDropdown.Item>
                    <NavDropdown.Item><NavLink to="/volunteerlookup">Volunteer Lookup</NavLink></NavDropdown.Item>
                    <NavDropdown.Item><NavLink to="/volunteerofmonth">Volunteer of Month</NavLink></NavDropdown.Item>
                    <NavDropdown.Item><NavLink to="/monthadoptionreport">Monthly Adoption Report</NavLink></NavDropdown.Item>
                    <NavDropdown.Item><NavLink to="/AnimalControlReport">Animal Control Report</NavLink></NavDropdown.Item>
                </NavDropdown> : null
                }
                </Navbar.Collapse>
                {
                    UserStore.isLoggedIn ? 
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className="text-white">
                            Signed in as {UserStore.usertype}: {UserStore.username}  
                        </Navbar.Text>{'  '}
                        <Button variant="outline-info" onClick={()=>this.doLogout()}>Log Out</Button>
                    </Navbar.Collapse> : 
                    <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text className="text-white">
                        Please log in.
                    </Navbar.Text>
                    </Navbar.Collapse>
                }
            </Navbar>
        )
    }
}