import {Routes, Route, RouteProps} from "react-router-dom";
import React from "react";
import Artifacts from "./pages/Artifacts";
import GCAuth from "./pages/GCAuth";

interface RouteMenuProps extends RouteProps{
    handleHeaderTitleChange: (title: string) => void;
}
export default function RouteMenu(props: RouteMenuProps) {
    const defaultProps = {
        handleHeaderTitleChange: props.handleHeaderTitleChange
    };
    return (
        <Routes>
            <Route path="/" element={
                <div>Nothing Here</div>
            }/>
            <Route path="/artifact" element={
                <Artifacts/>
            }/>
            <Route path="/gcauth" element={
                <GCAuth/>
            }/>
        </Routes>
    );
}