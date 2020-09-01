const express = require('express');
const app = express();
const cors = require('cors');
const client = require("./db");


//---app express/cors---//
app.use(cors());
app.use(express.json());


  //---Client Connection to DB---//
client.connect((err) => {
    if (err) {
      console.error('Connection Error', err.stack);
    } else {
      console.log('Connected');
    }
  });


app.get("/", (req, res) => {
    res.send("You have reached the API for Five Star Bass's Music Manager!");
})


app.get('/queue', async (req, res) => {
  try {
    const queue = await client.query(
      'SELECT * FROM song_queue'
    );
    res.json(queue.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get('/next', async (req, res) => {
  try {
    const queue = await client.query(
      'SELECT * FROM song_queue'
    );
    res.json(queue.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});


//  Add New Song to Queue: takes in artist and link strings in request body 
//  and inserts values into song_queue table with SQL query.
app.post("/queue", async(req, res) => {
    const { artist, link } = req.body;

    const queryString = 'INSERT INTO song_queue(artist, link) VALUES($1, $2) RETURNING *';
    const values = [artist, link];

    try {
        const addSong = await client.query(queryString, values);
        res.json(addSong.rows[0]);
      } catch (err) {
        console.log(err.stack);
      }
});





//---Listening Port for Localhost:3001---//
app.listen(3001, () => {
    console.log("Server running on port 3001");
   });