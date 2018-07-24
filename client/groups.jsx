import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Users } from '../imports/users.js';
import { Groups } from '../imports/groups.js';
 
// Task component - represents a single todo item
class Group extends Component {
  render() {
    let displayName = '';
    //const raw = Users.find({}).fetch();
    //console.log(raw);
    return (
      <li className="group-names">{this.props.group.description} - members:
      <ul>
        {this.props.group.memberUid.map((member,index) =>{
          const fullName = Users.find({"dn": {$regex: "." + member + ".*"}}).fetch();
         //const fullName = Users.find({"dn"}).fetch();
         //const fullName = '';
         if(fullName[0]) {
           displayName = fullName[0].gecos;
         } else {
           displayName= '';
         }

          return(<li key={index} className="member-names">{displayName}</li>)
        })}
      </ul>
      <hr /></li>
    );
    
  }
}
Group.propTypes = {
    group: PropTypes.object.isRequired,
};

export default Group;