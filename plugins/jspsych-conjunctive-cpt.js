/*
 * Example plugin template
 */
class Shape {
  constructor(color, shape, obj) {
    this.color = color;
    this.shape = shape;
    this.obj = obj;
  }
}

class Feedback {
  static getCorrect() {
    let img = new Image();
    img.id = 'correctImg';
    img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/White_check_mark_in_dark_green_rounded_square.svg/2048px-White_check_mark_in_dark_green_rounded_square.svg.png';
    img.style.width = '2cm';
    img.style.height = '2cm';
    img.style.paddingTop = '4cm';
    return img;
  }

  static getIncorrect() {
    let img = new Image();
    img.id = 'incorrectImg';
    img.src = 'https://w7.pngwing.com/pngs/557/438/png-transparent-error-message-icon-warning-icons-trademark-computer-window.png';
    img.style.width = '2cm';
    img.style.height = '2cm';
    img.style.paddingTop = '4cm';
    return img;
  }
}

class Shapes {
  static getSquare(width, height, color) {
    let square = document.createElement('canvas');
    square.id = "square";
    square.style.width = width + "cm";
    square.style.height = height + "cm";
    square.style.background = color;
    square.style.zIndex = 2;
    square.style.display = "none";
    return new Shape(color, "square", square);
  }

  static getCircle(width, height, color) {
    let circle = document.createElement('canvas');
    circle.id = "circle";
    circle.style.width = width + "cm";
    circle.style.height = height + "cm";
    circle.style.borderRadius = "50%";
    circle.style.background = color;
    circle.style.zIndex = 2;
    circle.style.display = "none";
    return new Shape(color, "circle", circle);
  }

  static getTriangle(width, height, color) {
    let triangle = document.createElement('canvas');
    triangle.id = "triangle";
    triangle.style.width = 0;
    triangle.style.height = 0;
    triangle.style.borderLeft = width / 2 + "cm solid transparent";
    triangle.style.borderRight = width / 2 + "cm solid transparent";
    triangle.style.borderBottom = height + "cm solid " + color;
    triangle.style.zIndex = 2;
    triangle.style.display = "none";
    return new Shape(color, "triangle", triangle);
  }

