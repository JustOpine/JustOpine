// tests found in test/qunit/data-tests.js
$(document).ready(function() {
    getClassNames();
    // displayStudentInfo(getStudentInfo());
});

function getClassNames () {
    $.ajax('/api/getClasses', {
        success: function(classesArray){
            displayClassNames(JSON.parse(classesArray));
        }
    });
}

function displayClassNames (classArray) {
    for (var i=0; i<classArray.length; i++) {
        var className = classArray[i];
        var div = '<div class="class-div" id="' + className + '">' + '<img class="class-icon" src="../static/public/images/assignment.png">' + '<h4>' + classArray[i] + '</h4></div>';
        $(".classes-container").append(div);
        // console.log($('#' + classArray[i])[0]);
        $('#' + className).click(function(){
            getStudentInfo(className);
            // console.log(className);
        });
    }
}

function getStudentInfo (className) {
    console.log(className);
    $.ajax('/api/getPupils', {
        data: className,
        // success: function(classesArray){
        //     console.log(classesArray);
        //     displayClassNames(JSON.parse(classesArray));
        // }
    });
    return [{firstName: "Michelle", surname: "Garrett", level: "3"}, {firstName: "Mina", surname: "Gyimah", level: "3"}];
}

function displayStudentInfo (studentsArray) {
    for (var i=0; i<studentsArray.length; i++) {
        var div = '<tr>' + '<td><img class="student-icon" src="../static/public/images/face.png"></td>' + '<td>' + studentsArray[i].firstName + '</td><td>' + studentsArray[i].surname + '</td><td>' + studentsArray[i].level + '</td></tr>';
        $(".student-list").append(div);
    }
}
