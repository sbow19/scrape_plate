/**
 * Custom button switch
 */
import * as styles from "./appSlider.module.css"
import { useState } from "react";

export const ButtonSlider: React.FC<ButtonSliderProps> = ({
    selectorData
})=>{

    const [selectedIndex, setSelectedIndex] = useState(0);

    return(
    <>
    <div
        className={styles.slider_container}
    >
        <div
            className={styles.selector_container}
        >
            {/* MAP OUT SELECTORS */}
            {
                selectorData.map((selectorData, index)=>{
                    return(
                    <div
                        className={`${styles.individual_selector} ${index === selectedIndex ? styles.highlighted : ""}`}
                        key={index}
                        onClick={()=>{
                            setSelectedIndex(index)
                        }}
                    >
                        {/* Selector group title */}
                        {selectorData[0]}
                    </div>
                    )
                })
            }
            <div
                className={styles.selector_background}
                style={{
                    width:`calc((90% / (${selectorData.length})))`,
                    left: `calc(15px + ((90% / (${selectorData.length})) * ${selectedIndex}))`
                }}
            />

        </div>
        <div
            className={styles.button_container}
            style={{
                right: `calc(100% * ${selectedIndex})`
            }}
        >
            {
                selectorData.map((selectorData, index)=>{
                    const buttonArray = selectorData[1]
                    return(
                    <div
                        className={styles.button_container_inner}
                        key={index}
                    >

                        {
                            buttonArray.map((button)=>{
                                return button
                            })
                        }

                    </div>
                    )
                })
            }


        </div>

    </div>
    
    </>
    )
}

