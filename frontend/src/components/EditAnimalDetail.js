import React, { Component } from 'react';
import {Modal, Button, Row, Col, Form} from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';

export class EditAnimalDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {snackbaropen: false, snackbarmsg:'', microchip_ID:'', alteration_status:'', sex:'', breed:'',
        breeds:[],
        selectedSpecies:'',
        addedBreeds:[]};
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        fetch('http://localhost:4000/breeds')
        .then(response => response.json())
        .then(response => {
            this.setState({breeds: response.data});
            //console.log(response.data);
        })
        .catch(err => console.error(err));
    }

    snackbarClose = (event) => {
        this.setState({snackbaropen: false});
    };

    componentWillReceiveProps(nextProps) {
        this.setState({microchip_ID: nextProps.microchip_ID, alteration_status: nextProps.alteration_status, sex: nextProps.sex, breed:nextProps.breed, selectedSpecies:nextProps.animal.species_type});
        this.state.addedBreeds[0] = nextProps.breed;
        this.setState({addedBreeds: this.state.addedBreeds});
    }

    microchipHandler(e) {
        this.setState({microchip_ID: e.target.value});
    }
    sexHandler(e) {
        this.setState({sex: e.target.value});
    }
    alterationHandler(e) {
        this.setState({alteration_status: e.target.value});
    }
    breedHandler(e) {
        this.setState({breed: e.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        const item = this.state;
        console.log(item);
        // this.props.saveModalDetails(item)
        let data = {
            pet_ID: this.props.animal.pet_ID,
            microchip_ID: event.target.microchip_ID.value,
            alteration_status: event.target.alteration_status.value,
            sex: event.target.sex.value,
            breed: this.state.addedBreeds,
            species_type: this.props.animal.species_type
          };
          var request = new Request('http://localhost:4000/updateAnimal', {
            method: 'PUT',
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
    addBreed() {
        this.setState({addedBreeds: [...this.state.addedBreeds,""]});
    }
    handleChange(e, index) {
        console.log(index);
        this.state.addedBreeds[index] = e.target.value;
        this.setState({addedBreeds: this.state.addedBreeds});
    }
    
    handleRemove(index) {
        console.log(index);
        this.state.addedBreeds.splice(index, 1);
        console.log(this.state.addedBreeds, "$$$$");
        this.setState({addedBreeds: this.state.addedBreeds});
        console.log(this.state.addedBreeds);
    }

    render() {
        let species = this.state.breeds.filter(species => {
            return species.species_type === this.state.selectedSpecies
        })
        // if (this.props.breed === "Mixed" || this.props.breed === "Unknown") {
        //     this.setState({addedBreeds: [...this.state.addedBreeds,this.props.breed]});
        // }
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
                            <Form.Group controlId="breeds">
                                <Form.Label>Breeds</Form.Label>
                                {
                                ((this.props.breed !== "Unknown") && (this.props.breed !== "Mixed")) ?
                                <Form.Control 
                                    type="text" 
                                    name="breed" 
                                    required 
                                    defaultValue = {this.props.breed}
                                    placeholder="breed"
                                    disabled={(this.props.breed !== "Unknown") && (this.props.breed !== "Mixed")}
                                /> :
                            //     }   
                            // {
                                this.state.addedBreeds.map((breed, index)=> {
                                    return (
                                        <div key={index}>
                                        <Form.Control as="select" 
                                        disabled={(this.props.breed !== "Unknown") && (this.props.breed !== "Mixed")}
                                        defaultValue={this.props.breed}
                                        onChange={(e)=>this.handleChange(e, index)}>
                                        {species.map(breed => 
                                            <option key={breed.breed_name}>{breed.breed_name}</option>
                                            )}
                                        </Form.Control>
                                        <Button variant="outline-danger" onClick={()=>this.handleRemove(index)}>Remove</Button>
                                        </div>
                                    );
                                })
                            }
                                
                            </Form.Group>
                            <Button variant="primary" disabled={(this.props.breed !== "Unknown") && (this.props.breed !== "Mixed")} onClick={(e)=>this.addBreed(e)}>
                                Add breed
                            </Button>
                                
                                <Form.Group controlId="sex">
                                <Form.Label>Sex</Form.Label>
                                <Form.Control 
                                    as="select"
                                    name="sex" 
                                    required 
                                    defaultValue = {this.props.sex}
                                    placeholder="sex"
                                    disabled={this.props.sex !== "Unknown" && this.props.sex != "unknown"}
                                    onChange={(e) => this.sexHandler(e)}
                                >
                                    <option>Unknown</option>
                                    <option>male</option>
                                    <option>female</option>
                                </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="microchip_ID">
                                <Form.Label>Microchip ID</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="microchip_ID"  
                                    defaultValue = {this.props.microchip_ID}
                                    placeholder="microchip_ID"
                                    onChange={(e) => this.microchipHandler(e)}
                                />
                                </Form.Group>
                                
                                <Form.Group controlId="alteration_status">
                                <Form.Label>Alteration Status</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="alteration_status" 
                                    required 
                                    defaultValue = {this.props.alteration_status}
                                    placeholder="alteration_status"
                                    disabled={this.props.alteration_status === 1}
                                    onChange={(e) => this.alterationHandler(e)}
                                />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" type="submit">Update Animal info</Button>
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