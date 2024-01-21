// Select random test word from array
let wordList = ["zebra", "goose", "apple", "mango", "those", "tweak", "truly"];
let randIndex = Math.floor(Math.random() * wordList.length);
let word = wordList[randIndex];
console.log(word);

let guesses = document.querySelectorAll("div");
let currentGuess = 0;
let currentLetter = 0;

// In wordle, you are always focused on the current tile
// Clicking anywhere on the page should not remove focus
// This also solves the problem of typing over previous guesses -> you can't focus
// on them, so there's no need to disable the text
let pageBody = document.querySelector("body");
pageBody.addEventListener("click", () => {
    guesses[currentGuess].children[currentLetter].focus()
});

// Disable inputs
// let inputs = document.querySelectorAll("input");
// inputs.forEach(input => input.disabled = true);


// DISPLAYING LETTERS
// Reminder: this will execute BEFORE browser displays key value
// *****************************************************************
let showLetter = (letters) => {
    letters.forEach((letter) => letter.addEventListener("keydown", (event) => {
        // Do not display pressed key, want to keep backspace functionality
        if (event.key != "Backspace") event.preventDefault();
        // If key is alpha value, display uppercase
        // Check length to ignore "Backspace", "Enter", "Shift", etc
        if (/[a-zA-Z]/.test(event.key) && event.key.length == 1) {
            letter.value = event.key.toUpperCase();
            letter.containsLetter = true; 
            letter.style.borderColor = "rgb(120, 120, 120)";
        }
    }));
};
// *****************************************************************


// MOVING TO NEXT BOX
// *****************************************************************
// Don't apply to last box
let nextBox = (letters) => {
    for (let i = 0; i < letters.length - 1; i++) {
        letters[i].addEventListener("keyup", (event) => {                   
            if (letters[i].containsLetter && event.key != "Backspace" && currentLetter < letters.length) {
                letters[++currentLetter].focus();
            }
        })
    }
};
// *****************************************************************


// HANDLING BACKSPACE
// *****************************************************************
// Backspace moves to previous box
let backspace = (letters) => {
    for (let i = 1; i < letters.length; i++) {
        letters[i].addEventListener("keydown", (event) => {
            if(event.key == "Backspace") {
                // If there is a letter in 4, 3 will get backspaced,
                // Special condition needed to handle last letter
                if (currentLetter == 4 && letters[4].containsLetter == true) {
                    // DO NOTHING. Just listen to the key press.
                }
                else {
                    while (letters[currentLetter].containsLetter == false) {
                        letters[--currentLetter].focus();
                    }
                }
                letters[currentLetter].containsLetter = false;
                letters[currentLetter].style.borderColor = "lightgray";
            }
        })
    }
};
// *****************************************************************


// GUESS SUBMISSION
// *****************************************************************
// Correct letters go green
let makeGuess = (letters) => {
    // First make a copy of word. To avoid detecting letter repeats, 
    // letters in the copy will be removed when matched
    let wordCopy = word.toUpperCase();

    // Check for exact matches
    for (let i = 0; i < 5; i++) {
        // Gray out corresponding letter key
        (document.querySelector(`#${letters[i].value}`)).className = "guessed";
        if (letters[i].value == wordCopy[i]) {
            // Make tile green
            letters[i].className = "green";
            // Remove matched letter from wordCopy
            wordCopy = wordCopy.replace(letters[i].value, "-");
            }
    }

    // If all tiles are green, end game
    if (letters.every(letter => letter.className == "green")) {
        alert(`Correct! You took ${+currentGuess + 1} guesses`);
    }

    // Now whatever letters are left are yellow
    for (let i = 0; i < 5; i++) {
        // AND clause handles single letter in correct spot when letter is 
        // repeated in word. (eg, guessing LAKES for CHEEK)
        if (wordCopy.includes(letters[i].value) && !letters[i].className) {
            letters[i].className = "yellow";
            wordCopy = wordCopy.replace(letters[i].value, "-");
        }
    }
    // Move to next row, and set up eventListeners for that row
    if (currentGuess < 5) setupRow(++currentGuess);
    else alert(`Better luck next time! Today's word was ${word}`);
};
// *****************************************************************


// INITIALISING EVENT LISTENERS FOR SINGLE ROW
// This code to be called after every guess, to ready next row
// *****************************************************************
let setupRow = (currentGuess) => {
    // Input elements from current div element
    let letters = guesses[currentGuess].children;

    // .children provides HTML collection, foreach() requires Array
    letters = Array.from(letters);

    // Focus on first letter
    currentLetter = 0;
    letters[currentLetter].focus();

    // Initialise containsLetter property
    letters.forEach((letter) => letter.containsLetter = false);

    // Call functions to addEventListeners
    showLetter(letters);
    nextBox(letters);  
    backspace(letters);  

    // Set up last letter to accept guess request
    let lastLetter = letters[letters.length - 1];
    lastLetter.addEventListener("keydown", (event) => {
        if (event.key == "Enter" && lastLetter.containsLetter == true) {
            makeGuess(letters);
        }
    });
};

setupRow(currentGuess);


// THIS CODE ALLOWS THE BUTTONS TO BE USED INSTEAD OF KEYBOARD
// *****************************************************************************
// Project for another day. All event listeners are based off of keyboard presses


