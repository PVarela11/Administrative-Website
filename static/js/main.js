$(document).ready(function() {
    const modal = document.getElementById("myModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const modalFormContainer = document.getElementById("modalFormContainer");
    const url = $("#createUrl").attr("data-url");

    openModalBtn.addEventListener("click", function() {
        fetchFormHtml(url);
    });

    // Fetch the form HTML using AJAX
    function fetchFormHtml(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                modalFormContainer.innerHTML = html;
                modal.style.display = "block";
            });
    }

    // Close the modal when the user clicks outside of it
    $(window).click(function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});

//Modal Code
/*document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("myModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const modalFormContainer = document.getElementById("modalFormContainer");
    var url = $("#createUrl").attr("data-url")
    
    openModalBtn.addEventListener("click", function() {
        // Fetch the form HTML using AJAX
        fetch(url)
            .then(response => response.text())
            .then(html => {
                modalFormContainer.innerHTML = html;
                modal.style.display = "block";
            });
    });

    // Close the modal when the user clicks outside of it
    window.addEventListener("click", function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
});*/



//Table Row Click Code
$(document).ready(function () {
    $(document.body).on("click", "tr[data-href]", function () {
        window.location.href = this.dataset.href;
    });
});
