import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddTodoMutation } from "../../redux/slices/productApiSlice";
import { useAddsTodoMutation } from "../../redux/slices/todoApiSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";

const Cart = () => {
  const dispatch = useDispatch();
  const [addTodo] = useAddTodoMutation();
  const [addTodoo] = useAddsTodoMutation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1); // Sayfa durumu
  const [hasMore, setHasMore] = useState(true); // Yeni ürün var mı kontrolü


  const { userInfo } = useSelector((state) => state.auth);


  const fetchData = async () => {
    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/api/pagination`;

      if (userInfo && userInfo._id) {
        url += `/${userInfo._id}?page=${page}`;
      } else {
        url += `?page=${page}`;
      }

      const response = await axios.get(url);
      const newData = response.data.allPagination;

      setData((prevData) => [...prevData, ...newData]);
      setHasMore(page < response.data.totalPages);
    } catch (error) {
      console.error("Veri alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  // "Daha Fazla Göster" butonuna tıklandığında sayfayı arttır
  const loadMore = () => {
    if (hasMore) setPage((prev) => prev + 1); // Sayfayı bir arttır
  };

  // Sepete ürün ekleme işlemi
  const handleAddToCart = async (product) => {
    try {
      const itemWithDetails = { productId: product._id };

      const newTodo = await addTodo(itemWithDetails).unwrap();

      // Redux'a ekle
      dispatch({ type: "product/addTodo", payload: newTodo });

            alert("Məhsul səbətə yükləndi.");


    } catch (err) {
      console.error("Ürün sepete eklenemedi:", err);
      alert("Ürün sepete eklenemedi. Lütfen tekrar deneyin.");
    }
  };

  // Favorilere ürün ekleme işlemi
  const handleAddToFavorie = async (product) => {
    try {
      const itemWithDetails = { productId: product._id };

      // API çağrısı
      const newFavorie = await addTodoo(itemWithDetails).unwrap();

      // Redux'a ekle
      dispatch({ type: "favorie/add", payload: newFavorie });

    } catch (err) {
      console.error("Ürün favorilere eklenemedi:", err);
      alert(err.data?.error || "Ürün favorilere eklenemedi. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="w-[97%] mx-auto p-4 sm:p-6">
      <div className="grid gap-4 sm:gap-6 dark:text-white grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {data.length > 0 ? (
          data.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg rounded-lg dark:bg-gray-800 border overflow-hidden p-4 sm:p-6 flex flex-col items-center transition-transform transform hover:scale-105 relative"
            >
              {/* Favori Ikonu */}
              <button
                onClick={() => handleAddToFavorie(product)}
                className="absolute top-4 right-4 p-2 rounded-full dark:text-white text-gray-950"
              >
                <FaRegHeart className="h-6 w-6 sm:h-8 sm:w-8 hover:text-blue-900" />
              </button>

              {/* Ürün Görseli */}
              <div className="flex justify-center mb-4 sm:mb-6 w-full">
                {Array.isArray(product.photo) && product.photo.length > 0 ? (
                  <div className="relative w-full h-64 sm:h-80">
                    <img
                      src={product.photo[0]} // Sadece ilk fotoğrafı göster
                      alt={`product-image`}
                      className="object-cover w-full h-full rounded-md cursor-pointer"
                      onClick={() => navigate(`/pagination/${product._id}`)} // Fotoğrafa tıklandığında ürün sayfasına git
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 sm:h-80 flex items-center justify-center">
                    <img
                      src={product.photo}
                      alt={product.title}
                      className="object-cover w-full h-full rounded-md cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)} // Fotoğrafa tıklandığında ürün sayfasına git
                    />
                  </div>
                )}
              </div>

              {/* Ürün Başlık ve Fiyat */}
              <h3 className="text-sm sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white text-center h-10 overflow-hidden">
                {(product.title || "").slice(0, 50)} {/* Burada başlığı kesiyoruz, ihtiyaç varsa ayarlayabilirsin */}
              </h3>

              <h4 className="text-sm sm:text-lg font-semibold mb-4 dark:text-white text-gray-800">Qiymət: {product.discountApplied ? (
                  <>
                    <span className="text-red-500 line-through mr-2">
                      {product.originalPrice}₼
                    </span>
                    <span className="text-green-600">{product.price}₼</span>
                  </>
                ) : (
                  <span>{product.price}₼</span>
                )}              </h4>

              {/* Stok Durumu */}
              <p
                className={`text-sm sm:text-base font-medium mb-4 ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0 ? "Stokta Var" : "Stokta Yok"}
              </p>

              {/* Sepete Ekle Butonu */}
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className={`w-full py-2 sm:py-3 rounded-lg text-white ${
                  product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition-colors duration-200`}
              >
                {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center dark:text-white text-gray-600">Ürünler yükleniyor...</p>
        )}
      </div>

      {/* Daha Fazla Göster Butonu */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Daha Fazla Göster
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
