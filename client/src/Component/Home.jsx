import React, { useState } from "react";
import * as XLSX from "xlsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

const Home = () => {
  const [inputs, setInputs] = useState({
    companyTitle: "",
    content: "",
    pdf: null,
    video: null,
    image: null,
  });
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setInputs((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };
  const [tableData, setTableData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setTableData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const [editorContent, setEditorContent] = useState("");

  const handleContentChange = (content) => {
    setEditorContent(content);
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Excel data:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const [content, setContent] = useState("");

  const handleSend = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/product/getbill",
        {
          content,
        }
      );
      console.log(response.data);
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
  };

  return (
    <>
      <div className="bg-white  mx-5 border-2 border-rose-100 p-6">
        <div>
          <ReactQuill value={content} onChange={setContent} />
        </div>

        <div className="space-y-4">
          {/* Upload Buttons */}
          <div className="flex justify-end">
            <label className="flex items-center p-2 border cursor-pointer mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded transform transition duration-500 hover:bg-blue-600 hover:scale-105">
              <span className="">Upload Excel file</span>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".xlsx, .xls"
              />
            </label>
          </div>
          {/* Data Display Section */}
          {tableData.length > 0 && (
            <div className="mt-4  border rounded h-[600px] overflow-scroll">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {Object.keys(tableData[0]).map((key) => (
                      <th key={key} className="px-4 py-2 border">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((val, idx) => (
                        <td key={idx} className="px-4 py-2 border">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded transform transition duration-500 hover:bg-blue-600 hover:scale-105"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
