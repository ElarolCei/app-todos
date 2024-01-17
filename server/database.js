const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {createUser} = require('./db/users');

async function cleanDatabase() {
    const users = await prisma.user.findMany();
    for (const user of users) {
        await prisma.user.delete({where: {id: user.id}});
    }
}

async function populateDatabase() {
    await createUser('elarol', 'elarol');
    await createUser('damarur', 'damarur');
    await createUser('username', 'password');
}

module.exports = {
    cleanDatabase,
    populateDatabase
};