Parse.initialize("9nPPbQxM1lKkfOOSiJWDiVhP1Ze6leFgeKNxWvTz", "3212hWENS0Iv0CHmFgZh4gfgP9s3vJnLeRsHVbPN");
var currentUser = Parse.User.current();
var managerString = "manager";
var userName = currentUser['attributes']['username'];
console.log(userName);
if (userName.indexOf(managerString) >= 0) {

} else {
    window.location.href = "../index.html";
}