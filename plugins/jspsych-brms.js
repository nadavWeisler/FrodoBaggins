jsPsych.plugins["bRMS"] = (function() {
    let plugin = {};

    plugin.info = {
        name: 'bRMS',
        description: '',
        parameters: {
            visUnit: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Visual unit size',
                default: 1,
                description: "Multiplier for manual stimulus size adjustment. Should be\
         deprecated with new jspsych's native solution."
            },
            colorOpts: {
                type: jsPsych.plugins.parameterType.COMPLEX,
                pretty_name: 'Color palette',
                default: ['#FF0000', '#00FF00', '#0000FF',
                    '#FFFF00', '#FF00FF', '#00FFFF'
                ],
                description: "Colors for the Mondrian"
            },
            rectNum: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Rectangle number',
                default: 500,
                description: "Number of rectangles in Mondrian"
            },
            mondrianNum: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Mondrian number',
                default: 50,
                description: "Number of unique mondrians to create"
            },
            mondrian_max_opacity: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Mondrian maximum contrast',
                default: 1,
                description: "Maximum contrast value for the Mondrian mask."
            },
            timing_response: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Timing response',
                default: 10,
                description: "Maximum time duration allowed for response"
            },
            choices: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'Response choices',
                default: ['d', 'k']
            },
            stimulus_block: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'Stimulus Block',
                default: ""
            },
            stimulus_vertical_flip: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Vertical flip stimulus',
                default: 0,
            },
            stimulus_opacity: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Stimulus maximum opacity',
                default: 0.5
            },
            stimulus_side: {
                type: jsPsych.plugins.parameterType.INT,
                default: -1,
                description: "Stimulus side: 1 is right, 0 is left. -1 is random"
            },
            stimulus_delay: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Within plugin ITI',
                default: 0,
                description: "Duration of ITI reserved for making sure stimulus image\
                 is loaded."
            },
            stimulus_duration: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: '',
                default: 33,
                description: ""
            },
            mask_duration: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: '',
                default: 67,
                description: ""
            },
            stimulus_width: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 61,
                description: 'stimulus width constant, multiply by visUnit'
            },
            stimulus_height: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 61,
                description: 'stimulus height constant, multiply by visUnit'
            },
            fade_out_time: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Fade out time',
                default: 0,
                description: "When to start fading out mask. 0 is never."
            },
            fade_in_time: {
                type: jsPsych.plugins.parameterType.FLOAT,
                pretty_name: 'Fade in time',
                default: 0,
                description: "Duration of stimulus fade in."
            },
            fixation_visible: {
                type: jsPsych.plugins.parameterType.BOOL,
                default: true,
                description: 'Boolean to show fixation'
            },
            rectangle_width: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 6,
                description: 'rWidth constant, multiply by visUnit'
            },
            rectangle_height: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 6,
                description: 'rHeight constant, multiply by visUnit'
            },
            fixation_width: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: (25 / 3),
                description: 'fixation length constant, multiply by visUnit'
            },
            fixation_height: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 2.34,
                description: 'fixation height constant, multiply by visUnit'
            },
            frame_width: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 150,
                description: 'frame width constant, multiply by visUnit'
            },
            frame_height: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 63,
                description: 'frame height constant, multiply by visUnit'
            },
            block: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 63,
                description: 'Current trial block'
            },
            sub_block: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 63,
                description: 'Current trial sub block'
            },
            Hz: {
                type: jsPsych.plugins.parameterType.FLOAT,
                default: 60,
                description: 'stimulus fps'
            },
            background_color: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                default: "darkgray",
                description: 'Background color'
            },
            validate: {
                type: jsPsych.plugins.parameterType.BOOL,
                default: false,
                description: 'If is Test bRMS'
            },
            right_up: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'Response choices for right up',
                default: []
            },
            left_down: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'Response choices',
                default: []
            },
            validationCorrect: {
                type: jsPsych.plugins.parameterType.IMAGE,
                pretty_name: 'validation correct',
                default: undefined,
                description: 'The validation to be displayed'
            },
            validationIncorrect: {
                type: jsPsych.plugins.parameterType.IMAGE,
                pretty_name: 'validation incorrect',
                default: undefined,
                description: 'The validation to be displayed'
            },
            rms_type: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'rms type',
                default: "RMS",
                description: 'The rms type to be displayed'
            },
            validation_error_message: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'validation error message',
                default: "Error",
                description: 'The validation error message to be displayed'
            },
        }
    };

    jsPsych.pluginAPI.registerPreload('bRMS', 'stimulus', 'image');

    plugin.trial = function(display_element, trial) {
        // Clear previous
        display_element.innerHTML = '';
        display_element.style.direction = "";
        setTimeout(function() {
            // Start timing for within trial ITI
            let startCompute = Date.now();

            // Hide mouse
            document.body.style.cursor = "none";

            const div_length = document.getElementById("dpiDiv").clientHeight;
            const rectangleWidth = trial.rectangle_width * div_length;
            const rectangleHeight = trial.rectangle_height * div_length;
            const fixationWidth = trial.fixation_width * div_length;
            const fixationHeight = trial.fixation_height * div_length;
            const frameWidth = trial.frame_width * div_length;
            const frameHeight = trial.frame_height * div_length;
            const stimulusWidth = trial.stimulus_width * div_length;
            const stimulusHeight = trial.stimulus_height * div_length;

            let orientation = 'h';
            if (frameHeight > frameWidth) {
                orientation = 'v';
            }

            const stimulus_side = GetStimulusSide(trial.stimulus_side, orientation);

            // this array holds handlers from setTimeout calls
            // that need to be cleared if the trial ends early
            let setTimeoutHandlers = [];
            // store response
            let response = {
                rt: -1,
                key: -1
            };

            function isCorrect(answer) {
                if ((trial.right_up.includes(answer.toLowerCase()) || trial.right_up.includes(answer.toUpperCase())) &&
                    (stimulus_side == '0' || stimulus_side == '2')) {
                    return true;
                } else if ((trial.left_down.includes(answer.toLowerCase()) || trial.left_down.includes(answer.toUpperCase())) &&
                    (stimulus_side == '1' || stimulus_side == '3')) {
                    return true
                } else {
                    return false;
                }
            }

            const end_trial = function() {
                let keyPress = String.fromCharCode(response.key);
                if (!/^[a-zA-Z]+$/.test(keyPress)) {
                    keyPress = "-1"
                }

                if (trial.validate) {
                    display_element.innerHTML = [];
                    if (trial.validate) {
                        display_element.innerHTML += '<div>' +
                            '<img class="cpt-image" src="' + trial.validationCorrect + '"id="jspsych-cpt-validation-correct"></img>' +
                            '</div>';
                        display_element.innerHTML += '<div>' +
                            '<img class="cpt-image" src="' + trial.validationIncorrect + '"id="jspsych-cpt-validation-incorrect"></img>' +
                            '</div>';
                    }

                    if (trial.validate) {
                        display_element.querySelector('#jspsych-cpt-validation-correct').style.visibility = 'hidden';
                        display_element.querySelector('#jspsych-cpt-validation-incorrect').style.visibility = 'hidden';
                    }
                    if (isCorrect(keyPress)) {
                        document.getElementById("jspsych-cpt-validation-correct").style.visibility = "visible";
                        display_element.querySelector("#jspsych-cpt-validation-incorrect").style.visibility = 'hidden';
                    } else {
                        document.getElementById("jspsych-cpt-validation-correct").style.visibility = "hidden";
                        display_element.querySelector("#jspsych-cpt-validation-incorrect").style.visibility = 'visible';
                    }
                }

                setTimeout(function() {
                    let i;
                    // kill any remaining setTimeout handlers
                    for (i = 0; i < setTimeoutHandlers.length; i++) {
                        clearTimeout(setTimeoutHandlers[i]);
                    }

                    // kill keyboard listeners
                    jsPsych.pluginAPI.cancelAllKeyboardResponses();

                    let fullscreen = false;
                    if ((window.fullScreen) ||
                        (window.innerWidth === screen.width && window.innerHeight === screen.height)) {
                        fullscreen = true;
                    }

                    // gather the data to store for the trial
                    let trial_data = {
                        "rt": response.rt,
                        "stimulus": trial.stimulus,
                        "stimulus_block": trial.stimulus_block,
                        "stimulus_side": stimulus_side,
                        "key_press": keyPress,
                        "time_post_trial": trial.post_trial_gap,
                        "is_fullscreen": fullscreen,
                        "correct": isCorrect(keyPress),
                        "trial_began": trial_began,
                        'block': trial.block,
                        'sub_block': trial.sub_block
                    };

                    // clear the display
                    display_element.innerHTML = '';

                    // Return mouse
                    document.body.style.cursor = "pointer";

                    // move on to the next trial
                    setTimeout(function() {
                        jsPsych.finishTrial(trial_data);
                    }, 10);
                }, 300);
            };

            // function to handle responses by the subject
            let after_response = function(info) {

                // only record the first response
                if (response.key === -1) {
                    response = info;
                }
                end_trial();
            };

            //Function for start experiment
            let start_trial = function() {
                console.log("start_trial");
                if (trial.fixation_visible) {
                    fixation.style.visibility = "visible";
                } else {
                    fixation.style.visibility = "hidden";
                }

                const startTime = new Date().getTime() / 1000;
                const start_fade_out = trial.timing_response - trial.fade_out_time;
                const fade_out_time = trial.fade_out_time * 1000;
                stimulus.style.opacity = 0;
                let hidden = false;
                let changeMask = false;

                function resetMondrian() {
                    for (let i = 0; i < mondrian_list.length; i++) {
                        mondrian_list[i].style.opacity = 0;
                    }
                }

                stimulus.style.visibility = "visible";

                function rms(index = 0) {
                    stimulus.style.visibility = hidden ? "visible" : "hidden";
                    hidden = !hidden;
                    let stimulusOpacity, mondrianOpacity;
                    let current_time = ((new Date().getTime() / 1000) - startTime);

                    if (hidden) {
                        mondrianOpacity = trial.mondrian_max_opacity;
                        if (current_time > start_fade_out) {
                            mondrianOpacity = trial.mondrian_max_opacity -
                                ((current_time - start_fade_out) / fade_out_time * 1000) * trial.mondrian_max_opacity;
                        }
                        mondrian_list[index].style.opacity = mondrianOpacity;
                    } else {
                        stimulusOpacity = trial.stimulus_opacity;
                        resetMondrian();
                        if (current_time < trial.fade_in_time) {
                            stimulusOpacity = (current_time / (trial.fade_in_time)) * trial.stimulus_opacity;
                        }
                        stimulus.style.opacity = stimulusOpacity;
                    }
                    if (current_time < 10) {
                        setTimeout(function() {
                            rms(((index + 1) % mondrian_list.length))
                        }, hidden ? trial.mask_duration : trial.stimulus_duration);
                    }
                }

                const maskControl = (index = 0) => {
                    hidden = !hidden;
                    let stimulusOpacity, mondrianOpacity;
                    let current_time = ((Date.now() - startCompute) / 1000);

                    if (hidden) {
                        mondrianOpacity = trial.mondrian_max_opacity;
                        if (current_time > start_fade_out) {
                            mondrianOpacity = trial.mondrian_max_opacity -
                                ((current_time - start_fade_out) / fade_out_time * 1000) * trial.mondrian_max_opacity;
                        }
                        mondrian_list[index].style.opacity = mondrianOpacity;
                    } else {
                        stimulusOpacity = trial.stimulus_opacity;
                        resetMondrian();
                        if (current_time < trial.fade_in_time) {
                            stimulusOpacity = (current_time / (trial.fade_in_time)) * trial.stimulus_opacity;
                        }
                        stimulus.style.opacity = stimulusOpacity;
                    }
                    if (current_time < trial.timing_response) {
                        let newMaskControl = setTimeout(function() {
                            maskControl(((index + 1) % mondrian_list.length))
                        }, hidden ? trial.mask_duration : trial.stimulus_duration);
                        setTimeoutHandlers.push(newMaskControl);
                    }
                }

                if (trial.rms_type === 'RMS') {
                    rms();
                } else {
                    maskControl();
                }

                // start the response listener
                if (JSON.stringify(trial.choices) !== JSON.stringify(["none"])) {
                    let keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
                        callback_function: after_response,
                        valid_responses: trial.choices,
                        rt_method: 'performance',
                        persist: false,
                        allow_held_key: false
                    });
                }
            };

            // Make display and animation
            // end trial if time limit is set
            if (trial.timing_response > 0) {
                const t2 = setTimeout(function() {
                    end_trial();
                }, trial.timing_response * 1000);
                setTimeoutHandlers.push(t2);
            }

            // Add Fixation Canvas to display elements
            let fixation = CreateNewCanvas('fixation', 'jspsych-brms-frame',
                frameWidth, frameHeight, 3, "absolute",
                "0px double #000000", "hidden", 1);

            display_element.append(fixation);

            //Draw fixation on Fixation Canvas
            CreateFixationContext("2d", 'black', frameWidth,
                fixationWidth, frameHeight, fixationHeight, fixation);

            let stimulus_layer, mask_layer;
            if (trial.rms_type === 'RMS') {
                mask_layer = 1;
                stimulus_layer = 2;
            } else {
                mask_layer = 2;
                stimulus_layer = 1;
            }

            // Make mondrian list
            let mondrian = [];
            let mondrian_list = [];
            for (let i = 0; i < trial.mondrianNum; i++) {
                mondrian = CreateMondrian("mondrian" + i, 'jspsych-brms-frame',
                    frameWidth, frameHeight, mask_layer, "absolute",
                    "0px double #000000", 0);
                mondrian_list.push(mondrian);
                display_element.append(mondrian_list[i]);

                let ctx = CreateMondrianContext("2d", mondrian, trial.background_color,
                    0, 0, frameWidth, frameHeight);

                // Fill rect
                FillRectangles(trial.rectNum, ctx, trial.colorOpts,
                    rectangleWidth, rectangleHeight, frameWidth, frameHeight);
            }

            // Add Stimulus Canvas to display elements
            const stimulus = CreateNewCanvas('stimulus', 'jspsych-brms-frame',
                frameWidth, frameHeight, stimulus_layer, "absolute",
                "0px #000000", "visible", 0);
            display_element.append(stimulus);

            //Add border
            display_element.append(CreateNewCanvas('border', 'jspsych-brms-frame',
                frameWidth, frameHeight, 0, "absolute",
                "20px double #000000", "visible", 1));

            // Animation
            let trialLength = trial.timing_response;
            let maxFlips = trialLength * trial.Hz;
            let fade_out_flip = trial.fade_out_time * trial.Hz;
            let regularFlip = (trialLength - trial.fade_out_time) * trial.Hz;

            let trial_began = 0;

            /// Create mondrian's alpha profile
            let mondrian_profiles = CreateMondrianProfiles(maxFlips, fade_out_flip,
                regularFlip, trial.mondrian_max_opacity,
                trial.Hz, trial.fade_out_time, trial.mondrianNum,
                trial.stimulus_duration, trial.mask_duration);

            // Make into eases and add to timeline
            for (let i = 0; i < mondrian_profiles.length; i++) {
                if (mondrian_profiles[i][mondrian_profiles[i].length - 2] > 1) {
                    mondrian_profiles[i].splice(mondrian_profiles[i].length - 2, 2); //remove the last 2 points
                } else if (mondrian_profiles[i][mondrian_profiles[i].length - 2] < 1) {
                    mondrian_profiles[i].push(1, 0);
                }
            }

            //Draw stimulus on Stimulus Canvas
            CreateStimulusContext("2d", stimulus, trial.stimulus_vertical_flip,
                frameWidth, frameHeight, stimulusWidth, stimulusHeight, stimulus_side,
                trial.stimulus, start_trial(), trial.stimulus_delay, startCompute, fixationWidth);
        }, 10);
    };
    return plugin;
})();