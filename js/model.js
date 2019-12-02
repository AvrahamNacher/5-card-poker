"uses strict";






/////////////////////////////////////////////////
// handles DATA
const users = [
    { name: "meir", email: "meir@gmail.com", pass: 1234},
    { name: "harold", email: "harold@gmail.com", pass: 1234},
    { name: "sally", email: "sally@gmail.com", pass: 1234},
    { name: "chip", email: "chip@gmail.com", pass: 1234},
    { name: "george", email: "george@gmail.com", pass: 1234},
];

function checkInfo(email, password) {
    let flag = false;
    let name = "";
    var result = "";
    users.forEach((user) => {
        if (user.email == email && user.pass == password) {
            flag = true;
            if (flag) {
                name  = user.name;
            }
        }
    })
    if (!flag) {
        result = "error"
    } else {
        result = name;
    }
    return result;
}

