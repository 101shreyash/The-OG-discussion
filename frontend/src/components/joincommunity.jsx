import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"


function JoinCommunity() {

    let { register, handleSubmit, reset } = useForm();
    let exploreCommuminityState = useLocation();
    const communityName = exploreCommuminityState.state.communityname
    const communityId = exploreCommuminityState.state.communityid


    const navigate = useNavigate();

    function AfterPasskey(data) {
        
        const passkey = data.passkey        
        

        async function NetworkCall() {

            const result = await fetch(`http://localhost:8001/joincommunity/${communityId}` , {
                method : "POST",
                credentials : "include",
                body : JSON.stringify({passkey : passkey}),
                headers : ({
                    'Content-type' : 'application/json'
                })
            })
            

            const msg = await result.json()
            // console.log(msg);
            

            if (msg.message === "Session Expired Please login again" && msg.success === false && result.status === 401) {
   
                toast.error("Session Expired Please login again" , {duration : 2000})
                return navigate("/login")
                
            }

            if (msg.message === "Community Passkey Didin't matched" && msg.success === false && result.status === 401) {

                toast.error("Community Passkey Didin't matched" , {duration : 1300})
                return reset();
                

            }

            if (msg.message === "Community Joined Sucessfully" && msg.success === true && result.status === 200) {

                toast.success("Community Joined Sucessfully" , {duration : 1500})
                return navigate("/homepage")
                
            }

            if (msg.message === "You've Alredy Joined The community" && msg.success === true && result.status === 200) {

                toast.success("You've Alredy Joined The community" , {duration : 1500})
                return navigate("/homepage")
                
            }
            

            
        }

        NetworkCall();


    }

    return <div style={{ marginTop: "6%" }}>

        <h1 className="sub-heading">TO JOIN </h1>
        <h1 className="main-heading">{communityName}</h1>
        <br />
        <h2 className="sub-head">Enter Their  community Passkey !</h2>
        <form onSubmit={handleSubmit(AfterPasskey)}>
            <input style={{ height: "40px", width: "10%", textAlign: 'center' }} type="password" placeholder="Enter community Passkey" required {...register("passkey")} />  &nbsp; &nbsp;
            <button type="submit" className="click-btn">Filter</button>


        </form>

    </div>

}

export default JoinCommunity;