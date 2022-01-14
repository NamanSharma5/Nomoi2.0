let video;
let iaNS;
let pose;
let button;
let radius = 9; // radiusOfPoseMarkers
let timer_button;

let idealShoulderL = [0, 0];
let idealShoulderR = [0, 0];
let idealNose = [0, 0];
let paused;

let sensitivity;
let min_text;
let max_text;

let timer_on;
let new_session;
let previous_session_close_second;
let previous_session_close_minute;
let reset_timer;

let tooCloseDistance = 62;

//Previous Session Scores
let faceTouchPreviousScore;
let faceMaskPreviousScore;
let postureTrackerPreviousScore;
let hydrationTrackerPreviousScore;
let screenDistancePreviousScore;
let screenTimerPreviousScore;
let ergonomicPreviousScore;
let covid19PreviousScore;
let nomoiPreviousScore;

//TBS - to be setup

//Current Session Detailed Usage Stats w/ higher frequency updates
let faceMaskWarnings = 0;
//let faceMaskWarningsIgnored = 0;  use set timeout to check - TBS

let faceTouchWarnings = 0;
// faceTouch ignored?

let postureTrackerWarnings = 0; // if low - ask to increase sensitivity
let postureTrackerPauses = 0; // if >3 inform user -- ONLY APPLICABLE IN LIVE Feedback mode - TBS

//let screenTimerWarningsIgnored = 0; - TBS
//let screenTimerLookAways = 0; // FOCUS tracking - TBS

//Current Session Stats for DB -- send to db at end + update display using setInterval
let faceTouchUsage = 0;
let faceTouchUsageStart = 0;

let faceMaskUsage = 0;
let faceMaskUsageStart = 0;

let postureTrackerUsage = 0;
let postureTrackerUsageStart = 0;

let hydrationTrackerUsage = 0;

let screenDistanceWarnings = 0;

let screenTimerUsage = 0;
let screenTimerUsageStart = 0;

//Current Session Stats for DB on CLOSE
let currentSessionLength = 0;
let currentSessionStart = 0;

//Current Session Scores
let faceTouchScore;
let faceMaskScore;
let postureTrackerScore;
let hydrationTrackerScore;
let screenDistanceScore;
let screenTimerScore;
let ergonomicScore;
let covid19Score;
let nomoiScore;

let userData;
let previousHistoryIndex;

