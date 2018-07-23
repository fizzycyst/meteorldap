import assert from 'assert';
import ldap from 'ldapjs';

function startldap (){
    const client = ldap.createClient({
      url: 'ldap://10.0.1.13:389'
    });
    const opts = {
      scope: 'sub',
      attributes: ['dn', 'sn', 'cn']
    };
      client.search('uid=diradmin,cn=users,dc=Pauls-Mac,dc=local',opts,function (err,res) {
        assert.ifError(err);
  
        res.on('searchEntry', function(entry) {
          console.log('entry: ' + JSON.stringify(entry.object));
        });
        res.on('searchReference', function(referral) {
          console.log('referral: ' + referral.uris.join());
        });
        res.on('error', function(err) {
          console.error('error: ' + err.message);
        });
        res.on('end', function(result) {
          console.log('status: ' + result.status);
        });
      });
    return client;
  }
  
function findLdap(client){
    const opts = {
      scope: 'sub',
      attributes: ['dn', 'sn', 'cn']
    };
      client.search('uid=diradmin',opts,function (err,res) {
        assert.ifError(err);
  
        res.on('searchEntry', function(entry) {
          console.log('entry: ' + JSON.stringify(entry.object));
        });
        res.on('searchReference', function(referral) {
          console.log('referral: ' + referral.uris.join());
        });
        res.on('error', function(err) {
          console.error('error: ' + err.message);
        });
        res.on('end', function(result) {
          console.log('status: ' + result.status);
        });
      });
  
  }