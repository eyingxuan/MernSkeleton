'use strict'

/**
 * Get unique error field name
 */
const getUniqueErrorMessage = (err) => {
    let output
    try {
        // console.log(err.message);
        // console.log(err.message.lastIndexOf('.$'));
        // console.log(err.message.lastIndexOf('_1'));
        let fieldName = err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'))
        // console.log(fieldName);
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists'
    } catch (ex) {
        output = 'Unique field already exists'
    }

    return output
}

/**
 * Get the error message from error object
 */
const getErrorMessage = (err) => {
    let message = ''

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err)
                break
            default:
                message = 'Something went wrong'
        }
    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message
        }
    }

    return message
}

export default {getErrorMessage}
