import React, { useEffect, useState } from 'react';
import { userOrdersUrl, myOrdersData, currency } from '@/utils/variables.jsx';
import { assets } from '@/assets/assets.js';
import axios from 'axios';
import Button from '@/components/Button/Button.jsx';
import toast from 'react-hot-toast';
import NetworkErrorText from '@/components/NetworkErrorText/NetworkErrorText.jsx';
import CodeVerifikator from '@/components/CodeVeryfikator/CodeVerifikator.jsx';
import { useAuthStore } from '@/store/authStore.js';

import Loader from '@/components/Loader/Loader';
import { v4 as uuidv4 } from 'uuid';
import Input from '../../../components/Input/Input';
import { Mail } from 'lucide-react';

import { formData, customErrors } from '../../LoginPages/loginVar';
import { convertDate } from '../../../utils/functions';
import './MyOrders.css';

const MyOrders = () => {
	const { error, isLoading, beUrl, netErr, isAuthenticated } = useAuthStore();

	const [data, setData] = useState([]);
	const [codeId, setCodeId] = useState(['', '', '', '', '', '']);
	const [email, setEmail] = useState('');

	const fetchOrders = async () => {
		const response = await axios.post(beUrl + userOrdersUrl, {
			codeId: codeId.join(''),
			email: email,
		});

		if (response?.data.data) {
			setData(response.data.data.reverse());
		}
		return response;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = codeId.join('');

		if (verificationCode && email) {
			try {
				const respone = await fetchOrders();
				if (respone.data.success) {
					toast.success(respone.data.message);
				} else {
					toast.error(respone.data.message);
				}
			} catch (error) {
				console.log(error);
				toast.error(customErrors.invalidCredentials);
			}
		} else {
			toast.error(customErrors.emptyFields);
		}
	};

	useEffect(() => {
		fetchOrders();

		if (codeId.every((digit) => digit !== '')) {
			handleSubmit(new Event('submit'));
		}
	}, [codeId]);
	let btn = 0;
	let countBtn = 2;

	return (
		<div className='myOrders'>
			{netErr && <NetworkErrorText />}

			{!data?.length ? (
				isAuthenticated ? (
					<Loader />
				) : (
					<div>
					<h6 className='title textTogradient'>{formData.emailVerifyPlaceholder}</h6>
						<Input
							icon={Mail}
							type='email'
							placeholder={formData.emailPlaceholder}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<CodeVerifikator
							handleSubmit={handleSubmit}
							title={
								'wprowadź kod z maila, żeby potwierdzić złożone zamówienie'
							}
							isLoading={isLoading}
							error={error}
							code={codeId}
							setCode={setCodeId}
						/>
					</div>
				)
			) : (
				<>
					<h2>{myOrdersData.title}</h2>
					<h4>
						{myOrdersData.quantity}: {data.length}
					</h4>
					<div className='container'>
						<div className={`myOrdersOrder`}>
							<b>{myOrdersData.iconTitle}</b>
							<b>{myOrdersData.orderTitle}</b>
							<b>{myOrdersData.priceTitle}</b>
							<b>{myOrdersData.quantityTitle}</b>
							<b>{myOrdersData.statusTitle}</b>
							<b>{myOrdersData.refreshTitle}</b>
						</div>
						{data.map((item, i) => {
							if (btn > countBtn - 2) {
								btn = 0;
							} else {
								btn++;
							}
							return (
								<div key={uuidv4()} className='myOrdersOrder'>
									<img src={assets.parcel_icon} alt='' className='myOrderImg' />
									<p>
										{item.items.map((it, x) => {
											if (x === item.items.length - 1) {
												return it.name + ' x ' + it.quantity;
											} else {
												return it.name + ' x ' + it.quantity + ', ';
											}
										})}
									</p>
									<div>
										<span className='featuredText'>
											{item.amount.toFixed(2)} {currency}
										</span>
										<span>
											{item.rabat > 0
												? '( -' + Math.floor(item.rabat * 100) + '% )'
												: ''}
										</span>
									</div>
									<span>{item.items.length}</span>
									<div>
										<p className='myOrdersDate'>{convertDate(item.date)}</p>
										<p>
											<b className='featuredText'>{item.status}</b>
										</p>
									</div>
									<Button
										allHeightWidth={'80px'}
										icon={assets.refresh_icon}
										color={btn}
										onClick={() => {
											fetchOrders(), toast.success(myOrdersData.refreshInfo);
										}}
									/>
								</div>
							);
						})}
					</div>
				</>
			)}
		</div>
	);
};

export default MyOrders;
