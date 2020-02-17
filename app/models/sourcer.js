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
    console.log(`${term}`)
}

const loader = apiresponse => {
    


};


export { grab, loader };


/*

apikey=75861976434857
o=json
q=MP4
t=search
minsize=209715200
maxage=10
limit=200


*/



