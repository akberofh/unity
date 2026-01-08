import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Payment from "./Payment";
import Header from "../components/header/Header";

const PaymentDetal = () => {
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

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className=" dark:bg-black dark:text-white mt-[270px] text-black overflow-x-hidden">
      <Header theme={theme} setTheme={setTheme} />
      <Payment theme={theme} setTheme={setTheme}/>
      
    </div>

  );
}

export default PaymentDetal;
