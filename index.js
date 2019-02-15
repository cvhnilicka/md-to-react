var fs = require('fs');
const MD_DIR = './markdowns/';

const HEADER = "const "


readMarkdownDirectory()





function mDtoReactElement(line) {
    if (line.charAt(0) === '#') {
        var hValue = 1;
        for(var i = 1; i < line.length; i++) {
            if (line.charAt(i) === '#') hValue++;
        }
        return '<h'+hValue+'>' + line.substr(hValue) + '</h' + hValue +'>';
    }
   
    return ""
}


function readSingleFileAndSplit(filename) {
    var fileToRead = MD_DIR + filename;


    console.log(fileToRead)
    fs.readFile(fileToRead, 'utf8', function (err, contents) {
        var arr = contents.split('\n');  // split the file into lines

        var stream = fs.createWriteStream(filename.substr(0, filename.length-3) + ".js");
        stream.once('open', function (fd) {
            stream.write(HEADER + filename.charAt(0).toUpperCase() + filename.substr(1, filename.length-4) + " = () => (\n");  // Writing the header of the react component

            // here i need to figure out react components
            arr.forEach(element => {
                // console.log('E:' + element)
                var ret = mDtoReactElement(element);
                stream.write('\n'+ret)
            });

            stream.write(');\n\nexport default ' + filename.charAt(0).toUpperCase() + filename.substr(1, filename.length-4) + ";") // Closing and exporting the react component

            stream.end();
        });



        console.log(arr.length);
    });
}


function readMarkdownDirectory() {
    fs.readdir(MD_DIR, (err, files) => {
        files.forEach(file => {
            readSingleFileAndSplit(file);
        });
    });
}
