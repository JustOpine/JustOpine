
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
    $(".add-student-form").attr("action", "/api/addPupil/" + className);
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
    $(".opinion-piece-category").html(assignment.category);
    $(".opinion-piece-image").html("<img src='" + assignment.image + "'>");
    $(".opinion-piece-text").html("<h2>" + assignment.title + "</h2>" + "<p>" + assignment.text + "</p>");
    $(".assignment-question").html("<p class='question'>" + assignment.question + "    <em>(Maximum of 250 words)</em></p>");
}

function getChatLogs () {
    $.ajax('/api/getResponses', {
        success: function(data){
            displayChatLogs(data);
        }
    });
}

function displayChatLogs (chatLogs) {
    var chatLogsLength = chatLogs.length;
    for (var i = 0; i < chatLogsLength; i++) {
        var div = "<div class='student-response'>" + "<h2><img src='/static/public/images/face.png'>" + chatLogs[i].name + "</h2>" + "<p class= 'post-time'>" + parseDate(chatLogs[i].time) + "</p><p><i>" + chatLogs[i].threeWords + "</i></p><p>" + chatLogs[i].response + "</p></div>";
        $(".responses-container").append(div);
    }
}


function parseDate(timestampAsString){
    var responseTime = parseInt(timestampAsString, 10);
    return moment(responseTime).calendar();
}
