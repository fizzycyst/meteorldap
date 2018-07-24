import { Meteor } from 'meteor/meteor';
import assert from 'assert';
import ldap from 'ldapjs';

import { Mongo } from 'meteor/mongo';

import { Groups } from '../imports/groups.js';

import { Users }  from '../imports/users.js';
import { Random } from 'meteor/random'





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
        
          returnValue.push(JSON.stringify(entry.object));
        //Groups.insert(entry.object);
          
          Groups.upsert({"dn":entry.object.dn},{
            $set: {
             dn: entry.object.dn,
             cn: entry.object.cn,
             controls: entry.object.controls,
             description: entry.object.description,
             memberUid: entry.object.memberUid
            },
            $setOnInsert:{
              _id: Random.id()
            }
          });
          
  
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
        
        returnValue.push(JSON.stringify(entry.object));
        
        try{
         //Users.update(entry.object,upsert=true);
         Users.upsert({"dn":entry.object.dn},{
           $set: {
            dn: entry.object.dn,
            cn: entry.object.cn,
            controls: entry.object.controls,
            gecos: entry.object.gecos,sn: entry.object.sn
           },
           $setOnInsert:{
             _id: Random.id()
           }
         });
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

