const fs = require('fs');
const usersDir = __dirname + '/' + '../data/userDB.json';
// console.log(usersDir);



module.exports.getAllUser = (req, res, next) => {
    let users = fs.readFileSync(usersDir);
    let parsedUsers = JSON.parse(users);
    let limit = req.query.limit;
    if (limit) {
        res.send(parsedUsers.slice(0, limit))
    } else res.send(parsedUsers);
}
module.exports.getRandomUser = (req, res, next) => {
    let users = fs.readFileSync(usersDir);
    let parsedUsers = JSON.parse(users);
    const random = Math.floor(Math.random() * parsedUsers.length);
    res.send(parsedUsers[random])
}
module.exports.saveUser = (req, res, next) => {
    let users = fs.readFileSync(usersDir);
    let parsedUsers = JSON.parse(users);
    const lastId = parsedUsers[parsedUsers.length - 1].id;
    const user = req.body;
    if (user.gender && user.name && user.contact && user.address && user.photoUrl) {
        user.id = lastId + 1;
        parsedUsers.push(user);
        fs.writeFileSync(usersDir, JSON.stringify(parsedUsers))
        res.send({ message: "User Inserted Successfully" })
    } else res.send('Please Provide All the required data!')
}
module.exports.updateUser = (req, res, next) => {
    const user = req.body;
    let users = fs.readFileSync(usersDir);
    let parsedUsers = JSON.parse(users);
    const userIndex = parsedUsers.findIndex((pUser => pUser.id == user.id));
    if (userIndex !== -1) {
        Object.assign(parsedUsers[userIndex], user);
        fs.writeFileSync(usersDir, JSON.stringify(parsedUsers))
        res.send(parsedUsers[userIndex]);
    } else res.send('Wrong User ID, Provide a valid User ID')
}
module.exports.bulkUpdateUser = (req, res, next) => {
    const bulkUser = req.body;
    let users = fs.readFileSync(usersDir);
    let parsedUsers = JSON.parse(users);
    let s = 0;
    let f = 0;
    for (const user of bulkUser) {
        const userIndex = parsedUsers.findIndex((pUser => pUser.id == user.id));
        if (userIndex !== -1) {
            Object.assign(parsedUsers[userIndex], user);
            fs.writeFileSync(usersDir, JSON.stringify(parsedUsers))
            s++;
        } else f++;
    }
    res.send({ Success: s, Failed: f })
}
module.exports.deleteUser = (req, res, next) => {
    let users = fs.readFileSync(usersDir);
    let parsedUsers = JSON.parse(users);
    const { id } = req.body;
    if (id) {
        const remainingUsers = parsedUsers.filter(user => user.id !== id);
        fs.writeFileSync(usersDir, JSON.stringify(remainingUsers))
        res.send({ success: "Deleted" })
    } else {
        res.send('Wrong User ID, Provide a valid User ID')
    }
}