import React, {Component} from 'react';
import {Table} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {Navigation} from './Navigation';

export class VolunteerLookup extends Component{
    constructor(props){
        super(props);
        this.state = {
			volresults: [],
			volresult: {
				search_name: ''
			}
			// loading: false,
			// filters: []
		};
		// this.clickOnChange.bind(this);
		// this.onChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick() {
		this.setState({volresult:{ search_name:''}});
	}

	onChange = e => {
		this.setState({volresult:{ search_name:e.target.value}})
	};

	searchName(){
		const filter = this.state.volresults.filter(vol => vol.first_name.includes(this.state.volresult.search_name.toUpperCase()) || vol.last_name.includes(this.state.volresult.search_name.toUpperCase()) || vol.first_name.includes(this.state.volresult.search_name.toLowerCase()) || vol.last_name.includes(this.state.volresult.search_name.toLowerCase()) 
		|| vol.first_name.includes(this.state.volresult.search_name[0].toUpperCase()+ this.state.volresult.search_name.slice(1).toLowerCase())|| vol.last_name.includes(this.state.volresult.search_name[0].toUpperCase()+ this.state.volresult.search_name.slice(1).toLowerCase())
		);
		// this.setState({loading: true,filters: filter});
		return filter;
	}

	componentDidMount() {
		this.refreshlist();
    }

   refreshlist(){
   	console.log('I am fetching data...');
   	var request = new Request("/VolLookup");
		fetch("http://localhost:4000/VolLookup")
		.then(response => response.json())
		.then(response => {console.log(response.data);this.setState({volresults:response.data});})
	.catch(err=> console.error(err))}
	
    render(){
		const {volresults,volresult} = this.state;
		const filter = this.searchName();
		// console.log(this.state.volresult.search_name);
		// console.log(this.state.loading);	
		// let upperstring = volresult.search_name[0].toUpperCase()+ volresult.search_name.slice(1);
		// let filter;
		// if(loading){
		// 	filter = volresults.filter(vol => vol.first_name.includes(volresult.search_name.toUpperCase()) || vol.last_name.includes(volresult.search_name.toUpperCase()) || vol.first_name.includes(volresult.search_name.toLowerCase()) || vol.last_name.includes(volresult.search_name.toLowerCase()) 
		// || vol.first_name.includes(volresult.search_name[0].toUpperCase()+ volresult.search_name.slice(1))|| vol.last_name.includes(volresult.search_name[0].toUpperCase()+ volresult.search_name.slice(1)));
		// } else{
		// 	filter = volresults;
		// }
        return(
            <main className="container my-5">
                <h1 className="text-primary text-center">Volunteer Lookup</h1>
				<Navigation history={this.props.history}/>
				<form>
					<input type = "text" 
					value = {volresult.search_name} 
					onChange = {this.onChange}
					placeholder = "Search Name">
					</input>
					{/* <button onClick = {this.clickOnChange} >Search</button> */}
					{/* <button onClick = "history.back()" >Clear</button> */}
					<Button variant='primary' onClick = {this.handleClick} >Clear</Button>
				</form>
				<Table className="mt-4" striped bordered hover size="sm">
	                <thead>
						<tr>
						<th scope="col">First Name</th>
						<th scope="col">Last Name</th>
						<th scope="col">Email</th>
						<th scope="col">Phone</th>
						</tr>
					</thead>
                <tbody>
					{filter.map(v => {
					return (
						<tr key = {Math.random()}>
						<td>{v.first_name}</td>
						<td>{v.last_name}</td>
						<td>{v.email}</td>
						<td>{v.Phone}</td>
						</tr>
					);
					})}
				</tbody>
                </Table>
				<div>
					<Link to="/animals">
					<Button variant='primary'>
						Back to Animal Dashboard
					</Button>
					</Link>
				</div> 
            </main>
        )
    };

}