import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTodos } from "../../redux/slices/productSlice";
import {
  useAddConfirmMutation,
  useGetTodosQuery,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "../../redux/slices/productApiSlice";
import { useNavigate } from "react-router-dom";

const Basket = () => {
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useGetTodosQuery();
  const [updateTodo] = useUpdateTodoMutation();
  const [addConfirm] = useAddConfirmMutation();
  const [removeTodo] = useDeleteTodoMutation();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await updateTodo({ productId, quantity }).unwrap();
      await refetch();
    } catch (err) {
      console.error("Məhsul yenilənmədi:", err);
    }
  };

  const removeProduct = async (_id) => {
    try {
      await removeTodo(_id).unwrap();
      alert("Məhsul səbətdən silindi!");
      await refetch();
    } catch (err) {
      console.error("Məhsul silinmədi:", err);
      alert("Məhsul səbətdən silinmədi!");
    }
  };

  const handleConfirmCart = async () => {
    try {
      console.log('Seçili ürünler:', selectedProducts);
      console.log('Tüm ürünler:', data);
      
      const selectedItems = data.filter((product) =>
        selectedProducts.includes(product._id)
      );
      
      console.log('Filtrelenmiş seçili ürünler:', selectedItems);

      if (selectedItems.length === 0) {
        alert("Zəhmət olmasa ən azı bir məhsul seçin.");
        return;
      }

      const response = await addConfirm({ products: selectedItems }).unwrap();
      const confirmedCartId = response.confirmedCartId;

      alert("Səbət təsdiqləndi! Ödəmə hissəsinə yönləndirilir.");
      setTimeout(() => {
        navigate(`/payment?confirmedCartId=${confirmedCartId}`);
      }, 1000);
    } catch (error) {
      console.error("Sepeti onaylarken hata oluştu:", error);
      alert(error?.data?.error || "Sepeti onaylarken bir hata oluştu.");
    }
  };

  useEffect(() => {
    if (data) {
      dispatch(setTodos(data));
      refetch();
      // Sayfa yüklendiğinde tüm ürünleri otomatik seç
      const allProductIds = data.map(product => product._id);
      setSelectedProducts(allProductIds);
    }
  }, [data, dispatch]);

  const calculateTotalPrice = Array.isArray(data)
    ? Math.round(
      data
        .filter((product) => selectedProducts.includes(product._id))
        .reduce(
          (total, product) => total + (product.price || 0) * (product.quantity || 1),
          0
        ) * 100
    ) / 100
    : 0;

  const calculateTotalOrginalPrice = Array.isArray(data)
    ? Math.round(
      data
        .filter((product) => selectedProducts.includes(product._id))
        .reduce(
          (total, product) =>
            total + (product.orginalPrice || product.price || 0) * (product.quantity || 1),
          0
        ) * 100
    ) / 100
    : 0;

  const isStockAvailable =
    data &&
    Array.isArray(data) &&
    !data
      .filter((product) => selectedProducts.includes(product._id))
      .some((product) => product.stock === 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[740px]">
      {isLoading ? (
        <p className="text-center text-gray-600">Yüklənir...</p>
      ) : (
        data &&
        data.map((product) => (
          <div
            key={product._id}
            className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 mb-6 flex flex-col md:flex-row md:items-center gap-6"
          >
            <input
              type="checkbox"
              checked={selectedProducts.includes(product._id)}
              onChange={() => toggleProductSelection(product._id)}
              className="w-5 h-5 text-green-600 accent-green-500"
            />

            <div
              className="w-full md:w-auto flex justify-center"
              onClick={() => navigate(`/product/${product.productId}`)}
            >
              <img
                src={
                  Array.isArray(product.photo) && product.photo.length > 0
                    ? product.photo[0]
                    : product.photo
                }
                alt={product.title}
                className="w-32 h-32 rounded-full border border-gray-300 object-cover cursor-pointer"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {product.title}
              </h3>

              <div className="flex justify-center md:justify-start items-center space-x-4 mb-2">
                {product.quantity > 1 ? (
                  <button
                    onClick={() =>
                      updateQuantity(product.productId, product.quantity - 1)
                    }
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-4 py-1 font-semibold transition"
                  >
                    -
                  </button>
                ) : (
                  <button
                    onClick={() => removeProduct(product._id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-1 font-semibold transition"
                  >
                    Sil
                  </button>
                )}
                <span className="text-lg font-semibold dark:text-white">
                  {product.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(product.productId, product.quantity + 1)
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1 font-semibold transition"
                >
                  +
                </button>
              </div>

              <p className="text-lg font-semibold dark:text-white text-gray-800">
                Toplam Qiymət: {((product.orginalPrice || product.price || 0) * (product.quantity || 1)).toFixed(2)} ₼
              </p>

              {product.stock === 1 && (
                <p className="text-red-500 font-medium mt-1">
                  Son 1 məhsul qaldı!
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-red-500 font-medium mt-1">
                  Bu məhsul stokda yoxdur!
                </p>
              )}
            </div>
          </div>
        ))
      )}

      <div className="mt-12 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Cəmi Qiymət */}
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v2h6v-2c0-1.657-1.343-3-3-3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.418 0 8 3.582 8 8v1H4v-1c0-4.418 3.582-8 8-8z" />
            </svg>
          </div>
          <div>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Seçilmiş Məhsulların Qiyməti</p>
            <p className="text-2xl font-bold  text-blue-600 dark:text-blue-400">{calculateTotalOrginalPrice} ₼</p>
          </div>
        </div>

        {/* Endirimli Qiymət ya da mesaj */}
        <div className="flex flex-col items-start gap-2">
          {calculateTotalOrginalPrice !== calculateTotalPrice ? (
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-100 dark:bg-green-900  rounded-full">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v2h6v-2c0-1.657-1.343-3-3-3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.418 0 8 3.582 8 8v1H4v-1c0-4.418 3.582-8 8-8z" />
                </svg>
              </div>
              <div>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Endirimli Qiymət (10%)</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{calculateTotalPrice} ₼</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Bu məhsullarda hal-hazırda endirim yoxdur.
            </p>
          )}
        </div>

        {/* Təsdiqlə Butonu */}
        <button
          onClick={handleConfirmCart}
          disabled={!isStockAvailable}
          className={`mt-4 md:mt-0 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 ${!isStockAvailable
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            }`}
        >
          ✅ Səbəti Təsdiqlə
        </button>
      </div>


    </div>
  );
};

export default Basket;
