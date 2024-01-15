const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", async () => {
    // Disable the button during the fetch operation
    btn.disabled = true;

    try {
        let inpWord = document.getElementById("inp-word").value.trim();
        if (inpWord) {
            const response = await fetch(`${url}${inpWord}`);

            if (!response.ok) {
                throw new Error("Couldn't find the word");
            }

            const data = await response.json();

            // Check if the data contains the necessary information
            if (data[0] && data[0].phonetics && data[0].phonetics[0] && data[0].phonetics[0].audio) {
                result.innerHTML = `
        <div class="word">
            <h3>${inpWord}</h3>
            <button onclick="playSound()">
                <i class="fas fa-volume-up"></i>
            </button>
        </div>
        <div class="details">
            <p>${data[0].meanings[0].partOfSpeech}</p>
            <p>/${data[0].phonetic}/</p>
        </div>
        <p class="word-meaning">
            ${data[0].meanings[0].definitions[0].definition}
        </p>
        <p class="word-example">
            ${data[0].meanings[0].definitions[0].example || ""}
        </p>`;

                // Set the source URL for the audio element with the correct protocol
                sound.setAttribute("src", `${data[0].phonetics[0].audio.replace(/^\/\//, '/')}`);
            } else {
                throw new Error("Audio source not found in the data");
            }

            // ... (remaining code)

        } else {
            result.innerHTML = `<h3 class="error">Please enter a word</h3>`;
        }
    } catch (error) {
        console.error(error);
        result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
    } finally {
        // Enable the button, regardless of success or failure
        btn.disabled = false;
    }
});

async function playSound() {
    try {
        // Check if the audio element has a valid source
        if (sound.src) {
            await sound.play();
        } else {
            throw new Error("Audio source not set");
        }
    } catch (error) {
        console.error("Error playing sound:", error);
    }
}