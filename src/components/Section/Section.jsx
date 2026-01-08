import React from "react";

const Section = ({ theme }) => {
  return (
    <section
      className={`flex flex-col md:flex-row items-center p-6 md:p-12 rounded-lg shadow-lg ${
        theme === "dark" ? " bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="md:w-1/2 mb-6 md:mb-0">
        <img
          src="https://via.placeholder.com/400"
          alt="Section Image"
          className="rounded-lg shadow-lg w-full h-auto"
        />
      </div>
      <div className="md:w-1/2 md:pl-8 text-center md:text-left">
        <h2
          className={`text-3xl font-bold mb-4 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Section Başlığı
        </h2>
        <p
          className={`text-lg mb-6 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Bu, başlık ve açıklamadan oluşan bir örnek bölümdür. Bu bölümde
          içeriğinizin kısa bir özetini paylaşabilirsiniz.
        </p>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-full shadow hover:bg-blue-600 transition duration-200"
        >
          Daha Fazla Bilgi
        </button>
      </div>
    </section>
  );
};

export default Section;
