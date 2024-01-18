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

async function findUserByUsername(username) {
    return prisma.user.findFirst({
        where: {
            username: username
        }
    });
}

async function findUserByUsernameRequired(username) {
    return prisma.user.findFirstOrThrow({
        where: {
            username: username
        }
    });
}

async function findUserByIdRequired(id) {
    return prisma.user.findFirstOrThrow({
        where: {
            id: id
        }
    });
}

module.exports = {
    createUser,
    findUserByIdRequired,
    findUserByUsernameRequired
}