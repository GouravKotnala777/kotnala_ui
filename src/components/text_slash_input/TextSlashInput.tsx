import {useRef, useState, type ButtonHTMLAttributes, type ChangeEvent, type Dispatch, type InputHTMLAttributes, type KeyboardEvent, type MouseEvent, type SetStateAction } from "react";
import { cn } from "../../lib/utils";


interface TextSlashInputPropTypes {
    setTextState:Dispatch<SetStateAction<string>>;
    placeHolder?:string;
    inputProps?:InputHTMLAttributes<HTMLInputElement>;
    buttonProps?:ButtonHTMLAttributes<HTMLButtonElement>;
    inputTailwindStyle?:string;
    buttonTailwindStyle?:string;
};
let textingTimer = 0;
let progressRingClearInterval = 0;
function TextSlashInput({setTextState, placeHolder="", inputProps, buttonProps, inputTailwindStyle="", buttonTailwindStyle=""}:TextSlashInputPropTypes) {
    const [text, setText] = useState(placeHolder);
    const [textCopy, setTextCopy] = useState("");
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [isPlaceHolderAnimating, setIsPlaceHolderAnimating] = useState<boolean>(false);
    const [isTexting, setIsTexting] = useState<boolean>(false);
    const textSlashVisualRef = useRef<HTMLDivElement|null>(null);
    const textSlashInputRef = useRef<HTMLInputElement|null>(null);
    const {onChange:inputOnChange, onKeyDown:inputOnKeyDown, ...restInputProps} = inputProps ?? {};
    const {onClick:buttonOnClick, ...restButtonProps} = buttonProps ?? {};


    function setTextHandler(e:ChangeEvent<HTMLInputElement>) {
        setText(e.target.value);
        setTextCopy(e.target.value);
        setTextState(e.target.value);
        setIsTexting(true);
        clearTimeout(textingTimer);
        textingTimer = setTimeout(() => {
            setIsTexting(false);
        }, 500);
    };

    function clearInput() {
        const inputElement = textSlashInputRef.current
        if (!inputElement) return;
        inputElement.value = "";
    };

    function clearProgressRing() {
        setTextCopy((prev) => {
            let string = prev.split("");
            string.pop();
            return string.join("");
        })
    };

    function submit() {
        if (placeHolder && text===placeHolder) return;
        if (text.trim() === "") {
            setText(placeHolder);
            clearInput();
            return;
        }

        if (!isAnimating) {
            setIsAnimating(true);
            setIsPlaceHolderAnimating(false);
        }  
        setTimeout(() => {
            clearInterval(progressRingClearInterval);
            setIsAnimating(false);
            setIsPlaceHolderAnimating(true);
            console.log("khatam....");
            clearInput();
            setText(placeHolder);
        }, (((text.length)/11)*1000)+1500);

        setTimeout(() => {
            setIsAnimating(false);
            setIsPlaceHolderAnimating(false);
            console.log("placeholder khatam....");
        }, (((text.length)/11)*1000)+2500);


        progressRingClearInterval = setInterval(() => {
            console.log("chal raha...");
            clearProgressRing();
        }, ((((text.length)/11)*1000)+1500)/text.length);
    };

    function onKeyEnterHandler(e:KeyboardEvent<HTMLInputElement>) {
        const key = e.key;
        if (key === "Enter") {
            submit();
        }
    };



    // Element Props
    function inputOnChangeHandler(e:ChangeEvent<HTMLInputElement>) {
        setTextHandler(e);
        inputOnChange?.(e);
    };
    function inputOnKeyDownHandler(e:KeyboardEvent<HTMLInputElement>) {
        onKeyEnterHandler(e);
        inputOnKeyDown?.(e);
    };
    function buttonOnClickHandler(e:MouseEvent<HTMLButtonElement>) {
        submit();
        buttonOnClick?.(e);
    };



    return(
        <>
            <div className={cn(
                `border border-neutral-200 dark:border-neutral-200/30 focus-within:[box-shadow:0px_0px_8px_0.1px_#d4d4d499_inset] dark:focus-within:[box-shadow:0px_0px_8px_0.1px_#d4d4d490_inset] flex justify-between items-center rounded-full px-1.25 py-1 transition-shadow duration-300 ease-in-out`,
                (text===placeHolder && placeHolder)?"text-neutral-400/50":"text-neutral-600  dark:text-neutral-300",
                inputTailwindStyle
            )}>
                <div className="relative w-[calc(100%-41px)] overflow-hidden">
                    <input ref={textSlashInputRef} disabled={isAnimating || isPlaceHolderAnimating} type="text" maxLength={160} className="px-2 w-full max-w-full h-10 absolute text-transparent font-mono outline-none caret-gray-500"
                        onChange={inputOnChangeHandler}
                        onKeyDown={inputOnKeyDownHandler}
                        {...restInputProps}
                    />
                    <div ref={textSlashVisualRef} className="w-full pointer-events-none">
                        <div className={`h-10 flex ${(text===placeHolder)?"justify-start":"justify-end"} `}>
                            <div className={`flex flex-col relative h-10 px-2 mr-auto font-mono transition-transform duration-9000 ease-in`}
                                style={{
                                    animation:(isAnimating && !isTexting)?`slide ${(text.length)/11}s ${(((textSlashVisualRef.current?.parentElement?.parentElement?.clientWidth||0)/100)-0.5)}s linear both`:"none"
                                }}
                            >
                                <div className="w-5 h-5 rounded-3xl  absolute top-[50%] -right-5 translate-y-[-50%]"></div>
                                <div className="w-full h-[50%] flex">
                                    {
                                        text.split("").map((c, index) => (
                                            <div key={index} className="inline-block overflow-hidden h-full"
                                                style={{
                                                    animation:
                                                        (isAnimating && !isPlaceHolderAnimating && !isTexting)?
                                                            `textUpperPart 1.5s ${(text.length-index)*0.09}s linear both`
                                                            :
                                                            (!isAnimating && isPlaceHolderAnimating && !isTexting)?
                                                                `placeHolderTextUpperPart 0.5s linear both`
                                                                :
                                                                "none"
                                                }}
                                            >
                                                {
                                                    c===" "?
                                                    <div className="translate-y-[6.3px]">&nbsp;</div>
                                                    :
                                                    <div className="translate-y-[6.3px]">{c}</div>
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="w-full h-[50%] flex">

                                    {
                                        
                                            text.split("").map((c, index) => (
                                                <div key={index} className="inline-block overflow-hidden h-full"
                                                    style={{
                                                        animation:(isAnimating && !isPlaceHolderAnimating && !isTexting)?
                                                            `textLowerPart 1.5s ${(text.length-index)*0.09}s linear both`
                                                            :
                                                            (!isAnimating && isPlaceHolderAnimating && !isTexting)?
                                                                `placeHolderTextLowerPart 0.5s linear both`
                                                                :
                                                                "none"
                                                    }}
                                                >
                                                    {
                                                        c===" "?
                                                        <div className="translate-y-[-13.7px]">&nbsp;</div>
                                                        :
                                                        <div className="translate-y-[-13.7px]">{c}</div>
                                                    }
                                                </div>
                                            ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="rounded-full w-10 h-10 overflow-hidden relative">
                    <div className="w-full h-full rounded-full"
                        style={{
                            background:`conic-gradient(at center, orange 0% ${((Math.floor(textCopy.length/4)*4)/160)*100}%, transparent ${((Math.floor(textCopy.length/4)*4)/160)*100}% 100%)`
                        }}
                    ></div>
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[87%] h-[87%] bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                    <div className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[50%] h-[50%] ${(!isAnimating&&!isTexting&&text.length===160)&&"bg-sky-400 dark:bg-sky-600"} ${(!isAnimating&&!isTexting&&text.length<160)&&"bg-neutral-900 dark:bg-neutral-500"} ${isTexting&&"bg-orange-500 animate-pulse"} ${(isAnimating && !isTexting)&&"bg-orange-500 animate-ping"} transition-all duration-500 ease-in-out rounded-full`}></div>
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-2 border-dashed border-white dark:border-neutral-900 w-full h-full rounded-full"></div>
                    <button disabled={isAnimating || isPlaceHolderAnimating} className={cn(
                        "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] h-[90%] rounded-full bg-gray-200/5 dark:bg-gray-50/5 text-neutral-800 backdrop-blur-[6px]",
                        (isAnimating||isPlaceHolderAnimating)?"cursor-not-allowed":"cursor-pointer",
                        buttonTailwindStyle
                    )}
                        onClick={buttonOnClickHandler}
                        {...restButtonProps}
                    >
                        <div className="h-full w-full rounded-full flex justify-around items-center">
                            {
                                [1,2,3].map((_, i) => (
                                    <div className={`w-1.5 h-1.5 rounded-full bg-neutral-800 dark:bg-neutral-100`}
                                        style={{
                                            transform:isAnimating?"translate(0px, 3px)":"translate(0px, 0px)",
                                            opacity:(isAnimating||isTexting)?1:0,
                                            transitionDuration:"0.3s",
                                            animation:isAnimating?`oscillateUpDown 1s ${i*0.3}s linear infinite`:`dotPulseLoader 1s ${i*0.3}s ease-in-out infinite`
                                        }}
                                    ></div>
                                ))
                            }
                        </div>
                    </button>
                </div>

            </div>

            <style>{`
                @keyframes dotPulseLoader {
                    0%{ transform:scale(0.9) }
                    50%{ transform:scale(1.4) }
                    100%{ transform:scale(0.9) }
                }
                @keyframes oscillateUpDown {
                    0%{ transform:translate(0px, 3px) }
                    50%{ transform:translate(0px, -3px) }
                    100%{ transform:translate(0px, 3px) }
                }
                @keyframes slide {
                    0%{ transform:translate(0px, 0px) }
                    100%{ transform:translate(100%, 0px) }
                }
                @keyframes textUpperPart {
                    0%{ transform:translate(0px, 0px) scale(1); filter:opacity(1); }
                    20%{ transform:translate(1px, -7px) scale(1.2); filter:opacity(1); }
                    40%{ transform:translate(2px, -14px) scale(1.5); filter:opacity(0.5); }
                    60%{ transform:translate(1px, -14px) scale(1.2); filter:opacity(0.3); }
                    80%{ transform:translate(0.5px, -7px) scale(1); filter:opacity(0.2); }
                    95%{ transform:translate(0px, -4px) scale(0.9); filter:opacity(0.2); }
                    100%{ transform:translate(0px, -4px) scale(0.9); filter:opacity(0); }
                }
                @keyframes placeHolderTextUpperPart {
                    0%{ transform:scale(0.6); filter:opacity(0); }
                    20%{ transform:scale(0.6); filter:opacity(0.2); }
                    40%{ transform:scale(0.7); filter:opacity(0.3); }
                    60%{ transform:scale(0.7); filter:opacity(0.5); }
                    80%{ transform:scale(0.8); filter:opacity(0.7); }
                    95%{ transform:scale(0.9); filter:opacity(0.8); }
                    100%{ transform:scale(1); filter:opacity(1); }
                }
                @keyframes textLowerPart {
                    0%{ transform:translate(0px, 0px) scale(1); filter:opacity(1); }
                    20%{ transform:translate(1px, 7px) scale(1.2); filter:opacity(1); }
                    40%{ transform:translate(2px, 14px) scale(1.5); filter:opacity(1); }
                    60%{ transform:translate(1px, 14px) scale(1.2); filter:opacity(0.5); }
                    80%{ transform:translate(0.5px, 7px) scale(1); filter:opacity(0.3); }
                    95%{ transform:translate(0px, 4px) scale(0.9); filter:opacity(0.3); }
                    100%{ transform:translate(0px, 4px) scale(0.9); filter:opacity(0); }
                }
                @keyframes placeHolderTextLowerPart {
                    0%{ transform:scale(0.6); filter:opacity(0); }
                    20%{ transform:scale(0.6); filter:opacity(0.2); }
                    40%{ transform:scale(0.7); filter:opacity(0.3); }
                    60%{ transform:scale(0.7); filter:opacity(0.5); }
                    80%{ transform:scale(0.8); filter:opacity(0.7); }
                    95%{ transform:scale(0.9); filter:opacity(0.8); }
                    100%{ transform:scale(1); filter:opacity(1); }
                }
            `}</style>
        </>
    )
}

export default TextSlashInput;