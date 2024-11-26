import { PaginationQueryArg } from "../../types";

export type SelectOption = {
  title: string;
  value: string;
};

export type SelectOptionProps = {
  option: SelectOption;
  onClick: (value: SelectOption["value"]) => void;
  loadMore: () => void;
  lastId: string;
  isSelected: boolean;
};

export type SelectProps = {
  selected: SelectOption | null;
  options: SelectOption[];
  placeholder?: string;
  status?: "default" | "invalid";
  onChange?: (selected: SelectOption["value"]) => void;
  onClose?: () => void;
  onLoadMore: ({ page, limit }: PaginationQueryArg) => void;
  label: string;
  isLoadMoreLoading: boolean;
};
