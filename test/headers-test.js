var expect = require('chai').expect;
var createHeaderTag = require('../index').createHeaderTag;


describe('[JSX]:= creating a <h1> tag', function (){
    it('should successfully create a h1 tag from a line with one pound symbol', function(){
        // arrange
        const test_line = "# MacDown"
        const expected_result = '<h1> MacDown</h1>\n'

        // act 
        var ret = createHeaderTag(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
})

describe('[JSX]:= creating a <h2> tag', function (){
    it('should successfully create a h2 tag from a line with two pound symbols', function(){
        // arrange
        const test_line = "## MacDown"
        const expected_result = '<h2> MacDown</h2>\n'

        // act 
        var ret = createHeaderTag(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
})

describe('[JSX]:= creating a <h3> tag', function (){
    it('should successfully create a h3 tag from a line with three pound symbols', function(){
        // arrange
        const test_line = "### MacDown"
        const expected_result = '<h3> MacDown</h3>\n'

        // act 
        var ret = createHeaderTag(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
})

describe('[JSX]:= creating a <h4> tag', function (){
    it('should successfully create a h4 tag from a line with four pound symbols', function(){
        // arrange
        const test_line = "#### MacDown"
        const expected_result = '<h4> MacDown</h4>\n'

        // act 
        var ret = createHeaderTag(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
})

describe('[JSX]:= creating a <h5> tag', function (){
    it('should successfully create a h5 tag from a line with five pound symbols', function(){
        // arrange
        const test_line = "##### MacDown"
        const expected_result = '<h5> MacDown</h5>\n'

        // act 
        var ret = createHeaderTag(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
})

describe('[JSX]:= creating a <h6> tag', function (){
    it('should successfully create a h6 tag from a line with six pound symbols', function(){
        // arrange
        const test_line = "###### MacDown"
        const expected_result = '<h6> MacDown</h6>\n'

        // act 
        var ret = createHeaderTag(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
})