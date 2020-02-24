import fetch from 'node-fetch';
import querystring from 'querystring';

require('dotenv').config();

const api = process.env.SERVERPATH;
const args = {
    'apikey': process.env.APIKEY,
    'o': 'json',
    't': 'search',
    'minsize': '209715200',
    'maxage': '10',
    'limit': '200',
};

const grab = async (term) => {
    /* 
        fetches from api
    */
    const route = `${api}?${querystring.stringify({...args, 'q': term})}`;
    return await fetch(route)
        .then(response => response.json())
        .then(payload => loader(payload))
        .catch(_ => [{title: 'no results', link: '', size: "0"}]);
}

const loader = (apiresponse) => {
    /*
        parses API response
    */
    if (!apiresponse.channel || !apiresponse.channel.item) {
        throw new Error(`couldn't parse response from endpoint`);
    }
    return apiresponse.channel.item.map(member => {
        const { title } = member;
        const link = member.link.replace(/&amp;/g, '&');
        const size = parseInt(member.enclosure['@attributes'].length, 10);
        return { title, link, size };
    });
};

export { grab, loader };
