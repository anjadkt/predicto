
export const validateField = (name: string, value: string) => {
    let errorMsg = '';
    if (name === 'number') {
        if (!value) {
            errorMsg = 'Number is required';
        } else if (!/^\d{10}$/.test(value)) {
            errorMsg = 'Enter a valid number';
        } else if (value.length < 5) {
            errorMsg = 'Number is too short';
        } else if (value.length > 10) {
            errorMsg = 'Number is too long';
        }
    }
    if (name === 'password') {
        if (!value) {
            errorMsg = 'Password is required';
        } else if (value.length < 6) {
            errorMsg = 'Password must be at least 6 characters';
        }
    }
    if (name === 'name') {
        if (!value) {
            errorMsg = 'Name is required';
        } else if (value.trim().length < 3) {
            errorMsg = 'Name must be at least 3 characters';
        }
    }

    return errorMsg;
};