import { Link } from "react-router-dom";
import {useForm} from "react-hook-form";


function UserProfile() {

    let {register , handleSubmit , reset} = useForm();

    function AfterSearch(data) {
        
        console.log(data);
        reset();

        
    }


    return <div style={{marginTop : "6%"}}>

        <Link to="/homepage" className="common-links">Homepage</Link>
    
    <h1 className="main-heading">Your Profile</h1>
    <p>Username : </p>
    <p>Nickname :</p>
    <img src="profilepicture" alt="profilepic" />


    
    <form onSubmit={handleSubmit(AfterSearch)}>
    <h1 className="sub-head">Search Your Friends Username And See Thier Communities </h1>
        <input style={{height : "30px", width : "15%"}} type="search" placeholder="Search Username" {...register("frinedusername")} required/>
        &nbsp; &nbsp;
    <button>Search</button>

    </form>
    
    </div>



}


export default UserProfile;