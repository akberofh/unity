import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Profile from "../pages/profile/Profile";
import PrivateRoute from "../components/PrivateRoute";
import Home from "../pages/home/Home";
import Cart from "../pages/Cart/Cart";
import Confirmed from "../pages/Confirmed/ConfirmedDetal";
import ContactComp from "../components/ContacUs/ContactComp";
import DetalPage from "../Catagory/DetailPage/DetalPage";
import DetalPagination from "../Catagory/DetalPagination/DetalPagination";
import Baxim from "../Catagory/Baxim";
import BasketProduct from "../pages/basket/BaketProduct";
import Comment from "../Catagory/Commet/Comment";
import Catagory from "../Catagory/Catagory";
import FavorieProduct from "../pages/Favorie/FavorieProduct";
import PaymentDetal from "../Payment/PaymentDetal";
import Cedvel from "../pages/profile/Cedvel";
import Maas from "../Maaslar/Maaslar";
import Qazanc from "../Mukafatlar/Mukafatlar";
import Products from "../pages/Products/Products";
import Paginations from "../pages/Products/Paginationdiz";
import TarixceQazanc from "../Tarixce/TarixceQazanc";
import TarixceMaas from "../Tarixce/TarixceMaas";
import AboutPage from "../components/About/AboutPage";
import Addpagenation from "../Addpagenation/Addpagenation";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}  />
        <Route path="/addPagenation" element={<Addpagenation />}  />
        <Route path="/about" element={<AboutPage />}  />
        <Route path="/products" element={<Products />}  />
        <Route path="/pagination" element={<Paginations />}  />
        <Route path="/qazanc" element={<Qazanc />}  />
        <Route path="/HistoryMaas" element={<TarixceMaas />}  />
        <Route path="/HistoryMukafat" element={<TarixceQazanc />}  />
        <Route path="/cedvel" element={<Cedvel />}  />
        <Route path="/payment" element={<PaymentDetal />}  />
        <Route path="/favorie" element={<FavorieProduct />}  />
        <Route path="/catagory/:catagory" element={<Baxim />} />
        <Route path="/comment" element={<Comment />}  />   
        <Route path="/product/:qolbaq_id" element={<DetalPage />} />   
        <Route path="/pagination/:pagination_id" element={<DetalPagination />} />   
        <Route path="/contact" element={<ContactComp />}  />
        <Route path="/confirmed" element={<Confirmed />}  />
        <Route path="/basket" element={<BasketProduct />}  />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/maas" element={<Maas />} />
        <Route path="/kategori" element={<Catagory />} />
        <Route path="" element={<PrivateRoute/>}>
          <Route path="/profile" element={<Profile/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
