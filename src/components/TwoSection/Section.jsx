// src/components/Section/Section.js

import React from "react";

const Section = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center bg-gray-900  dark:bg-black dark:text-white p-8 md:p-16 gap-8 md:gap-12 rounded-lg shadow-lg">
      {/* Sol Taraf: Görsel */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src="https://www.bmw.co.id/content/dam/bmw/common/all-models/3-series/sedan/2022/navigation/bmw-3-series-sedan-lci-modelfinder.png"
          alt="Sample"
          className="rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Sağ Taraf: Metin */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h2 className="text-3xl  dark:bg-black dark:text-white md:text-4xl font-bold mb-4">Bölüm Başlığı</h2>
        <p className="-300 mb-6">
          Bu örnek bir bölüm içeriğidir. Bu bölümü, bir açıklama metni, başlık ve
          görsel ile birlikte kullanabilirsiniz. Kullanıcı dostu ve modern bir
          arayüz ile içeriklerinizi etkili bir şekilde sunabilirsiniz.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700  font-semibold py-2 px-6 rounded-md shadow-md transition-colors duration-200">
          Daha Fazla Bilgi
        </button>
      </div>
    </section>
  );
};

export default Section;
