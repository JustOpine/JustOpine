$(document).ready(function(){
    getClassNames();
});

function getClassNames() {
    $.ajax('/api/classes', {
        success: function(data){
            console.log(data);
        }
    });
}

function displayClass() {

}
