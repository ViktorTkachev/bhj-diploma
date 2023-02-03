/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ( options = {} ) => {
  const xhr = new XMLHttpRequest();
  const {url, method, data, callback} = options;

  xhr.responseType = 'json';

  try {
    xhr.open( method, url );
    xhr.send( data );
  } catch ( e ) {
    callback( e );
    console.log(`ОШИБКА createRequest: ${e}`);
  }

  xhr.onload = () => callback(xhr.response.error, xhr.response);
};


// const formData = new FormData();
// formData.append('email', 'demo@demo');
// formData.append('password', 'demo');
// const options = {
//   url: '/user/login',
//   method: 'POST',
//   data: formData,
//   callback: (err, response) => {
//     if (response) {console.log(response)}
//     if (err){console.log(err)}
//   }
// }
// createRequest(options)
