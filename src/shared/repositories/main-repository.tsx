import { getDataOnServer } from "../services/main-service";

export const getUserClerks  = async () => {
    const data = await getDataOnServer();

    return data;
}