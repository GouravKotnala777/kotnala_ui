import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

type ThemeTypes = "light"|"dark";
interface MeteorMashAnimationTypes{
  numOfMeteors?:5|8|10|15|20|25;
  luminosity?:1|2|3|4|5|6|7;
  trailLength?:"xs"|"sm"|"md"|"lg"|"xl"|"xxl";
  trailLengthShrinkable?:"xs"|"sm"|"md"|"lg"|"xl"|"xxl";
  trailThickness?:1|2|3|4|5|6|7|8|9;
  trailColor?:{light:string; dark:string;};
  meteorCoreSize?:0.5|1|1.5|2|2.5|3|3.5|4|4.5|5;
  meteorCoreColor?:{light:string; dark:string;};
  collisionDebriSize?:0.5|1|1.5|2|2.5|3|3.5|4|4.5|5;
  collisionDebriColor?:{light:string; dark:string;};
};
interface MeteorTrailInterface {
    index:number;
    x1:number;
    y1:number;
    trailLength:number;
    trailLengthShrinkable:number;
    color:string;
    dots:{
        index:number;
        x:number;
        y:number;
        size:number;
        color:string;
        opacity:number;
        speed:number;
    }[];
};
interface MeteorMashPropInterface extends MeteorMashAnimationTypes{
    theme?:ThemeTypes;
    tailwindStyles?:string;
    animateUntill?:boolean;
};

const NUM_OF_METEORS:NonNullable<MeteorMashAnimationTypes["numOfMeteors"]> = 10;
const TRAIL_LENGTH:NonNullable<MeteorMashAnimationTypes["trailLength"]> = "sm";
const TRAIL_LENGTH_SHRINKABLE:NonNullable<MeteorMashAnimationTypes["trailLengthShrinkable"]> = "md";
const TRAILS_THICKNESS:NonNullable<MeteorMashAnimationTypes["trailThickness"]> = 3;
const METEOR_CORE_SIZE:NonNullable<MeteorMashAnimationTypes["meteorCoreSize"]> = 2.5;
const COLLISION_DEBRI_SIZE:NonNullable<MeteorMashAnimationTypes["collisionDebriSize"]> = 2;
const LUMINOSITY:NonNullable<MeteorMashAnimationTypes["luminosity"]> = 3;

const isValidColorPallet = (propName:string, rgbPalletCode?:string) => {
    if (!rgbPalletCode) return;

    const rgbValue = rgbPalletCode.split(",");
    const doesContainRGB = rgbValue.length === 3;
    const isRGBNumber = rgbValue.every((c) => !isNaN(Number(c)));

    if (!doesContainRGB || !isRGBNumber) throw Error(`color pallet ${rgbPalletCode} you have passed to prop ${propName} inside MeteorMash component is invalid! It should be a valid rgb color code eg. 255,255,255`);

    return rgbPalletCode;
};

const CONVERT_LENGTH_TO_NUMBER = {
    xs:20, sm:40, md:60, lg:80, xl:100, xxl:120
};


