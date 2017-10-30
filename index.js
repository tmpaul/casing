var styles = document.getElementById("example").innerHTML;
// break on newline
var styleLines = styles.split("\n").filter((line) => {
	return line.length !== 0;
});

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

// Run camel case conversion
let styleObject = {};
styleLines.forEach((line) => {
	let split = line.replace("-", " ").replace(";", "").trim().split(":");
  let camelCased = camelize(split[0]);
  styleObject[camelCased.trim()] = split[1].trim();
});

console.log(styleObject);
