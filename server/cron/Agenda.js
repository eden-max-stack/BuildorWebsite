// const Agenda = require("agenda");
// const { fetchStackOverflowTrending, fetchGoogleTrends } = require("../controllers/fetchDataController");
// require("dotenv").config(); // Load MongoDB URI from .env

// const mongoConnectionString = "mongodb+srv://kashyapakshada:P1JmRPpmoD7zYYyY@migrainezcluster.h5j5f.mongodb.net/";

// // Initialize Agenda
// const agenda = new Agenda({ db: { address: mongoConnectionString, collection: "agendaJobs" } });

// // Define the job
// agenda.define("update_trends", async (job, done) => {
//     console.log("⏳ Running Agenda Job: Updating Stack Overflow & Google Trends...");

//     try {
//         await fetchStackOverflowTrending();
//         await fetchGoogleTrends();
//         console.log("✅ Agenda Job completed successfully!");
//     } catch (error) {
//         console.error("❌ Agenda Job error:", error);
//     }

//     done();
// });

// // Start and schedule the job
// (async function () {
//     await agenda.start();
//     await agenda.every("48 hours", "update_trends"); // Schedule job every 48 hours
//     console.log("📅 Agenda Job Scheduled: Runs every 48 hours");
// })();

// module.exports = agenda;
