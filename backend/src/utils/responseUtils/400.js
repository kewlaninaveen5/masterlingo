export function res400 (res, responseObject) {

    return res.status(400).json(responseObject);
} 

export function r500 (res, responseObject) {
    if (typeof(responseObject) == 'string')
        return res.status(500).json({message: responseObject});
    return res.status(500).json(responseObject);
} 