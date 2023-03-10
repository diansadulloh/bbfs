var d=0;
a = new Array();
  
// ========================================================
function ClearReset() {
  window.document.interfaceform.maxwidth.value = "";
  window.document.interfaceform.inputstring.value = "";
  window.document.interfaceform.permlist.value = "";
  window.document.interfaceform.feedback.value = "";
}

// ========================================================
function GeneratePermutations() {
  var inputstring=window.document.interfaceform.inputstring.value;
  inputstring=removeSpaces(inputstring);
  if (inputstring=="") return;

  var maxoutput=window.document.interfaceform.maxoutput.value;
  maxoutput=removeSpaces(maxoutput);

  var display_list=window.document.interfaceform.chkbx_display.checked;
  var allow_adjacent_equals=window.document.interfaceform.chkbx_allow.checked;
  var wrap_output=window.document.interfaceform.chkbx_wrap.checked;
  var circular_only=window.document.interfaceform.chkbx_circular.checked;
  var derange_only=window.document.interfaceform.chkbx_derange.checked;
  var shuffle=window.document.interfaceform.chkbx_shuffle.checked;

  var maxwidth=window.document.interfaceform.maxwidth.value;
  maxwidth=removeSpaces(maxwidth);

  var comma_separated=window.document.interfaceform.chkbx_comma.checked;

// Show status.
//      This does not work, since Javascript has no way to flush the output during function execution.
//      If you find a SIMPLE way, please let me know?  Thanks - DVdm
//
window.document.interfaceform.permlist.value = "";
if (display_list) {
    window.document.interfaceform.feedback.value = "Generating..."
  } else {
    window.document.interfaceform.feedback.value = "Counting..."
  }

// Get time
//
  var currentDate = new Date();
  var seconds = currentDate.valueOf()
  
// Automatic comma separation check (maybe later)
//
  if ( inputstring.indexOf(',') >-1 ) {
      comma_separated=true;
      window.document.interfaceform.chkbx_comma.checked=true;
  } else {
      comma_separated=false;
      window.document.interfaceform.chkbx_comma.checked=false;
  }

  var delimiter = "";
  if (wrap_output) {
      if (comma_separated)
          delimiter = "  ";
      else
          delimiter = "*";
      } else {
          delimiter = "\n";
  }
  var delimwidth = delimiter.length;

  var chars = new Array();
  var charray = new Array();
  var frequency = new Array();
  var inputchar, ii, jj, cc, ccc, numchars, nn=0;

  if (comma_separated) {
      chars = inputstring.split(",");
      numchars = chars.length;
    } else {
    numchars = inputstring.length;
    for (ii=0; ii<numchars; ii++) chars[ii] = inputstring.charAt(ii);
  }

  for (ii=0; ii<numchars; ii++) {
    inputchar = chars[ii];
    cc = -1;
    for (ccc=0; ccc<charray.length; ccc++) { if (inputchar == charray[ccc]) cc = ccc; }
    if (cc<0) {
      charray[charray.length] = inputchar;
      frequency[frequency.length] = 1;
    } else {
      frequency[cc]++;
    }
  }

  d = 0;
  for (ii=0; ii<frequency.length; ii++) {
    cc = frequency[ii];
    for (jj=0; jj<cc; jj++) {
      a[d] = nn;
      d++;
    }
    nn++;
  }

  var perms = 0;
  var output_text = delimiter;
  var new_perm = "";
  var circular = false;
  var test_perm = "";
  var okay = true;
  var firstcomma = -1;
  var busy = true
  var ellipsis = "";
  var atleast = "";
  var insertat = 0;
  var dmax=d;
  if (maxwidth > 0) {
    if (maxwidth <= d) {
      dmax = maxwidth;
    } else {
      window.document.interfaceform.feedback.value = "Max width " + (maxwidth) + " exceeds " + (d) + ".\n";
      return;
    }
  }

  do {
    if ( (allow_adjacent_equals) || (! Adjacent_equals()) ) {
    
      okay = true;
      new_perm = "";
      
      if (comma_separated) {

        for (ii=0; ii<dmax; ii++) {
          new_perm = new_perm + charray[a[ii]];
          if (ii<dmax-1) new_perm = new_perm+",";
        }
        if (maxwidth > 0) {
          if ( output_text.indexOf(new_perm+delimiter) >-1 ) okay = false;    // yes, this is dirty
        }
        if (circular_only) {
          test_perm = new_perm;
          test_perm_len = test_perm.length;
          for (ii=0; ii<dmax-1; ii++) {
            firstcomma = test_perm.indexOf(",");
            test_perm = test_perm.substring(firstcomma+1,test_perm_len) + "," + test_perm.substring(0,firstcomma);
            if ( output_text.indexOf(test_perm) >-1 ) {
              okay = false;
              break;
            }
          }
        }
        if (derange_only) {
          for (ii=0; ii<dmax; ii++) {
            if ( charray[a[ii]] == chars[ii]) {
              okay = false;
              break;
            }
          }
        }

      } else {

        for (ii=0; ii<dmax; ii++) {
          new_perm = new_perm + charray[a[ii]];
        }
        if (maxwidth > 0) {
          if ( output_text.indexOf(new_perm+delimiter) >-1 ) okay = false;    // yes yes, dirty
        }
        if (circular_only) {
          test_perm = new_perm;
          for (ii=0; ii<dmax-1; ii++) {
            test_perm = test_perm.substring(1,dmax) + test_perm.substring(0,1);
            if ( output_text.indexOf(test_perm) >-1 ) okay = false;
          }
        }
        if (derange_only) {
          for (ii=0; ii<dmax; ii++) {
            if ( charray[a[ii]] == chars[ii]) {
              okay = false;
              break;
            }
          }
        }

      }

      if (okay) {
        perms++;
   if (shuffle) {
       insertat = (new_perm.length+delimwidth) * Math.round( ((output_text.length-1)*Math.random())/(new_perm.length+delimwidth) );
       insertat = (output_text).indexOf(delimiter,insertat)+delimwidth;
       if (insertat < delimwidth) insertat = delimwidth;
       output_text = output_text.substring(0,insertat) + new_perm + delimiter + output_text.substring(insertat,output_text.length);
   } else {
       output_text = output_text + new_perm + delimiter;   // even if display_list = false !!!
   }

   if ( display_list && !(maxoutput == "") && (perms >= maxoutput) ) {
       busy = false;
       ellipsis = "..."
       atleast = "at least "
   }
      }
    }
  } while(nextperm() && busy);

  currentDate = new Date();
  seconds = Math.round( ( currentDate.valueOf() - seconds ) / 100 ) / 10;      // round to 1/10 of a second
  window.document.interfaceform.feedback.value = "Jumlah: " + atleast + perms + "   -   Waktu: " + seconds + " detik"
  if (display_list) {
    window.document.interfaceform.permlist.value = output_text.substring(delimiter.length) + ellipsis;
  } else {
    window.document.interfaceform.permlist.value = "";
  }
}

// ========================================================
function removeSpaces(string) {
  var tstring = "";
  var i;
  string = '' + string;
  splitstring = string.split(" ");
  for(i = 0; i < splitstring.length; i++)
  tstring += splitstring[i];
  return tstring;
}

// ========================================================
function Adjacent_equals() {
  var ii;
  for (ii=0; ii<d-1; ii++) {
    if (a[ii] == a[ii+1]) return(true);
  }
  return(false);
}

// ========================================================
function nextperm() {
  var i, j, k, swap, s, si;

  for (k=d-2; k>=0; k--) {
    if (a[k] < a[k+1]) {
      s  = a[k+1];
      si = k+1;
      for (i=k+2; i<d; i++) {
        if ((a[i]>a[k])&&(a[i]<s)) {
          s = a[i];
          si = i;
        }
      }
      swap  = a[si];
      a[si] = a[k];
      a[k]  = swap;
      for (i=k+1; i<d-1; i++) {
        for (j=i+1; j<d; j++) {
          if (a[i]>a[j]) {
            swap = a[i];
            a[i] = a[j];
            a[j] = swap;
          }
        }
      }
      return(true);
    }
  }
  return(false);
}