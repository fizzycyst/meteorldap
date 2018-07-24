import React, { Component }  from 'react';
import {withTracker } from 'meteor/react-meteor-data';
import Group from '../client/groups.jsx';
import { Groups } from './groups.js';
import { Meteor } from 'meteor/meteor';
import { Users } from '../imports/users.js';


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: 'thingy'

        
        }
        this.findPeople = this.findPeople.bind(this);
        this.renderTasks = this.renderTasks.bind(this);
    }

    componentDidMount() {
        //this.renderTasks();
        setInterval(function(){ 
            //code goes here that will be run every 5 seconds.    
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
            
        }, 5000);
        
        

        
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
            <button type="button" onClick={this.resetData}>Refresh Data</button>
            <button type="button" onClick={this.findPeople}>Find People</button>

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