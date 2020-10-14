import React from 'react';
import './App.css';
import Login from './components/login';
import {Home} from './components/Home';
import {Animals} from './components/Animals';
import {AddAnimal} from './components/AddAnimal';
import {AnimalDetail} from './components/AnimalDetail';
import NotFoundPage from './components/404';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {ProtectedRoute} from './components/ProtectedRoute';
import {VaccineReminder} from './components/VaccineReminder';
import {MonthAdoptionReport} from './components/MonthAdoptionReport';
import {VolunteerLookup} from './components/VolunteerLookup';
import {VolunteerOfMonth} from './components/VolunteerOfMonth';
import { Adoption } from './components/Adoption'
import { AdoptionApplicationReview } from './components/AdoptionApplicationReview'
import { AddAdoptionApplication } from './components/AddAdoptionApplication'
import { AnimalControlReport } from './components/AnimalControlReport'

function App() {
  return (
    <BrowserRouter>
    <div className="container">
      <h3 className="m-3 d-flex justify-content-center">
      Shelter Management Portal
      </h3>
      
      {/* <Navigation/> */}
      <Switch>
        <Route exact path='/' component={Login} />
        <ProtectedRoute exact path='/home' component={Home} />
        {/* <Route exact path='/animals' component={Animals} /> */}
        <ProtectedRoute exact path='/animals' component={Animals} />
        <ProtectedRoute exact path='/new-animal' component={AddAnimal} />
        <ProtectedRoute exact path='/animal/:petid' component={AnimalDetail} />
        <ProtectedRoute exact path='/vaccinereminder' component={VaccineReminder} />
        <ProtectedRoute exact path='/monthadoptionreport' component={MonthAdoptionReport} />
        <ProtectedRoute exact path='/volunteerlookup' component={VolunteerLookup} />
        <ProtectedRoute exact path='/volunteerofmonth' component={VolunteerOfMonth} />
        <ProtectedRoute exact path="/AdoptionApplicationReview" component={AdoptionApplicationReview} />
        <ProtectedRoute exact path="/Adoption" component={Adoption} />
        <ProtectedRoute exact path="/AddAdoptionApplication" component={AddAdoptionApplication} />
        <ProtectedRoute exact path="/AnimalControlReport" component={AnimalControlReport} />
        <ProtectedRoute exact path='/404' component={NotFoundPage} />
        <Redirect to='/404'/>
      </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
