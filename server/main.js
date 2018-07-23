import { Meteor } from 'meteor/meteor';
import assert from 'assert';
import ldap from 'ldapjs';

import { Mongo } from 'meteor/mongo';

import { Groups } from '../imports/groups.js';

import { Users }  from '../imports/users.js';





Meteor.startup(() => {
  // code to run on server at startup

});

Meteor.methods({
'users.getldap'({dummy1}) {
 const data =  startldap();
 
 return data;
},

'users.checkuser'({username}) {

const client = ldap.createClient({
  url: 'ldap://localhost:389'
});
client.bind('cn=admin,dc=example,dc=org','admin',function(err){
  assert.ifError(err);
});

const data = findLdap(client,username);
console.log(data);
return data;
}
});



  function startldap (){
  
    const client = ldap.createClient({
      url: 'ldap://localhost:389'
    });

    client.bind('cn=admin,dc=example,dc=org','admin',function(err){
      assert.ifError(err);
    });


    const opts = {
    
        scope: 'sub',
        //filter: '(&(objectclass=group)(member=' + 'uid=User01,cn=users,dc=Pauls-Mac,dc=local' + '))' 
        filter: '(&(objectClass=posixGroup))',
        attributes: ['dn', 'sn', 'cn','memberUid','description']
       
      };
      
  
       const ourdata =  client.search('dc=example,dc=org',opts,Meteor.bindEnvironment(function (err,res) {
        assert.ifError(err);
          let returnValue =[{}];
          let completeFlag = false;
       res.on('searchEntry',Meteor.bindEnvironment(function(entry) {
        console.log(entry);
          returnValue.push(JSON.stringify(entry.object));

           Groups.insert(entry.object);
  
          //Groups.insert({text: JSON.stringify(entry.object)})
          
        }));
  

        res.on('searchReference', function(referral) {
          console.log('referral: ' + referral.uris.join());
        });
        res.on('error', function(err) {
          console.error('error: ' + err.message);
        });
        res.on('end', function(result) {
          console.log('status: ' + result.status);
  
          completeFlag = true;
        });
        if (completeFlag) {
          return returnValue;
        }
      }));
      return ourdata;
    //console.log(returnValue);
    
    
  }
  
function findLdap (client,searchitem) {
  
    const opts = {
      scope: 'sub',
      filter: '(&(objectClass=posixAccount))',
      attributes: ['dn', 'sn', 'cn','gecos']
    };
  
      const ourdata = client.search('dc=example,dc=org',opts,Meteor.bindEnvironment(function (err,res) {
        assert.ifError(err);
        let returnValue =[{}];
        let completeFlag = false;
     res.on('searchEntry',Meteor.bindEnvironment(function(entry) {
        console.log(entry.object)
        returnValue.push(JSON.stringify(entry.object));
        console.log(entry.object);
        try{
         Users.insert(entry.object);
        } catch(err) {
          console.log(err.message);
        }

        //Users.insert({text: JSON.stringify(entry.object)})
        
      }));


      res.on('searchReference', function(referral) {
        console.log('referral: ' + referral.uris.join());
      });
      res.on('error', function(err) {
        console.error('error: ' + err.message);
      });
      res.on('end', function(result) {
        console.log('status: ' + result.status);

        completeFlag = true;
      });
      if (completeFlag) {
        return returnValue;
      }
    }));
    
    return ourdata;
  //console.log(returnValue);
  }

