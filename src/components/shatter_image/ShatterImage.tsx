import { useEffect, useRef, useState, type MouseEvent } from "react";
import { cn } from "../../lib/utils";

export type OneToNine = 1|2|3|4|5|6|7|8|9;
export interface ShatterImageAnimationTypes{
  pixelSize?:number;
  pixelGap?:number;
  mouseRadius?:OneToNine;
  friction?:OneToNine;
  ease?:OneToNine;
};
export interface ShatterImagePropTypes extends ShatterImageAnimationTypes {
  base64ImageURL:string;
  imageHeight?:number;
  imageWidth?:number;
  isAnimating?:boolean;
  tailwindStyles?:string;
};



interface ParticleTypes{
    index:number;
    x:number;
    y:number;
    size:number;
    velX:number;
    velY:number;
    originalX:number;
    originalY:number;
    color:string;
    potential:number;
    scale:number;
    originalScale:number;
    displace:number;
};

function easeHandler(ease:OneToNine) {
    const numberConversion = Number(ease);
    if (!numberConversion) {
        Error(`${numberConversion} numberConversion from easeHandler in ShatterImage Component is not a number but for now it has been replaced to 0.04`)
        return 0.04;
    }
    switch (numberConversion) {
        case 1:
            return 0.02;
        case 2:
            return 0.04;
        case 3:
            return 0.06;
        case 4:
            return 0.08;
        case 5:
            return 0.2;
        case 6:
            return 0.4;
        case 7:
            return 0.6;
        case 8:
            return 0.8;
        case 9:
            return 1;
        default:
            return 0.04;
    }
};
function frictionHandler(friction:OneToNine) {
    const numberConversion = Number(friction);
    if (!numberConversion) {
        Error(`${numberConversion} numberConversion from frictionHandler in ShatterImage Component is not a number but for now it has been replaced to 0.7`)
        return 0.7;
    }
    switch (numberConversion) {
        case 1:
            return 0.5;
        case 2:
            return 0.6;
        case 3:
            return 0.7;
        case 4:
            return 0.8;
        case 5:
            return 0.9;
        case 6:
            return 0.93;
        case 7:
            return 0.95;
        case 8:
            return 0.97;
        case 9:
            return 0.99;
        default:
            return 0.7;
    }
};
function mouseRadiusHandler(radius:OneToNine) {
    const numberConversion = Number(radius);
    
    if (!numberConversion) {
        Error(`${numberConversion} numberConversion from mouseRadiusHandler in ShatterImage Component is not a number but for now it has been replaced to 3000`)
        return 3000;
    }
    switch (numberConversion) {
        case 1:
            return 1000;
        case 2:
            return 3000;
        case 3:
            return 5000;
        case 4:
            return 7000;
        case 5:
            return 9000;
        case 6:
            return 10000;
        case 7:
            return 15000;
        case 8:
            return 20000;
        case 9:
            return 30000;
        default:
            return 3000;
    }
};


let animationRequestID = 0;

