import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function checkKeys(obj) {
  const requiredKeys = ["Name", "Email"];
  return requiredKeys.every((key) => Object.keys(obj).includes(key));
}

function Recipients({ setRecipients }) {
  const [file, setFile] = useState(null);
  const handleConvert = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        if (checkKeys(json[0])) setRecipients(json);
        else console.log("Error in Uploaded Files");
      };
      reader.readAsBinaryString(file);
    }
  };

  useEffect(() => {
    if (file != null) {
      handleConvert();
    }
  }, [file]);

  return (
    <div className="flex gap-4">
      <label htmlFor="recipents" className="text-gray-400">
        Upload E-mail Sheet:
      </label>
      <input
        id="recipents"
        accept=".xls,.xlsx"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
    </div>
  );
}

export default Recipients;
