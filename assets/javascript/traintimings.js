
// Initialize Firebase

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyArX8in8_qxgjhSAmoEw_CZfm0yFjOZSdE",
    authDomain: "traintimingsdb.firebaseapp.com",
    databaseURL: "https://traintimingsdb.firebaseio.com",
    projectId: "traintimingsdb",
    storageBucket: "traintimingsdb.appspot.com",
    messagingSenderId: "135297777309",
    appId: "1:135297777309:web:b8df020f5bf820fe0e5e74",
    measurementId: "G-SRY1QWVW6L"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();


// Initial Values
var trainName = "";
var trainDest = "";
var trainTime = "";
var trainFreq = 0;

// Capture Button Click when adding new train details
$("#add-train").on("click", function (event) {
    event.preventDefault();

    trainName = $("#name-input").val().trim();
    trainDest = $("#destination-input").val().trim();
    trainTime = $("#traintime-input").val().trim();
    trainFreq = $("#freq-input").val().trim();

    // Code for the push
    database.ref().push({

        trainName: trainName,
        trainDest: trainDest,
        trainTime: trainTime,
        trainFreq: trainFreq
    });
});

// Firebase watcher + initial loader
database.ref().on("child_added", function (childSnapshot) {

    // create local variables

    var dbtrainName = childSnapshot.val().trainName;
    var dbtrainDest = childSnapshot.val().trainDest;
    var dbTrainTime = childSnapshot.val().trainTime;
    var dbTrainFreq = childSnapshot.val().trainFreq;

    // Log everything that's coming out of snapshot
    console.log(dbtrainName);
    console.log(dbtrainDest);
    console.log(dbTrainTime);
    console.log(dbTrainFreq);

    /////////////////////Calculations //////////////////////////////
    var firstTrain = dbTrainTime;
    var tFrequency = dbTrainFreq;


    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var newNextTrain = moment(nextTrain).format("hh:mm A");

    /////////////////////Calculations //////////////////////////////
    // Create a new table row element
    var tRow = $("<tr>");

    // append values 
    var trainNameTd = $("<td>").text(childSnapshot.val().trainName);
    var trainDestTd = $("<td>").text(childSnapshot.val().trainDest);
    var trainFreqTd = $("<td>").text(childSnapshot.val().trainFreq);
    var trainNextTd = $("<td>").text(newNextTrain);
    var trainMinAwTd = $("<td>").text(tMinutesTillTrain);

    console.log(" here " + newNextTrain);

    // Append the newly created table data to the table row
    tRow.append(trainNameTd, trainDestTd, trainFreqTd, trainNextTd, trainMinAwTd);
    // Append the table row to the table body
    $("tbody").append(tRow);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);

    // trying to clear all the fields -- not working
    $("#inputForm").reset();
});

