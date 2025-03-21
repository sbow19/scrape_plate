import { useState } from 'react'
import * as styles from './AppDropdown.module.css'
import { AppButtonTemplate } from '../buttons/appButton'

export const AppDropdown = ({
    options,
    data,

})=>{

    const [selectedOption, setSelectedOption] = useState(options[0])

    const handleSelectChange = (e)=>{
        setSelectedOption(e.target.value);
    }


    return(<>
        <div
            className={styles.dropdown_container}
        >
            <select onChange={handleSelectChange} value={selectedOption}>
                {
                    options.map((option, index)=>{
                        return (
                            <option value={option} key={index}>{option}</option>
                        )
                    })
                }
            </select>
            <AppButtonTemplate
                onClick={()=>{
                    // IMPLEMENT: handler function to export data in specific format
                    console.log(data)
                }}
            >
                Export
            </AppButtonTemplate>
        </div>
    </>)
}
