import React, { Component }  from 'react';
import {withTracker } from 'meteor/react-meteor-data';
import Group from '../client/groups.jsx';
import { Groups } from './groups.js';
import { Meteor } from 'meteor/meteor';
import { Users } from '../imports/users.js';
import { Papa } from 'papaparse';
import { createUsersFile } from '../imports/create.js';
import $ from 'jquery';
import Foundation from 'foundation-sites';
 
class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: 'thingy'

        
        }
        this.resetData  = this.resetData.bind(this);
        this.findPeople = this.findPeople.bind(this);
        this.renderTasks = this.renderTasks.bind(this);
    }

    componentDidMount() {
        $(document).foundation()
        //this.renderTasks();
        setInterval(function(){ 
            //code goes here that will be run every 5 seconds.    
            Meteor.call("users.getldap", {
                dummy:  '12234'
            }, (err, res) => {
                if (err) {
                    console.log(err);
                } 
            });

            Meteor.call("users.checkuser", {
                username:  'melanieclifford'
            }, (err, res) => {
                if (err) {
                    console.log(err);
                }
            });

        }, 60000);
        
        

        
}
    resetData() {
        console.log('This has been called');
        Meteor.call("users.getldap", {
            dummy:  '12234'
        }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                this.setState({
                    updateRecord: true
                });
            }
        });
    }
    findPeople() {
        console.log('This has been called');
        Meteor.call("users.checkuser", {
            username:  'melanieclifford'
        }, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                this.setState({
                    updateRecord: true
                });
            }
        });
    }
   
    createUsers() {
        Meteor.call("users.createUsers", {
            dummy: "dummy"
        },(err,res) =>{
            if(err) {
                console.error(err);
            }
        });
    }

    renderTasks() {
         this.props.groups.map((user)=> {
        
           // return (<User key={user._id} user={user.memberUid} />)
        });
    }
    render() {
     

        return (
            <div>
            <h1> LDAP User Management Tool</h1>
            <ul>
            {this.props.groups.map((group)=> {
         
            return (<Group key={group._id} group={group} />)
        })}
            </ul>
            <div className="button-group">
            <button className="button" type="button" onClick={this.resetData}>Refresh Data</button>
            <button className="button" type="button" onClick={this.findPeople}>Find People</button>
            <button className="button" type="button" onClick={this.findPeople}>Find People</button>
            <button className="button" type="button" onClick={this.createUsers}>Create Users</button>
            </div>
            </div>
            
        )
    }
}

export default withTracker(() => {
    return {
      groups: Groups.find({}).fetch(),
      users: Users.find({}).fetch()
    };
  })(App);