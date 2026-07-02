import { useEffect, useRef, useState, type ChangeEvent, type Dispatch, type FocusEvent, type KeyboardEvent, type MouseEvent, type SetStateAction } from "react";

interface ParticleVanishingInputPropTypes{
    fontSize?:"text-xs"|"text-sm"|"text-md"|"text-lg"|"text-xl"|"text-2xl";
    fontWeight?:"font-thin"|"font-normal"|"font-semibold"|"font-bold"|"font-extrabold";
    className?:string;
    height?:string;
    theme:"light"|"dark";
    btnIconPathD?:string;
    wave?:{
        amplitude:number;
        cycles:number;
        numOfParticles:number;
        particleSize:number;
        smokeEffect:boolean;
    };
    placeHolder?:string;
    manuallyStartAnimation?:boolean;
    setData:Dispatch<SetStateAction<string>>;
    onClick?:(e:MouseEvent<HTMLButtonElement>)=>void;
    onChange?:(e:ChangeEvent<HTMLInputElement>)=>void;
    onFocus?:(e:FocusEvent<HTMLInputElement>)=>void;
    onBlur?:(e:FocusEvent<HTMLInputElement>)=>void;
    onKeyUp?:(e:KeyboardEvent<HTMLInputElement>)=>void;
    onKeyDown?:(e:KeyboardEvent<HTMLInputElement>)=>void;
};

let timer = 0;

