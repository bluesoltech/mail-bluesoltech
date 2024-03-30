import React, { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { GrSend } from "react-icons/gr";
import axios from "axios";
import { CiMail } from "react-icons/ci";
import Editor from "./Editor";
import Recipients from "./Recipients";
import { toast } from "react-toastify";

function Home() {
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleFileChange = (e) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
  };

  const rederedFiles = () =>
    files.map((file, index) => {
      return (
        <p
          className="px-4 py-1 h-fit w-fit bg-black text-white rounded-xl text-sm"
          key={index}
        >
          {file.name}
        </p>
      );
    });
  const rederedEmails = () =>
    recipients.map((recipient, index) => {
      return (
        <p className="text-sm" key={index}>
          {recipient.Email},
        </p>
      );
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("htmlContent", content);
    formData.append("subject", subject);
    // console.log(recipients);
    formData.append("recipients", JSON.stringify(recipients));
    formData.append("user", JSON.stringify(user));

    try {
      setLoading(true);
      const res = await axios.post(
        "http://65.2.51.122:8080/api/sendMail",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
      if (res.statusText != "OK") {
        throw new Error(result.message);
      }
      toast.success("Mail Sent successfully");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="relative p-2 bg-gray-200/80 min-h-screen flex flex-col items-center justify-center">
      <h1 className="absolute flex items-center text-center uppercase text-4xl md:text-5xl lg:text-7xl  2xl:text-9xl font-light z-[-1] top-0">
        <CiMail className="text-2xl" /> Send Mail{" "}
        <CiMail className="text-2xl" />
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded gap-5 p-5 flex flex-col w-[95%] lg:w-[900px]"
      >
        <div className="flex justify-between">
          <div className="w-[45%] flex flex-col gap-2">
            <label className="text-gray-400" htmlFor="user_email">
              Sender Email:
            </label>
            <input
              value={user.email}
              required
              id="user_email"
              type="email"
              className="p-2 focus:outline-none border-[1px] rounded"
              onChange={(e) => {
                setUser({
                  ...user,
                  ["email"]: e.target.value,
                });
              }}
            />
          </div>
          <div className="w-[45%] flex flex-col gap-2">
            <label className="text-gray-400" htmlFor="user_password">
              Sender App Password:
            </label>
            <input
              required
              value={user.password}
              id="user_password"
              type="password"
              className="p-2 focus:outline-none border-[1px] rounded"
              onChange={(e) => {
                setUser({
                  ...user,
                  ["password"]: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <label htmlFor="subject" className="text-gray-400">
          Subject?
        </label>
        <textarea
          required
          value={subject}
          type="text"
          id="subject"
          onChange={(e) => {
            setSubject(e.target.value);
          }}
          className="border-[1px] rounded focus:outline-none px-2 py-1 my-2"
        />
        <label htmlFor="body" className="text-gray-400">
          Body?
        </label>
        <Editor content={content} setContent={setContent} />
        <div className="flex gap-2 items-center my-2">
          <label htmlFor="attachment" className="cursor-pointer">
            <IoMdAddCircleOutline className="text-3xl hover:text-gray-600" />
          </label>
          <label
            htmlFor="attachment"
            className="cursor-pointer hover:text-gray-600"
          >
            Attachment
          </label>
          <div className="grid auto-cols-auto gap-2">{rederedFiles()}</div>
          <input
            required
            className="hidden"
            multiple
            onChange={handleFileChange}
            id="attachment"
            type="file"
          />
        </div>
        <Recipients setRecipients={setRecipients} />
        <div className="flex gap-1">{rederedEmails()}</div>

        <div className="flex justify-end">
          {!loading && (
            <button
              type="submit"
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-700 gap-2"
            >
              Send
            </button>
          )}
          {loading && (
            <button
              disabled
              type="submit"
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-xl cursor-wait gap-2"
            >
              Loading
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Home;
