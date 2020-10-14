import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import ReactTable from 'react-table-6';
import './react-table.css';
import {Navigation} from './Navigation';

export class AdoptionApplicationReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applicationInfos: [],
            appID:{app_ID: ''}
        };
    // this.onChangeApprove.bind(this.onChangeApprove);
    // this.onChangeReject.bind(this.onChangeReject);
    }
    componentDidMount() {
        this.getApplicationInfoList();
    }
    getApplicationInfoList() {
        var request = new Request("http://localhost:4001/getAllApplicantion");
        fetch("http://localhost:4000/getAllApplicantion")
            .then(response => response.json())
            .then(response => { this.setState({ applicationInfos: response.data }); })
            .catch(err => console.error(err))
    }

    onChangeApprove(){
        console.log(this.state.appID)
        const app_id = this.state.appID.app_ID;
        fetch(`http://localhost:4000/updateapprove?app_id=${app_id}`)
        .then(response => response.json());
        alert("You've Approved an application!");
        this.getApplicationInfoList();
    }

    onChangeReject(){
        console.log(this.state.appID)
        const app_id = this.state.appID.app_ID;
        fetch(`http://localhost:4000/updatereject?app_id=${app_id}`)
        .then(response => response.json());
        alert("You've Rejected an application!");
        this.getApplicationInfoList();
    }

    render() {
        console.log(this.state.appID);
        const columns = [
            {
                Header: "App No.",
                accessor: "app_ID",
                sortable: false,
                style: {
                    textAlign: "center"
                },
                width: 70,
                maxWidth: 70
            },
            {
                Header: "Date",
                accessor: "app_date",
                sortable: false,
                style: {
                    textAlign: "center"
                }
            },
            {
                Header: "Co-applicant firstname",
                accessor: "co_applicant_first_name",
                sortable: false,
                style: {
                    textAlign: "center"
                }
            },
            {
                Header: "Co-applicant lastname",
                accessor: "co_applicant_last_name",
                sortable: false,
                style: {
                    textAlign: "center"
                }
            },
            {
                Header: "Status",
                accessor: "app_status",
                sortable: false,
                style: {
                    textAlign: "center"
                }
            },
            {
                Header: "Email",
                accessor: "applicant_email",
                sortable: false,
                style: {
                    textAlign: "center"
                }
            },
            {
                Header: 'Select',
                Cell: c => {
                    return (
                        // <input type="checkbox" id="myCheck" onClick = {()=>this.setState({appID:{app_ID: c.original.app_ID}})}>
                        <Button variant="outline-info" size="sm"
                        onClick = {()=>this.setState({appID:{app_ID: c.original.app_ID}})} 
                        >Select</Button>
                    )
                },
                width: 85,
                style: {
                    textAlign: "center"
                }
            },
            {
                Header: 'Reject',
                Cell: c => {
                    return (
                        <Button variant="outline-danger" size="sm"
                        onClick = {this.onChangeReject.bind(this)}  
                        >Reject</Button>
                    )
                },
                width: 85,
                style: {
                    textAlign: "center"
                }
            },
            {
                Header: 'Approve',
                Cell: c => {
                    return (
                        <Button variant="outline-success" size="sm"
                        onClick = {this.onChangeApprove.bind(this)
                        }
                        >Approve</Button>
                    )
                },
                width: 85,
                style: {
                    textAlign: "center"
                }
            }
        ]
        return (
            // <div>
            //  <h4>You have selected Application ID: {this.state.appID.app_ID}</h4>
            // </div>
            <div>
            <Navigation
                history={this.props.history}
                />
            <ReactTable columns={columns}
                data={this.state.applicationInfos}
                defaultPageSize={10}
            >
            </ReactTable>
            </div>
        )
    }
}