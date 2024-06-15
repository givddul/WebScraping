import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

/**
 * Function to get all movie availabilities
 * @param {String} cinemaUrl 
 * @returns all movie availabilities
 */
async function scrapMovieAvailability(cinemaUrl) {
    const days = ['05', '06', '07']; // Mapping to days
    const movies = ['01', '02', '03']; // The movie IDs

    const allAvailability = {};

    for (let i = 0; i < days.length; i++) {
        const day = days[i];
        for (let j = 0; j < movies.length; j++) {
            const movie = movies[j];
            const availability = await checkAvailability(cinemaUrl, day, movie);
            if (availability.length > 0) {
                if (!allAvailability[day]) {
                    allAvailability[day] = {};
                }
                allAvailability[day][movie] = availability;
            }
        }
    }
    return allAvailability;
}

/**
 * Function to check availability for a specific movie on a specific day
 * @param {String} cinemaUrl 
 * @param {String} day 
 * @param {String} movie 
 * @returns  available movie for a specific movie on a specific day
 */
async function checkAvailability(cinemaUrl, day, movie) {
    const url = `${cinemaUrl}check?day=${day}&movie=${movie}`;
    const response = await fetch(url);
    const data = await response.json(); 
    let availableMovies = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].status > 0) {
            availableMovies.push(data[i]);
        }
    }
    return availableMovies;
}

/**
 * Function to scrape movie titles, so we dont hardcode them 
 * @param {String} url 
 * @returns 
 */
async function scrapeMovieTitles(url) {
    const response = await fetch(url);
    const text = await response.text();
    const dom = new JSDOM(text);
    const document = dom.window.document;

    const movieSelect = document.querySelector('select[name="movie"]');
    const movieOptions = movieSelect.querySelectorAll('option');

    const movieTitles = {};
    movieOptions.forEach(option => {
        if (option.value && option.value !== '--- Pick a Movie ---') {
            movieTitles[option.value] = option.textContent;
        }
    });

    return movieTitles; 
    /*
    eg
    {
     '01': 'The Flying Deuces',      
     '02': 'Keep Your Seats, Please',
     '03': 'A Day at the Races'
    }
    */
}

/**
 * Function to scrape cinema data
 * @param {String} cinemaUrl 
 * @returns the movie availability and movie titles
 */
export async function scrapeCinema(cinemaUrl) {
    const moviesAvailability = await scrapMovieAvailability(cinemaUrl);
    const movieTitles = await scrapeMovieTitles(cinemaUrl);
    return { moviesAvailability, movieTitles };
}
