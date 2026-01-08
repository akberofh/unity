import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../DetailPage/Detalp.module.scss';
import { FaStar, FaWhatsapp } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  useSelector } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';



const DetalPaginat = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { pagination_id } = useParams();
  

    const { userInfo } = useSelector((state) => state.auth);



    const [visibleLength, setVisibleLength] = useState(100); 

    const handleShowMore = () => {
        setVisibleLength((prev) => prev + 700); 
    };

    const handleShowLess = () => {
        setVisibleLength(100); 
    };

    const isFullVisible = visibleLength >= product?.description?.length;

    const [visibleLengthh, setVisibleLengthh] = useState(100); 

    const handleShowMoree = () => {
        setVisibleLengthh((prev) => prev + 700); 
    };

    const handleShowLesss = () => {
        setVisibleLengthh(100); 
    };

    const isFullVisiblee = visibleLengthh >= product?.distance?.length;


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                
                const url = userInfo?._id
                    ? `${process.env.REACT_APP_API_BASE_URL}/api/pagination/id/${pagination_id}/${userInfo._id}`
                    : `${process.env.REACT_APP_API_BASE_URL}/api/pagination/id/${pagination_id}`;

                const response = await axios.get(url);
                const data = response.data;

                if (data && data.getById) {
                    setProduct(data.getById);
                } else {
                    setError('Ürün bulunamadı.');
                }
            } catch (error) {
                console.error('Ürün alınırken hata oluştu:', error);
                setError('Ürün detayları alınırken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [pagination_id, userInfo?._id]);





    const [thumbsSwiper, setThumbsSwiper] = useState(null);


   
    if (loading) {
        return <div className={styles.loading}>Yüklənir...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!product) {
        return <div className={styles.error}>Məhsul yoxdur.</div>;
    }

    return (
        <div className="dark:bg-black dark:text-white text-gray-800 min-h-screen">
            <div className="container mx-auto px-4 lg:px-16 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    <div className="w-full">
                      
                        <Swiper
                            spaceBetween={10}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[Navigation, Thumbs]}
                            className="rounded-2xl shadow-lg mb-4 overflow-hidden"
                        >
                            {product.photo && Array.isArray(product.photo) ? (
                                product.photo.map((photo, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={photo}
                                            alt={`product-${index}`}
                                            className="w-full h-[500px] object-cover"
                                        />
                                    </SwiperSlide>
                                ))
                            ) : (
                                <SwiperSlide>
                                    <div className="w-full h-96 flex items-center justify-center bg-gray-100 dark:bg-zinc-900 rounded-2xl text-gray-500">
                                        Görsel bulunamadı
                                    </div>
                                </SwiperSlide>
                            )}
                        </Swiper>

                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={12}
                            slidesPerView={product.photo?.length > 4 ? 4 : product.photo?.length || 1}
                            modules={[Thumbs]}
                            watchSlidesProgress
                            className="thumbs-slider"
                        >
                            {product.photo?.map((photo, index) => (
                                <SwiperSlide key={index} className="cursor-pointer">
                                    <img
                                        src={photo}
                                        alt={`thumb-${index}`}
                                        className="h-24 w-full object-cover rounded-lg border-2 border-transparent hover:border-blue-500 transition-all"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold mb-2 tracking-tight">{product.title}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-2xl font-bold text-blue-600">
                                {product.discountApplied ? (
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 line-through text-lg">{product.originalPrice}₼</span>
                                        <span className="text-green-600">{product.price}₼</span>
                                    </div>
                                ) : (
                                    <span>{product.price}₼</span>
                                )}
                            </div>
                         
                        </div>

                        <div className="flex items-center gap-1 text-yellow-500 mb-6">
                            {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                            <span className="text-gray-400 text-sm ml-2">(4.0)</span>
                        </div>

                        <hr className="border-gray-200 dark:border-zinc-800 mb-6" />

                        {/* Açıklama Alanı */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Məhsul Haqqında</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {(product.description || "").slice(0, visibleLength)}
                                    {visibleLength < (product.description || "").length && "..."}
                                </p>
                                <button onClick={visibleLength < (product.description || "").length ? handleShowMore : handleShowLess} className="text-blue-600 hover:underline text-sm font-medium mt-1">
                                    {visibleLength < (product.description || "").length ? "Daha çox göstər" : "Daha az göstər"}
                                </button>
                            </div>

                            {product.distance && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Çatdırılma/Məsafə</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {(product.distance || "").slice(0, visibleLengthh)}
                                        {visibleLengthh < (product.distance || "").length && "..."}
                                    </p>
                                    <button onClick={visibleLengthh < (product.distance || "").length ? handleShowMoree : handleShowLesss} className="text-blue-600 hover:underline text-sm font-medium mt-1">
                                        {visibleLengthh < (product.distance || "").length ? "Daha çox göstər" : "Daha az göstər"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* İletişim / WhatsApp Bölümü */}
                      <div className="mt-auto pt-8">
    <p className="text-sm text-gray-500 mb-2">Satıcı ilə əlaqə:</p>
    <a
        // Ülke kodu (994) eklenmiş ve temizlenmiş numara formatı
        href={`https://api.whatsapp.com/send?phone=994${product.phone?.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg w-full lg:w-max"
    >
        {/* Lucide-react veya FontAwesome ikonunuzu buraya ekleyin */}
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.6-8.7-45-27.7-16.6-14.8-27.8-33.1-31.1-38.6-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.6-6.5 8.3-9.7 2.8-3.2 3.7-5.6 5.6-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.3 5.7 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
        </svg>
        WhatsApp ilə Sifariş Et
    </a>
    <p className="mt-2 text-center lg:text-left font-medium text-lg">
        {/* Numarayı görsel olarak 050 XXX XX XX formatında gösterir */}
        0{product.phone}
    </p>
</div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default DetalPaginat;
