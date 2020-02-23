import { loader } from '../app/models/sourcer';

test('extracts items from api response', _ => {
    const results = loader(fixtures.basic);
    expect(results[0]).toEqual({
        'title': 'item 1',
        'description': 'some_description',
        'link': 'https://api.example.com/api?t=get&id=111111&apikey=12345',
        'size': '4000'
    });
    expect(results[1]).toEqual({
        'title': 'item 2',
        'description': 'some_description',
        'link': 'https://api.example.com/api?t=get&id=222222&apikey=12345',
        'size': '5000'
    });
});


const fixtures = {
    'basic': {
        "@attributes": {
            "version": "1.0"
        },
        "channel": {
            "title": "api.example.com",
            "description": "some_api API",
            "link": "http:\/\/api.example.com\/",
            "language": "en-gb",
            "webMaster": "info@some_api.info (some_api)",
            "category": {},
            "image": {
                "url": "https:\/\/api.example.com\/covers\/some_api.png",
                "title": "api.example.com",
                "link": "http:\/\/api.example.com\/",
                "description": "some_api"
            },
            "response": {
                "@attributes": {
                    "offset": "0",
                    "total": "150"
                }
            },
            "item": [
                {
                    "title": "item 1",
                    "guid": "https:\/\/some_api.info\/search.php?guid=111111",
                    "link": "https:\/\/api.example.com\/api?t=get&amp;id=111111&amp;apikey=12345",
                    "comments": "https:\/\/some_api.info\/search.php?guid=111111",
                    "pubDate": "Thu, 30 Jan 2020 03:11:12 +0000",
                    "category": "some_category",
                    "description": "some_description",
                    "enclosure": {
                        "@attributes": {
                            "url": "http:\/\/api.example.com\/api?t=get&amp;id=111111&amp;apikey=12345",
                            "length": "4000",
                            "type": "application\/x-application"
                        }
                    },
                    "attr": [{
                        "@attributes": {
                            "name": "category",
                            "value": "6000"
                        }
                    }, {
                        "@attributes": {
                            "name": "category",
                            "value": "6030"
                        }
                    }, {
                        "@attributes": {
                            "name": "size",
                            "value": "4000"
                        }
                    }, {
                        "@attributes": {
                            "name": "guid",
                            "value": "111111"
                        }
                    }]
                },
                {
                    "title": "item 2",
                    "guid": "https:\/\/some_api.info\/search.php?guid=222222",
                    "link": "https:\/\/api.example.com\/api?t=get&amp;id=222222&amp;apikey=12345",
                    "comments": "https:\/\/some_api.info\/search.php?guid=222222",
                    "pubDate": "Thu, 30 Jan 2020 03:11:12 +0000",
                    "category": "some_category_2",
                    "description": "some_description_2",
                    "enclosure": {
                        "@attributes": {
                            "url": "http:\/\/api.example.com\/api?t=get&amp;id=222222&amp;apikey=12345",
                            "length": "5000",
                            "type": "application\/x-application"
                        }
                    },
                    "attr": [{
                        "@attributes": {
                            "name": "category",
                            "value": "6000"
                        }
                    }, {
                        "@attributes": {
                            "name": "category",
                            "value": "6030"
                        }
                    }, {
                        "@attributes": {
                            "name": "size",
                            "value": "5000"
                        }
                    }, {
                        "@attributes": {
                            "name": "guid",
                            "value": "222222"
                        }
                    }]
                },
    
            ]
        }
    }
};