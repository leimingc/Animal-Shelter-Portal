import React, { Component} from 'react';
import {Table} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import UserStore from './stores/UserStore';
import {Navigation} from './Navigation';

export class Animals extends Component {
    constructor(props) {
        super(props);
        this.state = {animals:[], species:'', capacity:[], adoptability:''}
        // this.state = {animals:[], addModalShow: false}
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList() {
        console.log("I am fetching data...");
        fetch('/api/animals')
        .then(response => response.json())
        .then(response => {console.log(response.data);this.setState({animals: response.data});})
        .catch(err => console.error(err));
        fetch('/capacity')
        .then(response => response.json())
        .then(response => {console.log(response);this.setState({capacity: response.data})})
        .catch(err => console.error(err));
        // fetch('http://localhost:4000/species')
        // .then(response => response.json())
        // .then(response => this.setState({speciesCapacity: response.data}))
        // .catch(err => console.error(err));
    }

    // componentDidUpdate() {
    //     this.refreshList();
    // }

    getUnique(arr, comp) {
        const unique = arr
          //store the comparison values in array
          .map(e => e[comp])
    
          // store the keys of the unique objects
          .map((e, i, final) => final.indexOf(e) === i && i)
    
          // eliminate the dead keys & store unique objects
          .filter(e => arr[e])
    
          .map(e => arr[e]);
    
        return unique;
    }

    handleChangeSpecies = event => {
        this.setState({ species: event.target.value });
    };

    handleChangeAdopt = event => {
        this.setState({ adoptability: event.target.value });
    };

    render() {
        // const animalstates = this.state.animals;
        console.log(this.state.animal);
        const uniqueSpecies = this.getUnique(this.state.animals, "species_type");
        // console.log(uniqueSpecies);
        const animals = this.state.animals;
        const species = this.state.species;
        // const capacity = this.state.speciesCapacity;
        // const dogNum, catNum;
        const adoptability = this.state.adoptability;
        const filterDropdown = animals.filter(function(result) {
            // console.log(result.species_type);
            if (species === '' || species === 'all') {
                if (adoptability === '' || adoptability === 'all') {
                    return result.species_type === 'Cat' || result.species_type === 'Dog';
                } else if (adoptability === 'adoptable') {
                    return (result.species_type === 'Cat' && result.adoptability === 'adoptable') || (result.species_type === 'Dog' && result.adoptability === 'adoptable');
                } else {
                    return (result.species_type === 'Cat' && result.adoptability === 'not adoptable') || (result.species_type === 'Dog' && result.adoptability === 'not adoptable'); 
                }
            } else {
                if (adoptability === '' || adoptability === 'all') {
                    return result.species_type === species;
                } else if (adoptability === 'adoptable') {
                    return result.species_type === species && result.adoptability === 'adoptable';
                } else {
                    return result.species_type === species && result.adoptability === 'not adoptable';
                }
            }
        })
        //console.log(uniqueSpecies);
        // let addModalClose = () => this.setState({addModalShow: false});
        return (
            <div>
                <h5 className="m-3 d-flex justify-content-center">Animal Dashboard</h5>                    
                <Navigation
                history={this.props.history}
                />
                {/* <LogoutButton/> */}
                <div className="row">
                {this.state.capacity.map(capacity=>(
                    <div className="col">
                    {
                        capacity.capcatiy <= 0 ?
                        <label>{capacity.species_type} Space left: 0</label>:
                        <label>{capacity.species_type} Space left: {capacity.capcatiy}</label>
                    }
                    </div>
                ))}
                </div>
                <div className="row">
                <div className="col">
                <label>
                    Species Filter
                    <select
                    onChange={this.handleChangeSpecies}
                    >
                    <option>all</option>
                    {uniqueSpecies.map(animal => (
                        <option key={animal.pet_ID} value={animal.species_type}>
                        {animal.species_type}
                        </option>
                    ))}
                    </select>
                </label>
                </div>
                <div className="col">
                <label>
                    Adoptability Filter
                    <select
                    onChange={this.handleChangeAdopt}
                    >
                    <option>all</option>
                    <option>adoptable</option>
                    <option>unadoptable</option>
                    </select>
                </label>
                </div>
                </div>

                <div className="row mb-2">
            {
                UserStore.usertype != "Volunteer" ?
                <div className="mx-2">
                <Link to="/new-animal">
                <Button variant='primary'>
                    Add Animal
                </Button>
                </Link>
                </div> : null
            }
            {
                UserStore.usertype != "Volunteer" ?
                <div className="mx-2">
                <Link to="/Adoption">
                <Button variant='primary'>
                    Add Adoption
                </Button>
                </Link>
                </div>: null
            }

                <Link to="/AddAdoptionApplication">
                <Button variant='primary'>
                    Add Adoption Application
                </Button>
                </Link>
                {
                UserStore.usertype === "Owner" ?
                <div className="mx-2">
                <Link to="/AdoptionApplicationReview">
                <Button variant='primary'>
                    Adoption Application Review
                </Button>
                </Link>
                </div> : null
            }
            </div>
            <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>animal's name</th>
                        <th>species</th>
                        <th>breed</th>
                        <th>sex</th>
                        <th>alteration status</th>
                        <th>age</th>
                        <th>adoptability status</th>
                    </tr>
                </thead>
                <tbody>
                    {filterDropdown.map(animal => 
                        <tr key={animal.pet_ID}>
                        <td><Link to={{pathname: `/animal/${animal.pet_ID}`, data: animal}}>{animal.animal_name}</Link></td>
                        <td>{animal.species_type}</td>
                        <td>{animal.breed}</td>
                        <td>{animal.sex}</td>
                        <td>{animal.alteration_status}</td>
                        <td>{animal.age}</td>
                        <td>{animal.adoptability}</td>
                        </tr>
                    )} 
                </tbody>
            </Table>
            {/* <ButtonToolbar> */}
            {/* </div> */}
                {/* <form>
                <br />
                <br />
                <label>
                    Looping through species_type tag from Database
                    <select
                    // value={this.state.course}
                    onChange={this.handleChangeSpecies}
                    >
                    <option>all</option>
                    {uniqueSpecies.map(animal => (
                        <option key={animal.pet_ID} value={animal.species_type}>
                        {animal.species_type}
                        </option>
                    ))}
                    </select>
                </label>
                <input type="submit" value="Submit" />
                <div>
                    {filterDropdown.map(animal => (
                    <div key={animal.pet_ID} style={{ margin: "10px" }}>
                        {animal.animal_name}
                        <br />
                    </div>
                    ))}
                </div>
                </form> */}
            </div>
        )
    }
}