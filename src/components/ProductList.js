import React,{useEffect, useState} from 'react'
import { firestore } from '../api/firebase'
import {collection,doc, getDocs,deleteDoc} from "firebase/firestore"
import { toast } from 'react-toastify'
import "./productList.css"
import { ClimbingBoxLoader, ScaleLoader } from 'react-spinners'

const Table = ({setLoader,loader,setLoading}) => {
    const [data,setData] = useState({})
    const [dataFound, setDataFound]=useState(false)
    useEffect(() => {
        const productListRef= collection(firestore,'products')
        
        getDocs(productListRef).then(response  => {
            const products=response.docs.map(doc=>({
                data: doc.data(),
                id: doc.id,
            }))
            setData(products)
            setDataFound(true)
            console.log(data)
        }).catch(error =>console.log(error));

        return()=>{
            setData({})
        }
        
    
    }, [loader])

    const onDelete = async (datas) => {
        if(window.confirm("Sure you want to delete: "+datas.data.product_id+" ?")){
            console.log(datas.id)
            
            const taskDocRef = doc(firestore,'products', datas.id)
            try{
            toast.info("deleting")
            await deleteDoc(taskDocRef)
            toast.success("deleted")
            setLoading(false)
            } catch (err) {
                toast.error(err)
            }
            setDataFound(false)
            setLoader(!loader)
            
        }
    }

  return (
    <div className='productList'>
          {
                dataFound? data.length>=1?
        <table className='styled-table'>
            <thead>
                <tr>
                    <th style={{textAlign:"center"}}>Product ID</th>
                    <th style={{textAlign:"center"}}>Product Name</th>
                    <th style={{textAlign:"center"}}>Original Price</th>
                    <th style={{textAlign:"center"}}>sale Price</th>
                    <th style={{textAlign:"center"}}>Discount</th>
                    <th style={{textAlign:"center"}}>Discount %</th>
                    <th style={{textAlign:"center"}}>Delete</th>
                </tr>
            </thead>
          
            <tbody>
                {
                Object.keys(data).map((id)=>{
                    return(
                        <tr key={id}>
                            <td>{data[id].data.product_id}</td>
                            <td >{data[id].data.product_title}</td>
                            <td>{data[id].data.original_price}</td>
                            <td>{data[id].data.app_sale_price}</td>
                            <td>{data[id].data.discount}</td>
                            <td>{data[id].data.discount_percentage}</td>
                            <td><a onClick={()=> onDelete(data[id])}><i className="fa-solid fa-trash"/></a></td>
                        </tr>
                    )
                })
                }
            </tbody>
            
        </table>
        :
        <div className='noData'>No Data Found</div>:<div className='loader'><ScaleLoader
        size={20}
        speedMultiplier={2}
      /></div>}
    </div>
  )
}

const ProductList = ({setLoader,loader,setLoading,message,setMessage}) =>{
    return(
        <div style={{minHeight:"74vh"}}>
            <Table setLoader={setLoader} loader={loader} setLoading={setLoading} message={message} setMessage={setMessage} />
        </div>
    )
}

export default ProductList