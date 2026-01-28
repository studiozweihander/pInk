import { useEffect } from "react";
import { APP_VERSION } from "../constants";


const ASCIIArt = () => {
    useEffect(() => {
        const art = `
           █████            █████       
          ░░███            ░░███        
 ████████  ░███  ████████   ░███ █████  
░░███░░███ ░███ ░░███░░███  ░███░░███   
 ░███ ░███ ░███  ░███ ░███  ░██████░    
 ░███ ░███ ░███  ░███ ░███  ░███░░███   
 ░███████  █████ ████ █████ ████ █████  
 ░███░░░  ░░░░░ ░░░░ ░░░░░ ░░░░ ░░░░░   
 ░███                                   
 █████                                  
░░░░░                                   
        `;

        const primaryColor = getComputedStyle(document.documentElement)
            .getPropertyValue("--primary-color")
            .trim() || "#e78fde";

        console.log(`%c${art}`, `color: ${primaryColor}; font-weight: bold; font-family: monospace;`);
        console.log(`%cpInk v${APP_VERSION} - Seja bem vindo ao seu catálogo de quadrinhos favorito!`, `color: ${primaryColor}; font-family: 'JetBrains Mono', monospace; font-size: 10px;`);
    }, []);

    return null;
};

export default ASCIIArt;
