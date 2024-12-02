import './Input.css';

const Input = ({ icon: Icon, errorMess, ...props }) => {
	return (
		<div className='inputErrorsBox'>
			<div className='inputBox'>
				<div className='iconBox'>
					{Icon ? <Icon className='icon' /> : <></>}
				</div>
				<input {...props} className='input' />
			</div>
			{errorMess && <p className='textError'>{errorMess}</p>}
		</div>
	);
};
export default Input;
