document.addEventListener('DOMContentLoaded', () => {
    const notificationBell = document.getElementById('notification-bell');
    const notificationModal = document.getElementById('notification-modal');
    const closeModalButton = document.getElementById('close-modal');
    const notificationList = document.getElementById('notification-list');
    const clearButton = document.getElementById('clear-notifications');
    const notificationCount = document.getElementById('notification-count');
    const postForm = document.getElementById('create-post-form');
    const taskForm = document.getElementById('create-task-form');

    let isSubmitting = false;

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const socket = new WebSocket('ws://' + window.location.host + '/ws/notifications/');

    socket.onopen = () => console.log('WebSocket connected');
    socket.onmessage = (e) => {
        console.log('WebSocket message received:', e.data);
        try {
            const data = JSON.parse(e.data);
            const existingNotif = document.querySelector(`[data-id="${data.id}"]`);
            if (!existingNotif) {
                addNotification(data);
                updateNotificationCount();
            } else {
                console.log('Duplicate notification ignored:', data.id);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };
    socket.onclose = (e) => console.error('WebSocket closed unexpectedly:', e);
    socket.onerror = (e) => console.error('WebSocket error:', e);

    function updateNotificationCount(retryCount = 0) {
        const maxRetries = 3;
        fetch('/notifications/api/list/', {
            method: 'GET', headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log('Notification count data:', data);
                if (data.status === 'error') {
                    console.error('Error fetching notifications:', data.message);
                    notificationCount.textContent = '0';
                    notificationCount.style.display = 'none';
                    return;
                }
                const count = data.notifications.length;
                console.log('Setting notification count to:', count);
                notificationCount.textContent = count;
                notificationCount.style.display = count > 0 ? 'flex' : 'none';
            })
            .catch(error => {
                console.error('Error updating notification count:', error);
                if (retryCount < maxRetries) {
                    console.log(`Retrying updateNotificationCount (attempt ${retryCount + 1}/${maxRetries})`);
                    setTimeout(() => updateNotificationCount(retryCount + 1), 500);
                } else {
                    notificationCount.textContent = '0';
                    notificationCount.style.display = 'none';
                }
            });
    }

    function loadNotifications() {
        fetch('/notifications/api/list/', {
            method: 'GET', headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log('Notifications data:', data);
                if (data.status === 'error') {
                    console.error('Error fetching notifications:', data.message);
                    return;
                }
                notificationList.innerHTML = '';
                data.notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                data.notifications.forEach(notification => {
                    addNotification(notification);
                });
                updateNotificationCount();
            })
            .catch(error => console.error('Error fetching notifications:', error));
    }

    function addNotification(notification) {
        console.log('Adding notification:', notification);
        const typeStyles = {
            'blog': 'border-l-4 border-blue-500',
            'tasks': 'border-l-4 border-green-500',
            'comment': 'border-l-4 border-yellow-500',
            'like': 'border-l-4 border-red-500'
        };
        const style = typeStyles[notification.notification_type] || 'border-l-4 border-gray-500';
        const div = document.createElement('div');
        // div.className = `bg-white p-4 rounded shadow flex justify-between items-center ${style}`;
        div.dataset.id = notification.id;
        const maxLength = 100;
        let message = notification.message;
        if (message.length > maxLength) {
            message = message.substring(0, maxLength - 3) + '...';
        }
        div.innerHTML = `

               
                   <div class="list-group-item bg-transparent" >
                    <div class="row align-items-center">
                      <div class="col">
                        <small><strong class="account">${notification.title}</strong></small>
                        <div class="my-0 small account">${message}</div>
                        <small class="badge badge-pill badge-light text-muted">${new Date(notification.created_at).toLocaleString()}</small>
                      </div>
                    </div> 
                  <button data-id="${notification.id}" class="btn btn-sm btn-secondary mark-read">مشاهده شد</button>
            
                  </div>

        `;
        notificationList.append(div);
    }

    notificationBell.addEventListener('click', () => {
        console.log('Notification bell clicked');
        // notificationModal.classList.toggle('hidden');
        // notificationModal.classList.toggle('translate-x-full');
        // if (!notificationModal.classList.contains('hidden')) {
            loadNotifications();
        // }
    });

    closeModalButton.addEventListener('click', () => {
        console.log('Close modal clicked');
        notificationModal.classList.add('hidden', 'translate-x-full');
    });

    notificationList.addEventListener('click', (e) => {
        if (e.target.classList.contains('mark-read')) {
            const notifId = e.target.dataset.id;
            console.log('Marking notification as read:', notifId);
            fetch('/notifications/mark-read/', {
                method: 'POST', headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': getCookie('csrftoken')
                }, body: `notif_id=${notifId}`
            })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (data.status === 'success') {
                        console.log('Notification marked as read:', notifId);
                        e.target.parentElement.remove();
                        updateNotificationCount();
                    } else {
                        console.error('Error marking notification:', data.message);
                    }
                })
                .catch(error => console.error('Error marking notification as read:', error));
        }
    });

    clearButton.addEventListener('click', () => {
        console.log('Clear notifications clicked');
        fetch('/notifications/clear/', {
            method: 'POST', headers: {
                'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken': getCookie('csrftoken')
            }
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    console.log('Notifications cleared');
                    notificationList.innerHTML = '';
                    updateNotificationCount();
                } else {
                    console.error('Error clearing notifications:', data.message);
                }
            })
            .catch(error => console.error('Error clearing notifications:', error));
    });

    if (postForm) {
        postForm.removeEventListener('submit', handlePostFormSubmit);
        postForm.addEventListener('submit', handlePostFormSubmit);
    }

    function handlePostFormSubmit(e) {
        e.preventDefault();
        if (isSubmitting) {
            console.log('Form submission ignored (already submitting)');
            return;
        }
        isSubmitting = true;
        console.log('Submitting post form');
        const formData = new FormData(postForm);
        fetch('/blog/create/', {
            method: 'POST', body: formData, headers: {'X-CSRFToken': getCookie('csrftoken')}
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                isSubmitting = false;
                if (data.status === 'success') {
                    console.log('Post created successfully');
                    postForm.reset();
                    // alert('Post created successfully!');
                    updateNotificationCount();
                } else {
                    console.error('Error creating post:', data.message);
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                isSubmitting = false;
                console.error('Error creating post:', error);
            });
    }

    if (taskForm) {
        taskForm.removeEventListener('submit', handleTaskFormSubmit);
        taskForm.addEventListener('submit', handleTaskFormSubmit);
    }

    function handleTaskFormSubmit(e) {
        e.preventDefault();
        if (isSubmitting) {
            console.log('Form submission ignored (already submitting)');
            return;
        }
        isSubmitting = true;
        console.log('Submitting task form');
        const formData = new FormData(taskForm);
        fetch('/tasks/create/', {
            method: 'POST', body: formData, headers: {'X-CSRFToken': getCookie('csrftoken')}
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                isSubmitting = false;
                if (data.status === 'success') {
                    console.log('Task created successfully');
                    taskForm.reset();
                    // alert('Task created successfully!');
                    updateNotificationCount();
                } else {
                    console.error('Error creating task:', data.message);
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                isSubmitting = false;
                console.error('Error creating task:', error);
            });
    }

    setInterval(updateNotificationCount, 1000);
    updateNotificationCount();
});