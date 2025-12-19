const form = document.getElementById("uploadForm");
const statusEl = document.getElementById("status");
const uploadedListEl = document.getElementById("uploadedList");
const submitBtn = document.getElementById("submitBtn");

// Worker URL
const WORKER_URL = "https://nt-tutor-doc-uploader-6edc59fe5d93.herokuapp.com/upload-ducuments";
// const WORKER_URL = "http://127.0.0.1:8000/upload-ducuments";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Reset UI
  statusEl.className = "status loading";
  statusEl.textContent = "Uploading documents, please wait...";
  uploadedListEl.innerHTML = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading...";

  const formData = new FormData(form);

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${res.status}`);
    }

    const data = await res.json();

    if (data.status === "success") {
      statusEl.className = "status success";
      statusEl.textContent = "All documents uploaded successfully!";

      data.uploaded.forEach((file) => {
        const li = document.createElement("li");
        li.innerHTML = `
              <div>
                <span class="label">${file.field}</span>
                <br>
                <span class="filename">${file.saved_as}</span>
              </div>
              <span style="color: #10b981;">✓</span>
            `;
        uploadedListEl.appendChild(li);
      });

      form.reset();
    } else {
      throw new Error("Upload failed");
    }
  } catch (err) {
    statusEl.className = "status error";
    statusEl.textContent = `Upload failed: ${err.message}. Please try again.`;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Upload Documents";
  }
});
