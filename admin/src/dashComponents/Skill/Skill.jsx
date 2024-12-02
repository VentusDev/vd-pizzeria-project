import React from 'react';
import './Skill.scss';
import RangeInput from '../RangeInput/RangeInput';

const Skill = () => {
	const skills = [
		{
			name: 'JavaScript',
			color: '#DAE438',
			icon: 'fa-js',
			desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, impedit?',
			lvl: 80,
		},
		{
			name: 'React JS',
			color: '#00d8ff',
			icon: 'fa-react',
			desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, impedit?',
			lvl: 80,
		},
		{
			name: 'HTML 5',
			color: '#dd2625',
			icon: 'fa-html5',
			desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, impedit?',
			lvl: 100,
		},
		{
			name: 'CSS 3',
			color: '#8adacb',
			icon: 'fa-css3',
			desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, impedit?',
			lvl: 80,
		},
		{
			name: 'MongoDB',
			color: '#28ab3f',
			icon: 'fa-solid fa-database',
			desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, impedit?',
			lvl: 50,
		},
		{
			name: 'GIT',
			color: '#ea8c36',
			icon: 'fa-git',
			desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, impedit?',
			lvl: 50,
		},
	];
	return (
		<div className='skills'>
			<h1>Umiejętności</h1>
			<ul>
				{skills.sort((a,b)=>b.lvl - a.lvl).map((item) => (
					<li style={{ '--accent-color': item.color }}>
						<RangeInput offset={item.lvl} />
						<div className='icon'>
							<i className={`fa-brands ${item.icon}`}></i>
						</div>
						<div className='title'>{item.name}</div>
						{/* <div className='descr'>{item.desc}</div> */}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Skill;
