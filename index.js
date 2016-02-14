'use strict';

var fs = require('fs')

var VERBOSE_MODE = true

if (VERBOSE_MODE) { console.log('Verbose Mode is ON') }

/**
 * @class PiggyDoc
 */
var PiggyDoc = function () {
  /**
   * Files to be read
   * 
   * @property
   * @type Array
   */
  this.files = []
    
  /**
   * Collection of Pigs
   * 
   * @property
   * @type Array
   */
  this.pigs = []
  
  /**
   * Pig config
   * 
   * @property
   * @type String
   */
  this.config = {}

  /**
   * Adds file to files
   * 
   * @method addFile
   */
  this.addFile = function (filepath) {
    fs.readFile(filepath, 'utf8', function (error, data) {
      if (!error) {
        let file = {
          path: filepath,
          content: data
        }
        this.files.push(file)
        
        if (VERBOSE_MODE)
          console.log(file.path + ' was successfully added.')
        
      } else {
        console.log(error)
      }
    }.bind(this))
  }
}

var piggydoc = new PiggyDoc()

var generate = function () {
  fs.readFile('wp-shortcode-documentor/test.php', 'utf8', function (error, data) {

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
        trigger: '\\@shortcode',
        tags: [param]
      }

      docblocks.forEach(function (docblock, i) {
        var triggerRegex = new RegExp(pig.trigger, 'g')
        if (docblock.match(triggerRegex)) {
          var lines = docblock.split('\n')
                    
          // at each line, check if any of the parameters are present at the start
          lines.forEach(function (line, i) {
            pig.tags.forEach(function (tag) {
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
                split.splice(0, 3) // 
                split = split.join(' ')
                var desc = split
                console.log(name, desc)

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

/**
 * Test
 * 
 * Leave the following line uncommented out to test this out with the VSC debugger.
 */
piggydoc.addFile('test.php')



module.exports = {
  doc: generate
}