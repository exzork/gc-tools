import React from "react";
import RouteMenu from "./RouteMenu";
import {RouteProps} from "react-router-dom";

interface Props extends RouteProps{
    handleHeaderTitleChange: (title: string) => void;
}
export default function Main(props: Props) {
    const RouteMenuProps = {
        handleHeaderTitleChange: props.handleHeaderTitleChange
    };
    return (
        <main className="bg-gray-100 min-h-full">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ">
                <RouteMenu {...RouteMenuProps}/>
            </div>
        </main>
    );
}