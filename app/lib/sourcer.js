import fetch from 'node-fetch';
import querystring from 'querystring';

import { RESTDataSource } from 'apollo-datasource-rest';

// API configs from env
require('dotenv').config();
const apis = Object.freeze({
    source: {
        url: process.env.SOURCEPATH,
        args: {
            apikey: process.env.SOURCEKEY,
            o: 'json',
            t: 'search',
            minsize: '209715200',
            maxage: '100',
            limit: '400',
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
});

const _cleanDate = (date) => date.match(/^(\w+), (\d+) (\w+) (\d+)/)[0];


class PostAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = apis.source.url;
    }

    async getPosts({
        term='',
        maxage=10,
        limit=200,
    }) {
        console.log(`Fetching results for ${term}`);

        const GETQuery = querystring.stringify({
            ...apis.source.args,
            limit,
            maxage,
            q: term,
        });
        const response = await this.get(`?${GETQuery}`);

        if (!response.channel || !response.channel.item) {
            throw new Error(`couldn't parse response from endpoint`);
        }




    }

    postReducer({ title, pubDate, link, enclosure, attr }) {
        // transform Post response from endpoint format to local schema
        return {
            title: title,
            pubDate: _cleanDate(pubDate),
            link: link.replace(/&amp;/g, '&'),
            size: parseInt(enclosure['@attributes'].length, 10),
            identifier: attr[3]['@attributes'].value,
        }
    }
}


const grab = async () => {
    /* 
        fetches from api
    */
    const route = `${apis.source.url}?${querystring.stringify({...apis.source.args, 'q': term})}`;
    console.log('calling remote api')
    return await fetch(route)
        .then(response => response.json())
        .then(payload => loader(payload))
        .catch(err => {
                console.log(`++ no results ${err}`);
                return [{title: 'no results', link: '', size: "0"}];
            }
        );
}

const loader = (apiresponse) => {
    /*
        parses API response
    */
    if (!apiresponse.channel || !apiresponse.channel.item) {
        throw new Error(`couldn't parse response from endpoint`);
    }

    console.log(`***** Received ${apiresponse}`);

    // sort by date, then alpha by title within date
    let responsesByDate = new Map();
    apiresponse.channel.item.forEach((member) => {
        const { title } = member;
        const pubDate = _cleanDate(member.pubDate);
        const link = member.link.replace(/&amp;/g, '&');
        const size = parseInt(member.enclosure['@attributes'].length, 10);
        const identifier = member.attr[3]['@attributes'].value;

        const responseItem = { title, pubDate, link, size, identifier }
        let thisDate = responsesByDate.get(pubDate);
        if (thisDate) {
            thisDate.push(responseItem);
        }
        else {
            responsesByDate.set(pubDate, [responseItem]);
        }
    });

    let responses = [];

    // sort by title within each date
    for (let entriesByDate of responsesByDate.values()) {
        entriesByDate.sort((first, second) => {
            const firstTitle = first.title.toUpperCase();
            const secondTitle = second.title.toUpperCase();
            if (firstTitle < secondTitle) {
                return -1;
            }
            if (firstTitle > secondTitle) {
                return 1;
            }
            return 0;
        });
        responses.push(entriesByDate)
    }    
    return responses.flat();
};

const queue = async (identifier) => {
    /*
        pushes item to next API for processing
    */
    const payload = encodeURI(`${apis.source.url}?${querystring.stringify({...apis.source.itemArgs, id: identifier})}`);
    const route = `${apis.sink.url}?${querystring.stringify({...apis.sink.args, name: payload})}`;
    return await fetch(route)
        .then(response => response.json())
};


export { grab, queue, loader };
