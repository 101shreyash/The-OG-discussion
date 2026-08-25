import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast"



function UserProfile() {

    let { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();


    // ------------------- My profile --------------------
    let [userpp, setuserpp] = useState();
    let [usernickname, setusernickname] = useState();
    let [username, setusername] = useState();
    let [joineddate, setjoineddate] = useState();


    async function fetchUserProfile() {

        try {

            const result = await fetch("http://localhost:8001/myprofile", {
                method: "GET",
                credentials: "include",
                headers: ({
                    'Content-Type': 'application/json'
                })
            })


            const msg = await result.json()            

            const unformattedDate = msg.message.joined_date
            const formatedDate = unformattedDate?.substring(0, 10)


            setjoineddate(formatedDate)
            setusername(msg.message.username)
            setusernickname(msg.message.nickname)
            setuserpp(msg.message.profile_picture)


            if (result.status === 401 && msg.success === false && msg.message === "Session Expired Please login again") {

                toast.error("Session Expired Please login again", { duration: 1500 })
                return navigate("/login")

            }

            if (msg.success === false && msg.message === "Could not verify the token please login again") {

                toast.error("Could not verify the token please login again" , {duration : 1200})
                return navigate("/login")
                
            }

        }

        catch (error) {

            console.log(error);
            return toast.error(error.message, { duration: 2000 })



        }

    }   // fetchUserProfile func Scope ends here


    useEffect(() => {

        fetchUserProfile()

    }, [])



    function SearchUser(data) {
        
        return  navigate("/friendsprofile" , {state : data})
         
        
    }

    return <div style={{ marginTop: "6%" }}>

        <Link to="/homepage" className="common-links">Homepage</Link>
        <h1 className="main-heading">Your Profile</h1>
        <img className="userpp" src={`http://localhost:8001/profilepic/${userpp}`} alt="profilepic" />

        {username ? <p className="sub-head">Username : {username}</p> : ""}
        {usernickname ? <p className="sub-head">Nickname : {usernickname}</p> : ""}
        {joineddate ? <p className="sub-head"> JoinedAt : {joineddate}</p> : ""}
        <form onSubmit={handleSubmit(SearchUser)}>
            <h1 className="sub-head">Search Your Friends Username And See Thier Communities </h1>
            <input style={{ height: "30px", width: "15%" }} type="search" placeholder="Search Username" {...register("friendUsername")} required />
            &nbsp; &nbsp;
            <button>Search</button>
        </form>

    </div>



}


export default UserProfile;