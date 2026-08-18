import {Link} from "react-router-dom"


function Homepage() {

    return <div className="homepage-margin">

    <Link to="/createcommunity" className="common-links">Create Community</Link>
    <Link to="/explorecommunity" className="common-links">Explore Communities</Link>
    <Link className="common-links">Profile</Link>
    <button className="common-links">Logout</button>
    

    <h1 className="main-heading" style={{textDecoration : "underline plum" , textUnderlineOffset : "20px"}}>Your Communuties</h1>

    <Link className="comm-links">CommunityStoic</Link>
    <Link className="comm-links">CommunityObama</Link>
    <Link className="comm-links">CommunityLuther</Link>
    <Link className="comm-links">MiachealJacksonCommunity</Link>
    
    
    </div>
    
}

export default Homepage;