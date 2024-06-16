import axios from "axios";
import { load } from "cheerio";
import httpStatus from "http-status";

const baseURL = "https://anitaku.to";
const ajax_url = "https://ajax.gogocdn.net/";

export const searchModule = async (query, page = 1) => {
    const list = []
    const searchURL = `${baseURL}/search.html?keyword=${query}&page=${page}`;
    const response = await axios.get(searchURL);
    const $ = load(response.data)
    $(".last_episodes ul.items li").each((i, _el) => {
        const $el = $(_el);
        const cover = $el.find(".img a img").attr("src");
        const title = $el.find(".name a").attr("title");
        const release = $el.find(".released").text().match(/\d+/)[0];
        list.push({
            cover,
            title,
            release
        })
    })
    return list;
}