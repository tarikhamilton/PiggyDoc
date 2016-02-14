'use strict';

var fs = require('fs')

var VERBOSE_MODE = true

if (VERBOSE_MODE) { console.log('Verbose Mode is ON') }

/**
 * @class PiggyDoc
 */
var PiggyDoc = (function () {
  /**
   * Files to be scanned
   * 
   * @private
   * @property files
   * @type Array
   */
  var _files = []
  
  /**
   * Pig config
   * 
   * Your pigs are added here.
   * 
   * @private
   * @property config
   * @type Object
   */
  var _config
  
  /**
   * Init
   */
  
  // Set default config
  fs.readFile('pigconfig.json', 'utf8', (err, data) => {
    if (!err) {
      _config = JSON.parse(data)
    }
    else {
      if (VERBOSE_MODE)
        console.log('pigconfig.json could not be found.')
    }
  })

  function PiggyDoc() {
    /**
     * Reads or sets the configuration from a path or JSON
     * 
     * @method  config
     * @param   settings  {mixed} Can be a path (preferred) or object literal
     * @return  {Object}  Returns current config, if no argument provided
     */
    this.config = function (settings) {
      var config = settings || null
      if (typeof config == 'object' && config) {
        _config = config
      }
      else if (typeof config == 'string') {
        fs.readFile(config, 'utf8', (err, data) => {
          _config = JSON.parse(data)
        })
      }
      else {
        return _config
      }
    }
    
    /**
     * Adds file(s) to PiggyDoc's file list
     * 
     * @method addFiles
     * @param filepath    {Mixed}     Accepts Array of filepaths or a String of a filepath.
     * @param [callback]  {Function}  Runs after all files have been added.
     */
    this.addFiles = function (filepath, callback) {
      var callback = callback || function () { },
        fileCount = Array.isArray(filepath) ? filepath.length : 1,
        filesProcessed = 0

      function addFile(filepath) {
        fs.readFile(filepath, 'utf8', function (error, data) {
          if (!error) {
            let file = {
              path: filepath,
              content: data
            }
            _files.push(file)

            if (VERBOSE_MODE)
              console.log(file.path + ' was successfully added.')
          }
          else
            console.log('Oops! The file "' + error.path + '" failed to be added.')

          filesProcessed++

          if (filesProcessed == fileCount)
            callback()

        }.bind(this))
      }

      if (Array.isArray(filepath)) {
        filepath.forEach((filepath) => {
          addFile(filepath)
        })
      }
      else {
        addFile(filepath)
      }
    }
    
    /**
     * Parser
     * 
     * @method
     */
    this.parse = {
      /**
       * Get docblocks from files
       * 
       * @method getDocblocks
       * @returns files {Array} An array with the keys being file paths,
       *    and the values is an array of the docblocks
       */
      getDocblocks: function () {
        var regexDocblock = /(\/\*{2})([\s\S]+?)\*\//g,
          docblocks,
          files = []

        _files.forEach((file, i) => {
          docblocks = file.content.match(regexDocblock)
          files[file.path] = docblocks
        })
        console.log(files)
        return files
      }
      /**
       * Read lines of docblock and apply function to line 
       * 
       * @method  readLines
       * @param   callback {Function} Perform function on each line.
       */
      onEachLine: function (callback) {

      }
    }
  }

  return PiggyDoc
} ())

/**
 * Test
 * 
 * Leave the following line uncommented out to test this out with the VSC debugger.
 */
var piggydoc = new PiggyDoc()
piggydoc.addFiles(['test.php', 'another'], piggydoc.parse.getDocblocks)


// module.exports = {
//   doc: generate
// }