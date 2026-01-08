import React, { useEffect, useState } from 'react'
import Header from '../header/Header'
import ContactUsDetails from './ContactDetails'
import './ContactUs.css'
import AOS from "aos";
import "aos/dist/aos.css";

const ContactComp = () => {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const element = document.documentElement;

  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);
  return (
    <div  className="bg-white dark:bg-black h-[750px] mt-[270px] dark:text-black text-black overflow-x-hidden" >
        <Header theme={theme} setTheme={setTheme}  />
        <ContactUsDetails theme={theme}  />
    </div>
  )
}

export default ContactComp