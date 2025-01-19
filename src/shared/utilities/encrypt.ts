import NextCrypto from "next-crypto";

const crypto = new NextCrypto('iBanking@2025_jugaard');

export async function encrypt(data: string){
    if(data){
        const encData = await crypto.encrypt(data);

        return encData;
    }
    else{
        return '';
    }
}

export async function decrypt(data: string | null){
    if(data){
        const decData = await crypto.decrypt(data);

        return decData;
    }
    else{
        return '';
    }
}