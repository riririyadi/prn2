import { FC, useState } from "react";
import { TableGrid } from "../../components/TableGrid";
import {Modal} from "../../components/Modal";
import { MdClose } from "react-icons/md";

interface IViewResourceDetailProps {
  open: boolean;
  close: () => void;
}

export const ViewResourceDetail: FC<IViewResourceDetailProps> = ({
  open,
  close,
}) => {
  const column = [
    { column: "MSISDN" },
    { column: "IMSI" },
    { column: "Status" },
    { column: "NDC" },
    { column: "HLR" },
    { column: "Prefix" },
    { column: "Item Description" },
    { column: "Product Description" },
    { column: "Creation Date" },
    { column: "Created By" },
  ];
  return (
    <Modal open={open} close={close} title="List Open New Resource Detail">
      <div style={{ padding: "1rem"}}>
     
        <div style={{ border: "1px solid #e8e8e8" }}>
          <TableGrid column={column} heightPercentage={80}>
            <tbody>
            <tr>
              <td>234784574839</td>
              <td>09889897832748329</td>
              <td>ALLOCATED</td>
              <td>052</td>
              <td>01</td>
              <td className="text-nowrap">Resource AS</td>
              <td>078362</td>
              <td>3</td>
              <td>12-23-2322</td>
              <td>KayO</td>
            </tr>
            <tr>
              <td>234784574839</td>
              <td>09889897832748329</td>
              <td>ALLOCATED</td>
              <td>052</td>
              <td>01</td>
              <td className="text-nowrap">Resource AS</td>
              <td>078362</td>
              <td>3</td>
              <td>12-23-2322</td>
              <td>KayO</td>
            </tr>
            </tbody>
          </TableGrid>
        </div>
      </div>
    </Modal>
  );
};
