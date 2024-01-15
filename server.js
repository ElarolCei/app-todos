const path = require("path");

const { createRequestHandler } = require("@remix-run/express");
const { installGlobals } = require("@remix-run/node");
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

installGlobals();

const BUILD_DIR = path.join(process.cwd(), "build");

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(compression());
app.disable("x-powered-by");
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);
app.use(express.static("public", { maxAge: "1h" }));
app.use(morgan("tiny"));

// Servidor tareas
const tareas = ['Comprar el pan', 'Salir a correr'];

app.get('/tareas', (req, res) => {
  res.status(200).send(tareas);
});

app.get('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id) || tareas[id] === undefined) {
      res.status(400).send("ERROR: El id de la tarea no es un número o no existe.");
      return;
  }

  const tarea = tareas[id];
  res.status(200).send(tarea);
});

app.post('/tareas', (req, res) => {
    const tarea = req.body.tarea;
    if (tarea) {
        tareas.push(tarea);
        res.status(201).send();
    } else {
        res.status(400).send("ERROR: La propiedad 'tarea' del body no tiene valor.");
    }
});

app.put('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id) || tareas[id] === undefined) {
      res.status(400).send("ERROR: El id de la tarea no es un número o no existe.");
      return;
  }

  const tarea = req.body.tarea;
  if (!tarea) {
      res.status(400).send("ERROR: La propiedad 'tarea' del body no tiene valor.");
      return;
  }

  tareas[id] = tarea;
  res.status(200).send();
});

app.delete('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id) || tareas[id] === undefined) {
      res.status(400).send("ERROR: El id de la tarea no es un número o no existe.");
      return;
  }

  tareas.splice(id, 1);
  res.status(200).send();
});

// Servidor Remix
app.all(
  "*",
  process.env.NODE_ENV === "development"
    ? (req, res, next) => {
        purgeRequireCache();

        return createRequestHandler({
          build: require(BUILD_DIR),
          mode: process.env.NODE_ENV,
        })(req, res, next);
      }
    : createRequestHandler({
        build: require(BUILD_DIR),
        mode: process.env.NODE_ENV,
      })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
