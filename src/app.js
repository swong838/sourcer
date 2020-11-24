import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
} from '@apollo/client';

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
        const returnKey = 13;
        return (
            <ApolloProvider client={client}>
                <section>
                    <input
                        type="text"
                        placeholder={this.state.term}
                        onBlur={e => {
                            this.setState({ term: e.target.value })
                        }}
                        onKeyUp={e => {
                            if (e.keyCode === returnKey) {
                                e.preventDefault();
                                this.setState({ term: e.target.value });
                            }
                        }}
                    />
                    <button>go</button>
                </section>
                <ResultTable term={this.state.term} />
            </ApolloProvider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
