function validatePhone(phone) {
    if (!/^\d{10}$/.test(phone)) {
        throw new Error('Invalid phone number. Please enter a valid phone number.');
    }
    return true; 
}


function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email address. Please enter a valid email.');
    }
    return true;
}

module.exports = {
    validateEmail,
    validatePhone,
};