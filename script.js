$(document).ready(function () {
    var time = moment().format("h:mm:ss");
    var timeSplit = time.split(":");
    var minutesToRefresh = 59 - parseInt(timeSplit[1]);
    var secondsToRefresh = 60 - parseInt(timeSplit[2]);
    var timeToRefresh = minutesToRefresh * 60 + secondsToRefresh;
    var secondsElapsed = 0;
    var timerUntilStartReloading = setInterval(function () {
        secondsElapsed++
        if (secondsElapsed === timeToRefresh) {
            console.log(moment());
            var isReloading = confirm("It's a new hour! Would you like to reload the page?");
            if (isReloading) {
                window.location.reload(true);
            } else {
                alert("Automatic hourly reloading will no longer occur unless you reload the page.");
            }
        }
    }, 1000);
});



var timeBlockContainer = $(".container");
var todaysDateEl = $("#currentDay");

todaysDateEl.text(moment().format("dddd, MMMM Do"));

var timesArr = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];

for (var i = 1; i < timesArr.length; i++) {
    var newTimeBlockEL = $("#9AM").clone();
    newTimeBlockEL.attr("id", timesArr[i]);
    newTimeBlockEL.children(".row").attr("style", "white-space: pre-Wrap");
    newTimeBlockEL.children(".row").children(".hour").text(timesArr[i]);
    newTimeBlockEL.appendTo(".container");

};

var savedDayPlans;
var locationArr = [];

function populateSavedEvents() {
    savedDayPlans = localStorage.getItem("savedDayPlans");
    locationArr = [];
    if (savedDayPlans === null || savedDayPlans === "") {
        savedDayPlans = [];
    } else {
        savedDayPlans = JSON.parse(savedDayPlans);
        for (i = 0; i < savedDayPlans.length; i++) {
            locationArr.push(savedDayPlans[i].time);
        }
    }

    for (var i = 0; i < locationArr.length; i++) {
        var timeBlockElid = "#" + locationArr[i];
        var timeBlockEl = $(timeBlockElid).children(".row").children("textarea");
        $(timeBlockElid).children(".row").children("button").attr("data-event", "yes");
        timeBlockEl.val(savedDayPlans[i].event);
    }
}

populateSavedEvents();



function clearLocalStorage() {
    savedDayPlans = [];
    localStorage.setItem("savedDayPlans", savedDayPlans);
}


function saveEvent(time, input) {
    alert("You saved your event!");
    savedDayPlans.push({
        "time": time,
        "event": input
    });
    localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
}

function removeEvent(index) {
    locationArr.splice([index], 1);
    savedDayPlans.splice([index], 1);
}

function clearEvent(isClear, index, location, buttonEl) {
    if (isClear) {
        alert("You cleared this event");
        removeEvent(index);
        buttonEl.attr("data-event", "none");
        localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
    } else {
        location.val(savedDayPlans[index].event);
        alert("Event was not cleared");
    }
    console.log("The data-event is set to " + buttonEl.attr("data-event") + " at " + buttonEl.siblings("p").text());
}

function changeEvent(time, index, location, buttonEl, eventInput, isPopulated) {
    if (eventInput.trim() === "" && isPopulated === "yes") {
        let isSaved = confirm("At " + time + ": 'Would you like clear this event'" + savedDayPlans[index].event + "' ?");
        clearEvent(isSaved, index, location, buttonEl);
    } else if (eventInput.trim() !== "" && isPopulated === "none") {
        let isSaved = confirm("At " + time + ": 'Would you like save this event?'" + eventInput + "'?");
        if (isSaved) {
            saveEvent(time, eventInput);
        } else {
            location.val("");
        }
    } else if (eventInput.trim() !== "" && isPopulated === "yes") {
        if (savedDayPlans[index].event !== eventInput) {
            let isSaved = confirm("At " + time + ": Would you like to change the event from '" + savedDayPlans[index].event + "' to '" + eventInput + "'?");
            if (isSaved) {
                removeEvent(index);
                saveEvent(time, eventInput);
            } else {
                alert("Change was not saved.");
                location.val(savedDayPlans[index].event);
            }
        }
    }
}

$(".time-block").delegate("button", "click", function () {
    event.preventDefault();
    var eventInput = $(this).siblings("textarea").val();
    var time = $(this).siblings("p").text();
    var location = $(this).siblings("textarea");
    var isPopulated = $(this).attr("data-event");
    var index = locationArr.indexOf(time);
    var buttonEl = $(this);

    changeEvent(time, index, location, buttonEl, eventInput, isPopulated);
    populateSavedEvents();
});


var timeOfDay = moment().format("hA");

var allTimeBlockEl = $(".time-block");

for (var i = 0; i < allTimeBlockEl.length; i++) {
    var timeBlock = $(allTimeBlockEl[i]);
    var timeBlockId = timeBlock.attr("id");
    var timeBlockTextarea = timeBlock.children(".row").children("textarea");
    if (timeBlockId === timeOfDay) {
        timeBlockTextarea.addClass("present");
    } else if (moment(timeBlockId, "hA").isBefore()) {
        timeBlockTextarea.addClass("past");
    } else if (moment(timeBlockId, "hA").isAfter()) {
        timeBlockTextarea.addClass("future");
    }
}


$("#clear").on("click", function () {
    if (confirm("Are you sure you want to clear all saved events?")) {
        clearLocalStorage();
        $(".time-block").find("textarea").val("");
        $(".time-block").find("button").attr("data-event", "none");
        locationArr = [];
    }


}); 