import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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

    refresh(term){
        const searchval = term || 'mp4';
        fetch(`/search/${searchval}`)
            .then(response => response.json())
            .then(json => this.setState({results: json}));
    }

    render(){

        const items = this.state.results.map(
            (item, index) => (
                <li key={`item_${index}`}>
                    <a href={item.link}>
                        {item.title}
                    </a>
                </li>
            )
        )

        return (
            <section>
                <ol>{items}</ol>
            </section>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));