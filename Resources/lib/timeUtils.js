var timeUtils = {};

timeUtils.strtotime = function  (str, now) {
	// Emlulates the PHP strtotime function in JavaScript
	// obtained from http://phpjs.org/functions/strtotime:554
	var i, match, s, strTmp = '', parse = '';
	strTmp = str;
	strTmp = strTmp.replace(/\s{2,}|^\s|\s$/g, ' '); // unecessary spaces
	strTmp = strTmp.replace(/[\t\r\n]/g, ''); // unecessary chars
	if (strTmp == 'now') {
		return (new Date()).getTime()/1000; // Return seconds, not milli-seconds
	} else if (!isNaN(parse = Date.parse(strTmp))) {
		return (parse/1000);
	} else if (now) {
		now = new Date(now*1000); // Accept PHP-style seconds
	} else {
		now = new Date();
	}
	strTmp = strTmp.toLowerCase();
	var __is = {
		day: {
			'sun': 0,
			'mon': 1,
			'tue': 2,
			'wed': 3,
			'thu': 4,
			'fri': 5,
			'sat': 6
		},
		mon: {
			'jan': 0,
			'feb': 1,
			'mar': 2,
			'apr': 3,
			'may': 4,
			'jun': 5,
			'jul': 6,
			'aug': 7,
			'sep': 8,
			'oct': 9,
			'nov': 10,
			'dec': 11
		}
	};
	var process = function (m) {
		var ago = (m[2] && m[2] == 'ago');
		var num = (num = m[0] == 'last' ? -1 : 1) * (ago ? -1 : 1);

		switch (m[0]) {
			case 'last':
			case 'next':
				switch (m[1].substring(0, 3)) {
					case 'yea':
						now.setFullYear(now.getFullYear() + num);
						break;
					case 'mon':
						now.setMonth(now.getMonth() + num);
						break;
					case 'wee':
						now.setDate(now.getDate() + (num * 7));
						break;
					case 'day':
						now.setDate(now.getDate() + num);
						break;
					case 'hou':
						now.setHours(now.getHours() + num);
						break;
					case 'min':
						now.setMinutes(now.getMinutes() + num);
						break;
					case 'sec':
						now.setSeconds(now.getSeconds() + num);
						break;
					default:
						var day;
						if (typeof (day = __is.day[m[1].substring(0, 3)]) != 'undefined') {
							var diff = day - now.getDay();
							if (diff == 0) {
								diff = 7 * num;
							} else if (diff > 0) {
								if (m[0] == 'last') {
									diff -= 7;
								}
							} else {
								if (m[0] == 'next') {
									diff += 7;
								}
							}
							now.setDate(now.getDate() + diff);
						}
				}
				break;
			default:
				if (/\d+/.test(m[0])) {
					num *= parseInt(m[0], 10);
					switch (m[1].substring(0, 3)) {
						case 'yea':
							now.setFullYear(now.getFullYear() + num);
							break;
						case 'mon':
							now.setMonth(now.getMonth() + num);
							break;
						case 'wee':
							now.setDate(now.getDate() + (num * 7));
							break;
						case 'day':
							now.setDate(now.getDate() + num);
							break;
						case 'hou':
							now.setHours(now.getHours() + num);
							break;
						case 'min':
							now.setMinutes(now.getMinutes() + num);
							break;
						case 'sec':
							now.setSeconds(now.getSeconds() + num);
							break;
					}
				} else {
					return false;
				}
				break;
		}
		return true;
	};
	match = strTmp.match(/^(\d{2,4}-\d{2}-\d{2})(?:\s(\d{1,2}:\d{2}(:\d{2})?)?(?:\.(\d+))?)?$/);
	if (match != null) {
		if (!match[2]) {
			match[2] = '00:00:00';
		} else if (!match[3]) {
			match[2] += ':00';
		}
		s = match[1].split(/-/g);
		for (i in __is.mon) {
			if (__is.mon[i] == s[1] - 1) {
				s[1] = i;
			}
		}
		s[0] = parseInt(s[0], 10);
		s[0] = (s[0] >= 0 && s[0] <= 69) ? '20'+(s[0] < 10 ? '0'+s[0] : s[0]+'') : (s[0] >= 70 && s[0] <= 99) ? '19'+s[0] : s[0]+'';
		return parseInt(this.strtotime(s[2] + ' ' + s[1] + ' ' + s[0] + ' ' + match[2])+(match[4] ? match[4]/1000 : ''), 10);
	}

	var regex = '([+-]?\\d+\\s'+
	'(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?'+
	'|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday'+
	'|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday)'+
	'|(last|next)\\s'+
	'(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?'+
	'|sun\\.?|sunday|mon\\.?|monday|tue\\.?|tuesday|wed\\.?|wednesday'+
	'|thu\\.?|thursday|fri\\.?|friday|sat\\.?|saturday))'+
	'(\\sago)?';
	match = strTmp.match(new RegExp(regex, 'gi')); // Brett: seems should be case insensitive per docs, so added 'i'
	if (match == null) {
		return false;
	}
	for (i = 0; i < match.length; i++) {
		if (!process(match[i].split(' '))) {
			return false;
		}
	}
	return (now.getTime()/1000);
}
// creates a 'pretty date' from a unix time stamp
timeUtils.prettyDate = function(time) {
	var monthname = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var date = new Date(time*1000),
	diff = (((new Date()).getTime() - date.getTime()) / 1000),
	day_diff = Math.floor(diff / 86400);

	Titanium.API.debug(time+ "  processing date " + date);

	if ( isNaN(day_diff) || day_diff < 0 ) {
		//return '';
	}
	if(day_diff >= 31 || day_diff < 0 ) {
		var date_year = date.getFullYear();
		var month_name = monthname[date.getMonth()];
		var date_month = date.getMonth() + 1;
		if(date_month < 10) {
			date_month = "0"+date_month;
		}
		var date_monthday = date.getDate();
		if(date_monthday < 10) {
			date_monthday = "0"+date_monthday;
		}
		return date_monthday + " " + month_name + " " + date_year;
	}
	return day_diff == 0 && (
		diff < 60 && "just now" ||
		diff < 120 && "1 minute ago" ||
		diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
		diff < 7200 && "1 hour ago" ||
		diff < 86400 && "about " + Math.floor( diff / 3600 ) + " hours ago") ||
	day_diff == 1 && "Yesterday" ||
	day_diff < 7 && day_diff + " days ago" ||
	day_diff < 31 && Math.ceil( day_diff / 7 ) + " week" + ((Math.ceil( day_diff / 7 )) == 1 ? "" : "s") + " ago";
}
// formats a date accoring to the given format.
// grabbed from   http://blog.stevenlevithan.com/archives/date-time-format . Also lists the usage of how to use it

