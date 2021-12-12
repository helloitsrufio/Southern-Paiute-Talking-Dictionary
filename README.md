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

This is what the home page looks like. The user can search the database from here.
![Screenshot of home page](views\CSS\Images\Homepage.png)

The search results include all words, phrases, and sentences that contain the user's query. 
![Screenshot of search page](views\CSS\Images\SearchPage.png)

All of the entries have the following information:
  - **The word written in Southern Paiute** 
  - **How it is written in the International Phonetic Alphabet**
  - **Relevant grammatical information** 
  - **The translation of the word, phrase, or sentence** 
  - **An example** (when provided) 
  - **Related terms** 
  - **An audio file:** These audio files have been gathered over the last five years through language sessions with a tribal elder. It is our hope that, even if people can't read the Southern Paiute alphabet, they will still know how to pronounce the words due to these audio files. In addition, the inclusion of the audio should, to a certain extent, preserve the pronunciation of the language as it is right now. 

![Screenshot of entry page](views\CSS\Images\WordPage.png)


This application includes an about page in which users can understand the background and purpose of the project.
![Screenshot of about page](views\CSS\Images\AboutPage1.png)

It also includes a contact page in case the users wish to contact the project team. 
![Screenshot of contact page.](views\CSS\Images\ContactPage.png)

Since the inception and design of the project, two additional pages have been added. These are an alphabet page, to explain the alphabet this application uses, and an input page, so that an administrator can add relevant entries to the database. While there is no mockup for the alphabet page as of right now, the input page is as follows:
![Screenshot of input page.](views\CSS\Images\InputPage.png)

## Technologies Used
Made with **Node.js**, **Express**, **MongoDB**, **JavaScript**, **EJS**, **Cloudinary**, and **CSS3**.

## Use and Installation

### Install
 `npm install`
 
### Things you'll need to add
To get the values for these environment variables, you will need to
  1) Create an account and set up a cluster for this project on MongoDB
  2) Create an account on Cloudinary
   
- Create a `.env` file and add the following as `key = value`
  - DB_STRING = `your database URI`
  - CLOUDINARY_CLOUD_NAME = `your cloudinary cloud name`
  - CLOUDINARY_API_KEY = `your cloudinary api key`
  - CLOUDINARY_API_SECRET = `your cloudinary api secret` 


### Packages/Dependencies Utilized
    "busboy": "^0.3.1",
    "cloudinary": "^1.27.1",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "ejs": "^3.1.6",
    "express": "^4.17.1",
    "express-fileupload": "^1.2.1",
    "mongodb": "^4.1.4",
    "nodemailer": "^6.7.2",
    "nodemon": "^2.0.15"
    
## What still needs to be done
- [ ] Make overall site more responsive for various screen widths (each page need this adjustment)
  - [ ] Make site mobile-friendly
- [ ] Make contact form functional
- [ ] Disable search history in search bar
- [ ] Make a button/link to access input page
  - [ ] Set up auth for admin (in order to access input page)
- [ ] Reorganize code base into MVC format to make more readable/accessible
- [ ] Add content and styling to `Alphabet` page
- [ ] Reprogram the front-end in React
- [ ] Add photos of team and team members for `About` page

## Contact
If you have questions, concerns, suggestions, or anything else, feel free to email the developer, Ruth Reed, at [ruthreed.dev@gmail.com](mailto:ruthreed.dev@gmail.com).
