import React, { useEffect, useState } from "react";
import axios from "axios";

const TarixceQ = () => {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    earnedAboveZero: null,
    invitedAboveZero: null,
  });
      const [expandedRow, setExpandedRow] = useState(null);


    const toggleRow = (index) => {
        setExpandedRow((prev) => (prev === index ? null : index));
    };







  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/historyQOne`, {
          withCredentials: true,
        });
        setAllData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Veri alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filters, allData]);

    const applyFilters = () => {
        let tempData = [...allData];

        if (search) {
            const searchLower = search.toLowerCase();
            tempData = tempData.filter((item) =>
                item.referrerName.toLowerCase().includes(searchLower) ||
                item.referrerReferralCode.toString().toLowerCase().includes(searchLower)
            );
        }

        if (filters.earnedAboveZero !== null) {
            tempData = tempData.filter((item) =>
                filters.earnedAboveZero ? item.totalEarned > 0 : item.totalEarned <= 0
            );
        }

        if (filters.invitedAboveZero !== null) {
            tempData = tempData.filter((item) =>
                filters.invitedAboveZero ? item.totalInvited > 0 : item.totalInvited <= 0
            );
        }

        setFilteredData(tempData);
    };

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const handleSuggestionClick = (referrerName) => {
    setSearch(referrerName);
  };

  const filterButton = (label, key, value) => (
    <button
      onClick={() => toggleFilter(key, value)}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${filters[key] === value
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white text-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-700"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full px-4 py-12 bg-gray-50 dark:bg-gray-900">
      {/* Başlıq Paneli */}
        <h2 className="text-4xl font-extrabold mb-10 text-center text-gray-800 dark:text-white">
          🎯 Tarix Qazanc Məlumatları
        </h2>


      <div className="flex justify-center mb-8 relative">
        <input
          type="text"
          placeholder="İstifadəçi adı ilə ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg p-4 text-sm rounded-xl border border-gray-300 dark:border-gray-600 shadow focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
        />
        {search && (
          <div className="absolute top-full mt-2 w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
          {allData
                                .filter(item =>
                                    item.referrerName.toLowerCase().includes(search.toLowerCase()) ||
                                    item.referrerReferralCode.toString().toLowerCase().includes(search.toLowerCase())
                                )
                                .slice(0, 10)
                                .map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="px-4 py-2 hover:bg-indigo-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                                        onClick={() => handleSuggestionClick(item.referrerName)}
                                    >
                                        {item.referrerName}{" "}
                                        <span className="text-gray-400 text-xs">
                                            ({item.referrerEmail})
                                        </span>
                                    </div>
                                ))}
          </div>
        )}
      </div>

      {/* Filtr Butonları */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {filterButton("✅ Qazancı Olanlar", "earnedAboveZero", true)}
        {filterButton("❌ Qazancı Olmayanlar", "earnedAboveZero", false)}
        {filterButton("👥 Dəvət Edənlər", "invitedAboveZero", true)}
        {filterButton("🙅‍♂️ Dəvət Etməyənlər", "invitedAboveZero", false)}
      </div>

      {/* Mükafat Cədvəli */}
      {loading ? (
        <div className="text-center text-xl py-10 text-gray-900 dark:text-white">⏳ Yüklənir...</div>
      ) : (
        <div className="max-h-[600px] overflow-y-auto rounded-3xl border border-gray-200 dark:border-gray-700 backdrop-blur-xl bg-white/80 dark:bg-gray-800/60 shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 animate-fadeIn">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="sticky top-0 z-10 backdrop-blur-md bg-white/90 dark:bg-gray-900/70 text-gray-900 dark:text-white shadow-md">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">#</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">İstifadəçi</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Toplam Qazanc</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Dəvət Edilən</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Ödəniş Edənlər</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Periyot Qazancı</th>
              </tr>
            </thead>
      <tbody className="text-gray-800 dark:text-gray-100">
                            {filteredData.map((user, i) => {
                                const isExpanded = expandedRow === i;

                                return (
                                    <React.Fragment key={i}>
                                        <tr
                                            onClick={() => toggleRow(i)}
                                            className="cursor-pointer hover:bg-gradient-to-r from-blue-50 via-white border-t dark:border-gray-600 to-blue-50 dark:hover:from-gray-700 dark:hover:to-gray-800 transition duration-300 ease-in-out transform hover:scale-[1.01]"
                                        >
                                            <td className="px-6 py-4 font-bold">{i + 1}</td>
                                            <td className="px-6 py-4">{user.referrerName}</td>
                                            <td className="px-6 py-4">{user.referrerEmail}</td>
                                            <td className="px-6 py-4 text-green-600 dark:text-green-400 font-semibold">{user.totalEarned} AZN</td>
                                            <td className="px-6 py-4">{user.count}</td>
                                            <td className="px-6 py-4">{user.totalInvited}</td>
                                            <td className="px-6 py-4 text-blue-600">
                                                {isExpanded ? "▼ Gizle" : "▶ Göstər"}
                                            </td>
                                        </tr>

                                        {isExpanded && (
                                            <tr className="bg-gray-100 dark:bg-gray-700">
                                                <td colSpan="7" className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        {user.periodEarnings?.map((period, index) => (
                                                            <div key={index} className="text-sm">
                                                                <span className="font-medium">{period.periodLabel}:</span>{" "}
                                                                <span>{period.earned} AZN</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
          </table>
        </div>
      )}

      {filteredData.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-8 dark:text-gray-400">Heç bir mükafat tapılmadı.</p>
      )}
    </div>

  );
};

export default TarixceQ;
