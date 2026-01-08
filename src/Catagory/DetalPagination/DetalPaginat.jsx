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
                                href={`https://wa.me/${product.phone?.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg w-full lg:w-max"
                            >
                                <FaWhatsapp className="text-2xl" />
                                WhatsApp ilə Sifariş Et
                            </a>
                            <p className="mt-2 text-center lg:text-left font-medium text-lg">{product.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default DetalPaginat;
