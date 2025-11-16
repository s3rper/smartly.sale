"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function GlobalFooter(
    {
        as: _Component = _Builtin.Block
    }
) {
    return (
        <_Component className="global-footer" tag="div"><_Builtin.Link
                className="footer-link"
                button={false}
                block=""
                options={{
                    href: "#"
                }}>{"www.sample.com"}</_Builtin.Link><_Builtin.Block className="text-size-18 text-color-white" tag="div">{"Version 1.0"}</_Builtin.Block></_Component>
    );
}