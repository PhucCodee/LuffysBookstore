import React from "react";
import NavBar from "../components/NavBar";
import HomeMain from "../components/HomeMain";

const HomePage = () => {
    return (
        <div className="home-page">
            <NavBar />
            <HomeMain />
        </div>
    );
};

export default HomePage;