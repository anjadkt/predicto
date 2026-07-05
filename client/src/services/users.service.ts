import api from "../utils/api"


export const getUsersData = async () => {

  const { data } = await api.get("/users");

  return data.response ;
}

export const updateUserDetails = async (
  userId:string , 
  payload: { score : number, isVerified:boolean}
) => {

  const { data } = await api.patch(`/users/${userId}`,payload);

  return data.response ;
}