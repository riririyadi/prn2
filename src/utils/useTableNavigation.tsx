import { useEffect, useRef, useState } from "react";

export const useTableNavigation = (size: number = 0) => {
    const [activeIndex, setActiveIndex] = useState(-1);
    const [selectedRow, setSelectedRow] = useState<any>({});
    const refs = useRef(new Array(size));
  
    const handleClick = (data: any, index: number) => {
      setActiveIndex(index);
      setSelectedRow(data[index]);
    };
  
    const handleKeyDown = (
      evt: React.KeyboardEvent<HTMLTableRowElement>,
      data: any
    ) => {
      if (evt.key === "ArrowUp" && activeIndex! >= 0) {
        if (activeIndex! > 0) {
          setActiveIndex(activeIndex! - 1);
        }
      }
      if (
        evt.key === "ArrowDown" &&
        activeIndex! >= 0 &&
        activeIndex < size - 1
      ) {
        if (activeIndex! < size - 1) {
          setActiveIndex(activeIndex! + 1);
        }
      }
      if (evt.key === "Enter") {
        const index = refs.current[activeIndex!].tabIndex;
        setSelectedRow(data[index]);
      }
    };
  
    useEffect(() => {
      refs.current[activeIndex]?.focus();
    }, [activeIndex]);
  
    return { refs, handleKeyDown, selectedRow, handleClick };
  };