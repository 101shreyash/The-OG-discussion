import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useState } from "react";





function Post() {

    let [allposts, setallposts] = useState([])


    const state = useLocation().state
    const communityName = state.communityname
    const communityid = state.communityid

    let { register, handleSubmit, reset } = useForm();

    async function CommunityPosts() {

        try {

           const result =  await fetch(`http://localhost:8001/viewcommunityposts/${communityid}` , {

            method : "GET",
            headers : ({
                'Content-type' : 'application/json'
            }),
            credentials : "include"


           })

           const msg = await result.json()
           const posts = msg.message
           setallposts(posts)
           
            
        } 
        
        catch (error) {

            console.log(error.message);
           return toast.error(error.message)     
            
        }
        
    }

    useEffect(() => {

        CommunityPosts();


    } , [])


    function AfterPost(data) {

        const userpost = data.post

        async function NetworkCall() {

            try {

                const result = await fetch("http://localhost:8001/userposts", {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({ communityid: communityid, postcontent: userpost }),
                    headers: ({
                        'Content-type': 'application/json'
                    })

                })

                const msg = await result.json()

                if (msg.message === "Posted sucessfully" && msg.success === true && result.status === 200) {

                    toast.success("Your post was sent sucessfully", { position: "bottom-center", duration: 2000 })
                    CommunityPosts();
                    return reset();


                }


            }

            catch (error) {

                console.log(error);
                toast.error(error.message)

            }

        }

        NetworkCall();



    }


    return <div style={{ marginTop: "4%" }}>

        <h1 className="sub-head" >{`${communityName} Posts`}</h1>


        <form onSubmit={handleSubmit(AfterPost)}>

            <input style={{ height: "80px", width: "76%", paddingLeft: "20px", alignContent: "center" }} placeholder="Say something for the community" required {...register("post")}></input> &nbsp; &nbsp;
            <button>Post</button>

            {allposts?.map((posts) => {

                console.log(posts);
                const orgDate = posts?.posted_at
                const dateSubString = orgDate?.substr(0,10)                
                
                
                return <>

                    {posts?.username? <p className="post-username"> - {posts.username} </p> : ""}
                    {posts?.post_content? <p className="sub-head"> {posts.post_content} - {dateSubString}</p> : ""}
                
                </>



                
            })}

        </form>



    </div>

}


export default Post;