p5.disableFriendlyErrors = true; // speeds up p5.js
function setup() {
  canvasWidth = (window.innerWidth / 1500) * 1.1 * 550;
  canvasHeight = (window.innerHeight / 900) * 1.1 * 300;

  createCanvas(canvasWidth, canvasHeight);
  video = createCapture(VIDEO);
  video.hide();

  if (localStorage.compatibleMode == 0) {
    //normal mode
    var options = {
      architecture: "MobileNetV1",
      imageScaleFactor: 0.4, // fast mode = 0.6
      outputStride: 16,
      minConfidence: 0.3,
      scoreThreshold: 0.4,
      maxPoseDetections: 3,
      detectionType: "multiple",
      multiplier: 0.75,
      quantBytes: 2, //fast mode = 4
    };
    frameRate(60);
  } else {
    var options = {
      //compatibleMode
      architecture: "MobileNetV1",
      imageScaleFactor: 0.28,
      outputStride: 16,
      minConfidence: 0.27,
      scoreThreshold: 0.4,
      inputResolution: 257, // normal =289  161, 193, 257, 289, 321, 353, 385, 417, 449, 481 & 513
      maxPoseDetections: 3,
      detectionType: "multiple",
      multiplier: 0.5,
      quantBytes: 2, //fast,newish mode = 4
    };
    console.log("compatible mode");
    //change minimum threshold for face mask prompts
    frameRate(30);
    document.getElementById("posture_slider").value = 500;
  }

  iaNS = ml5.poseNet(video, options, modelLoaded);
  iaNS.on("pose", gotPoses);
  paused = 0;

  device_time = new Date();

  timer_on = 0;
  previous_session_close_second = -50;
  previous_session_close_minute = -50;
  new_session = 0;
  session_start_second = 0;
  session_start_minute = 0;
  current_session_previous_second = 0;
  check_consecutive = true;
  reset_timer = false;

  firstName = document.getElementById("firstName").innerHTML;

  Push.create("Hi " + firstName + ". ", {
    body: "Click an icon to get started",
    timeout: 3000,
    silent: true,
    onClick: function () {
      window.focus();
      this.close();
    },
  });

  left_hand_mode = 0;
  if (localStorage.tooclosesetting == 1) {
    document.getElementById("leftHandMode").innerHTML = "Right Hand Mode";
    left_hand_mode = localStorage.leftHandMode;
  }

  too_close = 0;
  if (localStorage.tooclosesetting == 1) {
    document.getElementById("tooCloseButton").innerHTML =
      "Too Close to Screen Notifications: ON";
    document.getElementById("tooCloseButton").style.background = "#c0ffb8";
    too_close = localStorage.tooclosesetting;
  }

  talking_timer = 0;
  if (localStorage.talkingtimersetting == 1) {
    document.getElementById("voiceMessage").innerHTML =
      "Talking Timer Notification: ON";
    document.getElementById("voiceMessage").style.background = "#c0ffb8";
    talking_timer = localStorage.tooclosesetting;
  }

  // soundFormats('m4a')
  // voice_note = loadSound('voice_note_S.m4a')

  min_shoulder_confidence = 0.58;

  faceTouchActive = 0;
  faceTouchpreviousSecond = 100;
  faceTouchWarningDuration = 3;

  scaleWidth = -1;
  scaleHeight = 1;
  frameRate(60);

  maskPromptActive = 0;

  rightBoundary = 20;
  leftBoundary = canvasWidth - canvasWidth / 9.4;
  topBoundary = 15;
  bottomBoundary = canvasHeight - canvasHeight / 8.8; // this & left less useful with new small canvas
  if (canvasWidth < 475) {
    // CSS media queries
    leftBoundary = canvasWidth + 20;
  }

  if (canvasHeight < 475) {
    bottomBoundary = canvasHeight + 100;
  } else if (canvasHeight < 300) {
    bottomBoundary = canvasHeight + 150;
  }

  postureNotification = 1;
  faceMaskNotification = 1;
  tooCloseMessages = 1;
  hydrationTrackerClickLogged = 0;
  incrementScreenDistanceCheck = 1;
  //auto logout - does not work when you close the window and reroute via direct url
  //setTimeout(window.location.href = "https://www.nomoi.org.uk/logout",7200000)//2 hours in ms

  notificationModeOn = 1;
  //
  // DATA ANALYTICS
  //

  currentSessionStart = performance.now();

  $.get("/user", function (data) {
    userData = data.user;
    previousHistoryIndex = Number(userData.history.length - 1);

    if (userData.history.length == 0) {
      faceTouchPreviousScore = Number(50);
      faceMaskPreviousScore = Number(50);
      postureTrackerPreviousScore = Number(50);
      hydrationTrackerPreviousScore = Number(50);
      screenDistancePreviousScore = Number(50);
      screenTimerPreviousScore = Number(50);
      ergonomicPreviousScore = Number(50);
      covid19PreviousScore = Number(50);
      nomoiPreviousScore = Number(50);
    } else {
      faceTouchPreviousScore = Number(
        userData.history[previousHistoryIndex].faceTouchScore
      );
      faceMaskPreviousScore = Number(
        userData.history[previousHistoryIndex].faceMaskScore
      );
      postureTrackerPreviousScore = Number(
        userData.history[previousHistoryIndex].postureTrackerScore
      );
      hydrationTrackerPreviousScore = Number(
        userData.history[previousHistoryIndex].hydrationTrackerScore
      );
      screenDistancePreviousScore = Number(
        userData.history[previousHistoryIndex].screenDistanceScore
      );
      screenTimerPreviousScore = Number(
        userData.history[previousHistoryIndex].screenTimerScore
      );
      ergonomicPreviousScore = Number(
        userData.history[previousHistoryIndex].ergonomicScore
      );
      covid19PreviousScore = Number(
        userData.history[previousHistoryIndex].covid19Score
      );
      nomoiPreviousScore = Number(
        userData.history[previousHistoryIndex].nomoiScore
      );
    }

    // GOOGLE CHARTS
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      /*
       var data = google.visualization.arrayToDataTable([
       ['Year', 'Sales', 'Expenses'],
       ['2004',  1000,      400],
       ['2005',  1170,      460],
       ['2006',  660,       1120],
       ['2007',  1030,      540]
       ]);*/
      var data = new google.visualization.DataTable();
      data.addColumn("string", "Date");
      data.addColumn("number", "Nomoi Score");
      data.addColumn("number", "Ergonomic Score");
      data.addColumn("number", "Covid-19 Score");

      data.addRows(userData.history.length);
      for (j = 0; j < userData.history.length; j++) {
        data.setCell(j, 0, userData.history[j].date);
      }
      for (j = 0; j < userData.history.length; j++) {
        data.setCell(j, 1, userData.history[j].nomoiScore);
      }
      for (j = 0; j < userData.history.length; j++) {
        data.setCell(j, 2, userData.history[j].ergonomicScore);
      }
      for (j = 0; j < userData.history.length; j++) {
        data.setCell(j, 3, userData.history[j].covid19Score);
      }

      var legendSize = 13;
      var hAxisSize = 14;
      var chartAreaHeight = 70 + "%";
      if (window.innerWidth < 1100) {
        legendSize = 10;
        hAxisSize = 11.5;
      }
      if (window.innerHeight < 601) {
        chartAreaHeight = 63 + "%";
      }

      var options = {
        title: "Nomoi Log",
        titleTextStyle: {
          fontSize: 14,
        },
        curveType: "function",
        backgroundColor: { fill: "#E6EAEE", fillOpacity: "0.8" },
        chartArea: { left: 30, top: 20, width: "90%", height: chartAreaHeight },
        legend: {
          position: "bottom",
          textStyle: {
            fontSize: legendSize,
          },
        },
        hAxis: {
          textStyle: {
            fontSize: hAxisSize,
          },
        },
        vAxis: {
          textStyle: {
            fontSize: 13,
          },
        },
        lineWidth: 4,
        animation: {
          startup: true,
          duration: 3000,
          easing: "in",
        },
        tooltip: {
          trigger: "selection",
        },
      };

      var chart = new google.visualization.LineChart(
        document.getElementById("nomoiLog")
      );

      chart.draw(data, options);
    }
  });
}
function gotPoses(poses) {
  if (poses.length == 0) {
    let nose = 0;
    let eyeR = 0;
    let eyeL = 0;
    let shoulderR = 0;
    let shoulderL = 0;
    let wristR = 0;
    let wristL = 0;
    return;
  }

  if (poses.length > 0) {
    pose = poses[0].pose;
  }

  if (poses.length > 1) {
    chosenOne = 0;
    chosenOneEyeDistance = 0;
    maxChosenOneEyeDistance = 0;
    for (i = 0, pose_length = poses.length; i < pose_length; i++) {
      if (poses[i].pose.score > 0.31) {
        chosenOneEyeDistance = dist(
          poses[i].pose.leftEye.x,
          poses[i].pose.leftEye.y,
          poses[i].pose.rightEye.x,
          poses[i].pose.rightEye.y
        );
        if (chosenOneEyeDistance > maxChosenOneEyeDistance) {
          maxChosenOneEyeDistance = chosenOneEyeDistance;
          chosenOne = i;
        }
      }
    }
    pose = poses[chosenOne].pose;
  }

  nose = pose.nose;
  eyeR = pose.rightEye;
  eyeL = pose.leftEye;
  shoulderR = pose.rightShoulder;
  shoulderL = pose.leftShoulder;
  wristR = pose.rightWrist;
  wristL = pose.leftWrist;
}

