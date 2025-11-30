document.addEventListener('DOMContentLoaded', function () {

    if (document.getElementById('addPost')) {
        setupAddPostForm();
    }
    if (document.getElementById('editPost')) {
        setupEditUserForm();
    }

    setupDeleteButtons();

});

function setupAddPostForm() {
    document.getElementById('addPost').addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = {
            author: document.getElementById('author').value,
            title: document.getElementById('title').value,
            postText: document.getElementById('postText').value
            
        };
        // change button text to indicate loading
        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Adding...';
        submitBtn.disabled = true;

        try {
            const response = await fetch('/admin/posts/storePost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // Indicate it's an AJAX request
                },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            const messageDiv = document.getElementById('message');
            if (result.success) {
                showMessage(result.message, 'success');
                // نفضي الفورم إذا نجح
                document.getElementById('addPost').reset();
            } else {
                showMessage(result.message, 'error');
            }

        } catch (error) {
            showMessage('❌ Network error: ' + error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function setupEditUserForm() {
    document.getElementById('editPost').addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const editForm = document.getElementById('editPost');
        const postId = editForm.dataset.postId;

        const submitBtn = document.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Updating...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            const response = await fetch(`/admin/posts/updatePost/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // Indicate it's an AJAX request
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                showMessage('✅ Post updated successfully!', 'success');
                // ممكن تضيف redirect بعد نجاح التعديل إذا بدك
                // setTimeout(() => window.location.href = '/admin/allusers', 2000);
            } else {
                showMessage('❌ ' + result.message, 'error');
            }
        } catch (error) {
            showMessage('❌ Network error: ' + error.message, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }


    });
}
function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-post-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const postId = this.dataset.postId;
            const title = this.dataset.title || 'this post';
            handleDeletePost(postId, title, this);
        });
    });
}
async function handleDeletePost(postId, title, button) {
    // استخدام SweetAlert2 للتأكيد
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete ${title}. This action cannot be undone!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-secondary'
        }
    });

    // إذا المستخدم ضغط Cancel
    if (!result.isConfirmed) {
        return;
    }

    const originalText = button.textContent;
    button.textContent = 'Deleting...';
    button.disabled = true;

    try {
        const response = await fetch(`/admin/posts/deletePost/${postId}`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const data = await response.json();

        if (data.success) {
            // رسالة نجاح بـ SweetAlert2
            await Swal.fire({
                title: 'Deleted!',
                text: 'Post has been deleted successfully.',
                icon: 'success',
                confirmButtonColor: '#3085d6',
                timer: 2000,
                timerProgressBar: true
            });

            // إزالة الصف من الجدول
            const userRow = button.closest('tr');
            if (userRow) {
                userRow.style.opacity = '0';
                setTimeout(() => userRow.remove(), 300);
            }
        } else {
            await Swal.fire({
                title: 'Error!',
                text: data.message,
                icon: 'error',
                confirmButtonColor: '#d33'
            });
            button.textContent = originalText;
            button.disabled = false;
        }
    } catch (error) {
        await Swal.fire({
            title: 'Network Error!',
            text: 'Failed to delete Post. Please try again.',
            icon: 'error',
            confirmButtonColor: '#d33'
        });
        button.textContent = originalText;
        button.disabled = false;
    }
}
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');

    // نحدد لون الرسالة حسب النوع
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';

    messageDiv.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // إخفاء الرسالة بعد 3 ثواني
    setTimeout(() => {
        const alert = messageDiv.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 3000);
}