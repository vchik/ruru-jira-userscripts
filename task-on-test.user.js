// ==UserScript==
// @name Task on test
// @description Отметка задачи, если она разложена на тестовом сервере
// @author Timur Mingaliev
// @version 1.3.4
// @include http://jira.ruru.ru/*
// @include https://jira.nsc-tech.ru/*
// ==/UserScript==

(function (w, undefined){
    if (/http:\/\/jira.ruru.ru/.test(w.location.href) ||
        /https:\/\/jira.nsc-tech.ru/.test(w.location.href)) {


        /**
         * Находим хеш коммита
         */
        var els = document.getElementsByTagName("DIV"),
            hash = false,
            hashElement;
        for(var i = els.length; i--;){
            var el = els[i];
            if( el.getAttribute("data-fieldtype") == "textfield" ){
                var prev = el.previousSibling, c = 0;
                while( prev && prev.nodeName.toLowerCase() != "strong" && c < 10){
                    prev = prev.previousSibling;
                    c++;
                }
                if( prev.getAttribute("title") == "Git hash" ){
                    hashElement = el;
                    hash = el.textContent.replace(/\s/gi, "");
                }
            }
        }

        if (!hash) {
            return false;
        }

        /**
         * Добавляем стиль для лейблов
         */
        var head = document.getElementsByTagName("head")[0];
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(".js-userscript-label{display: inline-block; background: #ADD6F7; border-radius:3px; padding: 3px; margin: 0 4px;} " +
                                                  ".js-userscript-label a{color: #333; text-decoration: underline;}"));
        head.appendChild(style);

        /**
         * Функция создания XMLHttpRequest-объекта
         * @returns {XMLHttpRequest}
         */
        var createRequestObject = function() {
            var request = null;
            try {
                request=new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e){}
            if(!request) try {
                request=new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e){}
            if(!request) try {
                request=new XMLHttpRequest();
            } catch (e){}
            return request;
        };

        /**
         * Функция простого GET-запроса
         * @returns {Boolean}
         */
        var serverRequest = function(url, data, callback) {
            var request = createRequestObject();
            if(!request) return false;
            request.onreadystatechange  = function() {
                if(request.readyState == 4 && callback) callback(request, data);
            };
            request.open('GET', url, true);
            if (request.setRequestHeader)
                request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            request.send(null);
            return true;
        };

        /**
         * Функция добавления ярлыка сервера
         */
        var addLabel = function(text){
            var block = document.getElementById("customfieldmodule");
            var label = document.createElement("div");
            var link = document.createElement("a");
            label.setAttribute("class", "js-userscript-label");
            var textNode = document.createTextNode(text);
            link.appendChild(textNode);
            link.setAttribute("href", "http://" + text + "/");
            link.setAttribute("target", "_blank");
            label.appendChild(link);
            block.appendChild(label);
        };

        /**
         * Функция получения названия репозитория
         */
        var getRepoName = function(text) {
            return /gitolite@git\.ruru\.ru:\/([a-zA-Z\-]*)\s\(fetch\)/g.exec(text)[1];
        }

        var testServers = [
            "https://test01.ruru.ru",
            "https://mtest01.ruru.ru",
            "https://mtest02.ruru.ru",
            "https://ktest01.ruru.ru",
            "https://test01api.ruru.ru",
            "https://test01api.ruru.ru/v2",
            "https://ptest01.ruru.ru",
            "https://test06.ruru.ru",
            "https://test03.ruru.ru",
            "https://test04.ruru.ru",
            "https://alfa01.ruru.ru",
            "https://ncalfa01.ruru.ru",
            "https://widget01.ruru.ru",
            "https://api8.ruru.ru",
            // https://fmoney.ruru.ru/rev.txt
            // https://fkvartplata.ruru.ru/rev.txt
            "https://follow.ruru.ru",
            "https://follow2.ruru.ru",
            "https://vktest01.ruru.ru"
        ];

        for(var i = testServers.length; i--;){
            var server = testServers[i];
            serverRequest(server+"/rev.txt?", server, function(response, s){
               if(response.status == 200){
                   var serv = s.replace(/http[s]?/gi, "").replace(/^[\/:]*/gi, "");
                   if( response.responseText.indexOf(hash) > -1 ){
                       addLabel(serv);
                       var reponame = getRepoName(response.responseText);
                       hashElement.innerHTML = "<a href=\"http://git.dev.ruru.ru/" + reponame + "/commit/" + hash + "\">" + hash + "</a>";
                   }
               }
            });
        }
    }
})(window, undefined);
