import { useState, useCallback, useEffect, useMemo } from "react";
import Select from "./components/select";
import { IUser, PaginationQueryArg } from "./types";
import { UsersService } from "./services/users.service";
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from "./constants";
import { SelectOption } from "./components/select/types";
import { getUserTitle } from "./utils";
import "./App.css";

function App() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [selectUser, setSelectUser] = useState<IUser>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelect = (value: string) => {
    const val = users.find((item) => item.id.toString() === value);
    setSelectUser(val);
  };

  const getUsers = useCallback(async (args?: PaginationQueryArg) => {
    setIsLoading(true);
    try {
      const data = await UsersService.getVacancies({
        page: args?.page || DEFAULT_PAGINATION_PAGE,
        limit: args?.limit || DEFAULT_PAGINATION_LIMIT,
      });
      if (data?.data) {
        setUsers((prev) => [...prev, ...data.data]);
        setTotal(data.meta.total);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, []);

  const isHasMore = useMemo(() => total > users.length, [total, users.length]);

  const loadMoreUsers = useCallback(
    ({ page }: PaginationQueryArg) => {
      if (isHasMore) {
        getUsers({ page });
      }
    },
    [getUsers, isHasMore],
  );

  const userOptions: SelectOption[] = useMemo(() => {
    return users?.map((user) => ({
      value: user.id.toString(),
      title: getUserTitle(user),
    }));
  }, [users]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const selectedUser = useMemo(() => {
    let res = null;
    if (selectUser) {
      res = {
        value: selectUser.id.toString(),
        title: getUserTitle(selectUser),
      };
    }
    return res;
  }, [selectUser]);

  return (
    <Select
      options={userOptions}
      selected={selectedUser}
      onChange={handleSelect}
      placeholder="Select User"
      onLoadMore={loadMoreUsers}
      label="Users"
      isLoadMoreLoading={isLoading && userOptions.length > 0}
    />
  );
}

export default App;
