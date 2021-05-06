import React from 'react';

export const RadioOption = (props) => {
    const {options, selected, setSelected, title, isValid} = props;

    const handleChange = (event) => {
        setSelected(event.target.value);
    };

    return (
        <div onChange={handleChange}>
            <span><strong>
                {!isValid && <a style={{color:"red"}}>* </a>}
                {title + ": "}
            </strong></span>
            {Object.entries(options).map((item, id) => {
                    const [_, option] = item;
                    return (
                            <div key={id}>
                                <input type="radio" value={option} name="option" checked={option === selected}/>
                                <span>{" " + option.capitalize()}</span>
                            </div>
                    );
                }
            )}
        </div>
    );
};