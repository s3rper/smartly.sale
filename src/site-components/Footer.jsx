"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";

const _interactionsData = JSON.parse(
    '{"events":{"e-190":{"id":"e-190","name":"","animationType":"preset","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-59","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-191"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c6a|d57c8366-83b0-7db6-4e7b-777cb84bd89b","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c6a|d57c8366-83b0-7db6-4e7b-777cb84bd89b","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713237800352},"e-191":{"id":"e-191","name":"","animationType":"preset","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-60","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-190"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c6a|d57c8366-83b0-7db6-4e7b-777cb84bd89b","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c6a|d57c8366-83b0-7db6-4e7b-777cb84bd89b","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713237800352},"e-196":{"id":"e-196","name":"","animationType":"preset","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-59","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-197"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c6a|f235d4a3-b27e-eb02-4339-cdbbf81c4dd3","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c6a|f235d4a3-b27e-eb02-4339-cdbbf81c4dd3","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713252233143},"e-197":{"id":"e-197","name":"","animationType":"preset","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-60","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-196"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c6a|f235d4a3-b27e-eb02-4339-cdbbf81c4dd3","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c6a|f235d4a3-b27e-eb02-4339-cdbbf81c4dd3","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713252233143},"e-198":{"id":"e-198","name":"","animationType":"preset","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-59","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-199"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c6a|cecbf00f-b2db-c4e2-a194-111d31da28df","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c6a|cecbf00f-b2db-c4e2-a194-111d31da28df","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713252356069},"e-199":{"id":"e-199","name":"","animationType":"preset","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-60","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-198"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c6a|cecbf00f-b2db-c4e2-a194-111d31da28df","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c6a|cecbf00f-b2db-c4e2-a194-111d31da28df","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713252356069},"e-316":{"id":"e-316","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-63","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-317"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c75|37b18527-b81b-c0ae-4c3b-ad766acfffee","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c75|37b18527-b81b-c0ae-4c3b-ad766acfffee","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713365360261},"e-317":{"id":"e-317","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-64","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-316"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c75|37b18527-b81b-c0ae-4c3b-ad766acfffee","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c75|37b18527-b81b-c0ae-4c3b-ad766acfffee","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713365360262},"e-318":{"id":"e-318","name":"","animationType":"preset","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-63","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-319"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c75|3de0ca24-ee85-cf74-db81-ea9824d64efd","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c75|3de0ca24-ee85-cf74-db81-ea9824d64efd","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713365523639},"e-319":{"id":"e-319","name":"","animationType":"preset","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-64","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-318"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c75|3de0ca24-ee85-cf74-db81-ea9824d64efd","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c75|3de0ca24-ee85-cf74-db81-ea9824d64efd","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713365523639},"e-320":{"id":"e-320","name":"","animationType":"preset","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-63","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-321"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c75|cc083a55-5c93-32a6-ff5e-53c0b2a332a9","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c75|cc083a55-5c93-32a6-ff5e-53c0b2a332a9","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713365690362},"e-321":{"id":"e-321","name":"","animationType":"preset","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-64","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-320"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"662c296bd4d3a8028c713c75|cc083a55-5c93-32a6-ff5e-53c0b2a332a9","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"662c296bd4d3a8028c713c75|cc083a55-5c93-32a6-ff5e-53c0b2a332a9","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1713365690362}},"actionLists":{"a-59":{"id":"a-59","title":"Process Hover In","actionItemGroups":[{"actionItems":[{"id":"a-59-n","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".services-bg-filter","selectorGuids":["c479a0d6-9921-45f2-122a-24119030e8e0"]},"widthValue":100,"heightValue":0,"widthUnit":"%","heightUnit":"px","locked":false}},{"id":"a-59-n-9","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".process-link","selectorGuids":["1f2f514d-2a53-4ec9-d633-480b72449ce1"]},"globalSwatchId":"--blue","rValue":28,"bValue":170,"gValue":104,"aValue":1}},{"id":"a-59-n-7","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".our-services-img-wrapper","selectorGuids":["4a7a6685-3545-d962-6d5b-d87ec664555e"]},"globalSwatchId":"--blue","rValue":28,"bValue":170,"gValue":104,"aValue":1}},{"id":"a-59-n-5","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".flex-v-wrapper","selectorGuids":["105f6ded-ff43-8cb0-b27d-29e873fec9ac"]},"globalSwatchId":"--default-dark","rValue":0,"bValue":0,"gValue":0,"aValue":1}},{"id":"a-59-n-3","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".card-img-wrapper","selectorGuids":["5947ea15-bda4-1c68-4821-d9bd9c145383"]},"value":0,"unit":""}}]},{"actionItems":[{"id":"a-59-n-10","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".process-link","selectorGuids":["1f2f514d-2a53-4ec9-d633-480b72449ce1"]},"globalSwatchId":"--white","rValue":255,"bValue":255,"gValue":255,"aValue":1}},{"id":"a-59-n-8","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"ease","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".our-services-img-wrapper","selectorGuids":["4a7a6685-3545-d962-6d5b-d87ec664555e"]},"globalSwatchId":"--white","rValue":255,"bValue":255,"gValue":255,"aValue":1}},{"id":"a-59-n-6","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"ease","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".flex-v-wrapper","selectorGuids":["105f6ded-ff43-8cb0-b27d-29e873fec9ac"]},"globalSwatchId":"--white","rValue":255,"bValue":255,"gValue":255,"aValue":1}},{"id":"a-59-n-4","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"ease","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".card-img-wrapper","selectorGuids":["5947ea15-bda4-1c68-4821-d9bd9c145383"]},"value":1,"unit":""}},{"id":"a-59-n-2","actionTypeId":"STYLE_SIZE","config":{"delay":200,"easing":"ease","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".services-bg-filter","selectorGuids":["c479a0d6-9921-45f2-122a-24119030e8e0"]},"widthValue":100,"heightValue":100,"widthUnit":"%","heightUnit":"%","locked":false}}]}],"useFirstGroupAsInitialState":true,"createdOn":1713237354585},"a-60":{"id":"a-60","title":"Process Hover Out","actionItemGroups":[{"actionItems":[{"id":"a-60-n-6","actionTypeId":"STYLE_SIZE","config":{"delay":0,"easing":"ease","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".services-bg-filter","selectorGuids":["c479a0d6-9921-45f2-122a-24119030e8e0"]},"widthValue":100,"heightValue":0,"widthUnit":"%","heightUnit":"%","locked":false}},{"id":"a-60-n-7","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".process-link","selectorGuids":["1f2f514d-2a53-4ec9-d633-480b72449ce1"]},"globalSwatchId":"--blue","rValue":28,"bValue":170,"gValue":104,"aValue":1}},{"id":"a-60-n-8","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"ease","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".our-services-img-wrapper","selectorGuids":["4a7a6685-3545-d962-6d5b-d87ec664555e"]},"globalSwatchId":"--blue","rValue":28,"bValue":170,"gValue":104,"aValue":1}},{"id":"a-60-n-9","actionTypeId":"STYLE_TEXT_COLOR","config":{"delay":0,"easing":"ease","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".flex-v-wrapper","selectorGuids":["105f6ded-ff43-8cb0-b27d-29e873fec9ac"]},"globalSwatchId":"--default-dark","rValue":0,"bValue":0,"gValue":0,"aValue":1}},{"id":"a-60-n-10","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"ease","duration":200,"target":{"useEventTarget":"CHILDREN","selector":".card-img-wrapper","selectorGuids":["5947ea15-bda4-1c68-4821-d9bd9c145383"]},"value":0,"unit":""}}]}],"useFirstGroupAsInitialState":false,"createdOn":1713237354585},"a-63":{"id":"a-63","title":"Hover Card In","actionItemGroups":[{"actionItems":[{"id":"a-63-n","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".arrow-icon.send-msg","selectorGuids":["05ca18f0-7253-81c5-654b-3ccb0bb19624","8355f3c5-5d9e-7f0f-682b-c56ce114010b"]},"globalSwatchId":"--blue","rValue":28,"bValue":170,"gValue":104,"aValue":1}}]},{"actionItems":[{"id":"a-63-n-2","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"ease","duration":0,"target":{"useEventTarget":"CHILDREN","selector":".arrow-icon.send-msg","selectorGuids":["05ca18f0-7253-81c5-654b-3ccb0bb19624","8355f3c5-5d9e-7f0f-682b-c56ce114010b"]},"globalSwatchId":"--black","rValue":29,"bValue":29,"gValue":29,"aValue":1}}]}],"useFirstGroupAsInitialState":true,"createdOn":1713363737281},"a-64":{"id":"a-64","title":"Hover Card Out","actionItemGroups":[{"actionItems":[{"id":"a-64-n-2","actionTypeId":"STYLE_BACKGROUND_COLOR","config":{"delay":0,"easing":"ease","duration":0,"target":{"useEventTarget":"CHILDREN","selector":".arrow-icon.send-msg","selectorGuids":["05ca18f0-7253-81c5-654b-3ccb0bb19624","8355f3c5-5d9e-7f0f-682b-c56ce114010b"]},"globalSwatchId":"--blue","rValue":28,"bValue":170,"gValue":104,"aValue":1}}]}],"useFirstGroupAsInitialState":false,"createdOn":1713363737281}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function Footer(
    {
        as: _Component = _Builtin.Section,
        pagePadding4Visibility = true
    }
) {
    _interactions.useInteractions(_interactionsData);

    return (
        <_Component
            className="footer-2"
            grid={{
                type: "section"
            }}
            tag="footer">{pagePadding4Visibility ? <_Builtin.Block className="page-padding-4" tag="div"><_Builtin.Block className="container-large-2" tag="div"><_Builtin.Block className="taking-care-wrapper" tag="div"><_Builtin.Heading className="heading-32-3" tag="h2">{"Taking care of your numbers, so you can focus on your business"}</_Builtin.Heading><_Builtin.Link
                            className="get-in-touch"
                            button={false}
                            aria-label="Get In Touch"
                            block="inline"
                            options={{
                                href: "#"
                            }}><_Builtin.Block tag="div">{"Get In Touch"}</_Builtin.Block><_Builtin.HtmlEmbed
                                className="arrow-icon"
                                value="%3Csvg%20clip-rule%3D%22evenodd%22%20fill-rule%3D%22evenodd%22%20stroke-linejoin%3D%22round%22%20stroke-miterlimit%3D%222%22%20viewbox%3D%220%200%2024%2024%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m14.523%2018.787s4.501-4.505%206.255-6.26c.146-.146.219-.338.219-.53s-.073-.383-.219-.53c-1.753-1.754-6.255-6.258-6.255-6.258-.144-.145-.334-.217-.524-.217-.193%200-.385.074-.532.221-.293.292-.295.766-.004%201.056l4.978%204.978h-14.692c-.414%200-.75.336-.75.75s.336.75.75.75h14.692l-4.979%204.979c-.289.289-.286.762.006%201.054.148.148.341.222.533.222.19%200%20.378-.072.522-.215z%22%20fill-rule%3D%22nonzero%22%20fill%3D%22currentColor%22%2F%3E%3C%2Fsvg%3E" /></_Builtin.Link></_Builtin.Block></_Builtin.Block></_Builtin.Block> : null}<_Builtin.Block className="page-padding-4 bg-color" tag="div"><_Builtin.Block className="container-large-2" tag="div"><_Builtin.Block className="taking-care-wrapper align-top" tag="div"><_Builtin.Link
                            className="get-in-touch margin-left-0"
                            button={false}
                            aria-label="Location"
                            block="inline"
                            options={{
                                href: "#"
                            }}><_Builtin.HtmlEmbed
                                className="arrow-icon contact-info"
                                value="%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M12%2010c-1.104%200-2-.896-2-2s.896-2%202-2%202%20.896%202%202-.896%202-2%202m0-5c-1.657%200-3%201.343-3%203s1.343%203%203%203%203-1.343%203-3-1.343-3-3-3m-7%202.602c0-3.517%203.271-6.602%207-6.602s7%203.085%207%206.602c0%203.455-2.563%207.543-7%2014.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198%200-8%203.403-8%207.602%200%204.198%203.469%209.21%208%2016.398%204.531-7.188%208-12.2%208-16.398%200-4.199-3.801-7.602-8-7.602%22%20fill%3D%22currentColor%22%2F%3E%3C%2Fsvg%3E" /><_Builtin.Block className="flex-v-wrapper align-left max-width-1" tag="div"><_Builtin.Block className="margin-bottom-8" tag="div">{"Location"}</_Builtin.Block><_Builtin.Block className="text-size-20" tag="div">{"140 Iowa Ln STE 201, Cary, NC 27511"}</_Builtin.Block></_Builtin.Block></_Builtin.Link><_Builtin.Link
                            className="get-in-touch margin-left-0"
                            button={false}
                            aria-label="Send Email"
                            block="inline"
                            options={{
                                href: "#"
                            }}><_Builtin.HtmlEmbed
                                className="arrow-icon contact-info"
                                value="%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%3E%3Cpath%20d%3D%22M24%2021h-24v-18h24v18zm-23-16.477v15.477h22v-15.477l-10.999%2010-11.001-10zm21.089-.523h-20.176l10.088%209.171%2010.088-9.171z%22%20fill%3D%22currentColor%22%2F%3E%3C%2Fsvg%3E" /><_Builtin.Block className="flex-v-wrapper align-left" tag="div"><_Builtin.Block className="margin-bottom-8" tag="div">{"Send email"}</_Builtin.Block><_Builtin.Block className="text-size-20" tag="div">{"info@atlastaxation.com"}</_Builtin.Block></_Builtin.Block></_Builtin.Link><_Builtin.Link
                            className="get-in-touch margin-left-0"
                            button={false}
                            aria-label="Phone"
                            block="inline"
                            options={{
                                href: "#"
                            }}><_Builtin.HtmlEmbed
                                className="arrow-icon contact-info black"
                                value="%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewbox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M18.48%2022.926l-1.193.658c-6.979%203.621-19.082-17.494-12.279-21.484l1.145-.637%203.714%206.467-1.139.632c-2.067%201.245%202.76%209.707%204.879%208.545l1.162-.642%203.711%206.461zm-9.808-22.926l-1.68.975%203.714%206.466%201.681-.975-3.715-6.466zm8.613%2014.997l-1.68.975%203.714%206.467%201.681-.975-3.715-6.467z%22%20fill%3D%22white%22%2F%3E%3C%2Fsvg%3E" /><_Builtin.Block className="flex-v-wrapper align-left" tag="div"><_Builtin.Block className="margin-bottom-8" tag="div">{"Have any question?"}</_Builtin.Block><_Builtin.Block className="text-size-20" tag="div">{"(919) 400 8397"}</_Builtin.Block></_Builtin.Block></_Builtin.Link></_Builtin.Block></_Builtin.Block></_Builtin.Block><_Builtin.Block className="page-padding-4 background-img-custom1" tag="div"><_Builtin.Block className="container-large-2" tag="div"><_Builtin.Block className="padding-custom2" tag="div"><_Builtin.Block className="footer-section-wrapper" tag="div"><_Builtin.Block className="footer-top" tag="div"><_Builtin.Block className="footer-col first" tag="div"><_Builtin.Link
                                        className="footer-link-3"
                                        button={false}
                                        aria-label="Company Logo"
                                        block="inline"
                                        options={{
                                            href: "#"
                                        }}><_Builtin.Image
                                            className="logo-mark"
                                            width="50"
                                            height="50"
                                            loading="lazy"
                                            alt=""
                                            src="https://cdn.prod.website-files.com/662c296bd4d3a8028c713c69/662c296bd4d3a8028c713cea_atlas-logo-white.webp" /></_Builtin.Link><_Builtin.Block className="footer-samantha-text-wrapper" tag="div"><_Builtin.Paragraph className="footer-samantha-text">{"We offer a wide array of tax services for individuals, small businesses and corporations"}</_Builtin.Paragraph></_Builtin.Block><_Builtin.Block className="footer-socal-media-wrapper" tag="div"><_Builtin.Block className="social-link-wrapper" tag="div"><_Builtin.Link
                                                className="social-link"
                                                button={false}
                                                aria-label="Facebook"
                                                block="inline"
                                                options={{
                                                    href: "#",
                                                    target: "_blank"
                                                }}><_Builtin.HtmlEmbed
                                                    className="embed-icon text-color-white"
                                                    value="%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewbox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22M22.675%200h-21.35c-.732%200-1.325.593-1.325%201.325v21.351c0%20.731.593%201.324%201.325%201.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1%201.893-4.788%204.659-4.788%201.325%200%202.463.099%202.795.143v3.24l-1.918.001c-1.504%200-1.795.715-1.795%201.763v2.313h3.587l-.467%203.622h-3.12v9.293h6.116c.73%200%201.323-.593%201.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z%22%20fill%3D%22currentColor%22%2F%3E%3C%2Fsvg%3E" /></_Builtin.Link><_Builtin.Link
                                                className="social-link"
                                                button={false}
                                                aria-label="LinkedIn"
                                                block="inline"
                                                options={{
                                                    href: "#",
                                                    target: "_blank"
                                                }}><_Builtin.HtmlEmbed
                                                    className="embed-icon text-color-white"
                                                    value="%3Csvg%20width%3D%2220%22%20height%3D%2221%22%20viewbox%3D%220%200%2020%2021%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M4.42004%2020.1765V6.95582H0.309403V20.1765H4.42004ZM2.34262%205.18717C3.66864%205.18717%204.72945%204.08176%204.72945%202.75527C4.72945%201.473%203.66864%200.411804%202.34262%200.411804C1.06081%200.411804%200%201.473%200%202.75527C0%204.08176%201.06081%205.18717%202.34262%205.18717ZM19.7576%2020.1765H19.8018V12.925C19.8018%209.38772%2019.0062%206.64631%2014.8514%206.64631C12.8623%206.64631%2011.5363%207.75172%2010.9617%208.76869H10.9175V6.95582H6.98367V20.1765H11.0943V13.6325C11.0943%2011.9081%2011.4037%2010.272%2013.5253%2010.272C15.647%2010.272%2015.6912%2012.2176%2015.6912%2013.7651V20.1765H19.7576Z%22%20fill%3D%22currentColor%22%2F%3E%0A%3C%2Fsvg%3E" /></_Builtin.Link><_Builtin.Link
                                                className="social-link"
                                                button={false}
                                                aria-label="Twitter"
                                                block="inline"
                                                options={{
                                                    href: "#",
                                                    target: "_blank"
                                                }}><_Builtin.HtmlEmbed
                                                    className="embed-icon text-color-white"
                                                    value="%3Csvg%20width%3D%2223%22%20height%3D%2219%22%20viewbox%3D%220%200%2023%2019%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M20.6453%204.73C20.6594%204.93614%2020.6594%205.14227%2020.6594%205.35031C20.6594%2011.6893%2015.9127%2019%207.23311%2019V18.9962C4.66915%2019%202.15844%2018.2533%200%2016.8455C0.372821%2016.8911%200.747512%2016.9139%201.12314%2016.9149C3.24794%2016.9168%205.312%2016.192%206.98363%2014.8573C4.96441%2014.8184%203.19374%2013.4799%202.57518%2011.5259C3.28251%2011.6646%204.01133%2011.6361%204.70559%2011.4432C2.50416%2010.9911%200.920374%209.02468%200.920374%206.74102C0.920374%206.72013%200.920374%206.70018%200.920374%206.68023C1.57632%207.05165%202.31075%207.25779%203.06199%207.28059C0.988584%205.87183%200.349462%203.06761%201.60154%200.875144C3.99732%203.87221%207.53211%205.69419%2011.3267%205.88703C10.9464%204.22083%2011.4659%202.47484%2012.6918%201.30357C14.5924%20-0.512718%2017.5815%20-0.419624%2019.368%201.5116C20.4248%201.29977%2021.4377%200.905542%2022.3646%200.346977C22.0124%201.45746%2021.2751%202.40075%2020.2903%203.00016C21.2256%202.88807%2022.1394%202.63348%2023%202.24496C22.3665%203.2101%2021.5685%204.05079%2020.6453%204.73Z%22%20fill%3D%22currentColor%22%2F%3E%0A%3C%2Fsvg%3E" /></_Builtin.Link><_Builtin.Link
                                                className="samantha-email-link text-color-white"
                                                button={false}
                                                aria-label="Email"
                                                block=""
                                                options={{
                                                    href: "mailto:samantha@samhartley.co"
                                                }}>{"info@atlastaxation.com"}</_Builtin.Link></_Builtin.Block></_Builtin.Block></_Builtin.Block><_Builtin.Block className="footer-col mid" tag="div"><_Builtin.Heading className="text-size-18-3 text-color-pastel footer-navigate" tag="h3">{"Our Services"}</_Builtin.Heading><_Builtin.List className="footer-links" tag="ul" unstyled={false}><_Builtin.ListItem className="footer-list-item"><_Builtin.Link
                                                className="footer-link-text pointer-events-none"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#"
                                                }}>{"Personal taxes"}</_Builtin.Link></_Builtin.ListItem><_Builtin.ListItem className="footer-list-item"><_Builtin.Link
                                                className="footer-link-text pointer-events-none"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#"
                                                }}>{"Business taxes"}</_Builtin.Link></_Builtin.ListItem><_Builtin.ListItem className="footer-list-item"><_Builtin.Link
                                                className="footer-link-text pointer-events-none"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#"
                                                }}>{"Bookkeeping"}</_Builtin.Link></_Builtin.ListItem><_Builtin.ListItem className="footer-list-item case-studies"><_Builtin.Link
                                                className="footer-link-text pointer-events-none"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#"
                                                }}>{"Payroll"}</_Builtin.Link></_Builtin.ListItem><_Builtin.ListItem className="footer-list-item"><_Builtin.Link
                                                className="footer-link-text pointer-events-none"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#"
                                                }}>{"Notary"}</_Builtin.Link></_Builtin.ListItem></_Builtin.List></_Builtin.Block><_Builtin.Block className="footer-col mid" tag="div"><_Builtin.Heading className="text-size-18-3 text-color-pastel footer-navigate" tag="h3">{"Useful Links"}</_Builtin.Heading><_Builtin.List className="footer-links" tag="ul" unstyled={false}><_Builtin.ListItem className="footer-list-item"><_Builtin.Link
                                                className="footer-link-text"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#",
                                                    target: "_blank"
                                                }}>{"Refund Status"}</_Builtin.Link></_Builtin.ListItem><_Builtin.ListItem className="footer-list-item"><_Builtin.Link
                                                className="footer-link-text"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#",
                                                    target: "_blank"
                                                }}>{"NC State Refund"}</_Builtin.Link></_Builtin.ListItem><_Builtin.ListItem className="footer-list-item"><_Builtin.Link
                                                className="footer-link-text"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#",
                                                    target: "_blank"
                                                }}>{"Pay IRS"}</_Builtin.Link></_Builtin.ListItem><_Builtin.ListItem className="footer-list-item case-studies"><_Builtin.Link
                                                className="footer-link-text"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#",
                                                    target: "_blank"
                                                }}>{"NC individual tax payment:"}</_Builtin.Link></_Builtin.ListItem></_Builtin.List></_Builtin.Block><_Builtin.Block className="footer-col mid" tag="div"><_Builtin.Heading className="text-size-18-3 text-color-pastel footer-navigate" tag="h3">{"Useful forms"}</_Builtin.Heading><_Builtin.List className="footer-links" tag="ul" unstyled={false}><_Builtin.ListItem className="footer-list-item"><_Builtin.Link
                                                className="footer-link-text"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#",
                                                    target: "_blank"
                                                }}>{"Form NC4"}</_Builtin.Link></_Builtin.ListItem><_Builtin.ListItem className="footer-list-item"><_Builtin.Link
                                                className="footer-link-text"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#",
                                                    target: "_blank"
                                                }}>{"Form NC4ez"}</_Builtin.Link></_Builtin.ListItem><_Builtin.ListItem className="footer-list-item"><_Builtin.Link
                                                className="footer-link-text"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#",
                                                    target: "_blank"
                                                }}>{"Form W-4"}</_Builtin.Link></_Builtin.ListItem><_Builtin.ListItem className="footer-list-item case-studies"><_Builtin.Link
                                                className="footer-link-text center-align"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#",
                                                    target: "_blank"
                                                }}>{"unity forms"}</_Builtin.Link></_Builtin.ListItem><_Builtin.ListItem className="footer-list-item"><_Builtin.Link
                                                className="footer-link-text"
                                                button={false}
                                                block=""
                                                options={{
                                                    href: "#"
                                                }}>{"Terms Of Use"}</_Builtin.Link></_Builtin.ListItem></_Builtin.List></_Builtin.Block><_Builtin.Block className="footer-col last" tag="div"><_Builtin.FormWrapper className="footer-form-block"><_Builtin.FormForm
                                            className="footer-form"
                                            name="wf-form-Footer-Form"
                                            data-name="Footer Form"
                                            method="get"
                                            id="wf-form-Footer-Form"><_Builtin.Block
                                                className="heading-24-3 text-color-ivory text-align-left footer-signup"
                                                tag="div">{"Contact Form"}</_Builtin.Block><_Builtin.Block className="footer-input-wrapper" tag="div"><_Builtin.Block className="input-wrapper footer-form name" tag="div"><_Builtin.Block className="input-icon-wrapper" tag="div"><_Builtin.Image
                                                            className="input-icon"
                                                            loading="lazy"
                                                            width="auto"
                                                            height="auto"
                                                            alt=""
                                                            src="https://cdn.prod.website-files.com/662c296bd4d3a8028c713c69/662c296bd4d3a8028c713d0e_icon-person.svg" /></_Builtin.Block><_Builtin.FormTextInput
                                                        className="footer-input"
                                                        autoFocus={false}
                                                        maxLength={256}
                                                        name="First-Name-3"
                                                        data-name="First Name 3"
                                                        placeholder="First Name"
                                                        type="text"
                                                        disabled={false}
                                                        required={true}
                                                        id="First-Name-3" /></_Builtin.Block><_Builtin.Block className="input-wrapper footer-form" tag="div"><_Builtin.Block className="input-icon-wrapper" tag="div"><_Builtin.Image
                                                            className="input-icon"
                                                            loading="lazy"
                                                            width="auto"
                                                            height="auto"
                                                            alt=""
                                                            src="https://cdn.prod.website-files.com/662c296bd4d3a8028c713c69/662c296bd4d3a8028c713d0e_icon-person.svg" /></_Builtin.Block><_Builtin.FormTextInput
                                                        className="footer-input"
                                                        autoFocus={false}
                                                        maxLength={256}
                                                        name="Last-Name-3"
                                                        data-name="Last Name 3"
                                                        placeholder="Last Name"
                                                        type="text"
                                                        disabled={false}
                                                        required={true}
                                                        id="Last-Name-3" /></_Builtin.Block></_Builtin.Block><_Builtin.Block className="input-wrapper footer-form" tag="div"><_Builtin.Block className="input-icon-wrapper" tag="div"><_Builtin.Image
                                                        className="input-icon"
                                                        loading="lazy"
                                                        width="auto"
                                                        height="auto"
                                                        alt=""
                                                        src="https://cdn.prod.website-files.com/662c296bd4d3a8028c713c69/662c296bd4d3a8028c713d10_icon-mail.svg" /></_Builtin.Block><_Builtin.FormTextInput
                                                    className="footer-input email"
                                                    autoFocus={false}
                                                    maxLength={256}
                                                    name="Email-Address-2"
                                                    data-name="Email Address 2"
                                                    placeholder="Email Address"
                                                    type="email"
                                                    disabled={false}
                                                    required={true}
                                                    id="Email-Address-2" /></_Builtin.Block><_Builtin.FormButton
                                                className="button-submit pw100"
                                                type="submit"
                                                value="Sign Up"
                                                data-wait="Please wait..." /><_Builtin.FormRadioWrapper><_Builtin.FormRadioInput
                                                    type="radio"
                                                    data-name="Radio"
                                                    name="radio"
                                                    value="Radio"
                                                    required={false}
                                                    id="radio"
                                                    form={{
                                                        type: "radio-input",
                                                        name: "Radio"
                                                    }}
                                                    inputType="custom"
                                                    customClassName="w-form-formradioinput--inputType-custom" /><_Builtin.FormInlineLabel>{"Radio"}</_Builtin.FormInlineLabel></_Builtin.FormRadioWrapper></_Builtin.FormForm><_Builtin.FormSuccessMessage className="success-message-2"><_Builtin.Block className="signup-form-footer-success" tag="div"><_Builtin.HtmlEmbed
                                                    className="check-success-form"
                                                    value="%3Csvg%20width%3D%2248%22%20height%3D%2248%22%20viewbox%3D%220%200%2048%2048%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M24%204C12.96%204%204%2012.96%204%2024C4%2035.04%2012.96%2044%2024%2044C35.04%2044%2044%2035.04%2044%2024C44%2012.96%2035.04%204%2024%204ZM18.58%2032.58L11.4%2025.4C10.62%2024.62%2010.62%2023.36%2011.4%2022.58C12.18%2021.8%2013.44%2021.8%2014.22%2022.58L20%2028.34L33.76%2014.58C34.54%2013.8%2035.8%2013.8%2036.58%2014.58C37.36%2015.36%2037.36%2016.62%2036.58%2017.4L21.4%2032.58C20.64%2033.36%2019.36%2033.36%2018.58%2032.58Z%22%20fill%3D%22currentColor%22%2F%3E%0A%3C%2Fsvg%3E" /><_Builtin.Block className="contact-success-message" tag="div"><_Builtin.Block className="heading-32-2" tag="div">{"Thanks! Samantha will be in touch."}</_Builtin.Block></_Builtin.Block></_Builtin.Block></_Builtin.FormSuccessMessage><_Builtin.FormErrorMessage><_Builtin.Block tag="div">{"Oops! Something went wrong while submitting the form."}</_Builtin.Block></_Builtin.FormErrorMessage></_Builtin.FormWrapper></_Builtin.Block></_Builtin.Block><_Builtin.Block className="footer-bottom" tag="div"><_Builtin.Block className="copyright text-color-white" tag="div"><_Builtin.Link
                                        className="copyright-link"
                                        button={false}
                                        block=""
                                        options={{
                                            href: "#"
                                        }}>{"Copyright © 2022-2023 "}<br />{"All Rights Reserved To Atlas Taxation"}</_Builtin.Link></_Builtin.Block><_Builtin.Block className="footer-links-wrapper" tag="div"><_Builtin.Link
                                        className="footer-tc text-color-white"
                                        button={false}
                                        block=""
                                        options={{
                                            href: "#"
                                        }}>{"Terms & Conditions"}</_Builtin.Link><_Builtin.Link
                                        className="footer-tc last text-color-white"
                                        button={false}
                                        block=""
                                        options={{
                                            href: "#"
                                        }}>{"Privacy Policy"}</_Builtin.Link></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Component>
    );
}