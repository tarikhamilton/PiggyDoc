var fs = require('fs')


var generate = function() {
    fs.readFile('wp-shortcode-documentor/test.php', 'utf8', function(error, data) {
        console.log('start')
        if (!error) {
            console.log(data)
            var regex = /(\/\*{2})([\s\S]+?)\*\//g,
                docblocks = data.match(regex)
            
            console.log(docblocks)
            
            docblocks.forEach(function(docblock, i) {
                if (docblock.match(/\@shortcode/g)) {
                //if (docblock.includes('@shortcode')) {
                    console.log('Docblock ' + i + ' includes a shortcode')
               }      
            })          
        } else {
            console.log(error)           
        }
        
    })
}

module.exports = {
    doc: generate
}