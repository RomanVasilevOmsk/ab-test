import { api } from "../api/axios.api";
import { UsersResponse, PaginationQueryArg } from "../types/index";
import { RestApiUrls } from "../constants/urls";

export const UsersService = {
  async getVacancies({
    page,
    limit,
  }: PaginationQueryArg): Promise<UsersResponse | undefined> {
    let data = null;
    let meta = null;
    try {
      const response = await api.get(
        `${RestApiUrls.Users}?page=${page}&limit=${limit}`,
      );
      data = response.data.data;
      meta = response.data.meta;
    } catch (err) {
      console.log(err);
    }
    if (data)
      return {
        data,
        meta,
      };
  },
};
