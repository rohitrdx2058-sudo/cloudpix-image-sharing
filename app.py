from flask import Flask, render_template, request, jsonify
import boto3
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)

app.config["MAX_CONTENT_LENGTH"] = 25 * 1024 * 1024

BUCKET_NAME = "cloudpix-images-yourrandomnumber-699933108745-ap-southeast-2-an"

s3 = boto3.client(
    "s3",
    region_name="ap-southeast-2"
)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}

@app.route("/")
def home():
    return render_template("index.html")



@app.route('/images')
def list_images():
    try:
        response = s3.list_objects_v2(Bucket=BUCKET_NAME)
        images = []

        for obj in response.get('Contents', []):
            key = obj['Key']
            if key.rsplit('.', 1)[-1].lower() not in ALLOWED_EXTENSIONS:
                continue
            url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': BUCKET_NAME, 'Key': key},
                ExpiresIn=3600
            )
            images.append({'key': key, 'url': url})

        return jsonify({'images': images})

    except Exception as e:
        print("Gallery error:", e)
        return jsonify({'error': str(e)}), 500


@app.route('/delete/<path:key>', methods=['DELETE'])
def delete_image(key):
    try:
        key = secure_filename(key)

        if not key or key.rsplit('.', 1)[-1].lower() not in ALLOWED_EXTENSIONS:
            return jsonify({'error': 'Invalid image'}), 400

        s3.delete_object(
            Bucket=BUCKET_NAME,
            Key=key
        )

        return jsonify({'message': 'Image deleted successfully!'})

    except Exception as e:
        print('Delete error:', e)
        return jsonify({'error': 'Delete failed'}), 500


@app.route('/upload', methods=['POST'])
def upload():

    if "images" not in request.files:
        return jsonify({"error": "No images selected"}), 400

    files = request.files.getlist("images")
    uploaded = []

    for file in files:

        if not file.filename:
            continue

        filename = secure_filename(file.filename)

        if "." not in filename:
            continue

        extension = filename.rsplit(".", 1)[-1].lower()

        if extension not in ALLOWED_EXTENSIONS:
            continue

        unique_name = f"{uuid.uuid4().hex}.{extension}"

        try:
            s3.upload_fileobj(
                file,
                BUCKET_NAME,
                unique_name,
                ExtraArgs={
                    "ContentType": file.mimetype or "application/octet-stream"
                }
            )

            uploaded.append(unique_name)

        except Exception as e:
            print("Upload error:", e)
            return jsonify({"error": "Upload failed"}), 500

    if not uploaded:
        return jsonify({"error": "No valid images uploaded"}), 400

    return jsonify({
        "message": "Images uploaded successfully!",
        "files": uploaded
    })


if __name__ == "__main__":
    print("CloudPix is starting...")
    app.run(host="0.0.0.0", port=5000, debug=False)
