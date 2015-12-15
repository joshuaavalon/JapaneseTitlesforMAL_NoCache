// ==UserScript==
// @name           Japanese Titles for MAL (No Cache) [Rewrite]
// @version        1.0.0.0
// @description    This is a rewrite version of "Japanese Titles for MAL (No Cache)" By zanetu to replace the outdated api. Displays Japanese titles along with English ones for anime/manga lists on myanimelist.net. This script, unlike its cache-version counterpart, does not download cached lists from dropbox.com. Although slow in fetching Japanese titles, this script is less cpu-intensive than its cache-version counterpart.
// @license        GPL v2
// @match          http://myanimelist.net/animelist/*
// @match          http://myanimelist.net/mangalist/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @grant          GM_xmlhttpRequest
// @namespace      https://greasyfork.org/en/users/23318-avalon-joshua
// ==/UserScript==

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (s) {
        return this.slice(0, s.length) == s;
    };
}

function insertJapanese(japanese, title) {
    if (typeof japanese == 'undefined' || japanese == '')
        return;
    else
        japanese = String(japanese).trim();
    title.innerHTML = '<div style="display:inline-block;float:left;text-decoration:inherit;">' + japanese + '</div>' + '<div style="opacity:0.5;filter:alpha(opacity=50);display:inline-block;float:left;clear:left;text-decoration:inherit;"><i>' + title.innerHTML + '</i></div>';
    var smallNode = title.parentNode.getElementsByTagName("small")[1];
    if (typeof smallNode != 'undefined') {
        smallNode.style['padding-left'] = '4px';
        smallNode.style['padding-right'] = '4px';
        smallNode.style['display'] = 'inline-block';
        smallNode.style['vertical-align'] = 'top';
    }
}

function findJapanese(element) {
    var spaceit_pad = element.getElementsByClassName("spaceit_pad");
    for (var i = 0; i < spaceit_pad.length; i++) {
        var temp = $(spaceit_pad[i]);
        var dark_text = $(spaceit_pad[i]).find('.dark_text');
        if (dark_text.length > 0) {
            if (dark_text[0].childNodes[0].textContent == "Japanese:") {
                return dark_text.context.textContent.replace("Japanese:", "").trim();
            }
        }
    }
    return "";
}

var titles = document.getElementsByClassName("animetitle");

function sendRequest(url, title) {
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            if (response.status == 200) {
                var div = document.createElement('div');
                div.innerHTML = response.responseText;
                insertJapanese(findJapanese(div), title);
            }
        }
    });
}

for (var i = 0; i < titles.length; i++) {
    var inquiry = "http://myanimelist.net/" + titles[i].getAttribute("href");
    sendRequest(inquiry, titles[i]);
}
