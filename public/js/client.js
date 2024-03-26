const deleteBtn = document.querySelectorAll('#delete')

Array.from(deleteBtn).forEach(btn => {
    btn.addEventListener('click', markComplete)
})

async function markComplete () {
    const task = this.parentNode.childNodes[1].innerText

    try {
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                taskToBeCompleted: task
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.error(err)
    }
}