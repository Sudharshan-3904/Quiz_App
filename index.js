const quiz_questions = [
    {
        question: "What is the Big Bang Theory?",
        type: "radio",
        options: [
            "A theory about the creation of the universe",
            "A TV show",
            "A theory about black holes",
            "A theory about the end of the universe",
        ],
        answer: "A theory about the creation of the universe",
    },
    {
        question: "What is a light year?",
        type: "dropdown",
        options: [
            "The time it takes for light to travel around the Earth",
            "The distance light travels in one year",
            "The time it takes for the Earth to orbit the Sun",
            "The distance between the Earth and the Sun",
        ],
        answer: "The distance light travels in one year",
    },
    {
        question: "Which elements are most abundant in the universe?",
        type: "checkbox",
        options: ["Oxygen", "Carbon", "Hydrogen", "Helium"],
        answer: ["Hydrogen", "Helium"],
    },
    {
        question: "What is the name of our galaxy?",
        type: "text",
        answer: "Milky Way",
    },
    {
        question: "Who proposed the theory of general relativity?",
        type: "radio",
        options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Niels Bohr"],
        answer: "Albert Einstein",
    },
    {
        question: "What is dark matter?",
        type: "dropdown",
        options: [
            "A type of black hole",
            "Invisible matter that doesn't emit light",
            "Antimatter",
            "A type of neutron star",
        ],
        answer: "Invisible matter that doesn't emit light",
    },
    {
        question: "Which of these is a type of galaxy?",
        type: "checkbox",
        options: ["Spiral", "Circular", "Elliptical", "Irregular"],
        answer: ["Spiral", "Elliptical", "Irregular"],
    },
    {
        question: "What is a black hole?",
        type: "text",
        answer: "A region of space where the gravitational pull is so strong that not even light can escape",
    },
    {
        question: "Who discovered the expanding universe?",
        type: "radio",
        options: ["Edwin Hubble", "Stephen Hawking", "Carl Sagan", "Neil deGrasse Tyson"],
        answer: "Edwin Hubble",
    },
    {
        question: "What is the cosmic microwave background radiation?",
        type: "dropdown",
        options: [
            "Radiation from stars",
            "Leftover radiation from the Big Bang",
            "Radiation from black holes",
            "Radiation from supernovae",
        ],
        answer: "Leftover radiation from the Big Bang",
    },
    {
        question: "Which theory explains the formation of the solar system and the universe ?",
        type: "checkbox",
        options: ["Steady State Theory", "Big Bang Theory", "Nebular Hypothesis", "String Theory"],
        answer: ["Nebular Hypothesis", "Big Bang Theory"],
    },
    {
        question: "What is the approximate age of the universe?",
        type: "text",
        answer: "13.8 billion years",
    },
    {
        question: "Which planet is known as the 'Red Planet'?",
        type: "radio",
        options: ["Venus", "Saturn", "Mars", "Jupiter"],
        answer: "Mars",
    },
    {
        question: "What is a supernova?",
        type: "dropdown",
        options: ["A new star forming", "The explosion of a star", "A type of black hole", "The collapse of a star"],
        answer: "The explosion of a star",
    },
    {
        question: "What is Gargantua?",
        type: "checkbox",
        options: ["A black hole", "A Measure of black hole", "Orbited by Miller and Mann", "A type of galaxy"],
        answer: ["A distant, active galactic nucleus", "Orbited by Miller and Mann"],
    },
    {
        question: "What force holds galaxies together?",
        type: "text",
        answer: "Gravity",
    },
    {
        question: "Which of these is not a type of telescope?",
        type: "radio",
        options: ["Optical", "Radio", "Infrared", "Ultrasound"],
        answer: "Ultrasound",
    },
    {
        question: "What is the main component of stars?",
        type: "dropdown",
        options: ["Helium", "Oxygen", "Carbon", "Hydrogen"],
        answer: "Hydrogen",
    },
    {
        question: "What is the event horizon of a black hole?",
        type: "checkbox",
        options: [
            "The point beyond which nothing can escape",
            "The center of the black hole",
            "The outer edge of the black hole",
            "The data layer of the black hole",
        ],
        answer: ["The point beyond which nothing can escape", "The data layer of the black hole"],
    },
    {
        question: "Who formulated the laws of planetary motion?",
        type: "text",
        answer: "Johannes Kepler",
    },
];

