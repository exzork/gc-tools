import React from "react";

export default function Header(props:{name:string}){
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="text-xl md:text-3xl font-bold text-gray-900">{props.name}</div>
            </div>
        </header>
    );
}