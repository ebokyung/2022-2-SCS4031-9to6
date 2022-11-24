import { atom } from "recoil";

export const showSideBar = atom({
    key: "showSideBar",
    default : true,
})

export const setBookmark = atom({
    key: "setBookmark",
    default : [],
})