function get(name) {
	let cookie = " " + document.cookie,
			search = " " + name + "=",
			setStr = null,
			offset = 0,
			end = 0;

	if (cookie.length > 0) {
		offset = cookie.indexOf(search);
		if (offset != -1) {
			offset += search.length;
			end = cookie.indexOf(";", offset)
			if (end == -1) {
				end = cookie.length;
			}
			setStr = unescape(cookie.substring(offset, end));
		}
	}
	return(setStr);
}

function set(name, value, hours, allPlaces = true) {
	let expires = '', path = '';
	if (hours) {
		let date = new Date();
		date.setTime(date.getTime()+(hours*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	if (allPlaces) {
		path = '; path=/'
	}
	document.cookie = name+"="+value+expires+path+"";
}

function remove(name, allPlaces = true) {
	let path = '';
	if (allPlaces) {
		path = '; path=/'
	}
	document.cookie = name + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT" + path;
}

module.exports = {
	get,
	set,
	remove
}