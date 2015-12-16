GV.OpenID.Main = function () {

    var securityCounter = 0;
    var user = false;
    var loginWindow = false;

    var logged = function () {
        //return typeof(_PUNDIT) != "undefined" && typeof(_PUNDIT.myPundit) != "undefined" && _PUNDIT.myPundit.logged;
        if (user == "null") {
            user = false;
        }

        if (!user) {
            return user;
        } else
            return true;
    }

    function updateUser() {
        IO.readXML(GV.OpenID.data, callback);
    }

    var callback = function (xml, info) {
        securityCounter++;
        if (securityCounter > 300) {
            loginWindow = false;
            securityCounter = 0;
        }

        if (xml == null) {
            IO.readXML(GV.OpenID.data, callback);
        } else {
            user = xml.getElementsByTagName("user")[0].firstChild.data;

            if (logged()) {
                if (loginWindow) {
                    loginWindow.close();
                    loginWindow = false;
                }
                $(".icon-login").each(function(){
                    $(this).removeClass("icon-login");
                    $(this).addClass("icon-logout");
                })
                document.getElementById("logtext").innerHTML = " Logout";
                document.getElementById("user").innerHTML = "- " + user;
            } else {
                $(".icon-logout").each(function(){
                    $(this).removeClass("icon-logout");
                    $(this).addClass("icon-login");
                })
                document.getElementById("logtext").innerHTML = " Login";
                document.getElementById("user").innerHTML = "- You are an anonymous user";
            }
            if (securityCounter < 300 && loginWindow && !logged()) {
                window.setTimeout(function () {
                    callback()
                }, 1000);
            }
        }
    }

    this.displayToprow = function () {
        if (typeof (GV.setting) != "undefined" && typeof (GV.setting.spatialstore) != "undefined" && GV.setting.spatialstore.getSpatialcontext()) {
            document.getElementById("toprowUL").removeAttribute("style");
            $(".nano").nanoScroller();
            $("#preloader").remove();
            GV.Draw.changeSetting();
            }
        else
            {
            window.setTimeout(GV.openid.displayToprow, 1000);
            }
    }

    this.update = function () {
        callback();
        GV.openid.displayToprow();
    }


    this.getUser = function () {
        return user;
    }


    this.log = function () {
        if (logged()) {
            //_PUNDIT.myPundit.logoutFunction();
            //document.getElementById('pundit-mypundit-loggedin-button').onclick();
            IO.readXML(GV.OpenID.logout, callback);
            window.setTimeout(function () {
                callback()
            }, 1000);
        }
        else {
            loginWindow = window.open("openid/oidc_login.html", '', 'left=260,top=120,width=900,height=650');
            loginWindow.focus();
            window.setTimeout(function () {
                callback()
            }, 1000);
        }
        securityCounter = 0;
    }




}