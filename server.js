const path = require("path");
const { createRequestHandler } = require("@remix-run/express");
const { installGlobals } = require("@remix-run/node");
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require('cors');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

installGlobals();

const BUILD_DIR = path.join(process.cwd(), "build");

const app = express();

const corsOptions = function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
}

// Middlewares
app.use(bodyParser.json());
app.use(compression());
app.use(corsOptions);
app.disable("x-powered-by");
app.use(
  "/build",
  express.static("public/build", { immutable: true, maxAge: "1y" })
);
app.use(express.static("public", { maxAge: "1h" }));
app.use(morgan("tiny"));

app.get('/tareas', async (req, res) => {
    const items = await prisma.Item.findMany();
    res.status(200).send(items);
});

app.get('/tareas/:id', async (req, res) => {
    const id = req.params.id;
    const itemById = await prisma.Item.findUnique({
        where: {
            id: id
        }
    });
    if (itemById) {
        res.status(200).send(itemById);
    } else {
        res.status(404).send();
    }
});

app.post('/tareas', async (req, res) => {
    const tarea = req.body.tarea;
    const newItem = await prisma.Item.create({
        data: {
            name: tarea,
            userId: '1'
        }
    });
    res.status(201).send();
});

app.put('/tareas/:id', async (req, res) => {
    const id = req.params.id;
    const tarea = req.body.tarea;
    const updatedItem = await prisma.Item.update({
        where: {
            id: id
        },
        data: {
            name: req.body.name,
            userId: '1'
        }
    });
    res.status(200).send();
});

app.delete('/tareas/:id', async (req, res) => {
    const id = req.params.id;
    const deletedItem = await prisma.Item.delete({
        where: {
            id: id
        }
    });
    res.status(200).send();
});

// Para prevenir errors de CORS
app.options('/tareas', (req, res) => {
    res.status(200).send();
});

app.options('/tareas/:id', (req, res) => {
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
