import { Link, useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form"


function Login() {

    let navigate = useNavigate();

    let {register , handleSubmit} = useForm();

    function AfterSubmit(data) {

        console.log(data);
        alert("Login Sucessfull")
        navigate("/askname")
        
        
    }


    return <>
    
    <h1>Login Now To Get Started</h1>
    <form onSubmit={handleSubmit(AfterSubmit)}>

        <input className="signup-inputs"  type="text"  placeholder="Enter your username"   required {...register("username")}/> &nbsp;
        <input className="signup-inputs"  type="password"   placeholder="Enter your password"   required {...register("password")}/> &nbsp;
        <button type="submit">Login</button>
    </form>
    <p>New Here? <Link to="/signup" className="footer-links">Signup Instead</Link></p>
    
    
    </>
    
}

export default Login;