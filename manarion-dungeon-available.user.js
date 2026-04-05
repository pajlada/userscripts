// ==UserScript==
// @name         Manarion dungeon available
// @description  This userscript sends constant desktop notifications if you have a dungeon action available in Manarion.
// @author       pajlada
// @license      MIT
// @namespace    https://github.com/pajlada
// @homepageURL  https://github.com/pajlada/userscripts
// @version      3
// @match        https://manarion.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';

    const NOTIFICATION_TITLE = "Manarion US";
    const ICON_URL = 'https://manarion.com/icon-192.png';
    const intervalMs = GM_getValue('intervalSeconds', 5) * 1000;

    function sendNotification(body) {
        const notification = new Notification(NOTIFICATION_TITLE, { body, icon: ICON_URL });
        notification.onclick = (event) => {
            window.focus();
            event.target.close();
        };
    }

    function registerToggleCommand(key, label) {
        const disable = () => {
            GM_setValue(key, false);
            GM_notification({ text: `${label} disabled`, title: NOTIFICATION_TITLE });
            GM_registerMenuCommand(`Enable ${label}`, enable, { id: key });
        };
        const enable = () => {
            GM_setValue(key, true);
            GM_notification({ text: `${label} enabled`, title: NOTIFICATION_TITLE });
            GM_registerMenuCommand(`Disable ${label}`, disable, { id: key });
        };
        if (GM_getValue(key, true)) {
            GM_registerMenuCommand(`Disable ${label}`, disable, { id: key });
        } else {
            GM_registerMenuCommand(`Enable ${label}`, enable, { id: key });
        }
    }

    GM_registerMenuCommand('Set check interval (seconds)', () => {
        const current = GM_getValue('intervalSeconds', 5);
        const input = prompt('Check interval in seconds:', current);
        if (input === null) return;
        const parsed = parseInt(input, 10);
        if (isNaN(parsed) || parsed < 1) {
            GM_notification({
                text: `Invalid interval (${input}). Pleae enter a positive integer.`,
                title: NOTIFICATION_TITLE,
            });
            return;
        }
        GM_setValue('intervalSeconds', parsed);
        GM_notification({
            text: `Interval updated to ${parsed}s. Reload the page to apply.`,
            title: NOTIFICATION_TITLE,
        });
    });

    registerToggleCommand('dungeonEnabled', 'dungeon check');
    registerToggleCommand('eventDungeonEnabled', 'event dungeon check');

    setInterval(() => {
        if (GM_getValue('dungeonEnabled', true)) {
            const sidebarDungeonIcon = document.querySelector('.col-span-4 .lucide-map');
            if (sidebarDungeonIcon) {
                sendNotification("Dungeon action available");
            }
        }

        if (GM_getValue('eventDungeonEnabled', true)) {
            const btn = Array.from(document.querySelectorAll('.space-y-1 button')).find(btn => btn.textContent === "Event Dungeon");
            if (btn && !btn.disabled) {
                sendNotification("Event dungeon action available");
            }
        }
    }, intervalMs);
})();
