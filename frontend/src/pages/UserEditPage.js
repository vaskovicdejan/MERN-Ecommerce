import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditPage = ({ match, history }) => {
	const userId = match.params.id;
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails);
	const { loading, user, error } = userDetails;

	const userUpdate = useSelector((state) => state.userUpdate);
	const {
		loading: loadingUpdate,
		error: errorUpdate,
		success: successUpdate,
	} = userUpdate;

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: USER_UPDATE_RESET });
			history.push('/admin/userlist');
		} else {
			if (!user || !user.name || user._id !== userId) {
				dispatch(getUserDetails(userId));
			} else {
				setName(user.name);
				setEmail(user.email);
				setIsAdmin(user.isAdmin);
			}
		}
	}, [user, dispatch, userId, successUpdate, history]);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(updateUser({ _id: userId, name, email, isAdmin }));
	};

	return (
		<>
			<Link to='/admin/userlist'>
				<Button variant='light' className='my-3'>
					Go Back
				</Button>
			</Link>
			<FormContainer>
				<h1>Edit User</h1>
				{loadingUpdate ? (
					<Loader />
				) : errorUpdate ? (
					<Message variant='danger'>{errorUpdate}</Message>
				) : (
					<>
						{loading ? (
							<Loader />
						) : (
							<Form onSubmit={handleSubmit}>
								{error && (
									<Message variant='danger'>{error}</Message>
								)}

								<Form.Group controlId='name' className='mb-2'>
									<Form.Label>Name</Form.Label>
									<Form.Control
										size='lg'
										placeholder='Enter Name'
										type='text'
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
									/>
								</Form.Group>
								<Form.Group controlId='email' className='my-2'>
									<Form.Label>Email Address</Form.Label>
									<Form.Control
										size='lg'
										placeholder='Enter Email Address'
										type='email'
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
									/>
								</Form.Group>
								<Form.Group
									controlId='isAdmin'
									className='my-2'>
									<InputGroup>
										<Form.Check
											type='checkbox'
											label='Is Admin'
											size='lg'
											style={{ borderRight: 'none' }}
											checked={isAdmin}
											onChange={(e) =>
												setIsAdmin(e.target.checked)
											}></Form.Check>
									</InputGroup>
								</Form.Group>
								<Button
									type='submit'
									variant='dark'
									className='my-1'>
									Edit
								</Button>
							</Form>
						)}
					</>
				)}
			</FormContainer>
		</>
	);
};

export default UserEditPage;
