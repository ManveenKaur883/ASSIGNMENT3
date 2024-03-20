
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

* Published URL: ___________________________________________________________

*

********************************************************************************/

const legoData = require("./modules/legoSets");
const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT||3000; 

// Initialize the Lego data module
legoData.initialize().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port http://localhost:${port}`);
    });
}).catch((err) => {
    console.error("Failed to initialize lego data:", err);
});

// Define the root route of the web server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});
// Define a route to get all Lego sets
app.get("/lego/sets", async (req, res) => {
    try {
        const set = await legoData.getAllSets();
        res.json(set);
} catch (error) {
        res.status(500).send(error.message);
    }
});

// Define a route to get a specific Lego set by number
// Route to get a Lego set by its number
app.get("/lego/sets/:set_num", async (req, res) => {
    const setNum = req.params.set_num;
    try {
        const set = await legoData.getSetByNum(setNum);
        if (!set) {
            return res.status(404).send({ message: "Lego set not found" });
        }
        res.json(set);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/views/404.html'));
});