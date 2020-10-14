import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import TaskList from "./TaskList";
import {Navigation} from './Navigation';
import UserStore from './stores/UserStore';

export class AddAnimal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            snackbaropen: false, 
            snackbarmsg:'',
            breeds:[],
            selectedSpecies:'Cat',
            addedBreeds:[''],
            vaccinations:[],
            capacity:[],
            full: false,
            taskList: [{ index: Math.random(), vac_type: "", admin_date: "", exp_date: "", vac_number: "" }]
        };
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
        fetch('http://localhost:4000/vaccination')
        .then(response => response.json())
        .then(response => {
            this.setState({vaccinations: response.data});
            //console.log(response.data);
        })
        .catch(err => console.error(err));
        fetch('http://localhost:4000/capacity')
        .then(response => response.json())
        .then(response => {console.log(response);this.setState({capacity: response.data})})
        .catch(err => console.error(err));
    }

    speciesHandler(e) {
        // let species = this.state;
        // console.log(this.state.capacity[0].capcatiy);
        for (let step = 0; step < this.state.capacity.length; step++) {
            if ((this.state.capacity[step].species_type === e.target.value) && (this.state.capacity[step].capcatiy <= 0)) {
                this.setState({full: true, snackbaropen: true, snackbarmsg:"There is no more room for this species."});
                return;
            }
        }
        this.setState({full: false, snackbaropen: false, selectedSpecies: e.target.value});
        console.log(e.target.value);
    }

    snackbarClose = (event) => {
        this.setState({snackbaropen: false});
    };

    handleSubmit(event) {
        event.preventDefault();
        let breeds = [...this.state.addedBreeds];
        console.log(breeds);
        console.log(this.state.taskList);
        let data = {
            animal_name:event.target.animal_name.value,
            microchip_ID: event.target.microchip_ID.value,
            description: event.target.description.value,
            alteration_status: event.target.alteration_status.value === "Yes" ? 1 : 0,
            sex: event.target.sex.value,
            age: event.target.age.value,
            surrender_reason: event.target.surrender_reason.value,
            surrender_date: event.target.surrender_date.value,
            by_animal_control: event.target.by_animal_control.value === "Yes" ? 1 : 0,
            user_name: UserStore.username,
            species_type: event.target.species_type.value,
            breed: breeds,
            vaccinations: this.state.taskList
          };
          var request = new Request('http://localhost:4000/api/new-animal', {
            method: 'POST',
            headers: new Headers({'Accept':'application/json', 'Content-Type': 'application/json'}),
            body:JSON.stringify(data)
          });
        //   console.log(data);
          console.log(JSON.stringify(data));          
          //xmlhttprequest()
          //there is problem with snack bar
          fetch(request)
            .then(response=>response.json())
                .then(data => {
                  console.log(data);
                  this.setState({snackbaropen: true, snackbarmsg: data.message ? 'Data inserted! Please wait for redirect.' : 'failed'});
                  if (data.message) {
                    setTimeout(() => {this.props.history.push(`/animal/${data.message}`)}, 3000);
                  }
                  //   return <Redirect to='/'
                },
                (error) => {
                    // alert('Failed');
                    this.setState({snackbaropen: true, snackbarmsg: 'failed'});
                }
                )
    }

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

    handleTaskChange = (e) => {
        if (["vac_type", "admin_date", "exp_date", "vac_number"].includes(e.target.name)) {
            let taskList = [...this.state.taskList]
            taskList[e.target.dataset.id][e.target.name] = e.target.value;
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    }
    addNewRow = (e) => {
        this.setState((prevState) => ({
            taskList: [...prevState.taskList, { index: Math.random(), vac_type: "", admin_date: "", exp_date: "", vac_number: "" }],
        }));
    }

    deteteRow = (index) => {
        this.setState({
            taskList: this.state.taskList.filter((s, sindex) => index !== sindex),
        });
        // const taskList1 = [...this.state.taskList];
        // taskList1.splice(index, 1);
        // this.setState({ taskList: taskList1 });
    }
    clickOnDelete(record) {
        this.setState({
            taskList: this.state.taskList.filter(r => r !== record)
        });
    }
    //Add Animal pop up window.
    render() {
        const uniqueSpecies = this.getUnique(this.state.breeds, "species_type");
        // console.log(this.state.breeds);
        let { taskList } = this.state;
        let species = this.state.breeds.filter(species => {
            return species.species_type === this.state.selectedSpecies
        });
        let vaccine = this.state.vaccinations.filter(species => {
            return species.species_type === this.state.selectedSpecies
        });
        console.log(vaccine);
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
                <Navigation history={this.props.history}/>
                <Form onSubmit={this.handleSubmit}>
                <div className="row" style={{ marginTop: 20 }}>
                <div className="col-sm-2"></div>
                <div className="col-sm-8">
                <h5 className="m-3 d-flex justify-content-center">Add New Animal</h5>                    
                        <Form.Group controlId="species_type">
                        <Form.Label>Species Type</Form.Label>
                        <Form.Control as="select" onChange={(e) => this.speciesHandler(e)}>
                            <option></option>
                            {uniqueSpecies.map(breed => (
                            <option>
                            {breed.species_type}
                            </option>
                            ))}
                        </Form.Control>
                        {   this.state.full ?
                                <Form.Text className="text-danger">
                                We don't have more space for this species.
                            </Form.Text>: null}
                    </Form.Group>
                </div>
                </div>
                <fieldset disabled={this.state.full?"disabled":null}>
                <div className="row" style={{ marginTop: 20 }}>
                <div className="col-sm-2"></div>
                <div className="col-sm-8">
                    <Form.Group controlId="animal_name">
                        <Form.Label>Animal Name</Form.Label>
                        <Form.Control type="text" required placeholder="animal name" />
                    </Form.Group>
                    <Form.Group controlId="microchip_ID">
                        <Form.Label>Microchip ID</Form.Label>
                        <Form.Control type="text" placeholder="Microchip ID" />
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" required rows="3" />
                    </Form.Group>
                    <Form.Group controlId="alteration_status">
                        <Form.Label>Alteration Status</Form.Label>
                        <Form.Control as="select">
                            <option>Yes</option>
                            <option>No</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="sex">
                        <Form.Label>Sex</Form.Label>
                        <Form.Control as="select">
                            <option>male</option>
                            <option>female</option>
                            <option>Unknown</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="age">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="text" required placeholder="age" />
                    </Form.Group>
                    <Form.Group controlId="surrender_reason">
                        <Form.Label>Surrender Reason</Form.Label>
                        <Form.Control type="text" required placeholder="surrender reason" />
                    </Form.Group>
                    <Form.Group controlId="surrender_date">
                        <Form.Label>Surrender Date</Form.Label>
                        <Form.Control type="date" required placeholder="yyyymmdd" />
                    </Form.Group>
                    <Form.Group controlId="by_animal_control">
                        <Form.Label>Sent by Animal Control</Form.Label>
                        <Form.Control as="select">
                            <option>Yes</option>
                            <option>No</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="breeds">
                        <Form.Label>breeds</Form.Label>
                        {/* <Form.Control as="select" onChange={(e)=>this.handleChange(e, 0)}>
                        <option key="0"></option>
                        {species.map(breed => 
                            <option key={breed.breed_name}>{breed.breed_name}</option>
                            )}
                        </Form.Control> */}
                        {
                           this.state.addedBreeds.map((breed, index)=> {
                               return (
                                <div key={index}>
                                <Form.Control as="select" onChange={(e)=>this.handleChange(e, index)}>
                                <option key="0"></option>
                                {species.map(breed => 
                                    <option key={breed.breed_name}>{breed.breed_name}</option>
                                    )}
                                </Form.Control>
                                <Button variant="danger" 
                                    disabled={!index}
                                    onClick={()=>this.handleRemove(index)}>Remove</Button>
                                </div>
                               );
                           }) 
                        }
                        <Button variant="outline-primary" onClick={(e)=>this.addBreed(e)}>
                        Add breed
                    </Button>
                    </Form.Group>
                    </div>
                    </div>

                    <Form.Group onChange={this.handleTaskChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            {/* <div className="card"> */}
                                <div className="card-header text-center">Add Vaccinations</div>
                                <div className="card-body">
                                
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="required" >Vaccination type</th>
                                                <th className="required" >Administration Date</th>
                                                <th>Expiration date</th>
                                                <th>vaccination number</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <TaskList add={this.addNewRow} delete={this.clickOnDelete.bind(this)} vaccinations={vaccine} taskList={taskList} />
                                        </tbody>
                                        {/* <tfoot>
                                            <tr><td colSpan="4">
                                                <button onClick={this.addNewRow} type="button" className="btn btn-primary text-center">Add</button>
                                            </td></tr>
                                        </tfoot> */}
                                    </table>
                                </div>
                                {/* <div className="card-footer text-center"> <button type="submit" className="btn btn-primary text-center">Submit</button></div> */}
                            {/* </div> */}
                        </div>
                    </div>
                    </Form.Group>








                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    </fieldset>
                </Form>
            </div>
        )
    }
}