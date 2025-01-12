"use server";

export const getDataOnServer = async () => {
  const res = await fetch("http://109.123.245.232:8405/v1/users/clerks?page=0&size=5");
  return await res.json();
};