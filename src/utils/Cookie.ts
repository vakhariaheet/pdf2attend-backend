import { Request } from "express";

export const getCookies = (req:Request) => { 
    const cookieString = req.headers.cookie;
    if(!cookieString) return undefined;
    const cookies = parseCookieString(cookieString);
    return cookies;
}

export const parseCookieString = (cookieString: string) => { 
    const cookies: {
        [key: string]: string;
    }|undefined = cookieString?.split(';').reduce((acc, cookie) => {
        const [ name, value ] = cookie.trim().split('=').map(decodeURIComponent);
        return {
            ...acc,
            [ name ]: value
        }
    }, {});
    return cookies;
}