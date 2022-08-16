import React, { useState } from 'react'
import ProductList from './ProductList'
import Footer from './Footer';
import AddProduct2 from './AddProduct2';

const Admin = () => {
  const [loader,setLoader]=useState(false);
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState("");
  return (
    <div>
    {/* <AddProduct setLoader={setLoader} loader={loader} loading={loading} setLoading={setLoading} message={message} setMessage={setMessage} /> */}
    <AddProduct2 setLoader={setLoader} loader={loader}/>
    <ProductList setLoader={setLoader} loader={loader} setLoading={setLoading} message={message} setMessage={setMessage} />
    <Footer/>
    </div>
  )
}

export default Admin