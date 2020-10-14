import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import { Button, ButtonToolbar } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import ReactTable from 'react-table-6';
import './react-table.css';
import {Navigation} from './Navigation';

export class AnimalControlReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DateFrom: {
                YearFrom: 0,
                MonthFrom: 0
            },
            FormAC: [],
            Form60: [],
            joinAC60OnMonth: [],
            showACMe: false,
            show60Me: false,
            hideMe: false
        }
         this.refreshList_60 = this.refreshList_60.bind(this);
         this.refreshList_ac = this.refreshList_ac.bind(this);
    }

    componentDidMount() {
        this.getAnimalByAC60();
        //this.refreshList_60();
    }

    refreshList_60() {
        const year = this.state.DateFrom.YearFrom;
        const month = this.state.DateFrom.MonthFrom;
        console.log("year is " + year);
        fetch(`http://localhost:4000/60AnimalDetails/${year}/${month}`)
            .then(response => response.json())
            .then(response => { this.setState({ Form60: response.data }) })
            .catch(err => console.error(err));
    }

    refreshList_ac() {
        const year = this.state.DateFrom.YearFrom;
        const month = this.state.DateFrom.MonthFrom;
        console.log("year is " + year);
        fetch(`http://localhost:4000/AcAnimalDetails/${year}/${month}`)
            .then(response => response.json())
            .then(response => { this.setState({ FormAC: response.data }) })
            .catch(err => console.error(err));
    }

    getAnimalByAC60() {
        var request = new Request("http://localhost:4001/joinAC60OnMonth");
        fetch("http://localhost:4000/joinAC60OnMonth")
            .then(response => response.json())
            .then(response => { this.setState({ joinAC60OnMonth: response.data }); })
            .catch(err => console.error(err))
    }

    Reveal60Form() {
        this.show60Me = this.state.show60Me;
    }

    RevealACForm() {
        this.showACMe = this.state.showACMe;
    }
    render() {
        console.log("this is a click", this.state.DateFrom)
        const columns = [
            {Header: "Year",accessor: "year",style: {textAlign: "center"},width: 60},
            {Header: "Month",accessor: "month",style: {textAlign: "center"},width: 60},
            {Header: "Surrenderd by Animal Control Count",accessor: "animal_surrender_count",style: {textAlign: "center"}},
            {Header: "Over 60 and Adopted Current Month Count",accessor: "animal_adopt_count",style: {textAlign: "center"}},
            {Header: 'Select Year and Month',
            Cell: c => {
                return (
                    <Button variant="outline-primary" size="sm"
                        onClick={() => {this.setState({DateFrom:{YearFrom: c.original.year,MonthFrom: c.original.month}})
                    
                    }}>Select Year & Month</Button>
                )
            },
            style: {textAlign: "center"}
        },  
        ]

        const columns_60 = [
            {Header: "Pet ID",accessor: "pet_ID",style: {textAlign: "center"},width: 60},
            {Header: "Animal Name",accessor: "animal_name",style: {textAlign: "center"}},
            {Header: "Animal Sex ",accessor: "animal_surrender_count",style: {textAlign: "center"}},
            {Header: "Alteration Status ",accessor: "alteration_status",style: {textAlign: "center"}, width: 140},
            {Header: "Species Type ",accessor: "species_type",style: {textAlign: "center"}},
            {Header: "Surrender Date",accessor: "surrender_date",style: {textAlign: "center"} },
            {Header: "By Animal Control",accessor: "by_animal_control",style: {textAlign: "center"},width: 180},
            {Header: "Microchip ID",accessor: "microchip_ID",style: {textAlign: "center"}},
            {Header: "Breed",accessor: "breed",style: {textAlign: "center"}}
        ]

        return (
            [ 
                <Navigation
                history={this.props.history}
                />,
                <ReactTable columns={columns}
                    data={this.state.joinAC60OnMonth}
                    defaultPageSize={5}
                >
                </ReactTable>,
                <div>
                        <div>
                        <Button variant="outline-primary" size="sm"
                            onClick={() => {
                                this.refreshList_ac();
                                this.refreshList_60();
                                this.RevealACForm()
                                this.setState({
                                    showACMe: !this.state.showACMe
                                })
                            }}>Detailed info - Surrendered by Animal Control</Button>
                        </div>
                    <div>
                       <Button variant="outline-primary" size="sm"
                            onClick={() => {
                                this.refreshList_ac();
                                this.refreshList_60();
                                this.Reveal60Form()
                                this.setState({
                                    show60Me: !this.state.show60Me
                                })
                                
                            }}
                        >Detailed info - Adopted and over 60 days</Button>
                    </div>

                </div>,
                <div>
                    {
                        this.state.show60Me ?
                            <div>
                                <ReactTable columns={columns_60}
                                    data={this.state.Form60}
                                    defaultPageSize={10}
                                >
                                </ReactTable>,
                            </div>
                            : null
                    }
                </div>,
                <div>
                    {
                        this.state.showACMe ?
                            <div>
                                <ReactTable columns={columns_60}
                                    data={this.state.FormAC}
                                    defaultPageSize={5}
                                >
                                </ReactTable>,
                            </div>
                            : null
                    }
                </div>
            ]
        );
    }
}