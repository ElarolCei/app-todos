const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function createUser(username, password) {
    const foundUser = await findUserByUsername(username);
    if (!foundUser) {
        console.log('Creating user "' + username + '"');
        await prisma.user.create({
            data: {
                username: username,
                password: await hashPassword(password)
            }
        })
    }
}

function findUserByUsername(username) {
    return prisma.user.findFirst({
        where: {
            username: username
        }
    });
}

function findUserByUsernameRequired(username) {
    return prisma.user.findFirstOrThrow({
        where: {
            username: username
        }
    });
}

function findUserByIdRequired(id, includeItems = false) {
    return prisma.user.findFirstOrThrow({
        where: {
            id: id
        },
        include: {
            items: includeItems,
        }
    });
}

function createItem(name, userId) {
    return prisma.item.create({
        data: {
            name: name,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
    });
}

async function findItemByIdAndUserId(itemId, userId) {
    const item = await prisma.item.findUnique({
        where: {
            id: itemId,
        },
        include: {
            user: true,
        },
    });
    if (item === null) {
        throw new Error("La tarea no existe");
    }
    if (item.userId !== userId) {
        throw new Error("La tarea no pertenece al usuario.");
    }
    return item;
}

async function updateItem(itemId, userId, name) {
    await findItemByIdAndUserId(itemId, userId);
    return prisma.item.update({
        where: {
            id: itemId,
        },
        data: {
            name: name,
        },
    });
}

async function deleteItem(itemId, userId) {
    await findItemByIdAndUserId(itemId, userId);
    return prisma.item.delete({
        where: {
            id: itemId,
        },
    });
}

module.exports = {
    createUser,
    findUserByIdRequired,
    findUserByUsernameRequired,
    createItem,
    deleteItem,
    findItemByIdAndUserId,
    updateItem
}