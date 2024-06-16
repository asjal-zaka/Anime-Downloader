import axios from "axios"
import { load } from "cheerio"
import chalk from "chalk"
import inquirer from "inquirer"
import httpStatus from "http-status"

import { searchModule } from "./modules/search.js";

// Sample Code for Search Module
const query = "Naruto";
const page = 2;

const result = await searchModule(query, page)
console.log(result)