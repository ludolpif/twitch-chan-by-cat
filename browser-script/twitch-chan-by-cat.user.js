// ==UserScript==
// @name         twitch-chan-by-cat
// @namespace    http://tampermonkey.net/
// @version      2024-06-22
// @description  userScript modifiant Twitch en classant les chan live par catégories
// @author       Ludolpif
// @match        https://www.twitch.tv/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let version = '0.1';
    let mapArrOfStreamersByCat = null;

    function zpoLog(msg) {
        const ts = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit'});
        console.log(ts + " twitch-chan-by-cat: " + msg);
    }
    zpoLog("version " + version);

    function refreshMapArrOfStreamersByCat() {
        if (mapArrOfStreamersByCat) return;

        let firstSideNavSection = document.querySelector('.side-nav-section');
        //console.log(firstSideNavSection);
        let childDivs = firstSideNavSection.getElementsByTagName('div');
        //console.log(childDivs.length);
        if ( childDivs ) {
            mapArrOfStreamersByCat = new Map();
        }
        for (const div of childDivs)
        {
            let divClass = div.getAttribute('class');
            // top-level <div> of the inserted items in the list are the ones that does NOT have any class value
            if ( ! divClass ) {
                //console.log(div);
                let divStreamer = div.querySelector('.side-nav-card__title');
                //console.log(divStreamer);
                let streamerName = divStreamer.getElementsByTagName('p')[0].getAttribute('title');
                //console.log(streamerName);
                let divCategory = div.querySelector('.side-nav-card__metadata');
                //console.log(divCategory);
                let categoryLabel = divCategory.getElementsByTagName('p')[0].getAttribute('title');
                //console.log(categoryLabel);
                let mapEntry = mapArrOfStreamersByCat.get(categoryLabel);
                if ( ! mapEntry ) {
                    mapEntry = [];
                    mapArrOfStreamersByCat.set(categoryLabel, mapEntry);
                }
                mapEntry.push({ streamerName: streamerName, div: div });
            }
        }
        zpoLog("refreshMapDivByCat() keys: " + Array.from(mapArrOfStreamersByCat.keys()));
        for (const [categoryLabel, arrOfStreamers] of mapArrOfStreamersByCat) {
            for ( const item of arrOfStreamers ) {
                console.log(categoryLabel, item.streamerName, item.div);
            }
        }
    }

    let intervalID = setInterval(refreshMapArrOfStreamersByCat, 1000);
/*
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    if (!MutationObserver) { zpoLog('userScript: MutationObserver is unavailable'); return false; }

    let observer = new MutationObserver(e => {
        console.log(e);
    });
    //observer.observe(document.body, {childList: true, subtree: true});
*/
})();
