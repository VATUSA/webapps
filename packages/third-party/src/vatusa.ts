const BASE_URL = "https://api.vatusa.net/";

type ApiResponse<Nested> = {
  data: Nested;
};

type UserRole = {
  facility: string;
  role: string;
};

type UserInfo = {
  cid: number;
  fname: string;
  lname: string;
  facility: string;
  roles: Array<UserRole>;
  rating: number;
};

/**
 * Get public information about a controller.
 */
export async function getUserInfo(cid: string): Promise<ApiResponse<UserInfo>> {
  return await (await fetch(`${BASE_URL}user/${cid}`)).json();
}
