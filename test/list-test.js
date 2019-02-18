var expect = require('chai').expect;
var createListItem = require('../index').createListItem;

describe('[JSX]:= creating a <li> tag element', function (){
    it('should successfully create list item tag from the line', function(){
        // arrange
        const test_line = "* This is a list item"
        const expected_result = '<li> This is a list item</li>\n'

        // act 
        var ret = createListItem(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
})


describe('[JSX]:= creating a <li> tag element with strong', function (){
    it('should successfully create list item tag from the line', function(){
        // arrange
        const test_line = "* This is a **strong** list item"
        const expected_result = '<li> This is a <strong>strong</strong> list item</li>\n'

        // act 
        var ret = createListItem(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
})