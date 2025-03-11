const axios = require("axios");

async function getSupportedLanguages() {
    try {
        const response = await axios.get("https://emkc.org/api/v2/piston/runtimes");
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching runtimes:", error);
    }
}

getSupportedLanguages();
