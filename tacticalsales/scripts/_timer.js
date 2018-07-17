//default values
//var sec   = 0;   // set the seconds
//var min   = 0;   // set the minutes
//var hours = 48;   // set the hours
//var days  = 0;    // set the days
/* html snip to use for this function
 <div class="shipping-expire">
 <table class="countdown">
 <tr class="counter">
 <td class="regular" id="cddays">00</td>
 <td class="break">:</td>
 <td class="regular" id="cdhours">00</td>
 <td class="break">:</td>
 <td class="regular" id="cdminutes">00</td>
 <td class="break">:</td>
 <td class="regular" id="cdseconds">00</td>
 </tr>
 <tr class="names">
 <td class="regular">Days</td>
 <td class="break"></td>
 <td class="regular">Hours</td>
 <td class="break"></td>
 <td class="regular">Minutes</td>
 <td class="break"></td>
 <td class="regular">Seconds</td>
 </tr>
 </table>
 </div>

 * */

var timeStop = Date.UTC('2016',6,11);

var now = new Date();
var timeNow = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

var sec = Math.floor((timeStop - (timeNow))/1000);
var min = Math.floor(sec/60);
var hours = Math.floor(min/60);
var days = Math.floor(hours/24);

hours = hours-(days*24);
min = min-(days*24*60)-(hours*60);
sec = sec-(days*24*60*60)-(hours*60*60)-(min*60);

function countDown() {
  sec--;
  if (sec == -01) {
    sec = 59;
    min--;
    if (min == -01) {
      min = 59;
      hours--;
      if (hours == -01) {
        hours = 24;
        days--;
        if (days < 0) {
          days = 0;
        }
      }
    }
  } else {
   min = min;
  }
if (sec<=9) { sec = "0" + sec; }
  cdminutesvar = (min<=9 ? "0" + min : min);
  cdsecondsvar = sec;
  cdhoursvar   = (hours<=9 ? "0" + hours : hours);
  cddaysvar   = (days<=9 ? "0" + days : days);

  if (document.getElementById) { cdminutes.innerHTML = cdminutesvar; cdseconds.innerHTML = cdsecondsvar; cdhours.innerHTML = cdhoursvar; cddays.innerHTML = cddaysvar;}
  SD=window.setTimeout("countDown();", 1000);
if (min == '00' && sec == '00' && hours == '00' && days == '00') { sec = "00"; window.clearTimeout(SD); }
}

function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

addLoadEvent(function() {
  countDown();
});