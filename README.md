# Southern Paiute Talking Dictionary

## About
This project was created for the preservation of the Cedar Band dialect of the Southern Paiute language. This language has its roots in Utah, Nevada, and Arizona. There are currently very few speakers left, so it is our intention to best preserve this language as we possibly can with the modern tools at our disposal.

This online talking dictionary was created in order to 
1) preserve pronunciation of the Cedar Band dialect for future generations
2) make the Cedar Band dialect of Southern Paiute more accessible to band/tribal members and whomever wishes to access/learn the language. 

This repository holds all the (currently implemented) files to the online talking dictionary. The current designer and developer of the project is Ruth Reed. 

View project [here](https://southernpaiutedictionary.herokuapp.com/).

## Details of Application
This application is a search engine that can search the database for the Southern Paiute language and return relevant words, phrases, and sentences. 

It includes the following pages:
- **Home page**: The user can search the database from here.
- **Search results page**: The search results include all words, phrases, and sentences that contain the user's query. 
- **(Word) Entry page**: All of the entries have the following information:
  - _The word written in Southern Paiute_
  - _How it is written in the International Phonetic Alphabet_
  - _Relevant grammatical information_ 
  - _The translation of the word, phrase, or sentence_
  - _An example_ (when provided) 
  - _Related terms_
  - _An audio file:_ These audio files have been gathered over the last five years through language sessions with a tribal elder. It is our hope that, even if people can't read the Southern Paiute alphabet, they will still know how to pronounce the words due to these audio files. In addition, the inclusion of the audio should, to a certain extent, preserve the pronunciation of the language as it is right now. 
- **About page**: This application includes an about page in which users can understand the background and purpose of the project.
- **Contact page**: The application includes a contact page in case the users wish to contact the project team. 
- **Input page**: A page in which an administrator can add relevant (word) entries to the database.
- **Alphabet page**: Explains the alphabet this application/language uses.

You can see a screenshot of all these pages (except for the alphabet page, which is under construction) in this repository under views/CSS/Images.

## Technologies Used
Made with **Node.js**, **Express**, **MongoDB**, **JavaScript**, **EJS**, **Cloudinary**, **SASS**, and **CSS3**.

## Use and Installation

### Install
 `npm install`
 
### Things you'll need to add
To get the values for these environment variables, you will need to
  1) Create an account and set up a cluster for this project on MongoDB
  2) Create an account on Cloudinary
   
- Create a `.env` file, put it in your config folder, and add the following as `key = value`
  - DB_STRING = `your database URI`
  - CLOUDINARY_CLOUD_NAME = `your cloudinary cloud name`
  - CLOUDINARY_API_KEY = `your cloudinary api key`
  - CLOUDINARY_API_SECRET = `your cloudinary api secret` 


### Packages/Dependencies Utilized
    "@googleapis/oauth2": "^0.2.0",
    "busboy": "^0.3.1",
    "cloudinary": "^1.27.1",
    "connect-mongo": "^4.6.0",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "ejs": "^3.1.6",
    "express": "^4.17.1",
    "express-fileupload": "^1.2.1",
    "mongodb": "^4.1.4",
    "nodemailer": "^6.7.2",
    "nodemon": "^2.0.15"
    "express-session": "^1.17.2",
    "file-upload": "^0.0.0",
    "googleapis": "^92.0.0",
    "mongodb": "^4.1.4",
    "mongoose": "^6.1.8",
    "multiparty": "^4.2.2",
    "nodemailer": "^6.7.2",
    "nodemon": "^2.0.15"
  }
    
## Optimizations
- [x] Make overall site more responsive for various screen widths (each page needs this adjustment)
  - [x] Make site mobile-friendly
- [x] Make contact form functional
- [ ] Disable search history in search bar
- [ ] Make a button/link to access input page
  - [x] Set up auth for admin (in order to access input page)
- [x] Reorganize code base into MVC format to make more readable/accessible
- [ ] Add content and styling to `Alphabet` page
- [ ] Reprogram the front-end in React
- [ ] Add photos of team and team members for `About` page
- [x] Add a page in which the admin can update entries to database
- [x] Add a button which enables the admin to delete an entry from the database
- [ ] Fix back button on search query page/word page from going to input page to previous page.
- [x] Add a glossary so users can see all the words in the db
- [ ] Add glossary link to nav bar
- [ ] Add a dark mode
  - [ ] Dark mode switch
- [ ] Hamburger color is offset from the actual button in mobile
- [ ] Make year in footer Date().getFullYear() to make it auto update.

## Contact
If you have questions, concerns, suggestions, or anything else, feel free to email the developer, Ruth Reed, at [ruthreed.dev@gmail.com](mailto:ruthreed.dev@gmail.com).
