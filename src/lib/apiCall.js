export const fetch = (URL,bodyObj) => {
    let url  = 'https://localhost:2930/api/';
    var authtoken = localStorage.getItem('authToken');
    return fetch(url+URL,{
        method:'POST',
        headers:{
            "content-type": "application/json; charset=utf-8",
            "Authorization":`Bearer ${authtoken}`,
            "web-lang": "en-US",              
        },
        body:JSON.stringify(bodyObj)
        })
}

