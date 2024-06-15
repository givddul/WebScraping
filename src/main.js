import { scrapeCalendar } from './modules/calendar.js';
import { scrapeCinema } from './/modules/cinema.js';
import { scrapeDinner } from './/modules/restaurant.js';
import { displayRecommendations } from './/modules/recommender.js';

/**
 * Main function
 */
async function main() {
    const baseUrl = process.argv[2];

    if (baseUrl) {
        console.log("Scraping links...OK");
    } else {
        console.log("Scraping links...FAIL");
        return;
    }

    let calendarData, cinemaData, dinnerData;

    try {
        calendarData = await scrapeCalendar(`${baseUrl}/calendar/`);
        console.log("Scraping available days...OK");
    } catch (error) {
        console.error("Scraping available days...FAIL");
    }

    try {
        cinemaData = await scrapeCinema(`${baseUrl}/cinema/`);
        console.log("Scraping showtimes...OK");
    } catch (error) {
        console.error("Scraping showtimes...FAIL");
    }

    try {
        dinnerData = await scrapeDinner(`${baseUrl}/dinner/`);
        console.log("Scraping possible reservations...OK");
    } catch (error) {
        console.error("Scraping possible reservations...FAIL");
    }

    if (calendarData && cinemaData && dinnerData) {
        await displayRecommendations(calendarData, cinemaData, dinnerData);
    } else {
        console.error('Missing data for recommendations');
    }
}

main();
