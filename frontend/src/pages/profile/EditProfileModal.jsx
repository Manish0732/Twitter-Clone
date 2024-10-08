import { useEffect, useState } from "react";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		fullname: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const [showPassword, setShowPassword] = useState(false);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const { updateProfile, isUpdatingProfile } = useUpdateProfile()

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullname: authUser.fullname,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				currentPassword: "",
				newPassword: ""
			})
		}
	}, [authUser])


	const toggleShowPassword = () => {
		setShowPassword((prevState) => !prevState)
	}

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData)
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullname}
								name='fullname'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<label className='flex items-center input border border-gray-700 rounded px-3 input-md'>
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder='Current Password'
									value={formData.currentPassword}
									name='currentPassword'
									onChange={handleInputChange}
								/>
								{
									showPassword
										? <IoMdEyeOff className="ml-1 text-lg" onClick={toggleShowPassword} />
										: <IoMdEye className="ml-1 text-lg" onClick={toggleShowPassword} />
								}
							</label>
							<label className='flex items-center input border border-gray-700 rounded px-3 input-md'>
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder='New Password'
									value={formData.newPassword}
									name='newPassword'
									onChange={handleInputChange}
								/>
								{
									showPassword
										? <IoMdEyeOff className="ml-1 text-lg" onClick={toggleShowPassword} />
										: <IoMdEye className="ml-1 text-lg" onClick={toggleShowPassword} />
								}
							</label>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile ? 'Updating...' : 'Update'}
						</button>
					</form>
				</div >
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog >
		</>
	);
};
export default EditProfileModal;