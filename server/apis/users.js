const {
    findUserByIdRequired, createItem, findItemByIdAndUserId, deleteItem, updateItem
} = require('../db/users');

function authorized(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    if (req.user.id !== req.params.userId) {
        res.status(403).send();
        return;
    }
    next();
}

function apiUsers(app) {

    app.get('/users/:userId', authorized, (req, res) => {
        findUserByIdRequired(req.params.userId, true)
            .then((user) => {
                res.send(user);
            })
            .catch((error) => {
                res.status(400).send(error);
            });
    });

    app.get('/users/:userId/items/:itemId', (req, res) => {
        const {userId, itemId} = req.params;
        findItemByIdAndUserId(itemId, userId)
            .then((item) => {
                res.send(item);
            })
            .catch((error) => {
                res.status(400).send(error.toString());
            });
    });

    app.post('/users/:userId/items', authorized, (req, res) => {
        const item = req.body.name;
        const userId = req.params.userId;

        createItem(item, userId)
            .then((item) => {
                res.send(item);
            })
            .catch((error) => {
                res.status(400).send(error);
            });
    });

    app.put('/users/:userId/items/:itemId', (req, res) => {
        const {userId, itemId} = req.params;
        const name = req.body.name;

        updateItem(itemId, userId, name)
            .then((item) => {
                res.send(item);
            })
            .catch((error) => {
                res.status(400).send(error.toString());
            });
    });

    app.delete('/users/:userId/items/:itemId', (req, res) => {
        const {userId, itemId} = req.params;
        deleteItem(itemId, userId)
            .then((tarea) => {
                res.send(tarea);
            })
            .catch((error) => {
                res.status(400).send(error.toString());
            });
    });
}

module.exports = apiUsers;
