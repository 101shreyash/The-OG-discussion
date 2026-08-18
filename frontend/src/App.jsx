import Getstarted from "./components/getstarted";
import Homepage from "./components/homepage";
import Login from "./components/login";
import Signup from "./components/signup";
import CreateCommunity from "./components/create_community";
import "./index.css"
import { Route , Routes } from "react-router-dom";
import ExploreCommunity from "./components/explore_community";

function App() {


  return <div>

  <Routes>

 <Route path="/"  element = {<Getstarted/>}/>
 <Route path="/signup"  element = {<Signup/>}/>
 <Route path="/login"  element = {<Login/>}/>
 <Route path="/homepage"  element = {<Homepage/>}/>
 <Route path="/createcommunity"  element = {<CreateCommunity/>}/>
 <Route path="/explorecommunity"  element = {<ExploreCommunity/>}/>
 <Route path="*"  element = {<h1 style={{color : "grey"}}>404 Page Not Found</h1>}/>

 

  </Routes>
    
  </div>


}

export default App;