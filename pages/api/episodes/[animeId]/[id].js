import { siteConfig } from '@/config/site';
import axios from 'axios';
const Handler = async (req, res) => {
    if (!req.method == "GET") return res.status(405).json({ message: "Method not allowed" })
    let { id: epNumber, animeId } = req.query; // episode number.
    if (!epNumber) return res.status(400).json({ message: "Please Specify episode Number!" });
    if (!animeId) return res.status(400).json({ message: "Please Specify anime ID!" });
    console.log(`Anime ID: ${animeId} | Episode Number: ${epNumber}`);
    let animeData;
    let epData;
    let epInfo;
    let sortedEpisodes;
    try {
        const { data } = await axios.get(siteConfig.apiUrl + '/meta/anilist/info/' + animeId + '?dub=true');
        animeData = data;
         epInfo = data.episodes.find(ep => ep.number === parseInt(epNumber));
        if (!epInfo) {
            return res.status(404).json({ message: "Episode not found!" });
        }
        console.log("Episode ID:", epInfo.id);

        const { data: ep } = await axios.get(siteConfig.apiUrl + '/meta/anilist/watch/' + epInfo.id);
        epData = ep;
    } catch (err) {
        const { data } = await axios.get(siteConfig.apiUrl + '/meta/anilist/info/' + animeId);
        animeData = data;
         epInfo = data.episodes.find(ep => ep.number === parseInt(epNumber));
        if (!epInfo) {
            return res.status(404).json({ message: "Episode not found!" });
        }
        console.log("Episode ID:", epInfo.id);

        const { data: ep } = await axios.get(siteConfig.apiUrl + '/meta/anilist/watch/' + epInfo.id).catch(e => console.log(e.toString()))
        epData = ep;
    }
    sortedEpisodes = animeData.episodes.sort((a, b) => a.number - b.number);
    res.status(200).json({ 
        animeInfo: animeData,
        episodeInfo: epInfo,
        episodeSource: epData,
        sortedEpisodes,
        dubAvailable: String(epInfo?.id).includes('dub') ? true : false
     });
}
export default Handler;