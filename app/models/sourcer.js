import fetch from 'node-fetch';
import querystring from 'querystring';

require('dotenv').config();

const apis = {
    source: {
        url: process.env.SOURCEPATH,
        args: {
            apikey: process.env.SOURCEKEY,
            o: 'json',
            t: 'search',
            minsize: '209715200',
            maxage: '10',
            limit: '200',
        },
        itemArgs: {
            apikey: process.env.SOURCEKEY,
            t: 'get',
        }
    },
    sink: {
        url: process.env.SINKPATH,
        args: {
            mode: 'addurl',
            output: 'json',
            apikey: process.env.SINKKEY
        }
    }
}

const grab = async (term) => {
    /* 
        fetches from api
    */
    const route = `${apis.source.url}?${querystring.stringify({...apis.source.args, 'q': term})}`;
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
        const { title, pubDate } = member;
        const link = member.link.replace(/&amp;/g, '&');
        const size = parseInt(member.enclosure['@attributes'].length, 10);

        const identifier = member.attr[3]['@attributes'].value;

        return { title, pubDate, link, size, identifier };
    });
};

const queue = async (identifier) => {
    /*
        pushes item to next API for processing
    */

    const payload = encodeURI(`${apis.source.url}?${querystring.stringify({...apis.source.itemArgs,id: identifier})}`);
    const route = `${apis.sink.url}?${querystring.stringify({...apis.sink.args, name: payload})}`;
    return await fetch(route)
        .then(response => response.json())
};

export { grab, queue, loader };
