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
        this.state = {term: 'pbs'};
    }

    // relay selection to local app
    toQueue = identifier => {
        return async (event) => {
            event.preventDefault();
            // call local app API
            const result = await fetch('/push', {
                method: 'POST',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({identifier})
            });
            return await result.json();
        }
    }

    render() {
        return (
            <ApolloProvider client={client}>
                <section>
                    <input type="text" placeholder="search" onBlur={e => {
                        this.setState({
                            term: e.target.value
                        });
                    }} />
                    <button>go</button>
                </section>
                <ResultTable term={this.state.term} />
            </ApolloProvider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
