const express = require("express");
const jsonfile = require("jsonfile");
const app = express();
const file = "pokedex.json";
const reactEngine = require("express-react-views").createEngine();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

app.engine("jsx", reactEngine);
app.set("views", __dirname + "/views");
app.set("view engine", "jsx");
app.get("/", (req, res) => {
  res.render("home");
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app

/**
 * ===================================
 * Routes
 * ===================================
 */

//  Expose a new endpoint that intercepts GET requests to /pokemon/new, which responds with a HTML page with a form that has these fields: id, num, name, img, height, and weight

app.get("/pokemon/new", (req, res) => {
  res.render("new");
});

app.post("/pokemon", (req, res) => {
  const pokemonData = {
    id: req.body.id,
    num: req.body.num,
    name: req.body.name,
    img: req.body.img,
    height: req.body.height,
    weight: req.body.weight
  };

  res.render("pokedex")

  const errors = [];

  for (key in pokemonData) {
    if (pokemonData[key] === "") {
      errors.push(key);
    }
  }

  const newErr = errors.map(function(err) {
    return "pokemon " + err;
  });

  console.log(newErr);

  const errObj = {
    errorMessage: `There was an error!
    You forgot to input: ${newErr.join(", ")}`
  };

  if (errors.length > 0) {
    res.render("new", errObj);
  } else {
    pokemonData.num = parseInt(req.body.num);
    jsonfile.readFile(file, (err, obj) => {
      obj.pokemon.push(pokemonData);

      jsonfile.writeFile(file, obj, err => {});
      res.render("created", pokemonData);
      console.log(obj.pokemon.length - 1);
    });
  }
});

app.get("/pokemon/:id", (request, response) => {
  // get json from specified file
  jsonfile.readFile(file, (err, obj) => {
    // obj is the object from the pokedex json file
    // extract input data from request
    let inputId = parseInt(request.params.id);
    let pokemon;
    // find pokemon by id from the pokedex json file
    for (let i = 0; i < obj.pokemon.length; i++) {
      let currentPokemon = obj.pokemon[i];

      if (currentPokemon.id === inputId) {
        pokemon = currentPokemon;
      }
    }

    if (pokemon === undefined) {
      // send 404 back
      response.status(404);
      response.render("404");
    } else {
      response.render("pokemonSearch", pokemon);
    }
  });
});

app.get("/", (request, response) => {
  response.send("yay");
});

/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
app.listen(3000, () =>
  console.log("~~~ Tuning in to the waves of port 3000 ~~~")
);
