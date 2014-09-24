function FixUrl(url, parameter, value) {
    var re = new RegExp("[\?\&]" + parameter + "=[^\&]*", "i");
    url = ("" + url).replace(re, "");
    if (value != null) url += '&' + parameter + '=' + encodeURIComponent(value);
    if (url.indexOf('?') == -1) url = url.replace(/&/, "?");
    return url;
}
function ExtractProperty(name, defprop, allowEmpty, url) {
    if (allowEmpty) {
        var re = new RegExp("[\?\&]" + name + "=([^\&]*)", "i");
    } else {
        var re = new RegExp("[\?\&]" + name + "=([^\&]+)", "i");
    }
    var segm = re.exec(url || window.location);
    return segm != null ? decodeURIComponent(segm[1]) : defprop;
}
function CheckUrl(url, defUrl) {
    var getHostName = function (href) {
        var l = document.createElement("a");
        l.href = href;
        if (l.host == "") {
            l.href = l.href;
        }
        return l.hostname;
    }
    if ((url != null && url.indexOf("/") === 0 && url.indexOf("//") != 0) || getHostName(url) === window.location.hostname) {
		return url;
 	} else {
 		return defUrl;
 	}
}
var _try = ExtractProperty("try", null, true);
if (_try != null) _try = CheckUrl(_try, null);
var defUrl = "/qlikview/index.htm";
var back = ExtractProperty("back", defUrl, false);
back = CheckUrl(back, defUrl);
var loginFrame = null;

function RedirectToLoginpage() {
    var agent = navigator.userAgent.toLowerCase(),
        isIPad = agent.indexOf("ipad") !== -1,
        isChrome = agent.indexOf("chrome") != -1 && agent.indexOf("webkit") != -1,
        isSafari = !isChrome && (agent.indexOf("safari") != -1 || agent.indexOf("konqueror") != -1);

    //var url = "http://54.72.252.121:88/QvAJAXZfc/GetLoginpageUrl.aspx";
    formData = {"username" : "CORP%5Ccountnazgul", "password":"Nababatidiskoto1" };
$.ajax({
    url : "http://54.72.252.121:88/QvAJAXZfc/Authenticate.aspx?back=/qlikview/FormLogin.htm",
    cacheControl: 'no-cache',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    type: "POST",
    data : formData,
    success: function(data, textStatus, jqXHR)
    {
        console.log(data);
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
      console.log(textStatus);
      console.log(errorThrown);
    }
});    
    

    // var xmlhttp;
    // if (window.XMLHttpRequest) {
    //     xmlhttp = new XMLHttpRequest();
    // } else {
    //     xmlhttp = new ActiveXObject("MSXML2.XMLHTTP");
    // }
    // xmlhttp.onreadystatechange = function () {
    //     if (xmlhttp.readyState == 4) {
    //         var ok = (200 <= xmlhttp.status && xmlhttp.status < 300) || xmlhttp.status == 1223; // status 204 -> 1223 in IE
    //         if (ok) {
    //             window.location.replace(xmlhttp.responseText);
    //         } else {
    //             window.location.replace("index.htm");
    //         }
    //     }
    // };

    // xmlhttp.open("Get", url, true);
    // try {
    //     xmlhttp.send(null);
    // } catch (e) {
    //     window.location.replace("index.htm");
    // }
}

function TryLogin(url, username, password, callback) {
	username = 'countnazgul';
	password = 'Nababatidiskoto1'; password=
	 formData = {username : "CORP\\countnazgul", password:"Nababatidiskoto1" };
	var ajaxObject = {
		url: "http://54.72.252.121:88/QvAJAXZfc/Authenticate.aspx?back=/qlikview/FormLogin.htm",
		//url: "http://QvAJAXZfc/Authenticate.aspx",
		contentType: 'application/x-www-form-urlencoded',
		type: 'POST',
		cache: false,
		data : formData,
		error: function () {
			//callback(false);
		},
		success: function () {
			callback(true);
		}
    };
	// for basic authentication only
    // if (username != null && password != null) {
    //     username = encodeURIComponent( username );
    //     password = encodeURIComponent( password );
    //     ajaxObject.username = username;
    //     ajaxObject.password = password;
	    //var isIpad = navigator.userAgent.toLowerCase().indexOf("ipad") !== -1;
	    //var isIphone = navigator.userAgent.toLowerCase().indexOf("iphone") !== -1;
    //   if ((isIpad || isIphone) && window.btoa) {
	   //  var aut = 'Basic ' + window.btoa(username + ':' + password);
	   //     if (window.sessionStorage) {
				// window.sessionStorage.setItem("qvAuthorization", aut);
	   //     }
    //       ajaxObject.headers = { 'Authorization': aut };
    //     }
// 	}
	$.ajax( ajaxObject );
}

//function GoBack(url) { document.location = url || back; }
function GoBack(url) {
    if(loginFrame) {
        //loginFrame.parentNode.removeChild(loginFrame);
        loginFrame.style.display = 'none';
        window.parent.qva.Set("AccessPoint.Update", "action", "", true);
    } else {
        document.location = url || back;
    }
}
function Show() {
    if(loginFrame) loginFrame.style.display = '';
}
function Start() {
	            if (window.navigator && window.navigator.cookieEnabled) {
	                TryLogin(null, null, null, function(ok) {
	                    if (ok) {
	                        GoBack(_try);
	                    } else if (_try != null) {
	                        GoBack();
	                    } else {
	                        document.getElementById("header").innerText = "Login Failed";
	                        Show();
	                    }
	                });
	            } else {
	                document.getElementById("header").innerText = "Cookies Disabled";
	                Show();
	            }
	        }
function Retry() {
	            document.getElementById("header").innerText = "Logging in ...";
	            Start();
}
