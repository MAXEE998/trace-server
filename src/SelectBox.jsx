import React from 'react';

export const SelectBox = (props) => {
    const {selected, setSelected, values, title, isValid} = props;

    const handleChange = (event) => {
        setSelected(event.target.value);
    }

    return (
        <div>
            <span><strong>
                {!isValid && <a style={{color:"red"}}>* </a>}
                {title + ": "}
            </strong></span>
            <div>
            <select value={selected} onChange={handleChange}>
                {values.map(v => <option value={v}>{v}</option>)}
            </select>
            </div>
        </div>
    );
};