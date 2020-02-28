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

    componentDidMount(){
        this.refresh();
    }

    refresh(term='KTR'){
        fetch(`/search/${term}`)
            .then(response => response.json())
            .then(json => this.setState({results: json}));
    }

    search = event => this.refresh(event.target.value)

    toQueue = identifier => {
        return async (event) => {
            event.preventDefault();
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
        const items = this.state.results.map(
            (item, index) => {
                const { title, pubDate, size, identifier } = item;
                return (
                    <tr key={`item_${index}`} className={!(index % 2) ? 'tinted' : ''}>
                        <td>{index + 1} {pubDate}</td>
                        <td>
                            <code>{bytes(size, {unit: 'GB'})}</code>
                        </td>
                        <td>
                            <a href='#' onClick={this.toQueue(identifier)}>{title}</a>
                        </td>
                    </tr>
                )
            }
        )

        return (
            <React.Fragment>
                <section>
                    <input type="text" placeholder="search" onBlur={this.search}/>
                    <button>go</button>
                </section>
                <table><tbody>{items}</tbody></table>
            </React.Fragment> 
        )
    }
}




ReactDOM.render(<App />, document.getElementById('app'));