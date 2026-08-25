import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom"


function FriendsProfile() {
    
   let friendProfileState =  useLocation();
   const friendInfo = friendProfileState.state?.friendUsername
  let navigate =  useNavigate();
  let [finalProfileInfo , setFinalProfileInfo] = useState(null);

   async function fetchFriendsProfile() {

   try {

   const result =  await fetch(`http://localhost:8001/friendsprofile/${friendInfo}` , {

        method : "GET",
        credentials : "include",
        headers : ({
            'Content-type' : 'application/json',
        })
        
    })

    const msg = await result.json()
    
    
    if (result.status === 401 && msg.success === false && msg.message === "Session Expired Please login again") {
        
        toast.error("Session Expired Please login again" , {duration : 1200})
        return  navigate("/login")
        
    }
    
    if (result.status === 404 && msg.message === "Profile not found enter valid username" && msg.success === false) {
        
        return toast("Profile not found enter valid username" , {duration : 1800 , removeDelay : 1000})
        
    }

    setFinalProfileInfo(msg.message)
        
    
   }
    catch (error) {

    toast.error(error.message , {duration : 1800})
    console.log(error.message);
    
   }

 
    
   }

   useEffect(() => {

    fetchFriendsProfile();

   } , [])



    return <div style={{marginTop : "6%"}}>

        <Link className="common-links" to="/profile"> Your profile </Link>
        <br />
    <h1 className="main-heading">{friendInfo} Profile</h1>
    {finalProfileInfo === null ? <p className="sub-heading">No Profile Found Enter valid Username</p> : ""}
 <img className="userpp" src={`http://localhost:8001/profilepic/${finalProfileInfo?.profile_picture}`} alt="profilepic"/> 
{finalProfileInfo?.username ? <h1 className="sub-head ">Username : {finalProfileInfo.username} </h1> : <h1 className="sub-head">Username : No profile Found Matching current username </h1>}
{finalProfileInfo?.nickname ? <h1 className="sub-head">Nickname : {finalProfileInfo.nickname}</h1> : <h1 className="sub-head">Nickname : No profile Found Matching current username  </h1>}




    </div>

}




export default FriendsProfile;