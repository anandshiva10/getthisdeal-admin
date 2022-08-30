import React,{useEffect, useState} from 'react'
import { firestore } from '../api/firebase'
import {collection,doc, getDocs,deleteDoc} from "firebase/firestore"
import { toast } from 'react-toastify'
import "./productList.css"
import { ClimbingBoxLoader, ScaleLoader } from 'react-spinners'

const Table = ({setLoader,loader,setLoading}) => {
    const [data,setData] = useState({})
    const [dataFound, setDataFound]=useState(false)
    const [sortKey,setSortKey]=useState("latest")
    const initialValues={
        total:"0",
        amazon:"0",
        flipkart:"0",
        others:"0"
    }
    const [count,setCount]=useState(initialValues)
    useEffect(() => {
        const productListRef= collection(firestore,'products')
        
        getDocs(productListRef).then(response  => {
            const products=response.docs.map(doc=>({
                data: doc.data(),
                id: doc.id,
            }))
            // const sproduct=products.sort(function(a,b){
            //     return b.data.created_timeStamp-a.data.created_timeStamp
            //   })
            //   setData(sproduct)
            if(products.length>=1){
                var sproduct=[]
                if(sortKey.includes('oldest')){
                    sproduct =products.sort(function(a,b){
                        return a.data.created_timeStamp-b.data.created_timeStamp
                      })
                    }
                else if(sortKey.includes('latest')){
                     sproduct=products.sort(function(a,b){
                        return b.data.created_timeStamp-a.data.created_timeStamp
                      })
                }
                else if(sortKey.includes('highest')){
                    sproduct=products.sort(function(a,b){
                       return b.data.app_sale_price-a.data.app_sale_price
                     })
               }
               else if(sortKey.includes('lowest')){
                sproduct=products.sort(function(a,b){
                   return a.data.app_sale_price-b.data.app_sale_price
                 })
           }
           else if(sortKey.includes('discount')){
            sproduct=products.sort(function(a,b){
               return b.data.discount_percentage-a.data.discount_percentage
             })
       }   
                      setData(sproduct)
                      console.log(data)
                
              }
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
    
    useEffect(() => {
        console.log(sortKey)
        setDataFound(false)
      setLoader(!loader)
    }, [sortKey])
    
    useEffect(() => {
        if(data.length>0){
      setCount({...count,})
            var ama=0
            var fk=0
            var ot=0
            data.forEach(function(a){
                console.log(a.data.site)
                if(a.data.site==='amazon')
                ama=ama+1
                else if(a.data.site==='flipkart')
                fk=fk+1
                else
                ot=ot+1
            })
            setCount({...count,total:data.length,amazon:ama,flipkart:fk,others:ot}) 
        }
        console.log(ama)
    }, [data])
    

  return (
    <div>
        <div className='badges'>
            <div className='badge'>
                <div className='label'>
                    Total Products
                </div>
                <div className='value'>
                   {count.total}
                </div>
            </div>
            <div className='badge'>
                <div className='label'>
                    Amazon
                </div>
                <div className='value'>
                    {count.amazon}
                </div>
            </div>
            <div className='badge'>
                <div className='label'>
                    Flipkart
                </div>
                <div className='value'>
                    {count.flipkart}
                </div>
            </div>
            <div className='badge'>
                <div className='label'>
                   Others
                </div>
                <div className='value'>
                {count.others}
                </div>
            </div>
 
        </div>
    <div className='productList'>
            <div className='sorter'>
            Sort by:
            <select value={sortKey} name="sort" onChange={e=>setSortKey(e.target.value)}>
            <option value="latest">Latest products</option>
            <option value="oldest">Oldest products</option>
            <option value="lowest">lowest price</option>
            <option value="highest">highest price</option>
            <option value="discount">Discount %</option>
          </select>
            </div>
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
                    <th style={{textAlign:"center"}}>   </th>
                    <th style={{textAlign:"center"}}>   </th>
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
                            <td><a ><i class="fa-solid fa-pen-to-square"></i></a></td>
                        </tr>
                    )
                })
                }
            </tbody>
            
        </table>
        :
        <div className='noData'>No Data Found</div>:<div className='loader'><ScaleLoader
        size={20}
        
      /></div>}
    </div>
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