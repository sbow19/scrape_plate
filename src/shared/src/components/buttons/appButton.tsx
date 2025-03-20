/**
 * Common app button
 */
import * as styles from './appButton.module.css'

export const AppButtonTemplate: React.FC<AppButtonProps> = ({
    onClick,
    children,
    textStyle,
    buttonStyle,
    title

})=>{
    return(
        <>
            <button
                className={styles.appButton_default}
                onClick={onClick}
                style={{
                    
                    ...buttonStyle
                }}
                title={title}
            >
                <div
                    className={styles.button_inner}
                    style={{
                        ...textStyle,
                    }}
                >

                    {children}
                </div>
            </button>
        </>
    )
}