import React, { Component } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import {Navigation} from './Navigation';

export class AddAdoptionApplication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appInfo: {
                app_date: 0,
                co_applicant_first_name: '',
                co_applicant_last_name: '',
                app_status: 'Pending',
                applicant_email: ''
            },
            emailList: [],
            disabled: false,
            disabledapplicant: false,
            appIDlist: []
        }
        // this.handleApplicantEmail = this.handleApplicantEmail.bind(this);
        // this.handleApplicantionEmail = this.handleApplicantionEmail.bind(this);
        this.handleApplicationSubmit = this.handleApplicationSubmit.bind(this);
        this.handleApplicantSubmit = this.handleApplicantSubmit.bind(this);

    }
    componentDidMount() {
        this.refreshList()
    }
    refreshList() {
        var request = new Request("/getAllEmailFromApp");
        fetch("/getAllEmailFromApp")
            .then(response => response.json())
            .then(response => { this.setState({ emailList: response.data }); })
            .catch(err => console.error(err))
    }
    handleApplicantEmail(e) {
        let email = this.state.emailList.filter(email => {
            return email.email === e.target.value;
        });
        console.log("appplicant", email)
        if (email.length != 0) {
            console.log("1231231312")
            this.setState({ disabledapplicant: true });
        } else {
            this.setState({ disabledapplicant: false });
        }
    }
    handleApplicantionEmail(e) {
        let email = this.state.emailList.filter(email => {
            return email.email === e.target.value;
        });
        console.log("appplication", email)
        console.log("appplication", this.state.emailList)
        if (email == '') {
            this.setState({ disabled: true });

            // alert("your email doesn't exist! Register first!")
        }
        else {
            this.setState({ disabled: false });
        }
    }
    handleApplicantSubmit(event) {
        event.preventDefault();
        let data = {
            email: event.target.email.value,
            phone: event.target.phone.value,
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            city: event.target.city.value,
            street: event.target.street.value,
            state: event.target.state.value,
            zipcode: event.target.zipcode.value
        }
        var request = new Request('/insertIntoApplicant', {
            method: 'POST',
            headers: new Headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });
        console.log(JSON.stringify(data));
        fetch(request)
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => console.error(err))
        alert("New Applicant Added!");
        this.refreshList();
        // this.generateApp_ID();
    }
    handleApplicationSubmit(event) {
        event.preventDefault();
        let data = {
            app_date: event.target.app_date.value,
            co_applicant_first_name: event.target.co_applicant_first_name.value,
            co_applicant_last_name: event.target.co_applicant_last_name.value,
            app_status: 'Pending',
            applicant_email: event.target.applicant_email.value
        }
        var request = new Request('/insertIntoApplication', {
            method: 'POST',
            headers: new Headers({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
            body: JSON.stringify(data)
        });
        console.log(JSON.stringify(data));
        fetch(request)
            .then(response => response.json())
            
            .then(data => {
                console.log(data.message);
                this.setState({appIDlist:data.message});
              }).catch(err => console.error(err))
            
            
            
            
            
            // .then(data => {
            //     console.log(data);
            // })
            // .catch(err => console.error(err))
        // this.generateApp_ID();
        alert("New Application Added!");
        this.refreshList();
    }
    generateApp_ID() {
        var request = new Request("/getApplicationID");
        fetch("/getApplicationID")
            .then(response => response.json())
            .then(response => {
                console.log("res", response.data);
                this.setState({ appIDlist: parseInt(response.data.max_ID, 10).toString() });
            })

            .catch(err => console.error(err))
        //        this.showApp_ID();
    }
    // showApp_ID() {
    //     alert("You've registered! Your application ID is: ", this.state.appIDlist);
    // }

    render() {
        console.log("appidlist", this.state.appIDlist);
        return (
            <container>
                <Navigation
                history={this.props.history}
                />
                <h3>New Applicant <b>MUST</b> register at first!</h3>
                <h3>In order to get an application ID, please fill out this form first!!</h3>
                {/* <h5>email, phone, first_name, last_name, city, street, state,zipcode</h5> */}
                <div className="col-sm-8">
                    <Form onSubmit={this.handleApplicantSubmit}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="email" >
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" required placeholder="Enter email"
                                    onBlur={(e) => this.handleApplicantEmail(e)} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="phone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="phone" required placeholder="eg. 1230008888 no special symbols" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="first_name" >
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type="name" required placeholder="Enter First Name" />
                            </Form.Group>

                            <Form.Group as={Col} controlId="last_name" >
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control type="name" required placeholder="Enter Last Name" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Group controlId="street">
                            <Form.Label>Street</Form.Label>
                            <Form.Control required placeholder="1234 Main St" />
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col} controlId="city">
                                <Form.Label>City</Form.Label>
                                <Form.Control required />
                            </Form.Group>

                            <Form.Group as={Col} controlId="state">
                                <Form.Label>State</Form.Label>
                                <Form.Control required />
                            </Form.Group>

                            <Form.Group as={Col} controlId="zipcode">
                                <Form.Label>Zip</Form.Label>
                                <Form.Control required />
                            </Form.Group>
                        </Form.Row>
                        <Button variant="primary" type="submit"
                            disabled={this.state.disabledapplicant}

                        >
                            Submit</Button>
                    </Form>
                    <h5> If you have already registered, fill out this form and system will asign a new Application ID!</h5>
                    <h3>Your <b>Application ID</b> is {this.state.appIDlist}</h3>
                    {/* <h4>   app_ID,app_date,co_applicant_first_name, co_applicant_last_name,app_status,applicant_email   </h4> */}
                </div>
                <div className="col-sm-8">
                    <Form onSubmit={this.handleApplicationSubmit}>
                        <Form.Row>
                            <Form.Group controlId="applicant_email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control required
                                    onBlur={(e) => this.handleApplicantionEmail(e)} />
                            </Form.Group>
                            <Form.Group as={Col} controlId="app_date">
                                <Form.Label>Application Date</Form.Label>
                                <Form.Control type="text" required placeholder='eg.20200101 no "*-/." symbols, etc.' />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="co_applicant_first_name" >
                                <Form.Label> Co applicant first name</Form.Label>
                                <Form.Control type="name" placeholder="optional" />
                            </Form.Group>

                            <Form.Group as={Col} controlId="co_applicant_last_name">
                                <Form.Label>Co applicant last name</Form.Label>
                                <Form.Control type="name" placeholder="optional" />
                            </Form.Group>
                        </Form.Row>
                        <Button variant="primary" type="submit"
                            disabled={this.state.disabled}
                        >
                            Submit</Button>
                    </Form>
                </div>
            </container>

        )
    }
}
