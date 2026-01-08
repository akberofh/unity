import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { FaRegUser } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { MdSubject } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ContactUs.css";

const ContactDetails = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    to_name: "",
    from_name: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const { to_name, from_name, subject, message } = formData;
    if (!to_name || !from_name || !subject || !message) {
      toast.error("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    emailjs
      .sendForm(
        "service_xa06pup",
        "template_agm4rtf",
        form.current,
        "JJCjViGCvTcPh-wqS"
      )
      .then(
        (result) => {
          console.log(result.text);
          toast.success("Message sent successfully!");
        },
        (error) => {
          console.log(error.text);
          toast.error("Failed to send message, please try again.");
        }
      );
    setFormData({
      to_name: "",
      from_name: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="container py-5 dark:bg-black dark:text-white">
      <div className="section-title text-center">
        <h3>Bizimlə Əlaqə</h3>
      </div>
      <div className="content">
        <div className="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d41931.03812315753!2d49.68862913336281!3d40.45908449405504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403085c6361123a1%3A0x9a9061575f8679a1!2zSMSxcmRhbGFu!5e1!3m2!1str!2saz!4v1731673153922!5m2!1str!2saz"
            width="100%"
            height="450"
            frameBorder="0"
            style={{ border: 0 }}
            title="This is Contact Map"
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
          ></iframe>
        </div>
        <div className="form-container border  dark:bg-black dark:text-white">
          <form ref={form} onSubmit={sendEmail}>
            <div className="input-group">
              <div className="input-field">
                <p className="label dark:text-white text-white">Ad Soyad</p>
                <input className="dark:bg-black dark:text-white"
                  type="text"
                  placeholder="Ad Soyadınızı yazın"
                  name="to_name"
                  value={formData.to_name}
                  onChange={handleChange}
                />
                <FaRegUser className="icon" size={20} />
              </div>
              <div className="input-field">
                <p className="label">Email</p>
                <input className="dark:bg-black dark:text-white"
                  type="email"
                  placeholder="Emailinizi yazın"
                  name="from_name"
                  value={formData.from_name}
                  onChange={handleChange}
                />
                <HiOutlineMail className="icon" size={20} />
              </div>
            </div>
            <div className="input-field">
              <p className="label">Kateqoriya</p>
              <input className="dark:bg-black dark:text-white"
                type="text"
                placeholder="Kateqoriya yazın"
                name="kategoriya"
                value={formData.subject}
                onChange={handleChange}
              />
              <MdSubject className="icon" size={20} />
            </div>
            <div className="input-field">
              <p className="label">Not</p>
              <textarea className="dark:bg-black dark:text-white"
                placeholder="Notunuzu yazın"
                name="message"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>
            <input
              type="submit"
              className="submit-button"
              value="Send Message"
            />
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ContactDetails;
