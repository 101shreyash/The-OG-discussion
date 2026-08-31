import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useState } from "react";



function Homepage() {

    const navigate = useNavigate();

    let [communityname, setcommunityname] = useState([]);

    async function fetchMyCommunties() {

        try {

            const result = await fetch("http://localhost:8001/viewyourcommunity", {
                method: "GET",
                credentials: "include",
                headers: ({
                    'Content-type': 'application/json'
                })
            })

            const msg = await result.json()
            console.log(msg);
            
            setcommunityname(msg.message)


            if (msg.message === "Session Expired Please login again" && msg.success === false && result.status === 401) {

                navigate("/login")
                toast.error("Session Expired Please login again", { duration: 1500 })

            }


        }

        catch (error) {

            console.log(error);

            toast.error(error.message)

        }

    }


    useEffect(() => {

        fetchMyCommunties();

    }, [])

    async function LogoutCall() {


        try {

            const result = await fetch("http://localhost:8001/logout", {
                method: "DELETE",
                credentials: "include",
                headers: ({
                    'Content-type': 'application/json'
                })
            })

            if (result.status === 200) {


                toast.success("Logout Sucessfull", { duration: 1200 })
                return navigate("/")

            }


        }

        catch (error) {

            console.log(error);
            toast.error(error.message)


        }


    }

    return <div className="homepage-margin">

        <Link to="/createcommunity" className="common-links">Create Community</Link>
        <Link to="/explorecommunity" className="common-links">Explore Communities</Link>
        <Link to="/profile" className="common-links">Profile</Link>
        <button className="common-links" onClick={LogoutCall}>Logout</button>


        <h1 className="main-heading" style={{ textDecoration: "underline plum", textUnderlineOffset: "20px" }}>Your Communuties</h1>

        {typeof communityname === "string" ? <h1 style={{ color: "grey" }}>You Have not Yet Created Or Joined Any Community !  .</h1> :

            communityname.map((name) => {

                return <div key={name.community_id} style={{display : "inline-block"}}>

                    <Link className="common-links">{name?.community_name}</Link>

                </div>

            })

        }

    </div>


} // Homepage scope ends here

export default Homepage;