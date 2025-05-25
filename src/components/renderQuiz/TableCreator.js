import React, { useState } from "react";

const TableCreator = () => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(4);
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const initializeTable = () => {
    // Initialize headers with empty strings
    const newHeaders = Array(columns).fill("");

    // Initialize table data with empty strings
    const newTableData = Array(rows)
      .fill()
      .map(() => Array(columns).fill(""));

    setHeaders(newHeaders);
    setTableData(newTableData);
    setShowTable(true);
  };

  const updateHeader = (index, value) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const newTableData = [...tableData];
    newTableData[rowIndex][colIndex] = value;
    setTableData(newTableData);
  };

  const clearTable = () => {
    setShowTable(false);
    setTableData([]);
    setHeaders([]);
  };

  return (
    <div className="p-4">
      {!showTable ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Create Data Table</h2>
          <div className="space-x-4">
            <label className="space-x-2">
              <span>Rows:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                className="border p-1 w-20 rounded"
              />
            </label>
            <label className="space-x-2">
              <span>Columns:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={columns}
                onChange={(e) => setColumns(parseInt(e.target.value))}
                className="border p-1 w-20 rounded"
              />
            </label>
          </div>
          <button
            onClick={initializeTable}
            className="px-4 btn-sm py-2 rounded hover:bg-blue-600 graph-buttons"
          >
            Create Table
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 p-2">
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => updateHeader(index, e.target.value)}
                        className="w-full p-1 text-center"
                        placeholder={`Header ${index + 1}`}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) =>
                            updateCell(rowIndex, colIndex, e.target.value)
                          }
                          className="w-full p-1 text-center"
                          placeholder="Enter value"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-x-4">
            <button
              onClick={clearTable}
              className="px-4 py-2 btn-sm rounded hover:bg-red-600 graph-buttons"
            >
              Clear Table
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <p>Instructions:</p>
            <ul className="list-disc pl-5">
              <li>Click on header cells to add column headers</li>
              <li>Click on table cells to enter data</li>
              <li>Use the Clear Table button to start over</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableCreator;
