var fs = require('fs');

// BEGIN:  CONSTANTS
const MD_DIR = './markdowns/';                              // The markdown directory
const HEADER = "const "                                     // The beginning of each react component to be created
const LINK_REGEX = /\[.*?\]/g
// END:  CONSTANTS



readMarkdownDirectory()


//=================================================================================================================================================================================
//========================================================= BEGIN: Helper functions for MD -> JSX =================================================================================
//=================================================================================================================================================================================

/**
 * Markdown Links to JSX Links
 *
 * Converts a markdown link to a jsx link for the react component.
 * 
 * @param {string}   line     A line that begins with [ indicating a link
 * 
 * @return {string} The full jsx link
 */
function createATag(line) {
    var displayText = ""
    var href = ""
    var display = false
    var ref = false

    for(var i = 0; i < line.length; i++) {
        if(line.charAt(i) === '[') {
            display = true 
            i+=1;
        } else if (line.charAt(i) === ']') {
            display = false
        }
        if(line.charAt(i) === '(') {
            ref = true
            i+=1;
        } else if (line.charAt(i) === ')') {
            ref = false
        }

        if(display) {
            displayText += line.charAt(i)
        } else if (ref) {
            href += line.charAt(i)
        }
    }
    displayText = checkInnerText(displayText)
    return '<a href="' + href + '">'+displayText+'</a>\n\n'
}


/**
 * Markdown Headers to JSX Headers
 *
 * Takes in a particular line that has been determined to begin with a pound symbol. This will iterate through the line and create the necessary
 * header tag of proper size and return it.
 * 
 * @param {string}   lineStartingWithPound     A line that begins with the pound symbol # to be converted to a <h*></h*> tag
 * 
 * @return {string} The full header tag with content
 */
function createHeaderTag(lineStartingWithPound) {
    var hValue = 1;
    for (var i = 1; i < lineStartingWithPound.length; i++) {
        if (lineStartingWithPound.charAt(i) === '#') hValue++;
        else break;
    }
    return '<h' + hValue + '>' + lineStartingWithPound.substr(hValue) + '</h' + hValue + '>\n';
}

/**
 * Formats Inner Markdown Text
 *
 * Takes in a particular line and iterate over it determining if it requires any 'special' formatting.
 * Current formatting it will check and complete.  Bold -> <strong></strong>
 * 
 * @param {string}   line     A line that needs to be checked
 * 
 * @return {string} The converted line from markdown to JSX
 */
function checkInnerText(line) {
    var returnText = ""
    var boldStart = false;
    for (var i = 0; i < line.length; i++) {
        // iterate through line and look for inner text effects such as strong/italics
        if (line.charAt(i) === '*' && line.charAt(i + 1) === '*') {
            // its probably bold. we should iterate through and look for the next ** and close inner text in a strong
            returnText += !boldStart ? '<strong>' : '</strong>';
            boldStart = !boldStart
            i += 1;  // skip the double *
        } else {
            returnText += line.charAt(i)
        }
    }
    return returnText
}

/**
 * Markdown to React
 *
 * Takes in a particular line and will determine what formatting needs to be addressed
 * 
 * @param {string}   line     A line that needs to be checked
 * 
 * @return {string} The converted line from markdown to JSX
 */
function mDtoReactElement(line) {

    switch(line.charAt(0)){
        case '#': if(line.charAt(1) === '#') { createHeaderTag(line)}
                else if (line.charAt(1) === ' ') {createListTag(line)}
    }
    if (line.charAt(0) === '#') {
        return createHeaderTag(line);
    } else if(line.match(LINK_REGEX) !== null) {
        return createATag(line);
    } else {
        // console.log(new RegExp(LINK_REGEX).test(line))
        return checkInnerText(line);
    }

    return ""
}


//=================================================================================================================================================================================
//========================================================= END: Helper functions for MD -> JSX ===================================================================================
//=================================================================================================================================================================================





//=================================================================================================================================================================================
//========================================================= BEGIN: Directory and File Access ======================================================================================
//=================================================================================================================================================================================

function readSingleFileAndSplit(filename) {
    var fileToRead = MD_DIR + filename;
    console.log(fileToRead)
    fs.readFile(fileToRead, 'utf8', function (err, contents) {
        var arr = contents.split('\n');  // split the file into lines

        var stream = fs.createWriteStream('./output/' + filename.substr(0, filename.length - 3) + ".js");
        stream.once('open', function (fd) {
            stream.write(HEADER + filename.charAt(0).toUpperCase() + filename.substr(1, filename.length - 4) + " = () => (\n");  // Writing the header of the react component

            // here i need to figure out react components
            arr.forEach(element => {
                var ret = mDtoReactElement(element);
                stream.write('\n' + ret)
            });


            stream.write(');\n\nexport default ' + filename.charAt(0).toUpperCase() + filename.substr(1, filename.length - 4) + ";") // Closing and exporting the react component
            stream.end();

        });
    });
}

/**
 * Reads all files the markdown directory
 *
 * Iterates through the ./markdown/ directory to convert each *.md file to a react component
 */
function readMarkdownDirectory() {
    fs.readdir(MD_DIR, (err, files) => {
        files.forEach(file => {
            readSingleFileAndSplit(file);
        });
    });
}

//=================================================================================================================================================================================
//========================================================= END: Directory and File Access ========================================================================================
//=================================================================================================================================================================================
