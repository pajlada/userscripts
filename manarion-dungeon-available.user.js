// ==UserScript==
// @name         Manarion dungeon available
// @description  This userscript sends constant desktop notifications if you have a dungeon action available in Manarion.
// @author       pajlada
// @license      MIT
// @namespace    https://github.com/pajlada
// @homepageURL  https://github.com/pajlada/userscripts
// @version      1
// @match        https://manarion.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const INTERVAL = 5 * 1000;

    setInterval(() => {
        const sidebarDungeonIcon = document.querySelector('.col-span-4 .lucide-map');
        if (!sidebarDungeonIcon) {
            return;
        }

        const notification = new Notification("Manarion US", { body: "Dungeon action available", icon: 'https://manarion.com/icon-192.png' });
        notification.onclick = (event) => {
            window.focus();
            event.target.close();
        }
    }, INTERVAL);
})();
