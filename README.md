# md-to-react

An NPM package that converts markdown files to a static react component. It parses the markdown files located in the `./markdown/` directory and maps markdown formatting to JSX elements.

### Current mappings

###### Formatting
`**bold**` => **bold**  

###### Headers
`# Header 1` => `<h1>Header 1</h1>`  
`## Header 2` => `<h2>Header 1</h2>`  
`### Header 3` => `<h3>Header 1</h3>`  
`#### Header 4` => `<h4>Header 1</h4>`  
`###### Header 5` => `<h5>Header 1</h5>`  
`####### Header 6` => `<h6>Header 1</h6>`  

###### Links

__supports inline links only currently__

`<inner-naked-link-text>` => `<a href="inner-naked-link-text">inner-naked-link-text</a>`  
`[here](http://daringfireball.net/projects/markdown/syntax)` => `<a href="http://daringfireball.net/projects/markdown/syntax">here</a>`  

###### Lists
`* A list item` => `<li> A list item</li>`

###### Images
`![MacDown logo](http://macdown.uranusjr.com/static/images/logo-160.png)` => `<img src={"http://macdown.uranusjr.com/static/images/logo-160.png"} alt="MacDown logo" />`

#### Testing

To test, run `npm test`

Current testing is done with Mocha and Chai. 

