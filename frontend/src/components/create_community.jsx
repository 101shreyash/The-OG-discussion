import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


function CreateCommunity() {

   let navigate =  useNavigate();

    let {register , handleSubmit} = useForm();

    function AfterCreate(data) {
        
        const bgimage = data.bgimage[0]        
        alert("Sucessfully Created")
      return  navigate("/homepage")
        
    }

    return <div className="">

        <h1 className="main-heading">Create Your Own Community</h1>

        <form  onSubmit={handleSubmit(AfterCreate)}  className="community-form">
            <h2> What Will You Name Your Community ?</h2>
            <input style={{height : "40px" , width : "20%"}} type="text" placeholder="Community Name"  required {...register("community_name")}/>
            <h2> What About Passkeys ? </h2>
            <input style={{height : "40px" , width : "12%"}} type="password" placeholder="Community Passkey"  required {...register("pass_key")}/>
            <h2> How would You Describe Your Community In 250 Words ?</h2>
            <textarea style={{height : "120px", width : "50%", textAlign : "center" , alignContent : "center"}} placeholder="Community Description" required {...register("desc")}></textarea>
            <h2>What's the Type of Community You're Building ?</h2>
            <select required {...register("type")}>

                <option value=""  hidden>Select Type</option>
                <option>Gym And Fitness </option>
                <option>EntertainMent </option>
                <option>Yoga And Health</option>
                <option>Anime</option>
                <option>Movies</option>
                <option>Coding</option>
                <option>Engineering</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Astronomy</option>
                <option>Music Intruments</option>
                <option>Music</option>
                <option>Weather</option>
                <option>Plants And Gardening</option>
                <option>Combat Sports</option>
                <option>General Sports</option>

            </select>
            <h2> Upload Background Image for Giving Your Community A Identity </h2>
            <input type="file" accept=".jpeg,.jpg,.png,.svg"  required {...register("bgimage")}/>
        <br /><br /><br /><br />
        <button type="submit" className="create-comm-btn">Create Community</button>
        </form>



    </div>

}

export default CreateCommunity;