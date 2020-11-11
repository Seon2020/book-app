# Book Application  

**Authors**: Sean Hawkins and Nebiyu Kifle      
**Version**: 1.0.0    

## Overview

- This is a book search form that relys on data from Google Books API. For each search query of either book title or author, we provide the first 10 results. Each search result includes the book thumbnail, title, author, and description. We have built this application to provide book data for various readers!  

## Getting Started

- git clone
- npm install
- nodemon 

## Architecture

- This app was built using JavaScript, node.js, express, dotenv, cors, ejs, and superagent. 

**Schema:**
```
DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description VARCHAR(255)
);
``` 

## Change Log

**Lab 11**  

Feature #1  
Number and name of feature: #1 - Load  
Estimate of time needed to complete: 30m  
Start time: 2:30pm  
Finish time: 3:15pm  
Actual time needed to complete: 45m  
10-31-2020 3:15pm - Page is loading  

Feature #2  
Number and name of feature: #2 - Search  
Estimate of time needed to complete: 30m  
Start time: 3:30pm  
Finish time: 4:15pm  
Actual time needed to complete: 45m  
10-31-2020 4:15pm - Search function complete  

Feature #3  
Number and name of feature: #3 - API Setup  
Estimate of time needed to complete: 30m  
Start time: 7:30pm  
Finish time: 8:15pm  
Actual time needed to complete: 45m  
11-03-2020 8:15pm - API setup complete  

Feature #4  
Number and name of feature: #4 - Error Page  
Estimate of time needed to complete: 30m  
Start time: 8:30pm  
Finish time: 9:15pm  
Actual time needed to complete: 45m  
11-03-2020 9:15pm - Error page complete  

Feature #5  
Number and name of feature: #5 - Style  
Estimate of time needed to complete: 30m  
Start time: 9:30pm  
Finish time: 10:45pm  
Actual time needed to complete: 1HR + 15m  
11-03-2020 10:45pm- Styling complete  

Feature #6  
Number and name of feature: #6 - Homepage  
Estimate of time needed to complete: 30m  
Start time: 11pm  
Finish time: 11:15pm  
Actual time needed to complete: 15m  
11-03-2020 11:15pm- Homepage displayed  

**Lab 12**  

Feature #1  
Number and name of feature: #1 - Saved Books  
Estimate of time needed to complete: 1H  
Start time: 6:30pm    
Finish time: 8:15pm    
Actual time needed to complete: 1H 45m     
11-5-2020 8:15pm - Saved books displayed on homepage    

Feature #2    
Number and name of feature: #2 - Book details page    
Estimate of time needed to complete: 1H      
Start time: 8:15pm    
Finish time: 9:30pm    
Actual time needed to complete: 1H 15m    
11-5-2020 9:30pm - Details page created    

Feature #3    
Number and name of feature: #3 - Add new books      
Estimate of time needed to complete: 1H     
Start time: 5:30pm    
Finish time: 6:15pm    
Actual time needed to complete: 45m    
11-6-2020 6:15pm - New books can be added     

Feature #4   
Number and name of feature: #4 - Layout partials    
Estimate of time needed to complete: 1H      
Start time: 6:15pm    
Finish time: 7:15pm    
Actual time needed to complete: 1H     
11-6-2020 7:15pm - Layout partials created and implemented    

Feature #5    
Number and name of feature: #5 - Clean UI   
Estimate of time needed to complete: 30m    
Start time: 7:15pm    
Finish time: 8:15pm    
Actual time needed to complete: 1H    
11-6-2020 8:15pm - UI cleaned up    


**Lab 13**  

Feature #1    
Number and name of feature: #1 - Update Details    
Estimate of time needed to complete: 1H    
Start time: 2:30pm    
Finish time: 4:15pm    
Actual time needed to complete: 1H 45m    
11-11-2020 4:15pm - Details can be updated    

Feature #2    
Number and name of feature: #2 - Delete Book      
Estimate of time needed to complete: 30m    
Start time: 8:30pm    
Finish time: 9:15pm    
Actual time needed to complete: 45m    
11-10-2020 9:15pm - Books can now be deleted   

## Credits and Collaborations  
- In collaboration with Nebiyu Kifle  
