import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"


function CreateCommunity() {

    let navigate = useNavigate();

    let { register, handleSubmit, reset } = useForm();

    function AfterCreate(data) {


        const communityname = data.community_name
        const passkey = data.pass_key
        const description = data.desc
        const type = data.type
        const unformatedCommBgImage = data.bgimage[0]; // bgimage 


        const multipartFormData = new FormData()

        multipartFormData.append("communityname", communityname)
        multipartFormData.append("description", description)
        multipartFormData.append("type", type)
        multipartFormData.append("commbg", unformatedCommBgImage)
        multipartFormData.append("passkey", passkey)


        async function NetworkCall() {

            try {

                const result = await fetch("http://localhost:8001/createcommunity", {

                    method: "POST",
                    credentials: "include",
                    body: multipartFormData

                })

                const msg = await result.json()
                console.log(msg);


                if (result.status === 401 && msg.message === "Session Expired Please login again" && msg.success === false) {

                    navigate("/login")
                    return toast.error("Session Expired Please login again", { duration: 1500 })

                }

                // toast.success("Community Created Sucessfully" , {duration : 1200})

                if (msg.message === "Community name should be at least of 5 characters or more" && msg.success === false && result.status === 400) {

                    toast.error("Community name should be at least of 5 characters or more", { duration: 2500 })
                    reset();


                }

                if (msg.message === "Community Name cannot not include numbers and special characters" && msg.success === false && result.status === 400) {

                    toast.error("Community Name cannot not include numbers and special characters", { duration: 2500 })
                    reset();


                }

                if (msg.message === "Passkey length should at least be of 5 characters or more" && msg.success === false && result.status === 400) {

                    toast.error("Passkey length should at least be of 5 characters or more", { duration: 2500 })
                    reset();


                }

                if (msg.message === "Community Description too Long!" && msg.success === false && result.status === 400) {

                    toast.error("Community Description too Long !", { duration: 1200 })
                    reset();

                }


                 if (msg.message === "Community Created Sucessfully" && msg.success === true && result.status === 200) {

                    toast.success("Community Created Sucessfully !", { duration: 1200 })
                    reset();
                  return  navigate("/homepage")

                }


            }

            catch (error) {

                console.log(error);
                toast.error(error.message, { duration: 1000 })

            }

        }

        NetworkCall();


        //   return  navigate("/homepage")

    }

    return <div className="">

        <h1 className="main-heading">Create Your Own Community</h1>

        <form onSubmit={handleSubmit(AfterCreate)} className="community-form">
            <h2> What Will You Name Your Community ?</h2>
            <input style={{ height: "40px", width: "20%" }} type="text" placeholder="Community Name" required {...register("community_name")} />
            <h2> What About Passkeys ? </h2>
            <input style={{ height: "40px", width: "12%" }} type="password" placeholder="Community Passkey" required {...register("pass_key")} />
            <h2> How would You Describe Your Community In 250 Words ?</h2>
            <textarea style={{ height: "120px", width: "50%", textAlign: "center", alignContent: "center" }} placeholder="Community Description" required {...register("desc")}></textarea>
            <h2>What's the Type of Community You're Building ?</h2>
            <select required {...register("type")}>

                <option value="" hidden>Select Type</option>
                <option>Fitness And Health</option>
                <option>EntertainMent </option>
                <option>Yoga And Health</option>
                <option>Anime</option>
                <option>Movies</option>
                <option>Coding</option>
                <option>Engineering</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>Computer Science</option>
                <option>Mathematics</option>
                <option>Astronomy</option>
                <option>Music Intruments</option>
                <option>Musics And Beats</option>
                <option>Weather And Environment</option>
                <option>Politics</option>
                <option>Media And News</option>
                <option>Plants And Gardening</option>
                <option>Combat Sports</option>
                <option>General Sports</option>
                <option>Gaming</option>
                <option>Board Games</option>
                <option>Books Discussion</option>
                <option>Others</option>

            </select>
            <h2> Upload Background Image for Giving Your Community A Identity </h2>
            <input type="file" accept=".jpeg,.jpg,.png,.svg" required {...register("bgimage")} />
            <br /><br /><br /><br />
            <button type="submit" className="create-comm-btn">Create Community</button>
        </form>



    </div>

}

export default CreateCommunity;