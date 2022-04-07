import React, {
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { MdClose } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import "./modal.css";

function useDragging(close: () => void) {
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<any>(null);
  const closeButtonRef = useRef<any>(null);

  function onMouseMove(e: any) {
    if (!isDragging) return;
    if (e.y > 0) {
      setPos({
        x: e.x - ref.current!.offsetWidth / 2,
        y: e.y - ref.current!.offsetHeight / 2,
      });

      // setPos({
      //   x: e.x,
      //   y: e.y,
      // });
    }

    e.stopPropagation();
    e.preventDefault();
  }

  function onMouseUp(e: any) {
    setIsDragging(false);
    e.stopPropagation();
    e.preventDefault();
  }

  function onMouseDown(e: any) {
    if (e.button !== 0) return;
    if (closeButtonRef.current!.contains(e.target)) {
      close();
      return;
    }
    setIsDragging(true);

    setPos({
      x: e.x - ref.current!.offsetWidth / 2,
      y: e.y - ref.current!.offsetHeight / 2,
    });

   

    e.stopPropagation();
    e.preventDefault();
  }

  
  useEffect(() => {
    ref.current?.addEventListener("mousedown", onMouseDown);

    return () => {
      ref.current?.removeEventListener("mousedown", onMouseDown);
    };
  }, [ref.current]);


  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    } else {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [isDragging]);

  return [ref, closeButtonRef, pos.x, pos.y];
}

interface IModalFrameProps {
  close?: () => void;
  level?: number;
  title?: string;
  children?: ReactNode;
  width?: number;
  height?: number;
}

const ModalFrame: FC<IModalFrameProps> = ({
  close,
  level = 1,
  title = "Modal",
  children,
  width = 0,
  height = 0,
}) => {
  const [ref, closeButtonRef, x, y] = useDragging(close!);

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0.2 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      exit={{ opacity: 0 }}
      className="modal__overlay"
      style={{
        zIndex: 9999 + level,
      }}
    >
      <motion.div
        initial={{ scaleX: 0.2 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
        exit={{ scaleX: 0 }}
        className="modal__area"
        style={{
          zIndex: 9999 + level,
          width: width === 0 ? "auto" : width,
          height: height === 0 ? "auto" : height,
          maxWidth:'calc(100vw - 50px)',
          maxHeight:'calc(100vh - 20px)',
          left: x === 0 ? ("" as any) : x,
          top: y === 0 ? ("" as any) : y,
        }}
      >
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="modal__header"
        >
          <div>{title}</div>
          <div>
            <button
              ref={closeButtonRef as React.RefObject<HTMLButtonElement>}
              className="btn__close__modal"
            >
              <MdClose size={24} />
            </button>
          </div>
        </div>
        <div
          style={{
            minHeight: "fit-content",
            maxHeight: "95vh",
            overflow: "auto",
            padding: "10px 20px",
          }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>,
    document.getElementById("modal-root") as HTMLDivElement
  );
};

export interface IModalProps {
  open: boolean;
  close: () => void;
  title?: string;
  level?: number;
  width?: number;
  height?: number;
  children?: ReactNode;
}
export const Modal = ({
  open,
  close,
  title,
  level,
  width,
  height,
  children,
}: IModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <ModalFrame close={close} title={title} width={width} height={height} level={level}>
          {children}
        </ModalFrame>
      )}
    </AnimatePresence>
  );
};
