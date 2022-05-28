const request = require('../request/http_request');


/*
 * gets all data for viewing appraisal
 */
async function getAllAppraisalData(appraisalID, token){
    let body = {
        appraisalID: appraisalID,
        token: token,
    }
    let response = await request.get('/api/order/data/getall', body);
    if(response === false){
        return false;
    }
    let responseJson = JSON.parse(response);
    if(responseJson.code !== 0){
        return false;
    }
    return responseJson.contents;
}
module.exports.getAllAppraisalData = getAllAppraisalData;


/*
 * gets comments for this appraisal
 */
async function getAllComments(appraisalID, token){
    let body = {
        appraisalID: appraisalID,
        token: token,
    }
    let response = await request.get('/api/order/comments/getall', body);
    if(response === false){
        return false;
    }
    let responseJson = JSON.parse(response);
    if(responseJson.code !== 0){
        return false;
    }
    return responseJson.contents;
}
module.exports.getAllComments = getAllComments;


/*
 * verifies comment and sends request to server
 */
async function createComment(commentInfo){
    return await request.post('/api/order/comments/create', commentInfo);
}
module.exports.createComment = createComment;


/*
 * gets internal notes for this appraisal
 */
async function getAllInternalNotes(appraisalID, token){
    let body = {
        appraisalID: appraisalID,
        token: token,
    }
    let response = await request.get('/api/order/internalnotes/getall', body);
    if(response === false){
        return false;
    }
    let responseJson = JSON.parse(response);
    if(responseJson.code !== 0){
        return false;
    }
    return responseJson.contents;
}
module.exports.getAllInternalNotes = getAllInternalNotes;


/*
 * verifies internal note and sends request to server
 */
async function createInternalNote(internalNote){
    return await request.post('/api/order/internalnotes/create', internalNote);
}
module.exports.createInternalNote = createInternalNote;
