import {StreamChat} from 'stream-chat'
import 'dotenv/config';

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if (!apiKey || !apiSecret)
console.error("Stream API or SECRET missing")

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData) => {
    console.log("userdata to upsert user: ", userData)
    try {
        const res = await streamClient.upsertUsers([userData])
        console.log("User Upserted Successfully: ", res)
        return userData;
    } catch (error) {
        console.error("error upserting Stream user: ", error);
        throw new Error({message: "error upserting Stream user: ", error})
        
    }

}

export const generateStreamToken = (userId) => {
    try {
        // ensure userId is a string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr)
    } catch (error) {
        console.error("Error Generating Stream Token", error)
        
    }


}