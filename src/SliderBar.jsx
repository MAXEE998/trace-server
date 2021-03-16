import React from 'react';
import styles from './SliderBar.module.css';

export const SliderBar = (props) => {
    const {min, max, title, value, setValue, isValid} = props;

    const handleChange = (event) => {
        setValue(parseInt(event.target.value));
    }

    return (
        <div>
            <span> <strong>
                {!isValid && <a style={{color:"red"}}>* </a>}
                {title + ": "}
            </strong> </span>
            <div className={styles.slideContainer}>
                <input type="range"
                       min={min}
                       max={max}
                       value={value}
                       className={styles.slider}
                       id="myRange"
                       onChange={handleChange}
                />
            </div>

            <div className={styles.valueDisplay}>
                <input type="number"
                       value={value}
                       onChange={handleChange}
                       size={7}
                       min={min}
                       max={max}
                />
                <span>{`(${min} - ${max})`}</span>
            </div>
        </div>
    );
};