function modelLoaded() {
  console.log("AI activated");
}

function twoDP(x) {
  return Number.parseFloat(x).toFixed(2);
}

function usageScore(current, start) {
  if (start == 0) {
    return -8;
  } else {
    usage = (current - start) / 60000;
    if (usage > 5) {
      if (usage < 55) {
        return twoDP(usage * (5 / 12) - 12.5);
      } else {
        return +10;
      }
    } else {
      return -10;
    }
  }
}

function warningScore(warnings) {
  if (warnings < 21) {
    return Number(-warnings + 11);
  } else {
    return -10;
  }
}

function usageWarningScore(current, start, warnings) {
  if (start == 0) {
    return -8; // can always change impact of no use
  } else {
    return twoDP(warningScore(warnings) + usageScore(current, start));
  }
}

function hydrationTrackerScoreCalculator(usage) {
  if (usage > 0) {
    if (usage < 6) {
      return usage * 3 - 3; //-6 for 2+ clicks for +ve points
    } else {
      return +10;
    }
  } else {
    return -8;
  }
}

function scoreRange(score) {
  if (score < 100 && score > 0) {
    return Number(score);
  } else {
    if (score > 99) {
      return (score = Number(95));
    }
    if (score < 1) {
      return (score = Number(5));
    }
  }
}

