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

    render(){

        const items = this.state.results.map(
            (item, index) => (
                <tr key={`item_${index}`} className={!(index % 2) ? 'tinted' : ''}>
                    <td>{index + 1}</td>
                    <td><code>{bytes(item.size, {unit: 'GB'})}</code></td>
                    <td><a href={item.link}>{item.title}</a></td>
                </tr>
            )
        )

        return (
            <table>
                <ol>{items}</ol>
            </table>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));