function ParticleVanishingInput({btnIconPathD="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z", fontSize="text-lg", fontWeight="font-normal", manuallyStartAnimation, placeHolder="", setData, height="40px", theme="light", wave={amplitude:4, cycles:10, numOfParticles:800, particleSize:0.6, smokeEffect:false},
    onClick, onChange, onFocus, onBlur, onKeyUp, onKeyDown
}:ParticleVanishingInputPropTypes) {
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const boxRef = useRef<HTMLDivElement|null>(null);
    const placeHolderRef = useRef<HTMLDivElement|null>(null);
    const inputRef = useRef<HTMLInputElement|null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaceHolderVisible, setIsPlaceHolderVisible] = useState(true);
    const [isBoxCanvasEqualWidth, setIsBoxCanvasEqualWidth] = useState(false);
    
    
    function createPlaceHolder() {        
        const placeHolderElem = placeHolderRef.current;

        if (!placeHolderElem) return;

        for (const c of placeHolder){
            const spanElem = document.createElement("span");
            spanElem.textContent = c;
            spanElem.style.color = theme==="dark"?"#d4d4d4":"#404040";
            placeHolderElem.appendChild(spanElem);
        };        
    };
    function removePlaceHolder() {
        const placeHolderElem = placeHolderRef.current;

        if (!placeHolderElem) return;

        placeHolderElem.replaceChildren("");
        
    };
    function showPlaceHolder() {
        setIsPlaceHolderVisible(true);
    };
    function hidePlaceHolder() {
        setIsPlaceHolderVisible(false);
    };

    function createInputCaret(visualBox:HTMLDivElement, caretPosition:number) {
        const isCaretExist = document.getElementById("caret");
        hidePlaceHolder();
        if (isCaretExist) {            
            visualBox.removeChild(isCaretExist);
            const childNextToCaretPosition = visualBox.children[caretPosition];
            if (childNextToCaretPosition) {
                visualBox.insertBefore(isCaretExist, childNextToCaretPosition);
            }
            else{
                visualBox.appendChild(isCaretExist);
            }
        }
        else{
            const caret = document.createElement("span");
            caret.className = "h-[75%] border border-black dark:border-white animate-pulse";
            caret.id = "caret";
            const childNextToCaretPosition = visualBox.children[caretPosition];            
            if (childNextToCaretPosition) {
                visualBox.insertBefore(caret, childNextToCaretPosition);
            }
            else{
                visualBox.appendChild(caret);
            }
        }
    };

    const createDust = () => {
        let particles:{size:number; x:number; y:number; velX:number; velY:number; acc:number; opacity:number; del:number; potential:number;}[] = [];
        const canvas = canvasRef.current;
        const box = boxRef.current;
        const input = inputRef.current
        if (!canvas) return;
        if (!box) return;
        if (!input) return;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = box.getBoundingClientRect();
        const inputRect = input.getBoundingClientRect();

        canvas.width = isBoxCanvasEqualWidth?rect.width:inputRect.width;
        canvas.height = inputRect.height;

        const {amplitude, cycles, numOfParticles, particleSize, smokeEffect} = wave;

        for (let index = 0; index < numOfParticles; index++) {
            const wave = Math.sin((index/numOfParticles) * Math.PI * cycles) * amplitude;
            particles.push({
                potential:1,
                opacity:1,
                del:1-(index/numOfParticles),
                x:(index/numOfParticles)*(rect.width),
                y:rect.height/2,
                size:particleSize,
                velX:Math.abs((Math.random()-0.5)*1.5),
                velY:(Math.random()-wave)*0.15,
                acc:0
            });
        }

        const children = box.children;

        if (!children) return;

        let num = children.length;
        const animateParticles = () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);

            let num2 = 0;
            for (const child of children) {
                num2+=0.9;
                num-=0.01;
                (child as HTMLElement).style.opacity = `${num-num2}`; 
            }
            
            particles.forEach((p) => {
                if (p.del > 0) {
                    p.del -= 0.01
                }
                else{
                    p.x += p.velX;
                    p.y += p.velY;
                    p.opacity -= 0.02;
                    p.potential -= 0.01;
                }
                
                ctx.fillStyle = theme==="light"?`rgba(255, 255, 255, ${1-Math.abs(p.opacity)})`:`rgba(0, 0, 0, ${1-Math.abs(p.opacity)})`;
                ctx.beginPath();
                ctx.arc(
                    p.x,
                    p.y,
                    (smokeEffect?Math.abs(p.size*p.opacity*30):particleSize),
                    0, Math.PI*2
                );
                ctx.fill();
            });

            if (particles.some(p => p.potential > 0) || num > 0) {
                requestAnimationFrame(animateParticles);
            }
            else{
                const inputElem = inputRef.current;

                if (!inputElem) return;

                inputElem.value = "";
                box.innerHTML = "";
                inputElem.blur();
                setIsLoading(false);
            }
        }

        animateParticles();
    };

    function changeInputHandler(e:ChangeEvent<HTMLInputElement>){
        const boxElem = boxRef.current;
        const inputElem = inputRef.current;

        if (!boxElem) return;
        if (!inputElem) return;
        
        const inputEvent = (e.nativeEvent as InputEvent);
        
        const data = inputEvent.data;
        const type = inputEvent.inputType;

        setData(e.target.value);
        
        if (boxElem.getBoundingClientRect().width >= inputElem.getBoundingClientRect().width) {
            setIsBoxCanvasEqualWidth(true);
        }
        else{
            setIsBoxCanvasEqualWidth(false);
        }
        
        if (type === "insertFromPaste" && data) {
            [...data].forEach(ch => {
                const spanElem = document.createElement("span");
                spanElem.textContent = ch;
                boxElem.appendChild(spanElem);
            });
        }

    };

    function keyboardEventHandler(e:KeyboardEvent<HTMLInputElement>) {
        const boxElem = boxRef.current;
        const caret = document.getElementById("caret");

        if (!boxElem) return;
        if (!caret) return;
        const key = e.key;
        

        if (key === "Enter") {
            setIsLoading(true);
            createDust();
            caret.remove();
        }
        else if (key === "ArrowLeft") {
            const preElem = caret.previousSibling;
            boxElem.insertBefore(caret, preElem);
        }
        else if (key === "ArrowRight") {
            const nextElem = caret.nextSibling;
            if (!nextElem) return;
            boxElem.insertBefore(nextElem, caret);
        }
        else if (key === "Backspace") {
            const preElem = caret.previousSibling;
            
            if (preElem) {
                boxElem.removeChild(preElem);
            }
        }
        else if (key === "Delete") {
            const nextSibling = caret.nextSibling;
            if (nextSibling) {
                boxElem.removeChild(nextSibling);
            }            
        }
        else if (key === "Tab") {
            boxElem.removeChild(caret);         
        }
        else if (key === " ") {
            const spanElem = document.createElement("span");
            spanElem.textContent = " ";
            spanElem.className = "w-1 inline-block";
            boxElem.insertBefore(spanElem, document.getElementById("caret"));
        }
        else if(key.length === 1){
            const spanElem = document.createElement("span");
            spanElem.textContent = key;
            boxElem.insertBefore(spanElem, document.getElementById("caret"));
        }        
        else{
            throw Error("not printable key");
        }        
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const box = boxRef.current;
        if (!canvas) return;
        if (!box) return;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = box.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;
    }, []);

    useEffect(() => {
        createPlaceHolder();
        return removePlaceHolder;
    }, [theme]);
    

    function clickInputHandler(e:MouseEvent<HTMLInputElement>){
        const caretPosition = e.currentTarget.selectionStart;
        clearTimeout(timer);
        
        if (caretPosition){
            createInputCaret(boxRef.current as HTMLDivElement, caretPosition);
        }
        else{
            createInputCaret(boxRef.current as HTMLDivElement, 0);
        }
    };
    function focusInputHandler(){
        timer = setTimeout(() => {
            createInputCaret(boxRef.current as HTMLDivElement, boxRef.current?.children.length||0);
        }, 600);
    };
    function blurInputHandler(){
        const caret = document.getElementById("caret");
        caret?.remove();
        if (boxRef.current?.children.length===0) {
            showPlaceHolder();
        }
    };

    useEffect(() => {
        if (manuallyStartAnimation) {
            const caret = document.getElementById("caret");
            if (!caret) return;
            setIsLoading(true);
            createDust();
            caret.remove();            
        }
    }, [manuallyStartAnimation]);

    return(
        <div className="border border-neutral-100 dark:border-neutral-800 w-full flex text-neutral-600 dark:text-neutral-100 rounded-sm overflow-hidden pl-1">
            <div className="relative w-full"
                style={{
                    height
                }}
            >
                <canvas ref={canvasRef} className={`absolute top-0 ${isBoxCanvasEqualWidth?"right-0":"left-0"}`}></canvas>

                <div id="boxRef" data-set="box" ref={boxRef} className={`${fontSize} ${fontWeight} absolute top-0 ${isBoxCanvasEqualWidth?"right-0":"left-0"} flex items-center h-full overflow-hidden pr-5 content-center ${isPlaceHolderVisible?"opacity-0":"opacity-100"}`}></div>
                <div id="placeHolderRef" data-set="placeholder" ref={placeHolderRef} className={`${fontSize} ${fontWeight} absolute top-0 h-full w-full content-center ${!isPlaceHolderVisible?"opacity-0":"opacity-100"}`}></div>

                <input ref={inputRef} type="text" placeholder="User Name"
                    className={`${fontSize} ${fontWeight} absolute top-0 left-0 h-full w-full opacity-0`}
                    onChange={(e) => {
                        changeInputHandler(e);
                        if (onChange) {
                            onChange(e);
                        }
                    }}
                    onKeyDown={(e) => {
                        keyboardEventHandler(e);
                        if (onKeyDown) {
                            onKeyDown(e);
                        }
                    }}
                    onKeyUp={(e) => {
                        if (onKeyUp) {
                            onKeyUp(e);
                        }
                    }}
                    onFocus={(e) => {
                        focusInputHandler(); 
                        if (onFocus) {
                            onFocus(e);
                        }
                    }}
                    onClick={(e) => {
                        clickInputHandler(e);
                    }}
                    onBlur={(e) => {
                        blurInputHandler(); 
                        if (onBlur) {
                            onBlur(e);
                        }
                    }}
                />

            </div>
            <button className="relative p-2  bg-neutral-800 text-neutral-600 hover:text-neutral-400 cursor-pointer transition duration-300"
                onClick={(e) => {
                    if (inputRef.current?.value) {
                        setIsLoading(true);
                        createDust();
                        
                        if (onClick) {
                            onClick(e);
                        }
                    }
                }}
            >
                <div className="absolute top-0 left-0 inset-0 text-center content-center text-white blur-sm">O</div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                    className={`size-4 ${isLoading&&"animate-pulse"}`}
                >
                            <path className="animate-spin origin-center text-neutral-200" strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                style={{
                                    opacity:isLoading?1:0,
                                    transition:"0.5s ease-in-out"
                                }}
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" d={btnIconPathD}
                                style={{
                                    opacity:isLoading?0:1,
                                    transition:"0.5s ease-in-out"
                                }}
                            />
                    
                </svg>
            </button>
        </div>
    )
};

export default ParticleVanishingInput;