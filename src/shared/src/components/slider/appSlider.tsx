/**
 * Custom button switch
 */
import * as styles from "./appSlider.module.css"
import { useState } from "react";

export const ButtonSlider = ({
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
                        className={styles.individual_selector}
                        key={index}
                        onClick={()=>{
                            setSelectedIndex(index)
                        }}
                    >
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
                    return(
                    <div
                        className={styles.button_container_inner}
                        key={index}
                    >
                        {selectorData[1][0]}
                        {selectorData[1][1]}

                    </div>
                    )
                })
            }


        </div>

    </div>
    
    </>
    )
}

