import querystring from 'querystring';

import { RESTDataSource } from 'apollo-datasource-rest';

// API configs from env
require('dotenv').config();
const apis = Object.freeze({
    source: {
        url: process.env.SOURCEPATH,
        args: {
            apikey: process.env.SOURCEKEY,
            t: 'search',    // api mode
            o: 'json',      // response format
            q: '',          // query
        },
        itemArgs: {
            apikey: process.env.SOURCEKEY,
            t: 'get',       // api mode
            o: 'file',      // response format
            id: '',         // identifier of object to retrieve
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
        term='linux',
    }) {
        console.log(`Fetching results for ${term}`);

        const GETQuery = querystring.stringify({
            ...apis.source.args,
            q: term,
        });
        const response = await this.get(`?${GETQuery}`);

        if (!response.item || !response.item.length) {
            console.log('Fetch error');
            throw new Error('No results.');
        }
        else {
            console.log(`Query for ${term} got ${response.item.length} results.`)
        }

        // sort by date, then alpha by title within date
        let entitiesByDate = new Map();
        response.item.forEach((postEntry) => {
            const post = this.entityReducer(postEntry);
            if (!post) {
                return;
            }
            let thisDate = entitiesByDate.get(post.pubDate);
            if (thisDate) {
                thisDate.push(post);
            }
            else {
                entitiesByDate.set(post.pubDate, [post]);
            }
        });
    
        let sortedEntries = [];

        // sort by title within each date
        for (let entitiesOnDate of entitiesByDate.values()) {
            entitiesOnDate.sort((first, second) => {
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
            sortedEntries.push(entitiesOnDate)
        }    
        return sortedEntries.flat();
    }

    getEntityId(entity) {
        const fieldToExtract = (entity.guid && entity.guid.text) || '';
        const identifier = /([a-f0-9]+)$/.exec(fieldToExtract);
        return (identifier && identifier[0]) || false;
    }

    entityReducer(entity) {
        // transform individual entity response from endpoint format to local schema
        const { title, pubDate, enclosure } = entity;

        const identifier = this.getEntityId(entity);
        if (!identifier) {
            return false;
        }

        return {
            title,
            pubDate: _cleanDate(pubDate),
            size: enclosure['_length'],
            identifier,
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
