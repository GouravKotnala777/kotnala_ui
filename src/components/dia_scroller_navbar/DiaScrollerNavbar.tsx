import { useEffect, useRef, useState, type MouseEvent } from "react";
import { NavLink } from "react-router-dom";

interface DiaScrollerNavbarPropTypes{
    navItems:{
        iconPath: string;
        text: string;
        url: string;
    }[];
    theme?:"light"|"dark"|"default";
    fontSize?:string;
    padding?:string;
    previewGap?:string;
    borderRadius?:string;
};

const IconHandler = (text:string, iconPath:string) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-10 -10 44 44" stroke-width="1.5"  data-nav-item={text} className="stroke-1 stroke-neutral-400 mix-blend-difference w-full h-full"
    style={{
        transition:"1s ease-in-out"
    }}
>
  <path  data-nav-item={text} stroke-linecap="round"
        stroke-linejoin="round"
        d={iconPath}
    />
</svg>;

function DiaScrollerNavbar({navItems, fontSize="18px", padding="0px 0px", previewGap="-48px", borderRadius="0px", theme}:DiaScrollerNavbarPropTypes) {
    const[hoveringNav, setHoveringNav] = useState<{x:number; width:number; left:number;}>({x:0, width:0, left:0});
    const [hoveringNavText, setHoveringNavText] = useState<string>("");
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [parentDivX, setParentDivX] = useState(0);
    const parentDivRef = useRef<HTMLDivElement|null>(null);

    function moveHandler(e:MouseEvent<HTMLDivElement>) {
        const dataNavItem = (e.target as HTMLElement).getAttribute("data-nav-item");
        if (!dataNavItem) return;
        const {x, width, left} = (e.target as HTMLElement).getBoundingClientRect();

        setHoveringNavText(dataNavItem);
        setHoveringNav({x, width, left});
    };

    function showHandler(e:MouseEvent<HTMLDivElement>) {
        const dataNavItem = (e.target as HTMLElement).getAttribute("data-nav-item");
        if (!dataNavItem) return;
        setIsVisible(true);
    };

    function hideHandler(e:MouseEvent<HTMLDivElement>) {
        const dataNavItem = (e.target as HTMLElement).getAttribute("data-nav-item");
        if (!dataNavItem) return;
        setIsVisible(false);
    };

    function parentDivXCalculator() {
        const parentDivElement = parentDivRef.current;

        if (!parentDivElement) return;

        const {x} = parentDivElement.getBoundingClientRect();

        setParentDivX(x);
    }
    useEffect(() => {
        parentDivXCalculator();
    }, []);
    
    return(
        <div
            className="text-neutral-500 bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-900"
            style={{
                fontSize,
                boxShadow:(theme === "light")?"0px 0px 8px 0.1px #00000050":"0px 0px 8px 0.1px #ffffff50",
                borderRadius
            }}
        >
            <div ref={parentDivRef}
                className="relative w-min"
                onMouseOver={showHandler}
                onMouseMove={moveHandler}
                onMouseOut={hideHandler}
            >
                <div className="rounded-sm absolute left-0 w-23 overflow-hidden transition-all ease-in-out duration-1000 border border-neutral-500"
                    style={{
                        translate:`${(hoveringNav.x-parentDivX)}px`,
                        width:hoveringNav.width,
                        opacity:isVisible?1:0,
                        top:previewGap,
                        borderRadius
                    }}
                >
                    <div className="w-max transition-all ease-in-out duration-1000 flex"
                        style={{
                            translate:`${-hoveringNav.x+parentDivX}px`
                        }}
                    >
                        {
                            navItems.map(({text}, index) => (
                                <div key={index} className="transition-all ease duration-600 bg-neutral-800 text-neutral-200"
                                    style={{
                                        transform:hoveringNavText === text?"scale(1)":"scale(0.5)",
                                        filter:hoveringNavText === text?"blur(0)":"blur(7px)",
                                        padding,
                                        borderRadius
                                    }}
                                >{text}</div>
                            ))
                        }
                    </div>
                </div>
                <div
                    style={{
                        borderRadius
                    }}
                    className="flex overflow-hidden">
                    {
                        navItems.map(({iconPath, text, url}, index) => (
                            <NavLink key={index} to={url} className="h-full cursor-pointer flex items-center relative transition-all ease-in-out duration-600 hover:bg-neutral-800 dark:hover:bg-neutral-800"
                                style={{
                                    padding
                                }}
                            >
                                <div className="text-neutral-300 dark:text-neutral-600">{text}</div>
                                <div className="backdrop-blur-md absolute left-0 top-0 h-full w-full text-center content-center rounded-md transition-all ease-in-out duration-600"
                                    style={{
                                        scale:(hoveringNavText === text)?1:0.9,
                                        borderRadius:(index === 0)?
                                            `${borderRadius} 0 0 ${borderRadius}`
                                            :
                                            (index === navItems.length-1)?
                                                `0 ${borderRadius} ${borderRadius} 0`
                                                :
                                                "0"
                                    }}

                                >{IconHandler(text, iconPath)}</div>
                                <div data-nav-item={text} className="backdrop-blur-md absolute left-0 top-0 h-full w-full text-center content-center opacity-0">A</div>
                            </NavLink>
                        ))
                    }
                </div>
            </div>
        </div>
    )
};

export default DiaScrollerNavbar;