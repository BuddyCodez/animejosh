interface textType {
    romaji: string,
    english: string,
    native: string,
    userPreferred: string,
}
export default function parseText(text: textType, length: number = -1) {
    // {
    //     "romaji": "Bungou Stray Dogs 5th Season",
    //         "english": "Bungo Stray Dogs 5",
    //             "native": "文豪ストレイドッグス 第5シーズン",
    //                 "userPreferred": "Bungou Stray Dogs 5th Season"
    // }
    let NewText = text?.english || text?.userPreferred;
    if (length > 0) {
        NewText = NewText.slice(0, length) + "...";
    }
    return NewText
}
function parseAllText(text: textType) {
    let arr: any = [];
    text?.romaji && arr.push(text.romaji);
    text?.english && arr.push(text.english);
    text?.native && arr.push(text.native);
    return arr.join(" / ");
}
export { parseAllText }
export type { textType }