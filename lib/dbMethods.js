

module.exports = function(client) {

    return {
        client: client,
        generateID : function(setKey, callback) {
            console.log("meta.generateID");
            var id = Math.floor(100000 + Math.random() * 900000);
            this.client.sismember(setKey, id, function(err, data) {
                // console.log(callback.toString());
                if (err){
                    console.log("error");
                    callback(err, null);
                } else if (data === 1) { // if duplicate IDs
                    console.log(id + " exists already.  will regenerate recursively");
                    this.generateID(setKey, callback);
                } else {
                    console.log(data + ": is indeed a unique ID");
                    callback(id);
                }
            }.bind(this));
            callback(id);
        },
        addClass : function(teacherID, className, callback) {
            var setKey = teacherID + ":" + "class";
            this.generateID(setKey, function(classID){
                this.client.sadd(setKey, classID + ":" + className, function(err, data) {
                    client.quit();
                    console.log(err, data); //result from redis
                    if(err){
                        callback(err, null);
                    } else if (data === 0){
                        callback(null, false);
                    } else { // data === 1
                        callback(null, true);
                    }
                }).bind(this);
            });

        },
        getClasses : function(teacherID, className, callback) {
            var setKey = teacherID + ':' + className;
            this.client.smembers(setKey, function(err, data) {
                console.log(Array.isArray(data));
            });
        }
    };

};
