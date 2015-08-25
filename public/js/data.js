
$(document).ready(function() {
    var url = window.location.href.split('/')[3];
     if (url.match(/pupils/) !== null) {
        var className = window.location.href.split('?')[1];
        displayClassAsTitle(className);
        addActionToNewPupilForm(className);
    } else if (url === "assignment1" || url === "assignment2") {
        var className = window.location.href.split('/')[4];
        console.log(className);
        var assignmentID = window.location.href.split('/')[5];
        getAssignmentInfo(className, assignmentID);
        getChatLogs();
    } else if (url === "new") {
        getClassNames(url);
    } else if (url === "dash1") {
        getClassNames(url);
    }
});


function displayClassAsTitle (className) {
    $(".pupils-page-title").html("Pupils in " + className);
}

function addActionToNewPupilForm (className) {
  console.log('add action');
    $(".add-student-form").attr("action", "/api/addPupil/" + className);
}

function addClassNamesToNewAssignmentForm(classNames) {
    for (var i = 0; i < classNames.length; i++) {
        var name = classNames[i].split(':')[1];
        $(".class-dropdown").append("<option value='" + name + "'>" + name + "</option>");
    }
}

function getAssignmentInfo (className, assignmentID) {
    var url = '/api/getAssignment/' + className + '/' + assignmentID;
    $.ajax(url, {
        success: function(data){
            displayAssignmentInfo(data);
        }
    });
}

function displayAssignmentInfo (assignment) {
    $(".opinion-piece-image").html("<img src='" + assignment.image + "'>");
    $(".opinion-piece-text").html("<h2>" + assignment.title + "</h2>" + "<p>" + assignment.text + "</p>");
    $(".assignment-question").html("<p>" + assignment.question + "</p>");
}

function getAssignmentsForAllClasses(classesArray) {
    for (var i=0; i < classesArray.length; i++) {
        className = classesArray[i].split(':')[1];
        $.ajax('/api/getClassAssignments/' + className, {
            success: function(assignments) {
                for (var i=0; i < assignments.length; i++) {
                    $(".dashboard-container").append('<a href="/assignment1/' + assignments[i].class + '/' + assignments[i].key.split(':')[2] + '"><div class="dashboard-assignment"><img class="class-icon" src="../static/public/images/assignment.png"><strong><p>' + assignments[i].class + '</p></strong><p>' + assignments[i].title + '</p></div></a>');
                }
            }
        });
    }
}

function getChatLogs () {
    $.ajax('/api/getResponses', {
        success: function(data){
            displayChatLogs(data);
        }
    });
}

function displayChatLogs (chatLogs) {
    for (var i = 0; i < chatLogs.length; i++) {
        var div = "<div class='student-response'>" + "<img src='/static/public/images/face.png'>" + "<h2>Pupil</h2>" + "<p class= 'post-time'>" + chatLogs[i].time + "</p><p><i>" + chatLogs[i].threeWords + "</i></p><p>" + chatLogs[i].response + "</p></div>";
        $(".responses-container").append(div);
    }
}
