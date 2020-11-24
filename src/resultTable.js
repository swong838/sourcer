import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

import bytes from 'bytes';


const GET_POSTS = gql`
    query getPosts($term: String) {
        posts(
            term: $term
        ) {
            title
            pubDate
            size
            identifier
        }
    }
`;

const ResultTable = ({ term }) => {
    const { loading, error, data } = useQuery(
        GET_POSTS,
        { variables: { term }}
    );

    if (loading) {
        return <p>loading</p>
    }
    if (error) {
        return <p>error</p>
    }

    const items = data.posts.map(
        ({ title, pubDate, size, identifier }, index) => {
            const day = /^(\w+)/.exec(pubDate)[0];
            return (
                <tr key={identifier} className={`${day} ${!(index % 2) ? 'tinted' : ''}`}>
                    <td>
                        {pubDate}
                    </td>
                    <td>
                        <code>{bytes(size, {unit: 'GB'})}</code>
                    </td>
                    <td>
                        <a href='#' onClick={() => {console.log(identifier)}}>{title}</a>
                    </td>
                </tr>
            )
        }
    );

    return (
        <React.Fragment>
            <table><tbody>{items}</tbody></table>
        </React.Fragment>
    );
}

export default ResultTable;
