import React, { Component } from 'react';
import {Table} from 'react-bootstrap';
import {Button, ButtonToolbar} from 'react-bootstrap';
import {EditAnimalDetail} from './EditAnimalDetail';
import {EditVaccination} from './EditVaccination';
import {Navigation} from './Navigation';

export class AnimalDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // snackbaropen: false, 
            // snackbarmsg:'',
            animal: {},
            vaccination:[],
            editModalShow: false,
            addVacShow: false
        };
        // this.saveModalDetails = this.saveModalDetails.bind(this);
    }
    componentDidMount() {
        this.refreshList();
    }
    refreshList() {
        let {petid} = this.props.match.params;
        console.log("petid is " + petid);
        fetch(`/animal/${petid}`)
        .then(response => response.json())
        .then(response => {console.log(response.data);this.setState({animal: response.data[0]})})
        .catch(err => console.error(err));
        fetch(`/animal/${petid}/vaccination`)
        .then(response => response.json())
        .then(response => {console.log(response.data);this.setState({vaccination: response.data})})
        .catch(err => console.error(err));
    }

    formatDate(string) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([],options);
    }

    render() {
        // console.log(this.state.animal);
        // this.refreshList();
        let {animal, vaccination, breed, sex, microchip_ID, alteration_status, pet_ID, species_type} = this.state;
        console.log({animal});
        // console.log({vaccination});
        console.log(this.state.editModalShow);
        let editModalClose = ()=> {this.setState({editModalShow: false}); this.refreshList()};
        let addVacClose = ()=> {this.setState({addVacShow: false}); this.refreshList()};
        return (
            <div>
                <Navigation history={this.props.history}/>
                <h5 className="m-3 d-flex justify-content-center">Animal Detail</h5>                    
            <Table className="mt-4" striped bordered hover size="sm">
                <tbody>
                    <tr>
                        <td>Pet ID</td>
                        <td>{animal.pet_ID}</td>
                    </tr>
                    <tr>
                        <td>Animal Name</td>
                        <td>{animal.animal_name}</td>
                    </tr>
                    <tr>
                        <td>Microchip ID</td>
                        <td>{animal.microchip_ID}</td>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td>{animal.description}</td>
                    </tr>
                    <tr>
                        <td>Alteration Status</td>
                        <td>{animal.alteration_status}</td>
                    </tr>
                    <tr>
                        <td>Sex</td>
                        <td>{animal.sex}</td>
                    </tr>
                    <tr>
                        <td>Age</td>
                        <td>{animal.age}</td>
                    </tr>
                    <tr>
                        <td>Surrender Reason</td>
                        <td>{animal.surrender_reason}</td>
                    </tr>
                    <tr>
                        <td>Surrender Date</td>
                        <td>{this.formatDate(animal.surrender_date)}</td>
                    </tr>
                    <tr>
                        <td>By Animal Control</td>
                        <td>{animal.by_animal_control}</td>
                    </tr>
                    <tr>
                        <td>Username</td>
                        <td>{animal.user_name}</td>
                    </tr>
                    <tr>
                        <td>Species Type</td>
                        <td>{animal.species_type}</td>
                    </tr>
                    <tr>
                        <td>Breed</td>
                        <td>{animal.breed}</td>
                    </tr>
                </tbody>
            </Table>
            <ButtonToolbar>
                <Button 
                className="mr-2" variant='primary'
                onClick={()=> {
                    this.setState({editModalShow: true, breed: animal.breed, sex: animal.sex, microchip_ID: animal.microchip_ID, alteration_status: animal.alteration_status});
                }
                }>
                    Edit Animal
                </Button>
                <EditAnimalDetail
                    show = {this.state.editModalShow}
                    onHide = {editModalClose}
                    breed = {breed}
                    sex = {sex}
                    microchip_ID = {microchip_ID}
                    alteration_status = {alteration_status}
                    animal = {animal}
                    // saveModalDetails = {this.saveModalDetails}
                />
            </ButtonToolbar>
            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>vaccination type</th>
                        <th>vaccination number</th>
                        <th>admin date</th>
                        <th>expiration date</th>
                        <th>required for adoption</th>
                        <th>admined user</th>
                    </tr>
                </thead>
                <tbody>
                    {vaccination.map((vac, index) => 
                        <tr key={index}>
                        <td>{vac.vac_type}</td>
                        <td>{vac.vac_number}</td>
                        <td>{this.formatDate(vac.admin_date)}</td>
                        <td>{this.formatDate(vac.exp_date)}</td>
                        {vac.required_for_adoption ? <td>Yes</td> : <td>No</td>}
                        <td>{vac.user_name}</td>
                        </tr>
                    )} 
                </tbody>
            </Table>
            <ButtonToolbar>
                <Button
                variant='primary'
                onClick={()=>this.setState({addVacShow: true, pet_ID: animal.pet_ID, species_type: animal.species_type})}
                >Add Vaccination</Button>
                <EditVaccination
                show={this.state.addVacShow}
                onHide={addVacClose}
                pet_ID={this.props.match.params}
                selectedSpecies = {species_type}
                />
            </ButtonToolbar>
            </div>
        )
    }
}