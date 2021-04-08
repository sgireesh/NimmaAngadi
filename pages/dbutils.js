import * as firebase from 'firebase';

 const dbutils =  {
    getgroupphone: function getGroupPhone(groupname) {
        console.log("6: " + groupname);
        var groupphone = '';
        var ref = firebase.database().ref("groups/" + groupname + "/groupphone");
        console.log("9: " + ref);
        ref.once('value', (snapshot) => {
            console.log("6: " + snapshot.val());
            groupphone = snapshot.val();
        }).then(() => {
            console.log("13: " + groupphone);
            return groupphone;
        });
    }
}

export default dbutils;
