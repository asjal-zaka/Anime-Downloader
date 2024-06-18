import axios from "axios"
import { load } from "cheerio"
import chalk from "chalk"
import inquirer from "inquirer"
import httpStatus from "http-status"

import { searchModule } from "./modules/search.js";
import { getEpisodeList } from "./modules/episodes.js"
// Sample Code for Search Module
const query = "Naruto";

const searchResults = await searchModule(query)
const epList = await getEpisodeList(searchResults[2].id)
console.log(epList)