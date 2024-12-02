import React from 'react';
import './CustomSelect.css';

const CustomSelect = ({ onChange, value, options, def='', ...props }) => {
	return (
		<div className='select'>
			<select onChange={onChange} value={value} {...props}>
				{options.map((item, i) => {
					let val = item;
					let text = item;
					if(item.constructor === Object){
						 val = item.name;
						 text = item.name;
					}
					if(Array.isArray(item)){
						val = item[0];
						text = item[1]
					}
					
					return<option  key={i} value={val} disabled={val==def?true:false} selected={val==def?true:false}>
						{text}
					</option>
				})}
			</select>
		</div>
	);
};

export default CustomSelect;
