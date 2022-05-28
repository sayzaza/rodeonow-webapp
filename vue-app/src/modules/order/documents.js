const request = require('../request/http_request');


/*
 * uploads document for this order
 */
async function uploadDocument(body){
    // add data to form data
    const formData = new FormData();
    for (const item in body) {
        formData.append(item, body[item]);
    }

    // make request
    let rawResults = await request.postForm('/api/order/document/upload', formData, 30000);
    if(results === false){
        return false;
    }
    let results = JSON.parse(rawResults);
    if(results.code !== 0){
        return false;
    }
    return results;
}
module.exports.uploadDocument = uploadDocument;



/*
 * downloads document to computer
 */
async function downloadDocument(token, docID){
    let body = {
        token: token,
        docID: docID,
    }
    // make request
    let rawResults = await request.get('/api/order/document/download', body, 30000);
    if(rawResults === false){
        return false;
    }
    return rawResults;
    /*let results = JSON.parse(rawResults);
    if(results.code !== 0){
        return false;
    }
    return results;*/
}
module.exports.downloadDocument = downloadDocument;
