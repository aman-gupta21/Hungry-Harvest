import axios from "axios";
import { createContext, useState, useEffect } from "react";
// import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = `${import.meta.env.VITE_BACKEND_URL}`;
    const [token,setToken] = useState("")

    const [food_list, setFoodList] = useState([]) 

    const addToCart = async (itemId) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: prev[itemId] ? prev[itemId] + 1 : 1
        }));
        if(token){
            await axios.post(`${url}/api/cart/add`,{itemId},{headers:{token}})
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems(prev => ({
            ...prev,
            [itemId]: prev[itemId] > 1 ? prev[itemId] - 1 : 0
        }));
        if(token){
            await axios.post(`${url}/api/cart/remove`,{itemId},{headers:{token}})
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems)
        {

            if(cartItems[item]>0){
                let itemInfo = food_list.find((product)=>product._id === item);
            totalAmount += itemInfo.price*cartItems[item];
            }
            
        }

        return totalAmount;
    }


    const featchFoodList = async () => {
        const response = await axios.get(`${url}/api/food/list`)
        setFoodList(response.data.data)
    }

const loadCartData = async (token) => {
    const response = await axios.post(`${url}/api/cart/get`,{},{headers:{token}})
    setCartItems(response.data.cartData)
}

useEffect(() => {
    async function loadData() {
        await featchFoodList()
        const localToken = localStorage.getItem("token");
        if(localToken){
            setToken(localToken)
            await loadCartData(localToken)
        }
    }
    loadData()
},[])




    const contextValue = {
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;