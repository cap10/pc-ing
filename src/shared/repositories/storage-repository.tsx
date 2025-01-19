import { decrypt, encrypt } from "../utilities/encrypt";


export async function setSessionData(key: string, value: string){
    if(key && value){
        const encData = await encrypt(value);

        sessionStorage.setItem(key, encData);
    }
}

export async function getSessionData(key: string){
    if(key){
        // const data = await sessionStorage.getItem(key);
        const data = (key);

        const decData = await decrypt(data);

        return decData;
    }
}

export async function clearSessionData(): Promise<boolean> {
    try {
        sessionStorage.clear();
        return true;   

    } catch (err) {
        console.log(err);
        return false;

    }
}