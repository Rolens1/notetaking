document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Toggler for Mobile ---
    const navbarToggler = document.getElementById('navbarToggler');
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarToggler && navbarNav) {
        navbarToggler.addEventListener('click', () => {
            navbarNav.classList.toggle('active');
        });
    }
    // --- Sidebar Note Form Toggle ---
    const newNoteBtn = document.getElementById('new-note-btn');
    const noteForm = document.getElementById('note-form');

    if (newNoteBtn && noteForm) {
        newNoteBtn.addEventListener('click', () => {
            noteForm.classList.toggle('active');
            const isActive = noteForm.classList.contains('active');

            newNoteBtn.innerHTML = isActive ? '<i class="fas fa-times"></i> Cancel' : '<i class="fas fa-plus"></i> Add a New Note';
            if (isActive) {
                document.getElementById('title').focus();
            }
        });
    }
    // --- Note Creation ---
    document.getElementById('note-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        initalBtn = submitBtn
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        try {
            const formData = new FormData(e.target);
            const formValues = Object.fromEntries(formData.entries());
            const response = await fetch('/api/create/note', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues),
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Error while creating');
            alert('Note created!');
            window.location.reload(); // Keeping your original reload logic
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            submitBtn = initalBtn
            submitBtn.disabled = false
        }
    });
    // --- Note Actions (Edit and Delete) (Your original logic) ---
    const allNotesContainer = document.getElementById('all-notes');
    if (allNotesContainer) {
        allNotesContainer.addEventListener('click', async (e) => {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');
            // --- Edit Button Handling (Your original logic) ---
            if (editBtn) {
                const noteId = editBtn.dataset.id;
                const noteCard = editBtn.closest('.note-card');
               
                try {
                    // On récupère les données brutes de la note (cette partie est déjà correcte)
                    const response = await fetch(`/api/note/${noteId}`);
                    if (!response.ok) {
                        throw new Error('Could not load note details to edit.');
                    }
                    const noteData = await response.json();
                    const rawNoteContent = noteData.content;
                    const noteTitle = noteData.title;
                    const currentCategory = noteData.category
                    const categorySelect = document.getElementById('note-category').cloneNode(true);
                    const newOption = categorySelect.querySelector('option[value="new"]');
                    if (newOption) newOption.remove();
                    categorySelect.value = currentCategory;
                    console.log(categorySelect.value)
                
                    noteCard.setAttribute('draggable', 'false');
                    noteCard.style.cursor = 'default';
            
                    noteCard.innerHTML = `
                        <form class="edit-form">
                            <div class="form-group">
                                <label>Title</label>
                                <input type="text" name="title" value="${noteTitle}" required>
                            </div>
                            <div class="form-group">
                                <label>Content</label>
                                <textarea name="content" required>${rawNoteContent}</textarea>
                            </div>
                            <div class="form-group">
                                <label>Category</label>
                                ${categorySelect.outerHTML}
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                                <button type="button" class="btn btn-cancel">Cancel</button>
                            </div>
                        </form>`;
                    const editForm = noteCard.querySelector('.edit-form');
                
                    editForm.addEventListener('submit', async (submitEvent) => {
                        submitEvent.preventDefault();
                        try {
                            const updatedNoteData = {
                                title: editForm.querySelector('[name="title"]').value,
                                content: editForm.querySelector('[name="content"]').value,
                                category: editForm.querySelector('[name="category"]').value
                            };
                            const saveResponse = await fetch(`/api/note/${noteId}/edit`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updatedNoteData),
                                credentials: 'include'
                            });
                            if (!saveResponse.ok) throw new Error('Error while updating');
                            alert('Note updated!');
                            window.location.reload();
                        } catch (error) {
                            alert(`Error: ${error.message}`);
                        }
                    });
                    editForm.querySelector('.btn-cancel').addEventListener('click', () => {
                        window.location.reload();
                    });
                } catch (error) {
                    alert(error.message);
                }
            }
            // --- Delete Button Handling (Your original logic) ---
            if (deleteBtn) {
                if (!confirm('Are you sure you want to delete the note?')) return;
                const noteId = deleteBtn.dataset.id;
                try {
                    const response = await fetch(`/api/note/${noteId}/delete`, {
                        method: 'POST',
                        credentials: 'include'
                    });
                    if (!response.ok) throw new Error('Error while deleting note');
                    alert('Note deleted successfully!');
                    deleteBtn.closest('.note-card').remove();
                } catch (error) {
                    alert(`Error: ${error.message}`);
                }
            }
        });
    }


    // --- Category Creation Toggle (CRITICAL BUG FIXED) ---
    document.getElementById('note-category')?.addEventListener('change', function() {
        const newCategoryInput = document.getElementById('new-category-input');
        // This variable was causing the crash. It is not needed.
        // const newCategoryField = document.getElementById('new_category_name');
        if (this.value === 'new') {
            newCategoryInput.style.display = 'block';
            newCategoryInput.required = true;
        } else {
            newCategoryInput.style.display = 'none';
            newCategoryInput.required = false;
        }
    });

    // --- Filters ---
    function filterNotes() {
        const searchTerm = document.getElementById('search-notes').value.toLowerCase();
        const selectedCategory = document.getElementById('category-select').value;
        document.querySelectorAll('.note-card').forEach(card => {
            const matchesSearch = !searchTerm ||
                                  card.dataset.title.includes(searchTerm) ||
                                  card.dataset.content.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' ||
                                    card.dataset.category === selectedCategory;
            card.style.display = matchesSearch && matchesCategory ? 'flex' : 'none';
        });
    }
    document.getElementById('search-notes')?.addEventListener('input', filterNotes);
    document.getElementById('category-select')?.addEventListener('change', filterNotes);
    // --- Drag and Drop Functionality (Your original logic) ---
    const notes = document.querySelectorAll('.note-card');
    const billboard = document.getElementById('billboard');
    let draggedNote = null;
    let offsetX, offsetY;
    notes.forEach(note => {
        note.addEventListener('dragstart', (e) => {
            if (e.target.closest('form, button, a, input, textarea')) {
                e.preventDefault();
                return;
            }
            draggedNote = e.currentTarget;
            draggedNote.style.cursor = 'grabbing';
            const rect = draggedNote.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            setTimeout(() => {
                draggedNote.style.visibility = 'hidden';
            }, 0);
            e.dataTransfer.effectAllowed = 'move';
        });
        note.addEventListener('dragend', () => {
            if (draggedNote) {
                draggedNote.style.visibility = 'visible';
                draggedNote.style.cursor = 'grab';
                draggedNote = null;
            }
        });
    });
    if(billboard) {
        billboard.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        billboard.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedNote) {
                const billboardRect = billboard.getBoundingClientRect();
                let newX = e.clientX - billboardRect.left - offsetX;
                let newY = e.clientY - billboardRect.top - offsetY;
                if (newX < 0) newX = 0;
                if (newY < 0) newY = 0;
                if (newX + draggedNote.offsetWidth > billboard.clientWidth) newX = billboard.clientWidth - draggedNote.offsetWidth;
                if (newY + draggedNote.offsetHeight > billboard.clientHeight) newY = billboard.clientHeight - draggedNote.offsetHeight;
                draggedNote.style.position = 'absolute';
                draggedNote.style.left = `${newX}px`;
                draggedNote.style.top = `${newY}px`;

                const noteId = draggedNote.dataset.id;
                const positionData = {
                    positionX: `${newX}px`,
                    positionY: `${newY}px`
                };
                fetch(`/api/note/${noteId}/position`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(positionData),
                    credentials: 'include'
                }).then(response => {
                    if (!response.ok) console.error('Failed to save note position.');
                }).catch(error => console.error('Error:', error));
            }
        });
    }
    // -- Theme toggler
    const themeToggle = document.getElementById('themeToggle');
    const themeValueInput = document.getElementById('themeValue');
    if (themeToggle && themeValueInput) {
        themeToggle.addEventListener('change', () => {
            // Determine the new theme based on whether the box is checked
            const newTheme = themeToggle.checked ? 'dark' : 'light';

            // Apply the theme class to the body instantly for immediate visual feedback
            document.body.classList.toggle('dark-theme', themeToggle.checked);

            themeValueInput.value = newTheme;
        });


    }

    const animatedSections = document.querySelectorAll('.about-section');
    if (animatedSections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
             threshold: 0.1
        });
        animatedSections.forEach(section => {
            observer.observe(section);
        });
    }
});