import fetch from 'node-fetch';

/**
 * Scrape dinner availability
 * @param {String} dinnerUrl
 * @returns available days and times
 */
export async function scrapeDinner(dinnerUrl) {
    const loginUrl = `${dinnerUrl}login`;

    // Login and get the cookie and location
    const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'username=zeke&password=coys',
        redirect: 'manual',
    });

    const cookie = loginResponse.headers.get('set-cookie');
    const bookingUrl = loginResponse.headers.get('location'); // the url we are redirected to
    
    const bookingPageResponse = await fetch(bookingUrl, { headers: { 'Cookie': cookie } });
    const bookingPageHtml = await bookingPageResponse.text();

    const availability = {};

    // Looks for "Friday", "Saturday", or "Sunday" occurrences in the HTML. 
    // After finding one of these day names, it captures everything following 
    // that name until it encounters the next day name or reaches the end of the string.
    // In our case we'll have 3 day sections, one for each day of the weekend.
    const daySections = bookingPageHtml.match(/(Friday|Saturday|Sunday)([\s\S]*?)(?=Friday|Saturday|Sunday|$)/g);


    // Loop through all day sections to extract the availability
    for (let i = 0; i < daySections.length; i++) {
        const daySection = daySections[i];

        // Extract the day of the daysection we are dealing with
        const day = daySection.match(/(Friday|Saturday|Sunday)/)[0];

        // Find all time slots for the day eg [ '14-16 Free', '16-18 Free', '18-20 Free', '20-22 Fully booked' ]
        const timeSlots = daySection.match(/\d{2}-\d{2}\s+(Free|Fully booked)/g);

        const dayAvailability = [];
        for (let j = 0; j < timeSlots.length; j++) {
            const timeSlot = timeSlots[j];

            // Check if the time slot is free
            if (timeSlot.includes('Free')) {
                const timeRange = timeSlot.match(/\d{2}-\d{2}/)[0];
                dayAvailability.push(timeRange);
            }
        }
        availability[day] = dayAvailability; // eg 18-20,20-22
    }

    return availability; // eg {
                         //     Friday: [ '14-16', '16-18', '18-20' ],
                         //     Saturday: [ '18-20', '20-22' ],
                         //     Sunday: [ '14-16', '16-18', '18-20', '20-22' ]
                         //   }
}