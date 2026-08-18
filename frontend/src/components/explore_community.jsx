function ExploreCommunity() {


    return <div style={{marginTop : "5%"}}>


   <h3 className="sub-heading">Filter Communities Based On Your Prefrence </h3>
   <h3 className="sub-heading">Or Seach a Specific Community</h3>
        <form>

            <select required>

                <option value="" hidden>Select Type</option>
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

            &nbsp;
            <button>Filter</button>
        </form>

    </div>

}

export default ExploreCommunity;