// to be tested on classes page

QUnit.test( "getClasses returns an array", function(assert) {
    var result = getClasses();
    assert.ok(Array.isArray(result), true, "is an array!");
});

QUnit.test( "displayClasses adds divs if the array is not empty (on classes page)", function(assert) {
    var array = getClasses();
    var thereAreDivs;
    displayClasses(array);
    if (array.length > 0 && $(".class-div").length) {
        thereAreDivs = true;
    } else {
        thereAreDivs = false;
    }
    assert.ok(thereAreDivs, true, "divs are added!");
});

// to be tested on a student list page

QUnit.test( "getStudents returns an array", function(assert) {
    var result = getStudents();
    assert.ok(Array.isArray(result), true, "is an array!");
});

QUnit.test( "displayStudents adds divs if the array is not empty (on students page)", function(assert) {
    var array = getStudents();
    var thereAreDivs;
    displayStudents(array);
    if (array.length > 0 && $("tr").length) {
        thereAreDivs = true;
    } else {
        thereAreDivs = false;
    }
    assert.ok(thereAreDivs, true, "divs are added!");
});
