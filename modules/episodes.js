import axios from "axios";
import { load } from "cheerio";

const baseURL = "https://anitaku.to";
const ajax_url = "https://ajax.gogocdn.net";

import {getParams} from "./getParams.js"

export const getEpisodeList = async (id) => {
    try {
        const params = await getParams(id);
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
