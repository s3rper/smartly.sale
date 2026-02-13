import * as React from "react";
import * as Types from "./types";

declare function Footer(
    props: {
        as?: React.ElementType;
        pagePadding4Visibility?: Types.Visibility.VisibilityConditions;
    }
): React.JSX.Element