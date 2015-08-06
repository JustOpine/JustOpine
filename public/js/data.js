// tests found in test/qunit/data-tests.js

$(document).ready(function() {
    displayClassNames(getClassNames());
    displayStudentInfo(getStudentInfo());
});

function getClassNames () {
    // $.ajax('/api/classes', {
    //     success: function(data){
    //         console.log(data);
    //     }
    // });
    return [1, 2];
}

function displayClassNames (classArray) {
    for (var i=0; i<classArray.length; i++) {
        var div = '<div class="class-div">' + '<img class="class-icon" src="../static/public/images/assignment.png">' + '<h4>' + classArray[i] + '</h4></div>';
        $(".classes-container").append(div);
    }
}

function getStudentInfo () {
    return [{firstName: "Michelle", surname: "Garrett", level: "3"}, {firstName: "Mina", surname: "Jyimah", level: "3"}];
}

function displayStudentInfo (studentsArray) {
    for (var i=0; i<studentsArray.length; i++) {
        var div = '<tr>' + '<td><img class="student-icon" src="../static/public/images/face.png"></td>' + '<td>' + studentsArray[i].firstName + '</td><td>' + studentsArray[i].surname + '</td><td>' + studentsArray[i].level + '</td></tr>';
        $(".student-list").append(div);
    }
}
