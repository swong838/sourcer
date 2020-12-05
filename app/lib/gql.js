import { gql } from 'apollo-server';

const typeDefs = gql`
    type Post {
        title: String!
        pubDate: String!
        link: String!
        size: String!
        identifier: String!
    }

    type QueuedItem {
        identifier: String!
        status: Boolean!
    }

    type Query {
        posts(term: String): [Post!]
    }

    type Mutation {
        queuePost(identifier: String!): QueuedItem
    }
`;

const resolvers = {
    Query: {
        posts: (_, {term=''}, { dataSources }) => dataSources.postAPI.getPosts({term})
    },
    Mutation: {
        queuePost: (_, { identifier }, { dataSources }) => dataSources.grabberAPI.queue(identifier)
    }
};

export { resolvers, typeDefs };
