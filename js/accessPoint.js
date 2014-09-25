var thisPage = "home";
var ap = {};
var isMobile = 0;
var appView = "gridView";
var attribFlag = "0";
var anonFlag = "0";
var prefClient = "Ajax";
var openDocSet = "";
var sysUser = "";
var currUser = "";
var pluginEnabled;
var insideQlikView;
var isMobApple = "0";
$.ajaxSetup({
    contentType: "text/plain"
});
var isIE6 = 0;
var isIE8ORWORSE = false;
var isIE10ORBETTER = false;
var IS_IE11_OR_ABOVE = false;
var isIE = false;
var isWIN8 = false;
ap.browserType = function(data) {
    var f = "browser.";
    if (data.indexOf("chrome") != -1 && data.indexOf("webkit") != -1) {
        f += "chrome"
    } else {
        if (data.indexOf("safari") != -1 || data.indexOf("konqueror") != -1) {
            f += "safari"
        } else {
            if (data.indexOf("opera") != -1) {
                f += "opera"
            } else {
                if (data.indexOf("gecko") !== -1 && data.indexOf("like gecko") === -1) {
                    var geckoVersion = parseFloat(navigator.userAgent.substr(navigator.userAgent.search("Firefox") + 8, 3));
                    f += "gecko." + geckoVersion
                } else {
                    if (data.toLowerCase().indexOf("msie") != -1) {
                        isIE = true;
                        f += navigator.userAgent.substr(navigator.userAgent.indexOf("MSIE"), 8);
                        if (data.toLowerCase().indexOf("msie 6") != -1) {
                            isIE6 = 1
                        }
                        var IE_VERSION = parseFloat(data.substr(data.search("msie") + 4, 4));
                        var IE_DOCMODE = typeof document.documentMode == "undefined" ? IE_VERSION : document.documentMode;
                        if (IE_VERSION < 9 && IE_DOCMODE < 9) {
                            isIE8ORWORSE = true;
                            /*@cc_on
                                    if (/^10/.test(@_jscript_version)) {
                                        isIE10ORBETTER = true;
                                    }
                                    @*/
                        }
                    } else {
                        if (data.indexOf("rv:") !== -1 && data.indexOf("like gecko") !== -1) {
                            IS_IE11_OR_ABOVE = true
                        }
                    }
                }
            }
        }
    } if (navigator.userAgent.toLowerCase().indexOf("mobile") != -1 || navigator.userAgent.toLowerCase().indexOf("playbook") != -1) {
        f += ".mobile";
        isMobile = 1
    }
    if (data.toLowerCase().indexOf("windows nt 6.2") != -1) {
        isWIN8 = true
    }
    if (data.toLowerCase().indexOf("windows nt 6.3") != -1) {
        isWIN8 = true
    }
    return f
};
var platform = ap.browserType(navigator.userAgent.toLowerCase());
if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i) || (navigator.userAgent.match(/iPad/i)))) {
    isMobApple = "1"
}
var url = "http://qlikview/QvAJAXZfc/AccessPoint.aspx?mark=&platform=" + platform + "&dpi=96";
ap.getCookieValue = function(b) {
    var c = document.cookie;
    var d = c.indexOf(" " + b + "=");
    if (d == -1) {
        d = c.indexOf(b + "=")
    }
    if (d == -1) {
        c = null
    } else {
        d = c.indexOf("=", d) + 1;
        var a = c.indexOf(";", d);
        if (a == -1) {
            a = c.length
        }
        c = unescape(c.substring(d, a))
    }
    return c
};
ap.checkPlugin = function() {
    pluginEnabled = false;
    var a = ap.getCookieValue("pluginEnabled");
    if (a === null) {
        try {
            if ((!IS_IE11_OR_ABOVE && ActiveXObject) || (IS_IE11_OR_ABOVE && ("ActiveXObject") in window)) {
                ap.OCX = new ActiveXObject("QlikTech.QlikOcxCtrl");
                document.cookie = "pluginEnabled=true; path=/";
                pluginEnabled = true
            }
        } catch (b) {}
    } else {
        if (a === "true") {
            pluginEnabled = true
        }
    }
};
ap.checkIfRunningInQlikView = function() {
    try {
        window.external.AvqInitServer("", function() {});
        insideQlikView = true
    } catch (a) {
        insideQlikView = false
    }
};
ap.truncContent = function(b, c) {
    var a = "";
    a = b.substring(0, c);
    a += "...";
    return a
};
ap.encodeHTML = function(a) {
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;")
};
ap.TryChangePassword = function(b, f, c, d, e) {
    var a = "<ChangePassword><UserName>" + ap.encodeHTML(f) + "</UserName>";
    a += "<OldPassword>" + ap.encodeHTML(c) + "</OldPassword>";
    a += "<NewPassword>" + ap.encodeHTML(d) + "</NewPassword></ChangePassword>";
    b = "/QvAJAXZfc/Authenticate.aspx?changepassword=true";
    $.ajax({
        url: b,
        type: "POST",
        data: a,
        dataType: "text",
        timeout: 2000,
        error: function(g) {
            e(false, g.responseText)
        },
        success: function(g) {
            e(true, g)
        }
    })
};
ap.validatePass = function() {
    $(".errorPass").css("color", "red");
    $(".errorPass").hide();
    if ($("#current").val() == "") {
        $(".errorPass").show();
        $(".errorPass").text("Please enter your current password");
        $("#current").prev().css("color", "red")
    } else {
        if ($("#newPass").val() == "") {
            $(".errorPass").show();
            $(".errorPass").text("Please enter a new password");
            $("#newPass").prev().css("color", "red")
        } else {
            if ($("#newConfirm").val() == "") {
                $(".errorPass").show();
                $(".errorPass").text("Please confirm the new password");
                $("#newConfirm").prev().css("color", "red")
            } else {
                if ($("#newPass").val() != $("#newConfirm").val()) {
                    $(".errorPass").show();
                    $(".errorPass").text("Your new password does not match with the confirmation password");
                    $("#newPass").prev().css("color", "red");
                    $("#newConfirm").prev().css("color", "red")
                } else {
                    var a = sysUser.substring((sysUser.indexOf("\\") + 1), sysUser.length);
                    ap.TryChangePassword(url, a, $("#current").val(), $("#newPass").val(), function(b, c) {
                        if (b && c) {
                            $(".userPassword input").val("");
                            $(".errorPass").show();
                            $(".errorPass").css("color", "#73B31D").text("Your password has been successfully changed")
                        } else {
                            $(".errorPass").text(c);
                            $(".errorPass").show()
                        }
                    })
                }
            }
        }
    }
};
ap.toDateTime = function(g, l) {
    var m = /(\d\d\d\d)-(\d\d)-(\d\d) (\d\d):(\d\d):(\d\d)/;
    var a = m.exec(g);
    if (a) {
        var h = ap.toInt(a[1]);
        var e = ap.toInt(a[2]);
        var b = ap.toInt(a[3]);
        var j = ap.toInt(a[4]);
        var c = ap.toInt(a[5]);
        var k = ap.toInt(a[6]);
        var f = new Date(Date.UTC(h, e - 1, b, j, c, k));
        if (l == "YYYY_MM_DD_HH_mm") {
            return YYYY_MM_DD_HH_mm(f)
        } else {
            return f.toLocaleString()
        }
    } else {
        return g
    }
};
ap.toInt = function(a) {
    if (!a) {
        return null
    }
    while (a.length > 1 && a.charAt(0) === "0") {
        a = a.substr(1)
    }
    return parseInt(a)
};
function PadNumStr(a, b) {
    a = ("" + a);
    while (a.length < b) {
        a = "0" + a
    }
    return a
}
function YYYY_MM_DD_HH_mm(a) {
    return PadNumStr(a.getFullYear(), 4) + "-" + PadNumStr(a.getMonth() + 1, 2) + "-" + PadNumStr(a.getDate(), 2) + " " + PadNumStr(a.getHours(), 2) + ":" + PadNumStr(a.getMinutes(), 2)
}
ap.fillSelectBox = function(a, d, b, e) {
    if (b == "bottomPag") {
        $("<select/>", {
            id: b,
            change: function() {
                $("#Pagesize").val($(this).val());
                ap.filterApps($("#Pagesize"))
            }
        }).appendTo(a)
    } else {
        $("<select/>", {
            id: b,
            change: function() {
                ap.filterApps($(this))
            }
        }).appendTo(a)
    } if ($(d).find("element").length > 1) {
        $.each($(d).find("element"), function(f) {
            $("#" + b).append($("<option></option>").attr("value", ap.encodeHTML($(this).attr("value"))).text($(this).attr("text")));
            if (e == $(this).attr("value")) {
                $("#" + b + " option:last-child").attr("selected", "selected")
            }
        })
    } else {
        if (!(b == "AttributeValue")) {
            var c = "";
            switch (b) {
                case "Category":
                    c = "No Categories Available";
                    break;
                case "Attribute":
                    c = "No Attributes Available";
                    break;
                default:
                    c = "None Available";
                    break
            }
            $("#" + b).append($("<option></option>").text(c));
            $("#" + b).attr("disabled", "disabled")
        }
    }
};
ap.writeClientList = function(e, a, c) {
    var f = "";
    var d = a;
    var b = e.split(";");
    if (b.length > 0) {
        f = '<ul class="clientList">';
        if (insideQlikView) {
            f += '<li><a id="PLUGIN' + c + '" class="plugin" href="' + d + 'Plugin" target="' + openDocSet + '">QlikView</a></li>'
        } else {
            $.each(b, function() {
                switch (this.toString()) {
                    case "Ajax":
                        "";
                        f += '<li><a id="AJAX' + c + '" class="ajax" href="' + d + 'Ajax" target="' + openDocSet + '">Full Browser Version</a></li>';
                        break;
                    case "AjaxOnSmallDevices":
                        if (!isIE8ORWORSE) {
                            f += '<li><a id="AJAXSMALL' + c + '" class="mobile" href="' + d + 'AjaxOnSmallDevices" target="' + openDocSet + '">Small Device Version</a></li>'
                        }
                        break;
                    case "Download":
                        f += '<li><a id="DOWNLOAD' + c + '" class="download" href="' + d + 'Download" target="' + openDocSet + '">Download (.QVW)</a></li>';
                        break;
                    case "Plugin":
                        if (pluginEnabled) {
                            f += '<li><a id="PLUGIN' + c + '" class="plugin" href="' + d + 'Plugin" target="' + openDocSet + '">Internet Explorer Plugin</a></li>'
                        }
                        break
                }
            })
        }
        f += "</ul>"
    }
    return f
};
ap.changePrefClient = function(b) {
    var a = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.PreferedClient" value="' + b + '" /></update>';
    $.post(url, a, function(c) {
        prefClient = b;
        $.each($("a.name"), function() {
            var e = $(this).attr("href");
            var d = e.indexOf("client=");
            e = e.substring(0, d + 7);
            if ($(this).parent().parent().find(".favorite").text().indexOf(prefClient) > -1 && (prefClient != "Plugin" || pluginEnabled)) {
                $(this).attr("href", e + prefClient)
            } else {
                $(this).attr("href", "#")
            }
        })
    })
};
ap.writeList = function(d) {
    var e = $(d).find("value[name='Documents']");
    var a = $(d).find("value[name='ErrorMessage']").attr("text");
    var c = $(d).find("value[name='AskForClient'][mode='enabled']");
    if (a) {
        $(".errorContent").html("<strong>Message: " + ap.encodeHTML(a) + "</strong>");
        $(".errorBox").show()
    }
    $(".msgBox")[c.length > 0 ? "show" : "hide"]();
    if (c) {
        var b = c.attr("cansave") === "true";
        $(".savePreferredClientBtn")[b ? "show" : "hide"]()
    }
    if ($(e).find("element").length > 0) {
        $("<ul/>", {
            id: "appList"
        }).appendTo($("#content"));
        $.each($(e).find("element"), function(o) {
            var q = "";
            var m = "/QvAJAXZfc/AccessPoint.aspx?open=&id=" + encodeURIComponent($(this).attr("value")) + "&client=";
            var l = "";
            if (insideQlikView) {
                l = m + "Plugin"
            } else {
                if ($(this).attr("clients").indexOf(prefClient) > -1) {
                    if (prefClient == "Plugin") {
                        if (pluginEnabled) {
                            l = m + prefClient
                        } else {
                            if ($(this).attr("clients").indexOf("Ajax") > -1) {
                                l = m + "Ajax"
                            } else {
                                l = "#"
                            }
                        }
                    } else {
                        l = m + prefClient
                    }
                } else {
                    l = "#"
                }
            }
            var j = "";
            if (($(this).attr("imgHash") != "") && ($(this).attr("imgHash") != null)) {
                q = "http://qlikview/QvAJAXZfc/AccessPoint.aspx?datamode=binary&name=" + encodeURIComponent($(this).attr("value")) + "&stamp=" + $(this).attr("imgHash") + "&kind=AccessPoint";
                j = '"width="155"'
            } else {
                q = "images/missing.jpg";
                j = 'class="missing" width="192"'
            }
            var n = $(this);
            var p = "";
            if (l == "#") {
                p = '<span class="attr1"><span class="thumbnail_grid"><a class="thumbwithflyout"><img src="' + q + '" ' + j + ' width="155"/></a></span><a id="app' + o + '" class="more listOnly">Expand or Collapse</a>'
            } else {
                p = '<span class="attr1"><span class="thumbnail_grid"><a href="' + l + '" target="' + openDocSet + '" class="name"><img src="' + q + '" ' + j + ' width="155"/></a></span><a id="app' + o + '" class="more listOnly">Expand or Collapse</a>'
            }
            var h = ap.encodeHTML($(this).attr("value")) + "";
            p += "<span class='gridInfo'>";
            if ($(this).attr("favorite") == "true") {
                p += '<a class="favorite favOn">Remove App From Favorites - <strong>' + h + "</strong>" + $(this).attr("clients") + "</a>"
            } else {
                p += '<a class="favorite favOff">Add App To Favorites - <strong>' + h + "</strong>" + $(this).attr("clients") + "</a>"
            } if (l == "#") {
                p += '<a class="namewithflyout">' + ap.encodeHTML($(this).attr("text")) + "</a>"
            } else {
                p += '<a href="' + l + '" class="name" target="' + openDocSet + '">' + ap.encodeHTML($(this).attr("text")) + "</a>"
            } if ($(this).attr("lastUpdate") != "") {
                p += '<span class="gridOnly appDates"><strong>Last Update: </strong>' + ap.toDateTime($(this).attr("lastUpdate"), "YYYY_MM_DD_HH_mm") + "</span>"
            }
            if ($(this).attr("nextUpdate") != "") {
                p += '<span class="gridOnly appDates"><strong>Next Update: </strong>' + ap.toDateTime($(this).attr("nextUpdate"), "YYYY_MM_DD_HH_mm") + "</span>"
            }
            p += '<a class="viewButtonClosed">view details</a></span></span><span class="attr2 listOnly">';
            p += ap.encodeHTML($(this).attr("category")) + "</span>";
            if (attribFlag != "0") {
                p += '<span class="attr3 listOnly">';
                $.each($(this).find("attribute[key='" + ap.encodeHTML(attribFlag.replace(/\'/g, "''")) + "']"), function() {
                    var r = $(this).attr("value").replace(/\'/g, "''").replace(/\"/g, '""');
                    if (r.length > 25) {
                        r = ap.truncContent(r, 25)
                    }
                    p += ap.encodeHTML(r) + ", "
                });
                p = p.slice(0, -2);
                p += "</span>"
            } else {
                p += '<span class="attr3 listOnly"></span>'
            }
            p += '<span class="attr4 listOnly">';
            p += ap.toDateTime($(this).attr("lastUpdate"), "YYYY_MM_DD_HH_mm") + '</span><div class="cleaner listOnly">&nbsp;</div>';
            p += '<div id="app' + o + 'More" class="moreInfo"><span class="contentArea"><span class="description">';
            if ($(this).attr("description")) {
                var g = ap.encodeHTML($(this).attr("description"));
                if (g.length > 440) {
                    g = ap.truncContent(g, 440)
                }
                p += "<p>" + g + "</p>"
            }
            h = $(this).attr("value") + "";
            h = h.replace("|", "\\");
            p += '<span class="specs"><strong>File Size: </strong>' + $(this).attr("filesize") + "</span>";
            if ($(this).attr("nextUpdate") != "") {
                p += '<span class="lastUpdateDetail listOnly specs"><strong>Next Update: </strong>' + ap.toDateTime($(this).attr("nextUpdate"), "YYYY_MM_DD_HH_mm") + "</span>"
            }
            p += '<span class="clients">Available Clients:';
            p += ap.writeClientList($(this).attr("clients"), m, o);
            p += "</span>";
            p += '</span><span class="thumbnail"><a href="' + l + '" target="' + openDocSet + '" class="name"><img src="' + q + '" ' + j + '/></a></span><span class="details">';
            var k = "";
            var f = $(this).find("attribute").length;
            if ($(this).find("attribute").length > 0) {
                $.each($(this).find("attribute"), function(s) {
                    var u = ap.encodeHTML($(this).attr("key"));
                    var r = ap.encodeHTML($(this).attr("value"));
                    var t = "";
                    if ((s + 1) > 5) {
                        t = "moreAttribs"
                    }
                    if ((s + 1) != f) {
                        k += '<span class="attribute ' + t + '">' + u + '</span><span class="' + t + '">' + r + "</span>"
                    } else {
                        k += '<span class="attribute last ' + t + '">' + u + '</span><span class="last ' + t + '">' + r + "</span>"
                    }
                });
                if ($(this).find("attribute").length > 5) {
                    k += '<a class="showMore">Show More Attributes</a>'
                }
            }
            k += '<a id="docState' + o + '" class="removeDocState">Remove last document state</a>';
            p += k + "</span>";
            $("#appList").append($("<li/>").attr("id", "appList" + o).html(p));
            if ($(this).attr("nextUpdate") != "") {
                k += '<span class="lastUpdateDetail listOnly">Next Update: ' + ap.toDateTime($(this).attr("nextUpdate"), "YYYY_MM_DD_HH_mm") + "</span>"
            }
            $("#appList" + o + " .removeDocState").click(function() {
                var r = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.ClearState" action="' + n.attr("value") + '" /></update>';
                $.post(url, r, function(s) {
                    appView = "listView"
                });
                $(this).text("Document state removed");
                $(this).unbind("click")
            });
            $("#appList" + o + " .viewButtonClosed").click(function(u) {
                var s = "";
                var r = "";
                $("#flyout h3").text(n.attr("text"));
                if (n.attr("description")) {
                    var t = n.attr("description");
                    if (t.length > 440) {
                        t = ap.truncContent(t, 440)
                    }
                    $("#flyout p").text(t)
                } else {
                    $("#flyout p").empty()
                }
                $("#flyout .lastUpdateDetail").remove();
                if (n.attr("lastUpdate") != "") {
                    $("#flyout .fileSize").before('<span class="lastUpdateDetail gridOnly"><strong>Last Update: </strong>' + ap.toDateTime(n.attr("lastUpdate"), "YYYY_MM_DD_HH_mm") + "</span>")
                }
                if (n.attr("nextUpdate") != "") {
                    $("#flyout .fileSize").before('<span class="lastUpdateDetail"><strong>Next Update: </strong>' + ap.toDateTime(n.attr("nextUpdate"), "YYYY_MM_DD_HH_mm") + "</span>")
                }
                $("#flyout .fileSize").html("<strong>File Size:</strong> " + n.attr("filesize"));
                $("#flyout .viewingOptions").html(ap.writeClientList(n.attr("clients"), m, o));
                if (k.length > 0) {
                    $("#flyout .details").html(k).show()
                } else {
                    $("#flyout .details").hide()
                }
                $(".moreAttribs").hide();
                $("#flyout .showMore").click(function() {
                    $(this).siblings(".moreAttribs").show();
                    $(this).hide();
                    $("#flyout_mid .details .more").hide()
                });
                $("#flyout_mid .details .more").click(function() {
                    $(this).siblings(".moreAttribs").show();
                    $(this).hide();
                    $("#flyout .showMore").hide()
                });
                r = -170;
                if ($(this).position().left > ($("#content").width() / 2)) {
                    s = -370;
                    $("#flyout_arrow_left").css("visibility", "hidden");
                    $("#flyout_arrow_right").css("visibility", "visible")
                } else {
                    s = 192;
                    $("#flyout_arrow_right").css("visibility", "hidden");
                    $("#flyout_arrow_left").css("visibility", "visible")
                }
                $("#flyout").css("left", ($(this).position().left + s));
                $("#flyout").css("top", ($(this).position().top + r));
                $("#flyout .removeDocState").click(function() {
                    var v = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.ClearState" action="' + n.attr("value") + '" /></update>';
                    $.post(url, v, function(w) {
                        appView = "listView"
                    });
                    $(this).text("Document state removed");
                    $(this).unbind("click")
                });
                $("#flyout").show()
            });
            $("#appList" + o + " .thumbwithflyout").click(function(r) {
                if (appView == "gridView") {
                    $(this).parent().parent().find(".viewButtonClosed").trigger("click")
                }
            });
            $("#appList" + o + " .namewithflyout").click(function(t) {
                if (appView == "gridView") {
                    $(this).parent().find(".viewButtonClosed").trigger("click")
                } else {
                    var s = $(this).parent().parent().find(".more");
                    var r = s.attr("id");
                    if (!s.hasClass("open")) {
                        if (isMobile > 0) {
                            $("#" + r + "More").show()
                        } else {
                            $("#" + r + "More").animate({
                                opacity: "toggle",
                                height: "toggle"
                            })
                        }
                        s.addClass("open");
                        $("#" + r + "More").addClass("listOnly")
                    }
                }
            });
            if ((o + 1) % 2 == 0) {
                $("#appList" + o).addClass("alt")
            }
        });
        $(".moreAttribs").hide();
        $(".showMore").click(function() {
            $(this).siblings(".moreAttribs").show();
            $(this).hide();
            $(this).prev().hide()
        })
    }
    $("li .favorite").click(function() {
        if (anonFlag != "1") {
            var f = "";
            if ($(this).hasClass("favOff")) {
                f = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Favorites.Add" action="' + $(this).find("strong").html() + '" /></update>';
                $(this).removeClass("favOff");
                $(this).addClass("favOn")
            } else {
                f = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Favorites.Remove" action="' + $(this).find("strong").html() + '" /></update>';
                $(this).removeClass("favOn");
                $(this).addClass("favOff")
            }
            $.post(url, f, function(g) {
                $(".filter_category").empty();
                $(".filter_category").append("Category:<br />");
                ap.fillSelectBox($(".filter_category"), $(g).find("value[name='Category']"), "Category", $(g).find("value[name='Category']").attr("value"));
                if ($("#Category").val() == "Favorites") {
                    $("#appList").empty().remove();
                    ap.writeList(g)
                }
            })
        }
    });
    $("li .more").click(function() {
        var f = $(this).attr("id");
        if ($(this).hasClass("open")) {
            if (isMobile > 0) {
                $("#" + f + "More").hide()
            } else {
                $("#" + f + "More").animate({
                    opacity: "toggle",
                    height: "toggle"
                })
            }
            $(this).removeClass("open");
            $("#" + f + "More").removeClass("listOnly")
        } else {
            if (isMobile > 0) {
                $("#" + f + "More").show()
            } else {
                $("#" + f + "More").animate({
                    opacity: "toggle",
                    height: "toggle"
                })
            }
            $(this).addClass("open");
            $("#" + f + "More").addClass("listOnly")
        }
    })
};
ap.filterApps = function(b) {
    ap.clearAndLoading();
    var a = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="AccessPoint.Pages.Current" value="0" /><set name="AccessPoint.' + $(b).attr("id") + '" value="' + $(b).val() + '" /><set name="Document" add="mode;ie6false" /></update>';
    $("#loading").show();
    $("#whiteOverlay").show();
    $.post(url, a, function(c) {
        ap.setHeaders(c);
        ap.writeList(c);
        ap.writePagination($(c).find("value[name='Pages']"), $(c).find("value[name='FilteredDocCount']").attr("text"), "filter");
        ap.fillSelectBox($(".topPag .paginContainer"), $(c).find("value[name='Pagesize']"), "Pagesize", $(c).find("value[name='Pagesize']").attr("value"));
        ap.fillSelectBox($(".bottomPag .paginContainer"), $(c).find("value[name='Pagesize']"), "bottomPag", $(c).find("value[name='Pagesize']").attr("value"))
    })
};
ap.changePages = function(a) {
    ap.clearAndLoading("apps");
    var b = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="AccessPoint.Pages.Current" value="' + a + '" /><set name="Document" add="mode;ie6false" /></update>';
    $.post(url, b, function(c) {
        ap.writeList(c);
        ap.writePagination($(c).find("value[name='Pages']"), $(c).find("value[name='FilteredDocCount']").attr("text"), "page");
        ap.fillSelectBox($(".topPag .paginContainer"), $(c).find("value[name='Pagesize']"), "Pagesize", $(c).find("value[name='Pagesize']").attr("value"));
        ap.fillSelectBox($(".bottomPag .paginContainer"), $(c).find("value[name='Pagesize']"), "bottomPag", $(c).find("value[name='Pagesize']").attr("value"))
    })
};
ap.writePagination = function(a, f, c) {
    if ($(a).attr("text") != "All") {
        $(".paginContainer").append($("<span/>").addClass("showing").html($(a).attr("text")));
        $(".paginContainer").append($("<span/>").addClass("pages"));
        var e = parseInt($(a).attr("max")) + 1;
        var b = parseInt($(a).attr("current")) + 1;
        var g = Math.max(0, Math.min(b - 6, e - 11));
        var d = Math.min(Math.max(b, 6) + 5, e);
        if (b > 1) {
            $("<a/>", {
                id: "prev",
                html: "&#171; Prev",
                click: function() {
                    $("#loading").show();
                    $("#whiteOverlay").show();
                    ap.changePages(parseInt(b) - 2)
                }
            }).appendTo($(".pages"))
        }
        for (i = g; i < d; i++) {
            if ((i + 1) != b) {
                $("<a/>", {
                    id: "page" + (i + 1),
                    text: (i + 1),
                    click: function() {
                        $("#loading").show();
                        $("#whiteOverlay").show();
                        ap.changePages(parseInt($(this).text()) - 1)
                    }
                }).appendTo($(".pages"))
            } else {
                $("<strong/>", {
                    id: "page" + (i + 1),
                    text: (i + 1)
                }).appendTo($(".pages"))
            }
        }
        if (b < e) {
            $("<a/>", {
                id: "next",
                html: "Next &#187;",
                click: function() {
                    $("#loading").show();
                    $("#whiteOverlay").show();
                    ap.changePages(parseInt(b))
                }
            }).appendTo($(".pages"))
        }
    }
    if (c != "async") {
        $("#loading").hide();
        $("#whiteOverlay").hide()
    }
};
ap.clearAndLoading = function(a) {
    if (a != "apps") {
        $(".lastUpdated").empty();
        $(".filter_category").empty();
        $(".filter_attribute").empty();
        $(".filter_attribute_value").empty();
        $("#columnHeaders span").unbind("click");
        $("#nav_utility").empty()
    }
    $("#appList").empty().remove();
    $(".paginContainer").empty()
};
ap.setHeaders = function(d) {
    var e = $(d).find("value[name='" + (isWIN8 ? "DownloadPluginUrlWin8" : "DownloadPluginUrl") + "']");
    if ((e.attr("mode") != "hidden") && (isMobApple != "1")) {
        $("#nav_utility").append('<a href="' + encodeURI(e.attr("value")) + '" class="header_plugin">Download Internet Explorer Plugin</a> ')
    }
    if ($(d).find("value[name='User']").attr("mode") != "hidden") {
        $("#nav_utility").append('Welcome <span class="welcomeName">' + ap.encodeHTML($(d).find("value[name='User']").attr("text")) + "</span> ");
        if ($(d).find("value[name='User']").attr("text") != "Anonymous") {
            $("#nav_utility").append('| <a class="userFavorites">Favorites &amp; Profile</a> ');
            $("body").click(function(f) {
                if (!$(f.target).is("#userBox *") && !$(f.target).is(".userFavorites")) {
                    $("#userBox").hide();
                    if (isIE6 != 0) {
                        $("#ie6fix").remove()
                    }
                    $("#darkOverlay").hide()
                }
            });
            $(".userFavorites").click(function() {
                ap.initUserBox(currUser, $(d).find("value[name='PreferedClient']"), sysUser)
            })
        }
    }
    if ($(d).find("value[name='Login']").attr("mode") != "hidden") {
        $("#nav_utility").append(' | <a class="signInLink">Sign In</a>');
        var c = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="Document" add="mode;ie6false" /></update>';
        $(".signInLink").click(function() {
            ap.clearAndLoading();
            TryLogin(null, null, null, function(f) {
                if (f) {
                    $("#loading").show();
                    $("#whiteOverlay").show();
                    ap.init(c)
                } else {
                    if (_try != null) {
                        GoBack()
                    } else {
                        RedirectToLoginpage()
                    }
                }
            })
        })
    }
    if ($(d).find("value[name='Logout']").attr("mode") != "hidden") {
        $("#nav_utility").append(' | <a class="signOutLink">Sign Out</a>');
        $(".signOutLink").click(function() {
            ap.OCX = "";
            var g = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Logout" action="" clientsizeWH="1280:939" /></update>';
            var f = {
                lo_cmd: g,
                url: url
            };
            ap.tearDown(f)
        })
    }
    if ($(d).find("value[name='LastUpdate']").attr("text") != "") {
        $(".lastUpdated").text("Last updated " + ap.toDateTime($(d).find("value[name='LastUpdate']").attr("text")))
    }
    $(".filter_category").append("Category:<br />");
    ap.fillSelectBox($(".filter_category"), $(d).find("value[name='Category']"), "Category", $(d).find("value[name='Category']").attr("value"));
    if ($(d).find("value[name='Attribute']").attr("value") != "") {
        attribFlag = $(d).find("value[name='Attribute']").attr("value");
        var a = attribFlag;
        if (a.length > 25) {
            a = ap.truncContent(a, 25)
        }
        $("#columnHeaders .attr3 strong").text(a)
    } else {
        $("#columnHeaders .attr3 strong").empty();
        attribFlag = "0"
    }
    $(".filter_attribute").append("Attribute:<br />");
    ap.fillSelectBox($(".filter_attribute"), $(d).find("value[name='Attribute']"), "Attribute", $(d).find("value[name='Attribute']").attr("value"));
    if ($(d).find("value[name='AttributeValue']").find("element").length > 1) {
        $(".filter_attribute_value").append("Attribute Value:<br />");
        ap.fillSelectBox($(".filter_attribute"), $(d).find("value[name='AttributeValue']"), "AttributeValue", $(d).find("value[name='AttributeValue']").attr("value"))
    }
    $(".view_list").click(function() {
        if (!($(this).hasClass("list_on"))) {
            var f = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.View" value="Details" /></update>';
            $.post(url, f, function(g) {
                appView = "listView"
            });
            $(this).addClass("list_on");
            $(".view_grid").removeClass("grid_on");
            $("#content").removeClass("gridView");
            $("#content").addClass("listView")
        }
    });
    $(".view_grid").click(function() {
        if (!($(this).hasClass("grid_on"))) {
            var f = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.View" value="Thumbnails" /></update>';
            $.post(url, f, function(g) {
                appView = "gridView"
            });
            $(this).addClass("grid_on");
            $(".view_list").removeClass("list_on");
            $("#content").removeClass("listView");
            $("#content").addClass("gridView")
        }
    });
    $("search").val("Search Here");
    var b = "";
    if ($(d).find("value[name='SortBy']").attr("value")) {
        b = $(d).find("value[name='SortBy']").attr("value")
    } else {
        b = "Title asc"
    } if ((attribFlag == "0") && (b.indexOf("Title") < 0) && (b.indexOf("Category") < 0) && (b.indexOf("LastReload") < 0)) {
        b = "Title asc"
    } else {
        if ((attribFlag != "0") && (b.indexOf("Title") < 0) && (b.indexOf("Category") < 0) && (b.indexOf("LastReload") < 0)) {
            b = attribFlag + " asc"
        }
    }
    ap.sortSetup($(".attr1"), attribFlag, b, "Title");
    ap.sortSetup($(".attr2"), attribFlag, b, "Category");
    if (attribFlag != "0") {
        ap.sortSetup($(".attr3"), attribFlag, b, attribFlag)
    }
    ap.sortSetup($(".attr4"), attribFlag, b, "LastReload");
    $(".input_search").unbind();
    $(".input_search").focus(function() {
        $("#flyout").hide();
        if ($(this).val() == "Search Here") {
            $(this).val("")
        }
    });
    $(".input_search").keyup(function(h) {
        if (h.keyCode == 13) {
            if ($(this).val() != "Search Here") {
                $("#loading").show();
                $("#whiteOverlay").show();
                var j = $(this);
                var g = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.SearchFilter" text="' + ap.encodeHTML(j.val()) + '" /></update>';
                var f = $.post(url, g, function(l) {
                    var k = "";
                    if ($(l).find("value[name='FilteredDocCount']").attr("text") != "1") {
                        k = $(l).find("value[name='FilteredDocCount']").attr("text") + " results"
                    } else {
                        k = "1 result"
                    }
                    ap.clearAndLoading();
                    ap.setHeaders(l);
                    ap.writeList(l);
                    ap.writePagination($(l).find("value[name='Pages']"), $(l).find("value[name='FilteredDocCount']").attr("text"), "search");
                    ap.fillSelectBox($(".topPag .paginContainer"), $(l).find("value[name='Pagesize']"), "Pagesize", $(l).find("value[name='Pagesize']").attr("value"));
                    ap.fillSelectBox($(".bottomPag .paginContainer"), $(l).find("value[name='Pagesize']"), "bottomPag", $(l).find("value[name='Pagesize']").attr("value"));
                    if (j.val() != "") {
                        $("#searchArea strong").html(k + ' for <em>"' + ap.encodeHTML($(l).find("value[name='SearchFilter']").attr("text")) + '"</em>');
                        $("#searchArea").show();
                        $("#content").addClass("search");
                        $("#filters select").attr("disabled", true)
                    } else {
                        $("#searchArea").hide();
                        $("#content").removeClass("search");
                        $("#filters select").attr("disabled", false)
                    }
                })
            }
        }
    });
    $(".clearResults").unbind();
    $(".clearResults").click(function() {
        var h = $(".input_search");
        $("#loading").show();
        $("#whiteOverlay").show();
        var g = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.SearchFilter" text="" /></update>';
        var f = $.post(url, g, function(j) {
            ap.clearAndLoading();
            ap.setHeaders(j);
            ap.writeList(j);
            ap.writePagination($(j).find("value[name='Pages']"), $(j).find("value[name='FilteredDocCount']").attr("text"), "search");
            ap.fillSelectBox($(".topPag .paginContainer"), $(j).find("value[name='Pagesize']"), "Pagesize", $(j).find("value[name='Pagesize']").attr("value"));
            ap.fillSelectBox($(".bottomPag .paginContainer"), $(j).find("value[name='Pagesize']"), "bottomPag", $(j).find("value[name='Pagesize']").attr("value"));
            $("#searchArea").hide();
            $("#content").removeClass("search");
            h.val("Search Here")
        })
    });
    $(".btn_go").unbind();
    $(".btn_go").click(function() {
        if ($(".input_search").val() != "Search Here") {
            $("#loading").show();
            $("#whiteOverlay").show();
            var h = $(".input_search");
            var g = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.SearchFilter" text="' + ap.encodeHTML(h.val()) + '" /></update>';
            var f = $.post(url, g, function(k) {
                var j = "";
                if ($(k).find("value[name='FilteredDocCount']").attr("text") != "1") {
                    j = $(k).find("value[name='FilteredDocCount']").attr("text") + " results"
                } else {
                    j = "1 result"
                }
                ap.clearAndLoading();
                ap.setHeaders(k);
                ap.writeList(k);
                ap.writePagination($(k).find("value[name='Pages']"), $(k).find("value[name='FilteredDocCount']").attr("text"), "search");
                ap.fillSelectBox($(".topPag .paginContainer"), $(k).find("value[name='Pagesize']"), "Pagesize", $(k).find("value[name='Pagesize']").attr("value"));
                ap.fillSelectBox($(".bottomPag .paginContainer"), $(k).find("value[name='Pagesize']"), "bottomPag", $(k).find("value[name='Pagesize']").attr("value"));
                if (h.val() != "") {
                    $("#searchArea strong").html(j + ' for <em>"' + ap.encodeHTML($(k).find("value[name='SearchFilter']").attr("text")) + '"</em>');
                    $("#searchArea").show();
                    $("#content").addClass("search");
                    $("#filters select").attr("disabled", true)
                } else {
                    $("#searchArea").hide();
                    $("#content").removeClass("search");
                    $("#filters select").attr("disabled", false)
                }
            })
        }
    });
    $(".input_search").blur(function() {
        if ($(this).val() == "") {
            $(this).val("Search Here")
        }
    })
};
ap.sortSetup = function(c, a, f, b) {
    var e = "";
    var d = "";
    if (f.indexOf(b) > -1) {
        $("#columnHeaders span").removeClass("on");
        $(c).unbind();
        $("#columnHeaders span .sortImg").remove();
        c.addClass("on");
        if (f.indexOf("asc") > -1) {
            $("<a/>", {
                html: "click to sort descending"
            }).addClass("sortImg").addClass("asc").prependTo($(c))
        } else {
            $("<a/>", {
                html: "click to sort ascending"
            }).addClass("sortImg").addClass("desc").prependTo($(c))
        }
    }
    $(c).hover(function() {
        if (!($(this).hasClass("on"))) {
            $(this).addClass("on");
            $("<a/>", {
                html: "click to sort ascending"
            }).addClass("sortImg").addClass("asc").prependTo($(this))
        } else {
            $(this).addClass("chosen");
            if ($(this).find(".sortImg").hasClass("asc")) {
                $(this).find(".sortImg").removeClass("asc").addClass("desc")
            } else {
                $(this).find(".sortImg").removeClass("desc").addClass("asc")
            }
        }
    }, function() {
        if ($(this).hasClass("chosen")) {
            $(this).removeClass("chosen");
            if ($(this).find(".sortImg").hasClass("asc")) {
                $(this).find(".sortImg").removeClass("asc").addClass("desc")
            } else {
                $(this).find(".sortImg").removeClass("desc").addClass("asc")
            }
        } else {
            $(this).removeClass("on");
            $(this).find(".sortImg").remove()
        }
    });
    $(c).click(function() {
        if (f.indexOf(b) > -1) {
            if (f.indexOf("asc") > -1) {
                d = b + " desc"
            } else {
                d = b + " asc"
            }
        } else {
            d = b + " asc"
        }
        $("#loading").show();
        $("#whiteOverlay").show();
        e = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="Document" add="mode;ie6false" /><set name="AccessPoint.SortBy" value="' + ap.encodeHTML(d) + '" /></update>';
        ap.clearAndLoading();
        $.post(url, e, function(g) {
            ap.setHeaders(g);
            ap.writeList(g);
            ap.writePagination($(g).find("value[name='Pages']"), $(g).find("value[name='FilteredDocCount']").attr("text"), "page");
            ap.fillSelectBox($(".topPag .paginContainer"), $(g).find("value[name='Pagesize']"), "Pagesize", $(g).find("value[name='Pagesize']").attr("value"));
            ap.fillSelectBox($(".bottomPag .paginContainer"), $(g).find("value[name='Pagesize']"), "bottomPag", $(g).find("value[name='Pagesize']").attr("value"))
        })
    })
};
ap.initUserBox = function(c, d, a) {
    $("#userFavs").empty();
    var b = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.GetFavorites" action="" /></update>';
    $.post(url, b, function(f) {
        if ($(f).find("element").length > 0) {
            $("#userFavs").append('<span class="favList_name"><strong>Name</strong></span><span class="favList_category"><strong>Category</strong></span><span class="favList_date"><strong>Last Update</strong></span>');
            $("#userFavs").append("<ul>");
            var g = "";
            $.each($(f).find("element"), function(j) {
                var h = "/QvAJAXZfc/AccessPoint.aspx?open=&id=" + encodeURIComponent($(this).attr("value")) + "&client=";
                if (j % 2 == 0) {
                    g += "<li>"
                } else {
                    g += '<li class="alt">'
                }
                var k = "";
                if ($(this).attr("clients").indexOf(prefClient) > -1) {
                    if (prefClient == "Plugin") {
                        if (pluginEnabled) {
                            k = h + prefClient
                        } else {
                            k = h + "Ajax"
                        }
                    } else {
                        k = h + prefClient
                    }
                } else {
                    k = h + "Ajax"
                }
                g += '<span class="favList_name"><a class="favorite favOn">Remove App From Favorites - <strong>' + ap.encodeHTML($(this).attr("value")) + "</strong>" + $(this).attr("clients") + '</a><a href="' + k + '" target="' + openDocSet + '" class="name">' + ap.encodeHTML($(this).attr("text")) + "</a></span>";
                g += '<span class="favList_category">' + ap.encodeHTML($(this).attr("category")) + "</span>";
                g += '<span class="favList_date">' + $(this).attr("lastUpdate") + "</span>";
                g += "</li>"
            });
            $("#userFavs").append(g);
            $("#userFavs").append("</ul>");
            $("#userFavs .favorite").click(function() {
                var h = $(this);
                var j = "";
                if ($(this).hasClass("favOff")) {
                    j = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Favorites.Add" action="' + $(this).find("strong").html() + '" /></update>';
                    $(this).removeClass("favOff");
                    $(this).addClass("favOn")
                } else {
                    j = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Favorites.Remove" action="' + $(this).find("strong").html() + '" /></update>';
                    $(this).removeClass("favOn");
                    $(this).addClass("favOff")
                }
                $.post(url, j, function(k) {
                    $(".filter_category").empty();
                    $(".filter_category").append("Category:<br />");
                    ap.fillSelectBox($(".filter_category"), $(k).find("value[name='Category']"), "Category", $(k).find("value[name='Category']").attr("value"));
                    if ($("#Category").val() == "Favorites") {
                        $("#appList").empty().remove();
                        ap.writeList(k)
                    } else {
                        if ($(h).hasClass("favOn")) {
                            $("#appList .favorite strong:contains('" + $(h).find("strong").text() + "')").parent().removeClass("favOff");
                            $("#appList .favorite strong:contains('" + $(h).find("strong").text() + "')").parent().addClass("favOn")
                        } else {
                            $("#appList .favorite strong:contains('" + $(h).find("strong").text() + "')").parent().removeClass("favOn");
                            $("#appList .favorite strong:contains('" + $(h).find("strong").text() + "')").parent().addClass("favOff")
                        }
                    }
                })
            })
        } else {
            $("#userFavs").html("No favorites have been selected yet")
        }
    });
    $(".userDetails .name").text(c);
    $(".userDetails .systemName").text(a);
    var e = "";
    e += '<select id="prefChoice">';
    $.each(d.find("element"), function() {
        e += '<option value="' + $(this).attr("value") + '"';
        if (prefClient == $(this).attr("value")) {
            e += " selected "
        }
        e += ">" + $(this).attr("text") + "</option>"
    });
    e += "</select>";
    $(".prefClient").html(e);
    $("#prefChoice").change(function() {
        ap.changePrefClient($(this).val())
    });
    $(".userDetails .edit").click(function() {
        $(".nameForm").show()
    });
    $("#userBox").show();
    $(".nameForm .cancel").click(function() {
        $(".nameForm").hide()
    });
    $(".submitPass").click(function() {
        ap.validatePass()
    });
    $("#userBox_top").click(function() {
        $("#darkOverlay").hide();
        if (isIE6 != 0) {
            $("#ie6fix").remove()
        }
        $("#userBox").hide()
    });
    $(".nameForm").hide();
    $(".fav").click(function() {
        $(".profile").removeClass("profile_on");
        $(this).addClass("fav_on");
        $("#profileContent").hide();
        $("#favoritesContent").show()
    });
    $(".profile").click(function() {
        $(".fav").removeClass("fav_on");
        $(this).addClass("profile_on");
        $("#favoritesContent").hide();
        $("#profileContent").show()
    });
    $(".nameForm .nameSubmit").click(function() {
        var f = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.WelcomeName" text="' + ap.encodeHTML($(".nameForm #newName").val()) + '" /></update>';
        $.post(url, f, function(g) {
            $(".nameForm").hide();
            $(".userDetails .name").text($(".nameForm #newName").val());
            $(".welcomeName").text($(".nameForm #newName").val())
        });
        currUser = $(".nameForm #newName").val()
    });
    if (isIE6 != 0) {
        $("#userBox").after("<iframe id='ie6fix' src=''></iframe>");
        $("#ie6fix").css("z-index", "1002");
        $("#ie6fix").height("100%");
        $("#ie6fix").width("100%")
    }
    $("#darkOverlay").show()
};
ap.rampUp = function() {
    var a = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="Document" add="mode;ie6false" /></update>';
    // if (!ap.OCX) {
    //     ap.checkPlugin()
    // }
   //ap.checkIfRunningInQlikView();
    ap.init(a)
};
ap.tearDown = function(a) {
    $.post(a.url, a.lo_cmd, function() {
        if (window.sessionStorage) {
            window.sessionStorage.clear()
        }
        location.reload()
    })
};
//ap.init = function(a) {
$(document).ready(function() {
  
TryLogin(null, null, null, function(status) {
    var a = '<update mark="" stamp="" cookie="true" scope="Document" ident="AccessPoint" kind="AccessPoint"><set name="AccessPoint.Update" action="" /><set name="Document" add="mode;ie6false" /><set name="AccessPoint.Pagesize" value="0" /></update>';
    $.post(url, a, function(c) {
              xmlText = new XMLSerializer().serializeToString(c);
              var x2js = new X2JS();
              var jsonObj = x2js.xml_str2json( xmlText );
              result = jsonObj.result.object.value;
              for(i = 0; i < result.length; i++) {
                if( result[i]._name == 'Documents') {
                  documents = result[i].element;
                  for(d = 0; d < documents.length; d++) {
                    qvdocument = documents[d];
                    $("#search_list").append('<li><a title="Category: '+ qvdocument._category + 
                                                  '\nSize: '+ qvdocument._filesize + 
                                                  '\nClients: ' + qvdocument._clients  +
                                                  '\nLast Modified: ' + qvdocument._lastModified  +
                                                  '\nLast Update: ' + qvdocument._lastUpdate  +
                                                  '\nNext Update: ' + qvdocument._nextUpdate  +
                                                  '" href="/#">' + qvdocument._text.replace('.qvw', '') + '</a></li>');
                  }
//                   $('#search_input').fastLiveFilter('#search_list');
                  $('#search_input').fastLiveFilter('#search_list', { 
                          callback:function(total) {
                          $('#search_list').unhighlight();
                          searchTerm = $("#search_input").val();
                          if (searchTerm.length > 0) {
                              $('#search_list').highlight(searchTerm);
                          }
                      }
                  });
                  
                  $("#search_input").on("search", function() {
                    if ($('#search_input').val() == "")
                      $('#search_input').val('').change();
                  });
                }
                
              }
            
});

     })
});
//$(document).ready(function() {
    // $(window).resize(function() {
    //     if ($("#darkOverlay").is(":visible")) {
    //         $("#darkOverlay").width($(window).width());
    //         if ($(window).height() > $(document).height()) {
    //             $("#darkOverlay").height($(window).height())
    //         } else {
    //             $("#darkOverlay").height($(document).height())
    //         }
    //     }
    // });

    //if (thisPage == "home") {
        //ap.rampUp()
    // } else {
    //     if (thisPage == "login") {
    //         $(".loginSubmit").click(function() {
    //             if ($("#userName").val() === "") {
    //                 alert("Empty Username")
    //             } else {
    //                 if ($("#pass").val() === "") {
    //                     alert("Empty Password")
    //                 } else {
    //                     if (!window.formSubmit) {
    //                         TryLogin(null, $("#userName").val(), $("#pass").val(), function(a) {
    //                             if (a) {
    //                                 GoBack(_try)
    //                             } else {
    //                                 if (_try != null) {
    //                                     GoBack()
    //                                 } else {
    //                                     alert("Login Failed")
    //                                 }
    //                             }
    //                         })
    //                     }
    //                 }
    //             }
    //         });
    //         $("#loginBox input").keyup(function(a) {
    //             if (a.keyCode == 13) {
    //                 if ($("#userName").val() === "") {
    //                     alert("Empty Username")
    //                 } else {
    //                     if ($("#pass").val() === "") {
    //                         alert("Empty Password")
    //                     } else {
    //                         if (!window.formSubmit) {
    //                             TryLogin(null, $("#userName").val(), $("#pass").val(), function(b) {
    //                                 if (b) {
    //                                     GoBack(_try)
    //                                 } else {
    //                                     if (_try != null) {
    //                                         GoBack()
    //                                     } else {
    //                                         alert("Login Failed")
    //                                     }
    //                                 }
    //                             })
    //                         }
    //                     }
    //                 }
    //             }
    //         })
    //     }
    // }
//});