
import {Link} from "react-router-dom"

function Getstarted() {


    return <div className="get-started-margin">
    
    <h1 className="main-heading">WELCOME TO OG DISCUSSIONS</h1>
    <p className="sub-head"> Where You can create your own communities and explore communities of your intrest .</p>
    <Link  to="/signup" className="get-started-btn">Get Started</Link>
    
    </div>
    
}

export default Getstarted;