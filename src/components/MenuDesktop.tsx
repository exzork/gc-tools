import React from "react";
import {useLocation, Link, useNavigate} from "react-router-dom"
export default function MenuDesktop(props:{handleHeaderTitleChange: (title:string) => void}) {
    const location = useLocation();
    const navigate = useNavigate();
    const {handleHeaderTitleChange} = props;


    /*
    {location.pathname === "/" ? (
                <Link to="/" className="menu-item bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            ) : (
                <Link to="/" onClick={() => handleHeaderTitleChange("Home")} className="menu-item text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            )}
     */
    return (
        <>
            {location.pathname === "/artifact" ? (
                <Link to="/artifact" className="menu-item bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Artifact</Link>
            ) : (
                <Link to="/artifact" onClick={() => handleHeaderTitleChange("Artifact Command Generator")} className="menu-item text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Artifact</Link>
            )}
        </>
    )
}