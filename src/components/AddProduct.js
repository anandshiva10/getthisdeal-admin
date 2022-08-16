import { addDoc, collection } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { amazon, fetchData } from '../api/amazon';
import { firestore } from '../api/firebase';
import "./search.css";
import { toast } from 'react-toastify'
import Modal from 'react-modal';

const AddProduct = ({setLoader,loader,loading,setLoading,message,setMessage}) => {
    const [pId,setPId] = useState("")
    const [store,setStore]=useState("flipkart")
    const [modalIsOpen, setIsOpen] = React.useState(false);
  
    function openModal() {
      setIsOpen(true);
    }
    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width:'50vw',
        },
      };

  
    function closeModal() {
      setIsOpen(false);
    }

   const handleSave = async(e) =>{
        e.preventDefault();
        setMessage("Fetching the product")
        console.log(store)
        setLoading(true)
        console.log(pId);
        const url="https://amazon24.p.rapidapi.com/api/product"
        const productDetailData= await fetchData(`${url}/${pId}/?country=IN`,amazon)
        console.log(productDetailData)
        const data =(({noResults,
            
            product_id,
            product_title,
            price_information,
            product_main_image_url
        }) =>({noResults,
            
            product_id,
            product_title,
            price_information,
            product_main_image_url
        })) (productDetailData);
        console.log(data)

        setMessage("Adding it to the DB.")
        if(!(productDetailData.noResults)){
        console.log("adding the product")
        try{
            // addDoc(ref,productDetail);
            // 
            await addDoc(collection(firestore, 'products'), data)   
            setLoading(false)
            toast.success("product added to the list.")
            
        }catch(error){
            toast.error(error)
        }
        
        setLoader(!loader)
        
    }
    else{
        console.log("not found")
    }


    }

  return (
    <div className='searchBar'>
        <form onSubmit={handleSave}>
            <div className='search-lable'>
            <label>Enter product ID</label>
            </div>
            <div className='search-input'>
            <input type='text' value={pId} onChange={(e)=>setPId(e.target.value)}  />
            </div>
            <div>
            <select value={store} onChange={(e)=>setStore(e.target.value)}>
            <option value="amazon">Amazon</option>
            <option value="flipkart">Flipkart</option>
            </select>
            </div>
            <div className='search-button'>
            <button className='btn41-43 btn-41' type="submit">Save</button>
            </div>
            {loading ? <p className='message'> {message}</p> : <></>}
        </form>
        <button className='btn41-43 btn-41' onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >

        <button onClick={closeModal}>close</button>

        <form>
          <div className='search-lable'>
            <label>Enter product ID</label>
            </div>
            <div className='search-input'>
            <input type='text' value={pId} onChange={(e)=>setPId(e.target.value)}  />
            </div>
        </form>
      </Modal>
        
    </div>
  )
}

export default AddProduct