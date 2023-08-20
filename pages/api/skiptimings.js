import AniSkip from "../../utils/aniskip";
export default function handler(req, res) {
    let { malid, epnumber, eplen } = req.query;
    const aniskip = new AniSkip({
        userId: Math.random().toString(36).substring(7),
        providerName: "gogoanime",
    });
    console.log("Requested skiptimes for: " + malid + " " + epnumber + " " + eplen);
    if (!malid || !epnumber) return res.status(400).json({ error: "Missing parameters" });
    if (!eplen) eplen = 0;
    if (isNaN(epnumber)) return res.status(400).json({ error: "epnumber must be a number" });
    aniskip.getSkipTimes(malid, epnumber, eplen).then((data) => {
        res.status(200).json(data);
    });

}
