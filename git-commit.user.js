// ==UserScript==
// @name Git commit comment
// @description Сборка текста для коммита в гите
// @author Timur Mingaliev
// @version 1.0
// @include http://jira.ruru.ru/*
// @include https://jira.nsc-tech.ru/*
// ==/UserScript==

var unsafeWindow= this.unsafeWindow;

(function (window, undefined){
    var unsafeWindow= this.unsafeWindow;
    (function(){
        var test_scr= document.createElement("script");
        var tid= ("t" + Math.random() + +(new Date())).replace(/\./g, "");
        test_scr.text= "window."+tid+"=true";
        document.querySelector("body").appendChild(test_scr);
        if (typeof(unsafeWindow) == "undefined" || !unsafeWindow[tid]) {
            if (window[tid]) {
                unsafeWindow= window;
            } else {
                var scr= document.createElement("script");
                scr.text= "(" +
                    (function() {
                        var el= document.createElement('unsafeWindow');
                        el.style.display= 'none';
                        el.onclick=function(){return window};
                        document.body.appendChild(el);
                    }).toString() + ")()";
                document.querySelector("body").appendChild(scr);
                this.unsafeWindow= document.querySelector("unsafeWindow").onclick();
                unsafeWindow= window.unsafeWindow;
            };
        }
    })();

    var w = unsafeWindow,
        els,
        comment,
        commentNode;

    if (/http:\/\/jira.ruru.ru/.test(w.location.href) ||
        /https:\/\/jira.nsc-tech.ru/.test(w.location.href)) {

        els = {
            task: document.getElementById("key-val"),
            name: document.getElementById("summary-val")
        };

        comment = els.task.innerText + " " + els.name.innerText;

        commentNode = document.createElement("input");
        commentNode.setAttribute("type", "text");
        commentNode.setAttribute("value", comment);
        commentNode.setAttribute("size", 80);
        commentNode.addEventListener("click", function () {
            this.select();
        }, false);
        commentNode.style.marginLeft = "65px";

        els.name.parentNode.insertBefore(commentNode, els.name.nextSibling);
    }
})(window, undefined);