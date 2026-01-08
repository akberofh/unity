import React from 'react';
import aboutimg from './Без названия (17).png'

// İkonları əlavə etmək üçün, Heroicons-u quraşdırıb buraya idxal etmək daha düzgün olardı.
// Məsələn: import { CheckCircleIcon, LightningBoltIcon, ClipboardListIcon } from '@heroicons/react/24/outline';
// Ancaq sizin nümunədə sadə SVG kodu istifadə edildiyi üçün onu saxlayıram.

const About = () => {
  return (
    // Ümumi bölməyə padding və fon rəngi əlavə edirik ki, yaxşı görünsün
    <section className="py-16 md:py-24 bg-gray-50"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* SOL TƏRƏF: Missiya və Məqsəd Mətni */}
          <div className="mb-10 lg:mb-0">
            <p className="text-sm font-semibold text-pink-600 uppercase tracking-widest">
              Biz Kimik?
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Qadınların gücləndirilməsi və cəmiyyətdə liderliyi
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              UnityWomen, Azərbaycanda qadınların sosial, iqtisadi və mədəni inkişafını dəstəkləyən qeyri-kommersiya təşkilatıdır. Biz hər bir qadının potensialını reallaşdırmasına və cəmiyyətin inkişafında aktiv rol oynamasına şərait yaradırıq.
            </p>

            <div className="mt-8 space-y-4">
              {/* Maddə 1: Təlim və Mentorluq */}
              <div className="flex items-start">
                <svg className="flex-shrink-0 h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 111.955 0 0112 2.5a11.955 111.955 0 01-8.618 3.484M12 22a10 10 0 100-20 10 10 0 000 20z"></path>
                </svg>
                <p className="ml-3 text-base text-gray-700 font-medium">
                  Təlim və Mentorluq Proqramları
                </p>
              </div>
              {/* Maddə 2: İqtisadi Müstəqillik */}
              <div className="flex items-start">
                <svg className="flex-shrink-0 h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <p className="ml-3 text-base text-gray-700 font-medium">
                  İqtisadi Müstəqilliyin Dəstəklənməsi
                </p>
              </div>
              {/* Maddə 3: Sosial Layihələr */}
              <div className="flex items-start">
                <svg className="flex-shrink-0 h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v-2a2 2 0 012-2h12a2 2 0 012 2v2M8 12h8"></path>
                </svg>
                <p className="ml-3 text-base text-gray-700 font-medium">
                  Sosial Layihələrə Cəlb Olunma
                </p>
              </div>
            </div>

            {/* CTA (Çağırış) Düyməsi */}
            <div className="mt-10">
              <a href="/fealiyyetlerimiz" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 transition duration-300">
                Fəaliyyətlərimizə Baxın
              </a>
            </div>
          </div>

          {/* SAĞ TƏRƏF: Təsir Statistikası və Şəkil */}
          <div className="mt-10 lg:mt-0">
            <div className="relative">
              <img className="w-full h-81 object-cover rounded-xl shadow-2xl"
                src={aboutimg}
                alt="UnityWomen Fəaliyyəti"
              />

              {/* Statistika Counter Bloku */}
              <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-xl border border-gray-100 w-11/12">
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-3xl font-bold text-pink-600">35+</p>
                    <p className="text-sm text-gray-500">Uğurlu Layihə</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-pink-600">9K+</p>
                    <p className="text-sm text-gray-500">Dəstəklənən Qadın</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-pink-600">7</p>
                    <p className="text-sm text-gray-500">İllik Təcrübə</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About; 