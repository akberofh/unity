import React, { useState, useMemo } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import { useSelector } from 'react-redux';

const Comment = () => {
  const { userInfo } = useSelector(state => state.auth);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [catagory, setCatagory] = useState('');

  useMemo(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      rating,
      review,
      name,
      catagory,
      email,
      addedAt: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/reviews`, formData);
      console.log('Response:', response.data);
      setRating(0);
      setReview('');
      setCatagory('');
      alert('Yorumunuz ve puanınız kaydedildi!');
    } catch (error) {
      console.error('Yorum kaydedilirken hata oluştu:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Rəy Bildir</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Ad Soyad:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
              disabled // Name should not be editable
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              required
              disabled // Email should not be editable
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Qiymət Bildir:</label>
          <ReactStars
            count={5}
            value={rating}
            onChange={setRating}
            size={36}
            color2={'#ffd700'}
            className="mt-2"
          />
        </div>
        <div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700">
            Rəy:
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 h-32 resize-none"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="catagory" className="block text-sm font-medium text-gray-700">
            Kateqori:
          </label>
          <select
            id="catagory"
            value={catagory}
            onChange={(e) => setCatagory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Kateqoriya Seçin</option>
            <option value="dest">Dest</option>
            <option value="temizleyici">Temizleyici</option>
            <option value="uzuk">Uzuk</option>
            <option value="sirga">Sirga</option>
            <option value="qizil">Qizil</option>
            <option value="makiaj">Makiaj</option>
            <option value="saat">Saat</option>
            <option value="qolbaq">Qolbaq</option>
            <option value="etir">Etir</option>
            <option value="sac-sanpun">Sac Sanpun</option>
            <option value="sac-ucun">Sac Ucun</option>
            <option value="goz-ucun">Goz Ucun</option>
            <option value="baxim">Baxim</option>
            <option value="dus-geli">Dus Geli</option>
            <option value="boyunbagi">Boyunbagi</option>
            <option value="dodaq">Dodaq</option>
            <option value="qas-ucun">Qas Ucun</option>
            <option value="usaq-ucun">Usaq Ucun</option>
          </select>
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none">
          Göndər
        </button>
      </form>
    </div>
  );
};

export default Comment;
