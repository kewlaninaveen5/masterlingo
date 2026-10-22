function respond(res, statusCode, responseObject) {
    const body = 
        typeof responseObject === "string" ? {message: responseObject} : responseObject;

    return res.status(statusCode).json(body);
}

export const r200 = (res, body) => respond(res, 200, body);

export const r201 = (res, body) => respond(res, 201, body);

export const r400 = (res, body) => respond(res, 400, body);

export const r404 = (res, body) => respond(res, 404, body);

export const r429 = (res, body) => respond(res, 429, body);

export const r500 = (res, body) => respond(res, 500, body);

export const r501 = (res, body) => respond(res, 501, body);

export const r503 = (res, body) => respond(res, 503, body);


// export function r400 (res, responseObject) {
//     if (typeof(responseObject) == 'string')
//         return res.status(400).json({message: responseObject});
//     return res.status(400).json(responseObject);
// }