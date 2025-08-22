'use client'
import  supabase  from '@/lib/supabase/client';
import React, { useEffect, useState } from 'react';
import {Skeleton} from '@/components/ui/skeleton'

//step3: Implemented Type Restaurant = {}.
type Restaurant = {
  id: string;
  owner_name: string;
  restaurant_name: string;
  email: string;
  phone: string;
  address: string;
  upi_id: string;
  logo_url: string | null;
  qr_url: string;
  created_at: Date | null;
  user_id: string;
};

//Step1: created rafce RestaurantProfilePage.
export default function RestaurantProfilePage() {
  //Step2: create a useState hook to update the state after fetching data.
  //Step3: since using typescript i will have to create a type for this state so that type safety is assured.
  console.log("Inside the RestaurantProfilePage.");
  const [restaurant,setRestaurant] = useState<Restaurant | null>(null);
  //Since during fetching nothing no data will be available we will show loading for that we will use
  //this state loading.
  const [loading,setLoading] = useState<Boolean>(true);

  
  const [editingField, setEditingField] = useState<string | null>(null);


  
  const [formData,setFormData] = useState<Restaurant>({
  id: "", 
  owner_name: "",
  restaurant_name: "",
  email: "",
  phone: "",
  address: "",
  upi_id: "",
  logo_url: null,
  qr_url: "",
  created_at: null,
  user_id: "",
})
  console.log("before useEffect")
  useEffect(()=>{
    const fetchRestaurant = async() => {
      //getting the details of the current user form the supabase
      const {data:{user},error:authError} = await supabase.auth.getUser();
      if(authError || !user){
        console.log("User not found!");
        setLoading(false)
        return
      }
      console.log(user)
      //getting the details of the restaurant using the user_id fetched above.
const { data, error } = await supabase
  .from('restaurants') 
  .select('*')
  .eq('user_id', user.id)
  .single();
      if(error){
        console.log('error in fetching the restaurants data')
      }else{
        setRestaurant(data);
        setLoading(false);
        console.log(data);
      }
    }
    fetchRestaurant()
  },[])  
  console.log("after useEffect")
  //if loading we have a shadcn component which we will show while loadin is going on...
  if(loading) return <Skeleton className="h-32 w-full" />
  if (!restaurant) return <p className="text-muted">No restaurant profile found.</p>


  //

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const handleUpdate = async () => {
  const { error } = await supabase
    .from("restaurants")
    .update(formData)
    .eq("id", restaurant.id);

  if (error) {
    console.error("Update failed:", error.message);
  } else {
    alert("Restaurant updated successfully!");
    setEditingField(null);
    setRestaurant(formData); // optional: update local state
  }
};



return (
  <div className="space-y-6">
    {formData.logo_url && (
      <img
        src={formData.logo_url}
        alt={`${formData.restaurant_name} Logo`}
        className="h-24 w-24 rounded-full object-cover"
      />
    )}

    <div>
      <strong>Restaurant Name:</strong>{restaurant.restaurant_name}
      {editingField === "restaurant_name" ? (
        <input
          type="text"
          name="restaurant_name"
          value={formData.restaurant_name}
          onChange={handleChange}
          className="input"
        />
      ) : (
        <>
          {formData.restaurant_name}
          <button onClick={() => setEditingField("restaurant_name")} className="ml-2 text-blue-500">Edit</button>
        </>
      )}
    </div>

    <div>
      <strong>Owner:</strong>{restaurant.owner_name}
      {editingField === "owner_name" ? (
        <input
          type="text"
          name="owner_name"
          value={formData.owner_name}
          onChange={handleChange}
          className="input"
        />
      ) : (
        <>
          {formData.owner_name}
          <button onClick={() => setEditingField("owner_name")} className="ml-2 text-blue-500">Edit</button>
        </>
      )}
    </div>

    <div>
      <strong>Email:</strong>{restaurant.email}
      {editingField === "email" ? (
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input"
        />
      ) : (
        <>
          {formData.email}
          <button onClick={() => setEditingField("email")} className="ml-2 text-blue-500">Edit</button>
        </>
      )}
    </div>

    <div>
      <strong>Phone:</strong>{restaurant.phone}
      {editingField === "phone" ? (
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input"
        />
      ) : (
        <>
          {formData.phone}
          <button onClick={() => setEditingField("phone")} className="ml-2 text-blue-500">Edit</button>
        </>
      )}
    </div>

    <div>
      <strong>Address:</strong>{restaurant.address}
      {editingField === "address" ? (
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="input"
        />
      ) : (
        <>
          {formData.address}
          <button onClick={() => setEditingField("address")} className="ml-2 text-blue-500">Edit</button>
        </>
      )}
    </div>

    <div>
      <strong>UPI ID:</strong>{restaurant.upi_id}
      {editingField === "upi_id" ? (
        <input
          type="text"
          name="upi_id"
          value={formData.upi_id}
          onChange={handleChange}
          className="input"
        />
      ) : (
        <>
          {formData.upi_id}
          <button onClick={() => setEditingField("upi_id")} className="ml-2 text-blue-500">Edit</button>
        </>
      )}
    </div>

    <div>
      <strong>QR Code:</strong><br />
      {formData.qr_url!="" && (
         <img
        src={formData.qr_url}
        alt="Restaurant QR Code"
        className="h-32 w-32 mt-2"
      /> 
      )}
    </div>

    {restaurant.created_at && (
      <p className="text-sm text-muted">
        Profile created on: {new Date(restaurant.created_at).toLocaleDateString()}
      </p>
    )}

    <button onClick={handleUpdate} className="btn btn-primary mt-4">
      Save Changes
    </button>
  </div>
);

}

