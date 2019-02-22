var expect = require('chai').expect;
var createListItem = require('../../index').createListItem;
var readSingleFileAndSplit = require('../../index').readSingleFileAndSplit

describe('{UNIT} - [JSX]:= creating a <li> tag element', function (){
    it('should return as it is not formatted for a list item', function(){
        // arrange
        const test_line = "-- Not a list item"

        // act 
        var ret = createListItem(test_line); 

        // assert 
        expect(ret).to.be.equal(undefined);
    })
    it('should successfully create list item tag from the line', function(){
        // arrange
        const test_line = "* This is a list item"
        const expected_result = '<li> This is a list item</li>\n'

        // act 
        var ret = createListItem(test_line); 

        // assert 
        expect(ret).to.be.equal(expected_result);
    })
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


// describe('{INTEGRATION} - [JSX]:= creating a full unordered list', function (){
//     it('should successfully dynamically create an unordered list from the input md file', function(){
//         // arrange
//         const test_line = "* This is a **strong** list item"
//         const expected_result = '<li> This is a <strong>strong</strong> list item</li>\n'

//         // act 
//         var ret = createListItem(test_line); 

//         // assert 
//         expect(ret).to.be.equal(expected_result);
//     })
// })

