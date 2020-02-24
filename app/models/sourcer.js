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
        fetches from API at server
    */
    return await fetch(`${api}?${querystring.stringify({...args, 'q': term})}`)
        .then(response => response.json())
        .then(payload => loader(payload));
}

const loader = apiresponse => {
    /*
        parses API response
    */
    if (!apiresponse.channel || !apiresponse.channel.item) {
       throw new Error(`can't parse response from endpoint`);
    }
    return apiresponse.channel.item.map(member => {
       const { title, description } = member;
       const link = member.link.replace(/&amp;/g, '&');
       const size = member.enclosure['@attributes'].length;
       return {title, description, link, size}
    });
};

export { grab, loader };
