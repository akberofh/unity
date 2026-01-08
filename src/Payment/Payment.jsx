import React, { useEffect, useRef, useState } from 'react';
import { useGetTodosQuery } from '../redux/slices/productApiSlice';
import { setTodos } from '../redux/slices/productSlice';
import { useDispatch } from 'react-redux';
import { useAddPaymenttMutation } from '../redux/slices/paymentApiSlice';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const Payment = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const [name, setName] = useState('');
  const [kuriyer, setKuriyer] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [adress, setAdress] = useState('');
  const [poct, setPoct] = useState('');
  const [city, setCity] = useState('');
  const [photo, setPhoto] = useState(null);
  const [poctType, setPoctType] = useState('');
  const [poctAddress, setPoctAddress] = useState('');
  const [kargoData, setKargoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [manyData, setManyData] = useState([]);
  const location = useLocation();
  const confirmedCartId = new URLSearchParams(location.search).get("confirmedCartId");
  const [addPaymentt] = useAddPaymenttMutation();
  const navigate = useNavigate();




  useEffect(() => {
    // manyData'yı API'den çek
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/many`)
      .then(res => res.json())
      .then(data => setManyData(data))
      .catch(err => console.error("Many API hatası:", err));
  }, []);


  useEffect(() => {
    if (confirmedCartId) {
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/product/payment/${confirmedCartId}`)
        .then(res => {
          setData(res.data.products);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [confirmedCartId]);




  useEffect(() => {
    const fetchKargoData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/kargo`);
        const data = await response.json();
        setKargoData(data);
      } catch (error) {
        console.error('Kargo verileri alınamadı:', error);
      }
    };

    if (poctType === 'Kargo') {
      fetchKargoData();
    }
  }, [poctType]);



  useEffect(() => {
    if (data) {
      dispatch(setTodos(data));
    }
  }, [data, dispatch]);






  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('kuriyer', kuriyer);
      formData.append('city', city);
      formData.append('confirmedCartId', confirmedCartId);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('description', description);
      formData.append('adress', adress);

      const selectedMany = manyData.find(m => m.titla?.toLowerCase().includes(poctType.toLowerCase()));
      const priceText = selectedMany ? selectedMany.titla : '';

      // ŞU KISIM ÖNEMLİ ⬇
      if (poctType === "Kuryer" || poctType === "Poçt" || poctType === "Kargo") {
        formData.append('poct', `${poctType}: ${poctAddress} , ${priceText}`);
      } else {
        formData.append('poct', poctType); // mağazadan götürmə
      }

      if (photo) formData.append('photo', photo);

      const newPayment = await addPaymentt(formData).unwrap();

      setTimeout(() => {
        dispatch({ type: 'payment/addPayment', payload: newPayment });
      }, 1000);

      navigate('/confirmed');
    } catch (err) {
      console.error('Failed to add the payment:', err);
    }
  };

  const getDeliveryPrice = (manyData, poctType) => {
    if (!poctType) return 0;

    const selectedDelivery = manyData.find(m =>
      m.titla?.toLowerCase().includes(poctType.toLowerCase())
    );


    if (!selectedDelivery?.titla) return 0;

    const match = selectedDelivery.titla.match(/(\d+)\s*AZN/);
    return match ? parseInt(match[1], 10) : 0;
  };


  return (
    <div className="flex justify-between border max-w-7xl min-h-[740px] dark:bg-black mx-auto p-5 gap-5 flex-wrap">
      {/* Left Panel */}
      <div className="flex-1 p-5 rounded-lg dark:bg-black shadow-lg w-full sm:w-2/3 lg:w-2/3">
        <div className="flex justify-between mb-5">
          {['Faktura ünvanı', 'Çatdırılma ünvanı', 'Ödəniş'].map((label, idx) => (
            <div
              key={label}
              className={`flex-1 text-center py-2 border border-[#b87333] rounded-md font-bold ${step === idx + 1 ? 'bg-[#b87333] text-white' : 'text-[#b87333]'}`}
            >
              {idx + 1}. {label}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Faktura Ünvanı</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ad:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Soyad:</label>
                <input
                  type="text"
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email:</label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="adress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ünvan:</label>
                <input
                  type="text"
                  id="adress"
                  value={adress}
                  onChange={(e) => setAdress(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefon nömrəsi:
                </label>
                <div className="flex items-center">
                  <select
                    id="region-code"
                    value="+994"
                    className="mr-3 w-24 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                    disabled
                  >
                    <option value="+994">+994</option>
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                    placeholder="Telefon nömrəsini daxil edin"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Şəhər:</label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Not:</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className={`bg-[#b87333] text-white py-2 px-6 rounded-md hover:bg-[#a0652e] mt-6 float-right ${!name || !surname || !email || !adress || !phone || !city || !description ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={!name || !surname || !email || !adress || !phone || !city || !description}
              >
                Davam et →
              </button>
            </form>
          </div>


        )}

        {step === 2 && (
          <div className="min-h-96">
            <h2 className="text-xl font-semibold mb-4">Çatdırılma ünvanı</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="kuriyer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Çatdırılma Növü:
                </label>
                <select
                  id="kuriyer"
                  value={poctType}
                  onChange={(e) => setPoctType(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seçin</option>
                  <option value="Kuryer">Kuryer</option>
                  <option value="Kargo">Kargo</option>
                  <option value="Poçt">Poçt</option>
                  <option value="Mağazadan götürmə">Mağazadan götürmə</option>
                </select>

                {/* Seçilen tür için manyData'dan bilgi göster */}
                {(poctType === "Kuryer" || poctType === "Kargo" || poctType === "Poçt") && (
                  <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Seçilən Çatdırılma Növünün Zəhmət Haqqı:</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {
                        manyData.find(m => m.titla?.toLowerCase().includes(poctType.toLowerCase()))?.titla
                        || "Bu növ üçün məlumat tapılmadı."
                      }
                    </p>
                  </div>
                )}

                {/* Kargo seçildiyse adres seçimi */}
                {poctType === "Kargo" && (
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Axtar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                    />
                    <ul className="mt-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800">
                      {kargoData
                        .filter((item) =>
                          item.title?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((item, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setPoctAddress(item.title);
                              setSearchTerm(item.title);
                            }}
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                          >
                            {item.title}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Kuryer veya Poçt için adres girişi */}
                {(poctType === "Kuryer" || poctType === "Poçt") && (
                  <input
                    type="text"
                    placeholder="Ünvan daxil edin..."
                    value={poctAddress}
                    onChange={(e) => setPoctAddress(e.target.value)}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b87333] focus:border-[#b87333] dark:bg-gray-700 dark:text-white"
                  />
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-md"
                >
                  ← Geri
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className={`bg-[#b87333] text-white py-2 px-4 rounded-md hover:bg-[#a0652e] ${!poctType ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={!poctType}
                >
                  Davam et →
                </button>
              </div>
            </form>
          </div>
        )}


        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Ödəniş</h2>
            <form>

              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xl mx-auto mt-8 border border-gray-200">
                <label htmlFor="photo" className="block text-lg font-semibold text-gray-700 mb-2">
                  Son:
                </label>
                <h1 className="text-gray-800 leading-relaxed space-y-2 text-[17px]">
                  <p className="font-semibold text-green-600 text-xl mb-2">
                    Sifariş verdiyiniz üçün təşəkkür edirik!
                  </p>
                  <p>
                    Zəhmət olmasa, sifarişin təsdiqlənməsi və sizə göndərilməsi üçün ödəməni aşağıdakı hesaba edin:
                  </p>
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg my-3 border border-gray-300">
                    <p><span className="font-medium">Kart nömrəsi:</span></p>
                    <p className="text-lg font-bold tracking-wide mt-1">M10 0777205373</p>
                  </div>
                  <p>
                    Ödənişi etdikdən sonra zəhmət olmasa qəbzin şəklini bizimlə paylaşın.
                  </p>
                  <p className="mt-2 text-blue-600 font-medium">Təşəkkür edirik!</p>
                </h1>
              </div>




              <div className="flex justify-between mt-6">
                <button type="button" onClick={() => setStep(2)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-md">
                  ← Geri
                </button>
                <button type="submit" onClick={handleSubmit} className="bg-[#b87333] text-white py-2 px-4 rounded-md hover:bg-[#a0652e]">
                  Ödənişi tamamla
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Right Panel (Order Summary) */}
      <div className="w-full sm:w-1/3 lg:w-1/3 border p-5 rounded-lg shadow-lg mt-5 sm:mt-0">
        <h3 className="text-xl font-semibold mb-4">Sebetdeki mehsullar</h3>
        <div className="container mx-auto p-6 max-h-80 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-gray-600">Yükleniyor...</p>
          ) : (
            data &&
            data.map((product) => (
              <div key={product._id} className="dark:bg-black border shadow-lg rounded-lg p-6 mb-6 flex flex-col sm:flex-row items-center hover:shadow-xl transition-all duration-300 ease-in-out">
                <img
                  src={Array.isArray(product.photo) ? product.photo[0] : product.photo}
                  alt="Thumbnail"
                  className="w-9 h-9 object-cover rounded-full mb-4 sm:mb-0 sm:mr-6 border border-gray-200"
                />
                <div className="w-full flex flex-col items-center sm:items-start">
                  <h6 className="text-sm font-semibold dark:text-white text-gray-800">{product.title}</h6>
                </div>
              </div>
            ))
          )}
        </div>

        <h3 className="text-xl font-semibold mb-4">Sifaris ozeti</h3>
        <div className="container mx-auto p-6">
          {!isLoading && manyData && (
            <div className="dark:bg-black border shadow-lg rounded-lg p-6 mb-6 flex flex-col items-start hover:shadow-xl transition-all duration-300 ease-in-out">
              <h6 className="text-sm font-semibold dark:text-white text-gray-800 mb-2">
                Çatdırılma növü:
                <span className="text-gray-600">
                  {
                    poctType
                      ? (
                        manyData.find(m =>
                          m.titla?.toLowerCase().includes(poctType.toLowerCase())
                        )?.titla || "Seçilməyib"
                      )
                      : "Seçilməyib"
                  }

                </span>
              </h6>


              <p className="text-gray-700 dark:text-white mb-2">
                Çatdırılma qiyməti: <strong>{getDeliveryPrice(manyData, poctType)} ₼</strong>
              </p>


              <p className="text-lg font-bold text-green-700">
                Sifarişin ümumi qiyməti: {
                  (
                    data.reduce((acc, product) => acc + product.price * product.quantity, 0) + getDeliveryPrice(manyData, poctType)
                  ).toFixed(2)
                } ₼
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