function draw() {
  scaleWidth = -((window.innerWidth / 1500) * 0.78); //OG 0.88
  scaleHeight = (window.innerHeight / 900) * 0.7;
  translate(canvasWidth - 125, 0);
  scale(scaleWidth, scaleHeight);
  image(video, 0, 0);
  drawLine = 1;
  noTimerDisplay = 0;

  if (pose) {
    device_time = new Date();

    nose = pose.nose;
    eyeR = pose.rightEye;
    eyeL = pose.leftEye;
    shoulderR = pose.rightShoulder;
    shoulderL = pose.leftShoulder;

    distance = dist(eyeR.x, eyeR.y, eyeL.x, eyeR.y);

    fill(5, 255, 255);
    if (
      nose.x > rightBoundary &&
      nose.x < leftBoundary &&
      nose.y < bottomBoundary
    ) {
      ellipse(nose.x, nose.y, radius);
      ellipse(eyeR.x, eyeR.y, radius);
      ellipse(eyeL.x, eyeL.y, radius);
    }

    if (
      shoulderR.x > rightBoundary &&
      shoulderR.y < bottomBoundary &&
      shoulderR.x < leftBoundary
    ) {
      ellipse(shoulderR.x, shoulderR.y, radius);
    } else {
      drawLine = 0;
    }

    if (
      shoulderL.x < leftBoundary &&
      shoulderL.y < bottomBoundary &&
      shoulderL.x > rightBoundary
    ) {
      ellipse(shoulderL.x, shoulderL.y, radius);
    } else {
      drawLine = 0;
    }

    strokeWeight(1.5);
    stroke(255);
    if (drawLine == 1) {
      line(shoulderL.x, shoulderL.y, shoulderR.x, shoulderR.y);
    }

    if (paused == 1) {
      minimum = document.getElementById("posture_slider").value;
      fill(255, 0, 0);
      ellipse(idealShoulderR.x, idealShoulderR.y, 10);
      ellipse(idealShoulderL.x, idealShoulderL.y, 10);
      ellipse(idealNose.x, idealNose.y, 10);

      if (left_hand_mode == 0) {
        if (postureNotification == 1) {
          if (
            shoulderR.y > idealShoulderR.y &&
            shoulderR.confidence > min_shoulder_confidence
          ) {
            distShoulderR = shoulderR.y - idealShoulderR.y;
            distShoulderR = distShoulderR * distShoulderR;

            if (distShoulderR > minimum) {
              if (notificationModeOn == 1) {
                Push.create("Sit Straight", {
                  tag: "Posture Warning",
                  body: "If you are not slouching, consider recalibrating",
                  timeout: 5000, //in ms
                  onClick: function () {
                    window.focus();
                    this.close;
                  },
                  silent: true,
                });
              }

              postureNotification = 0;
              setTimeout(function () {
                postureNotification = 1;
              }, 60000);

              ++postureTrackerWarnings;
            }
          }
        }
      } else {
        if (postureNotification == 1) {
          if (
            shoulderL.y > idealShoulderL.y &&
            shoulderL.confidence > min_shoulder_confidence
          ) {
            distShoulderL = shoulderL.y - idealShoulderL.y;
            distShoulderL = distShoulderL * distShoulderL;

            if (distShoulderL > minimum) {
              if (notificationModeOn == 1) {
                Push.create("Sit Straight", {
                  tag: "Posture Warning",
                  body: "If you are not slouching, consider recalibrating",
                  timeout: 5000, //in ms
                  onClick: function () {
                    window.focus();
                    this.close;
                  },
                  silent: true,
                });
              }

              postureNotification = 0;
              setTimeout(function () {
                postureNotification = 1;
              }, 60000);

              ++postureTrackerWarnings;
            }
          }
        }
      }
    }

    if (maskPromptActive == 1) {
      if (faceMaskNotification == 1) {
        if (pose.nose.confidence > 0.999) {
          Push.create("Mask Alert", {
            body: "Please put on a mask and make sure it covers your nose.",
            timeout: 4500, //in ms
            onClick: function () {
              window.focus();
              this.close;
            },
            silent: true,
          });
          ++faceMaskWarnings;

          faceMaskNotification = 0;
          setTimeout(function () {
            faceMaskNotification = 1;
          }, 30000);
        }
      }
    }

    if (faceTouchActive == 1) {
      // write some code for head tilt back -- console.log(nose.y - eyeR.y)  -- have to account for screen distance
      wristL = pose.leftWrist;
      wristR = pose.rightWrist;
      if (wristL.confidence > 0.4 || wristR.confidence > 0.4) {
        fill(5, 255, 255);
        if (wristL.y < bottomBoundary) {
          ellipse(wristL.x, wristL.y, radius);
        }
        if (wristR.y < bottomBoundary) {
          ellipse(wristR.x, wristR.y, radius);
        }
      }
      leftWristDistance = dist(wristL.x, wristL.y, nose.x, nose.y);
      rightWristDistance = dist(wristR.x, wristR.y, nose.x, nose.y);

      if (
        (leftWristDistance < 150 && wristL.confidence > 0.4) ||
        (rightWristDistance < 150 && wristR.confidence > 0.4)
      ) {
        fill(255, 125, 69);
        if (wristL.y < bottomBoundary) {
          ellipse(wristL.x, wristL.y, radius);
        }
        if (wristR.y < bottomBoundary) {
          ellipse(wristR.x, wristR.y, radius);
        }
        rect(590, 7, 22, 22, 7);

        faceTouchcurrentSecond = device_time.getSeconds();
        //faceTouchcurrentMinute = device_time.getMinutes();

        if (faceTouchpreviousSecond == 100) {
          faceTouchpreviousSecond = faceTouchcurrentSecond - 1;
          faceTouchcount = -1;
          faceTouchcountSecond = faceTouchcurrentSecond;
          faceTouchsessionLength = 0;
        }

        if (faceTouchcurrentSecond == faceTouchcountSecond) {
          faceTouchcount = faceTouchcount + 1;
        } else {
          faceTouchcountSecond = faceTouchcurrentSecond;
          faceTouchcount = 0;
        }

        if (faceTouchcount == 0) {
          if (
            abs(faceTouchcurrentSecond - faceTouchpreviousSecond) == 1 ||
            (faceTouchpreviousSecond == 59 && faceTouchcurrentSecond == 0)
          ) {
            // do I really need abs(difference)
            faceTouchsessionLength = faceTouchsessionLength + 1;
            faceTouchpreviousSecond = faceTouchcurrentSecond;
          } else {
            faceTouchsessionLength = 0;
            faceTouchpreviousSecond = faceTouchcurrentSecond;
          }
        }

        if (faceTouchsessionLength == faceTouchWarningDuration) {
          if (notificationModeOn == 1) {
            Push.create("Face Touch Alert", {
              body: "Try to keep your hands away from your face!",
              timeout: 4000, //in ms
              onClick: function () {
                window.focus();
                this.close;
              },
              silent: true,
            });
          }

          faceTouchsessionLength = 0;
          ++faceTouchWarnings;
        }
      }
    }

    if (
      distance > tooCloseDistance &&
      eyeL.confidence > 0.69 &&
      eyeR.confidence > 0.69
    ) {
      if (too_close > 0) {
        if (tooCloseMessages == 1) {
          Push.create("Too close to screen", {
            body: "You may be sitting too close to the screen",
            timeout: 4000,
          });

          tooCloseMessages = 0;
          setTimeout(function () {
            tooCloseMessages = 1;
          }, 20000);
        }
      }

      textSize(35);
      fill(214, 13, 13);
      scale(-1, 1);
      text("Too Close To The Screen", -525, 240);

      noTimerDisplay = 1;

      if (incrementScreenDistanceCheck == 1) {
        ++screenDistanceWarnings;
        incrementScreenDistanceCheck = 0;
        setTimeout(function () {
          incrementScreenDistanceCheck = 1;
        }, 120000); // increment total warnings every 2min
      }
    }

    if (timer_on > 0) {
      var current_second = device_time.getSeconds();
      var current_minute = device_time.getMinutes();

      if (distance < 22) {
        time_between_minute = abs(
          current_minute - previous_session_close_minute
        );
        time_between_second = abs(
          current_second - previous_session_close_second
        );

        if (time_between_second > 25 || time_between_minute > 1) {
          new_session = 1;
        }

        if (new_session > 0) {
          previous_session_close_minute = current_minute;
          previous_session_close_second = current_second;

          session_start_minute = current_minute;
          session_start_second = current_second;

          new_session = 0;

          check_consecutive = true;
          reset_timer = false;
        }

        session_length_second = abs(current_second - session_start_second);
        session_length_minute = abs(current_minute - session_start_minute);

        session_second_difference =
          session_length_second - current_session_previous_second;

        if (session_second_difference > 2) {
          new_session = 1;
        }

        if (session_length_second > 24) {
          reset_timer = true;
        }

        current_session_previous_second = session_length_second;
      }

      //Timer
      finish_time_minute = start_time_minute + 20;
      finish_time_second = start_time_second + 20;

      if (start_time_minute > 39) {
        finish_time_minute = 20 + start_time_minute - 60;
      }
      old_minutes_remaining = finish_time_minute - current_minute;
      if (old_minutes_remaining < 0) {
        old_minutes_remaining = 60 - current_minute + finish_time_minute;
      }

      if (start_time_second > 39) {
        finish_time_second = 20 + start_time_second - 60;
      }

      seconds_remaining = finish_time_second - current_second;
      if (seconds_remaining < 0) {
        seconds_remaining = 60 - current_second + finish_time_second;
      }

      if (seconds_remaining > 58) {
        change_minute = true;
      }
      if (seconds_remaining < 58) {
        change_minute = false;
        changed = false;
      }

      if (change_minute == true && changed == false) {
        minutes_remaining = minutes_remaining - 1;
        changed = true;
      }

      if (abs(minutes_remaining - old_minutes_remaining) > 1) {
        minutes_remaining = old_minutes_remaining;
      }

      display_time = minutes_remaining + ":" + seconds_remaining;

      if (seconds_remaining < 10) {
        display_time = minutes_remaining + ":0" + seconds_remaining;
      }

      if (minutes_remaining < 10) {
        display_time = "0" + minutes_remaining + ":" + seconds_remaining;
      }

      if (minutes_remaining < 10 && seconds_remaining < 10) {
        display_time = "0" + minutes_remaining + ":0" + seconds_remaining;
      }

      if (noTimerDisplay == 0) {
        fill(194, 255, 255);
        rect(30, 10, 82, 40, 20);
        textSize(28);
        fill(212, 49, 49);
        scale(-1, 1);
        text(display_time, -105, 38);
      }

      if (
        (minutes_remaining == 0 && seconds_remaining == 0) ||
        minutes_remaining > 21
      ) {
        Push.create("Look away from your screen for 20 seconds", {
          tag: "20 Minute Warnings",
          timeout: 8000, //in ms
          silent: true,
          onClick: function () {
            window.focus();
            this.close;
          },
        });

        start_time_minute = current_minute;
        start_time_second = current_second;

        if (talking_timer == 1) {
          voice_note.play();
        }
      }

      if (reset_timer == true) {
        // FUNCTION removed
        start_time_minute = current_minute;
        start_time_second = current_second - 10;
      }
    }
  }
}

