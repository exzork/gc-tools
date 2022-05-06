import {FormEvent, useEffect, useState} from "react";
import Swal from "sweetalert2";

interface IGCAuthResponse {
    status: string;
    message: string;
    jwt: string;
}

interface IJWTPayload {
    token: string;
    username: string;
    uid: string;
}

interface IGCAuthLogin {
    username: string;
    password: string;
}

interface IGCAuthRegister {
    username: string;
    password: string;
    password_confirmation: string;
}

interface IGCAuthChangePassword {
    username: string;
    new_password: string;
    new_password_confirmation: string;
    old_password: string;
}

export default function GCAuth() {
    const [jwt, setJwt] = useState("");
    const [dispatchServer, setDispatchServer] = useState(localStorage.getItem("dispatchServer") ?? "");
    const [useSSl, setUseSSl] = useState(localStorage.getItem("useSSl")==="true" ?? true);
    const [baseUrl, setBaseUrl] = useState("");

    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [token, setToken] = useState("");

    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerPasswordConfirmation, setRegisterPasswordConfirmation] = useState("");

    const [changePasswordUsername, setChangePasswordUsername] = useState("");
    const [changePasswordNewPassword, setChangePasswordNewPassword] = useState("");
    const [changePasswordNewPasswordConfirmation, setChangePasswordNewPasswordConfirmation] = useState("");
    const [changePasswordOldPassword, setChangePasswordOldPassword] = useState("");

    const checkGCAuth = async () => {
        fetch(baseUrl + "/authentication/type")
            .then(res => res.text())
            .then(res => {
                if (res === "me.exzork.gcauth.handler.GCAuthAuthenticationHandler") {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        title: "GCAuth is installed",
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        title: "GCAuth is not installed",
                        icon: "error"
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        setBaseUrl(`http${useSSl ? "s" : ""}://${dispatchServer}`);
        localStorage.setItem("dispatchServer", dispatchServer);
        localStorage.setItem("useSSl", useSSl.toString());
    }, [useSSl, dispatchServer]);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        const data: IGCAuthLogin = {
            username: loginUsername,
            password: loginPassword
        }
        fetch(baseUrl + "/authentication/login", {method: "POST", body: JSON.stringify(data)})
            .then(async (res) => {
                const resText = await res.text();
                try {
                    let resJson = JSON.parse(resText);
                    if (resJson.success) {
                        await Swal.fire({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            title: "Login success",
                            icon: "success"
                        });
                        setJwt(resJson.jwt);
                        const splitToken = resJson.jwt.split(".");
                        const payload = JSON.parse(atob(splitToken[1]));
                        setToken(payload.token);
                    } else {
                        await Swal.fire({
                            title: "Login failed",
                            text: resJson.message ?? resJson,
                            icon: "error"
                        });
                    }
                } catch (e) {
                    await Swal.fire({
                        title: "Login failed",
                        text: resText,
                        icon: "error"
                    });
                }
            }).catch((err) => {
            console.log(err);
            Swal.fire({
                title: "Login failed",
                text: err,
                icon: "error"
            });
        });
    }

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        const data: IGCAuthRegister = {
            username: registerUsername,
            password: registerPassword,
            password_confirmation: registerPasswordConfirmation
        }
        fetch(baseUrl + "/authentication/register", {method: "POST", body: JSON.stringify(data)})
            .then(async (res) => {
                const resText = await res.text();
                try {
                    let resJson = JSON.parse(resText);
                    if (resJson.success) {
                        await Swal.fire({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            title: "Register success",
                            icon: "success"
                        });
                        setJwt(resJson.jwt);
                    } else {
                        await Swal.fire({
                            title: "Register failed",
                            text: resJson.message ?? resJson,
                            icon: "error"
                        });
                    }
                } catch (e) {
                    await Swal.fire({
                        title: "Register failed",
                        text: resText,
                        icon: "error"
                    });
                }
            }).catch((err) => {
            console.log(err);
            Swal.fire({
                title: "Register failed",
                text: err,
                icon: "error"
            });
        });
    }

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        const data: IGCAuthChangePassword = {
            username: changePasswordUsername,
            new_password: changePasswordNewPassword,
            new_password_confirmation: changePasswordNewPasswordConfirmation,
            old_password: changePasswordOldPassword
        }

        fetch(baseUrl + "/authentication/change_password", {method: "POST", body: JSON.stringify(data)})
            .then(async (res) => {
                const resText = await res.text();
                try {
                    let resJson = JSON.parse(resText);
                    if (resJson.success) {
                        await Swal.fire({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
                            timerProgressBar: true,
                            title: "Change password success",
                            icon: "success"
                        });
                    } else {
                        await Swal.fire({
                            title: "Change password failed",
                            text: resJson.message ?? resJson,
                            icon: "error"
                        });
                    }
                } catch (e) {
                    await Swal.fire({
                        title: "Change password failed",
                        text: resText,
                        icon: "error"
                    });
                }
            }).catch((err) => {
            console.log(err);
            Swal.fire({
                title: "Change password failed",
                text: err,
                icon: "error"
            });
        });
    }

    const handleCopyToken = (e:FormEvent) => {
        e.preventDefault();
        if (token!==""){
            navigator.clipboard.writeText(token);
            Swal.fire({toast: true, position: "top-end", showConfirmButton: false, timer: 3000, timerProgressBar: true, title: "Token copied", icon: "success"});
        }else{
            Swal.fire({title: "No token", text: "You need to login first", icon: "error"});
        }
    }

    return (
        <>
            <div className="space-y-8 divide-y divide-gray-200 bg-white p-10">
                <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                    <div className="flex" id="dispatch-server">
                        <input type="text" defaultValue={dispatchServer} onChange={(e) => setDispatchServer(e.currentTarget.value)}
                               placeholder="Input server ip/domain with port if needed"
                               className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/>
                        <div className="flex mx-2">
                            <input type="checkbox" checked={useSSl} onChange={(e) => setUseSSl(e.currentTarget.checked)} id="with-ssl"
                                   className="form-checkbox m-auto text-indigo-600 transition duration-150 ease-in-out"/>
                            <label htmlFor="with-ssl"
                                   className="ml-2 my-auto block text-sm leading-5 text-gray-700">SSL</label>
                        </div>
                        <button onClick={checkGCAuth}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md">Check
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <form className="mt-3 h-full flex flex-col" onSubmit={handleLogin}>
                                <h3 className="text-lg font-medium text-gray-900 text-center">Login</h3>
                                <input type="text" placeholder="Username"
                                       onChange={(e) => setLoginUsername(e.currentTarget.value)}
                                       className="mt-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/>
                                <input type="password" placeholder="Password"
                                       onChange={(e) => setLoginPassword(e.currentTarget.value)}
                                       className="mt-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/>
                                <button
                                    className="mt-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md w-full">Login
                                </button>
                                <button onClick={handleCopyToken} className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md w-full">Copy Token
                                </button>
                            </form>
                        </div>
                        <div className="col-span-1">
                            <form className="mt-3 h-full flex flex-col" onSubmit={handleRegister}>
                                <h3 className="text-lg font-medium text-gray-900 text-center">Register</h3>
                                <input type="text" placeholder="Username"
                                       onChange={(e) => setRegisterUsername(e.currentTarget.value)}
                                       className="mt-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/>
                                <input type="password" placeholder="Password"
                                       onChange={(e) => setRegisterPassword(e.currentTarget.value)}
                                       className="mt-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/>
                                <input type="password" placeholder="Confirm Password"
                                       onChange={(e) => setRegisterPasswordConfirmation(e.currentTarget.value)}
                                       className="mt-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/>
                                <button
                                    className="mt-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md w-full">Register
                                </button>
                            </form>
                        </div>
                        <div className="col-span-1">
                            <form className="mt-3 h-full flex flex-col" onSubmit={handleChangePassword}>
                                <h3 className="text-lg font-medium text-gray-900 text-center">Change Password</h3>
                                <input type="text" placeholder="Username"
                                       onChange={(e) => setChangePasswordUsername(e.currentTarget.value)}
                                       className="mt-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/>
                                <input type="password" placeholder="Password"
                                       onChange={(e) => setChangePasswordNewPassword(e.currentTarget.value)}
                                       className="mt-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/>
                                <input type="password" placeholder="Confirm Password"
                                       onChange={(e) => setChangePasswordNewPasswordConfirmation(e.currentTarget.value)}
                                       className="mt-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/>
                                <input type="password" placeholder="Old Password"
                                       onChange={(e) => setChangePasswordOldPassword(e.currentTarget.value)}
                                       className="mt-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"/>
                                <button
                                    className="mt-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md w-full">Change
                                    Password
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}