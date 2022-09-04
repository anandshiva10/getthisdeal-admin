import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { amazon, fetchData } from '../api/amazon';
import { firestore } from '../api/firebase';
import "./addProduct.css"
const AddProduct2 = ({setLoader,loader}) => {
    const initialValues = {
        product_id:"",
        product_title:"",
        app_sale_price:"",
        discount:"0",
        discount_percentage:"0",
        original_price:"",
        product_main_image_url:"https://www.chanchao.com.tw/images/default.jpg",
        site:"amazon",
        product_url:"",
        comment:"",
        hot_deal:false,
        cat:"other",
        created_timeStamp:new Date().getTime()
    }
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [values,setValues] =useState(initialValues)
    function openModal() {
      setIsOpen(true);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
          ...values,
          [name]: value,
        });
      };

      const handletoggle = ({ target }) =>
    setValues(s => ({ ...s, [target.name]: !s[target.name] }));

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          minWidth:'50vw',
          minHeight:'50vh',
          zIndex:"10",
  
        },
      };

  
    function closeModal() {
      setIsOpen(false);
    }

   const fetch = async (e) => {
    e.preventDefault();
    const website=values.site;
    
    if(website.includes('amazon')){
    toast.info("fetching the data from Amazon")
    const url="https://amazon24.p.rapidapi.com/api/product"
    const productDetailData= await fetchData(`${url}/${values.product_id}/?country=IN`,amazon)
    if(!(productDetailData.noResults)){
      console.log(productDetailData)
        toast.success("Product found")
        setValues({
            ...values,product_title:productDetailData.product_title,
            product_main_image_url:productDetailData.product_main_image_url,         
            app_sale_price:productDetailData.price_information.app_sale_price,
            discount:productDetailData.price_information.discount,
            discount_percentage:productDetailData.price_information.discount_percentage,
            original_price:productDetailData.price_information.original_price,
            product_main_image_url:productDetailData.product_main_image_url,
            site:"amazon",
            product_url:`https://www.amazon.in/gp/product/${productDetailData.product_id}/?tag=anji1414-21`
            ,created_timeStamp:new Date().getTime()
        })

    }
    else{
        toast.error("Product Not Found")
    }
    }
    else{
        toast.error("Enter data manually")
    }
   }
    const handleSave = async(e) =>{
        e.preventDefault();
        setIsOpen(false);
        toast.info("Adding product to the DB")
        console.log(values.created_timeStamp)
        try{
            await addDoc(collection(firestore, 'products'), values)   
        }catch(error){
            toast.error(error)
        }
        toast.success("Product added Successfully")
        setValues(initialValues)
        setLoader(!loader)
    }
    useEffect(() => {
        let sale=parseInt(values.app_sale_price)
        let original=parseInt(values.original_price)
        let disc=(original-sale)
        let dp=((disc/original)*100).toFixed(2)
        if(!(isNaN(parseFloat(disc)))){
            setValues({...values, discount:String(disc) , discount_percentage:String(dp)  ,created_timeStamp:new Date().getTime()})
            
        }
        else{
          setValues({...values, discount:String(0) , discount_percentage:String(0)  ,created_timeStamp:new Date().getTime()})
            
        }
    }, [values.app_sale_price,values.original_price])
    
    
    return (
    <div>
        <button className='btn41-43 btn-41' onClick={openModal}>Add Product</button>
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >

        <a onClick={closeModal} className="project__modal-close">
        <i className="fa-solid fa-xmark"></i>
        </a>

        <form className='form' onSubmit={handleSave}>
          <div className='line'>
          <div className='search-lable'>
            <label>Enter product ID :</label>
            <input type='text' value={values.product_id} name="product_id" onChange={handleInputChange}  />
            </div>
            <div>
            <select value={values.site} name="site" onChange={handleInputChange}>
            <option value="amazon">Amazon</option>
            <option value="flipkart">Flipkart</option>
            <option value="myntra">Myntra</option>
            <option value="ajio">Ajio</option>
            <option value="other">Other</option>
          </select>
            </div>
            <button className='btn41-43 btn-41' onClick={fetch}>Fetch</button>
            </div>
            <div className='line'>
            <div>
            <label>Product Title :</label>
            <input type='text'  value={values.product_title} name="product_title" onChange={handleInputChange}  />
            </div>
            <div>
            <input
            type="checkbox"
            name="hot_deal"
          checked={values.hot_deal}
          onChange={handletoggle}
        />
        Hot Deal
            </div>
            
            </div>
            <div>
            <label>Product Image Url :</label>
            <input type='text' value={values.product_main_image_url} name="product_main_image_url" onChange={handleInputChange}  />
            </div>
            <div>
            <label>Original price</label>
            <input type='text' value={values.original_price} name="original_price" onChange={handleInputChange}  />
            </div>
            <div>
            <label>Sale price</label>
            <input type='text' value={values.app_sale_price} name="app_sale_price" onChange={handleInputChange}  />
            </div>
            <div>
            <label>Discount price</label>
            <input type='text' value={values.discount} name="discount" onChange={handleInputChange}  />
            </div>
            <div>
            <label>Discount percentage</label>
            <input type='text' value={values.discount_percentage} name="discount_percentage" onChange={handleInputChange}  />
            </div>
            <div className='line'>
            <div>
            <label>Product Url</label>
            <input type='text' value={values.product_url} name="product_url" onChange={handleInputChange}  />
            </div>
            <div>
            <label>Category</label>
            <select value={values.cat} name="cat" onChange={handleInputChange}>
            <option value="fashion">Fashion</option>
            <option value="electronics">Electronics</option>
            <option value="home">Home Appliances</option>
            <option value="books">Books</option>
            <option value="sports">Sports</option>
            <option value="mobiles">Mobiles</option>
            <option value="kitchen">Kitchen</option>
            <option value="kids">Kids</option>
            <option value="grocery">Grocery</option>
            <option value="other">Other</option>
          </select>
            </div>
            </div>
            <div>
            <label>Comments</label>
            <input type='text' value={values.comment} name="comment" onChange={handleInputChange}  />
            </div>
            <button className='btn41-43 btn-41' type="submit">Save</button>
        </form>
      </Modal>
    </div>
  )
}

export default AddProduct2