function calibrate() {
  if (paused == 0) {
    postureTrackerUsageStart = performance.now();
  }

  if (pose) {
    document.getElementById("pausePosture").style.display = "block";
    document.getElementById("pausePosture").innerHTML = "Pause";

    if (Push.Permission.get() == "denied") {
      var newLine = "\r\n";
      var msg = "Without Notifications, Nomoi cannot work.";
      msg += newLine;
      msg += "Go to Settings -> Site Settings -> Notifications.";
      msg += newLine;
      msg +=
        "Click the 'add' button next to allow and paste https://nomoi.org.uk";
      alert(msg);
    }

    if (shoulderR.confidence > min_shoulder_confidence) {
      idealShoulderR = pose.rightShoulder;
    }
    if (shoulderL.confidence > min_shoulder_confidence) {
      idealShoulderL = pose.leftShoulder;
    }
    idealNose = pose.nose;
    paused = 1;

    document.getElementById("perfectPosture").innerHTML =
      "Recalibrate ideal posture";
    document.getElementById("perfectPosture").style.left = "17%";

    tooCloseDistance = distance + 20;
  }
}
function pausePosture() {
  if (paused == 1) {
    document.getElementById("pausePosture").innerHTML = "Start";
    paused = 0;
    postureTrackerUsage = Number.parseFloat(
      parseInt(postureTrackerUsage, 10) +
        (performance.now() - postureTrackerUsageStart) / 60000
    ).toFixed(0);
  } else {
    document.getElementById("pausePosture").innerHTML = "Pause";
    paused = 1;
    postureTrackerUsageStart = performance.now();
  }
}

function min_sensitivity() {
  document.getElementById("posture_slider").value = "200";
}

function max_sensitivity() {
  document.getElementById("posture_slider").value = "910";
}

function timer() {
  if (timer_on == 0) {
    timer_on = 1;
    document.getElementById("timer").innerHTML = "Stop 20-20-20 Timer";
    screenTimerUsageStart = performance.now();
  } else {
    timer_on = 0;
    document.getElementById("timer").innerHTML = "Start 20-20-20 Timer";
    screenTimerUsage = Number.parseFloat(
      parseInt(screenTimerUsage, 10) +
        (performance.now() - screenTimerUsageStart) / 60000
    ).toFixed(0);
  }

  start_time_minute = device_time.getMinutes();
  start_time_second = device_time.getSeconds();
  minutes_remaining = 20;
  change_minute = true;
  changed = false;
}

function openNav() {
  document.getElementById("mySidepanel").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}

function Left_Hand() {
  if (left_hand_mode == 0) {
    left_hand_mode = 1;
    localStorage.setItem("leftHandMode", "1");
    document.getElementById("leftHandMode").innerHTML = "Right Hand Mode";
  } else {
    left_hand_mode = 0;
    localStorage.setItem("leftHandMode", "0");
    document.getElementById("leftHandMode").innerHTML = "Left Hand Mode";
  }
}

function tooCloseNotifications() {
  if (too_close == 0) {
    too_close = 1;
    localStorage.setItem("tooclosesetting", "1");
    document.getElementById("tooCloseButton").innerHTML =
      "Too Close to Screen Notifications: ON";
    document.getElementById("tooCloseButton").style.background = "#c0ffb8";
  } else {
    too_close = 0;
    localStorage.setItem("tooclosesetting", "0");
    document.getElementById("tooCloseButton").innerHTML =
      "Too Close to Screen Notifications: OFF";
    document.getElementById("tooCloseButton").style.background = "#ffb8b8";
  }
}

