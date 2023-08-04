$(document).ready(function() {
    const createUserBtn = document.getElementById("createUserBtn");
    const createUrl = $("#createUrl").attr("data-url");
    console.log("OI");
    console.log(createUrl);
    //Listeners
    //createUserBtn.addEventListener("click", function() {
    //    fetchFormHtml(createUrl);
    //    currentSection=0;
    //});
    createUserBtn.onclick = function() {
        window.location.href = createUrl;
    };

});
