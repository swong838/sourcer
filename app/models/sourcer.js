require('dotenv').config();

const server = process.env.SERVERPATH;
const args = {
    'apikey': process.env.APIKEY,
    'o': 'json',
    'q': '',
    't': 'search',
    'minsize': '209715200',
    'maxage': '10',
    'limit': '200',
}

const grab = (term='MP4') => {
    /* 
        fetches from API at server
    */
    console.log(`${term}`)
}

const loader = apiresponse => {
    /*
        parses API responses
    */
    if (!apiresponse.channel || !apiresponse.channel.item) {
        throw new Error(`can't parse response from endpoint`);
    }

    return apiresponse.channel.item.map(member => {
        const { title, description, link } = member;
        const size = member.enclosure['@attributes'].length;   
        return {title, description, link, size}
    });

};

export { grab, loader };
