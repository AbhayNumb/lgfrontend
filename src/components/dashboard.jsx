import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { useWebContext } from "../context/contextprovider";
import { initFlowbite } from "flowbite";
import { MoonLoader } from "react-spinners";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom"; // Assuming you're using React Router

const Dashboard = () => {
  const location = useLocation();

  const {
    dnsdata,
    deleteRecord,
    addRecord,
    editRecord,
    enablednssec,
    disablednssec,
    FetchDNSDdata,
    URL,
  } = useWebContext();
  const [hostedZoneId, setHostedZoneId] = useState("");
  const [recordName, setRecordname] = useState("");
  const [recordType, setRecordType] = useState("");
  const [recorValue, setRecordValue] = useState([]);
  const [filter, setfilter] = useState("");
  const [ttl, setTTL] = useState("");
  const [editmode, seteditmode] = useState(false);
  const [displaydata, setdisplaydata] = useState("None");
  const [searchkeyword, setsearchkeyword] = useState("");
  const [currentpage, setCurrentPage] = useState(1);
  const [maxele, setMaxele] = useState(7);

  useEffect(() => {
    // Initialize Flowbite when dnsdata changes
    initFlowbite();
    setdisplaydata(dnsdata);
  }, [dnsdata]);

  const handleDelete = async (e, hostedZoneId, Name, type, Value, TTL) => {
    e.preventDefault();
    if (window.confirm("Confirm Delete")) {
      await deleteRecord(hostedZoneId, Name, type, Value, TTL);
    }
    setactioneditdelete("");
  };
  const addRecordHandle = async (e) => {
    e.preventDefault();
    if (window.confirm("Confirm Add")) {
      await addRecord(hostedZoneId, recordName, recordType, recorValue, ttl);
    }
    setHostedZoneId("");
    setRecordType("");
    setRecordValue([]);
    setRecordname("");
    setTTL("");
    setismodalopem(false);
    setactiondrop(false);
  };
  const handleEditClick = (e, hostedZoneId, Name, type, Value, TTL) => {
    e.preventDefault();
    setactioneditdelete("");
    seteditmode(true);
    setHostedZoneId(hostedZoneId);
    setRecordname(Name);
    setRecordType(type);
    setRecordValue(Value);
    setismodalopem(true);
    setTTL(TTL);
    setactioneditdelete(false);
  };
  const editChangeHandle = async (e) => {
    e.preventDefault();
    if (window.confirm("Confirm Edit")) {
      await editRecord(hostedZoneId, recordName, recordType, recorValue, ttl);
    }
    seteditmode(false);
    setHostedZoneId("");
    setRecordname("");
    setRecordType("");
    setRecordValue([]);
    setismodalopem(false);
    setTTL("");
  };
  const closingthemodal = (e) => {
    e.preventDefault();
    setismodalopem(false);
    seteditmode(false);
    setHostedZoneId("");
    setRecordname("");
    setRecordType("");
    setRecordValue([]);
    setTTL("");
  };
  const dnssechandler = async (e, enable, hostedZoneId) => {
    e.preventDefault();
    if (enable === "ENABLE") {
      if (window.confirm("Confirm Enable")) {
        await enablednssec(hostedZoneId);
      }
    } else {
      if (window.confirm("Confirm Disable")) {
        await disablednssec(hostedZoneId);
      }
    }
  };
  const handlesearch = (e) => {
    e.preventDefault();
    if (filter === "" || searchkeyword === "") {
      return;
    }
    const filteredData = dnsdata.filter((entry) => {
      // Check if any value in the entry contains the search keyword
      const lowercaseSearchKeyword = searchkeyword.toLowerCase();
      for (const key in entry) {
        if (
          (key === filter && typeof entry[key]) === "string" &&
          entry[key].toLowerCase().includes(lowercaseSearchKeyword)
        ) {
          return true;
        }
        if (key === filter && Array.isArray(entry[key])) {
          for (const record of entry[key]) {
            if (record.Value.toLowerCase().includes(lowercaseSearchKeyword)) {
              return true;
            }
          }
        }
      }
      return false;
    });
    setdisplaydata(filteredData);
  };
  const resetHandler = (e) => {
    e.preventDefault();
    setdisplaydata(dnsdata);
    setfilter("");
    setsearchkeyword("");
  };
  const handlepagination = (e, idx) => {
    e.preventDefault();
    setCurrentPage(idx);
  };
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(null);
  const [actiondrop, setactiondrop] = useState(false);
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const selectedFilename = selectedFile.name;

    if (window.confirm("Bulk Update")) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFilename);
      try {
        const token = localStorage.getItem("token");
        setFile(selectedFile);
        setFilename(selectedFilename);
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const resp = await axios.post(`${URL}/bulkAdd`, formData, { headers });
        if (resp.data.success) {
          toast.success("Uploaded Successfully");
          await FetchDNSDdata();
        } else {
          toast.error("Error occured");
        }
        setFile();
        setFilename();
      } catch (error) {
        toast.error("Error occured");
        console.error("Error uploading file:", error);
      }
    }
  };
  const handleactiondrop = () => {
    if (actiondrop) {
      setactiondrop(false);
    } else {
      setactiondrop(true);
    }
  };
  const handleFilterDrop = () => {
    if (filterdrop) {
      setfilterdrop(false);
    } else {
      setfilterdrop(true);
    }
  };
  const [filterdrop, setfilterdrop] = useState(false);
  const [actioneditdelete, setactioneditdelete] = useState("");
  const handleactioneditdelete = async (val) => {
    if (actioneditdelete === val) {
      setactioneditdelete("");
    } else {
      setactioneditdelete(val);
    }
  };
  const [modalhandler, setismodalopem] = useState(false);
  return (
    <div>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          {dnsdata === "None" || displaydata === "None" ? (
            <div
              className="flex items-center justify-center"
              style={{ width: "100%", height: "100vh" }}
            >
              <div>
                <MoonLoader color="#1A56DB" />
              </div>
            </div>
          ) : (
            <section className="bg-gray-50 dark:bg-gray-900 ">
              <div className="mx-auto max-w-screen">
                <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-1/2">
                      <form className="flex items-center">
                        <label for="simple-search" className="sr-only">
                          Search
                        </label>
                        <div className="relative w-full">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg
                              aria-hidden="true"
                              className="w-5 h-5 text-gray-500 dark:text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="simple-search"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Search"
                            required=""
                            value={searchkeyword}
                            onChange={(e) => setsearchkeyword(e.target.value)}
                          />
                        </div>
                      </form>
                    </div>
                    <div
                      className="flex"
                      style={{ paddingRight: "20rem", paddingTop: "0.5rem" }}
                    >
                      <button
                        onClick={(e) => handlesearch(e)}
                        type="button"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        Search
                      </button>
                      <button
                        onClick={(e) => resetHandler(e)}
                        type="button"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        Reset
                      </button>
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                      <div className="flex items-center space-x-3 w-full md:w-auto">
                        <div className="flex">
                          <div>
                            <button
                              onClick={() => handleactiondrop()}
                              className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                              type="button"
                            >
                              <svg
                                className="-ml-1 mr-1.5 w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  clip-rule="evenodd"
                                  fill-rule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                />
                              </svg>
                              Actions
                            </button>
                          </div>
                          {actiondrop ? (
                            <div
                              style={{ position: "absolute", top: "4.5rem" }}
                              className="bg-white rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                            >
                              <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                <li>
                                  <a
                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    class="block  focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 "
                                    type="button"
                                    onClick={() => setismodalopem(true)}
                                  >
                                    Add Record
                                  </a>
                                </li>
                                <li>
                                  <label className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                    <span>Add Bulk Record</span>
                                    <input
                                      type="file"
                                      className="hidden"
                                      onChange={handleFileChange}
                                    />
                                  </label>
                                </li>
                              </ul>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <button
                          onClick={() => handleFilterDrop()}
                          className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                          type="button"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            className="h-4 w-4 mr-2 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          Filter
                          <svg
                            className="-mr-1 ml-1.5 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              clip-rule="evenodd"
                              fill-rule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            />
                          </svg>
                        </button>
                        {filterdrop ? (
                          <div
                            style={{ position: "absolute", top: "4.5rem" }}
                            className="z-10  w-48 p-3 bg-white rounded-lg shadow dark:bg-gray-700"
                          >
                            <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
                              Choose Parameter
                            </h6>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center">
                                <input
                                  id="hostedZoneId"
                                  type="checkbox"
                                  checked={filter === "hostedZoneId"}
                                  onChange={(e) => {
                                    filter === "hostedZoneId"
                                      ? setfilter("")
                                      : setfilter("hostedZoneId");
                                  }}
                                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                  htmlFor="hostedZoneId"
                                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                  hostedZoneId
                                </label>
                              </li>

                              <li className="flex items-center">
                                <input
                                  id="fitbit"
                                  type="checkbox"
                                  checked={filter === "Name"}
                                  onChange={(e) => {
                                    filter === "Name"
                                      ? setfilter("")
                                      : setfilter("Name");
                                  }}
                                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                  for="fitbit"
                                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                  Name
                                </label>
                              </li>
                              <li className="flex items-center">
                                <input
                                  id="razor"
                                  type="checkbox"
                                  value=""
                                  checked={filter === "Type"}
                                  onChange={(e) => {
                                    filter === "Type"
                                      ? setfilter("")
                                      : setfilter("Type");
                                  }}
                                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                  for="razor"
                                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                  Type
                                </label>
                              </li>

                              <li className="flex items-center">
                                <input
                                  id="benq"
                                  type="checkbox"
                                  value=""
                                  checked={filter === "ResourceRecords"}
                                  onChange={(e) => {
                                    filter === "ResourceRecords"
                                      ? setfilter("")
                                      : setfilter("ResourceRecords");
                                  }}
                                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                />
                                <label
                                  for="benq"
                                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                  Value
                                </label>
                              </li>
                            </ul>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-4 py-3">
                            Zone Id
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Name
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Type
                          </th>
                          <th scope="col" className="px-4 py-3">
                            TTL
                          </th>
                          <th scope="col" className="px-4 py-3">
                            DNNSEC Status
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Value
                          </th>
                          <th scope="col" className="px-4 py-3">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {displaydata
                          .slice(
                            (currentpage - 1) * maxele,
                            currentpage * maxele
                          )
                          .map((val, index) => (
                            <tr className="border-b dark:border-gray-700">
                              <th
                                scope="row"
                                className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                {val.hostedZoneId}
                              </th>
                              <td className="px-4 py-3">{val.Name}</td>
                              <td className="px-4 py-3">{val.Type}</td>
                              <td className="px-4 py-3">{val.TTL}</td>
                              <td className="px-4 py-3">
                                <div className="flex justify-center items-center h-full">
                                  {val.DNSSECSTATUS === "SIGNING" ? (
                                    <span
                                      onClick={(e) =>
                                        dnssechandler(
                                          e,
                                          "DISABLE",
                                          val.hostedZoneId
                                        )
                                      }
                                      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                    >
                                      {val.DNSSECSTATUS}
                                    </span>
                                  ) : (
                                    <span
                                      onClick={(e) =>
                                        dnssechandler(
                                          e,
                                          "ENABLE",
                                          val.hostedZoneId
                                        )
                                      }
                                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                      {val.DNSSECSTATUS}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="px-4 py-3">
                                <span>
                                  {val.ResourceRecords.map(
                                    (innerval, index) => (
                                      <div key={index}>{innerval.Value}</div>
                                    )
                                  )}
                                </span>
                              </td>
                              <td className="px-4 py-3 flex items-center justify-end">
                                <button
                                  onClick={() =>
                                    handleactioneditdelete(
                                      `${val.hostedZoneId}-${
                                        index + (currentpage - 1) * maxele
                                      }-dropdown-button`
                                    )
                                  }
                                  className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                  type="button"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                  </svg>
                                </button>
                                {actioneditdelete ===
                                `${val.hostedZoneId}-${
                                  index + (currentpage - 1) * maxele
                                }-dropdown-button` ? (
                                  <div
                                    id={`${val.hostedZoneId}-${
                                      index + (currentpage - 1) * maxele
                                    }-dropdown`}
                                    className="z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                    style={{
                                      position: "absolute",
                                      marginRight: "2rem",
                                    }}
                                  >
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                      <li
                                        onClick={(e) =>
                                          handleEditClick(
                                            e,
                                            val.hostedZoneId,
                                            val.Name,
                                            val.Type,
                                            val.ResourceRecords,
                                            val.TTL
                                          )
                                        }
                                      >
                                        <a
                                          className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                          class="block  focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center  hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 "
                                          type="button"
                                        >
                                          Edit
                                        </a>
                                      </li>
                                      <li
                                        onClick={(e) =>
                                          handleDelete(
                                            e,
                                            val.hostedZoneId,
                                            val.Name,
                                            val.Type,
                                            val.ResourceRecords,
                                            val.TTL
                                          )
                                        }
                                      >
                                        <a
                                          className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                          class="block  focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700  "
                                          type="button"
                                        >
                                          Delete
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <nav
                    className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
                    aria-label="Table navigation"
                  >
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Showing
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {`${(currentpage - 1) * maxele + 1} - ${Math.min(
                          currentpage * maxele,
                          displaydata.length
                        )}`}
                      </span>
                      of
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {displaydata.length}
                      </span>
                    </span>
                    <ul className="inline-flex items-stretch -space-x-px">
                      <li onClick={(e) => handlepagination(e, 1)}>
                        <a className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          <span className="sr-only">Previous</span>
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </a>
                      </li>
                      {currentpage > 1 ? (
                        <li
                          onClick={(e) => handlepagination(e, currentpage - 1)}
                        >
                          <a className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            {currentpage - 1}
                          </a>
                        </li>
                      ) : (
                        ""
                      )}
                      <li>
                        <a
                          aria-current="page"
                          className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                        >
                          {currentpage}
                        </a>
                      </li>
                      {currentpage * maxele < displaydata.length ? (
                        <li
                          onClick={(e) => handlepagination(e, currentpage + 1)}
                        >
                          <a className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            {currentpage + 1}
                          </a>
                        </li>
                      ) : (
                        ""
                      )}

                      <li
                        onClick={(e) =>
                          handlepagination(
                            e,
                            Math.floor(dnsdata.length / maxele)
                          )
                        }
                      >
                        <a className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          <span className="sr-only">Next</span>
                          <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </nav>

                  {modalhandler ? (
                    <div
                      tabindex="-1"
                      class="block fixed  overflow-x-hidden  top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
                      style={{
                        paddingTop: "4rem",
                        paddingLeft: "40rem",
                      }}
                    >
                      <div class="relative p-4 w-full max-w-md max-h-full">
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                              Add Record
                            </h3>
                            <button
                              onClick={(e) => closingthemodal(e)}
                              type="button"
                              class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              <svg
                                class="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                              </svg>
                              <span class="sr-only">Close modal</span>
                            </button>
                          </div>
                          <div class="p-4 md:p-5">
                            <form class="space-y-4" action="#">
                              <div>
                                <label
                                  htmlFor="HostedZoneId"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  HostedZoneId
                                </label>
                                <input
                                  disabled={editmode}
                                  type="HostedZoneId"
                                  name="HostedZoneId"
                                  id="HostedZoneId"
                                  placeholder="HostedZoneId"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  required
                                  value={hostedZoneId}
                                  onChange={(e) =>
                                    setHostedZoneId(e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="recordName"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Record Name
                                </label>
                                <input
                                  disabled={editmode}
                                  type="recordName"
                                  name="recordName"
                                  id="recordName"
                                  placeholder="Record Name"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  required
                                  value={recordName}
                                  onChange={(e) =>
                                    setRecordname(e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="recordtype"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Record Type
                                </label>
                                <input
                                  disabled={editmode}
                                  type="recordtype"
                                  name="recordtype"
                                  id="recordtype"
                                  placeholder="Record Type"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  required
                                  value={recordType}
                                  onChange={(e) =>
                                    setRecordType(e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="password"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  Record Value
                                </label>
                                <input
                                  type="recordvalue"
                                  name="recordvalue"
                                  id="recordvalue"
                                  placeholder="recordvalue"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  required
                                  value={recorValue
                                    .map((obj) => obj.Value)
                                    .join(", ")} // Join the 'Value' properties of each object
                                  onChange={(e) => {
                                    const values = e.target.value.split(", ");
                                    setRecordValue(
                                      values.map((value) => ({
                                        Value: value,
                                      }))
                                    );
                                  }} // Split the input value into an array
                                />
                              </div>
                              <div>
                                <label
                                  htmlFor="TTL"
                                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                  TTL
                                </label>
                                <input
                                  disabled={editmode}
                                  type="TTL"
                                  name="TTL"
                                  id="TTL"
                                  placeholder="TTL"
                                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                  required
                                  value={ttl}
                                  onChange={(e) => setTTL(e.target.value)}
                                />
                              </div>
                              <div class="flex justify-between"></div>
                              <button
                                onClick={
                                  editmode
                                    ? (e) => editChangeHandle(e)
                                    : (e) => addRecordHandle(e)
                                }
                                type="submit"
                                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                              >
                                {editmode ? "Edit Record" : "Add Record"}
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