let questions_per_page = 5;
let user_score = 0;
let page_number = 0;
const total_question = quiz_questions.length;

async function sleep(ms) {
    await new Promise((r) => setTimeout(r, 750));
}

function isEqual(a, b) {
    return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
}

function retakeTest() {
    window.location.reload();
}

function startCountdown(duration) {
    let timer = duration,
        minutes,
        seconds;

    const countdownElement = document.getElementById("timer");

    const intervalId = setInterval(() => {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;

        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        countdownElement.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(intervalId);
            countdownElement.textContent = "Time's up!";
            timer = -1;
            end_screen();
        }
    }, 1000);
}

function clear_parent() {
    for (var i = 0; i < questions_per_page; i++) {
        let parent_div = document.getElementById(`current_answers_${i}`);
        while (parent_div.childElementCount > 0) {
            parent_div.removeChild(parent_div.lastChild);
        }
        parent_div = document.getElementById(`current_question_${i}`);
        while (parent_div.childElementCount > 0) {
            parent_div.removeChild(parent_div.lastChild);
        }
    }
}

function prevQues() {
    page_number--;
    if (page_number < 0) {
        page_number = 0;
    } else {
        show_current_question();
    }
}

function nextQues() {
    if (page_number + 1 >= Math.floor(total_question / questions_per_page)) {
        for (let ans_ind = 0; ans_ind < questions_per_page; ans_ind++) {
            checkAns(ans_ind);
        }
        end_screen();
    } else {
        for (let ans_ind = 0; ans_ind < questions_per_page; ans_ind++) {
            checkAns(ans_ind);
        }
        page_number++;
        show_current_question();
    }
}

function startQuiz() {
    startCountdown(300);
    document.getElementById("start_screen").style.display = "none";
    document.getElementById("mainBox").style.display = "block";
    show_current_question();
}

function checkAns(inp_ques) {
    let current_choice;
    let current_choices = new Array();
    let current_index = page_number * questions_per_page + inp_ques;

    if (quiz_questions[current_index]["type"] === "radio") {
        let options = document.getElementsByName(`question_answer_${inp_ques}`);
        for (let option of options) {
            if (option.checked) {
                current_choice = option.value;
            }
        }
        console.log(`ans: ${quiz_questions[current_index]["answer"]} inp: ${current_choice}`);
        if (current_choice === quiz_questions[current_index]["answer"]) {
            user_score++;
        }
    } else if (quiz_questions[current_index]["type"] === "checkbox") {
        let options = document.getElementsByName(`question_answer_${inp_ques}`);
        for (let option of options) {
            if (option.checked) {
                current_choices.push(option.value);
            }
        }
        if (isEqual(quiz_questions[current_index]["answer"], current_choices)) {
            user_score++;
        }
    } else if (quiz_questions[current_index]["type"] === "text") {
        var temp = current_index % questions_per_page;
        // current_choice = document.getElementById(`question_${current_index % questions_per_page}_answer`).value;
        current_choice = document.getElementById(`current_answers_${temp}`).firstChild.value;
        if (current_choice.toLowerCase() === quiz_questions[current_index]["answer"].toLowerCase()) {
            user_score++;
        }
    } else {
        current_choice = document.getElementById(`question_answer_${inp_ques}`).value;
        if (current_choice === quiz_questions[current_index]["answer"]) {
            user_score++;
        }
    }
}

