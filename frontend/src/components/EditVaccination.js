import React, { Component } from 'react';
import {Modal, Button, Row, Col, Form} from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import UserStore from './stores/UserStore';

export class EditVaccination extends Component {
    constructor(props) {
        super(props);
        this.state = {snackbaropen: false, snackbarmsg:'',
        vaccinetypes:[],
        pet_ID: {},
        selectedSpecies:'',
        addedVac:''};
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
    }
    snackbarClose = (event) => {
        this.setState({snackbaropen: false});
    };

    componentWillReceiveProps(nextProps) {
        this.setState({selectedSpecies:nextProps.selectedSpecies, pet_ID:nextProps.pet_ID});
        let {petid} = nextProps.pet_ID;
        console.log("pet id is " + petid);
        fetch(`/${petid}/vaccination`)
        .then(response => response.json())
        .then(response => {
            this.setState({vaccinetypes: response.data});
            //console.log(response.data);
        })
        .catch(err => console.error(err));
    }

    handleChange(e) {
        this.setState({addedVac: e.target.value});
    }

    handleSubmit(event) {
        // const item = this.state;
        // this.props.saveModalDetails(item)
        event.preventDefault();
        let data = {
            pet_ID: this.state.pet_ID.petid,
            vac_type: event.target.vac_type.value,
            admin_date: event.target.admin_date.value,
            vac_number: event.target.vac_number.value,
            exp_date: event.target.exp_date.value,
            user_name: UserStore.username
        };
          var request = new Request('/updateVaccination', {
            method: 'POST',
            headers: new Headers({'Accept':'application/json', 'Content-Type': 'application/json'}),
            body:JSON.stringify(data)
          });
          console.log(JSON.stringify(data));          
          //xmlhttprequest()
          fetch(request)
            .then(response=>response.json())
                .then(data => {
                  //console.log(data);
                  //alert(data.message);
                  this.setState({snackbaropen: true, snackbarmsg: data.message ? data.message : 'failed'});
                },
                (error) => {
                    // alert('Failed');
                    this.setState({snackbaropen: true, snackbarmsg: 'failed'});
                }
                )
    }

    render() {
        console.log(this.state.vaccinetypes);
        let species = this.state.vaccinetypes.filter(vaccine => {
            return vaccine.species_type === this.state.selectedSpecies
        })
        console.log(species);
        console.log(this.state.selectedSpecies);
        return (
            <div className="container">
                <Snackbar 
                    anchorOrigin={{vertical:'bottom', horizontal: 'center'}}
                    open={this.state.snackbaropen}
                    autoHideDuration = {3000}
                    onClose={this.snackbarClose}

                    message={<span id="message-id">{this.state.snackbarmsg}</span>}
                    action={[
                        <IconButton key="close" arial-label="Close" color="inherit" onClick={this.snackbarClose}>
                            x
                        </IconButton>
                    ]}
                />
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Animal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={6}>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="vaccinations">
                                    <Form.Label>Vaccination</Form.Label>
                                        <Form.Control as="select" 
                                        name="vac_type"   
                                        required 
                                        onChange={(e)=>this.handleChange(e)}>
                                        {species.map((vac,index) => 
                                            <option key={index}>{vac.vaccine_name}</option>
                                            )}
                                        </Form.Control>
                                </Form.Group>
                                    
                                <Form.Group controlId="vac_number">
                                <Form.Label>Vaccination Number</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="vac_number" 
                                    placeholder="vaccination number"
                                />
                                </Form.Group>
                                <Form.Group controlId="admin_date">
                                    <Form.Label>Admin Date</Form.Label>
                                    <Form.Control type="date" required placeholder="yyyymmdd" />
                                </Form.Group>
                                <Form.Group controlId="exp_date">
                                    <Form.Label>Expire Date</Form.Label>
                                    <Form.Control type="date" required placeholder="yyyymmdd" />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" type="submit">Add Vaccination</Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
            </div>
        )
    }
}