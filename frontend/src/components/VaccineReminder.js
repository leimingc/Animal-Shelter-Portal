import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {Navigation} from './Navigation';

export class VaccineReminder extends Component{
    constructor(props){
        super(props);
        this.state = {
            VacReminder: []
        };
    }

  componentDidMount() {
		this.refreshlist();
    }

   refreshlist(){
   	console.log('I am fetching data...');
   	var request = new Request("/VacReminder");
		fetch("http://localhost:4000/VacReminder")
		.then(response => response.json())
		.then(response => {console.log(response.data);this.setState({VacReminder:response.data});})
	.catch(err=> console.error(err))}


    render(){
        return(
            <main className="container my-5">
                <h1 className="text-primary text-center">Vaccine Reminder Report</h1>
				<Navigation history={this.props.history}/>
				<div>
					<Link to="/animals">
					<Button variant='primary'>
						Back to Animal Dashboard
					</Button>
					</Link>
				</div> 
                <Table className="mt-4" striped bordered hover size="sm">
	                <thead>
						<tr>
						<th scope="col">Pet ID</th>
						<th scope="col">Vaccine Type</th>
						<th scope="col">Expiration Date</th>
						<th scope="col">Recorder Last Name</th>
						<th scope="col">Recorder First Name</th>
						<th scope="col">Species Type</th>
						<th scope="col">Breed</th>
						<th scope="col">Sex</th>
						<th scope="col">Alteration Status</th>
						<th scope="col">Microchip ID</th>
						<th scope="col">Surrender Date</th>
						</tr>
					</thead>
                <tbody>
					{this.state.VacReminder.map(Vaccine => {
					return (
						<tr key = {Math.random()}>
						<td>{Vaccine.pet_ID}</td>
						<td>{Vaccine.vac_type}</td>
						<td>{Vaccine.exp_date}</td>
						<td>{Vaccine.recorder_last_time}</td>
						<td>{Vaccine.recorder_first_time}</td>
						<td>{Vaccine.species_type}</td>
						<td>{Vaccine.breed}</td>
						<td>{Vaccine.sex}</td>
						<td>{Vaccine.alteration_status}</td>
						<td>{Vaccine.microchip_ID}</td>
						<td>{Vaccine.surrender_date}</td>
						</tr>
					);
					})}
				</tbody>
                </Table>
            </main>
        )
    };

}
