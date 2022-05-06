import React from "react";
import {useLocation, Link} from "react-router-dom";

export default function MenuMobile(props: any) {
    const location = useLocation();
    const {handleHeaderTitleChange} = props;

    /*
    {location.pathname === "/" ? (
                <Link to="/" className="menu-item block bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            ) : (
                <Link to="/" onClick={() => handleHeaderTitleChange("Home")} className="menu-item block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            )}
     */
    return (
        <>

            {location.pathname === "/artifact" ? (
                <Link to="/artifact" className="menu-item block bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Artifact</Link>
            ) : (
                <Link to="/artifact" onClick={() => handleHeaderTitleChange("Artifact Command Generator")} className="menu-item block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Artifact</Link>
            )}

            {location.pathname === "/gcauth" ? (
                <Link to="/gcauth" className="menu-item block bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">GCAuth</Link>
            ) : (
                <Link to="/gcauth" onClick={() => handleHeaderTitleChange("GCAuth Token Generator")} className="menu-item block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">GCAuth</Link>
            )}
        </>
    )
}