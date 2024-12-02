import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { customInfo } from '@/utils/variables';
import React from 'react';
import Button from '@/components/Button/Button';
import { useAdminStore } from '@/store/adminStore';
import toast from 'react-hot-toast';
import AppDesc from '@/dashComponents/AppDesc/AppDesc';
import './NotAdminPage.scss';

const NotAdminPage = () => {
	const { user, logout } = useAuthStore();
	const { addPermissions } = useAdminStore();
	const navigate = useNavigate();

	const handleLogout = () => {
		if (user) {
			logout();
			navigate('/');
		} else {
			navigate('/signup');
		}
	};

	const handlePermissions = async () => {
		try {
			const response = await addPermissions(user.email);

			if (response.data.success) {
				toast.success(customInfo.reqSentSuccess);
				console.log(response.data.message);
			}
		} catch (error) {
			toast.error(response.data.message);
			console.log(error);
		}
	};

	return (
		<>
			<div className='cardContent'>
				<div className='formBox'>
					<h2 className='title textTogradient'>Cześć {user?.name}</h2>
					{user?.isAdmin ? (
						<>
							<p>siemanko {user.name}!</p>
							<Button
								onClick={handleLogout}
								text={'wyloguj'}
								color='0'
								width={'200px'}
							/>
						</>
					) : (
						<>
							<p className='textTogradient'>{customInfo.needPermissions}</p>
							<br />

							<span className='textTogradient'>
								{user ? 'wyślij prośbę o ich przyznanie:' : 'ale przed tym:'}
							</span>
							{user && !user.isAdmin && (
								<Button
									text='chcę być adminem!'
									color='1'
									onClick={handlePermissions}
								/>
							)}
							<Button
								onClick={handleLogout}
								text={user ? 'wyloguj' : 'zarejestruj się'}
								color='0'
								width={user ? '200px' : '300px'}
							/>
						</>
					)}
				</div>
			</div>
			<AppDesc />
		</>
	);
};
export default NotAdminPage;
