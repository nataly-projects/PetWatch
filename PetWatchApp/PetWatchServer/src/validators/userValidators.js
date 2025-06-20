function validatePhone(phone) {
    return /^\d{10}$/.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return true;
}

module.exports = {
    validateEmail,
    validatePhone,
    validatePassword
};