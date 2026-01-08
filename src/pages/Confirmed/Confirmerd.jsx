import React, { useEffect, useState } from "react";
import { useGetConfirmedQuery } from "../../redux/slices/ConfirmedApiSlice";
import { setConfirmed } from "../../redux/slices/confirmedSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const Confirmed = () => {
    const dispatch = useDispatch();
    const { data, isLoading } = useGetConfirmedQuery();

    const [userPayments, setUserPayments] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const [openPoct, setOpenPoct] = useState(null);



    useEffect(() => {
        if (!data) return;

        dispatch(setConfirmed(data));


        data.forEach((cart) => {
            const confirmedCartId = cart._id;



            // Ödeme sorgula
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/payment/paymentId/${confirmedCartId}`, {
                withCredentials: true,
            })
                .then((response) => {
                    // Eğer ödeme varsa, state'e ekle
                    if (response.data && Object.keys(response.data).length > 0) {
                        setUserPayments((prev) => ({
                            ...prev,
                            [confirmedCartId]: response.data,
                        }));
                    }
                })
                .catch((error) => {
                    console.error(`Ödeme kontrol hatası: ${confirmedCartId}`, error);
                });
        });
    }, [data, dispatch]);










    const filteredCarts = (data || []).filter(cart => {
        return cart.orderCode?.toString().toLowerCase().includes(searchTerm.trim().toLowerCase());
    });










    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-12">
                ✅ Təsdiqlənmiş Sifarişlər
            </h1>

            <div className="mb-10 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <input
                    type="text"
                    placeholder="Sifariş koduna görə axtar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 w-full px-4 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />



            </div>


            {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-400 text-lg">Yüklənir...</p>
            ) : filteredCarts?.length > 0 ? (
                filteredCarts
                    .filter(card => userPayments[card._id])
                    .map((cart) => {

                        const paymentArray = userPayments[cart._id];



                        const productTotal = cart.products.reduce((acc, product) => {
                            return acc + product.price * product.quantity;
                        }, 0);

                        let poctFee = 0;

                        if (paymentArray && paymentArray.length > 0 && paymentArray[0].poct) {
                            const match = paymentArray[0].poct.match(/(\d+(?:\.\d+)?)\s*AZN/);
                            if (match) {
                                poctFee = parseFloat(match[1]);
                            }
                        }

                        const totalWithPoct = (productTotal + poctFee).toFixed(2);




                        return (
                            <div
                                key={cart._id}
                                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg mb-12 p-8 transition hover:shadow-2xl"
                            >
                                <div className="grid md:grid-cols-4 gap-6 border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                                    {/* Ödəniş Vəziyyəti */}
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ödəmə Vəziyyəti</p>
                                        <p
                                            className={`text-xl font-semibold 
    ${cart.paymentStatus === 'pending' ? 'text-blue-600 dark:text-blue-400' : ''}
    ${cart.paymentStatus === 'paid' ? 'text-green-600 dark:text-green-400' : ''}
    ${cart.paymentStatus !== 'pending' && cart.paymentStatus !== 'paid' ? 'text-red-600 dark:text-red-400' : ''}
  `}
                                        >
                                            {cart.paymentStatus === 'pending'
                                                ? 'Ödəniş Gözlənilir'
                                                : cart.paymentStatus === 'paid'
                                                    ? 'Ödəndi'
                                                    : 'Ödənmədi'}
                                        </p>




                                    </div>





                                    {/* Təsdiqlənmə Tarixi */}
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Sifariş Kodu</p>
                                        <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                            {cart.orderCode}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Təsdiqlənmə Tarixi</p>
                                        <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                            {cart.confirmedAt}
                                        </p>
                                    </div>


                                </div>

                                {/* Məhsullar */}
                                <div className="overflow-x-auto border-b border-gray-200  dark:border-gray-700 pb-6 mb-6">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Toplam Məhsul</p>
                                    <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                                        {cart.products.length} Məhsul
                                    </p>
                                    <div className="min-w-[400px] max-h-[520px] overflow-y-auto">
                                        <table className="min-w-full text-sm text-left">
                                            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                                                <tr>
                                                    <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Şəkil</th>
                                                    <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Ad</th>
                                                    <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Ədəd</th>
                                                    <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Toplam Qiymət</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {cart.products.map((product) => (
                                                    <tr key={product._id}>
                                                        <td className="px-4 py-3">
                                                            {product?.photo ? (
                                                                <img
                                                                    src={
                                                                        Array.isArray(product.photo)
                                                                            ? product.photo[0]
                                                                            : product.photo
                                                                    }
                                                                    alt={product.title}
                                                                    className="w-14 h-14 rounded-lg object-cover border"
                                                                />
                                                            ) : (
                                                                <div className="w-14 h-14 flex items-center justify-center bg-gray-100 text-gray-400 border rounded">
                                                                    N/A
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                                                            {product.title}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
                                                            {product.quantity}
                                                        </td>
                                                        <td className="px-4 py-3 text-center text-green-600 font-bold">
                                                            {(product.price * product.quantity).toFixed(2)} AZN
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>

                                {/* Əlavə Məlumatlar */}
                                {userPayments[cart._id]?.length > 0 && (
                                    <div className="max-w-7xl mx-auto overflow-x-auto mt-8 shadow-lg rounded-lg border dark:border-gray-700">
                                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">Çatdırılma Məlumatları</h2>
                                        <table className="w-full text-sm text-left border-collapse">
                                            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                                                <tr>
                                                    <th className="p-4 text-gray-700 dark:text-gray-200">Ad</th>
                                                    <th className="p-4 text-gray-700 dark:text-gray-200">Soyad</th>
                                                    <th className="p-4 text-gray-700 dark:text-gray-200">Şəhər</th>
                                                    <th className="p-4 text-gray-700 dark:text-gray-200">Ünvan</th>
                                                    <th className="p-4 text-gray-700 dark:text-gray-200">Tel</th>
                                                    <th className="p-4 text-gray-700 dark:text-gray-200">Qeyd</th>
                                                    <th className="p-4 text-gray-700 dark:text-gray-200">Poçt</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {userPayments[cart._id]?.map((p, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
                                                        <td className="p-4">{p.name}</td>
                                                        <td className="p-4">{p.surname}</td>
                                                        <td className="p-4">{p.city}</td>
                                                        <td className="p-4">{p.adress}</td>
                                                        <td className="p-4">{p.phone}</td>
                                                        <td className="p-4">{p.description}</td>
                                                        <td className="p-4 max-w-[100px] sm:max-w-[200px] break-words">
                                                            {p.poct.length > 10 ? (
                                                                <>
                                                                    <span>{p.poct.slice(0, 10)}...</span>
                                                                    <button
                                                                        onClick={() => setOpenPoct(p.poct)}
                                                                        className="block mt-1 text-blue-500 underline text-sm"
                                                                    >
                                                                        Gör
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                p.poct
                                                            )}
                                                        </td>

                                                    </tr>
                                                ))}
                                                {openPoct && (
                                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                                        <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
                                                            <h2 className="text-lg font-semibold mb-2">Poçt Məlumatı</h2>
                                                            <p className="text-gray-800 break-words">{openPoct}</p>
                                                            <button
                                                                onClick={() => setOpenPoct(null)}
                                                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                            >
                                                                Bağla
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </tbody>


                                        </table>
                                    </div>
                                )}

                                <div className="mt-4 text-right font-semibold dark:text-white text-gray-800">
                                    Məhsulların Toplam Qiyməti: {productTotal.toFixed(2)} AZN
                                </div>
                                <div className="text-right text-blue-600">
                                    Çatdırılma Qiyməti: {poctFee.toFixed(2)} AZN
                                </div>
                                <div className="text-right font-bold text-xl text-green-700 mt-2">
                                    Yekun Qiymət: {totalWithPoct} AZN
                                </div>

                            </div>
                        );
                    })
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
                    Sifarişiniz yoxdur.
                </p>
            )}
        </div>

    );
};

export default Confirmed;
