QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!");
});

QUnit.test( "slideEffect changes css properties of landing-container-firstview correctly", function(assert) {
    slideEffect();
    var properties = $(".landing-container-firstview").css(["left"]);
    var expected = {
        left: "0px"
    };
    assert.propEqual(properties, expected);
});

QUnit.test( "slideEffect changes css properties of landing-container-secondview correctly", function(assert) {
    slideEffect();
    var properties = $(".landing-container-secondview").css(["display", "position"]);
    var expected = {
        display: "none",
        position: "absolute"
    };
    assert.propEqual(properties, expected);
});
