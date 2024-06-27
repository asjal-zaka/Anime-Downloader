import axios from "axios";
import { load } from "cheerio";

const baseURL = "https://anitaku.to";
const ajax_url = "https://ajax.gogocdn.net";

export const getParams = async (id) => {
    try {
        const epListPage = await axios.get(`${baseURL}/category/${id}`);
        const $ = load(await epListPage.data)
        const epMin = $("#episode_page li").first().find("a").attr("ep_start");
        const epMax = $("#episode_page li").last().find("a").attr("ep_end");
        const title = $(".anime_info_body_bg").find("h1").text();
        const movie_id = $("#movie_id").attr("value");
        const alias = $("#alias_anime").attr("value");
        return { epMax, epMin, title, movie_id, alias };
    }
    catch (err){
        console.log(err.message)
    }
}