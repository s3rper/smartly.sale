"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function GlobalStyles(
    {
        as: _Component = _Builtin.HtmlEmbed
    }
) {
    return (
        <_Component
            className="global-styles"
            value="%3Cstyle%3E%0Abody%20%7B%0A%20font-size%3A%201.1111111111111112vw%3B%0A%7D%0A%2F*%20Max%20Font%20Size%20*%2F%0A%40media%20screen%20and%20(min-width%3A1440px)%20%7B%0A%20body%20%7Bfont-size%3A%201rem%3B%7D%0A%7D%0A%0A%2F*%20Min%20Font%20Size%20*%2F%0A%40media%20screen%20and%20(max-width%3A991px)%20%7B%0A%20body%20%7Bfont-size%3A%201rem%3B%7D%0A%7D%0A%0A%2F*%20Snippet%20gets%20rid%20of%20top%20margin%20on%20first%20element%20in%20any%20rich%20text*%2F%0A.w-richtext%3E%3Afirst-child%20%7B%0A%09margin-top%3A%200%3B%0A%7D%0A%0A%2F*%20Snippet%20gets%20rid%20of%20bottom%20margin%20on%20last%20element%20in%20any%20rich%20text*%2F%0A.w-richtext%3E%3Alast-child%2C%20.w-richtext%20ol%20li%3Alast-child%2C%20.w-richtext%20ul%20li%3Alast-child%20%7B%0A%09margin-bottom%3A%200%3B%0A%7D%0A%0A%2F*%20Snippet%20prevents%20all%20click%20and%20hover%20interaction%20with%20an%20element%20*%2F%0A.clickable-off%20%7B%0A%09pointer-events%3A%20none%3B%0A%7D%0A%0A%2F*%20Snippet%20enables%20all%20click%20and%20hover%20interaction%20with%20an%20element%20*%2F%0A.clickable-on%7B%0A%20%20pointer-events%3A%20auto%3B%0A%7D%0A%0A%2F*%20Snippet%20enables%20you%20to%20add%20class%20of%20div-square%20which%20creates%20and%20maintains%20a%201%3A1%20dimension%20of%20a%20div.*%2F%0A.div-square%3A%3Aafter%20%7B%0A%09content%3A%20%22%22%3B%0A%09display%3A%20block%3B%0A%09padding-bottom%3A%20100%25%3B%0A%7D%0A%0A%2F*Hide%20focus%20outline%20for%20main%20content%20element*%2F%0Amain%3Afocus-visible%20%7B%0A%09outline%3A%20-webkit-focus-ring-color%20auto%200px%3B%0A%7D%0A%0A%2F*%20Make%20sure%20containers%20never%20lose%20their%20center%20alignment*%2F%0A.container-medium%2C%20.container-small%2C%20.container-large%20%7B%0A%09margin-right%3A%20auto%20!important%3B%0A%09margin-left%3A%20auto%20!important%3B%0A%7D%0A%0A%2F*Reset%20buttons%2C%20and%20links%20styles*%2F%0Aa%20%7B%0A%09color%3A%20inherit%3B%0A%09text-decoration%3A%20inherit%3B%0A%09font-size%3A%20inherit%3B%0A%7D%0A%0A%2F*Apply%20%22...%22%20after%203%20lines%20of%20text%20*%2F%0A.text-style-3lines%20%7B%0A%09display%3A%20-webkit-box%3B%0A%09overflow%3A%20hidden%3B%0A%09-webkit-line-clamp%3A%203%3B%0A%09-webkit-box-orient%3A%20vertical%3B%0A%7D%0A%0A%2F*Apply%20%22...%22%20after%202%20lines%20of%20text%20*%2F%0A.text-style-2lines%20%7B%0A%09display%3A%20-webkit-box%3B%0A%09overflow%3A%20hidden%3B%0A%09-webkit-line-clamp%3A%202%3B%0A%09-webkit-box-orient%3A%20vertical%3B%0A%7D%0A%0A%3C%2Fstyle%3E" />
    );
}