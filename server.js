
/********************************************************************************

* WEB322 – Assignment 03

* 

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

* 

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

* 

* Name: _____Manveen kaur_________________ Student ID: ____133668228__________ Date: _____19-03-2024_________

*

* Published URL: ___https://fancy-top-coat-calf.cyclic.app______________________________________________________

*

********************************************************************************/

const legoData = require("./modules/legoSets");
const availableThemes = ["RoboRiders", "Town", "Paradise"];
legoData.initialize();
const path = require('path');
const express = require('express');

const app = express();
app.use(express.static('public'));
app.set("view engine", "ejs");
const port = process.env.PORT||3000; 

legoData.initialize().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port http://localhost:${port}`);
    });
  }).catch((err) => {
    console.log(err);
  });;


  app.get('/', (req, res) => {
    res.render("home", { page: '/' });
  });
  
  app.get('/about', (req, res) => {
    res.render("about", { page: '/about' });
  });
  
  app.get('/lego/sets', (req, res) => {
    console.log(req.query);
    if (req.query.theme){
      legoData.getSetsByTheme(req.query.theme)
      .then(themeSets => {
        res.render('sets', {legoSets: themeSets, currentTheme: req.query.theme, availableThemes: availableThemes});
      })
      .catch(error => {
          console.error(error);
          res.status(404).render('404', {message: "No sets found for the specified theme."});
      });
    }
    else {
      legoData.getAllSets()
      .then(sets => {
          res.render('sets', {legoSets: sets, currentTheme: "", availableThemes: availableThemes});
      })
      .catch(error => {
          console.error(error);
          res.status(404).render('404', {message: "I'm sorry, we're unable to find what you're looking for."});
      });
    }
  });
  
  app.get('/lego/sets/:set_num', (req, res) => {
    const setNum = req.params.set_num;
  
    legoData.getSetByNum(setNum)
      .then((set) => {
        if (!set) {
          res.status(404).render("404", { message: "No set found for the specified set number." });
        } else {
          res.render('set', { legoSet: set });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for." });
      });
  });
  