function voiceMessage() {
  console.log("w: " + window.innerWidth);
  console.log("h: " + window.innerHeight);
  if (talking_timer == 0) {
    talking_timer = 1;
    localStorage.setItem("talkingtimersetting", "1");
    document.getElementById("voiceMessage").innerHTML =
      "Talking Timer Notification: ON";
    document.getElementById("voiceMessage").style.background = "#c0ffb8";
  } else {
    talking_timer = 0;
    localStorage.setItem("talkingtimersetting", "0");
    document.getElementById("voiceMessage").innerHTML =
      "Talking Timer Notification: OFF";
    document.getElementById("voiceMessage").style.background = "#ffb8b8";
  }
}

function fullCup() {
  clearTimeout(water_message);

  $(".water").stop();
  $(".water").animate(
    {
      height: "98%",
    },
    1000
  );

  $(".water").animate(
    {
      height: "1%",
    },
    3600000
  ); // 60 *60*1000

  var water_message;
  water_message = setTimeout(function rehydrate() {
    alert("Drink 1 glass of water (200ml)");
  }, 3600000);

  if (hydrationTrackerClickLogged == 0) {
    hydrationTrackerUsage = ++hydrationTrackerUsage;
    hydrationTrackerClickLogged = 1;
    setTimeout(function () {
      hydrationTrackerClickLogged = 0;
    }, 300000);
  }

  currentSessionLength = Number.parseFloat(
    (performance.now() - currentSessionStart) / 60000
  ).toFixed(0);
}

function faceTouch() {
  if (faceTouchActive == 0) {
    faceTouchActive = 1;
    document.getElementById("faceTouch").innerHTML = "Covid-19 FaceTouch: ON";
    document.getElementById("faceTouch").style.backgroundColor = "cffac0";
    faceTouchUsageStart = performance.now();
  } else {
    faceTouchActive = 0;
    document.getElementById("faceTouch").innerHTML = "Covid-19 FaceTouch: OFF";
    document.getElementById("faceTouch").style.backgroundColor = "fcdcdc";
    faceTouchUsage = Number.parseFloat(
      parseInt(faceTouchUsage, 10) +
        (performance.now() - faceTouchUsageStart) / 60000
    ).toFixed(0);
  }
}

function maskPrompt() {
  if (maskPromptActive == 0) {
    maskPromptActive = 1;
    document.getElementById("maskPrompt").innerHTML = "Face Mask Prompts: ON";
    document.getElementById("maskPrompt").style.backgroundColor = "cffac0";
    faceMaskUsageStart = performance.now();
  } else {
    maskPromptActive = 0;
    document.getElementById("maskPrompt").innerHTML = "Face Mask Prompts: OFF";
    document.getElementById("maskPrompt").style.backgroundColor = "fcdcdc";
    faceMaskUsage = Number.parseFloat(
      parseInt(faceMaskUsage, 10) +
        (performance.now() - faceMaskUsageStart) / 60000
    ).toFixed(0);
  }
}

window.addEventListener("resize", function (event) {
  //stndrd msoft surface = 890 by 1500

  canvasWidth = (window.innerWidth / window.screen.availWidth) * 640 * 1.2;
  //canvasHeight = window.innerHeight / 1.5
  canvasHeight = (window.innerHeight / window.screen.availHeight) * 480 * 1.2;
  // resizeCanvas(canvasWidth,canvasHeight)
  scaleWidth = -((window.innerWidth / window.screen.availWidth) * 0.88);
  //scale = (window.innerHeight/window.screen.availHeight) **2
  scaleHeight = (window.innerHeight / window.screen.availHeight) * 0.88;

  leftBoundary = canvasWidth - canvasWidth / 5.4;
  bottomBoundary = canvasHeight - canvasHeight / 8.8;

  // CSS media queries
  if (canvasWidth < 525) {
    leftBoundary = canvasWidth + 20;
  }

  if (canvasHeight < 525) {
    bottomBoundary = canvasHeight + 20;
  }

  if (canvasWidth < 400) {
    leftBoundary = canvasWidth + 50;
  }

  if (canvasHeight < 400) {
    bottomBoundary = canvasHeight + 100;
  }

  clear();
  // NEED TO FIX RANDOM SPACE TO LEFT OF SKETCH ERROR -- translation error
});

document.addEventListener("click", function () {
  clear(); // dot outside canvas removal
});

// CHANGING ICONS ON TAB CLICK
function perfectPostureTab() {
  //gradual change: www.stackoverflow.com/questions/38772442/css-transition-from-display-none-to-display-block-navigation-with-subnav/38772750

  document.getElementById("perfectPostureFullDisplay").style.display = "block";
  document.getElementById("perfectPostureIcon").style.display = "none";

  document.getElementById("timerFullDisplay").style.display = "none";
  document.getElementById("timerIcon").style.display = "block";
  document.getElementById("timerIcon").style.left = "17%";

  document.getElementById("covidFullDisplay").style.display = "none";
  document.getElementById("covidIcon").style.display = "block";
  document.getElementById("covidIcon").style.left = "27%";

  document.getElementById("glass").style.left = "38%";
}

function timerTab() {
  document.getElementById("timerFullDisplay").style.display = "block";
  document.getElementById("timerIcon").style.display = "none";

  document.getElementById("perfectPostureFullDisplay").style.display = "none";
  document.getElementById("perfectPostureIcon").style.display = "block";
  document.getElementById("perfectPostureIcon").style.right = "14%";

  document.getElementById("covidFullDisplay").style.display = "none";
  document.getElementById("covidIcon").style.display = "block";
  document.getElementById("covidIcon").style.left = "27%";

  document.getElementById("glass").style.left = "38%";
}

