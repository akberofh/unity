import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import AOS from "aos";
import "aos/dist/aos.css";

const CommentDetal = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error('Yorumlar getirilirken hata oluştu:', error);
      }
    };

    fetchReviews();
  }, []);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
};

const [theme, setTheme] = useState(
  localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
);
const element = document.documentElement;

useEffect(() => {
  if (theme === "dark") {
    element.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    element.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [theme]);

React.useEffect(() => {
  AOS.init({
    offset: 100,
    duration: 800,
    easing: "ease-in-sine",
    delay: 100,
  });
  AOS.refresh();
}, []);

  return (
    <div theme={theme} setTheme={setTheme} className="bg-white dark:border-b relative dark:bg-black dark:text-white min-h-[700px] text-black overflow-x-hidden">
      <div className="container absolute top-20 right-0 left-0 px-4 mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white sm:text-4xl">
            Müşdəri Rəyləri ve Qiyməntləndirməsi
          </h2>
          <p className="text-center dark:text-white text-gray-600">
            Müşdərilərimizin məhsul ve xidmətlərimizlə bağlı rəyləri burada yer alır.
          </p>
        </div>

        <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white dark:bg-black border dark:text-white rounded-lg shadow-md p-6 min-w-[320px] mb-6"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="rounded-full w-12 h-12 bg-gray-300 dark:text-white flex items-center justify-center">
                    {review.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{review.name}</p>
                  <p className="text-sm text-gray-600 dark:text-white">{review.email}</p>
                </div>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

              <div className="flex items-center mb-2">
                {[...Array(parseInt(review.rating))].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.543L0 6.908l6.561-.955L10 0l3.439 5.953L20 6.908l-5.245 4.639 1.123 6.543z" />
                  </svg>
                ))}
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

              <p className="text-gray-700 dark:text-white">Rəy: {truncateText(review.review, 40)}</p>
              <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

              <p className="text-gray-700 dark:text-white">Kateqoriya: {review.catagory}</p>
              <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>

              <p className="text-sm text-gray-500 mt-2 dark:text-white">
                Göndərilme Tarixi: {review.createdAt ? new Date(review.createdAt).toLocaleString() : 'yazilmiyib'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentDetal;
