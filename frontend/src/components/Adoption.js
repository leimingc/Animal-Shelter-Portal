import React, { Component } from 'react';
import ReactTable from 'react-table-6';
import matchSorter from 'match-sorter';
import Form from 'react-bootstrap/Form';
//https://codesandbox.io/s/5eyxxxyx?from-embed=&file=/index.js:2060-2066
//https://deploy-preview-941--react-table.netlify.app/#/story/custom-filtering
import Button from 'react-bootstrap/Button';
import {Navigation} from './Navigation';

import './react-table.css';

export class Adoption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appliLastNames: [],
            showMe: false,
            newadopt :{
                app_ID:0,
                pet_ID:0,
                adoption_date: '',
                adoption_fee: 0
            },
            snackbaropen: false, snackbarmsg:'',        
        };
        this.handlechange =  this.handlechange.bind(this);
        this.addAdoptionDnF = this.addAdoptionDnF.bind(this);
    }

    componentDidMount() {
        this.getApplicantInfoList();
    }

    handlechange = event =>{
        const {newadopt} = this.state;
        const newadd = {
            ...newadopt,
            [event.target.name]: event.target.value
          };
        this.setState({newadopt: newadd});
    }


    getApplicantInfoList() {
        var request = new Request("http://localhost:4001/getApplicantTotalInfo");
        fetch("http://localhost:4000/getApplicantTotalInfo")
            .then(response => response.json())
            .then(response => { this.setState({ appliLastNames: response.data }); })
            .catch(err => console.error(err))
    }
    RevealForm() {
        this.showMe = this.state.showMe;
    }
    openSelectedName() {
        this.RevealForm();
    }

    addAdoptionDnF() {
        const data = this.state.newadopt;
        const {showMe} = this.state;
        const newshow = {...showMe, showMe: true};
        fetch(`http://localhost:4000/addadoption/add?app_ID=${data.app_ID}&pet_ID=${data.pet_ID}&adoption_date=${data.adoption_date}&adoption_fee=${data.adoption_fee}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // this.setState({snackbaropen: true, snackbarmsg: data.message ? 'Data inserted! Please wait for redirect.' : 'failed'});
            if (data.message) {
                alert('Data inserted');
            }
            //   return <Redirect to='/'
          },
          (error) => {
              alert('Failed');
              this.setState({snackbaropen: true, snackbarmsg: 'failed'});
          }
          )


        //   var request = new Request('http://localhost:4000/api/new-animal', {
        //     method: 'POST',
        //     headers: new Headers({'Accept':'application/json', 'Content-Type': 'application/json'}),
        //     body:JSON.stringify(data)
        //   });
        // //   console.log(data);
        //   console.log(JSON.stringify(data));          
        //   //xmlhttprequest()
        //   //there is problem with snack bar
        //   fetch(request)
        //     .then(response=>response.json())
        //         .then(data => {
        //           console.log(data);
        //           this.setState({snackbaropen: true, snackbarmsg: data.message ? 'Data inserted! Please wait for redirect.' : 'failed'});
        //           if (data.message) {
        //             setTimeout(() => {this.props.history.push(`/animal/${data.message}`)}, 3000);
        //           }
        //           //   return <Redirect to='/'
        //         },
        //         (error) => {
        //             alert('Failed');
        //             this.setState({snackbaropen: true, snackbarmsg: 'failed'});
        //         }
        //         )  
    }

    
    render() {
        console.log(this.state.newadopt);
        const columns = [
            {
                Header: "App No.",
                accessor: "app_ID",
                sortable: false,
                style: {
                    textAlign: "center"
                },
                width: 50,
                maxWidth: 50
            },
            {
                Header: "App firstname",
                accessor: "first_name",
                sortable: false,
                width: 80
            },
            {
                Header: "App lastname",
                accessor: "last_name",
                filterable: true,
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["last_name"] }),
                filterAll: true
            },
            {
                Header: "Co-app firstname",
                accessor: "co_applicant_first_name",
                sortable: false,
                width: 80
            },
            {
                Header: "Co-app lastname",
                accessor: "co_applicant_last_name",
                filterable: true,
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["co_applicant_last_name"] }),
                filterAll: true
            },
            {
                Header: "Street",
                accessor: "street",
                sortable: false
            },
            {
                Header: "City",
                accessor: "city",
                sortable: false
            },
            {
                Header: "Zipcode",
                accessor: "zipcode",
                sortable: false,
                width: 75
            },
            {
                Header: "Phone",
                accessor: "phone",
                sortable: false
            },
            {
                Header: "Email",
                accessor: "email",
                sortable: false
            },
            {
                Header: "Application Date",
                accessor: "app_date",
                sortable: false
            },
            {
                Header: 'Select Person',
                Cell: c => {
                    return (
                        <Button variant="outline-primary" size="sm"
                            onClick={() => {
                                this.setState({
                                    newadopt:{app_ID: c.original.app_ID}
                                })  
                                this.openSelectedName()
                                this.setState({
                                    showMe: true
                                })
                            }}
                        >Select</Button>
                    )
                },
                width: 85,
                style: {
                    textAlign: "center"
                }
            }
        ]

        return (
            [
                <Navigation
                history={this.props.history}
                />,
                <div>
                    Use those two blank text boxes for searching name
                </div>,
                <ReactTable columns={columns}
                    data={this.state.appliLastNames}
                    defaultPageSize={10}
                >
                </ReactTable>,
                <div>
                    {
                        this.state.showMe ?
                        <form>
                        <h4>Application ID is {this.state.newadopt.app_ID}</h4>
                        <h4>based on the person you have selected!</h4>

                               {/* <Form.Group style={{ width: '10%' }}>
                                   <Form.Label>Application ID</Form.Label>
                                   <input type="number" name = 'app_ID'
                                   onChange = {this.handlechange.bind(this)}
                                   />
                               </Form.Group>  */}

                               <Form.Group  style={{ width: '10%' }}>
                                   <Form.Label>Pet ID</Form.Label>
                                   <input type="number" name = 'pet_ID'
                                   onChange = {this.handlechange.bind(this)}
                                   />
                               </Form.Group>

                               <Form.Group style={{ width: '20%' }}>
                                   <Form.Label>Adoption Date</Form.Label>
                                   <input type="text" name = 'adoption_date' placeholder="YYYY-MM-DD"
                                   onChange = {this.handlechange.bind(this)}
                                   />
                               </Form.Group> 

                               <Form.Group style={{ width: '20%' }}>
                                   <Form.Label>Adoption Fee</Form.Label>
                                   <input type="text" name = 'adoption_fee' placeholder="Number, No need '$'"
                                   onChange = {this.handlechange.bind(this)}
                                   />
                               </Form.Group> 
                               <Button onClick={this.addAdoptionDnF}>
                                   Submit
                               </Button>
                   </form>
                : null
                    }
                </div>
            ]

        );
    }

}
