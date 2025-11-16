"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function NavbarV2(
    {
        as: _Component = _Builtin.NavbarWrapper
    }
) {
    return (
        <_Component
            className="nav_component"
            tag="div"
            config={{
                easing: "ease",
                easing2: "ease",
                duration: 400,
                docHeight: false,
                noScroll: false,
                animation: "default",
                collapse: "medium"
            }}><_Builtin.Block className="padding-spacing" tag="div"><_Builtin.Block className="container-custom" tag="div"><_Builtin.Block className="nav-layout" tag="div"><_Builtin.NavbarBrand
                            className="nav_brand"
                            options={{
                                href: "#"
                            }}><_Builtin.Image
                                className="nav_logo"
                                width="auto"
                                height="auto"
                                loading="lazy"
                                alt=""
                                src="https://cdn.prod.website-files.com/662c296bd4d3a8028c713c69/6912c9ce712f07aa84bd6840_388100ca628cba5a9cfca98b373d18f6-removebg-preview.png" /></_Builtin.NavbarBrand><_Builtin.NavbarMenu className="nav_menu" tag="nav" role="navigation"><_Builtin.NavbarLink
                                className="nav_menu_link"
                                options={{
                                    href: "#"
                                }}>{"Home"}</_Builtin.NavbarLink><_Builtin.NavbarLink
                                className="nav_menu_link"
                                options={{
                                    href: "#"
                                }}>{"Shop"}</_Builtin.NavbarLink><_Builtin.NavbarLink
                                className="nav_menu_link"
                                options={{
                                    href: "#"
                                }}>{"About us"}</_Builtin.NavbarLink><_Builtin.NavbarLink
                                className="nav_menu_link"
                                options={{
                                    href: "#"
                                }}>{"Blogs"}</_Builtin.NavbarLink></_Builtin.NavbarMenu><_Builtin.Block className="nav-right" tag="div"><_Builtin.NavbarButton className="nav_button" tag="div"><_Builtin.Icon
                                    className=" icon-2"
                                    widget={{
                                        type: "icon",
                                        icon: "nav-menu"
                                    }} /></_Builtin.NavbarButton></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Component>
    );
}