import { useEffect, useRef, useState, type ButtonHTMLAttributes, type Dispatch, type InputHTMLAttributes, type SetStateAction } from "react";
import { cn } from "../../lib/utils";

type ThicknessPropTypes = 1|1.1|1.2|1.3|1.4|1.5|1.6|1.7|1.8|1.9|2|2.1|2.2|2.3|2.4|2.5|2.6|2.7|2.8|2.9|3|3.2|3.3|3.5|3.7|3.9|4|4.5|4.9|5|5.3|5.5|5.7;
interface SlitherAnimationTypes{
    waveLength?:"xs"|"sm"|"md"|"lg"|"xl"|"xxl";
    amplitude?:1|2|3|4|5|6|7|8|9;
    smoothness?:1|2|3|4|5|6|7|8|9;
    waveThickness?:ThicknessPropTypes;
    blurEffect?:boolean;
    shrinkEffect?:boolean;
};
interface SlitherInputPropTypes extends SlitherAnimationTypes{
    inputProps?:InputHTMLAttributes<HTMLInputElement>;
    buttonProps?:ButtonHTMLAttributes<HTMLButtonElement>;
    theme?:"light"|"dark";
    setText:Dispatch<SetStateAction<string>>;
    placeHolder?:string;
    setIsAnimationRunning?:Dispatch<SetStateAction<boolean>>;
    inputTailwindStyle?:string;
    buttonTailwindStyle?:string;
}
interface ParticleTypes{
    index:number;
    x:number;
    y:number;
    velX:number;
    velY:number;
    size:number;
    opacity:number;
    scale:number;
    potential:number;
    delay:number;
};

const NUM_OF_PARTICLES = 10000;
const SIZE = 1;
let requestAnimationFrameID = 0;
let removeLastTextAnimationID = 0;
let frame = 0;

const rangeMapping = (iter:number, outMin:number, outMax:number, inpMin:number, inpMax:number) => {
    return outMin + ((iter-inpMin) * (outMax-outMin)) / (inpMax-inpMin);
};

const adjustWaveLength = (waveLength:"xs"|"sm"|"md"|"lg"|"xl"|"xxl") => {
    if (waveLength === "xs") {
        return 0.09;
    }
    else if (waveLength === "sm") {
        return 0.08;
    }
    else if (waveLength === "md") {
        return 0.07;
    }
    else if (waveLength === "lg") {
        return 0.05;
    }
    else if (waveLength === "xl") {
        return 0.03;
    }
    else {
        return 0.016;
    }
};
const adjustWaveThickness = (index:number, waveThickness:ThicknessPropTypes) => {
    let thickness=0;

    if (waveThickness < 2) {
        thickness = (((index%3)-1)*(rangeMapping(waveThickness, 0, 30, 1, 1.9)));
    }
    else if (waveThickness < 3) {
        thickness = (((index%5)-2)*(rangeMapping(waveThickness, 3, 15, 2, 2.9)));
    }
    else if (waveThickness < 4) {
        thickness = (((index%7)-3)*(rangeMapping(waveThickness, 4, 10, 3, 3.9)));
    }
    else if (waveThickness < 5) {
        thickness = (((index%9)-4)*(rangeMapping(waveThickness, 5, 7, 4, 4.9)));
    }
    else if (waveThickness < 6) {
        thickness = (((index%11)-5)*(rangeMapping(waveThickness, 6, 6, 5, 5.9)));
    }
    else{
        thickness = (((index%3)-1)*5);
    }

    return thickness;
};

