function Requester(type, url, body = null, credenitals = false) {
    const request = new XMLHttpRequest();

    request.open(type, url, false); // false makes the request synchronous
    function getCookie(name) {
        if (!document.cookie) {
            return null;
        }

        const xsrfCookies = document.cookie.split(';')
            .map(c => c.trim())
            .filter(c => c.startsWith(name + '='));

        if (xsrfCookies.length === 0) {
            return null;
        }
        return decodeURIComponent(xsrfCookies[0].split('=')[1]);
    }

    let token = getCookie('csrftoken');
    console.log(token);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('X-CSRFToken', token);
    request.withCredentials = credenitals;
    request.send(body);
    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        console.log(JSON.parse(request.responseText));
    }
}

export default Requester;