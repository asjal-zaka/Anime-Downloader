import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import isOnline from 'is-online';
import open from "open";

import { searchModule } from './modules/search.js';
import { getParams } from './modules/getParams.js';
import { getEpisodeList } from './modules/episodes.js';
import { getLinks, getDownload } from './modules/download.js';


const search = async () => {
    const { search } = await inquirer.prompt({
        type: "input",
        name: "search",
        message: "Enter Anime Name: ",
        validate: (value) => {
            if (value.length > 0) {
                return true;
            } else {
                return "Please enter a valid anime name.";
            }
        }
    });
    return search;
};

const page = async () => {
    const { page } = await inquirer.prompt({
        type: "input",
        name: "page",
        message: "Enter Page Number: ",
        validate: (value) => {
            if (value > 0) {
                return true;
            } else if (value == NaN){
                return "Invalid Page Number."
            } 
            else if (value < 0 || value == 0) {
                return "Page Number can't be negative or zero.";
            }
        }
    });
    return page;
};

const getResults = async (searchValue, pageValue) => {
    const searchResults = await searchModule(searchValue, pageValue);
    if (searchResults.length === 0) {
        console.log("No Results Found");
        return;
    }
    return searchResults;
};

const logResults = async () => {
    try {
        const searchValue = await search();
        const pageValue = await page();

        const spinner = ora({ text: "Searching...", spinner: "earth" }).start()
        const results = await getResults(searchValue, pageValue);
        spinner.stop()
        if(results){
            results.forEach((result, i) => {
                console.log(chalk.bold(chalk.cyan(`${i + 1} - ${result.title}[${result.id}]`)));
                console.log(chalk.yellow(`Release Date: ${result.release} \n`));
            });
        }
    } catch (err) {
        console.log("Error: " + err.message);
    }
};

const downloadSingle = async () => {
    try {
        const searchValue = await search();
        const pageValue = await page();
        const spinner = ora({ text: "Searching...", spinner: "earth" }).start()
        const results = await getResults(searchValue, pageValue);
        spinner.stop()
        if(!results) return spinner.stop();

        const { animeChoice } = await inquirer.prompt({
            type: "list",
            name: "animeChoice",
            message: "Choose Anime To Download",
            choices: results.map(result => result.title)
        });
        
        const animeID = results.find(result => result.title === animeChoice).id;
        const spinnerEp = ora({ text: "Getting Episode List...", spinner: "earth" }).start();
        const episodes = await getParams(animeID);
        spinnerEp.stop()
        const { episodeChoice } = await inquirer.prompt({
            type: "number",
            name: "episodeChoice",
            message: `Enter Episode Number To Download [${Number(episodes.epMin) + 1}-${episodes.epMax}]:`,
            validate: (value) => {
                if (value <= episodes.epMin) {
                    return `Episode Number can't be less than ${episodes.epMin}`;
                } else if (value > episodes.epMax) {
                    return `Episode Number can't be greater than ${episodes.epMax}`;
                } else if (value == NaN) {
                    return "Invalid Episode Number. Please enter a valid number.";
                } else {
                    return true;
                }
            }
        });
        const episodeID = `${animeID}-episode-${await episodeChoice}`;
        const spinnerDL = ora({ text: "Getting Download Links...", spinner: "earth" }).start();
        const getDLLink = await getLinks(episodeID);
        const getDirectLinks = await getDownload(getDLLink);
        const directLinks = getDirectLinks.anchorsHref.map((url, index) => {
            return {
              text: getDirectLinks.anchorsText[index],
              url: url
            };
          });
        spinnerDL.stop()
        if(!directLinks) return spinnerDL.stop();
        const resChoice = await inquirer.prompt({
            type: "list",
            name: "resChoice",
            message: "Choose Resolution To Download",
            choices: directLinks.map(link => link.text)
        })
        const selectedLink = directLinks.find(link => link.text === resChoice.resChoice);
        if (selectedLink) {
          open(selectedLink.url);
        } else {
          console.log('Invalid selection');
        }
    } catch (err) {
        console.log("Error: " + err.message);
    }
};

const downloadBatch = async () => {
    try{
        const searchValue = await search();
        const pageValue = await page();
        const spinner = ora({ text: "Searching...", spinner: "earth" }).start()
        const results = await getResults(searchValue, pageValue);
        spinner.start()
        if(!results) return;

        const { animeChoice } = await inquirer.prompt({
            type: "list",
            name: "animeChoice",
            message: "Choose Anime To Download",
            choices: results.map(result => result.title)
        });
        
        const animeID = results.find(result => result.title === animeChoice).id;
        const episodes = await getParams(animeID);
        const { episodeChoiceMin } = await inquirer.prompt({
            type: "number",
            name: "episodeChoiceMin",
            message: `Enter Episode Number To Start Downloading From: [${Number(episodes.epMin) + 1}-${episodes.epMax}]:`,
            validate: (value) => {
                if (value <= episodes.epMin) {
                    return `Episode Number can't be less than ${episodes.epMin}`;
                } else if (value > episodes.epMax) {
                    return `Episode Number can't be greater than ${episodes.epMax}`;
                } else if (value == NaN) {
                    return "Invalid Episode Number. Please enter a valid number.";
                } else {
                    return true;
                }
            }
        }) 
        const { episodeChoiceMax } = await inquirer.prompt({
            type: "number",
            name: "episodeChoiceMax",
            message: `Enter Episode Number To End Downloading At: [${episodeChoiceMin}-${episodes.epMax}]:`,
            validate: (value) => {
                if (value <= episodeChoiceMin) {
                    return `Episode Number can't be less than ${episodes.epMin}`;
                } else if (value > episodes.epMax) {
                    return `Episode Number can't be greater than ${episodes.epMax}`;
                } else if (value == NaN) {
                    return "Invalid Episode Number. Please enter a valid number.";
                } else {
                    return true;
                }
            }
        })
        const episodeIDs = [];
    }
    catch (err) {
        console.log("Error: " + err.message);
    }
}

const choice = async () => {
    const { choice } = await inquirer.prompt({
        type: "list",
        name: "choice",
        message: "What do you want to do?",
        choices: [
            "Search",
            "Download (Single)",
            "Download (Batch)",
            "Exit"
        ]
    });
    return choice;
};

const main = async () => {
    while (true) {
        const userChoice = await choice();

        if (userChoice === "Search") {
            await logResults();
        } else if (userChoice === "Download (Single)") {
            await downloadSingle();
        } else if (userChoice === "Exit") {
            console.log('Goodbye!');
            process.exit(0);
        }
    }
};

const checkWiFiStatus = async () => {
    try {
        const online = await isOnline();
        if (online) {
            main();
        } else {
            console.log(chalk.redBright('You are not connected to the internet... To use this CLI, Connect to the internet'));
            process.exit(0)
        }
    } catch (error) {
        console.error('Error checking internet connection:', error.message);
    }
};

checkWiFiStatus();

