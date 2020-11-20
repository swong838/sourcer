import { gql } from 'apollo-server';

const typeDefs = gql`
    type Post {
        title: String!
        pubDate: String!
        link: String!
        size: String!
        identifier: String!
    }

    type Query {
        posts(term: String): [Post!]
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
