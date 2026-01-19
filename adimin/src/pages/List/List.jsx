import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({url}) => {
  
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch food list");
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      toast.error("Server error while fetching food list");
    }
  };


const removeFood = async(foodId) => {
  const token = localStorage.getItem('token')
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    const response = await axios.post(`${url}/api/food/remove`, {id: foodId}, config)
    if(response.data.success) {
      toast.success(response.data.message)
      await fetchList()
    } else {
      toast.error(response.data.message || "Error removing food")
    }
  } catch (error) {
    console.error(error)
    toast.error(error.response?.data?.message || "Error removing food")
  }
}


  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            
            <img
  src={item.image}
  alt={item.name}
  className="food-image"
/>

            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p onClick={()=>removeFood(item._id)} className="delete-icon">❌</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
