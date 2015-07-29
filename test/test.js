var QUnit = require('qunitjs');
var index = require('../public/index.js');

QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});