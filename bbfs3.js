function getArgs(url) {
   if (typeof url !== "string") {
      url = location.search.substring(1);
   }
   var i, args = new Object(), query = url, pairs = query.split("&"), index;
   for (i = 0; i < pairs.length; i++) {
      index = pairs[i].indexOf("=");
      if (index === -1) continue;
      args[pairs[i].substring(0, index)] = unescape(pairs[i].substring(index + 1).split("+").join(" "));
   }
   return args;
}
function doStuff(str) {
   var f;
   if (document.forms[0] && document.forms[0].str && document.forms[0].txt) {
      f = document.forms[0];
      if (str.length > 0) {
         f.str.value = str;
      }
      combineApp.calcCombinations({
         src: f.str,
         dest: f.txt,
         msgID: "count",
         tokenChar: ",",
         outputDelimiter: "*",
         maxCombinations: 600000
      });
      f.str.focus();
   }
   return false;
}
window.onload = function () {
   var args = getArgs();
   args.str = (typeof args.str !== "undefined") ? args.str.toString() : "";
   doStuff(args.str);
};