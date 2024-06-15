
/**
 * This function takes the availability of friends, the movie data and the restaurant availability and 
 * returns an array of recommendations
 * @param {String[]} friendsMatchingDays - Array of days when all friends are available (e.g., ['Friday', 'Saturday']).
 * @param {Object} cinemaData - Object containing movies availability and titles. 
 * @param {Object} restaurantAvailability - Object with days as keys and arrays of available time slots as values.
 */
export async function displayRecommendations(friendsMatchingDays, cinemaData, restaurantAvailability) {

    try {
        console.log('\n\nRecommendations\n===============\n');
        const moviesAvailability = cinemaData.moviesAvailability;
        const movieTitles = cinemaData.movieTitles;

        if (friendsMatchingDays.length === 0) {
        console.log('No common available days found among all friends.');
        return;
    }

        // Loop through all common days
        for (let i = 0; i < friendsMatchingDays.length; i++) {
            const day = friendsMatchingDays[i];
            let dayCode;
            if (day === 'Friday') {
                dayCode = '05';
            } else if (day === 'Saturday') {
                dayCode = '06';
            } else {
                dayCode = '07';
            }
            const movies = moviesAvailability[dayCode];

            for (const movieIdKey in movies) {
                // hasOwnProperty checks if the object has the property
                const shows = movies[movieIdKey];
                const movieTitle = movieTitles[movieIdKey];

                // Loop through all available shows for a specific movie on a specific day
                // and check if there is a free table in the restaurant
                for (let j = 0; j < shows.length; j++) {
                    const show = shows[j];
                    const movieStartTimeParts = show.time.split(':');
                    const movieStartTimeHour = parseInt(movieStartTimeParts[0]); // extract eg 16 from [ '16', '00' ]
                    const earliestDinnerTimeHour = movieStartTimeHour + 2; // dinner min 2 hours before movie starts

                    const availableTables = [];
                
                    for (let k = 0; k < restaurantAvailability[day].length; k++) {
                        const timeSlot = restaurantAvailability[day][k];
                        const timeSlotParts = timeSlot.split('-');
                        const startHour = parseInt(timeSlotParts[0]);
                        if (startHour >= earliestDinnerTimeHour) {
                            availableTables.push(timeSlot);
                        }
                    }

                    if (availableTables.length > 0) {
                        const dinnerTimeSlot = availableTables[0];
                        console.log(`* On ${day} the movie "${movieTitle}" starts at ${show.time} and there is a free table between ${dinnerTimeSlot}`);
                    }
                }
            }
        }
    } catch (error) {
        
    }
}