function MeteorMash({numOfMeteors=NUM_OF_METEORS, trailLength=TRAIL_LENGTH, trailLengthShrinkable=TRAIL_LENGTH_SHRINKABLE, trailThickness=TRAILS_THICKNESS, meteorCoreSize=METEOR_CORE_SIZE, collisionDebriSize=COLLISION_DEBRI_SIZE, theme="light", animateUntill=true, trailColor, meteorCoreColor, collisionDebriColor, luminosity=LUMINOSITY, tailwindStyles}:MeteorMashPropInterface) {
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const [trails, setTrails] = useState<MeteorTrailInterface[]>([]);

    useEffect(() => {
        isValidColorPallet("trailColor", trailColor?.light);
        isValidColorPallet("trailColor", trailColor?.dark);
        isValidColorPallet("meteorCoreColor", meteorCoreColor?.light);
        isValidColorPallet("meteorCoreColor", meteorCoreColor?.dark);
        isValidColorPallet("collisionDebriColor", collisionDebriColor?.light);
        isValidColorPallet("collisionDebriColor", collisionDebriColor?.dark);

        const trailLengthInNum = CONVERT_LENGTH_TO_NUMBER[trailLength];
        const trailLengthShrinkableInNum = CONVERT_LENGTH_TO_NUMBER[trailLengthShrinkable];

        const trailsArray:MeteorTrailInterface[] = [];        
        const maxHeight = (canvasRef.current?.parentElement?.clientHeight||400);
        const maxWidth = (canvasRef.current?.parentElement?.clientWidth||400);
        
        for (let c = 0; c < numOfMeteors; c++) {
            const x = Math.floor(Math.random()*((maxWidth/2)-(-(maxWidth))+1))+(-(maxWidth));
            const y = -(trailLengthInNum+trailLengthInNum+(c*100));
            trailsArray.push({
                index:c, x1:x, y1:y, trailLength:trailLengthInNum, trailLengthShrinkable:trailLengthShrinkableInNum, color:"red",
                dots:[
                    {index:0, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                    {index:1, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                    {index:2, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                    {index:3, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                    {index:4, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                    {index:5, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                    {index:6, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                    {index:7, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                    {index:8, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                    {index:9, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                    {index:10, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                    {index:11, x:x+trailLengthInNum+maxHeight+(c*100), y:y+trailLengthInNum+maxHeight+(c*100), size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2},
                ]
            });
        }
        setTrails(trailsArray);
    }, []);

    useEffect(() => {
        if (!animateUntill) {
            console.log("animateUntill is false");
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (!canvas.parentElement?.clientHeight) return;

        const maxHeight = canvas.parentElement.clientHeight;
        const maxWidth = canvas.parentElement.clientWidth;
        const trailLengthInNum = CONVERT_LENGTH_TO_NUMBER[trailLength];
        const trailLengthShrinkableInNum = CONVERT_LENGTH_TO_NUMBER[trailLengthShrinkable];

        let animationFrame: number;
        const animateMeteorTails = () => {

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let trail of trails) {
                trail.x1+=2;
                trail.y1+=2;

                // shortening the trail length after covering certain height of the canvas
                if (trail.trailLengthShrinkable > -20 && trail.y1 >= maxHeight/2) {
                    const canvasPercentageFromHalf = Math.max(0, (((trail.y1+trail.trailLength+trail.trailLengthShrinkable) -  maxHeight/2) * 100) /  maxHeight/4);
                    const trailPercentage = (trail.trailLengthShrinkable*canvasPercentageFromHalf)/100;
                    
                    trail.trailLengthShrinkable-=trailPercentage;
                    trail.x1+=(trailPercentage);
                    trail.y1+=(trailPercentage);
                }

                // after trail hitting to the canvas bottom
                if (trail.y1+trail.trailLength+trail.trailLengthShrinkable >= maxHeight) {
                    const animateMeteorCollisionDebries = () => {
                        let angle:number=0;
                        
                        for (const dot of trail.dots) {
                            
                            // create random debries
                            // angle = theta*(Math.PI/180)
                            angle = (((dot.index/10)*(175-130))+130) * (Math.PI / 180);                            
                            
                            dot.x-= Math.cos(angle) * dot.speed;
                            dot.y-= Math.sin(angle) * dot.speed;
                            dot.opacity *= 0.94;

                            ctx.beginPath();
                            ctx.fillStyle = theme==="light"?`rgba(255, 106, 0,${dot.opacity})`:`rgba(209, 213, 220,${dot.opacity})`;
                            ctx.arc(dot.x+trail.trailLength-trail.trailLengthShrinkable+trail.trailLengthShrinkable, dot.y+trail.trailLength-trail.trailLengthShrinkable+trail.trailLengthShrinkable, dot.size, 0, 2*Math.PI, false)
                            ctx.fill();
                        }
                    }
                    animateMeteorCollisionDebries();
                }
                
                // after trail reaching bottom to the canvas
                if (trail.y1 >= (maxHeight+150)) {
                    const x = Math.floor(Math.random()*((maxWidth/2)-(-(maxWidth))+1))+(-(maxWidth));
                    const y = -(trailLengthInNum+trailLengthInNum);

                    trail.x1 = x;
                    trail.y1 = y;
                    trail.trailLength = trailLengthInNum;
                    trail.trailLengthShrinkable = trailLengthShrinkableInNum;


                    trail.dots = [{index:0, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2}];
                    trail.dots.push({index:1, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2});
                    trail.dots.push({index:2, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2});
                    trail.dots.push({index:3, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2});
                    trail.dots.push({index:4, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2});
                    trail.dots.push({index:5, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2});
                    trail.dots.push({index:6, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2});
                    trail.dots.push({index:7, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2});
                    trail.dots.push({index:8, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2});
                    trail.dots.push({index:9, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2});
                    trail.dots.push({index:10, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2});
                    trail.dots.push({index:11, x:x+trailLengthInNum+maxHeight, y:y+trailLengthInNum+maxHeight, size:(Math.random()*(collisionDebriSize-0.8))+0.8, color:"", opacity:10, speed:((Math.random())*(0.8-0.2))+0.2});
                }

                // meteor trail
                ctx.beginPath();                
                const gradient = ctx.createLinearGradient(trail.x1, trail.y1, trail.x1+trail.trailLength+trail.trailLengthShrinkable, trail.y1+trail.trailLength+trail.trailLengthShrinkable);
                gradient.addColorStop(0, theme==="light"?"white":"black");
                gradient.addColorStop(0.2, "rgba(255,255,0,1)");
                gradient.addColorStop(0.5, "rgba(255,165,0,1)");
                gradient.addColorStop(0.8, "rgba(255,69,0,0.8)");
                gradient.addColorStop(1, "oklch(74.6% 0.16 232.661)");
                
                ctx.moveTo(trail.x1, trail.y1);
                ctx.lineTo(trail.x1+trail.trailLength+trail.trailLengthShrinkable, trail.y1+trail.trailLength+trail.trailLengthShrinkable);
                ctx.lineWidth = trailThickness;
                ctx.strokeStyle = gradient;
                ctx.stroke();

                //ctx.tex

                // meteor core outer
                ctx.beginPath();
                ctx.fillStyle = `rgba(0, 191, 255, ${1+0.01+Math.sin(2 * Math.PI * 1 * ((trail.y1/100)))})`;
                ctx.arc(trail.x1+trail.trailLength+trail.trailLengthShrinkable+1, trail.y1+trail.trailLength+trail.trailLengthShrinkable+1, meteorCoreSize, 0, 2*Math.PI, false);
                ctx.fill();
                
                // meteor core inner
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 110, 70, ${trail.y1%2})`;
                ctx.arc(trail.x1+trail.trailLength+trail.trailLengthShrinkable+1, trail.y1+trail.trailLength+trail.trailLengthShrinkable+1, meteorCoreSize-0.4, 0, 2*Math.PI, false);
                ctx.fill();
            }

            animationFrame = requestAnimationFrame(animateMeteorTails);
        }
        animateMeteorTails();

        return() => {
            cancelAnimationFrame(animationFrame);
        };
    }, [trails, animateUntill]);
    

    return(
        <div className={cn(
            "w-full h-full absolute top-0 left-0 z-0 overflow-hidden",
            tailwindStyles
        )}>
            <canvas ref={canvasRef} >
            </canvas>                
        </div>
    )
}

export default MeteorMash;