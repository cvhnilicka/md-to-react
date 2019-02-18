var expect = require('chai').expect;
var createATag = require('../index').createATag;

describe('[JSX]:= creating an <a> tag from naked link', function (){
    it('should successfully create an a tag with href and inner text from a naked link', function(){
        // arrange
        const test_line = "<inner-naked-link-text>"
        const expected_result = '<a href="inner-naked-link-text">inner-naked-link-text</a>\n\n'

        // act 
        var ret = createATag(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
})

describe('[JSX]:= creating an <a> tag', function (){
    it('should successfully create an a tag with href and inner text', function(){
        // arrange
        const test_line = "[here](http://daringfireball.net/projects/markdown/syntax)."
        const expected_result = '<a href="http://daringfireball.net/projects/markdown/syntax">here</a>\n\n'

        // act 
        var ret = createATag(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
})

describe('[JSX]:= creating an <a> tag with strong', function (){
    it('should successfully create an a tag with href and inner text with strong', function(){
        // arrange
        const test_line = "[**here**](http://daringfireball.net/projects/markdown/syntax)."
        const expected_result = '<a href="http://daringfireball.net/projects/markdown/syntax"><strong>here</strong></a>\n\n'

        // act 
        var ret = createATag(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
})