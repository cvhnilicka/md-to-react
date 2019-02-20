var expect = require('chai').expect;
var createImageTag = require('../index').createImageTag;

describe('[JSX]:= creating a <img> tag element', function (){
    it('should successfully create an image tag from inline', function (){
        const test_line = "![MacDown logo](http://macdown.uranusjr.com/static/images/logo-160.png)"
        const expected_line = '<img src={"http://macdown.uranusjr.com/static/images/logo-160.png"} alt="MacDown logo" />\n\n'

        var ret = createImageTag(test_line)

        expect(ret).to.be.equal(expected_line);
    })
})
