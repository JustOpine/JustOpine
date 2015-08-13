// tests found in test/qunit/data-tests.js

$(document).ready(function() {
    var url = window.location.href.split('/')[3];
    if (url === "classes") {
        getClassNames(url);
    } else if (url === "pupils") {
        var className = window.location.href.split('/')[4];
        displayClassAsTitle(className);
        addActionToNewPupilForm(className);
        getPupilInfo(className);
    } else if (url === "assignment1" || url === "assignment2") {
        displayAssignmentInfo(getAssignmentInfo());
        displayChatLogs(getChatLogs());
    } else if (url === "new") {
        getClassNames(url);
    }
});

function getClassNames (url) {
    console.log(url);
    $.ajax('/api/getClasses', {
        success: function(classesArray){
            if (url === "classes") {
                displayClassNames(JSON.parse(classesArray));
            } else if (url === "new") {
                console.log(JSON.parse(classesArray));
                addClassNamesToNewAssignmentForm(JSON.parse(classesArray));
            }
        }
    });
}

function displayClassNames (classArray) {
    for (var i=0; i<classArray.length; i++) {
        var className = classArray[i];
        var div = '<a href="/pupils/' + className + '"><div class="class-div" id="' + className + '">' + '<img class="class-icon" src="../static/public/images/assignment.png">' + '<h4>' + classArray[i] + '</h4></div></a>';
        $(".classes-container").append(div);
    }
}

function displayClassAsTitle (className) {
    $(".pupils-page-title").html("Pupils in " + className);
}

function addActionToNewPupilForm (className) {
    $(".add-student-form").attr("action", "/api/addPupil/" + className);
}

function getPupilInfo (pupilData) {
    $.ajax('/api/getPupils', {
        data: pupilData,
        success: function(pupilData){
            displayPupilInfo(pupilData);
        }
    });
}

function displayPupilInfo (pupilsArray) {
    console.log("array", pupilsArray);
    for (var i=0; i<pupilsArray.length; i++) {
        var div = '<tr>' + '<td><img class="student-icon" src="../static/public/images/face.png"></td>' + '<td>' + pupilsArray[i].firstname + '</td><td>' + pupilsArray[i].surname + '</td><td>' + pupilsArray[i].level + '</td></tr>';
        $(".student-list").append(div);
    }
}

function addClassNamesToNewAssignmentForm(classNames) {
    console.log("it's happening");
    for (var i = 0; i < classNames.length; i++) {
        $(".class-dropdown").append("<option value='" + classNames[i] + "'>" + classNames[i] + "</option>");
    }
}

function getAssignmentInfo () {
    // hardcoded for now
    return {
        class: "8B",
        title: "Should we return the Elgin Marbles?",
        text: "At the beginning of the 19th century, Thomas Bruce, Lord Elgin, was the British Ambassador to the Ottoman Empire, which occupied Greece. He entered the Parthenon in Athens and documented the sculptures, making moulds and casts. He bribed Turkish officials to allow him to engage in daily excavations before removing a large part of the marbles to Britain. Bribing occupying powers to purloin national treasures is not the sort of behaviour usually deemed worthy of a British Ambassador. The looting that happened during the Second World War has, on the whole, been made good. No one accepts the right of those who occupied half of Europe to walk off with the revered relics of those subjugated nations in the 20th century. So why was it acceptable to do so in the 19th century? Britain missed a trick by failing to hand the marbles back during the 2012 Olympic Games, which would have been a spectacular gesture. That it did not is a sad reflection on the enfeebled spirit of philhellenism in Britain. Lord Byron, who died in Greece after travelling to fight in its war of independence, condemned the cultural vandalism of his fellow peer, Elgin. But today there are no Lord Byrons in Britain willing to raise their voice.",
        image: "http://media-2.web.britannica.com/eb-media/22/99922-004-012C57EC.jpg",
        category: "technology",
        question: "Should we give back the marbles?"
    };
}

function displayAssignmentInfo (assignment) {
    $(".opinion-piece-image").html("<img src='" + assignment.image + "'>");
    $(".opinion-piece-text").html("<h2>" + assignment.title + "</h2>" + "<p>" + assignment.text + "</p>");
}

function getChatLogs () {
    // hardcoded for now
    var chatLogs = [{
        student : {
            firstName: "Michelle",
            surname: "Garrett"
        },
        time: "13 December 2014",
        summary: "disappointed, sad, scared",
        text: "No one accepts the right of those who occupied half of Europe to walk off with the revered relics of those subjugated nations in the 20th century. So why was it acceptable to do so in the 19th century?"
    }];
    return chatLogs;
}

function displayChatLogs (chatLogs) {
    console.log(chatLogs[0]);
    for (var i = 0; i < chatLogs.length; i++) {
        console.log("hellooo");
        var div = "<div class='student-response'>" + "<img src='../static/public/images/face.png'>" + "<h2>" + chatLogs[i].student.firstName + " " + chatLogs[i].student.surname + "</h2>" + "<p class= 'post-time'>" + chatLogs[i].time + "</p><p>" + chatLogs[i].summary + "</p><p>" + chatLogs[i].text + "</p></div>";
        $(".responses-container").append(div);
    }
}
