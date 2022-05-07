const ky = require('ky');

var cookie = undefined;
var hostname = 'http://localhost:';
//var hostname = 'http://localhost:';
var PORT = 3080;


/*
 * makes post request
 */
async function post(endpoint, body, timeout){
    if(body.token === undefined){ // has to be firebase token
        return false;
    }

    if(timeout === undefined){
        timeout = 10000;
    }

    let options = {
        headers: {
            'Content-type': 'application/json',
            //'Cookie': cookie
        },
        timeout: timeout,
        keepAliveTimeout: timeout,
        retry: 0,
        keepAlive: false,
        body: JSON.stringify(body)
    };

    let url = hostname + PORT + endpoint;
    return await _post(url, options)
}
module.exports.post = post;



/*
 * makes post request
 * have to pass the formData directly as parameter
 */
async function postForm(endpoint, formData, timeout){
    if(formData.get('token') === undefined){ // has to be firebase token
        return false;
    }

    if(timeout === undefined){
        timeout = 10000;
    }

    let options = {
        headers: {
            //'Content-type': 'multipart/form-data',
            'Cookie': cookie
        },
        timeout: timeout,
        keepAliveTimeout: timeout,
        retry: 0,
        keepAlive: false,
        body: formData,
    };

    let url = hostname + PORT + endpoint;
    return await _post(url, options)
}
module.exports.postForm = postForm;


async function _post(url, options){
    // return await ky.post(`http://localhost:` + port + endpoint, options)
    return await ky.default.post(url, options)
        /*.then((response) => {
            let cookieRes = response.headers['set-cookie']
            if (cookieRes) cookie = cookieRes
            return JSON.parse(response.body);
        })*/
        .then((response) => {
            //let cookieRes = response.headers['set-cookie']
            //if (cookieRes) cookie = cookieRes
            return response.text();
        })
        .catch(error => {
            console.log(error);
            if (error instanceof ky.HTTPError) {
                let statusCode = error.response.statusCode;
                if (statusCode == 401 || statusCode == 403) {
                    console.log("auth fail");
                    if (window.location.hash != '#/login')
                        window.location.hash = '#/login'
                }
            }
            return false;
        });
}



/*
 * makes get request
 */
async function get(endpoint, getParams, timeout){
    if(getParams.token === undefined){ // has to be firebase token
        return false;
    }

    if(timeout === undefined){
        timeout = 10000;
    }

    let options = {
        headers: {
            'Cookie': cookie
        },
        timeout: timeout,
        keepAliveTimeout: timeout,
        retry: 0,
        keepAlive: false
    };

    let url = makeGetEndpoint(hostname, PORT, endpoint, getParams);
    return await ky.default.get(url, options)
        .then((response) => {
            //console.log(await response.text());
            //console.log(await response.json());
            // console.log(response.body.text())
            //let cookieRes = response.headers['set-cookie']
            //if (cookieRes) cookie = cookieRes
            return response.text();
        })
        .catch(error => {
            console.log("get error -> " + endpoint + " - " + error);
            if (error instanceof ky.HTTPError) {
                let statusCode = error.response.statusCode;
                if (statusCode == 401 || statusCode == 403) {
                    console.log("auth fail");
                    if (window.location.hash != '#/login')
                        window.location.hash = '#/login'
                }
            }
            return false;
        });
}
module.exports.get = get;


/*
 * converts javascript object to get query
 */
function objectToQuery(object){
    return Object.keys(object).map(key => key + '=' + encodeURIComponent(object[key])).join('&');
}


function makeGetEndpoint(url, port, endpoint, getParams){
    let query = '';
    if(getParams !== undefined){
        query = objectToQuery(getParams);
    }
    return url + port + endpoint + "?" + query;
}
module.exports.makeGetEndpoint = makeGetEndpoint;
