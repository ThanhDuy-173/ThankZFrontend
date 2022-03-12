// export const API = "http://localhost:5000";
export const API = "https://thankz-backend.herokuapp.com/";

//User
export const getAllUsers_URL= API + "/user"
export const login_URL = API + "/user/login"
export const register_URL = API + "/user/register"
export const updateUser_URL = API + "/user/update"
export const resetUser_URL = API + "/user/reset"

//Story
export const getAllStories_URL= API + "/story"
export const getAllStoriesByUser_URL= API + "/story/user"

//Media
export const getAllMedia_URL= API + "/media"
export const getAllMediaByUser_URL= API + "/media/user"

//Diary
export const getAllDiaries_URL= API + "/diary"
export const getAllDiariesByUser_URL= API + "/diary/user"
export const addDiary_URL= API + "/diary/add"
export const updateDiary_URL= API + "/diary/update"
export const deleteDiary_URL= API + "/diary/delete"