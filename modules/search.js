import axios from "axios";
import { load } from "cheerio";

const baseURL = "https://anitaku.to";

export const searchModule = async (query, page = 1) => {
    const list = []
    const searchURL = `${baseURL}/search.html?keyword=${query}&page=${page}`;
    const response = await axios.get(searchURL);
    const $ = load(response.data)
    $(".last_episodes ul.items li").each((i, _el) => {
        const $el = $(_el);
        const title = $el.find(".name a").attr("title");
        const id =  $el.find(".name a").attr("href").split("/")[2];
        const release = $el.find(".released").text().match(/\d+/)[0];
        const cover = $el.find(".img a img").attr("src");
        list.push({
            title,
            id,
            release,
            cover
        })
    })
    return list;
}