// ==UserScript==
// @name Git commit comment
// @description Сборка текста для коммита в гите
// @author Timur Mingaliev
// @version 1.1.1
// @include http://jira.ruru.ru/*
// @include https://jira.nsc-tech.ru/*
// ==/UserScript==

(function (w, undefined){
    var els,
        comment,
        commentNode,
        branchName,
        branchNameSummary,
        branchNameSummary2 = [],
        branchNameNode,
        clearStr = function (str) {
            return str.replace(/[^0-9a-zа-я]/gi, "");
        };

    String.prototype.translit = (function(){
            var L = {
                    'А':'A','а':'a','Б':'B','б':'b','В':'V','в':'v','Г':'G','г':'g',
                    'Д':'D','д':'d','Е':'E','е':'e','Ё':'Yo','ё':'yo','Ж':'Zh','ж':'zh',
                    'З':'Z','з':'z','И':'I','и':'i','Й':'Y','й':'y','К':'K','к':'k',
                    'Л':'L','л':'l','М':'M','м':'m','Н':'N','н':'n','О':'O','о':'o',
                    'П':'P','п':'p','Р':'R','р':'r','С':'S','с':'s','Т':'T','т':'t',
                    'У':'U','у':'u','Ф':'F','ф':'f','Х':'Kh','х':'kh','Ц':'Ts','ц':'ts',
                    'Ч':'Ch','ч':'ch','Ш':'Sh','ш':'sh','Щ':'Sch','щ':'sch','Ъ':'"','ъ':'"',
                    'Ы':'Y','ы':'y','Ь':"'",'ь':"'",'Э':'E','э':'e','Ю':'Yu','ю':'yu',
                    'Я':'Ya','я':'ya'
                },
                r = '',
                k;
            for (k in L) r += k;
            r = new RegExp('[' + r + ']', 'g');
            k = function(a){
                return a in L ? L[a] : '';
            };
            return function(){
                return this.replace(r, k);
            };
        })();

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

        branchName = els.task.innerText + "_";
        branchNameSummary = els.name.innerText.split(" ");
        for (var i = 0; i < branchNameSummary.length; i++) {
            if (branchNameSummary[i]){
                branchNameSummary2.push(clearStr(branchNameSummary[i]).translit());
            }
        }
        branchName += branchNameSummary2.join("-");

        branchNameNode = document.createElement("input");
        branchNameNode.setAttribute("type", "text");
        branchNameNode.setAttribute("value", branchName);
        branchNameNode.setAttribute("size", 80);
        branchNameNode.addEventListener("click", function () {
            this.select();
        }, false);
        branchNameNode.style.marginLeft = "65px";
        branchNameNode.style.marginBottom = "15px";


        els.name.parentNode.insertBefore(commentNode, els.name.nextSibling);
        els.name.parentNode.insertBefore(branchNameNode, els.name.nextSibling);
    }
})(window, undefined);