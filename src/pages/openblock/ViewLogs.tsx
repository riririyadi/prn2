import { FC } from "react";
import { MdClose } from "react-icons/md";
import { Modal } from "../../components/Modal";
import { TableGrid } from "../../components/TableGrid";

interface IViewLogsProps {
  open: boolean;
  close: () => void;
}

export const ViewLogs: FC<IViewLogsProps> = ({ open, close }) => {
  const column = [{ column: "Log Date" }, { column: "LogMessage" }];
  return (
    <Modal open={open} close={close}>
      <div style={{ padding: "1rem", backgroundColor: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ textAlign: "left" }}>Logs</div>
          <div onClick={close}>
            <MdClose />
          </div>
        </div>
        <TableGrid column={column} heightPercentage={70}>
          <tr>
            <td className="text-nowrap">11-12-2021</td>
            <td className="text-nowrap">This is log message</td>
          </tr>
          <tr>
            <td className="text-nowrap">11-12-2021</td>
            <td className="text-nowrap">This is log message</td>
          </tr>
        </TableGrid>
      </div>
    </Modal>
  );
};
