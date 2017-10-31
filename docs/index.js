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
    styleString =  styleString.replace(/\n|\t/g, ";");
    var styleLines = styleString.split(";").filter(function (line) {
      return line.length !== 0;
    });
    // Run camel case conversion
    var styleObject = {};
    styleLines.forEach(function (line) {
      var split = line.replace("-", " ").replace(";", "").trim().split(":");
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