timeUtils.dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
	timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
	timezoneClip = /[^-+\dA-Z]/g,
	pad = function (val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len)
			val = "0" + val;
		return val;
	};
	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = timeUtils.dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
		d = date[_ + "Date"](),
		D = date[_ + "Day"](),
		m = date[_ + "Month"](),
		y = date[_ + "FullYear"](),
		H = date[_ + "Hours"](),
		M = date[_ + "Minutes"](),
		s = date[_ + "Seconds"](),
		L = date[_ + "Milliseconds"](),
		o = utc ? 0 : date.getTimezoneOffset(),
		flags = {
			d:    d,
			dd:   pad(d),
			ddd:  dF.i18n.dayNames[D],
			dddd: dF.i18n.dayNames[D + 7],
			m:    m + 1,
			mm:   pad(m + 1),
			mmm:  dF.i18n.monthNames[m],
			mmmm: dF.i18n.monthNames[m + 12],
			yy:   String(y).slice(2),
			yyyy: y,
			h:    H % 12 || 12,
			hh:   pad(H % 12 || 12),
			H:    H,
			HH:   pad(H),
			M:    M,
			MM:   pad(M),
			s:    s,
			ss:   pad(s),
			l:    pad(L, 3),
			L:    pad(L > 99 ? Math.round(L / 10) : L),
			t:    H < 12 ? "a"  : "p",
			tt:   H < 12 ? "am" : "pm",
			T:    H < 12 ? "A"  : "P",
			TT:   H < 12 ? "AM" : "PM",
			Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
		};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();
// Some common format strings
timeUtils.dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
timeUtils.dateFormat.i18n = {
	dayNames: [
	"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
	"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
	"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return timeUtils.dateFormat(this, mask, utc);
};