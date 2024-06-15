import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

/**
 * Scrape calendar URLs from a given URL 
 * @param {String} calendarUrl - ./scraper-site-2/calendar
 * @returns eg ./calendar/mary3.html
 */
async function scrapeCalendarURLs(calendarUrl) {
    try {
        const response = await fetch(calendarUrl);
        const text = await response.text();
        const dom = new JSDOM(text);
        const document = dom.window.document;
        const linkNodes = document.querySelectorAll('ul li a');
        const calendarUrls = [];

        // Loop through each link and get the absolute URL
        for (const linkNode of linkNodes) {
            const personsUrl = new URL(linkNode.href, calendarUrl).href;
            calendarUrls.push(personsUrl);
        }

        return calendarUrls;
    } catch (error) {
        return [];
    }
}

/**
 * Scrape individual calendar and return available days
 * @param {String} url  URL of a specific persons calendar
 * @returns Array of available days
 */
async function scrapeFriendAvailableDays(url) {
    const response = await fetch(url);
    const text = await response.text();
    const dom = new JSDOM(text);
    const document = dom.window.document;
    const days = ['Friday', 'Saturday', 'Sunday'];
    const availableDays = [];

    // Loop through each day and check if it's available
    for (let index = 0; index < days.length; index++) {
        const day = days[index];
        const dayNode = document.querySelector(`table tr td:nth-child(${index + 1})`);
        if (dayNode) {
            const status = dayNode.textContent.trim().toLowerCase();
            if (status === 'ok') {
                availableDays.push(day);
            }
        }
    }

    return availableDays;
}

/**
 * Scrape all calendars and find common availability
 * @param {String} urls  Array of calendar URLs to the 3 people
 * @returns  common available days
 */
async function scrapeAllCalendars(urls) {
    const allDays = ['Friday', 'Saturday', 'Sunday'];
    const results = { Friday: true, Saturday: true, Sunday: true }; // Initialize all days to true (Available/OK)

    // Loop through each persons available days and make days false as an unavailable day is found.
    for (const url of urls) {
        const availableDays = await scrapeFriendAvailableDays(url); // eg [ 'Friday', 'Saturday' ]

        for (const day of allDays) {
            if (!availableDays.includes(day)) {
                results[day] = false;
            }
        }
    }
    // now results might look like { Friday: true, Saturday: false, Sunday: false }

    const commonAvailableDays = [];
    for (const day in results) {
        if (results[day]) {
            commonAvailableDays.push(day);
        }
    }

    return commonAvailableDays;
}

/**
 * Scrape all calendars and find common availability
 * @param {String} calendarUrl 
 * @returns 
 */
export async function scrapeCalendar(calendarUrl) {
    const calendarUrls = await scrapeCalendarURLs(calendarUrl);
    return scrapeAllCalendars(calendarUrls);
}
