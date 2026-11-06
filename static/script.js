// Get HTML elements
const imageInput = document.getElementById("imageInput");
const uploadForm = document.getElementById("uploadForm");
const fileName = document.getElementById("fileName");
const gallery = document.getElementById("gallery");
const message = document.getElementById("message");

let selectedImages = [];

// Select images
imageInput.addEventListener("change", function () {

    selectedImages = Array.from(this.files);

        gallery.innerHTML = "";
            message.textContent = "";

                if (selectedImages.length === 0) {
                        fileName.textContent = "No image selected";
                                return;
                                    }

                                        fileName.textContent =
                                                selectedImages.length + " image(s) selected";

                                                    selectedImages.forEach(function (file) {

                                                            // Check image format
                                                                    const allowedTypes = [
                                                                                "image/jpeg",
                                                                                            "image/png",
                                                                                                        "image/webp"
                                                                                                                ];

                                                                                                                        if (!allowedTypes.includes(file.type)) {
                                                                                                                                    message.textContent = "Invalid image format!";
                                                                                                                                                message.style.color = "red";
                                                                                                                                                            return;
                                                                                                                                                                    }

                                                                                                                                                                            // Check file size
                                                                                                                                                                                    if (file.size > 5 * 1024 * 1024) {
                                                                                                                                                                                                message.textContent =
                                                                                                                                                                                                                file.name + " exceeds 5 MB!";
                                                                                                                                                                                                                            message.style.color = "red";
                                                                                                                                                                                                                                        return;
                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                        // Create image preview
                                                                                                                                                                                                                                                                const reader = new FileReader();

                                                                                                                                                                                                                                                                        reader.onload = function (event) {

                                                                                                                                                                                                                                                                                    const card = document.createElement("div");
                                                                                                                                                                                                                                                                                                card.className = "image-card";

                                                                                                                                                                                                                                                                                                            const img = document.createElement("img");
                                                                                                                                                                                                                                                                                                                        img.src = event.target.result;

                                                                                                                                                                                                                                                                                                                                    img.style.width = "100%";
                                                                                                                                                                                                                                                                                                                                                img.style.height = "180px";
                                                                                                                                                                                                                                                                                                                                                            img.style.objectFit = "cover";
                                                                                                                                                                                                                                                                                                                                                                        img.style.borderRadius = "10px";

                                                                                                                                                                                                                                                                                                                                                                                    const name = document.createElement("p");
                                                                                                                                                                                                                                                                                                                                                                                                name.textContent = file.name;

                                                                                                                                                                                                                                                                                                                                                                                                            card.appendChild(img);
                                                                                                                                                                                                                                                                                                                                                                                                                        card.appendChild(name);

                                                                                                                                                                                                                                                                                                                                                                                                                                    gallery.appendChild(card);
                                                                                                                                                                                                                                                                                                                                                                                                                                            };

                                                                                                                                                                                                                                                                                                                                                                                                                                                    reader.readAsDataURL(file);

                                                                                                                                                                                                                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                                                                                                                                                                                                                        // Upload button
                                                                                                                                                                                                                                                                                                                                                                                                                                                        uploadForm.addEventListener("submit", function (event) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                            event.preventDefault();

                                                                                                                                                                                                                                                                                                                                                                                                                                                                if (selectedImages.length === 0) {

                                                                                                                                                                                                                                                                                                                                                                                                                                                                        message.textContent = "Please select an image first!";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                message.style.color = "red";

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        return;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                message.textContent =
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "Image preview successful! Cloud upload will be enabled soon.";

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            message.style.color = "green";

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            });