import { useRef, useState, type MouseEvent } from "react";
import { NavLink } from "react-router-dom";

interface FluidNavbarPropTypes{
    blobCurvature?:string;
    navItems:{
        iconPath: string;
        text: string;
        url: string;
    }[];
    blobSize?:string;
    blobTop?:string;
    blobY?:"top"|"middle"|"bottom";
};

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

const IconHandler = (iconPath:string) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-2.5 -2.5 30 30" stroke-width="1.5"
    className="stroke-1 stroke-gray-400 w-full h-full"
    style={{
        transition:"1s ease-in-out"
    }}
>
  <path stroke-linecap="round"
        stroke-linejoin="round"
        d={iconPath}
    />
</svg>;

function FluidNavbar({blobCurvature="2px", navItems, blobSize="44px", blobY="middle", blobTop="-70px"}:FluidNavbarPropTypes) {
    const [pos, setPos] = useState<{x:number; y:number;}>({x:-8, y:0});
    const [hoveredNav, setHoveredNav] = useState<string>("");
    const [blobPrevPos, setBlobPrevPos] = useState<"left"|"right"|null>(null);
    const [blobWidth, setBlobWidth] = useState<number>(0);
    const sectionRef = useRef<HTMLDivElement>(null);

    function mouseOverHandler(e:MouseEvent<HTMLDivElement>){
        const dataNav = (e.target as HTMLElement).getAttribute("data-nav-item");
        const sectionRefElem = sectionRef.current;
        
        if (!dataNav) return;
        if (!sectionRefElem) return;

        const elem = (e.target as HTMLElement);
        const sectionElemOffset = sectionRefElem.getBoundingClientRect().x;
        const {x, y, width} = elem.getBoundingClientRect();

        
        setPos({x:x-sectionElemOffset-10, y});
        setBlobWidth(width);
        setHoveredNav(dataNav);
        
        if (pos.x > x-sectionElemOffset+20) {
            setBlobPrevPos("right");
        }
        else if(pos.x < x-sectionElemOffset-20){
            setBlobPrevPos("left");
        }
        else{
            setBlobPrevPos(null);
        }
    };
    
    return(
        <div ref={sectionRef} className="relative w-max mx-auto">
            {GooFilter()}
            
            <div className="apply_goo_effect absolute left-0 w-full h-full"
                style={{
                    top:blobTop
                }}
            >
                <div className="bg-gray-50 dark:bg-gray-900 flex gap-20">
                    {
                        navItems.map(({text}) => (
                            <div key={text} className="hover:bg-gray-900">
                                <div className="opacity-0">{text}</div>
                            </div>
                        ))
                    }
                </div>

                <div className="border-10 border-gray-600 dark:border-gray-500 bg-gray-900 dark:bg-gray-100 w-15 absolute"
                    style={{
                        top:blobY==="top"?"-15px":blobY==="middle"?"-9px":"0px",
                        left:pos.x,
                        height:blobSize,
                        width:`${blobWidth+12}px`,
                        opacity:hoveredNav?1:0,
                        borderRadius:blobCurvature,
                        transition:"1s ease-in-out"
                    }}
                ></div>
            </div>
            <div className="absolute left-0 w-full h-full"
                style={{
                    top:blobTop
                }}
            >

                <div className="flex gap-20 absolute top-0">
                    {
                        navItems.map(({text}) => (
                            <div key={text} className="">
                                <div className="text-gray-50 dark:text-gray-900">{text}</div>
                            </div>
                        ))
                    }
                </div>
            </div>



            <div className="flex gap-20"
                onMouseOver={mouseOverHandler}
                onMouseOut={() => setHoveredNav("")}
            >
                {
                    navItems.map(({iconPath, text, url}) => (
                        <div key={text} className="border border-gray-200 dark:border-gray-700 overflow-hidden text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 relative cursor-default transition-all duration-700 ease-in-out rounded-md hover:scale-115"
                        >
                            <div className="opacity-0">{text}</div>
                            <div className="bg-gray-800 dark:bg-gray-200 absolute inset-0"
                                style={{
                                    transform:(hoveredNav === text&&blobPrevPos === "left")?"scaleX(1)":"scaleX(0)",
                                    transformOrigin:"left",
                                    transition:"0.5s ease-in-out"
                                }}
                            ></div>
                            <div className="bg-gray-800 dark:bg-gray-200 absolute inset-0"
                                style={{
                                    transform:(hoveredNav === text&&blobPrevPos === "right")?"scaleX(1)":"scaleX(0)",
                                    transformOrigin:"right",
                                    transition:"0.5s ease-in-out"
                                }}
                            ></div>
                            <div className="bg-gray-800 dark:bg-gray-200 absolute inset-0"
                                style={{
                                    transform:(hoveredNav === text&&blobPrevPos === null)?"scaleY(1)":"scaleY(0)",
                                    transformOrigin:"bottom",
                                    transition:"0.5s ease-in-out"
                                }}
                            ></div>
                            <div className="absolute top-0 left-0 inset-0 text-center">{IconHandler(iconPath)}</div>
                            <NavLink to={url} data-nav-item={text} className="absolute top-0 left-0 inset-0 text-center opacity-0">{text}</NavLink>
                        </div>
                    ))
                }

            </div>
        </div>
    )
};

export default FluidNavbar;