import { useForm } from "react-hook-form";
import {useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { useEffect } from "react";

function AskName() {

    let { register, handleSubmit , reset } = useForm();
    let navigate = useNavigate();

    async function checkNickname() {

        try {

            const result = await fetch("http://localhost:8001/checknickname" , {
                credentials : "include",
                method : "GET",
                headers : ({
                    'Content-Type' : 'application/json'
                })
            })

             const msg = await result.json()

             if (msg.success === true && msg.message === 'No need for nickname' && result.status === 200) {
                
                navigate("/profilepic")
                
             }
             
            
        } 
        
        catch (error) {

            toast.error(error.message)
            
        }
        
    }


    useEffect(() => {

        checkNickname();
        

    } , [])


    function AfterSubmit(data) {

        console.log(data.nickname);

        async function askNameCall() {
            
         const result = await fetch("http://localhost:8001/askname" , {
            
            method : "POST",
            credentials : "include",
            body : JSON.stringify({nickname : data.nickname}),
            headers : ({
                'Content-Type' : 'application/json'
            })

           })

           const msg = await result.json()

           if (result.status === 401 && msg.message === "Session Expired Please login again" && msg.success === false) {

            toast.error("Session Expired Please Login Again" , {duration : 1800})
           return navigate("/login")
            
            
           }

             if (result.status === 400 && msg.message === "Nickname Shouldn't contain special characters and Numbers" && msg.success === false) {

                toast.error("Nickname Shouldn't contain special characters and Numbers" , {duration : 1800})
                return reset();
                
             }   
             
             if (result.status === 200 && msg.success === true) {

               return navigate("/profilepic" , {state : data.nickname})
                
             }

        }

        askNameCall()

        // navigate("/profilepic")

    }

    return <div style={{ marginTop: "6%" }}>

        <form onSubmit={handleSubmit(AfterSubmit)}>
            <h1 className="main-heading">WHAT DO YOU WANT OTHERS TO CALL YOU ?</h1>
            <input style={{ height: "60px", width: "30%", textAlign: "center" }} type="text" placeholder="What should they call You ?" required {...register("nickname")} />
            &nbsp; &nbsp;
            <button type="submit" className="click-btn">Get Started </button>
        </form>


    </div>


}

export default AskName;