function fullCupTab() {
  document.getElementById("glass").style.left = "30%";

  document.getElementById("covidFullDisplay").style.display = "none";
  document.getElementById("covidIcon").style.display = "block";
  document.getElementById("covidIcon").style.left = "18%";

  document.getElementById("perfectPostureFullDisplay").style.display = "none";
  document.getElementById("perfectPostureIcon").style.display = "block";
  document.getElementById("perfectPostureIcon").style.right = "21%";

  document.getElementById("timerFullDisplay").style.display = "none";
  document.getElementById("timerIcon").style.display = "block";
  document.getElementById("timerIcon").style.left = "25%";
}

function covidTab() {
  document.getElementById("covidFullDisplay").style.display = "block";
  document.getElementById("covidIcon").style.display = "none";

  document.getElementById("timerFullDisplay").style.display = "none";
  document.getElementById("timerIcon").style.display = "block";
  document.getElementById("timerIcon").style.left = "25%";

  document.getElementById("perfectPostureFullDisplay").style.display = "none";
  document.getElementById("perfectPostureIcon").style.display = "block";
  document.getElementById("perfectPostureIcon").style.right = "21%";

  document.getElementById("glass").style.left = "46%";
}

function notificationMode() {
  if (notificationModeOn == 1) {
    notificationModeOn = 0;
    document.getElementById("notificationMode").innerText =
      "Live Notifications: OFF";
  } else {
    notificationModeOn = 1;
    document.getElementById("notificationMode").innerText =
      "Live Notifications: ON";
  }
}

setInterval(function regularUpdates() {
  currentTime = performance.now();
  faceTouchScore =
    faceTouchPreviousScore +
    Number(
      usageWarningScore(currentTime, faceTouchUsageStart, faceTouchWarnings)
    );
  faceTouchScore = scoreRange(faceTouchScore);
  faceMaskScore = faceMaskPreviousScore + warningScore(faceMaskWarnings); // do not always have to wear mask
  faceMaskScore = scoreRange(faceMaskScore - 5);
  postureTrackerScore =
    postureTrackerPreviousScore +
    Number(
      usageWarningScore(
        currentTime,
        postureTrackerUsageStart,
        postureTrackerWarnings
      )
    );
  postureTrackerScore = scoreRange(postureTrackerScore);
  screenTimerScore =
    screenTimerPreviousScore +
    Number(usageScore(currentTime, screenTimerScore));
  screenTimerScore = scoreRange(screenTimerScore);
  screenDistanceScore =
    screenDistancePreviousScore + warningScore(screenDistanceWarnings);
  screenDistanceScore = scoreRange(screenDistanceScore);

  hydrationTrackerScore =
    hydrationTrackerPreviousScore +
    hydrationTrackerScoreCalculator(hydrationTrackerUsage);
  hydrationTrackerScore = scoreRange(hydrationTrackerScore);

  ergonomicScore = Number.parseFloat(
    ergonomicPreviousScore +
      0.25 *
        (Number(
          usageWarningScore(
            currentTime,
            postureTrackerUsageStart,
            postureTrackerWarnings
          )
        ) +
          Number(usageScore(currentTime, screenTimerScore)) +
          warningScore(screenDistanceWarnings) +
          hydrationTrackerScoreCalculator(hydrationTrackerUsage))
  ).toFixed(0);
  ergonomicScore = scoreRange(ergonomicScore);
  covid19Score = Number.parseFloat(
    covid19PreviousScore +
      0.5 *
        (Number(
          usageWarningScore(currentTime, faceTouchUsageStart, faceTouchWarnings)
        ) +
          warningScore(faceMaskWarnings))
  ).toFixed(0);
  covid19Score = scoreRange(covid19Score);

  nomoiScore = Number.parseFloat(
    (Number(covid19Score) + Number(ergonomicScore)) * 0.5
  ).toFixed(0);

  /*console.log('hydration: ' + hydrationTrackerScore)
    console.log('postureTracker ' + postureTrackerScore)
    console.log('screenTimer ' + screenTimerScore)
    console.log('screenDistance ' + screenDistanceScore)
    console.log('covid19 ' + covid19Score)
    console.log('ergonomic ' + ergonomicScore)
    console.log('nomoi ' + nomoiScore) */
}, 30000);

window.addEventListener("beforeunload", function (e) {
  //e.preventDefault();
  //e.returnValue = '';

  if (userData.history.length > 3) {
    var cutHistory = {
      username: document.getElementById("userEmail").innerText,
    };
    $.ajax({
      type: "POST",
      url: "/cutDB",
      data: JSON.stringify(cutHistory),
      contentType: "application/json",
      success: function (data) {
        console.log("success: " + data);
      },
      error: function (e) {
        console.log(e);
      },
    });
  }

  currentSessionLength = Number.parseFloat(
    (performance.now() - currentSessionStart) / 60000
  ).toFixed(0);
  if (timer_on == 1) {
    screenTimerUsage = Number.parseFloat(
      parseInt(screenTimerUsage, 10) +
        (performance.now() - screenTimerUsageStart) / 60000
    ).toFixed(0);
  }

  if (paused == 1) {
    postureTrackerUsage = Number.parseFloat(
      parseInt(postureTrackerUsage, 10) +
        (performance.now() - postureTrackerUsageStart) / 60000
    ).toFixed(0);
  }

  if (faceTouchActive == 1) {
    faceTouchUsage = Number.parseFloat(
      parseInt(faceTouchUsage, 10) +
        (performance.now() - faceTouchUsageStart) / 60000
    ).toFixed(0);
  }

  if (currentSessionLength > 2) {
    var dataUpload = {
      username: document.getElementById("userEmail").innerText,
      totalMinutes: currentSessionLength,
      faceTouch_totalUse: faceTouchUsage,
      faceMask_totalUse: faceMaskUsage,
      postureTracker_totalUse: postureTrackerUsage,
      screenTimer_totalUse: screenTimerUsage,
      hydrationTracker_totalUse: hydrationTrackerUsage,

      // data for history array
      dateToday: device_time.getDate() + "/" + (device_time.getMonth() + 1),
      nomoiScoreToday: nomoiScore,
      ergonomicScoreToday: ergonomicScore,
      covid19ScoreToday: covid19Score,
      postureScoreToday: postureTrackerScore,
      screenDistanceScoreToday: screenDistanceScore,
      hydrationTrackerScoreToday: hydrationTrackerScore,
      screenTimerScoreToday: screenTimerScore,
      faceTouchScoreToday: faceTouchScore,
      faceMaskScoreToday: faceMaskScore,
    };

    $.ajax({
      type: "POST",
      url: "/updateDB",
      data: JSON.stringify(dataUpload),
      contentType: "application/json",
      success: function (data) {
        console.log("success: " + data);
      },
      error: function (e) {
        console.log(e);
      },
    });
  }
});

