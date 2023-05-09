// DOM elements
const btns = document.querySelectorAll("button");
const form = document.getElementById("theForm");

const sourceId_ = document.getElementById("source_value");
const destinationID_ = document.getElementById("destination_value");
const submitBtn = document.getElementById("submit-btn");

var activity = "day_vs_time";
const travel_times_daily = "./../data/travel_times_daily.json";
const xCol = "date";
const travel_times_daily_csv = "./../data/Travel_Times_Daily.csv";
const travel_time_day_of_week = "./../data/Travel_Times_day_of_week.csv";

form.addEventListener("submit", function (event) {
  event.preventDefault();
  // other form handling code here
  const destinationID = destinationID_.value;
  const sourceID = sourceId_.value;
  weekChart(travel_time_day_of_week, destinationID, sourceID);
});

btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // get selected activity
    activity = e.target.dataset.activity;

    // remove and add active class
    btns.forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");

    // // set id of input field
    // input.setAttribute("id", activity);

    // // set text of form span (the activity)
    // formAct.textContent = activity;

    // call the update function
    // update(data);
    switch (activity) {
      case "day_vs_time":
        lineChart(travel_times_daily);
        break;
      case "am_vs_pm":
        multiLineChart(travel_times_daily_csv);
        break;
      default:
        break;
    }
  });
});
