import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { toast } from 'react-hot-toast';

function Login() {

    let navigate = useNavigate();

    let { register, handleSubmit, reset } = useForm();

    function AfterSubmit(data) {
        
        async function LoginCall() {

            try {

                const result = await fetch("http://localhost:8001/login", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({ username: data.username, password: data.password }),
                    headers: ({
                        'Content-Type': "application/json"
                    })

                })

                const msg = await result.json()


                if (result.status === 401 && msg.success === false && msg.message === "Invalid Credentials Username or password didn't matched") {

                    toast.error("Invalid Credentials Username or password didn't matched Enter valid Credentials", { duration: 2300 })
                    return reset();

                }

                if (result.status === 200 && msg.success === true && msg.message === "Logged In Sucessfull") {

                    return navigate("/askname")

                }

            }

            catch (error) {

                return toast.error(error.message)

            }

        }

        LoginCall();

    }


    return <div style={{ marginTop: "6%" }}>

        <h1>Login Now To Get Started</h1>
        <form onSubmit={handleSubmit(AfterSubmit)}>

            <input className="signup-inputs" type="text" placeholder="Enter your username" required {...register("username")} /> &nbsp;
            <input className="signup-inputs" type="password" placeholder="Enter your password" required {...register("password")} /> &nbsp;
            <button type="submit">Login</button>
        </form>
        <p>New Here? <Link to="/signup" className="footer-links">Signup Instead</Link></p>


    </div>

}

export default Login;