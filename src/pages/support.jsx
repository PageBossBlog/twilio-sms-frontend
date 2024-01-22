import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

const Support = () => {
  const [fromEmail, setFromEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleFromEmail = (e) => {
    setFromEmail(e.target.value);
  };

  const handleSubject = (e) => {
    setSubject(e.target.value);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const sendSupportEmail = async (e) => {
    e.preventDefault();

    try {
      const supportRequest = {
        from_email: fromEmail,
        subject: subject,
        message: message,
      };

      setFromEmail("");
      setSubject("");
      setMessage("");

      emailjs
        .send(
          "service_joxnicf",
          "template_m9r0noy",
          supportRequest,
          "xoCpMT7SsEiW1YiW2"
        )
        .then(
          (result) => {
            console.log(result);

            toast.success("Support email sent!", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          },
          (error) => {
            toast.error(error);
          }
        );
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <section className="pt-32 pb-40 bg-white lg:pb-20">
      <div>
        <Toaster position="top-center" />
      </div>
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">
          Contact Us
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 sm:text-xl">
          Facing a problem with the sender? Need a new feature? Let me know.
        </p>
        <form action="#" className="space-y-8">
          <div>
            <label
              for="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your email
            </label>
            <input
              type="email"
              id="from_email"
              name="from_email"
              placeholder="Enter your email address"
              required
              value={fromEmail}
              onChange={handleFromEmail}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label
              for="subject"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Let us know how we can help you"
              required
              value={subject}
              onChange={handleSubject}
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              for="message"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              placeholder="Leave a message..."
              value={message}
              onChange={handleMessage}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <button
            onClick={sendSupportEmail}
            type="submit"
            className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-700 sm:w-fit hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Support;