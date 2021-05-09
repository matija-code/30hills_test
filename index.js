let persons = [], SELECT = document.querySelector(".option");
let aboutHim = document.querySelector(".about");
let nameContainer = document.querySelector(".name"), infoContainer = document.querySelector(".info");


fetch('data.json').then(function (res) {
    return res.json();
}).then(function (data) {
    for (let i = 0; i < data.length; i++) {
        persons[i] = new Person(data[i].firstName, data[i].surname, data[i].age, data[i].gender, data[i].friends, data[i].id);
        SELECT.innerHTML += "<option>" + persons[i].name + " " + persons[i].surname + "</option>";
    }
    changeAbout(persons[0].name + " " + persons[0].surname);
});

function changeAbout(info) {
    let friendsList = {
        "directFriends": [],
        "fof": [],
        "suggested": []
    };
    let nameAndSurname = "", matchIndex = 0, flag = 0;
    for (let i = 0; i < persons.length; i++) {
        nameAndSurname = persons[i].name + " " + persons[i].surname;
        if (info == nameAndSurname) {
            matchIndex = i;
            break;
        }
    }
    
    friendsList.directFriends = friendsList.directFriends.concat(persons[matchIndex].friendsList);
    
    for (fofID of friendsList.directFriends) {
        for (frList of persons[fofID - 1].friendsList) {
            if (frList == persons[matchIndex].id) {
                continue;
            }
            else {
                friendsList.fof.push(frList);
            }
        }
    }

    friendsList.suggested = friendsList.suggested.concat(checkSame(friendsList.fof));
    friendsList.fof = checks(friendsList.fof);
    for (let i = 0; i < friendsList.fof.length; i++) {
        for (let j = 0; j < friendsList.directFriends.length; j++) {
            if (friendsList.fof[i] == friendsList.directFriends[j]) friendsList.fof.splice(i, 1);
        }
    }
    
    render(friendsList, matchIndex);
}

function checks(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] == array[j]) {
                array.splice(i, 1);
            }
        }
    }
    return kickKnown(array);
}

function kickKnown(array) {
    for (let i = 0; i < array.length; i++) {
        for (check of persons[array[i] - 1].friendsList) {
            nameAndSurname = persons[check - 1].name + " " + persons[check - 1].surname;
            if (nameAndSurname == SELECT.value) {
                array.splice(i, 1);
            }
        }
    }
    return array;
}

function checkSame(array) {
    let array2 = [];
    console.log(array)
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] == array[j]) {
                array2.push(array[i]);
            }
        }
    }
    return array2;
}

function render(object, ID) {
    console.log(object);
    aboutHim.innerHTML = "<p>Direct firends</p>";
    for(direct of object.directFriends){
        aboutHim.innerHTML += "<span>"+persons[direct-1].name+" "+persons[direct-1].surname+"</span>";
    }
    aboutHim.innerHTML += "<p>Friends of friends</p>";
    for(fof of object.fof){
        aboutHim.innerHTML += "<span>"+persons[fof-1].name+" "+persons[fof-1].surname+"</span>";
    }
    aboutHim.innerHTML += "<p>Suggested friends</p>";
    for(suggested of object.suggested){
        aboutHim.innerHTML += "<span>"+persons[suggested-1].name+" "+persons[suggested-1].surname+"</span>";
    }
    nameContainer.innerHTML = persons[ID].name+" "+persons[ID].surname;
    infoContainer.innerHTML = persons[ID].gender+", Age "+persons[ID].age;
}

class Person {
    constructor(NAME, SURNAME, AGE, GENDER, FRIENDS, ID) {
        this.id = ID;
        this.name = NAME;
        this.surname = SURNAME;
        this.age = AGE;
        this.gender = GENDER;
        this.friendsList = FRIENDS;
    }
}
