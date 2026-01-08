import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation, Autoplay, Pagination } from "swiper/modules";

const Sec = () => {
const images = [
    "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=80&w=1000&auto=format&fit=crop", // Stil ve Ayakkabı
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop", // Karizmatik Duruş
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop", // Sneaker/Giyim
    "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=1000&auto=format&fit=crop", // Takım Elbise Detay
    "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=1000&auto=format&fit=crop", // Teknoloji ve Stil
  ];

  const sidePhotos = [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop", // Birlik/Topluluk Ruhu
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop", // Gülümseyen Erkek Grubu
  ];

  return (
    <section className="py-16 px-4 md:px-12 bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-500">
      {/* Başlık Tasarımı */}
      <div className="text-center mb-16 relative">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-white uppercase italic">
          UnityMan <span className="text-blue-600">Vizyonu</span>
        </h2>
        <div className="w-24 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]"></div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-wrap lg:flex-nowrap gap-10">
        
        {/* Ana Slider Alanı */}
        <div className="w-full lg:w-[65%] order-2 lg:order-1">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 35,
              stretch: 0,
              depth: 150,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            speed={1200}
            loop={true}
            navigation={true}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Autoplay, Navigation, Pagination]}
            className="unity-swiper h-[450px] md:h-[550px]"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index} className="max-w-[300px] md:max-w-[450px]">
                <div className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-white/10 shadow-2xl group">
                  <img
                    src={src}
                    alt={`UnityMan ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay Gradien */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-6 left-6">
                    <span className="text-white text-sm font-bold tracking-widest bg-blue-600/80 px-3 py-1 rounded">UM-{index + 1}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Sağ Taraf - Sabit Vitrin Fotoğrafları */}
        <div className="w-full lg:w-[35%] flex flex-col gap-8 order-1 lg:order-2">
          {sidePhotos.map((src, index) => (
            <div
              key={index}
              className="relative group h-[210px] md:h-[260px] overflow-hidden rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800"
            >
              <img
                src={src}
                alt={`Premium ${index + 1}`}
                className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
              />
              {/* Modern Hover Kartı */}
              <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 px-4">
                  <p className="text-white font-bold text-xl tracking-wider uppercase">UnityMan Koleksiyon</p>
                  <div className="h-0.5 w-12 bg-white mx-auto mt-2"></div>
                </div>
              </div>
            </div>
          ))}
          
      
        </div>
      </div>

      {/* Global Swiper Özelleştirme */}
      <style jsx global>{`
        .unity-swiper .swiper-button-next,
        .unity-swiper .swiper-button-prev {
          color: #2563eb !important;
          background: rgba(255, 255, 255, 0.1);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(5px);
          transition: all 0.3s;
        }
        .unity-swiper .swiper-button-next:after,
        .unity-swiper .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
        .unity-swiper .swiper-pagination-bullet-active {
          background: #2563eb !important;
          width: 25px;
          border-radius: 5px;
        }
      `}</style>
    </section>
  );
};

export default Sec;