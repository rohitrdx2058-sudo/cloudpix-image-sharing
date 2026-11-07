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
uploadForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    if (selectedImages.length === 0) {
        message.textContent = "Please select an image first!";
        message.style.color = "red";
        return;
    }

    const formData = new FormData();

    selectedImages.forEach(file => {
        formData.append("images", file);
    });

    message.textContent = "Uploading images...";
    message.style.color = "blue";

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Upload failed");
        }

        message.textContent = result.message;
        message.style.color = "green";

    } catch (error) {
        message.textContent = error.message;
        message.style.color = "red";
    }
});


// Load images from AWS S3
async function loadGallery() {
    const gallery = document.getElementById('gallery');

    try {
        const response = await fetch('/images');
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Gallery loading failed');
        }

        gallery.innerHTML = '';

        if (result.images.length === 0) {
            gallery.innerHTML = '<p>No images uploaded yet.</p>';
            return;
        }

        result.images.forEach(image => {
            const card = document.createElement('div');
            card.className = 'image-card';

            const img = document.createElement('img');
            img.src = image.url;
            img.alt = image.key;
            img.style.width = '100%';

            const name = document.createElement('p');
            name.textContent = image.key;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete-button';

            deleteBtn.addEventListener('click', async () => {
                if (!confirm('Are you sure you want to delete this image?')) return;

                deleteBtn.disabled = true;
                deleteBtn.textContent = 'Deleting...';

                try {
                    const response = await fetch(
                        `/delete/${encodeURIComponent(image.key)}`,
                        { method: 'DELETE' }
                    );

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.error || 'Delete failed');
                    }

                    card.remove();

                    if (!gallery.querySelector('.image-card')) {
                        gallery.innerHTML = '<p>No images uploaded yet.</p>';
                    }

                } catch (error) {
                    alert(error.message);
                    deleteBtn.disabled = false;
                    deleteBtn.textContent = 'Delete';
                }
            });

            card.appendChild(img);
            card.appendChild(name);
            const shareBtn = document.createElement('button');
            shareBtn.type = 'button';
            shareBtn.className = 'share-button';
            shareBtn.textContent = 'Share';

            shareBtn.addEventListener('click', async () => {
                try {
                    const shareData = {
                        title: 'CloudPix Image',
                        text: 'Check out this image!',
                        url: image.url
                    };

                    if (navigator.share) {
                        await navigator.share(shareData);
                    } else {
                        window.prompt('Copy this image link:', image.url);
                    }
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        alert('Could not share image.');
                    }
                }
            });

            card.appendChild(shareBtn);
            card.appendChild(deleteBtn);
            gallery.appendChild(card);
        });

    } catch (error) {
        console.error('Gallery error:', error);
        gallery.innerHTML = '<p>Could not load images.</p>';
    }
}

document.addEventListener('DOMContentLoaded', loadGallery);
