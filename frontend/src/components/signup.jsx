import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import { toast } from 'react-hot-toast';


function Signup() {

    let navigate = useNavigate();

    let { register, handleSubmit , reset } = useForm();

    function AfterSubmit(data) {

        console.log(data);

        async function signupCall() {

            try {

                const result = await fetch("http://localhost:8001/signup", {
                    method: "POST",
                    body: JSON.stringify({ username: data.username, password: data.password }),
                    headers: ({
                        'Content-Type': 'application/json'
                    })
                })


                const msg = await result.json()

                if (msg.success === false && msg.message === "Username shouldn't be more than 15 characters and less than 5") {

                    return toast.error("Username shouldn't be more than 15 characters and less than 5", { duration: 2500 })

                }

                if (msg.success === false && msg.message === "Username shouldn't Contain Special Characters And Spaces") {

                    reset();
                   return toast.error("Username shouldn't Contain Special Characters And Spaces",
                    {duration: 2500})



                }

                if (msg.success === false && msg.message === "Password should atleast be of 8 characters") {

                    return toast.error("Password should atleast be of 8 characters",
                    {duration: 2500})



                }

                if (msg.success === false && result.status === 409 && msg.message === "Username alredy exists try different one") {

                    toast.error("Username alredy exists try different one",
                    {duration: 2500})
                   return reset();


                }

                

                if (result.status === 200 && msg.success === true && msg.message === "Signup Sucessfull") {

                     toast.success("Signup Sucessfull",
                    {duration: 1000})
                  return navigate("/login")


                    
                }





            }

            catch (error) {

                console.log(error);
                reset();
                toast.error(error.message, { duration: 1000 })

            }

        }

        signupCall()


    }


    return <div style={{ marginTop: "6%" }}>

        <h1> Signup Now !</h1>
        <form onSubmit={handleSubmit(AfterSubmit)}>

            <input className="signup-inputs" type="text" placeholder="Enter your username" required {...register("username")} /> &nbsp;
            <input className="signup-inputs" type="password" placeholder="Enter your password" required {...register("password")} /> &nbsp;
            <button type="submit">Signup</button>
        </form>
        <p>Alredy Have an Account?<Link to="/login" className="footer-links">Login</Link></p>


    </div>

}

export default Signup;