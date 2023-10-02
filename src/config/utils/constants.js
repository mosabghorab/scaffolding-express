const SERVER_URL = 'http://localhost:3000/';

const CATEGORIES_UPLOADS_URL = SERVER_URL + 'uploads/categories/';
const PRODUCTS_UPLOADS_URL = SERVER_URL + 'uploads/products/';

const CATEGORIES_UPLOADS_PATH = './public/uploads/categories/';
const PRODUCTS_UPLOADS_PATH = './public/uploads/products/';

const CATEGORIES_UPLOADS_PREFIX = 'category';
const PRODUCTS_UPLOADS_PREFIX = 'product';


module.exports = {
    SERVER_URL,
    CATEGORIES_UPLOADS_PREFIX,
    PRODUCTS_UPLOADS_PREFIX,
    CATEGORIES_UPLOADS_PATH,
    PRODUCTS_UPLOADS_PATH,
    CATEGORIES_UPLOADS_URL,
    PRODUCTS_UPLOADS_URL,
};