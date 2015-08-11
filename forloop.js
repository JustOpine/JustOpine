

var pupilData = [];
var lastPupil = data.length;
for (var i=0; i < data.length; i++) {
    var pupilKey = data[i];
    this.client.hgetall(pupilKey, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            pupilData.push(data);
            console.log(lastPupil, i);
            if (i === lastPupil) {
                console.log("lastt", pupilData);
                return pupilData;
            }
        }
    });
}
