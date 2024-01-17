const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function authorized(req, res, next) {
    if (!req.user) {
        res.redirect("/login");
        return;
    }
    if (req.user.id !== req.params.userId) {
        res.status(403).send();
        return;
    }
    next();
}

function apiTasks(app) {
    app.get('/tareas', authorized, async (req, res) => {
        const items = await prisma.Item.findMany();
        res.status(200).send(items);
    });

    app.get('/tareas/:id', authorized, async (req, res) => {
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

    app.post('/tareas', authorized, async (req, res) => {
        const tarea = req.body.tarea;
        const newItem = await prisma.Item.create({
            data: {
                name: tarea,
                userId: '1'
            }
        });
        res.status(201).send();
    });

    app.put('/tareas/:id', authorized, async (req, res) => {
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

    app.delete('/tareas/:id', authorized, async (req, res) => {
        const id = req.params.id;
        const deletedItem = await prisma.Item.delete({
            where: {
                id: id
            }
        });
        res.status(200).send();
    });

    // Para prevenir errors de CORS
    app.options('/tareas', authorized, (req, res) => {
        res.status(200).send();
    });

    app.options('/tareas/:id', authorized, (req, res) => {
        res.status(200).send();
    });
}

module.exports = apiTasks;