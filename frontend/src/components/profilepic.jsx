import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";


function ProfilePic() {

    let navigate = useNavigate();
    let { register, handleSubmit, reset } = useForm();


    function AfterSubmit(data) {

        const pp = data.profilepic[0]

        console.log(pp);
        navigate("/profile")


    }

    return <div style={{ marginTop: "5%" }}>

        <h1 className="main-heading">Upload Your Profile Picture </h1>
        <form onSubmit={handleSubmit(AfterSubmit)}>

            <input type="file" accept=".jpeg,.jpg,.png,.svg" required {...register("profilepic")} />
            <button style={{height : "30px"}}>Upload</button>

        </form>
        <br /><br /><br /><br />

        <Link to="/profile" className="skip-btn">Not Now!</Link>
    </div>


}

export default ProfilePic;