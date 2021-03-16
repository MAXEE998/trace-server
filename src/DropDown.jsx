import React from 'react';
import styles from './DropDown.module.css';

const DropDownItem = (props) => {
    return <a href="#">{props.node}</a>
}

export const DropDown = (props) => {
    const {nodes, value, setValue} = props;

    const handleChange = (event) => {
        setValue(event.target.value);
    }

    return (
        <div className={styles.dropdown}>
            <button className={styles.dropbtn}>Dropdown</button>
            <div className={styles.dropdown-content}>
                {nodes.map((node) =>
                    <DropDownItem node={node} />
                )}
            </div>
        </div>
    );
};