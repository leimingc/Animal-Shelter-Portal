import React, {Component, Suspense} from 'react';
import {Table, Form} from 'react-bootstrap';
import {Navigation} from './Navigation';
import {Link} from 'react-router-dom';
import {Button} from 'react-bootstrap';

export class VolunteerOfMonth extends Component{
    constructor(props){
        super(props);
        this.state = {
			years: [],
			months: [],
			selectedyear: '',
			selectedmonth : '',
			volunteersyear: [],
			volunteersmonth: [],
			monthselected: false
			}
		
		// this.sortAscending();
		// this.sortAscending= this.sortAscending.bind(this);
		this.selectYearOnchange = this.selectYearOnchange.bind(this);
		this.selectMonthOnchange = this.selectMonthOnchange.bind(this);
		this.clickOnChange = this.clickOnChange.bind(this);

        };
    


	componentDidMount() {
	this.refreshlist();
	this.handelselect();
}
   handelselect(){
	// var v1 = this.state.selectedyear;
	// var v2 = this.state.selectedmonth;
	var r = 'http://localhost:4000/volmonth';
	fetch("http://localhost:4000/volmonth")
	.then(response => response.json())
	.then(response => {console.log(response.data); this.setState({volunteersmonth:response.data})})
	.catch(err=> console.error(err))

	var r2 = 'http://localhost:4000/volyear';
	fetch("http://localhost:4000/volyear")
	.then(response => response.json())
	.then(response => {console.log(response.data); this.setState({volunteersyear:response.data})})
	.catch(err=> console.error(err))


   };

   refreshlist(){
   	console.log('I am fetching data...');
   	var request = new Request("/selectyear");
	fetch("http://localhost:4000/selectyear")
		.then(response => response.json())
		.then(response => {console.log(response.data);this.setState({years:response.data});})
		.catch(err=> console.error(err));
	fetch("http://localhost:4000/selectmonth")
		.then(response => response.json())
		.then(response => {console.log(response.data);this.setState({months:response.data});})
		.catch(err=> console.error(err))
	
	};

	clickOnChange(){
		this.setState({monthselected: false, selectedyear: '', selectedmonth: ''});
	}

	selectYearOnchange = e => {
		this.setState({selectedyear:  e.target.value})
	};

	selectMonthOnchange = e =>{
		this.setState({selectedmonth:  e.target.value, monthselected: true})
	}

    render(){
		console.log(this.state.selectedmonth);
		console.log(this.state.selectedyear);
		const monthselected = this.state.monthselected;
		let filter;
		if (monthselected){
			filter = this.state.volunteersmonth.filter(v => v.year == this.state.selectedyear && v.month == this.state.selectedmonth ).slice(0,5)
		} else{
			filter = this.state.volunteersyear.filter(v => v.year == this.state.selectedyear).slice(0,5)
		}
		
		var optionState = this.props.optionState;
		// console.log(this.state.volunteers);
		// const {volresults,volresult} = this.state;
		// const filter = volresults.filter(vol => vol.first_name.includes(volresult.search_name.toUpperCase()) || vol.last_name.includes(volresult.search_name.toUpperCase()) || vol.first_name.includes(volresult.search_name.toLowerCase()) || vol.last_name.includes(volresult.search_name.toLowerCase())  ) 
        return(
            <main className="container my-5">
				<Navigation history={this.props.history}/>
                <h1 className="text-primary text-center">Volunteer of Month</h1>
				<form method = 'get'>
				<Form.Label>Year</Form.Label>
						<Form.Control as = 'select' 
						onChange={this.selectYearOnchange}>
							<option></option>
							{this.state.years.map(d =>
							<option key = {Math.random()}>{d.year}</option>	
								)}
						</Form.Control>
				<Form.Label>Month</Form.Label>
						<Form.Control as = 'select' value={optionState} 
						onChange={this.selectMonthOnchange}>
							<option> </option>
							{this.state.months.map(d =>
							<option key = {Math.random()}>{d.month}</option>	
								)}
						</Form.Control>
				<Button variant='primary' onClick = {this.clickOnChange}>Clear Selected</Button>
				{/* <button onClick = {this.clickOnChange} >Clear Selected</button> */}
				{/* <button onClick = {this.handelselect()} >Search</button> */}
				</form>
				<div>
				<h4>Year:  {this.state.selectedyear}</h4>
				<h4>Month:  {this.state.selectedmonth}</h4>
				</div>
				<Table striped bordered hover size="sm">
	                <thead>
						<tr key = {Math.random()}>
						<th scope="col">User Name</th>
						<th scope="col">First Name</th>
						<th scope="col">Last Name</th>
						<th scope="col">Email</th>
						<th scope="col">Working Hours</th>
						{/* <th scope="col">Year</th>
						<th scope="col">Month</th> */}
						</tr>
					</thead>
                <tbody>
					{filter.map(v => {
					return (
						<tr key = {Math.random()}>
						<td>{v.user_name}</td>
						<td>{v.first_name}</td>
						<td>{v.last_name}</td>
						<td>{v.email}</td>
						<td>{v.working_time}</td>
						{/* <td>{v.year}</td>
						<td>{v.month}</td> */}
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