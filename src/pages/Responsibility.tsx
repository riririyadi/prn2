import React, { useEffect, useState } from "react";
import { FormIdContext } from "../components/MainArea";
import { TableGrid } from "../components/TableGrid";

export default function Responsibility() {
  const formId = React.useContext(FormIdContext);
  const column = [{ column: "column 1" }, { column: "column 2" }];

  const [addInline, setAddInline] = useState(false);
  const [editInline, setEditInline] = useState(false);
  const [editRowId, setEditRowId] = useState(-1);
  const [saved, setSaved] = useState(false);
  const [variabel1, setVariabel1] = useState("");
  const [variabel2, setVariabel2] = useState("");

  const [mockData, setMockData] = useState([
    { data1: "data 1.1", data2: "data 1.1" },
    { data1: "data 2.1", data2: "data 2.2" },
  ]);

  const handleSave = () => {
    const newData={data1: variabel1, data2:variabel2}
    setMockData([...mockData, newData])
    setAddInline(false);
    setVariabel1("");
    setVariabel2("");
  }
  return (
    <div className="component">
      <TableGrid
        column={column}
        addButton={true}
        addButtonOnClick={() => setAddInline(!addInline)}
      >
        <tbody>
          {addInline && (
            <tr>
              <td>
                <button onClick={handleSave}>
                  Save
                </button>
              </td>
              <td>
               
                  <input
                    value={variabel1}
                    onChange={(e) => setVariabel1(e.target.value)}
                  />
              </td>
              <td>
                  <input
                    value={variabel2}
                    onChange={(e) => setVariabel2(e.target.value)}
                  />
                
              </td>
            </tr>
          )}
          {mockData &&
            mockData.map((d, i) => (
              <React.Fragment key={i}>
                {editInline && editRowId === i ? (
                  <tr>
                    <td>
                      <button onClick={() => setEditInline(false)}>Save</button>
                    </td>
                    <td>
                      <input value={d.data1} />
                    </td>
                    <td>
                      <input value={d.data2} />
                    </td>
                  </tr>
                ) : (
                  <tr
                    onDoubleClick={() => {
                      setEditInline(true);
                      setEditRowId(i);
                    }}
                  >
                    <td>
                      <button>Delete</button>
                    </td>
                    <td>{d.data1}</td>
                    <td>{d.data2}</td>
                  </tr>
                )}
              </React.Fragment>
            ))}
        </tbody>
      </TableGrid>
    </div>
  );
}