function SlitherInput({theme="light", setText, placeHolder="", amplitude=4, smoothness=3, waveLength="xl", waveThickness=1.3, blurEffect=true, shrinkEffect=true, inputTailwindStyle, buttonTailwindStyle, inputProps, buttonProps, setIsAnimationRunning}:SlitherInputPropTypes) {
    const [text2, setText2] = useState<string>("");
    const [placeHolder2, _] = useState<string>(placeHolder);
    const [isDisplayOverflowing, setIsDisplayOverflowing] = useState<boolean>(false);
    const [particles, setParticles] = useState<ParticleTypes[]>([]);
    const inputRef = useRef<HTMLInputElement|null>(null);
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const displayRef = useRef<HTMLDivElement|null>(null);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [isTextRemaining, setIsTextRemaining] = useState<boolean>(false);

    const {onChange:onChangeInputHandler, onKeyDown:onKeyDownInputHandler, ...restInputProps} = inputProps ?? {};
    const {onClick:onClickButtonHandler, ...restButtonProps} = buttonProps ?? {};

    function clearDisplay() {        
        const display = displayRef.current;
        if (!display) return;
        if (isAnimating) return;
        if (text2.trim() === "") return;
        if (text2.trim() !== "" && text2 === placeHolder2) return;
        
        setIsAnimating(true);
        setIsAnimationRunning&&setIsAnimationRunning(true);
        setIsTextRemaining(true);

        const removeLastText = () => {
            if (frame%2 === 0) {
                setText2(prev => {
                    if (prev.length === 0) {
                        inputRef.current!.focus();
                        setIsTextRemaining(false);
                        setTimeout(() => {
                            console.log("SAB KE SAB BAHAR");
                            setIsAnimating(false);
                            setIsAnimationRunning&&setIsAnimationRunning(false);
                            createParticlesObject();
                            setText("");
                            cancelAnimationFrame(requestAnimationFrameID);
                        }, 1500);
                        cancelAnimationFrame(removeLastTextAnimationID);
                        return "";
                    }
                    return prev.slice(0, -1)
                });
            }
            frame++;            
            removeLastTextAnimationID = requestAnimationFrame(removeLastText);
        }
        removeLastText();
    };

    function createParticlesObject() {
        const input = inputRef.current;
        
        
        if (!input ) return;        
        const x = -5;
        
        const particlesLocal:ParticleTypes[] = [];
        for (let index = 0; index < NUM_OF_PARTICLES; index++) {
            const y = (input?.clientHeight)+adjustWaveThickness(index, waveThickness);
            let delay:number = 0;
            let angleDegX:number = 0;
            let angleRadX:number = 0;
            let angleDegY:number = 0;
            let angleRadY:number = 0;
            let velX:number = 0;
            let velY:number = 0;
            let size:number = 0;
            let opacity:number = 0;
            let potential:number = 0;
            let scale:number = 0;

            if (index%20 === 0) {
                delay = index*2;
                velX = 0.0001;
                velY = ((-1)**(Math.floor(Math.random()*10)))*5;
                size = SIZE;
                opacity = 1;
                scale = 0.1;
                potential = 10;
            }
            else{
                delay = index*2;
                angleDegY = Math.sin(index/((10*smoothness)+10)) * (4*amplitude);
                angleRadY = angleDegY * Math.PI / 180;
                angleDegX = Math.sin(index/30) * 50;
                angleRadX = angleDegX * Math.PI / 180;
                velX = Math.cos(angleRadX) * 0.001;
                velY = -Math.sin(angleRadY) * 4;
                size = SIZE;
                opacity = 1;
                scale = 0.1;
                potential = 10;
            }

            particlesLocal.push({
                index, x, y, velX, velY, size, opacity, scale, potential, delay
            });
        }

        setParticles(particlesLocal);
    };

    useEffect(() => {
        const displayWidth = displayRef.current?.clientWidth;
        const canvasParentWidth = canvasRef.current?.parentElement?.clientWidth;
        const displayGrandParentWidth = displayRef?.current?.parentElement?.parentElement?.clientWidth;
        
        if (!displayWidth || !canvasParentWidth || !displayGrandParentWidth) return;

        // grandparent of displayRef has pl-2 (8px)
        if (displayWidth+canvasParentWidth+8 <= displayGrandParentWidth) {
            setIsDisplayOverflowing(false);
        }
        else{
            setIsDisplayOverflowing(true);
        }
    }, [text2]);

    useEffect(() => {
        createParticlesObject();
    }, [amplitude, smoothness, waveLength, waveThickness, blurEffect, shrinkEffect]);
    useEffect(() => {
        const input = inputRef.current;
        const canvas = canvasRef.current;
        const display = displayRef.current;
        if (!canvas) return;
        if (!input) return;

        canvas.width = 600;
        canvas.height = 200;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const animateParticles = () => {            
            if (!isAnimating) return;

            const displayParentHeight = display?.parentElement?.clientHeight as number;

            ctx.clearRect(0,0,canvas.width,canvas.height);
            for (const particle of particles) {
                
                if (((particle.x > canvas.width) || (particle.y < 0) || (particle.y > (displayParentHeight+30)))) {
                    particle.potential = 0;
                    continue;
                }
                 
                if (isTextRemaining) { // if content remaining
                    if (isDisplayOverflowing) { // if content length is greater than input element's width
                        if (particle.delay > 0) {
                            particle.delay-=0.5;
                            continue;
                        }
                        particle.x += particle.velX;
                        particle.y += particle.velY;
                        particle.scale +=0.07;
                        particle.opacity -= adjustWaveLength(waveLength);
                    }
                    else{
                        if (particle.delay > 0) {
                            particle.delay-=25;
                            continue;
                        }
                        particle.x += (particle.velX+10);
                        particle.y += particle.velY;
                        particle.scale +=0.07;
                        particle.opacity -= adjustWaveLength(waveLength);
                    }
                }
                else{
                    if (particle.x > 0) {
                        if (particle.delay > 0) {
                            particle.delay-=6;
                            continue;
                        }
                        particle.x += particle.velX;
                        particle.y += particle.velY;
                        particle.scale +=0.07;
                        particle.opacity -= adjustWaveLength(waveLength);
                    }
                    else{
                        particle.potential = 0;
                        continue;
                    }
                }

                ctx.beginPath();
                ctx.arc((particle.x), (particle.y), particle.size+particle.scale, 0, 2*Math.PI, false);
                ctx.fillStyle = theme==="dark"?`rgba(140, 140, 140, ${particle.opacity})`:`rgba(209, 213, 220, ${particle.opacity})`;
                ctx.fill();
            }
            requestAnimationFrameID = requestAnimationFrame(animateParticles);
        }

        animateParticles();
        
        return() => {cancelAnimationFrame(requestAnimationFrameID)};

    }, [isAnimating, isTextRemaining, isDisplayOverflowing]);


    return(
        <div className={cn(
            "flex justify-end border border-gray-200 dark:border-gray-700 rounded-sm w-full focus-within:[box-shadow:0px_0px_10px_0.1px_#e5e7ebdd_inset] transition-shadow ease-in-out duration-500 overflow-hidden",
            (text2.trim()===""&&placeHolder2===placeHolder)?"text-gray-500/50":"text-gray-500 dark:text-gray-300",
            inputTailwindStyle
        )}>
            <div className="mr-auto flex-1">
                <div className="flex h-12 pl-2">
                    <div className="relative">

                        {/* Text Part */}
                        <input ref={inputRef} type="text" value={text2} className="w-full h-12 absolute top-0 left-0 text-transparent caret-gray-400 outline-none"
                            onChange={(e) => {
                                if (isAnimating) return;

                                setText2(e.target.value);
                                setText(e.target.value);
                                onChangeInputHandler&&onChangeInputHandler(e);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    clearDisplay();
                                }
                                onKeyDownInputHandler&&onKeyDownInputHandler(e);
                            }}
                            {...restInputProps}
                        />

                        {/* Display Part */}
                        {
                            (text2.trim() !== "")&&
                            <div ref={displayRef} className="flex h-full">
                                {
                                    text2.split("").map((c, i) => (c===" "?<div key={i} className="h-full content-center">&nbsp;</div>:<div key={i} className="h-full content-center" style={{
                                        filter:(blurEffect&&isAnimating&&i<=text2.length-1&&i>text2.length-15) ? `blur(1.5px)`:`blur(0)`,
                                        transform:(shrinkEffect&&isAnimating&&i<=text2.length-1&&i>text2.length-15) ? `scale(0.7)`:`scale(1)`,
                                        transition:"0.3s ease-in-out"
                                    }}>{c}</div>))
                                }
                            </div>
                        }
                        {/* Placeholder Part */}
                        {
                            (placeHolder&&text2.trim() === "")&&
                                <div ref={displayRef} className="flex h-full absolute top-0 left-0">
                                    {
                                        placeHolder.split("").map((c, i) => (c===" "?<div key={i} className="h-full content-center">&nbsp;</div>:<div key={i} className="h-full content-center">{c}</div>))
                                    }
                                </div>
                        }

                    </div>

                    {/* Canvas Part */}
                    <div className="flex-1 min-w-20 relative overflow-hidden" onClick={() => inputRef.current?.focus()}>
                        <canvas ref={canvasRef} className="absolute top-0 left-0 w-80"></canvas>
                    </div>
                    
                </div>
            </div>
            <button className={cn(
                "p-2 text-gray-100 dark:text-gray-800 bg-gray-700 dark:bg-gray-300 m-1 hover:opacity-90 rounded-sm cursor-pointer z-1",
                buttonTailwindStyle
            )}
                onClick={(e) => {
                    clearDisplay();
                    onClickButtonHandler&&onClickButtonHandler(e);
                }}
                {...restButtonProps}
            >Click</button>
        </div>
    )    
};

export default SlitherInput;