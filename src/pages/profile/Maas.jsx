import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Maas = () => {
  const [data, setData] = useState([]);
  const [allPeriods, setAllPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [filteredPeriodSalaries, setFilteredPeriodSalaries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [salaryData, setSalaryData] = useState(null);
  const [error, setError] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  // 🔹 Şəxsi maaş paneli
  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/salary/${userInfo.referralCode}`,
          { withCredentials: true }
        );
        setSalaryData(response.data);
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Maaş verisi alınarkən xəta baş verdi.";
        setError(errorMessage);
      }
    };
    if (userInfo?.referralCode) fetchSalaryData();
  }, [userInfo]);

  // 🔹 Bütün istifadəçilərin maaş məlumatları
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mine`, { withCredentials: true });
        setData(response.data || []);

        // Bütün unikal periodları çıxar
        const all = response.data.flatMap(user => user.periodSalaries.map(p => p.periodLabel));
        const uniquePeriods = [...new Set(all)];
        setAllPeriods(uniquePeriods);

        // Default periodu təyin et
        if (uniquePeriods.length > 0 && !selectedPeriod) {
          setSelectedPeriod(uniquePeriods[0]);
        }
      } catch (err) {
        console.error('Veri alınarkən xəta:', err);
      }
    };
    fetchData();
  }, [selectedPeriod]);

  // 🔹 Seçilmiş period üçün filtrlənmiş maaşlar
  useEffect(() => {
    if (!selectedPeriod || data.length === 0) return;

    const filtered = data
      .map(user => {
        const matching = user.periodSalaries.find(p => p.periodLabel === selectedPeriod);
        return matching ? { ...matching, totalUserSalary: user.salary } : null;
      })
      .filter(Boolean);

    setFilteredPeriodSalaries(filtered);
  }, [selectedPeriod, data]);

  // 🔹 Axtarış ilə filtrləmə
  const filteredSalaries = filteredPeriodSalaries.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.referralCode?.toString().toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-10 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Şəxsi maaş paneli */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 transition-all duration-300">
          <h1 className="text-3xl font-bold mb-4 text-center">🧾 Şəxsi Maaş Paneli</h1>
          {error ? (
            <div className="text-center text-red-500 font-semibold py-4">{error}</div>
          ) : !salaryData? (
            <div className="text-center text-gray-500 dark:text-gray-300">Verilər yüklənir...</div>
          ) : (
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full min-w-[800px] table-auto text-sm text-left">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-4">📸 Foto</th>
                    <th className="p-4">👤 Ad Soyad</th>
                    <th className="p-4">📅 Periyod</th>
                    <th className="p-4">🎖 Rütbə</th>
                    <th className="p-4">💸 Maaş</th>
                  </tr>
                </thead>
                <tbody>
                 
                    <tr  className="hover:bg-gray-200 dark:hover:bg-white/10 transition">
                      <td className="p-4">
                        <img src={salaryData.photo} alt={salaryData.name} className="w-12 h-12 rounded-full object-cover border" />
                      </td>
                      <td className="p-4">{salaryData.name}</td>
                      <td className="p-4">{salaryData.periodLabel}</td>
                      <td className="p-4">{salaryData.rank}</td>
                      <td className="p-4 text-green-600 dark:text-green-400 font-semibold">{salaryData.salary.toFixed(2)} ₼</td>
                    </tr>
                 
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* salaryData seçimi ve axtarış */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-3 rounded-xl shadow-sm"
          >
            {allPeriods.map((period, i) => (
              <option key={i} value={period}>{period}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="🔍 İstifadəçi ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white p-3 rounded-xl shadow-sm w-full md:w-1/2"
          />
        </div>

        {/* Bütün istifadəçilərin maaş tablosu */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg">
          <div className="max-h-[550px] overflow-y-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">📷 Fotoğraf</th>
                  <th className="p-4">👤 Ad</th>
                  <th className="p-4">📧 Email</th>
                  <th className="p-4">🎖 Rütbə</th>
                  <th className="p-4">💰 Toplam Maaş</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.length > 0 ? (
                  filteredSalaries.map((user, i) => (
                    <tr key={i} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/10 transition">
                      <td className="p-4 font-semibold">{i + 1}</td>
                      <td className="p-4">
                        <img src={user.photo} alt={user.name} className="w-12 h-12 rounded-full border" />
                      </td>
                      <td className="p-4">{user.name}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.rank}</td>
                      <td className="p-4 text-green-600 dark:text-green-400 font-semibold">{user.totalUserSalary} AZN</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-300">Seçilmiş periyod üçün istifadəçi tapılmadı.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Maas;
