import React, { useEffect, useState } from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import {
	brandData,
	coppyrightInfo,
	footerLinks,
	footerTitle,
	socialLinks,
} from '../../utils/variables';
import { v4 as uuidv4 } from 'uuid';
import VentusDev from '../../assets/icons/VentusDev';

const Footer = ({ setShowPopupPage, time }) => {

	const [mounted, setMounted] = useState(false)

	useEffect(()=>{
		setTimeout(()=>setMounted(true), time)
	})

	return (
		mounted && <div className='footer FIAnim' id='footer'>
			<div className='footerContent'>
				<div className='footerContentLeft'>
					<div className='footexSocials'>
					<VentusDev />
					<div className='flexRow socialsIconsBox'>
						<a className='animatedIcons' target='_blank' href={socialLinks.fb}>
							<img
								src={assets.facebook_icon}
								alt={`facebook ${brandData.name}`}
								height='30'
								width='30'
								loading='lazy'
							/>
						</a>
						<a className='animatedIcons' target='_blank' href={socialLinks.tw}>
							<img
								src={assets.twitter_icon}
								alt={`twitter ${brandData.name}`}
								height='30'
								width='30'
								loading='lazy'
							/>
						</a>
						<a className='animatedIcons' target='_blank' href={socialLinks.ln}>
							<img
								src={assets.linkedin_icon}
								alt={`linkedin ${brandData.name}`}
								height='30'
								width='30'
								loading='lazy'
							/>
						</a>
					</div>
					</div>
				</div>
				<div className='footerContentRight'>
					<h2>{brandData.name}</h2>
					<ul>
						{Object.entries(footerLinks).map(([item, i]) => (
							<li
								key={uuidv4()}
								onClick={() => {
									setShowPopupPage(item);
								}}
							>
								{footerLinks[item][0]}
							</li>
						))}
					</ul>
				</div>
				<div className='footerContentRight'>
					<h2>{footerTitle}</h2>
					<ul>
						<li>
							<a>{brandData.number}</a>
						</li>
						<li>
							<a href={`mailto:${brandData.mail}`}>{brandData.mail}</a>
						</li>
					</ul>
				</div>
			</div>
			<hr />
			<p className='footerCopyright'>{coppyrightInfo}</p>
		</div>
	);
};

export default Footer;
