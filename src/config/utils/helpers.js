const generateUniqueFileName = (prefix, originalFileName)=>{
    return prefix +'-'+ Date.now() + '-' + Math.round(Math.random() * 1E9)+'-'+originalFileName;
}

module.exports = {generateUniqueFileName};