import { useForm } from "react-hook-form"
import { Link } from "react-router-dom";

function ExploreCommunity() {



  let {register : registerselect , handleSubmit : handleselect } = useForm();
  let {register : registersearch , handleSubmit : handlesearch } = useForm();

    function AfterSelect(data) {

        console.log(data);

    }

    function AfterSearch(data) {

        console.log(data);
    }

   

    return <div style={{ marginTop: "5%" }}>

        <Link to="/homepage" className="common-links">HomePage</Link>

        <h3 className="sub-heading">Filter Communities Based On Your Prefrence </h3>

        {/* Select Form */}
        <form onSubmit={handleselect(AfterSelect)}>

            <select required style={{ height: "40px", width: "10%", textAlign: 'center' }} {...registerselect("communitytype")}>
                <option value="" hidden>Select Your Prefrence</option>
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

            </select>
            &nbsp;&nbsp;
            <button className="click-btn">Filter</button>
        </form>
        {/* Search Form */}
        <form onSubmit={handlesearch(AfterSearch)}>
            <h3 className="sub-heading">Or Seach a Specific Community Name</h3>
            <input style={{ height: "40px", width: "20%", textAlign: 'center' }} type="search" placeholder="Search Community Name" required  {...registersearch("communityname")}/> &nbsp;
            <button className="click-btn" type="submit">Search</button>
        </form>

    </div>

}

export default ExploreCommunity;