import { Link, useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form"
import { toast } from 'react-hot-toast';

function Login() {

    let navigate = useNavigate();

    let {register , handleSubmit} = useForm();

    function AfterSubmit(data) {

        console.log(data);
       toast.success("Login Sucessfull" , {duration : 1000})
        navigate("/askname")
        
        
    }


    return <div style={{marginTop : "6%"}}>
    
    <h1>Login Now To Get Started</h1>
    <form onSubmit={handleSubmit(AfterSubmit)}>

        <input className="signup-inputs"  type="text"  placeholder="Enter your username"   required {...register("username")}/> &nbsp;
        <input className="signup-inputs"  type="password"   placeholder="Enter your password"   required {...register("password")}/> &nbsp;
        <button type="submit">Login</button>
    </form>
    <p>New Here? <Link to="/signup" className="footer-links">Signup Instead</Link></p>
    
    
    </div>
    
}

export default Login;