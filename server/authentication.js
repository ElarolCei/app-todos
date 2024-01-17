const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const {findUserByIdRequired, findUserByUsernameRequired} = require('./db/users');

function authentication(app) {
    app.use(
        session({
            secret: 'changeit',
            resave: false,
            saveUninitialized: false,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        console.log('#passport.serializeUser', user);
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        console.log('#passport.deserializeUser', id);
        findUserByIdRequired(id)
            .then((user) => {
                console.log('#passport.deserializeUser.then', user);
                done(null, user);
            })
            .catch((err) => {
                console.log('#passport.deserializeUser.catch', err);
                done(err);
            });
    });

    passport.use(
        new LocalStrategy((username, password, done) => {
            console.log('#LocalStrategy', username, password);
            findUserByUsernameRequired(username)
                .then((user) => {
                    console.log('#LocalStrategy.then', user);
                    bcrypt.compare(password, user.password).then((isValid) => {
                        console.log('isValid', isValid);
                        if (!user || !isValid) {
                            return done(true);
                        }
                        return done(null, user);
                    });
                })
                .catch((err) => {
                    console.log('#LocalStrategy.catch', err);
                    done(err);
                });
        })
    );

    app.post('/login', passport.authenticate('local'), (req, res) => {
        res.status(200).send({ id: req.user.id });
    });

    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).send();
            } else {
                res.redirect('/login');
            }
        });
    });
}

module.exports = {
    authentication,
};
