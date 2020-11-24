import React


const QUEUE_POST = gql`
    mutation QueuePost($identifier: String!) {
        queuePost(identifier: $identifier) {
            identifier
            status
        }
    }
`;


const SearchBox = ( { term }) => {
    return (
        
    );
};

export default SearchBox;

