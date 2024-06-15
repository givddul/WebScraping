# Web Scraper for Weekend Planning

This Node.js application scrapes information from the following website: https://courselab.lnu.se/scraper-site-1/ to help the fictional friends (Peter, Paul, and Mary) plan their weekend. It finds a common free day, checks movie showtimes, and books a restaurant table based on the available schedule.


## Project Structure
- `main.js`: Entry point that coordinates the scraping process.
- `modules/`
  - `calendar.js`: Handles scraping and analysis of the calendar site.
  - `cinema.js`: Handles scraping of the cinema site.
  - `restaurant.js`: Manages login and data extraction from the restaurant site.
  - `recommender.js`: Analyzes data and suggests the best movie and dinner time.


## Output
The output of the application will be in the console and look similar to:
```
------------------------------------------------------------------------
Scraping links...OK
Scraping available days...OK
Scraping showtimes...OK
Scraping possible reservations...OK

Recommendations
===============
* On Friday the movie "Keep Your Seats, Please" starts at 16:00 and there is a free table between 18:00-20:00.
* On Friday the movie "A Day at the Races" starts at 16:00 and there is a free table between 18:00-20:00.
------------------------------------------------------------------------
```

##
### Credits
This application was developed as part of a web programming course assignment at Linnaeus University.
