import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { customInfo } from './loginVar.js';
import CodeVerifikator from '@/components/CodeVeryfikator/CodeVerifikator.jsx';
import './LoginPages.scss';

const EmailVerificationPage = () => {
	const [codeId, setCodeId] = useState(['', '', '', '', '', '']);
	const navigate = useNavigate();

	const { error, isLoading, verifyEmail, user } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = codeId.join('');
		try {
			const response = await verifyEmail(verificationCode);
			console.log(response);
			
			if(response.data.success){
				toast.success(customInfo.emailVerified);
				setTimeout(navigate('/'),2000)
			}else{

			}

		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if(user?.isVerified){
			navigate('/')
		}
		if (codeId.every((digit) => digit !== '')) {
			handleSubmit(new Event('submit'));
		}
	}, [codeId]);

	return (
		<CodeVerifikator
			handleSubmit={handleSubmit}
			title={'wprowadź kod z maila, żeby potwierdzić dane'}
			isLoading={isLoading}
			error={error}
			code={codeId}
			setCode={setCodeId}
		/>
	);
};
export default EmailVerificationPage;
