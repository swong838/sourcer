import { gql } from 'apollo-server';
import { PostAPI } from './sourcer';

const _cleanDate = (date) => date.match(/^(\w+), (\d+) (\w+) (\d+)/)[0];

const typeDefs = gql`
    type Post {
        title: String!
        pubDate: String!
        link: String!
        size: Int!
        identifier: String!
    }

    type Query {
        posts: [Post!]
    }
`;

const resolvers = {
    Query: {
        posts: (parent, {term=''}, { dataSources }, info) => {
            return dataSources.postAPI.getPosts({term});
        }
    }
};


export {
    resolvers,
    typeDefs,
};



/*
const loader = (apiresponse) => {
    // parses API response
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
*/