  static getTriangleDown(width, height, color) {
    let triangle = document.createElement('canvas');
    triangle.style.width = 0;
    triangle.style.height = 0;
    triangle.style.borderLeft = width / 2 + "cm solid transparent";
    triangle.style.borderRight = width / 2 + "cm solid transparent";
    triangle.style.borderTop = height + "cm solid " + color;
    triangle.style.zIndex = 2;
    triangle.style.display = "none";
    return new Shape(color, "triangle", triangle);
  }
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function getAllStimulus(trials_count, stimulus_percentage, stimulus) {
  return new Array(Math.floor(trials_count * (stimulus_percentage / 100))).fill(stimulus);
}

function getDistractors(trials_count, percentage, distractors) {
  let all_distractors = [];
  let one_distractor = [];
  for (var dis in distractors) {
    one_distractor = new Array(Math.floor(trials_count * (percentage / 100) / distractors.length)).fill(distractors[dis]);
    all_distractors.push(...one_distractor);
  }
  for (var i = 0; i < Math.abs((trials_count * (percentage / 100)) - all_distractors.length); i++) {
    all_distractors.push(distractors[i]);
  }
  return all_distractors;
}

function getAllTrials(trials_count, stimulus_percentage, stimulus, same_color_percentage, same_color_distractors, same_shape_percentage, same_shape_distractors, other_percentage, other_distractors) {
  let all_trials = getAllStimulus(trials_count, stimulus_percentage, stimulus).concat(
    getDistractors(trials_count, same_color_percentage, same_color_distractors),
    getDistractors(trials_count, same_shape_percentage, same_shape_distractors),
    getDistractors(trials_count, other_percentage, other_distractors)
  );
  return shuffle(all_trials);
}

function getAllIni(trial_count, inter_stimulus_interval_times) {
  let all_ini = [];
  for (var i = 0; i < inter_stimulus_interval_times.length; i++) {
    one_ini = new Array(Math.floor(trial_count / inter_stimulus_interval_times.length)).fill(inter_stimulus_interval_times[i]);
    all_ini.push(...one_ini);
  }
  if (all_ini.length < trial_count) {
    all_ini.push(inter_stimulus_interval_times[inter_stimulus_interval_times.length - 1]);
  }

  return shuffle(all_ini);
}

jsPsych.plugins["conjunctive-cpt"] = (function () {

  var plugin = {};

  plugin.info = {
    name: 'conjunctive-cpt',
    description: '',
    parameters: {
      visUnit: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Visual unit size',
        default: 1,
        description: "Multiplier for manual stimulus size asjustment. Should be\
           depreceated with new jsPsych's native solution."
      },
      colorOpts: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: 'Color palette',
        default: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'
        ],
        description: "Colors for the Mondrian"
      },
      timing_response: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: 'Timing response',
        default: 0,
        description: "Maximum time duration allowed for response"
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Response choices',
        default: [32]
      },
      stimulus_vertical_flip: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Vertical flip stimulus',
        default: 0,
      },
      stimulus_side: {
        type: jsPsych.plugins.parameterType.INT,
        default: -1,
        description: "Stimulus side: 1 is right, 0 is left. -1 is random"
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        default: 100,
        description: "Duration of stimulus presentation 100MS by default"
      },
      inter_stimulus_interval_times: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        default: [1000, 1500, 2000, 2500],
        description: "interval between stimuli times"
      },
      stimulus_shape: {
        type: jsPsych.plugins.parameterType.STRING,
        default: "square",
        description: "Stimulus shape: square, circle, triangle"
      },
      other_shapes: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        default: ["circle", "star"],
        description: "Other shapes to be presented"
      },
      stimulus_percentage: {
        type: jsPsych.plugins.parameterType.INT,
        default: 30,
        description: "Percentage of the screen to show stimulus"
      },
      stimulus_color: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        default: '#FF0000',
        description: "Color of the stimulus"
      },
      other_colors: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        default: ['#0000FF', '#00FF00', '#FF00FF', '#00FFFF'],
        description: "Other colors to be used"
      },
      same_color_percentage: {
        type: jsPsych.plugins.parameterType.INT,
        default: 17.5,
        description: "Percentage of the screen to show the same color"
      },
      same_shape_percentage: {
        type: jsPsych.plugins.parameterType.INT,
        default: 17.5,
        description: "Duration of the same shape presentation"
      },
      stimulus_min_height: {
        type: jsPsych.plugins.parameterType.INT,
        default: 1.4,
        description: "Minimum height of the stimulus in cm"
      },
      stimulus_max_height: {
        type: jsPsych.plugins.parameterType.INT,
        default: 1.8,
        description: "Maximum height of the stimulus in cm"
      },
      stimulus_min_width: {
        type: jsPsych.plugins.parameterType.INT,
        default: 1.8,
        description: "Minimum width of the stimulus in cm"
      },
      stimulus_max_width: {
        type: jsPsych.plugins.parameterType.INT,
        default: 1.9,
        description: "Maximum width of the stimulus in cm"
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        default: 10,
        description: "Trial duration in milliseconds"
      },
      trials_count: {
        type: jsPsych.plugins.parameterType.INT,
        default: 320,
        description: "Number of trials"
      },
      feedback: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: false,
        description: "Feedback"
      }
    }
  }

  jsPsych.pluginAPI.registerPreload('conjunctive-cpt', 'stimulus', 'image');

  plugin.trial = function (display_element, trial) {
    display_element.style.direction = "";

    let stimulus;
    let other_distractors = [];
    let same_color_distractors = [];
    let same_shape_distractors = [];
    let current_time = 0;
    switch (trial.stimulus_shape) {
      case "square":
        stimulus = Shapes.getSquare(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(Shapes.getSquare(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
      case "circle":
        stimulus = Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(Shapes.getSquare(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(Shapes.getSquare(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
      case "triangle":
        stimulus = Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(Shapes.getSquare(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(Shapes.getSquare(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
      default:
        stimulus = Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color);
        for (var i in trial.other_colors) {
          other_distractors.push(Shapes.getSquare(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          other_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
          same_shape_distractors.push(Shapes.getTriangleDown(trial.stimulus_min_width, trial.stimulus_min_height, trial.other_colors[i]));
        }
        same_color_distractors.push(Shapes.getSquare(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getCircle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        same_color_distractors.push(Shapes.getTriangle(trial.stimulus_min_width, trial.stimulus_min_height, trial.stimulus_color));
        break;
    }

    other_percentage = 100 - trial.stimulus_percentage - trial.same_shape_percentage - trial.same_color_percentage;
    const all_trials = getAllTrials(trial.trials_count, trial.stimulus_percentage, stimulus, trial.same_color_percentage, same_color_distractors, trial.same_shape_percentage, same_shape_distractors, other_percentage, other_distractors);
    const all_ini = getAllIni(all_trials.length, trial.inter_stimulus_interval_times);

    // Clear previous
    display_element.innerHTML = '';

    for (var index in all_trials) {
      display_element.append(all_trials[index].obj);
    }

    let stimulus_showed = false;
    let stimulus_click = false;

    setTimeout(function () {

      // Hide mouse
      var stylesheet = document.styleSheets[0];
      // stylesheet.insertRule("* {cursor: none;}", stylesheet.cssRules.length);

      // this array holds handlers from setTimeout calls
      // that need to be cleared if the trial ends early
      var setTimeoutHandlers = [];

      // store response
      var response = {
        rt: [],
        key: -1
      };

      const startTime = new Date().getTime() / 1000;
      let hidden = true;

      // function to end trial when it is time
      var end_trial = function () {

        // move on to the next trial
        setTimeout(function () {
          jsPsych.finishTrial();
        }, 10);
      };

      // function to handle responses by the subject
      const after_response = function (info) {
        // only record the first response
        if (response.key == -1) {
          response = info;
        }

        current_time = (new Date().getTime() / 1000) - startTime;
        const correct = currentShape.shape == trial.stimulus_shape && currentShape.color == trial.stimulus_color ? true : false;
        stimulus_click = false;
        if (correct) {
          stimulus_click = true;
          if (trial.feedback) {
            console.log('stimulus_showed CLICK', stimulus_showed);
            correctImg.style.display = "block";
            setTimeout(() => correctImg.style.display = "none", 100);
          }
        } else {
          if (trial.feedback) {
            incorrectImg.style.display = "block";
            setTimeout(() => incorrectImg.style.display = "none", 100);
          }
        }

        jsPsych.data.write({
          "current_time": current_time,
          "shape": all_trials[Math.floor(index)].shape,
          "color": all_trials[Math.floor(index)].color,
          "cpt_response": true,
          "response": info.key,
          "correct": correct
        });
      };

      const correctImg = Feedback.getCorrect();
      correctImg.style.display = "none";
      correctImg.onload = function () { };
      const incorrectImg = Feedback.getIncorrect();
      incorrectImg.style.display = "none";
      incorrectImg.onload = function () { };
      display_element.append(correctImg);
      display_element.append(incorrectImg);

      const start_trial = function () {
        // start the response listener
        if (JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
          var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: trial.choices,
            rt_method: 'performance',
            persist: true,
            allow_held_key: false
          });
        }
        try {
          ccpt();
        } catch (e) {
          console.log("Catch: " + e);
          end_trial();
        }
      };

      let currentShape;
      const is_stimulus = function () {
        if (currentShape == undefined) {
          return false;
        }
        return currentShape.shape == trial.stimulus_shape && currentShape.color == trial.stimulus_color;
      }
      function ccpt(index = 0) {
        current_time = (new Date().getTime() / 1000) - startTime;
        try {
          if (!hidden) {
            currentShape = all_trials[Math.floor(index)];

            jsPsych.data.write({
              "type": "jspsych-conjunctive-cpt",
              "current_time": current_time,
              "shape": all_trials[Math.floor(index)].shape,
              "color": all_trials[Math.floor(index)].color,
              "cpt_response": false,
            });
          } else {
            jsPsych.data.write({
              "type": "jspsych-conjunctive-cpt",
              "current_time": current_time,
              "inter_stimulus_interval_time": all_ini[Math.floor(index)],
              "inter_stimulus_interval_index": Math.floor(index),
              "cpt_response": false,
            });
          }
          let stimulus_visual = "block";
          if (stimulus_showed) {
            if (!stimulus_click) {
              if (trial.feedback) {
                incorrectImg.style.display = "block";
                stimulus_visual = "none";
                setTimeout(() => incorrectImg.style.display = "none", 100);
              }
              jsPsych.data.write({
                "type": "jspsych-conjunctive-cpt",
                "current_time": current_time,
                "shape": all_trials[Math.floor(index)].shape,
                "color": all_trials[Math.floor(index)].color,
                "stimulus_missed": true,
              });
            }
            stimulus_showed = false;
            stimulus_click = false;
          } else {
            stimulus_showed = (is_stimulus(currentShape) && trial.feedback) && stimulus_visual !== "none";
          }
          console.log('stimulus_showed CPT', stimulus_showed);
          hidden = !hidden;
          all_trials[Math.floor(index)].obj.style.display = hidden ? "none" : stimulus_visual;
          if (index < all_trials.length) {
            setTimeout(() => ccpt(index + 0.5),
              hidden ? all_ini[Math.floor(index)] : trial.stimulus_duration);
          } else {
            end_trial();
          }
        }
        catch (e) {
          console.log("Catch: " + e);
          end_trial();
        }
      }

      start_trial();
    }, 100);
  };

  return plugin;
})();
