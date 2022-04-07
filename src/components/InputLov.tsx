import React from "react";

interface IInputLov {
  btnOnClick?: () => void;
  value?: string;
  onChange?: () => void;
  onKeydown?: () => void;
  readOnly?: boolean;
  style?: React.CSSProperties;
}

export const InputLov = ({
  btnOnClick,
  value,
  onChange,
  onKeydown,
  readOnly,
  style,
}: IInputLov) => {
  return (
    <div style={{ position: "relative" }}>
      <input
        onKeyDown={onKeydown}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        style={style}
      />
      <div style={{ position: "absolute", right: "0px", top: "1px" }}>
        <button className="lov-btn" onClick={btnOnClick}>
          ...
        </button>
      </div>
    </div>
  );
};
