
$(document).ready(function() {
    var url = window.location.href.split('/')[3];
     if (url.match(/pupils/) !== null) {
        var className = window.location.href.split('?')[1];
        displayClassAsTitle(className);
        addActionToNewPupilForm(className);
    } else if (url === "assignment1" || url === "assignment2") {
        var className = window.location.href.split('/')[4];
        var assignmentID = window.location.href.split('/')[5];
        getAssignmentInfo(className, assignmentID);
        getChatLogs();
    }
});

function displayClassAsTitle (className) {
    $(".pupils-page-title").html("Pupils in " + className);
}

function addActionToNewPupilForm (className) {
  console.log('add action');
    $(".add-student-form").attr("action", "/api/addPupil/" + className);
}

function getAssignmentInfo (className, assignmentID) {
    var url = '/api/getAssignment/' + className + '/' + assignmentID;
    $.ajax(url, {
        success: function(data){
            console.log(data);
            displayAssignmentInfo(data);
        }
    });
}

function displayAssignmentInfo (assignment) {
    $(".opinion-piece-image").html("<img src='" + assignment.image + "'>");
    $(".opinion-piece-text").html("<h2>" + assignment.title + "</h2>" + "<p>" + assignment.text + "</p>");
    $(".assignment-question").html("<p>" + assignment.question + "</p>");
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
