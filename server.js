
/********************************************************************************
* WEB322 – Assignment 05
* 
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
* 
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
* Name: _____Manveen Kaur_________________ Student ID: ____133668228__________ Date: _____10-04-2024_________
*
* Published URL: ___https://fancy-top-coat-calf.cyclic.app______________________________________________________
*
********************************************************************************/

const legoData = require("./modules/legoSets");
const express = require('express');
const bodyParser = require('body-parser'); 

const app = express();
const port = process.env.PORT || 3000; 
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

legoData.initialize().then(() => {
    console.log("Lego data is initialized.");
    app.listen(port, () => console.log(`Server is running on port: ${port}`)); // Starts the server
}).catch(err => {
    console.error("Lego data is not initialized", err);
});

app.get('/', (req, res) => {
    res.render("home", { page: "/" });
});

app.get('/about', (req, res) => {
    res.render("about", { page: "/about" });
});

app.get("/lego/sets", async (req, res) => {
    try {
        const sets = await legoData.getAllSets();
        res.render('sets', { sets: sets, page: "/lego/sets", activeTheme: req.query.theme || "" });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/lego/sets/:set_num", async (req, res) => {
    try {
        const set = await legoData.getSetByNum(req.params.set_num);
        if (set) {
            res.render("set", { set: set, page: "/lego/sets/:set_num" });
        } else {
            res.status(404).render('404', { page: "" }); 
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/lego/addSet", (req, res) => {
    legoData.getThemes().then(themes => {
        res.render("addSet", { themes: themes, page: "/lego/addSet" });
    }).catch(error => {
        res.status(500).send(error.message);
    });
});

app.post("/lego/addSet", (req, res) => {
    legoData.addSet(req.body).then(() => {
        res.redirect("/lego/sets");
    }).catch(error => {
        res.status(500).render('500', { message: error.message });
    });
});

app.get("/lego/editSet/:num", async (req, res) => {
    try {
        const setPromise = legoData.getSetByNum(req.params.num);
        const themesPromise = legoData.getThemes();

        const [set, themes] = await Promise.all([setPromise, themesPromise]);

        if (!set) {
            return res.status(404).render('404', { page: "", message: "Set not found." });
        }

        res.render("editSet", { set: set, themes: themes, page: "/lego/editSet" });
    } catch (error) {
        res.status(500).render('500', { message: error.message });
    }
});

app.post("/lego/editSet", async (req, res) => {
    try {
        await legoData.editSet(req.body.set_num, req.body);
        res.redirect("/lego/sets");
    } catch (error) {
        res.status(500).render('500', { message: `I'm sorry, but we have encountered the following error: ${error.message}` });
    }
});

app.get("/lego/deleteSet/:num", async (req, res) => {
    try {
        await legoData.deleteSet(req.params.num);
        res.redirect("/lego/sets");
    } catch (error) {
        res.render("500", { message: `I'm sorry, but we have encountered the following error: ${error.message}` });
    }
});

app.use((req, res) => {
    res.status(404).render('404', { page: "" });
});