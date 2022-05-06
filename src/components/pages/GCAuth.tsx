import {useEffect, useState} from "react";
import {Autocomplete, TextField} from "@mui/material";

interface IGCAuthResponse{
    status: string;
    message: string;
    jwt: string;
}

interface IJWTPayload{
    token: string;
    username: string;
    uid: string;
}

interface IGCAuthLogin{
    username: string;
    password: string;
}

interface IGCAuthRegister{
    username: string;
    password: string;
    password_confirmation: string;
}

interface IGCAuthChangePassword{
    username: string;
    new_password: string;
    new_password_confirmation: string;
    old_password: string;
}

export default function GCAuth() {
    const [jwt, setJwt] = useState("");
    const [dispatchServer, setDispatchServer] = useState("");
    const [useSSl, setUseSSl] = useState(true);
    const [baseUrl, setBaseUrl] = useState("");

    const checkGCAuth = async ()=>{
        fetch(baseUrl+"/authentication/type")
            .then(res => res.text())
            .then(res => {
                if (res === "me.exzork.gcauth.handler.GCAuthAuthenticationHandler"){
                    console.log("GCAuth is installed");
                }else{
                    console.log("GCAuth is not installed");
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        setBaseUrl(`http${useSSl ? "s" : ""}://${dispatchServer}`);
    }, [useSSl, dispatchServer]);
    return (
        <>
            <div className="space-y-8 divide-y divide-gray-200 bg-white p-10">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div className="flex" id="dispatch-server">
                        <input type="text" onChange={(e)=>setDispatchServer(e.currentTarget.value)} placeholder="Input server ip/domain with port, ex : genshin.exzork.me:443" className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/>
                        <div className="flex mx-2">
                            <input type="checkbox" onChange={(e)=>setUseSSl(e.currentTarget.checked)} id="with-ssl" className="form-checkbox m-auto text-indigo-600 transition duration-150 ease-in-out"/>
                            <label htmlFor="with-ssl" className="ml-2 my-auto block text-sm leading-5 text-gray-700">SSL</label>
                        </div>
                        <button onClick={checkGCAuth} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md">Check</button>
                    </div>
                </div>
            </div>
        </>
    )
}