(function(window) {
  // Initialize casing object
  window.__casing = window.__casing || {
    mode: "inline"
  };

  // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
  /**
   * Given a string return the camel case version of the string
   * @param  {String} str The string to convert to camel case
   * @return {String}     The camel case version of the string
   */
  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  /**
   * Check if target is a valid JS object
   * @param  {Any}  target    The object to check
   * @return {Boolean}        True if JS object False otherwise
   */
  function isObject(target) {
    // Exclude dates, null, arrays
    return (target !== undefined) && (target !== null) && (typeof target === "object") && (Object.prototype.toString.call(target) === "[object Object]");
  }

  /**
   * Convert a multi-line CSS string into camelcased object form
   * @param  {String} styleString The css string
   * @return {Object}             An object with inline styles in camelCase form
   */
  function toCamel(styleString) {
    // Replace all new lines with ;
    var styleObject = {};

    // Parse css
    try {
      var ast = window.csstree.parse(styleString);
      var stack = [];
      window.csstree.walk(ast, function(node) {
        if (node.type === "Rule") {
          // Get the selector or selector list
          stack.push({
            type: "rule",
            classes: []
          });
        }
        if (node.type === "ClassSelector") {
          // Check if we are within a rule
          if (stack[stack.length - 1].type === "rule") {
            stack[stack.length - 1].classes.push({
              name: node.name,
              block: null
            });
          }
        }
        if (node.type === "Block") {
          if (stack[stack.length - 1].type === "rule") {
            stack[stack.length - 1].classes[stack[stack.length - 1].classes.length - 1].block = window.csstree.translate(node);
          } 
        }
      });
      // Now run over rules
      stack.forEach(function(rule) {
        var classes = rule.classes;
        var camelizedNames = classes.map(function(k) {
          return camelize(k.name);
        });
        // For each of the classes, create rules in turn
        classes.forEach(function(klass, index) {
          let camelized = camelizedNames[index];
          if (klass.block) {
            styleObject[camelized] = toCamel(klass.block.replace(/\{|\}/g, ""));
          }
          if (index > 0) {
            var i = 0, start = {};
            // Merge the styles of previous klasses in
            for (i; i < index; i++) {
              start = Object.assign(start, styleObject[camelizedNames[i]]);
            }
            styleObject[camelized] = Object.assign(start, styleObject[camelized]);
          }
        });
      });
      return styleObject;
    } catch (e) {
      // Ignore, might be simple style declarations
    }

    styleString =  styleString.replace(/\n|\t/g, ";");
    var styleLines = styleString.split(";").filter(function (line) {
      return line.length !== 0;
    });

    // Run camel case conversion
    styleLines.forEach(function (line) {
      var split = line.replace(/\-/g, " ").replace(/\;/g, "").trim().split(":");
      var camelCased = camelize(split[0]);
      styleObject[camelCased.trim()] = split[1].trim();
    });
    return styleObject;
  }

  /**
   * Given any string return lower-under version of it
   * @param  {String} str The string to transform
   * @return {String}        The transformed string
   */
  function lowerUnder(str) {
    return str.replace(/[\-\:]/g, " ").replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : "-" + match.toLowerCase();
    });
  }

  /**
   * A function that converts an inline style 
   * @param  {Object} camelcaseStyles The style object in camel case notation
   * @return {String}                 CSS string
   */
  function toCSS(camelcaseStyles) {
    // Check if it is a valid object
    if (!isObject(camelcaseStyles)) {
      throw new Error("Expected an object instead got " + typeof camelcaseStyles);
    }
    var styleStringArray = [];
    Object.keys(camelcaseStyles).forEach(function (key) {
      styleStringArray.push(lowerUnder(key) + " : " + camelcaseStyles[key].replace("\"", "") + ";");
    });
    return styleStringArray.join("\n");
  }

  window.__casing.toCSS = toCSS;
  window.__casing.toCamel = toCamel;
  return window;

})(window);
