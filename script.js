// Add this JavaScript to handle button clicks
document.addEventListener('DOMContentLoaded', () => {
  const editButtons = document.querySelectorAll('.edit-btn');
  const deleteButtons = document.querySelectorAll('.delete-btn');

  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Add your edit functionality here
      console.log('Edit clicked');
    });
  });

  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Add your delete functionality here
      console.log('Delete clicked');
    });
  });
}); 