function ShatterImage({base64ImageURL, isAnimating=true, imageHeight=200, imageWidth=100, pixelSize=4, pixelGap=4, friction=3, ease=3, mouseRadius=8, tailwindStyles}:ShatterImagePropTypes) {
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const imgRef = useRef<HTMLImageElement|null>(null);
    const [isCanvasHovering, setIsCanvasHovering] = useState<boolean>(false);
    const [particles, setParticles] = useState<ParticleTypes[]>([]);
    const [mouse, setMouse] = useState<{x:number|null; y:number|null;}>({x:0, y:0});

 
    function mouseHoverHandler(e:MouseEvent<HTMLCanvasElement>) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const {top, left, width, height} = canvas.getBoundingClientRect();
        const cWidth = canvas.width;
        const cHeight = canvas.height;

        setMouse({
            ...mouse,
            x:(e.clientX*(cWidth/width)) - (left*(cWidth/width)),
            y:(e.clientY*(cHeight/height)) - (top*(cHeight/height)),
        });
    };
    function onEnterHandler() {
        setIsCanvasHovering(true);
    };
    function onLeaveHandler() {
        setMouse({...mouse, x:null, y:null});
        setIsCanvasHovering(false);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const image = imgRef.current;
        if (!canvas || !image) return;
    
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        ctx.drawImage(image, canvas.width/2-imageWidth/2, canvas.height/2-imageHeight/2, imageWidth, imageHeight);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const particlesLocal:ParticleTypes[] = [];
        
        for (let col=0; col<canvas.width; col+=pixelGap) {
            for (let row=0; row<canvas.height; row+=pixelGap) { 

                const index = (row * canvas.width + col) * 4;
                const red = pixels[index];
                const green = pixels[index+1];
                const blue = pixels[index+2];
                const alpha = pixels[index+3];
                
                
                
                if (alpha > 0) {
                    const color = `rgb(${red}, ${green}, ${blue})`;
                    const x = col+pixelGap;
                    const y = row+pixelGap;
                    const originalX = Math.floor(x);
                    const originalY = Math.floor(y);
                    const velX = 0;
                    const velY = 0;
                    particlesLocal.push({index,x,y,originalX,originalY,size:pixelSize,velX,velY,color,potential:10,scale:0,originalScale:2,displace:0});
                }
            }           
        }

        setParticles(particlesLocal);
    }, [pixelSize, pixelGap]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const image = imgRef.current;
        if (!canvas || !image) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        

        const animate = () => {
            console.log("running.......");
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (const particle of particles) {
                let dx = mouseRadiusHandler(mouseRadius);
                let dy = mouseRadiusHandler(mouseRadius);

                if (mouse.x && mouse.y) {
                    dx = mouse.x - particle.x;
                    dy = mouse.y - particle.y;
                }
                
                const distance = (dx*dx + dy*dy);
                const force = -mouseRadiusHandler(mouseRadius)/(distance);
                let angle = 0;

                if (distance < mouseRadiusHandler(mouseRadius)) {
                    angle = Math.atan2(dy, dx);
                    particle.velX += force * Math.cos(angle);
                    particle.velY += force * Math.sin(angle);
                }

                particle.x+=(particle.velX*=frictionHandler(friction)) + (particle.originalX-particle.x) * easeHandler(ease);
                particle.y+=(particle.velY*=frictionHandler(friction)) + (particle.originalY-particle.y) * easeHandler(ease);

                
                ctx.beginPath();
                ctx.fillStyle = particle.color;
                ctx.rect(
                    particle.x,
                    particle.y,
                    particle.size,
                    particle.size
                );
                ctx.fill();
            }

            const areAllParticlesSettled = particles.every((p) => p.originalX-Number(p.x.toFixed(4)) === 0)

            if (areAllParticlesSettled) {
                cancelAnimationFrame(animationRequestID);
                return;
            }
            
            if (!isAnimating) {
                cancelAnimationFrame(animationRequestID);
                return;
            }
            animationRequestID = requestAnimationFrame(animate);
        };

        if (isAnimating) {
            animate();
        }
        
        
        return() => cancelAnimationFrame(animationRequestID)
    }, [isAnimating, particles, mouse, isCanvasHovering, imageHeight, imageWidth, pixelSize, pixelGap, friction, ease, mouseRadius]);

    return(
        <div className={cn(
            `border border-gray-200 dark:border-gray-700 w-full h-full overflow-hidden`,
            tailwindStyles
        )}>
            <canvas ref={canvasRef} className="w-full h-full" onMouseEnter={onEnterHandler} onMouseLeave={onLeaveHandler} onMouseMove={(e) => mouseHoverHandler(e)}></canvas>
            <img ref={imgRef}
                alt="shatter_image"
                src={base64ImageURL}
            />
        </div>
    )    
};

export default ShatterImage;