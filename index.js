var fs = require('fs');

// BEGIN:  CONSTANTS
const MD_DIR = './markdowns/';                              // The markdown directory
const HEADER = "const "                                     // The beginning of each react component to be created
// LINK
const REGEX_LINK_DEC = /\[.*?\]/g
const REGEX_LINK_NAK = /<.*?>/g
// IMG
const REGEX_IMG = /\!\[.*?\]\(.*?\)/g
const REGEX_IMG_TITLE = /\!\[.*?\]/g
const REGEX_IMG_SRC = /\(.*?\)/g
// LIST
const REGEX_LIST = /^\*\s\S/g
const REGEX_LIST_MULTILINE = /^\*\s\S.+\s{2}/g
const REGEX_LIST_CONVERTED = /^\<li\>.*\<\/li\>/g
// MISC
const REGEX_INNER_STRONG = /\*\*[^.*?]+\*\*/g

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
    if (line.match(REGEX_IMG) === null) return;
    var title = line.match(REGEX_IMG_TITLE)[0]
    title = title.substring(2, title.length - 1)
    var src = (line.match(REGEX_IMG_SRC)[0])
    src = src.substring(1, src.length - 1)
    return '<img src={"' + src + '"} alt="' + title + '" />\n\n'
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
    if (line.match(REGEX_LINK_DEC) !== null || line.match(REGEX_LINK_NAK) !== null) {


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
                switch (line.charAt(i)) {
                    case '[': display = true
                        i += 1
                        break;
                    case ']': display = false
                        break;
                    case '(': ref = true
                        i += 1
                        break;
                    case ')': ref = false
                        break;
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
    } else {
        return
    }
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
    if (lineStartingWithPound.charAt(0) !== '#') return;
    var hValue = 1;
    for (var i = 1; i < lineStartingWithPound.length; i++) {
        if (lineStartingWithPound.charAt(i) === '#') hValue++;
        else if (hValue > 6) {
            hValue = 6;
            break;
        } else break;
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
    if (line.charAt(0) === '#') {
        return createHeaderTag(line);
    } else if (line.match(REGEX_LINK_DEC) !== null || line.match(REGEX_LINK_NAK) !== null) {
        return createATag(line);
    }
    else if (line.match(REGEX_IMG) !== null) {
        return createImageTag(line);
    } else if (line.match(REGEX_LIST) !== null) {
        return createListItem(line);
    } else {
        return checkInnerText(line);
    }
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
        var listBool = false;

        var stream = fs.createWriteStream('./output/' + filename.substr(0, filename.length - 3) + ".js");
        stream.once('open', function (fd) {
            stream.write(HEADER + filename.charAt(0).toUpperCase() + filename.substr(1, filename.length - 4) + " = () => (\n");  // Writing the header of the react component
            // local variables
            var listItemArr = [];   // used for dynamic lists
            var inList = false;     // used for list writing
            var endListCount = 0;   // counts number of lines after list to write out


            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === "") {
                    continue
                } else {
                    if (arr[i]) {
                        if (arr[i] === '\n' || arr[i].trim().length == 0) {
                            continue;
                        } else {
                            var ret = mDtoReactElement(arr[i]);

                            // OLD LIST CODE IS COMMENTED AT EOF
                            if (REGEX_LIST_CONVERTED.test(ret)) {
                                endListCount = 0;
                                // we are in a list
                                if (!inList) inList = true;
                                // first check if it is a multiline
                                if (arr[i].match(REGEX_LIST_MULTILINE) !== null) {
                                    // add add next to middle of element 
                                    ret = ret.substr(0, ret.length - 7) + arr[i + 1] + '</li>\n';
                                    i += 1;
                                }
                                // add it to the list item array 
                                listItemArr.push(ret);
                            }

                            if (!REGEX_LIST_CONVERTED.test(ret)) endListCount += 1;

                            if (endListCount > 1) {
                                // write out the list
                                stream.write('\n<ul>\n')
                                for (var k = 0; k < listItemArr.length; k++) {
                                    stream.write(listItemArr[k]);
                                }
                                stream.write('</ul>\n')
                                inList = false;
                                listItemArr = []
                            }

                            if (!inList) stream.write('\n' + ret + '\n')
                        }
                    }
                }
            }

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
    createImageTag: createImageTag,
    readMarkdownDirectory: readMarkdownDirectory,
    readSingleFileAndSplit: readSingleFileAndSplit
};
