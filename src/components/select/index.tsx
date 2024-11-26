import type { MouseEventHandler } from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { SelectOption, SelectOptionProps, SelectProps } from "./types";
import { DEFAULT_PAGINATION_PAGE } from "../../constants";
import Styles from "./index.module.css";
import ArrowDown from "./assets/arrow-down.svg?react";

const OptionEl = (props: SelectOptionProps) => {
  const {
    option: { value, title },
    onClick,
    loadMore,
    lastId,
    isSelected,
  } = props;

  const myObserver = useRef<IntersectionObserver>();
  const optionRef = useCallback(
    (node: HTMLLIElement) => {
      if (myObserver.current) myObserver.current.disconnect();
      myObserver.current = new IntersectionObserver((entries) => {
        const isLastIntersectionTarget =
          entries[0].target.id === `select-option-${lastId}`;
        if (entries[0].isIntersecting && isLastIntersectionTarget) {
          loadMore();
        }
      });
      if (node) myObserver.current.observe(node);
    },
    [lastId, loadMore],
  );

  const handleClick =
    (clickedValue: SelectOption["value"]): MouseEventHandler<HTMLLIElement> =>
    () => {
      onClick(clickedValue);
    };

  return (
    <li
      className={Styles.option}
      value={value}
      onClick={handleClick(value)}
      tabIndex={0}
      ref={optionRef}
      id={`select-option-${value}`}
      data-selected={!!isSelected}
    >
      <div className={Styles.avatar}>{title[0].toUpperCase()}</div>
      <span>{title}</span>
    </li>
  );
};

const Select = (props: SelectProps) => {
  const {
    options,
    placeholder,
    status = "default",
    selected,
    onChange,
    onClose,
    onLoadMore,
    label,
    isLoadMoreLoading,
  } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(DEFAULT_PAGINATION_PAGE);

  const onNextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  useEffect(() => {
    onLoadMore({ page });
  }, [page]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const { target } = event;
      if (target instanceof Node && !rootRef.current?.contains(target)) {
        if (isOpen) {
          onClose?.();
        }
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const placeholderEl = placeholderRef.current;
    if (!placeholderEl) return;

    const handleEnterKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setIsOpen((prev) => !prev);
      }
    };
    placeholderEl.addEventListener("keydown", handleEnterKeyDown);

    return () => {
      placeholderEl.removeEventListener("keydown", handleEnterKeyDown);
    };
  }, []);

  const handleOptionClick = (value: SelectOption["value"]) => {
    setIsOpen(false);
    onChange?.(value);
  };
  const handlePlaceHolderClick: MouseEventHandler<HTMLDivElement> = () => {
    setIsOpen((prev) => !prev);
  };

  const fieldName = label.trim();
  return (
    <div className={Styles.selectField}>
      {label && (
        <label htmlFor={fieldName} className={Styles.label}>
          {label}
        </label>
      )}
      <div
        className={Styles.selectInner}
        ref={rootRef}
        data-is-active={isOpen}
        id={fieldName}
      >
        <div className={Styles.arrow}>
          <ArrowDown />
        </div>
        <div
          className={Styles.placeholder}
          data-status={status}
          data-selected={!!selected?.value}
          onClick={handlePlaceHolderClick}
          role="button"
          tabIndex={0}
          ref={placeholderRef}
        >
          {selected?.title || placeholder}
        </div>
        {isOpen && (
          <ul className={Styles.select}>
            {options.map((option) => (
              <OptionEl
                key={option.value}
                option={option}
                onClick={handleOptionClick}
                loadMore={onNextPage}
                lastId={options[options.length - 1].value}
                isSelected={option.value === selected?.value}
              />
            ))}
            {isLoadMoreLoading && (
              <li className={Styles.option}>... Loading ...</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Select;
