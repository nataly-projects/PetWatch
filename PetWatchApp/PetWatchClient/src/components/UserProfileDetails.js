import userDefaultImage from "../images/default-profile-image.jpg"; 
import '../styles/UserProfile.css';

const UserProfileDetails = ({ user }) => {

  return (
    <>
        <div className='user-header-container'>
            <h2>Hello {user.fullName}</h2>
            <div className="user-image-container">
                <img
                className="user-image"
                src={ user.imageUrl ? `http://localhost:3000/${user.imageUrl}` : userDefaultImage} 
                alt="User Profile" />
            </div>
        </div>
        <div className='details-container'>
            <p> <b>Full Name:</b> {user.fullName}</p>
            <p> <b>Email:</b> {user.email}</p>
            <p> <b>Phone:</b> {user.phone}</p>
        </div>
      </>
  );
};

export default UserProfileDetails;