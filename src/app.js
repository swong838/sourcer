import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
} from '@apollo/client';


import SearchBox from './searchBox';
import ResultTable from './resultTable';

const client = new ApolloClient({
    uri: "http://ceres:4000",
    cache: new InMemoryCache()
});


class App extends Component {

    constructor(props){
        super(props);
        this.state = { term: 'pbs' };
    }

    render() {
        return (
            <ApolloProvider client={client}>
                <SearchBox term={this.state.term} />
                <ResultTable term={this.state.term} />
            </ApolloProvider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
