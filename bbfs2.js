var isArray = function(o) {
   return (o instanceof Array) || (Object.prototype.toString.apply(o) === "[object Array]");
},
combineApp = {
   combinations: function(args) {
      var n, inputArr = [], copyArr = [], results = [],
      subfunc = function(copies, prefix) {
         var i, j, myCopy = [], exprLen, currentChar = "", result = "";
         // if no prefix, set default to empty string
         if (typeof prefix === "undefined") {
            prefix = "";
         }
         // no copies, nothing to do... return
         if (!isArray(copies) || typeof copies[0] === "undefined") {
            return;
         }
         // remove first element from "copies" and store in "myCopy"
         myCopy = copies.splice(0, 1)[0];
         // store the number of characters to loop through
         exprLen = myCopy.length;
         for (i = 0; i < exprLen; i += 1) {
            currentChar = myCopy[i];
            result = prefix + currentChar;
            // if resulting string length is the number of characters of original string, we have a result
            if (result.length === n) {
               results.push(result);
            }
            // if there are copies left,
            //   pass remaining copies (by value) and result (as new prefix) into subfunc (recursively)
            if (typeof copies[0] !== "undefined") {
               subfunc(copies.slice(0), result);
            }
         }
      };
      // for each character in original string
      //   create array (inputArr) which contains original string (converted to array of char)
      if (typeof args.str === "string") {
         inputArr = args.str.split("");
         for (n = 0; n < inputArr.length; n += 1) {
            copyArr.push(inputArr.slice(0));
         }
      }
      if (isArray(args.arr)) {
         for (n = 0; n < args.arr.length; n += 1) {
            copyArr.push(args.arr[n].split(""));
         }
      }
      // pass copyArr into sub-function for recursion
      subfunc(copyArr);
      return results;
   },
   displayMsg: function(msgText, msgID) {
      var msg, nmsg;
      if (typeof msgID === "string" && document && document.getElementById && document.getElementById(msgID)) {
         msg = document.getElementById(msgID);
         nmsg = msg.cloneNode(false);
         msg.parentNode.insertBefore(nmsg, msg);
         msg.parentNode.removeChild(msg);
         nmsg.appendChild(document.createTextNode(msgText));
      } else if (msgText.length > 0) {
         alert(msgText);
      }
   },
   calcCombinations: function(args) {
      if (!args) {
         //args = {};
         return false;
      }
      args.src = (typeof args.src === "object") ? args.src : null;
      args.dest = (typeof args.dest === "object") ? args.dest : null;
      args.msgID = (typeof args.msgID === "string") ? args.msgID : null;
      args.tokenChar = (typeof args.tokenChar === "string") ? ((args.tokenChar.length > 0) ? args.tokenChar : ",") : ",";
      args.outputDelimiter = (typeof args.outputDelimiter === "string") ? args.outputDelimiter : "*";
      args.maxCombinations = (typeof args.maxCombinations === "number") ? parseInt(args.maxCombinations, 10) : 600000;
      
      if (args.src === null || args.dest === null) {
         alert("calcCombinations() required arguments are missing.");
         return false;
      }
      var str = args.src.value, arr = [], objParam = {}, i, numChars, num = 0, doIt = true;
      args.dest.value = "";
      if (str.indexOf(args.tokenChar) !== -1) {
         arr = str.split(args.tokenChar);
         num = 1;
         for (i = 0; i < arr.length; i++) {
            numChars = arr[i].length;
            if (numChars === 0) {
               arr[i] = " ";
            } else {
               num *= numChars;
            }
         }
         str = "[" + arr.join("][") + "]";
         objParam = {"arr": arr};
      } else {
         num = Math.pow(str.length, str.length);
         objParam = {"str": str};
      }
      if (num <= args.maxCombinations && num > 5000) {
         doIt = confirm("This will produce " + num + " combinations. Are you sure you want to continue?");
      }
      if (num > 0) {
         if (num > args.maxCombinations) {
            args.dest.value = "It would take too long for JavaScript to calculate and display all of those combinations of characters.";
         }
         combineApp.displayMsg(num + " kombinasi dari \"" + str + "\".", args.msgID);
         // don't kill the user's CPU using JavaScript to calculate too many combinations
         if (num <= args.maxCombinations && doIt) {
            args.dest.value = combineApp.combinations(objParam).join(args.outputDelimiter);
         }
      }
      return false;
   }
};