google.charts.load("current", { packages: ["gauge"] });
google.charts.setOnLoadCallback(drawPostureTimerGauges);
function drawPostureTimerGauges() {
  var data = google.visualization.arrayToDataTable([
    ["Label", "Value"],
    ["Posture", 55],
    ["Timer", 52],
  ]);

  /*Setting Defaults */
  var postureTimerGaugeWidth = 450;
  var postureTimerGaugeHeight = 140;

  if (window.innerHeight < 800 && window.innerHeight > 691) {
    postureTimerGaugeWidth = 400;
    postureTimerGaugeHeight = 110;
  }

  if (window.innerWidth < 1100) {
    postureTimerGaugeWidth = 370;
    postureTimerGaugeHeight = 90;
  }

  if (window.innerHeight < 601) {
    postureTimerGaugeWidth = 420;
    postureTimerGaugeHeight = 85;
  }

  var options = {
    width: postureTimerGaugeWidth,
    height: postureTimerGaugeHeight,
    redFrom: 0,
    redTo: 33,
    yellowFrom: 33,
    yellowTo: 66,
    greenFrom: 66,
    greenTo: 110,
    minorTicks: 5,
  };

  var chart = new google.visualization.Gauge(
    document.getElementById("postureTimerGauges")
  );

  chart.draw(data, options);

  setInterval(function () {
    data.setValue(0, 1, postureTrackerScore + Math.round(10 * Math.random()));
    data.setValue(1, 1, screenTimerScore + Math.round(10 * Math.random()));
    chart.draw(data, options);
  }, 30000);
}

google.charts.load("current", { packages: ["gauge"] });
google.charts.setOnLoadCallback(drawHydrationDistanceGauges);
function drawHydrationDistanceGauges() {
  var data = google.visualization.arrayToDataTable([
    ["Label", "Value"],
    ["Hydration", 60],
    ["Distance", 48],
  ]);

  var hydrationDistanceGaugeWidth = 450;
  var hydrationDistanceGaugesHeight = 140;

  if (window.innerHeight < 800 && window.innerHeight > 691) {
    hydrationDistanceGaugeWidth = 400;
    hydrationDistanceGaugesHeight = 110;
  }

  if (window.innerWidth < 1100) {
    hydrationDistanceGaugeWidth = 370;
    hydrationDistanceGaugesHeight = 90;
  }

  if (window.innerHeight < 601) {
    hydrationDistanceGaugeWidth = 420;
    hydrationDistanceGaugesHeight = 85;
  }

  var options = {
    width: hydrationDistanceGaugeWidth,
    height: hydrationDistanceGaugesHeight,
    redFrom: 0,
    redTo: 33,
    yellowFrom: 33,
    yellowTo: 66,
    greenFrom: 66,
    greenTo: 100,
    minorTicks: 5,
  };

  var chart = new google.visualization.Gauge(
    document.getElementById("hydrationDistanceGauges")
  );

  chart.draw(data, options);

  setInterval(function () {
    data.setValue(0, 1, hydrationTrackerScore);
    data.setValue(1, 1, Number(screenDistanceScore));
    chart.draw(data, options);
  }, 30000);
}

setInterval(function () {
  var columnHeight1 = faceTouchScore;
  var columnHeight2 = faceMaskScore;

  //Generic column color
  var color = "#FFEB3B";

  function columnColor(columnHeight) {
    if (columnHeight >= 90) {
      color = "#00E676";
    } else if (columnHeight < 90 && columnHeight >= 60) {
      color = "#81C784";
    } else if (columnHeight < 60 && columnHeight >= 40) {
      color = "#FFEB3B";
    } else if (columnHeight < 40 && columnHeight >= 10) {
      color = "#FF9800";
    } else if (columnHeight < 10 && columnHeight >= 0) {
      color = "#FF3D00";
    }
    return color;
  }

  $(".column1").css({ background: columnColor(columnHeight1) });
  $(".column2").css({ background: columnColor(columnHeight2) });

  $(".column1").animate({
    height: columnHeight1 + "%",
  });

  $(".column2").animate({
    height: columnHeight2 + "%",
  });

  $("#percentage1").text(faceTouchScore);
  $("#percentage2").text(faceMaskScore);
}, 30000);

/*

function handleVisibilityChange() {
    if (document.hidden) {
        Push.create('NOMOI not running!',{ 
            body: 'NOMOI stops working when you alternate tab or minimize the window. It should have its own window ideally.',
            timeout:8000, //in ms
            silent:true,
                onClick: function(){
                    window.focus();
                    this.close;
                }
            }
        )
    }  
} 
document.addEventListener("visibilitychange", handleVisibilityChange, false);*/
