import React, { useState } from "react";
import * as XLSX from "xlsx";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRef } from "react";

function Home() {
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState("");
  const [tableData, setTableData] = useState([]);
  const [attachmentFile, setAttachmentFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      const emailList = data.map((row) => row.Email); // Assuming the column containing emails is labeled 'Email'
      setEmails(emailList);
    };
    reader.readAsBinaryString(file);
  };

  // Connect frontend with backend
  const sendEmails = async (e) => {
    try {
      const formData = new FormData();
      formData.append("fileToUpload", handleFileChange);

      const response = await fetch("http://localhost:8080/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          emails: emails,
          attachment: formData,  
        }),
      });
      if (!response.ok) throw new Error("Network response was not ok.");
      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you would typically send the message to the list of emails
    // This part needs to be handled by your backend
    console.log("Message:", message);
    console.log("Sending to emails:", emails);
    sendEmails();
    // Reset message or perform other actions as necessary
    setMessage(e.target.value);
  };

  // =========================================== Document Attachment =========================================

  const quillRef = useRef();

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"], // toggled buttons
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }], // superscript/subscript
        [{ direction: "rtl" }], // text direction
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ["link", "image", "video"],
        // ["attachment"], // custom button for document attachment
        [
          {
            imageResize: {
              parchment: Quill.import("parchment"),
              modules: ["Resize", "DisplaySize", "Toolbar"],
              handleStyles: {
                backgroundColor: "black",
                border: "none",
                color: "white",
              },
            },
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white",
              height: "300px",
              width: "600px",
            },
          },
        ],
      ],
    },
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "header",
    "list",
    "script",
    "indent",
    "direction",
    "size",
    "color",
    "background",
    "font",
    "align",
    "link",
    "image",
    "video",
  ];
  const handleAttachment = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".pdf,.doc,.docx"); // Specify accepted file types
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const url = await handleFileUpload(file); // Function to upload the file and get the URL
      insertFileLink(url, file.name);
    };
  };

  const insertFileLink = (url, filename) => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    quill.insertEmbed(range.index, "attachment", { url, filename });
  };

  // =========================================== Documents =========================================
  const [editorContent, setEditorContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAttachmentChange = (e) => {
    setAttachmentFile(e.target.files[0]);
    const formData = new FormData();
    formData.append("file", attachmentFile);
  };

  const uploadDocument = async () => {
    if (!selectedFile) {
      alert("Please select a document to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      const response = await fetch("http://localhost:8080/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Document uploaded successfully.");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Error uploading document.");
    }
  };

  return (
    <div
      className="bg-white  mx-5 border-2 border-rose-100 p-6 mt-5"
      onSubmit={handleSubmit}
    >
      <div>
        <ReactQuill
          value={message || editorContent}
          onChange={setMessage || setEditorContent}
          ref={quillRef}
          modules={modules}
          formats={formats}
        />
      </div>

      <div className="">
        <input
          onChange={(e) => handleAttachmentChange(e)}
          type="file"
          name=""
          id=""
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded transform transition duration-500 hover:bg-blue-600 hover:scale-105 mt-5"
        />
      </div>

      <div className="space-y-4">
        {/* Upload Buttons */}
        <div className="flex justify-end">
          <input
            type="file"
            accept=".xlsx, .xls"
            className="flex items-center p-2 border cursor-pointer mt-4 bg-blue-500 text-white font-bold px-4 rounded transform transition duration-500 hover:bg-blue-600 hover:scale-105"
            onChange={handleFileUpload}
          />
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
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded transform transition duration-500 hover:bg-blue-600 hover:scale-105"
          onClick={() => sendEmails(message)}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Home;
