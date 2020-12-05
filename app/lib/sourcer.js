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

    /**
     * Manages lookups against the post source API
     */

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

        // sort by date, then alpha by title within date
        let responsesByDate = new Map();
        response.channel.item.forEach((postEntry) => {
            const post = this.postReducer(postEntry);
            let thisDate = responsesByDate.get(post.pubDate);
            if (thisDate) {
                thisDate.push(post);
            }
            else {
                responsesByDate.set(post.pubDate, [post]);
            }
        });
    
        let sortedPosts = [];

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
            sortedPosts.push(entriesByDate)
        }    
        return sortedPosts.flat();
    }

    postReducer({ title, pubDate, link, enclosure, attr }) {
        // transform Post response from endpoint format to local schema
        return {
            title: title,
            pubDate: _cleanDate(pubDate),
            link: link.replace(/&amp;/g, '&'),
            size: enclosure['@attributes'].length,
            identifier: attr[3]['@attributes'].value,
        }
    }
}

class GrabberAPI extends RESTDataSource {

    /**
     * Manages jobs on the destination (sink) API
     */

    constructor() {
        super();
        this.baseURL = apis.sink.url;
    }

    async queue (identifier) {
        const name = encodeURI(`${apis.source.url}?${querystring.stringify({...apis.source.itemArgs, id: identifier})}`);
        const queueResponse = await this.get('', { ...apis.sink.args, name });
        return { identifier, status: queueResponse.status };
    }

};

export { PostAPI, GrabberAPI };
