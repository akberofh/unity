import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const getRandomColor = () => {
  const letters = "CDEF"; // sadece açık tonlar
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
};

const ReferralTreeBinary = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [treeData, setTreeData] = useState(null);
  const [translate, setTranslate] = useState({ x: window.innerWidth / 2, y: 100 });
  const [zoom, setZoom] = useState(1);
  const [allUsers, setAllUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!userInfo) return;

      try {
        const [adminRes, userRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/admin/${userInfo.referralCode}`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/user/${userInfo.referralCode}`),
        ]);

        const all = [...(adminRes.data?.users || []), ...(userRes.data?.users || [])];
        const unique = {};
        all.forEach((u) => {
          if (!unique[u._id]) unique[u._id] = u;
        });

        const users = Object.values(unique);
        setAllUsers(users);
        buildTree(selectedUser || userInfo, users);
      } catch (err) {
        console.error("Referral ağacı yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo, selectedUser]);

  const buildTree = (rootUser, users) => {
    const assigned = new Set();

    const buildBinaryTree = (parent) => {
      if (!parent || assigned.has(parent._id)) return null;
      assigned.add(parent._id);

      const children = users.filter((u) => u.referredBy === parent.referralCode);
      const [left, right] = children;

      const node = {
        name: parent.name,
        attributes: {
          Ata: parent.faze,
          Kod: parent.referralCode,
          Ödəniş: parent.payment,
        },
      };

      

      const childNodes = [];
      if (left) {
        const leftNode = buildBinaryTree(left);
        if (leftNode) childNodes.push(leftNode);
      }
      if (right) {
        const rightNode = buildBinaryTree(right);
        if (rightNode) childNodes.push(rightNode);
      }

      if (childNodes.length > 0) node.children = childNodes;
      return node;
    };

    const rootTree = buildBinaryTree(rootUser);
    setTreeData(rootTree);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    const filtered = allUsers.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.referralCode.toLowerCase().includes(value.toLowerCase()));
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (user) => {
    setSearchInput(user.name);
    setSuggestions([]);
  };

  const handleSearch = () => {
    const input = searchInput.toLowerCase();
    const found = allUsers.find(
      (u) =>
        u.name.toLowerCase() === input ||
        u.referralCode.toLowerCase() === input
    );
    if (found) {
      setLoading(true);        // Yeni veri yükleneceği için true yapıyoruz
      setSelectedUser(found);  // Seçilen kullanıcıyı ayarlıyoruz, bu da useEffect'i tetikliyor
    }
  };

  const handleReset = () => {
    setLoading(true);         // Yükleniyor moduna geç
    setSelectedUser(null);    // selectedUser'ı sıfırla → useEffect tetiklenir
    setSearchInput("");       // Arama kutusunu temizle
    setSuggestions([]);       // Önerileri temizle
  };


  const handleBackClick = () => {
    navigate("/profile");
  };

  const renderCustomNode = ({ nodeDatum  }) => {
    const randomColor = getRandomColor();
    const paymentColor = nodeDatum.attributes?.Ödəniş ? '#D4EDDA' : '#F8D7DA'; // Yaşıl/Qırmızı ton
  const paymentStatus = nodeDatum.attributes?.Ödəniş ? 'Olunub' : 'Olunmadı';
    const rectWidth = Math.max(140, nodeDatum.name.length * 9);
    const rectX = -(rectWidth / 2);

    return (
      <g>
        <rect
        fill={paymentColor} stroke="#555" strokeWidth="1" rx="5"
      />
        <rect
          width={rectWidth}
          height="75"
          x={rectX}
          y="-30"
          fill={randomColor}
          stroke="black"
          strokeWidth="2"
          rx="5"
        />

        <foreignObject x={rectX} y="-30" width={rectWidth} height="75">
          <div xmlns="http://www.w3.org/1999/xhtml" style={{
            fontFamily: 'Arial, sans-serif',
            fontWeight: '500',
            fontSize: '11px',
            color: 'black',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
          }}>
            <div style={{ color: 'black' }}>{nodeDatum.name}</div>
            <div style={{ color: 'black' }}>Ata: {nodeDatum.attributes?.Ata}</div>
            <div style={{ color: 'black' }}>Kod: {nodeDatum.attributes?.Kod}</div>
            <div style={{ color: 'black' }}>Ödəniş: {paymentStatus}</div>
          </div>
        </foreignObject>
      </g>
    );
  };

  const handleWheel = (e) => {
    const zoomFactor = 0.1;
    const newZoom = e.deltaY < 0 ? zoom + zoomFactor : zoom - zoomFactor;
    setZoom(Math.max(0.1, Math.min(newZoom, 3)));
  };

  const handleMouseMove = (e) => {
    if (e.buttons === 1) {
      setTranslate((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      className="referral-tree-container"
      style={{
        width: "100%",
        height: "100vh",
        overflowY: "scroll",
        overflowX: "hidden", // x yönünde kaydırmayı engelle
        minHeight: "100vh", // Yüksekliği en az ekran boyutu kadar yap
        display: "flex", // Kaydırma çubuğunun her zaman görünmesini sağlamak için display flex
        flexDirection: "column", // Yüksekliği düzgün şekilde ayarlamak
      }}
    >
      <h2 className="text-3xl font-bold text-center mt-4 mb-2">Referans Ağacı 🌳</h2>

      <div className="flex flex-wrap items-center justify-center gap-4 p-4">
        <button
          onClick={handleBackClick}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-900"
        >
          ← Geri Dön
        </button>

        <div className="relative w-full max-w-md flex-shrink-0">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchInputChange}
            placeholder="Kullanıcı ara..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md z-10">
              {suggestions.map((user) => (
                <li
                  key={user._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(user)}
                >
                  {user.name} ({user.referralCode})
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800"
        >
          Ara
        </button>

        <button
          onClick={handleReset}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        >
          Sıfırla
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg text-blue-600 font-semibold mb-4 animate-pulse">
          ⏳ Yükleniyor...
        </p>
      ) : (
        treeData && (
          <Tree
            data={treeData}
            orientation="vertical"
            translate={translate}
            zoom={zoom}
            collapsible={false}
            pathFunc="step"
            separation={{ siblings: 2, nonSiblings: 3 }}
            renderCustomNodeElement={renderCustomNode}
            zoomable={true}
            draggable={true}
          />
        )
      )}
    </div>
  );
};

export default ReferralTreeBinary;
