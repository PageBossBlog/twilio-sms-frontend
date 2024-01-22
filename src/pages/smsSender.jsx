import React, { useState, useEffect, useRef } from "react";
import request from "../utils/request";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

const SMSSender = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  //Sms Message
  const [smsMessages, setSmsMessages] = useState(
    JSON.parse(localStorage.getItem("smsMessages")) || []
  );
  const [smsMessage, setSmsMessage] = useState("");

  const [activeAccordion, setActiveAccordion] = useState(null);

  const [activeMessageAccordion, setActiveMessageAccordion] = useState(null);

  const [numbers, setNumbers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [numberCount, setNumberCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const [numberFeedback, setNumberFeedback] = useState("");
  const [smsResponse, setSmsResponse] = useState([]);

  const [errorTextAreaMessage, setErrorTextAreaMessage] = useState("");

  //THIS SMS Sender WAS BUILT BY "PAGEBOSS [https://t.me/pageboss] OWNER OF SCAMPAGESHOP [www.scampage.shop]" and has AES 256-bit encryption. Any adjustments to the code would break it//

  //Do not touch this section

  //If you want to get quality:
  // - USA Banks Scampage
  // - UK Banks Scampage
  // - Australian Scampage
  // - Canadian Scampage
  // - Crypto Websites Scampage
  // - Email Accounts Scampage
  // - Newsletter Scampage and more..

  // Visit: https://www.scampage.shop/

  const [formData, setFormData] = useState({
    accountSid: "",
    authToken: "",
    messagingSid: "",
    twilioNumber: "",
  });

  const MAX_TWILIO_CONFIGURATIONS = 20;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const [twilioConfigurations, setTwilioConfigurations] = useState(
    JSON.parse(localStorage.getItem("twilioConfigurations")) || []
  );

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const addNewTwilioAccount = (event) => {
    event.preventDefault();

    const { accountSid, authToken, messagingSid, twilioNumber } = formData;

    // Validate input fields
    if (!accountSid || !authToken || !messagingSid || !twilioNumber) {
      toast.error("Please fill in all fields");
      return;
    }

    // Create a new Twilio configuration object with a unique id
    const newTwilioConfig = {
      id: new Date().toISOString(), // Unique id based on timestamp
      accountSid,
      authToken,
      messagingSid,
      twilioNumber,
    };

    if (twilioConfigurations?.length < MAX_TWILIO_CONFIGURATIONS) {
      const updatedConfigurations = [...twilioConfigurations, newTwilioConfig];

      setTwilioConfigurations(updatedConfigurations);
      localStorage.setItem(
        "twilioConfigurations",
        JSON.stringify(updatedConfigurations)
      );

      setFormData({
        accountSid: "",
        authToken: "",
        messagingSid: "",
        twilioNumber: "",
      });

      setIsAddModalOpen(false);
    } else {
      toast.error("Maximum limit of Twilio configurations reached (20)");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRows = twilioConfigurations.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const openEditModal = (id) => {
    const newRow = twilioConfigurations.find((row) => row.id === id) || {
      id: "",
      accountSid: "",
      authToken: "",
      messagingSid: "",
      twilioNumber: "",
    };

    setIsEditModalOpen(true);
    setSelectedRow(newRow);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedRow({
      id: "",
      accountSid: "",
      authToken: "",
      messagingSid: "",
      twilioNumber: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    //console.log(`handleChange called: ${name} - ${value}`);
    setSelectedRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  const updateTwilioConfiguration = (id, updatedConfig) => {
    const updatedConfigurations = twilioConfigurations.map((config) =>
      config.id === id ? { ...config, ...updatedConfig } : config
    );

    setTwilioConfigurations(updatedConfigurations);
    localStorage.setItem(
      "twilioConfigurations",
      JSON.stringify(updatedConfigurations)
    );

    setIsEditModalOpen(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateTwilioConfiguration(selectedRow.id, selectedRow);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const deleteTwilioConfiguration = (id) => {
    const updatedConfigurations = twilioConfigurations.filter(
      (config) => config.id !== id
    );

    setTwilioConfigurations(updatedConfigurations);
    localStorage.setItem(
      "twilioConfigurations",
      JSON.stringify(updatedConfigurations)
    );

    setIsDeleteModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    deleteTwilioConfiguration(selectedRow.id);
  };

  const download = () => {
    const url =
      "https://mega.nz/file/VqNW3LjQ#coKOfqOvmV43MuOg2BpTCy4U9dE86nwadxGxlqX6QEo";
    window.open(url, "_blank");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        let numberArray = [];

        // Handle only CSV and TXT file types
        if (file.name.endsWith(".csv") || file.type === "text/csv") {
          numberArray = content.split("\n").map((number) => number.trim());
        } else if (file.name.endsWith(".txt") || file.type === "text/plain") {
          numberArray = content.split("\n").map((number) => number.trim());
        } else {
          toast.error(
            "Unsupported file type. Please upload only CSV or TXT files."
          );
          return;
        }

        // Validate sms numbers before setting the state
        if (validateNumbers(numberArray)) {
          setNumbers(numberArray);
          setSelectedFile(file);

          const numberCount = numberArray?.length;
          setNumberCount(numberCount);
        } else {
          toast.error("Invalid numbers/carriers found in this file.");
        }
      };

      reader.readAsText(file);
    }
  };

  // Function to validate phone numbers
  const validateNumbers = (numbers) => {
    const numberRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const number of numbers) {
      if (!numberRegex.test(number)) {
        return false;
      }
    }
    return true;
  };

  const handleRemoveFile = () => {
    setNumbers([]);
    setSelectedFile(null);
    setNumberCount(0);
    document.getElementById("file_input").value = "";
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const toggleMessageAccordion = (index) => {
    setActiveMessageAccordion(activeMessageAccordion === index ? null : index);
  };

  //SMS MESSAGE
  const handleMessage = (e) => {
    e.preventDefault();
    const message = e.target.value.slice(0, 160);
    setSmsMessage(message);

    if (message?.length === 160) {
      setErrorTextAreaMessage("You have reached the 160 character limit.");
    } else {
      setErrorTextAreaMessage("");
    }
  };

  const handleSaveSmsMessage = () => {
    if (smsMessage.trim() === "") {
      toast.error("Please type/paste your SMS.");
      return;
    }
    setSmsMessages((prevSmsMessages) => [...prevSmsMessages, smsMessage]);
    localStorage.setItem(
      "smsMessages",
      JSON.stringify([...smsMessages, smsMessage])
    );
    setSmsMessage("");
  };

  const handleDeleteSmsMessage = (index) => {
    const updatedSmsMessages = [...smsMessages];
    updatedSmsMessages.splice(index, 1);
    setSmsMessages(updatedSmsMessages);
    localStorage.setItem("smsMessages", JSON.stringify(updatedSmsMessages));
  };
  //////////

  const sendSMS = async (e) => {
    e.preventDefault();

    if (!numbers?.length) {
      toast.error("Please upload your phone numbers");
      return;
    }

    if (twilioConfigurations?.length === 0) {
      toast.error("Please add at least one Twilio account");
      return;
    }

    if (!smsMessages) {
      toast.error("You need to add a SMS Message(s)");
      return;
    }

    try {
      const toastId = toast.loading(
        `Sending SMS to ${
          numberCount === 1
            ? `${numberCount.toLocaleString()} number`
            : `${numberCount.toLocaleString()} numbers`
        }`
      );

      const newSMS = {
        twilioAccounts: twilioConfigurations,
        smsList: numbers,
        smsMessage: smsMessages,
      };

      const res = await request.post("/sms", newSMS);

      //console.log(res.data.results);

      //Phone Numbers
      setNumbers([]);
      setSelectedFile(null);
      setNumberCount(0);
      document.getElementById("file_input").value = "";

      // Section: SMS Messages
      setSmsMessages([]);
      localStorage.removeItem("smsMessages");

      setErrorTextAreaMessage("");

      //
      toast.dismiss(toastId);
      setNumberFeedback(res.data.message);
      toast.success(res.data.message);
      setSmsResponse(res.data.results);

      const errorMessage = res.data.results[0]?.error;

      if (
        errorMessage?.includes(
          "SSL routines:ssl3_get_record:wrong version number"
        )
      ) {
        toast.error(`You need to verify your Twilio account.`, {
          duration: 90000,
        });
      } else if (errorMessage?.includes("Twilio error: 452")) {
        toast.error(
          "Twilio account has reached its usage limit. Please try again later.",
          {
            duration: 90000,
          }
        );
      } else if (errorMessage) {
        toast.error("Your Twilio account is currently not sending SMS.", {
          duration: 90000,
        });
      }

      //toast.success("Bulk sms sent successfully");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message);
      }
    }
  };

  const [senderResponse, setSenderResponse] = useState([]);

  const prevSMSResponse = useRef([]);

  useEffect(() => {
    const delay = 500;

    // Check if smsResponse is different from the previous one
    if (
      JSON.stringify(smsResponse) !== JSON.stringify(prevSMSResponse.current)
    ) {
      const timeoutIds = smsResponse.map((_, index) => {
        return setTimeout(() => {
          setSenderResponse((prevSenderResponse) => [
            ...prevSenderResponse,
            smsResponse[index],
          ]);
        }, index * delay);
      });

      // Save the current smsResponse to compare in the next render
      prevSMSResponse.current = smsResponse;

      return () => {
        timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      };
    }
  }, [smsResponse]);

  return (
    <div className="pt-12 pb-10 pl-4 pr-4 bg-white lg:pt-4 sm:pl-10 sm:pr-10 lg:pl-20 lg:pr-20">
      <div>
        <Toaster position="top-center" />
      </div>
      {/* HEADER */}
      <div className="w-full">
        <div className="w-full h-20 md:h-20 2xl:h-24"></div>
        <div className="-mt-2 lg:-mt-2">
          <div className="inline-flex mb-10 text-2xl text-gray-900 font-regular">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 mr-2 fill-blue-600"
            >
              <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
              <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
              <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
            </svg>
            <span>How to use SMS Sender (Twilio)</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {/* ----- 1 ----- */}
            <div className="relative flex font-medium text-gray-900 group items-left justify-left">
              <div className="w-[60px] sm:w-[90px] xl:w-[70px] md:w-[70px] p-2 rounded-lg shadow-md h-[54px] items-left justify-left bg-blue-100">
                <span className="text-4xl font-black text-blue-600">1</span>
              </div>

              <div className="pl-3">
                <div className="text-base font-medium">
                  Add Twilio Account(s)
                </div>
                <div className="font-normal text-gray-500">
                  <span className="text-sm">
                    Input one or more Twilio account details (Max. 20).
                  </span>
                </div>
              </div>
            </div>

            {/* ----- 2 ----- */}
            <div className="relative flex font-medium text-gray-900 group items-left justify-left">
              <div className="w-[60px] sm:w-[90px] xl:w-[70px] md:w-[70px] p-2 rounded-lg shadow-md h-[54px] items-left justify-left bg-blue-100">
                <span className="text-4xl font-black text-blue-600">2</span>
              </div>

              <div className="pl-3">
                <div className="text-base font-medium">Add leads</div>
                <div className="font-normal text-gray-500">
                  <span className="text-sm">
                    Upload your numbers in a CSV/TXT file.
                  </span>
                </div>
              </div>
            </div>

            {/* ----- 3 ----- */}
            <div className="relative flex font-medium text-gray-900 group items-left justify-left">
              <div className="w-[60px] sm:w-[90px] xl:w-[70px] md:w-[70px] p-2 rounded-lg shadow-md h-[54px] items-left justify-left bg-blue-100">
                <span className="text-4xl font-black text-blue-600">3</span>
              </div>

              <div className="pl-3">
                <div className="text-base font-medium">Add message</div>
                <div className="font-normal text-gray-500">
                  <span className="text-sm">
                    Type SMS message (max. 160 characters).
                  </span>
                </div>
              </div>
            </div>

            {/* ----- 4 ----- */}
            <div className="relative flex font-medium text-gray-900 group items-left justify-left">
              <div className="w-[60px] sm:w-[90px] xl:w-[70px] md:w-[70px] p-2 rounded-lg shadow-md h-[54px] items-left justify-left bg-blue-100">
                <span className="text-4xl font-black text-blue-600">4</span>
              </div>

              <div className="pl-3">
                <div className="text-base font-medium">Send SMS</div>
                <div className="font-normal text-gray-500">
                  <span className="text-sm">Send your bulk SMS.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t-2 border-blue-700 rounded-lg">
            <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg">
              <div className="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                <div className="w-full md:w-1/2">
                  <form className="flex items-center">
                    <label htmlFor="simple-search" className="sr-only">
                      Search
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        value={searchTerm}
                        onChange={handleSearch}
                        type="text"
                        id="simple-search"
                        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                        placeholder="Search"
                        required
                      />
                    </div>
                  </form>
                </div>
                <div className="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                  <button
                    onClick={openAddModal}
                    type="button"
                    id="createProductModalButton"
                    data-modal-target="createProductModal"
                    data-modal-toggle="createProductModal"
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z"
                      />
                    </svg>
                    Add Twilio Account
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-4">
                        Account SID
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Auth Token
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Messaging Service SID
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Twilio Number
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchTerm === ""
                      ? twilioConfigurations.map((row, index) => (
                          <tr key={index} className="border-b">
                            <th
                              scope="row"
                              className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap "
                            >
                              {row.accountSid}
                            </th>
                            <td className="px-4 py-3">{row.authToken}</td>
                            <td className="px-4 py-3">{row.messagingSid}</td>
                            <td className="px-4 py-3 max-w-[12rem] truncate">
                              {row.twilioNumber}
                            </td>
                            <td className="flex items-center justify-end px-4 py-3">
                              <button
                                onClick={() => openEditModal(row.id)}
                                type="button"
                                className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6 mr-2 stroke-blue-700"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                  />
                                </svg>
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      : filteredRows.map((row, index) => (
                          <tr key={index} className="border-b ">
                            {/* Render your table cells based on the row data */}
                            <th
                              scope="row"
                              className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap "
                            >
                              {row.accountSid}
                            </th>
                            <td className="px-4 py-3">{row.authToken}</td>
                            <td className="px-4 py-3">{row.messagingSid}</td>
                            <td className="px-4 py-3 max-w-[12rem] truncate">
                              {row.twilioNumber}
                            </td>
                            <td className="flex items-center justify-end px-4 py-3">
                              <button
                                onClick={() => openEditModal(row.id)}
                                type="button"
                                className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center  me-2 mb-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6 mr-2 stroke-blue-700"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                  />
                                </svg>
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            id="createProductModal"
            tabIndex="-1"
            aria-hidden="true"
            className={`${
              isAddModalOpen
                ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                : "hidden"
            } overflow-y-auto`}
          >
            <div className="relative w-full max-w-2xl max-h-full p-4">
              <div className="relative p-4 bg-white rounded-lg shadow sm:p-5">
                <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5 ">
                  <h3 className="text-lg font-semibold text-gray-900 ">
                    Add Twilio Account
                  </h3>
                  <button
                    onClick={closeAddModal}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  "
                    data-modal-target="createProductModal"
                    data-modal-toggle="createProductModal"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <form>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="accountSid"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Account SID
                      </label>
                      <input
                        type="text"
                        name="accountSid"
                        id="accountSid"
                        value={formData.accountSid}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder=""
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="authToken"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Auth Token
                      </label>
                      <input
                        type="text"
                        name="authToken"
                        id="authToken"
                        value={formData.authToken}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder=""
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="messagingSid"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Messaging Service SID (Custom Name)
                      </label>
                      <input
                        type="text"
                        name="messagingSid"
                        id="messagingSid"
                        value={formData.messagingSid}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder=""
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="twilioNumber"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Twilio Number
                      </label>
                      <input
                        type="text"
                        name="twilioNumber"
                        id="twilioNumber"
                        value={formData.twilioNumber}
                        onChange={handleInputChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={addNewTwilioAccount}
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4"
                  >
                    Add new account
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div
            id="updateProductModal"
            tabIndex="-1"
            aria-hidden="true"
            className={`${
              isEditModalOpen && selectedRow
                ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                : "hidden"
            } overflow-y-auto`}
          >
            <div className="relative w-full max-w-2xl max-h-full p-4">
              <div className="relative p-4 bg-white rounded-lg shadow sm:p-5">
                <div className="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5 ">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Update Twilio Account
                  </h3>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    data-modal-toggle="updateProductModal"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>

                <form>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="accountSid"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Account SID
                      </label>
                      <input
                        value={selectedRow?.accountSid}
                        type="text"
                        name="accountSid"
                        id="accountSid"
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="authToken"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Auth Token
                      </label>
                      <input
                        value={selectedRow?.authToken}
                        type="text"
                        name="authToken"
                        id="authToken"
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="messagingSid"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Messaging Service SID (Custom Name)
                      </label>
                      <input
                        value={selectedRow?.messagingSid}
                        type="text"
                        name="messagingSid"
                        id="messagingSid"
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="twilioNumber"
                        className="block mb-2 text-sm font-medium text-gray-900 "
                      >
                        Twilio Number
                      </label>
                      <input
                        value={selectedRow?.twilioNumber}
                        type="text"
                        name="twilioNumber"
                        id="twilioNumber"
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center mt-8 space-x-4">
                    <button
                      type="submit"
                      onClick={handleUpdate}
                      className="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 mr-1 -ml-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                        />
                      </svg>
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={openDeleteModal}
                      className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      <svg
                        className="w-5 h-5 mr-1 -ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div
            id="deleteModal"
            tabIndex="-1"
            aria-hidden="true"
            className={`${
              isDeleteModalOpen
                ? "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                : "hidden"
            } overflow-y-auto`}
          >
            <div className="relative w-full max-w-md max-h-full p-4">
              <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center  "
                  data-modal-toggle="deleteModal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <svg
                  className="text-gray-400 w-11 h-11 mb-3.5 mx-auto"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="mb-4 text-gray-500">
                  Are you sure you want to delete this Twilio account?
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={closeDeleteModal}
                    data-modal-toggle="deleteModal"
                    type="button"
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 hover:text-gray-900 focus:z-10"
                  >
                    No, cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    type="button"
                    className="px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                  >
                    Yes, I'm sure
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-5 lg:grid-cols-3 md:grid-cols-1">
            <div className="col-span-2">
              <div className="items-center justify-center w-full h-full">
                <div className="relative w-full h-full mt-14">
                  <div className="flex flex-row items-center justify-end flex-shrink-0 w-auto space-x-3 space-y-0 sm:w-auto md:w-auto sm:flex-row md:flex-row sm:space-y-0 md:space-y-0 sm:items-center md:items-center sm:space-x-3 md:space-x-3">
                    <button
                      type="button"
                      onClick={download}
                      className="inline-flex items-center mt-4 px-5 py-2.5 text-sm font-medium text-center text-green-800 font-semibold bg-green-200 rounded-lg focus:ring-4 focus:ring-green-800 hover:bg-green-800 hover:text-green-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 mr-2 "
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                        <path d="M5 3v4"></path>
                        <path d="M19 17v4"></path>
                        <path d="M3 5h4"></path>
                        <path d="M17 19h4"></path>
                      </svg>
                      Download Number Generator
                    </button>
                  </div>

                  <div className="relative p-6 mt-4 bg-white border-t-2 border-blue-700 rounded-lg shadow sm:p-5">
                    <div className="p-6 bg-white border border-gray-300 shadow-lg rounded-xl">
                      <p className="text-xl font-semibold text-gray-900">
                        Dashboard
                      </p>
                    </div>

                    <form className="mt-8">
                      <div>
                        <label
                          className="block mb-2 text-base font-medium text-gray-900"
                          htmlFor="file_input"
                        >
                          Upload Leads (.txt or .csv)
                        </label>
                        <input
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                          id="file_input"
                          type="file"
                          accept=".txt, .csv"
                          onChange={handleFileUpload}
                        />

                        <div id="accordion-flush">
                          {/* First Accordion Item */}
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleAccordion(1)}
                              className={`flex items-center justify-between w-full py-2 mt-1 font-medium rtl:text-right border-b text-gray-900 border-gray-700 gap-3 ${
                                activeAccordion === 1 ? "bg-transparent" : ""
                              }`}
                            >
                              <p
                                className={`${
                                  activeAccordion === 1
                                    ? "text-blue-600 font-semibold"
                                    : "font-semibold text-gray-900"
                                }`}
                              >
                                [{numberCount.toLocaleString()} numbers
                                uploaded]
                              </p>
                              <svg
                                className={`w-3 h-3 rotate-180 shrink-0 ${
                                  activeAccordion === 1
                                    ? "transform rotate-180"
                                    : ""
                                }`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5 5 1 1 5"
                                />
                              </svg>
                            </button>
                            {activeAccordion === 1 && (
                              <div className="py-2 border-gray-700">
                                {selectedFile && (
                                  <div className="">
                                    <div className="flex flex-wrap text-xs text-gray-900">
                                      {numbers &&
                                        numbers.map((number, index) => (
                                          <div
                                            key={index}
                                            className="mb-2 mr-2"
                                          >
                                            <span>{number}</span>
                                            {index < numbers?.length - 1 && (
                                              <span>, </span>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                    <button
                                      className="px-3 py-1 mt-2 text-white bg-red-500 rounded hover:bg-red-600"
                                      onClick={handleRemoveFile}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="pt-4 sm:col-span-2">
                          <label
                            htmlFor="content"
                            className="block mb-2 text-base font-medium text-gray-900"
                          >
                            SMS message
                          </label>
                          <div className="block mt-2">
                            <div className="w-full mb-4 border border-gray-300 rounded-lg bg-gray-50">
                              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-300">
                                <button
                                  type="button"
                                  data-tooltip-target="tooltip-fullscreen"
                                  className="p-2 text-gray-900 rounded cursor-pointer sm:ms-auto hover:text-white hover:bg-blue-700"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 19 19"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
                                    />
                                  </svg>
                                  <span className="sr-only">Full screen</span>
                                </button>
                                <div
                                  id="tooltip-fullscreen"
                                  role="tooltip"
                                  className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 transition-opacity duration-300 rounded-lg shadow-sm opacity-0 bg-gray-50 tooltip"
                                >
                                  Show full screen
                                  <div
                                    className="tooltip-arrow"
                                    data-popper-arrow
                                  ></div>
                                </div>
                              </div>
                              <div className="px-4 py-2 bg-white rounded-b-lg">
                                <label htmlFor="editor" className="sr-only">
                                  Send SMS
                                </label>
                                <textarea
                                  id="editor"
                                  rows="3"
                                  value={smsMessage}
                                  onChange={handleMessage}
                                  maxLength={160}
                                  className="block w-full px-0 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300"
                                  required
                                ></textarea>
                                {errorTextAreaMessage && (
                                  <p
                                    className="items-end mt-1 text-sm text-end"
                                    style={{ color: "red" }}
                                  >
                                    {errorTextAreaMessage}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <button
                                type="button"
                                className="flex items-center px-4 py-1.5 mb-2 text-sm font-medium text-center text-green-900 bg-green-200 rounded-lg"
                                onClick={handleSaveSmsMessage}
                              >
                                Add sms to rotation
                              </button>
                              <div id="accordion-flush">
                                {smsMessages
                                  .reverse()
                                  .map((smsMessage, index) => (
                                    <div key={index}>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          toggleMessageAccordion(index)
                                        }
                                        className={`flex items-center justify-between w-full py-2 mt-1 font-medium rtl:text-right border-b text-gray-900 border-gray-700 gap-3 ${
                                          activeMessageAccordion === index
                                            ? "bg-transparent"
                                            : ""
                                        }`}
                                      >
                                        <p
                                          className={`${
                                            activeMessageAccordion === index
                                              ? "text-blue-600 font-semibold"
                                              : "font-semibold text-gray-900"
                                          }`}
                                        >
                                          {String(smsMessage).slice(0, 15)}
                                        </p>
                                        <svg
                                          className={`w-3 h-3 shrink-0 ${
                                            activeMessageAccordion === index
                                              ? "transform rotate-180"
                                              : ""
                                          }`}
                                          aria-hidden="true"
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 10 6"
                                        >
                                          <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d={`M9 5 5 1 1 5 ${
                                              activeMessageAccordion === index
                                                ? "Z"
                                                : ""
                                            }`}
                                          />
                                        </svg>
                                      </button>
                                      {activeMessageAccordion === index && (
                                        <div className="py-2 border-gray-700">
                                          <span className="inline-flex mt-2">
                                            {String(smsMessage)}

                                            <button>
                                              <svg
                                                onClick={() =>
                                                  handleDeleteSmsMessage(index)
                                                }
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6 ml-1 stroke-red-600"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                />
                                              </svg>
                                            </button>
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={sendSMS}
                        className="inline-flex w-full justify-center mt-10 items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-900 hover:bg-blue-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 mr-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                          />
                        </svg>
                        Send SMS
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="items-center justify-center w-full h-full lg:pt-14 xl:pt-14">
                <div className="relative w-full h-full mt-14">
                  <div className="relative p-6 mt-4 bg-white border-t-2 border-blue-700 rounded-lg shadow sm:p-5">
                    <div className="p-6 bg-white border border-gray-300 shadow-lg rounded-xl">
                      <p className="mb-2 text-xl font-semibold text-gray-900">
                        Sender Response:
                      </p>
                      {/*<p className="font-semibold text-green-700">
                          {numberFeedback}
                        </p>
                      */}

                      <hr className="h-px mt-2 border-gray-300 border-1"></hr>

                      <div className="mt-2 max-h-[400px] overflow-y-auto">
                        {senderResponse.map((sms, index) => (
                          <div key={index} className="">
                            <p>
                              SMS to {sms.phoneNumber} {" => "}
                              <span
                                className={
                                  sms.status === "failed"
                                    ? "text-red-500 uppercase font-semibold"
                                    : "text-green-500 uppercase font-semibold"
                                }
                              >
                                {sms.status}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSSender;