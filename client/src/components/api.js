import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:8087/api", // Use your backend instead of Piston
  });
  
  export const executeCode = async (language, sourceCode, expectedOutput = "") => {
    try {
      const response = await API.post("/coding/run", {
        code: sourceCode,
        language,
        expectedOutput,
      });
      console.log(response.data);
      return response.data.output;
    } catch (error) {
      return { error: "Error executing code via backend." };
    }
  };
  