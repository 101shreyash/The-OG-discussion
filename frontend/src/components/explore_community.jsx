import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"
import { useState } from "react";

function ExploreCommunity() {


  let {register : registerselect , handleSubmit : handleselect , reset : resetselect } = useForm();
  let {register : registersearch , handleSubmit : handlesearch , reset : resetsearch } = useForm();

  let [commtypeinfo , setcommtypeinfo] = useState([]);

 let navigate =  useNavigate();

    function AfterSelect(data) {

        const communityType = data.communitytype

        async function NetworkCall() {

            try {

        const result =  await fetch(`http://localhost:8001/explorecommunity/${communityType}` , {
            
            method : "GET",
            credentials : "include",
            headers : ({
                'Content-type' : 'application/json'
            })
        })

        const msg = await result.json()
        
        if (result.status === 401 && msg.message === "Session Expired Please login again" && msg.success === false) {
            
            toast.error("Session Expired Please login again" , {duration : 1300})
            return  navigate("/login")
            
        }
        
        
        if (result.status === 404 && msg.message === "No Community found with given type try Creating a One" && msg.success === false) {
            
            toast("No Community found with given type Try Creating a New One" , {duration : 3000})
            return resetselect();
            
        }
        
        setcommtypeinfo(msg.message)
        
        
    }
    
            catch (error) {

                console.log(error);
                toast.error(error.message)
                
            }
            
        }

        NetworkCall();


        // resetselect();
        

    }

    function AfterSearch(data) {

        const communityName = data.communityname
        console.log(communityName);
        // resetsearch();
        
        
    }

   

    return <div style={{ marginTop: "5%" }}>

        <Link to="/homepage" className="common-links">HomePage</Link>

        <h3 className="sub-heading">Filter Communities Based On Your Prefrence </h3>

        {/* -------------------- Select Form  -------------------*/}
        <form onSubmit={handleselect(AfterSelect)}>

            <select required style={{ height: "40px", width: "10%", textAlign: 'center' }} {...registerselect("communitytype")}>
                 <option value="" hidden>Select Type</option>
                <option>Fitness And Health</option>
                <option>Entertainment </option>
                <option>Yoga And Health</option>
                <option>Anime</option>
                <option>Movies</option>
                <option>Coding</option>
                <option>Engineering</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>Computer Science</option>
                <option>Mathematics</option>
                <option>Astronomy</option>
                <option>Music Intruments</option>
                <option>Music</option>
                <option>Weather And Environment</option>
                <option>Politics</option>
                <option>Media And News</option>
                <option>Plants And Gardening</option>
                <option>Combat Sports</option>
                <option>General Sports</option>
                <option>Gaming</option>
                <option>Board Games</option>
                <option>Books Discussion</option>
                <option>Art and Creativity</option>
                <option>Others</option>
            </select>
            &nbsp;&nbsp;
            <button className="click-btn">Filter</button>
        </form>
        <br /><br />

 
       {commtypeinfo?.map((info) => {

        console.log(info);
        

         const createdDate = info.created_date.substr(0,10)
         
        return <div key={info.community_id}>

        {info?.community_bg_image? <img className="community-bg-image" src= {`http://localhost:8001/communityBG/${info.community_bg_image}`} alt="Community Background Image" /> : ""}
        {info?.community_name? <p className="community-name-style"> Community Name : {info.community_name}</p> : ""}
        {info?.community_description? <p style={{font : "caption"}}> Description : {info.community_description}</p> : ""}
        {info?.created_date? <p className="sub-head"> Created at  : {createdDate}</p> : ""}
        <button className="join-community-btn">Join {info.community_name}</button>
        <br /><br />

        
        </div>
        
       })}

        {/* ---------------- Search Form ----------------------- */}
        <form onSubmit={handlesearch(AfterSearch)}>
            <h3 className="sub-heading">Or Seach a Specific Community Name</h3>
            <input style={{ height: "40px", width: "20%", textAlign: 'center' }} type="search" placeholder="Search Community Name" required  {...registersearch("communityname")}/> &nbsp;
            <button className="click-btn" type="submit">Search</button>
        </form>

    </div>

}

export default ExploreCommunity;