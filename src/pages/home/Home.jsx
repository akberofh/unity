import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from '../../components/header/Header'
// import Chat from '../../components/Chat/Chat'
import Sec from "../../components/SwiperSec/Sec";
import Cart from "../Cart/Cart";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSelector } from "react-redux";


const Home = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );
  const element = document.documentElement;

    const MySwal = withReactContent(Swal);

    const { userInfo } = useSelector((state) => state.auth);

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

   useEffect(() => {
    const justRegistered = localStorage.getItem("justRegistered");

    if (justRegistered && userInfo) {
      MySwal.fire({
        title: `<strong>Təbriklər, ${userInfo.name}!</strong>`,
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <img src="${userInfo.photo}" 
                 alt="Profil Şəkli" 
                 style="border-radius: 50%; width: 100px; height: 100px; object-fit: cover; margin-bottom: 10px;" />

            <p style="margin: 0;"><strong>Email:</strong> ${userInfo.email}</p>

            <p style="margin-top: 10px;">Artıq <strong>Unity Women Fortuna</strong> ailəsinin bir üzvüsünüz! 💫</p>

            <p><strong>Bu, sizin üçün həm şəxsi inkişaf, həm də qazanc yolunun başlanğıcıdır.</strong></p>

            <p style="margin: 10px 0;">📌 <strong>Növbəti addım:</strong><br />
            Uğur yolunda tək deyilsiniz! WhatsApp qrupumuza qoşulun və komandamızla birlikdə ilk qazancınızı qazanmağa başlayın!
            </p>

            <p>
              🔗 <a href="https://chat.whatsapp.com/FohUxmClFmN5SwBunsUydh" target="_blank" 
                    style="color: #1d72f3; font-weight: bold;">WhatsApp Qrupuna Qoşul</a>
            </p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Başla",
        width: 600,
        padding: "1.5rem"
      });

      localStorage.removeItem("justRegistered");
    }
  }, [userInfo]);

  return (
    <div className=" dark:bg-black dark:text-white mt-[270px] text-black overflow-x-hidden">
        <Header theme={theme} setTheme={setTheme} />
        <Sec/>
        {/* <Chat theme={theme}  /> */}
        <Cart theme={theme} />
    </div>
  );
};

export default Home;
