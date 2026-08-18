import { Link, useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form"



function Signup() {

   let navigate = useNavigate();

    let {register , handleSubmit} = useForm();

    function AfterSubmit(data) {
        
        console.log(data);
        alert("Signup Sucessfull")
        navigate("/login")
        
    }


    return <>
    
    <h1> Signup Now !</h1>
    <form onSubmit={handleSubmit(AfterSubmit)}>

        <input className="signup-inputs"  type="text"  placeholder="Enter your username"   required {...register("username")}/> &nbsp;
        <input className="signup-inputs"  type="password"   placeholder="Enter your password"   required {...register("password")}/> &nbsp;
        <button type="submit">Signup</button>
    </form>
    <p>Alredy Have an Account?<Link to="/login" className="footer-links">Login</Link></p>
    
    
    </>
    
}

export default Signup;