
/**
 * @author Rabah Zeineddine
 * @param {String} name the key name
 * @param {Object} value the value needed to be save
 */


const setSession = (name, value) => {
	if (typeof(Storage) !== "undefined") {
		sessionStorage.setItem(name, JSON.stringify(value));
	}
	else {
		setCookie(name, JSON.stringify(value));
	}
}


const setCookie = (cname, cvalue) => {
	var d = new Date();
	d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


const  getSession = (name) => {
	if (typeof(Storage) !== "undefined") {
		// Code for localStorage/sessionStorage.
		return JSON.parse(sessionStorage.getItem(name));
	}
	else {
		// Sorry! No Web Storage support.. use cookie instead..
		return JSON.parse(getCookie(name));
	}
}


const sessionCheck = (name) => {
	
	if (typeof(Storage) !== "undefined") {
		if(sessionStorage.getItem(name)){
			return true;
		}
		return false;
		// return sessionStorage.user != null && sessionStorage.user != '' && sessionStorage.user !== "undefined";
	}
	else {
		//No storage , use cookie..
		return checkCookie(name);
	}
}

const getCookie = (cname) => {
	name = name + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";

}

const checkCookie = (cname) => {
	var username = getCookie(cname);

	if (username != "" && username != null) {
		return true;
	}
	else {
		return false;
	}
}

const deleteSession = (name) => {
	if (typeof(Storage) !== "undefined") {
		sessionStorage.removeItem(name);
	}
	else {
		deleteCookie(name);
	}
}


const deleteCookie = (cname) => {
	document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


const usertInteract = (status) => {
    console.log('User interact method invoked..');
    if (!status) {
		let div = document.createElement('div');
		div.setAttribute('id','interact_overlay');
		$(document.body).append(div);
		$(div).css({
			'position': 'absolute',
			'top':0,
			'right': 0,
			'left': 0,
			'bottom': 0,
			'width': '100%',
			'height': '100%',
			'z-index':'999999999'
		})
    } else {
        $("#interact_overlay").remove();
    }
}




const getMessage = (message) => {
    switch (message) {
        case "USER_NOT_FOUND":
            return "Email not found, check it or sign up.";
            break;
        case "WRONG_PASSWORD":
            return "Wrong password."
            break;
        case "USER_ALREADY_REGISTRED":
            return "User already registered.";
            break;
        case undefined:
            return "An error ocurred, try again.";
            break;
        default:
            return message;
            break;
    }
}
