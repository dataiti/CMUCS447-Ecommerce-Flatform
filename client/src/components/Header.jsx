import React, { memo, useEffect, useRef, useState } from "react";
import { icons } from "../utils/icons";
import { authSelect } from "../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import logo from "../assets/logo6.png";
import Navbar from "./Navbar";
import useDebounce from "../hooks/useDebounce";
import { getSearchProductApi } from "../apis/product";
import Modal from "./Modal";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import {
  cartSelect,
  getListCartsByUserThunkAction,
} from "../redux/features/cartSlice";
import useClickOutSide from "../hooks/useClickOutSide";

const Header = ({ hasSearch = true, className = "" }) => {
  const [searchvalue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [listProductsSearch, setListProductsSearch] = useState([]);
  const [displayOption, setDisplayOption] = useState(false);

  const debouncedValue = useDebounce(searchvalue, 500);

  const dispatch = useDispatch();

  const { token, userInfo, isLoggedIn } = useSelector(authSelect);
  const { listCarts } = useSelector(cartSelect);

  const selectRef = useRef();
  const inputRef = useRef();

  useClickOutSide(selectRef, setDisplayOption);

  useEffect(() => {
    const fetchListCarts = async () => {
      try {
        if (userInfo?._id) {
          setIsLoading(true);
          const res = await dispatch(
            getListCartsByUserThunkAction({ userId: userInfo?._id })
          );
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchListCarts();
  }, [userInfo?._id]);

  useEffect(() => {
    const fetchSearchProductApi = async () => {
      try {
        if (!debouncedValue.trim()) {
          setListProductsSearch([]);
          return;
        }
        setIsLoading(true);
        if (debouncedValue) {
          const res = await getSearchProductApi({
            q: debouncedValue,
            limit: 6,
          });
          if (res && res.data) {
            setListProductsSearch(res.data);
          }
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchSearchProductApi();
  }, [debouncedValue]);

  const handleOnchaneSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const handleClear = () => {
    setSearchValue("");
    setListProductsSearch([]);
    inputRef.current.focus();
  };

  const handleHoverSelected = () => {
    setDisplayOption(!displayOption);
  };

  return (
    <header className="w-full shadow-md fixed z-30">
      <Navbar />
      <div className="bg-slate-400 h-[80px] ">
        <div
          className={`w-[80%] h-full flex items-center justify-between mx-auto ${className}`}
        >
          <Link to="/">
            <div className="flex items-center gap-2 text-3xl font-extrabold text-primary-400">
              <img src={logo} alt="logo" className="h-16" />
              <span className="text-2xl font-extrabold">CLICK SHOP</span>
            </div>
          </Link>
          {hasSearch && (
            <>
              <div className="relative flex-2 w-2/5">
                <div
                  className="w-full p-1 rounded-full flex items-center bg-gray-50 z-10"
                  ref={selectRef}
                  onClick={handleHoverSelected}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Tìm kiếm sản phẩm ..."
                    className="outline-none flex-1 h-full pl-5 placeholder:text-md"
                    value={searchvalue}
                    onChange={handleOnchaneSearchValue}
                  />
                  {!!searchvalue && !isLoading && (
                    <span
                      className="text-gray-600 hover:text-gray-500 cursor-pointer"
                      onClick={handleClear}
                    >
                      <icons.IoCloseCircleSharp size={24} />
                    </span>
                  )}
                  {isLoading && (
                    <span className="animate-spin text-gray-600">
                      <icons.BiLoaderCircle size={24} />
                    </span>
                  )}
                  <button
                    type="submit"
                    spellCheck={false}
                    className="bg-slate-600 p-2 rounded-full text-white hover:bg-primary-300 transition-all"
                  >
                    <icons.FiSearch size={24} />
                  </button>
                </div>
                {displayOption && listProductsSearch?.length > 0 && (
                  <div className="absolute top-[110%] left-0 bg-white shadow-lg rounded-md w-full overflow-hidden">
                    <h4 className="text-gray-500 text-sm px-3 py-2">
                      Kết quả tìm kiếm
                    </h4>
                    <ul className="flex flex-col">
                      {listProductsSearch?.length > 0 &&
                        listProductsSearch.map((product) => {
                          return (
                            <li
                              key={product?._id}
                              className="border-t p-3 hover:bg-slate-100 transition-all"
                            >
                              <Link
                                to={`/product-detail/${product?._id}`}
                                className="flex items-center gap-3"
                              >
                                <span className="text-gray-500">
                                  <icons.FiSearch />
                                </span>
                                <img
                                  src={product?.imagePreview}
                                  alt=""
                                  className="w-10 h-10 object-cover rounded-md"
                                />
                                <span className="text-sm text-gray-500 name">
                                  {product?.name}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="flex items-center gap-4">
            {hasSearch && (
              <span className="text-primary-400 relative hover:text-primary-500 cursor-pointer">
                <icons.BsFillBookmarkHeartFill size={30} />
              </span>
            )}
            {hasSearch && userInfo ? (
              <Link
                to={"/cart"}
                className="text-primary-400 relative hover:text-primary-500 cursor-pointer"
              >
                <icons.MdShoppingCart size={40} />
                <span
                  className="absolute z-10 -top-2 -right-2 bg-red-500 px-2 rounded-full font-extrabold 
              cursor-pointer border border-white text-white"
                >
                  {listCarts && listCarts.length ? listCarts.length : 0}
                </span>
              </Link>
            ) : (
              <Modal
                classNameBtn="text-primary-400 relative hover:text-primary-500 cursor-pointer"
                leftIcon={
                  <div>
                    <icons.MdShoppingCart size={40} />
                    <span
                      className="absolute z-10 -top-2 right-5 bg-red-500 px-2 rounded-full font-extrabold 
                cursor-pointer border border-white text-white"
                    >
                      0
                    </span>
                  </div>
                }
              >
                <LoginPage />
              </Modal>
            )}

            {isLoggedIn ? (
              <Link
                to={`/profile/${userInfo?._id}`}
                className="flex items-center gap-2"
              >
                <div className="text-sm font-bold text-gray-200 flex flex-col">
                  <span className="text-end">
                    {userInfo?.username || userInfo?.displayName}
                  </span>
                  <span className="text-end">{userInfo?.email}</span>
                </div>
                <Avatar src={userInfo?.avatar} alt="avatar" />
              </Link>
            ) : (
              <div className="flex items-center gap-1">
                <Modal nameBtn="Đăng Ký" outline={true}>
                  <RegisterPage />
                </Modal>
                <Modal nameBtn="Đăng Nhập" primary={true}>
                  <LoginPage />
                </Modal>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
