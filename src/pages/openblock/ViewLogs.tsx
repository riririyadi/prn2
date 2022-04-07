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
    <Modal open={open} close={close} title="View Logs">
      <div style={{ padding: "1rem" }}>
        <TableGrid column={column} heightPercentage={70}>
          <tbody>
          <tr>
            <td className="text-nowrap">11-12-2021</td>
            <td className="text-nowrap">This is log message</td>
          </tr>
          <tr>
            <td className="text-nowrap">11-12-2021</td>
            <td className="text-nowrap">This is log message</td>
          </tr>
          </tbody>
        </TableGrid>
      </div>
    </Modal>
  );
};
