import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function AskName() {


    let { register, handleSubmit } = useForm();
    let navigate = useNavigate();


    function AfterSubmit(data) {

        console.log(data);
        navigate("/profilepic")

    }

    return <div style={{ marginTop: "6%" }}>

        <form onSubmit={handleSubmit(AfterSubmit)}>
            <h1 className="main-heading">WHAT DO YOU WANT OTHERS TO CALL YOU ?</h1>
            <input style={{ height: "60px", width: "30%", textAlign: "center" }} type="text" placeholder="What should they call You ?" required {...register("nickname")} />
            &nbsp; &nbsp;
            <button type="submit" className="click-btn">Get Started </button>
        </form>


    </div>


}

export default AskName;