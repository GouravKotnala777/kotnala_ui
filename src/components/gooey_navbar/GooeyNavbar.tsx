import { useRef, useState, type MouseEvent } from "react";
import { NavLink } from "react-router-dom";


const IconHandler = (iconPath:string) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-10 -10 44 44" stroke-width="1.5" className="stroke-1 stroke-gray-400 mix-blend-difference w-full h-full"
    style={{
        transition:"1s ease-in-out"
    }}
>
  <path stroke-linecap="round"
        stroke-linejoin="round"
        d={iconPath}
    />
</svg>;

const GooFilter = () => (
    <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="goo">
                <feGaussianBlur in="sourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                <feBlend in="sourceGraphic" in2="goo" />
            </filter>
        </defs>
    </svg>
);

interface GooeyNavbarPropTypes{
    navItems:{
        iconPath: string;
        text: string;
        url: string;
    }[];
    paddingX?:string;
    paddingY?:string;
    marginTop?:string;
};

function GooeyNavbar({navItems, paddingX="32px", paddingY="10px", marginTop="0px"}:GooeyNavbarPropTypes) {
    const parentSectionRef = useRef<HTMLElement|null>(null);
    const [hoveringNav, setHoveringNav] = useState("");

    function onMouseOverHandler(e:MouseEvent<HTMLDivElement>) {
        const dataNavItem = (e.target as HTMLElement).getAttribute("data-nav-item");
        const parentSectionRefElem = parentSectionRef.current;

        if (!dataNavItem) return;
        if (!parentSectionRefElem) return;

        setHoveringNav(dataNavItem);
    };

    function onMouseOutHandler() {
        setHoveringNav("");
    };


    return(
        <section ref={parentSectionRef} className="max-w-3xl mx-auto min-h-screen px-4"
            style={{
                marginTop
            }}
        >
            {GooFilter()}
            <div className="relative w-min mx-auto">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="relative">
                        <div className="apply_goo_effect flex bg-gray-400"
                            style={{
                                padding:`${0} 0`
                            }}
                        >
                            {
                                navItems.map(({text}) => (
                                    <div className="relative text-gray-800">
                                        <div className=""
                                            style={{
                                                padding:`${paddingY} ${paddingX}`
                                            }}
                                        >{text}</div>
                                        <div className="bg-gray-800 text-transparent absolute left-0 h-full w-full"
                                            style={{
                                                padding:`0px ${paddingX}`,
                                                top:hoveringNav === text?`-170%`:"0px",
                                                transition:"1s ease-in-out"
                                            }}
                                        >{text}</div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex absolute left-0 h-full"
                            style={{
                                top:"-170%"
                            }}
                        >
                            {
                                navItems.map(({text}) => (
                                    <div className="relative text-white">
                                        <div className="opacity-0"
                                            style={{
                                                padding:`${paddingY} ${paddingX}`
                                            }}
                                        >{text}</div>
                                        <div className="absolute top-0 left-0 w-full h-full text-center content-center"
                                            style={{
                                                opacity:hoveringNav === text ? 1 : 0,
                                                transition:"1.5s ease-in-out"
                                            }}
                                        >{text}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                </div>





                <div className="flex"
                    style={{
                        padding:`${paddingY} 0`
                    }}
                    onMouseOver={onMouseOverHandler}
                    onMouseOut={onMouseOutHandler}
                >
                    {
                        navItems.map(({iconPath, text, url}) => (
                            <div className="w-full relative">
                                <div className="opacity-0"
                                    style={{
                                        padding:`${paddingY} ${paddingX}`
                                    }}
                                >{text}</div>
                                <div className="absolute left-0 h-full w-full text-center content-center cursor-default"
                                    style={{
                                        top:`-${paddingY}`
                                    }}
                                >{IconHandler(iconPath)}</div>
                                <NavLink to={url} data-nav-item={text} className="absolute top-0 left-0 w-full h-full opacity-0">{text}</NavLink>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default GooeyNavbar;