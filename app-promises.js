const users = [{
    id: 1,
    name: "Tara",
    schoolId: 101
}, {
    id: 2,
    name: "Chris",
    schoolId: 999
}]

const grades = [{
    id: 1,
    schoolId: 101,
    grade: 89
}, {
    id: 2,
    schoolId: 999,
    grade: 99
}, {
    id: 3,
    schoolId: 101,
    grade: 80
}];

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        const user = users.find((user) => user.id === id);

        if (user) {
            resolve(user);
        } else {
            reject(`Unable to find user with id of ${id}`);
        }
    });
};

const getGrades = (schoolId) => {
    return new Promise((resolve, reject) => {
        resolve(grades.filter((grade) => grade.schoolId === schoolId));
    });
};

//get average for a student
const getStatus = (userId) => {
    let user;
    return getUser(userId).then((tempUser) => {
        user = tempUser;
        return getGrades(user.schoolId);
    }).then((grades) => {
        let average = 0;
        if (grades.length > 0) {
            average = grades.map((grade) => grade.grade).reduce((a, b) => a + b) / grades.length; //reduce adds a+b, then that becomes a and it's added to the next array number
        };

        return `${user.name} has a ${average}% in the class.`;
    });
};

//shorter way of doing getStatus with async/await
const getStatusAlt = async (userId) => {
    const user = await getUser(userId); //await waits for a promise from getUser - if it resolves the value is set to user. if it rejects, user is never made and and error is thrown
    const grade = await getGrades(user.schoolId); //same here

    let average = 0;
    if (grades.length > 0) {
        average = grades.map((grade) => grade.grade).reduce((a, b) => a + b) / grades.length;
    };

    return `${user.name} has a ${average}% in the class.`;
};

getStatusAlt(1).then((name) => {
    console.log(name);
}).catch((e) => {
    console.log(e);
});

//NOTE: there is no top level await - must use await inside a async function

/*------- Examples below showing async only -------*/

const exampleAsyncOnly = async (userId) => { //putting the word async in there will make the function return a promise
    throw new Error("This is an error"); //this is the same things as rejecting a promise with an error
    return "Mike";
};

/*above function is the exact same things as:

()={
    return new Promise((resolve, reject)=>{
        resolve("Mike");
    });
};

*/

exampleAsyncOnly(1).then((name) => {
    console.log(name);
}).catch((e) => {
    console.log(e);
});

// getStatus(1).then((status)=>{
//     console.log(status);
// }).catch((err)=>{
//     console.log(err);
// })