const { useState, useEffect } = require("react");




function FormComponent(){

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );    const [goods,setGoods] = useState([]);


    const [obj,setObj] = useState({
        product_name : "",
        product_description:"",
        product_price:0,
    });
    const [modal,setModal] = useState(false)
    const [flag, setFlag] = useState(false);
    const [loading,setLoading] = useState(true)
    const [message,setMessage] = useState('')

    useEffect(()=> {
       
      console.log(loading);
        fetch('http://localhost:5002/goods')
        .then((res)=> res.json()) 
        .then((data)=> setGoods(data))
        .then(()=>setLoading(false))
    },[flag,loading])

    const addProduct = ()=>{
       fetch('http://localhost:5002/add-goods',{
        method:"POST",
        headers:{
            "Content-Type":'application/json',
        },
        body:JSON.stringify(obj)
       })
       .then((res)=> res.text()) 
       .then((data)=>setMessage(data))
       .then(()=>{
        setFlag(!flag)
       })
       .catch((err)=>setMessage('Emeliyyat yerine yetirilmedi'))
    }
    

    const deleteProduct = (item) => {
         try{
            fetch(`http://localhost:5002/delete-goods/${item.id}`, {
                method: "DELETE",
              })
                .then((res) => res.text())
                .then((data)=>setMessage(data))
         }
         catch(err){
            setMessage("Emeliyyat yerine yetirilmedi")
         }
      };


      const searchGoods=(s)=>{
        fetch(`http://localhost:5002/search-goods/${s}`)
        .then((res) => res.json())
        .then((data) => setGoods(data))
      }


      if (loading) {
        return (
          <div id="loading">
          <div></div>
          </div>
        );
      }
    return(

        <div>
            
            <div>
                <input type="text" onChange={(ev)=> setObj({...obj,product_name: ev.target.value})}/>
                <input type="text" onChange={(ev)=> setObj({...obj,product_description: ev.target.value})}/>
                <input type="number" onChange={(ev)=> setObj({...obj,product_price: ev.target.value})}/>
                <button onClick={()=>{
                    addProduct();
                    setModal(!modal);
                }}>ADD</button>

                <br/>
                <input onChange={(e)=>{
                    e.target.value === ''?setFlag(!flag):searchGoods(e.target.value);
                }}  placeholder="search"/>
            </div>

            <ul style={{listStyle:'none'}}>
                {goods.map((item,index)=>{
                    return(
                        <li key={index}>
                             {item.id}.{item.product_name} {item.product_description}  {item.product_price}
                             <button
                            onClick={() => {
                                deleteProduct(item);
                                setFlag(!flag);
                                setModal(!modal);
                  }}
                >
                  DELETE
                </button>
                        </li>
                    )
                })}
            </ul>
            {modal && (
        <div id="modal">
          <p>{message}</p>
          <button onClick={() => setModal(!modal)}>Cancel</button>
        </div>
      )}
        </div>
    )

}

export default FormComponent