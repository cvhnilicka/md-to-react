var fs = require('fs');

// BEGIN:  CONSTANTS
const MD_DIR = './markdowns/';                              // The markdown directory
const HEADER = "const "                                     // The beginning of each react component to be created
const REGEX_LINK_DEC = /\[.*?\]/g
const REGEX_LINK_NAK = /<.*?>/g
const REGEX_INNER_STRONG = /\*\*[^.*?]+\*\*/g
const REGEX_IMG = /\!\[.*?\]\(.*?\)/g
// END:  CONSTANTS



// readMarkdownDirectory()


//=================================================================================================================================================================================
//========================================================= BEGIN: Helper functions for MD -> JSX =================================================================================
//=================================================================================================================================================================================

/**
 * Markdown inline image to jsx image
 *
 * Takes in a particular line that contains an inline refrence for an image and converts it 
 * to a jsx img tag
 * 
 * @param {string}   line     A line that contains an inline image 
 * 
 * @return {string} A new image
 */
function createImageTag(line) {
    var title = line.match(/\!\[.*?\]/g)[0]
    title = title.substring(2, title.length-1)
    var src = (line.match(/\(.*?\)/g)[0])
    src = src.substring(1, src.length-1)
    return '<img src={"'+ src+'"} alt="' + title + '" />\n\n'
}


/**
 * Markdown list item to li element
 *
 * Takes in a particular line that has been determined to begin with a * and creates a <li> tag for it
 * 
 * @param {string}   line     A line that begins with an astrix
 * 
 * @return {string} A new list item
 */
function createListItem(line) {
    if (line.charAt(0) !== '*') return;
    var displayText = checkInnerText(line.substr(1, line.length - 1));
    return '<li>' + displayText + '</li>\n'
}


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
    var matches;
    if ((matches = line.match(REGEX_LINK_NAK)) !== null) {
        href = matches[0].substr(1, line.length - 2);
        displayText = matches[0].substr(1, line.length - 2);
    } else {

        for (var i = 0; i < line.length; i++) {
            if (line.charAt(i) === '[') {
                display = true
                i += 1;
            } else if (line.charAt(i) === ']') {
                display = false
            }
            if (line.charAt(i) === '(') {
                ref = true
                i += 1;
            } else if (line.charAt(i) === ')') {
                ref = false
            }

            if (display) {
                displayText += line.charAt(i)
            } else if (ref) {
                href += line.charAt(i)
            }
        }
        displayText = checkInnerText(displayText)
    }
    return '<a href="' + href + '">' + displayText + '</a>\n\n'
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

    // switch(line.charAt(0)){
    //     case '#': if(line.charAt(1) === '#') { createHeaderTag(line)}

    // }
    if (line.charAt(0) === '#') {
        return createHeaderTag(line);
    } else if (line.match(REGEX_LINK_DEC) !== null || line.match(REGEX_LINK_NAK) !== null) {
        return createATag(line);
    }
    else if (line.match(REGEX_IMG) !== null) {
        return createImageTag(line);
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

module.exports = {
    createATag: createATag,
    createHeaderTag: createHeaderTag,
    createListItem: createListItem,
    createImageTag: createImageTag
};