function show_current_question() {
    if (page_number == 0) {
        document.getElementById("previous_button").style.display = "none";
    } else {
        document.getElementById("previous_button").style.display = "inline";
    }
    if (page_number + 2 == Math.floor(total_question / questions_per_page)) {
        document.getElementById("next_button").innerText = "Submit";
    } else {
        document.getElementById("next_button").innerText = "Next";
    }
    clear_parent();
    for (var z = 0; z < questions_per_page; z++) {
        let current_question = page_number * questions_per_page + z;

        document.getElementById(`current_question_${z}`).innerHTML = `${current_question + 1}. ${
            quiz_questions[current_question]["question"]
        }`;

        if (quiz_questions[current_question]["type"] === "radio") {
            for (let i = 0; i < quiz_questions[current_question]["options"].length; i++) {
                let current_option = document.createElement("input");
                current_option.setAttribute("type", "radio");
                current_option.setAttribute("name", `question_answer_${z}`);
                current_option.setAttribute("value", quiz_questions[current_question]["options"][i]);
                current_option.setAttribute("id", `option${i}`);

                let current_label = document.createElement("label");
                current_label.setAttribute("for", `option${i}`);
                current_label.innerHTML = quiz_questions[current_question]["options"][i];
                document.getElementById(`current_answers_${z}`).appendChild(current_option);
                document.getElementById(`current_answers_${z}`).appendChild(current_label);
                document.getElementById(`current_answers_${z}`).appendChild(document.createElement("br"));
            }
        } else if (quiz_questions[current_question]["type"] === "checkbox") {
            for (let i = 0; i < quiz_questions[current_question]["options"].length; i++) {
                let current_option = document.createElement("input");
                current_option.setAttribute("type", "checkbox");
                current_option.setAttribute("name", `question_answer_${z}`);
                current_option.setAttribute("value", quiz_questions[current_question]["options"][i]);
                current_option.setAttribute("id", `option${i}`);

                let current_label = document.createElement("label");
                current_label.setAttribute("for", `option${i}`);
                current_label.innerHTML = quiz_questions[current_question]["options"][i];
                document.getElementById(`current_answers_${z}`).appendChild(current_option);
                document.getElementById(`current_answers_${z}`).appendChild(current_label);
                document.getElementById(`current_answers_${z}`).appendChild(document.createElement("br"));
            }
        } else if (quiz_questions[current_question]["type"] === "text") {
            let current_option = document.createElement("input");
            tb = `question_answer_${z}`;
            current_option.setAttribute("type", "text");
            current_option.setAttribute("name", `question_answer_${z}`);
            current_option.setAttribute("id", "question_answer");
            document.getElementById(`current_answers_${z}`).appendChild(current_option);
        } else if (quiz_questions[current_question]["type"] === "dropdown") {
            let current_option = document.createElement("select");
            current_option.setAttribute("name", `question_answer_${z}`);
            current_option.setAttribute("id", `question_answer_${z}`);
            for (let i = 0; i < quiz_questions[current_question]["options"].length; i++) {
                let option = document.createElement("option");
                option.setAttribute("value", quiz_questions[current_question]["options"][i]);
                option.innerHTML = quiz_questions[current_question]["options"][i];
                current_option.appendChild(option);
            }
            document.getElementById(`current_answers_${z}`).appendChild(current_option);
        } else {
            console.log(quiz_questions[current_question]["type"]);
        }
    }

    document.getElementById(`page_counter`).innerHTML = `${page_number + 1} / ${Math.floor(
        total_question / questions_per_page
    )}`;
}

function end_screen() {
    document.getElementById("qa_container").style.display = "none";
    document.getElementById("nav").style.display = "none";
    document.getElementById("timer_container").style.display = "none";
    document.getElementById("page_counter").style.display = "none";
    document.getElementById("retake_button").style.display = "block";
    document.getElementById("end_screen").style.display = "block";
    document.getElementById("user_score").innerHTML = `Your score is ${user_score}/${total_question}`;
    document.getElementById("user_info").innerHTML = "";
}
