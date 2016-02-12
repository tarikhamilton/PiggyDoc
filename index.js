var fs = require('fs')

var shortcode = {
    name: '',
    attributes: []
}

var generate = function() {
    fs.readFile('wp-shortcode-documentor/test.php', 'utf8', function(error, data) {
        /**
         * Array of your pigs
         */
        var pigs = []
        
        if (!error) {
            var regex = /(\/\*{2})([\s\S]+?)\*\//g,
                docblocks = data.match(regex)            
            /*
             * pig, as in piggyback. This is supposed to go in a regular docblock.
             * 
             * pig.trigger identifies docblocks with your custom tag and scan the rest
             *             the custom parameters.
             * 
             * pig.tags an array that houses the custom parameters.
             * 
             * IMPORTANT!!!
             * You must escape all characters that would be escaped in Regex.
             * 
             * When using new RegExp (allows for a variable to go into the regex)
             * you must escape for the JavaScript String, and again for regex.
             * 
             * Ex: \\$param
             * 
             */
           
            var param = {
                name: '\\$param'
            }
            
            var pig = {
                trigger: '\@shortcode', 
                tags: [param]
            }
            
            docblocks.forEach(function(docblock, i) {
                if (docblock.match(/\@shortcode/g)) {
                    var lines = docblock.split('\n')
                    
                    // at each line, check if any of the parameters are present at the start
                    lines.forEach(function(line, i) {
                        pig.tags.forEach(function(tag) {                        
                            var tagRegex = new RegExp('\\s\\*\\s' + tag.name),
                                match = line.search(tagRegex) // How does Harry like this when VCS doesn't highlight variables on subsequent lines?!
                            
                            if (match != -1) {             
                                /*
                                 * For some reason line.split(' ') returns
                                 * 
                                 * [ '',
                                 *   '*',
                                 *   '$param',
                                 *  ...
                                 * ]
                                 * 
                                 * There's an empty string in the beginning... 
                                 * Rather unpredictable. Let's remove that later.
                                 * 
                                 * This effects:
                                 *   var name,
                                 *   split.splice
                                 */                                               
                                var split = line.split(' ')
                                
                                // Get the tag's name
                                var name = split[2]
                                
                                // Get the description
                                split.splice(0,3) // 
                                split = split.join(' ')
                                var desc = split
                                console.log(desc)
                                
                            }
                        })
                        
                        
                    })
                    
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