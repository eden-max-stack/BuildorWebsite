const fs = require("fs");  
const path = require("path");  

const saveData = async (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, "../../misc/file1.json");
    console.log("Saving to:", filePath);

    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        res.json({ message: "Data saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error writing data to file" });
    }
};

module.exports = { saveData };