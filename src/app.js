import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import bytes from 'bytes';



class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            results: []
        }
    }

    // hit remote API on page load
    componentDidMount(){
        this.refresh();
    }

    // fetch from remote API
    refresh(term='KTR'){
        fetch(`/search/${term}`)
            .then(response => response.json())
            .then(json => {
                console.log(`===== Received ${json}`);
                this.setState({results: json});
            );
    }

    // redo remote API search
    search = event => this.refresh(event.target.value)

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

    render(){
        // each row
        const items = this.state.results.map(
            (item, index) => {
                const { title, pubDate, size, identifier } = item;

                const day = /^(\w+)/.exec(pubDate)[0];


                return (
                    <tr key={`item_${index}`} className={`${day} ${!(index % 2) ? 'tinted' : ''}`}>
                        <td>
                            {pubDate}
                        </td>
                        <td>
                            <code>{bytes(size, {unit: 'GB'})}</code>
                        </td>
                        <td>
                            <a href='#' onClick={this.toQueue(identifier)}>{title}</a>
                        </td>
                    </tr>
                )
            }
        );

        // full table
        return (
            <React.Fragment>
                <section>
                    <input type="text" placeholder="search" onBlur={this.search}/>
                    <button>go</button>
                </section>
                <table><tbody>{items}</tbody></table>
            </React.Fragment> 
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
