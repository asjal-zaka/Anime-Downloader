import axios from "axios";
import { load } from "cheerio";
import httpStatus from "http-status";

const baseURL = "https://anitaku.to";
const ajax_url = "https://ajax.gogocdn.net";

async function getParams(id) {
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
        console.log(err.name)
    }
}

export const getEpisodeList = async (id) => {
    try {
        const params = await getParams(id)
        const episodes = [];
        const epAPIPage = await axios.get(`${ajax_url}/ajax/load-list-episode?ep_start=${params.epMin}&ep_end=${params.epMax}&id=${params.movie_id}&default_ep=${params.epMin}&alias=${params.alias}`);
        const $ = load(await epAPIPage.data)
        $("#episode_related > li").each((_i, el) => {
        episodes.push({
            title: `${params.title} Episode ${
                $(el).find("a").attr("href").split("/")[1].split("-episode-")[1]
              }`,
              id: $(el).find("a").attr("href").split("/")[1],
            });
        })
        return episodes;
} catch (err) {
    console.log(err.message)
}
}