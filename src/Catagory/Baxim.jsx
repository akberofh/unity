import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import EtirComment from './Commet/EtirComment';
import { useDispatch, useSelector } from 'react-redux';
import { useAddTodoMutation } from "../redux/slices/productApiSlice";


const Baxim = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { catagory } = useParams(); // URL'den kategori bilgisini alıyoruz
    const navigate = useNavigate();
      const [addTodo] = useAddTodoMutation();
        const dispatch = useDispatch();
      
    

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);
   

    const { userInfo } = useSelector((state) => state.auth);

 

    useEffect(() => {
        const fetchItems = async () => {
          try {
            let url = `${process.env.REACT_APP_API_BASE_URL}/api/qolbaq/catagory/${catagory}`;
      
            if (userInfo && userInfo._id) {
              url += `/${userInfo._id}`;
            }
      
            const res = await axios.get(url);
            setItems(res.data.allQolbaq);
          } catch (error) {
            if (error.response && error.response.status === 404) {
              setItems([]);
            } else {
              setError(error.message);
            }
          } finally {
            setLoading(false);
          }
        };
      
        fetchItems();
      }, [catagory, userInfo]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Yüklənir...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen">Xəta: {error}</div>;
    }

      const handleAddToCart = async (item) => {
    try {
      const itemWithDetails = { productId: item._id };

      const newTodo = await addTodo(itemWithDetails).unwrap();

      // Redux'a ekle
      dispatch({ type: "product/addTodo", payload: newTodo });

            alert("Məhsul səbətə yükləndi.");


    } catch (err) {
      console.error("Ürün sepete eklenemedi:", err);
      alert("Ürün sepete eklenemedi. Lütfen tekrar deneyin.");
    }
  };

    return (
<div className="container mx-auto py-12 px-4">
  <h1
    className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white"
    data-aos="fade-up"
  >
    {catagory} Kategorisi
  </h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
    {items.length > 0 ? (
      items.map((item) => (
        <div
          key={item._id}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 transition duration-300 hover:shadow-xl"
          data-aos="fade-up"
        >
          <div className="flex justify-center mb-4 w-full">
            {Array.isArray(item.photo) && item.photo.length > 0 ? (
              <div className="relative w-full h-60">
                <img
                  src={item.photo[0]}
                  alt="item"
                  className="object-cover w-full h-full rounded-xl cursor-pointer"
                  onClick={() => navigate(`/product/${item._id}`)}
                />
              </div>
            ) : (
              <div className="w-full h-60 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl">
                <span className="text-gray-400">Şəkil yoxdur</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
            {item.title}
          </h3>

          <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
            Qiymət:{" "}
            {item.discountApplied ? (
              <>
                <span className="text-red-500 line-through mr-2">
                  {item.originalPrice}₼
                </span>
                <span className="text-green-500 font-semibold">{item.price}₼</span>
              </>
            ) : (
              <span className="font-semibold">{item.price}₼</span>
            )}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/product/${item._id}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Məhsul Haqqında
            </button>

            <button
              onClick={() => handleAddToCart(item)}
              disabled={item.stock === 0}
              className={`py-2 rounded-lg text-white text-center transition duration-200 ${
                item.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {item.stock === 0 ? "Stokda Yoxdur" : "Səbətə Əlavə Et"}
            </button>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center col-span-full text-gray-500 dark:text-gray-300">
        Məhsul yoxdur.
      </div>
    )}
  </div>

  <EtirComment />
</div>

    );
};

export default Baxim;
