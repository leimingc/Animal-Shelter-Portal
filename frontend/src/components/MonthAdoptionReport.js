import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {Navigation} from './Navigation';
//import axios from './axios';
// import {Button} from 'react-bootstrap';
// import {Link} from 'react-router-dom';
// import Async from 'react-async'

export class MonthAdoptionReport extends Component{
    constructor(props){
        super(props);
        this.state = {
            Report: []
        };
    }

  componentDidMount() {
		this.refreshlist();
    }

   refreshlist(){
   	console.log('I am fetching data...');
   	var request = new Request("http://localhost:4000/MonthAdoptReport");
		fetch("http://localhost:4000/MonthAdoptReport")
		.then(response => response.json())
		.then(response => {console.log(response.data);this.setState({Report:response.data});})
	.catch(err=> console.error(err))}


    render(){
        return(
            <main className="container my-5">
                <h1 className="text-primary text-center">Monthly Adoption Report</h1>
				<Navigation history={this.props.history}/>
                <Table className="mt-4" striped bordered hover size="sm">
	                <thead>
						<tr>
						<th scope="col">Year</th>
						<th scope="col">Month</th>
						<th scope="col">Species Type</th>
						<th scope="col">Breed</th>
						<th scope="col">Count of Adoption</th>
						<th scope="col">Count of Surrender</th>
						</tr>
					</thead>
                <tbody>
					{this.state.Report.map(R => {
					return (
						<tr key = {Math.random()}>
						<td>{R.year}</td>
						<td>{R.month}</td>
						<td>{R.species_type}</td>
						<td>{R.breed}</td>
						<td>{R.adoption_count}</td>
						<td>{R.surrender_count}</td>
						</tr>
					);
					})}
				</tbody>
                </Table>
            </main>
        )
    };

}

