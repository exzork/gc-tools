import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Main from "./components/Main";
import {BrowserRouter} from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import "./i18n";

interface IState{
    headerTitle: string;
}

export default class App extends Component<{},IState>{
    constructor(props:{}) {
        super(props);
        this.state = {
            headerTitle: 'Hello World',
        }
    }

    handleHeaderTitleChange = (headerTitle:string) =>{
        this.setState({
            headerTitle: headerTitle
        })
        document.title = headerTitle;
    }

    render() {
        const NavbarProps = {
            headerTitle: this.state.headerTitle,
            handleHeaderTitleChange: this.handleHeaderTitleChange
        }
        const HeaderProps = {
            name: this.state.headerTitle,
        }
        const MainProps = {
            handleHeaderTitleChange: this.handleHeaderTitleChange
        }

        return(
            <BrowserRouter>
                <Navbar {...NavbarProps}/>
                <Header {...HeaderProps}/>
                <Main {...MainProps}/>
            </BrowserRouter>
        )
    }
}
