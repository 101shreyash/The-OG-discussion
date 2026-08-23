import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";



function ProfilePic() {

    let navigate = useNavigate();
    let { register, handleSubmit, reset } = useForm();

    const asknameState = useLocation();
    


    function AfterSubmit(data) {

        const ppobj = data.profilepic[0]
         const profilepic = new FormData()
         profilepic.append("profilepic" , ppobj)

        async function profilePicCall() {

            try {
                
             const result =   await fetch('http://localhost:8001/uploadprofile' , {

                method : "POST",
                body : profilepic,
                credentials : "include"

               })

               const msg = await result.json()               

               if (msg.message === 'Session Expired Please login again' && result.status === 401 && msg.success === false) {

                toast.error("Session Expired Please login again" , {duration : 1500})
               return  navigate("/login")
                
               }

               if (msg.success === true && result.status === 200 && msg.message === "Profile Picture Uploaded") {
                
                toast.success("Profile Picture Uploaded sucessfully !" , {duration : 1500})
                return navigate("/profile")

               }

            }
            
            catch (error) {
                
               toast.error(error.message , {duration : 2000})
             return reset();
                
                
            }

        }

        profilePicCall();


    }

    return <div style={{ marginTop: "5%" }}>

        <h1 className="main-heading">Upload Your Profile Picture </h1>
        {asknameState.state ? <h2 className="sub-heading">{asknameState.state}</h2> : <h2 className="sub-heading">Buddy</h2>}
        <form onSubmit={handleSubmit(AfterSubmit)}>

            <input type="file" accept=".jpeg,.jpg,.png,.svg" required {...register("profilepic")} />
            <button style={{height : "30px"}}>Upload</button>

        </form>
        <br /><br /><br /><br />

        <Link to="/profile" className="skip-btn">Not Now!</Link>
    </div>


}

export default ProfilePic;