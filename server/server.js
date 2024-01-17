const path = require('path');
const { createRequestHandler } = require('@remix-run/express');
const { installGlobals } = require('@remix-run/node');
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const { authentication } = require('./authentication');
const { cleanDatabase, populateDatabase } = require('./database');
const apiTasks = require('./apis/tasks');

installGlobals();

const BUILD_DIR = path.join(process.cwd(), 'build');
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(compression());
app.disable('x-powered-by');
app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }));
app.use(express.static('public', { maxAge: '1h' }));
app.use(morgan('tiny'));
app.use(cors());

// Custom scripts
cleanDatabase();
populateDatabase();
authentication(app);
apiTasks(app);

// Servidor Remix
app.all(
  '*',
  process.env.NODE_ENV === 'development' ? (req, res, next) => {
        purgeRequireCache();
        console.log('Development mode');
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
const mode = process.env.NODE_ENV;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
  console.log(`Express server running on mode ${mode}`);
});

function purgeRequireCache() {
  // purge require cache on requests for 'server side HMR' this won't let
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
